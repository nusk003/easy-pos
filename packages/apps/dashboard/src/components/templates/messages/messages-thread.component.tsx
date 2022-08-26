import { parseMessages, splitIntoLimit } from '@hm/messages';
import { Guest, Message, MessageAuthor, Thread } from '@hm/sdk';
import { messageNotification } from '@src/assets/sounds/message-notification.sound';
import { Button, Grid, Link, Text, toast } from '@src/components/atoms';
import {
  MessagesGuestSearch,
  MessagesSection,
  MessagesThreadsInput,
} from '@src/components/organisms';
import { theme } from '@src/components/theme';
import { useStore } from '@src/store';
import { format } from '@src/util/format';
import { useSpaceDetails } from '@src/util/spaces';
import { NewMessageResponse } from '@src/xhr';
import { sdk } from '@src/xhr/graphql-request';
import {
  useHotel,
  useMessages,
  useOrder,
  useThread,
  useUser,
} from '@src/xhr/query';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { IoCheckmarkCircleSharp } from 'react-icons/io5';
import { MdMoreVert } from 'react-icons/md';
import { useHistory, useLocation, useRouteMatch } from 'react-router-dom';
import { MoonLoader } from 'react-spinners';
import styled from 'styled-components';
import { v4 as uuid } from 'uuid';
import { MessagesGuestDetails } from './messages-guest-details.component';

const SWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  height: calc(100vh - 93px);

  ${theme.mediaQueries.tablet} {
    height: calc(100vh - 76.5px);
  }
`;

const SThreadWrapper = styled.div<{ detailsVisible: boolean }>`
  display: grid;
  grid-template-rows: max-content auto max-content;
  background: ${theme.colors.white};
  z-index: 1;
  width: ${(props) => (props.detailsVisible ? 'calc(100% - 320px)' : '100%')};
  transition: width 0.3s;
  height: inherit;

  ${theme.mediaQueries.laptop} {
    display: ${(props) => (props.detailsVisible ? 'none' : 'grid')};
  }
`;

const SHeader = styled.div<{ isDetailsVisible: boolean }>`
  display: grid;
  grid-auto-flow: column;
  justify-content: space-between;
  align-items: center;
  border-bottom: 0.5px solid #e8eaef;
  margin-right: -16px;
  padding-left: 16px;
  padding-right: ${(props) => (props.isDetailsVisible ? 16 : 32)}px;
  height: 50px;

  ${theme.mediaQueries.laptop} {
    padding-right: 16px;
    padding-left: 16px;
  }

  transition: padding-right 0.2s;
`;

const SMessagesSectionWrapper = styled.div`
  display: flex;
  flex-direction: column-reverse;
  margin-top: 16px;
  padding-right: 16px;
  margin-right: -16px;
  padding-left: 16px;
  overflow-y: scroll;

  scrollbar-width: thin;
  scrollbar-color: #bbb #fff;

  &::-webkit-scrollbar {
    width: 11px;
  }

  &::-webkit-scrollbar-track {
    background: #fff;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #bbb;
    border-radius: 6px;
    border: 3px solid #fff;
  }

  ${theme.mediaQueries.tablet} {
    padding-left: 16px;
  }
`;

const SHeaderNameText = styled(Text.Interactive)`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-right: 8px;
  font-weight: ${(props) => props.theme.fontWeights.semibold};
`;

const SResolveLink = styled(Link)`
  margin: 16px auto;
`;

const SMoonLoader = styled.div`
  display: grid;
  justify-content: center;
  margin: 16px 0;
`;

interface Props {
  onUpdateThreads: (message: Message) => void;
  onResolveThread: (threadId: string) => void;
}

export const MessagesThread: React.FC<Props> = ({
  onUpdateThreads,
  onResolveThread,
}) => {
  const { data: hotel } = useHotel();

  const { ws } = useStore(useCallback((state) => ({ ws: state.WS }), []));

  const history = useHistory();
  const location = useLocation<{ thread?: Thread }>();
  const route = useRouteMatch<{ threadId: string }>();
  const threadId = route.params?.threadId;

  const [guest, setGuest] = useState<Guest | undefined>(undefined);

  const { data: liveThread, mutate: mutateThread } = useThread(threadId);

  const thread = threadId
    ? liveThread || location.state?.thread
    : location.state?.thread;

  const limit = 30;

  const {
    data: liveMessages,
    size,
    setSize,
    mutate: mutateMessages,
    error,
  } = useMessages({ threadId, limit });
  const { data: user } = useUser(false);

  const messages = useMemo(() => {
    if (liveMessages) {
      return liveMessages;
    }

    if (thread?.lastMessage) {
      return [[thread!.lastMessage]] as Message[][];
    }

    return undefined;
  }, [liveMessages, thread]);

  const isEmpty = !messages || messages.length === 0;

  const isReachingEnd =
    isEmpty || (messages && messages?.[size - 1]?.length < limit);

  const isLoadingInitialMessages = !liveMessages && !error;

  const isLoadingMore =
    isLoadingInitialMessages ||
    (size > 0 && messages && typeof messages?.[size - 1] === 'undefined');

  const orderId = thread?.order?.id;

  const { data: order } = useOrder(orderId);

  const { pricelist } = useSpaceDetails({ pricelistId: order?.pricelist?.id });

  const [state, setState] = useState({
    isDetailsVisible: false,
    isThreadResolved: false,
  });
  const [messageStack, setMessageStack] = useState<
    Array<
      Omit<Message, 'thread'> & {
        token?: string;
        error?: boolean;
        thread?: Thread;
      }
    >
  >([]);

  useEffect(() => {
    if (messages) {
      setMessageStack([...messages.flat()]);
    }
  }, [messages]);

  useEffect(() => {
    setState((s) => ({
      ...s,
      isThreadResolved: !!thread?.resolved,
    }));
  }, [thread]);

  const updateSWRCache = useCallback(() => {
    mutateMessages(
      splitIntoLimit(messageStack as Array<Message>, limit),
      false
    );
    onUpdateThreads(messageStack?.[0] as Message);
  }, [messageStack, mutateMessages, onUpdateThreads]);

  const handleSendMessage = async (text: string) => {
    if (!messageStack || (!thread && !guest) || !user) {
      return false;
    }

    const messageId = uuid();

    const token = uuid();

    const messageThread = thread || {
      id: uuid(),
      guest: guest!,
      dateCreated: new Date(),
      dateUpdated: new Date(),
    };

    messageStack.unshift({
      id: messageId,
      thread: messageThread,
      text,
      dateCreated: new Date(),
      dateUpdated: new Date(),
      author: MessageAuthor.User,
      token,
      guest: (thread?.guest || guest) as Guest,
      user: user,
      error: true,
    });

    if (!ws || !ws.send || ws.readyState !== ws.OPEN) {
      return false;
    }

    ws.sendMessage({ text, threadId, orderId, token, guestId: guest?.id });

    setMessageStack([...messageStack]);

    if (!threadId) {
      history.push('messages', { thread: messageThread });
    }

    updateSWRCache();

    return true;
  };

  const handleIncomingMessage = useCallback(
    (response: NewMessageResponse) => {
      if (!thread || !user) {
        return;
      }

      if (!threadId) {
        history.push(`/messages/${response.data.thread.id}`, {
          thread: response.data.thread,
        });
      }

      if (
        response.data.thread.id === threadId &&
        response.data.message.author === MessageAuthor.User
      ) {
        const existingMessage = messageStack.find(
          (m) => m.token === response.token
        );

        if (existingMessage) {
          existingMessage.error = false;
          setMessageStack([...messageStack]);
          updateSWRCache();
        }

        if (!existingMessage) {
          messageNotification.play();
          messageStack.unshift({
            id: response.data.message.id,
            text: response.data.message.text,
            token: response.token,
            thread: thread,
            author: MessageAuthor.User,
            guest: thread.guest,
            user: user,
            dateCreated: response.data.message.dateCreated,
            dateUpdated: response.data.message.dateUpdated,
          });
          setMessageStack([...messageStack]);
          updateSWRCache();
        }
      }

      if (
        response.data.message.author === MessageAuthor.Guest &&
        response.data.thread.id === threadId
      ) {
        setState((s) => ({ ...s, isThreadResolved: false }));
        messageNotification.play();
        messageStack.unshift({
          id: response.data.message.id,
          thread,
          text: response.data.message.text,
          author: MessageAuthor.Guest,
          guest: thread.guest,
          user: user,
          dateCreated: response.data.thread.dateCreated,
          dateUpdated: response.data.thread.dateUpdated,
        });
        setMessageStack([...messageStack]);
        updateSWRCache();
      }
    },
    [history, messageStack, thread, threadId, updateSWRCache, user]
  );

  useEffect(() => {
    if (ws?.addEventListener) {
      ws.addOnNewMessageListener(handleIncomingMessage);
    }

    return () => {
      ws?.removeOnNewMessageListener(handleIncomingMessage);
    };
  }, [handleIncomingMessage, ws]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const top =
      e.currentTarget.scrollTop ===
      e.currentTarget.offsetHeight - e.currentTarget.scrollHeight;
    if (top) {
      if (isLoadingMore || isReachingEnd) {
        return;
      }
      setSize(size + 1);
    }
  };

  const resolveThread = async () => {
    try {
      await sdk.resolveThread({ where: { id: threadId } });
      toast.info('Successfully resolved conversation');
    } catch {
      toast.warn('Unable to resolve conversation');
    }

    await mutateThread();
    onResolveThread(threadId);
  };

  return (
    <SWrapper>
      <SThreadWrapper detailsVisible={state.isDetailsVisible}>
        {threadId || messageStack.length ? (
          <SHeader isDetailsVisible={state.isDetailsVisible}>
            <Grid gridGap="small" gridAutoFlow="column" alignItems="center">
              <SHeaderNameText>
                {thread?.guest?.firstName} {thread?.guest?.lastName}
                {order && pricelist
                  ? ` – ${pricelist.name} (${format.currency(
                      order.totalPrice
                    )})`
                  : null}
              </SHeaderNameText>
            </Grid>
            <Grid
              gridAutoFlow="column"
              gridTemplateColumns="max-content"
              gridGap="8px"
            >
              {!state.isThreadResolved ? (
                <Button
                  buttonStyle="secondary"
                  onClick={resolveThread}
                  leftIcon={<IoCheckmarkCircleSharp size={14} />}
                >
                  Resolve
                </Button>
              ) : null}

              <Button
                buttonStyle="secondary"
                onClick={() =>
                  setState((s) => ({
                    ...s,
                    isDetailsVisible: !s.isDetailsVisible,
                  }))
                }
                leftIcon={
                  <MdMoreVert style={{ marginRight: -4, marginTop: 2 }} />
                }
              >
                Details
              </Button>
            </Grid>
          </SHeader>
        ) : (
          <MessagesGuestSearch onGuestChange={setGuest} />
        )}

        <SMessagesSectionWrapper onScroll={handleScroll}>
          {thread
            ? parseMessages(messageStack as Message[]).map((section) => (
                <MessagesSection
                  key={section.messageStack[0].messages[0]?.id}
                  section={section}
                  thread={thread}
                />
              ))
            : null}
          {isLoadingMore && (
            <SMoonLoader>
              <MoonLoader size={16} color={theme.colors.blue} />
            </SMoonLoader>
          )}
        </SMessagesSectionWrapper>

        {hotel?.messagesSettings?.enabled ? (
          <>
            {state.isThreadResolved ? (
              <SResolveLink
                disableOnClick={false}
                interactive
                onClick={() =>
                  setState((s) => ({ ...s, isThreadResolved: false }))
                }
              >
                Resume this conversation
              </SResolveLink>
            ) : (
              <MessagesThreadsInput onSend={handleSendMessage} />
            )}
          </>
        ) : null}
      </SThreadWrapper>

      {thread && threadId ? (
        <MessagesGuestDetails
          visible={state.isDetailsVisible}
          guestId={thread.guest?.id}
          threadId={threadId}
          onClose={() =>
            setState((s) => ({ ...s, isDetailsVisible: !s.isDetailsVisible }))
          }
        />
      ) : null}
    </SWrapper>
  );
};
