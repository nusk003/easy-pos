import { MessageAuthor, Order } from '@hm/sdk';
import { toast } from '@src/components/atoms';
import { __electron__, __lyd_base__ } from '@src/constants';
import {
  usePointsOfInterestStore,
  usePricelistStore,
  useStore,
} from '@src/store';
import { useOnlineStatus } from '@src/util/websockets';
import { sdk } from '@src/xhr/graphql-request';
import {
  swrListeners,
  useAttraction,
  useUnreadThreadCount,
} from '@src/xhr/query';
import { useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { v4 as uuid } from 'uuid';
import { PongResponse, WebSocketSDK } from './websocket.sdk';

declare const window: any;

const SHORT_RECONNECT_TIMEOUT = 10000;
const LONG_RECONNECT_TIMEOUT = 30000;
const PING_RATE = process.env.REACT_APP_STAGE === 'development' ? 1000 : 20000;

let reconnectAttempts = 0;

export const useWebsockets = () => {
  const history = useHistory();

  const {
    searchResultsAttractionCategories,
    setSearchResultsAttractionCategories,
    setShowGeneratePlaceResultsModal,
  } = usePointsOfInterestStore(
    useCallback(
      (state) => ({
        searchResultsAttractionCategories:
          state.searchResultsAttractionCategories,
        setShowGeneratePlaceResultsModal:
          state.setShowGeneratePlaceResultsModal,
        setSearchResultsAttractionCategories:
          state.setSearchResultsAttractionCategories,
      }),
      []
    )
  );

  const { mutate: mutateUnreadThreadCount } = useUnreadThreadCount(false);
  const { mutate: mutateAttraction } = useAttraction(false);

  const { hotelId, WSStatus, setWSStatus, setWS, loggedIn } = useStore(
    useCallback(
      (state) => ({
        hotelId: state.hotelId,
        setWSStatus: state.setWSStatus,
        setWS: state.setWS,
        WSStatus: state.WSStatus,
        loggedIn: state.loggedIn,
      }),
      []
    )
  );

  const { printers, addPrinterQueueJob } = usePricelistStore(
    useCallback(
      (state) => ({
        printers: state.printers,
        addPrinterQueueJob: state.addPrinterQueueJob,
      }),
      []
    )
  );

  const [ws, setWs] = useState<WebSocketSDK>();

  const onlineStatus = useOnlineStatus();

  const connectToWS = useCallback(async () => {
    const { lydJWT, WSStatus } = useStore.getState();

    if (!lydJWT || WSStatus === 'open') {
      return;
    }

    reconnectAttempts += 1;

    setWs(
      new WebSocketSDK(`${__lyd_base__}/?Auth=${lydJWT}&hotel-id=${hotelId}`)
    );
  }, [hotelId]);

  useEffect(() => {
    const { WSStatus } = useStore.getState();

    if (onlineStatus) {
      if (WSStatus === 'closed') {
        connectToWS();
      }
    } else {
      useStore.getState().setWSStatus('closed');
    }
  }, [connectToWS, onlineStatus, loggedIn]);

  useEffect(() => {
    let reconnectInterval: NodeJS.Timeout;

    if (WSStatus === 'closed' && onlineStatus) {
      reconnectInterval = setInterval(() => {
        if (reconnectAttempts > 20) {
          clearInterval(reconnectInterval);
          reconnectInterval = setInterval(connectToWS, LONG_RECONNECT_TIMEOUT);
        }
        connectToWS();
      }, SHORT_RECONNECT_TIMEOUT);
    }

    return () => {
      clearInterval(reconnectInterval);
    };
  }, [WSStatus, connectToWS, onlineStatus]);

  useEffect(() => {
    if (!ws || ws.url.includes(hotelId) || ws.readyState == ws.CLOSED) {
      return;
    }

    const { lydJWT } = useStore.getState();

    ws?.close();

    setWs(
      new WebSocketSDK(`${__lyd_base__}/?Auth=${lydJWT}&hotel-id=${hotelId}`)
    );
  }, [hotelId, ws]);

  const wsReadyState = ws?.readyState;
  useEffect(() => {
    if (!ws || wsReadyState !== ws?.OPEN || !onlineStatus) {
      return setWSStatus('closed');
    }

    const pingTokenTimeouts: Record<string, NodeJS.Timeout> = {};

    const handlePong = (response: PongResponse) => {
      delete pingTokenTimeouts[response.token];
    };

    const pingInterval = setInterval(() => {
      const token = uuid();

      ws.ping(token);

      pingTokenTimeouts[token] = setTimeout(() => {
        if (pingTokenTimeouts[token]) {
          clearInterval(pingInterval);

          const WS = useStore.getState().WS;

          if (WS?.readyState !== WS?.OPEN) {
            setWSStatus('closed');
            connectToWS();
          }
        }
      }, PING_RATE + 10000);
    }, PING_RATE);

    ws.addPongListener(handlePong);

    return () => {
      if (ws) {
        ws.removePongListener(handlePong);
      }

      clearInterval(pingInterval);

      Object.values(pingTokenTimeouts).forEach((timeout) => {
        clearTimeout(timeout);
      });
    };
  }, [connectToWS, ws, wsReadyState, setWSStatus, onlineStatus]);

  useEffect(() => {
    if (ws && !onlineStatus) {
      ws?.close();
    }
  }, [onlineStatus, ws]);

  useEffect(() => {
    if (ws) {
      ws.onopen = () => {
        setWSStatus('open');
        reconnectAttempts = 0;
        setWS(ws);
      };

      ws.onNewMessage = (response) => {
        if (
          response.data.newThread &&
          response.data.message.author === MessageAuthor.Guest
        ) {
          mutateUnreadThreadCount((count) => (count ?? 0) + 1, false);
        }
      };

      ws.onGenerateAttractionPlaces = async () => {
        toast.info('Successfully generated points of interest', {
          autoClose: false,
          onClick: () => {
            setShowGeneratePlaceResultsModal(true);
            history.push('/points-of-interest');
          },
        });

        await mutateAttraction();
      };

      ws.onGenerateAttractionCategory = (response) => {
        const newSearchResultsAttractionCategories = [
          ...searchResultsAttractionCategories,
        ];
        newSearchResultsAttractionCategories.push(response.data);
        setSearchResultsAttractionCategories(
          newSearchResultsAttractionCategories
        );
      };

      ws.onHotelStream = (response) => {
        swrListeners.mutateCollection(response.data.entity);
      };

      ws.onNewOrder = async (response) => {
        if (!__electron__) {
          return;
        }

        const pricelistPrinters = printers[response.data.pricelist.id];

        if (!pricelistPrinters?.length) {
          return;
        }

        const { order } = await sdk.order({
          where: { id: response.data.id },
        });

        pricelistPrinters.forEach((printer) => {
          for (let idx = 0; idx < printer.copies; idx += 1) {
            addPrinterQueueJob(order as Order);
            window.native.print.order(order, printer);
          }
        });
      };

      ws.onerror = () => {
        ws.close();
      };

      ws.onclose = () => {
        setWSStatus('closed');
      };
    }
  }, [
    addPrinterQueueJob,
    history,
    mutateAttraction,
    mutateUnreadThreadCount,
    printers,
    searchResultsAttractionCategories,
    setSearchResultsAttractionCategories,
    setShowGeneratePlaceResultsModal,
    setWS,
    setWSStatus,
    ws,
  ]);

  return null;
};
