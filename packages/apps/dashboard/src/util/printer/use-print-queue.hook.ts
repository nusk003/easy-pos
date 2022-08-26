import { Order } from '@hm/sdk';
import { __electron__ } from '@src/constants';
import { usePricelistStore } from '@src/store';
import { sdk } from '@src/xhr/graphql-request';
import dayjs from 'dayjs';
import { useCallback, useEffect } from 'react';

declare const window: any;

export const usePrintQueue = () => {
  const { printers } = usePricelistStore(
    useCallback((state) => ({ printers: state.printers }), [])
  );

  useEffect(() => {
    if (!__electron__ || !Object.keys(printers).length) {
      return;
    }

    const interval = setInterval(async () => {
      const { orders } = await sdk.orders({
        startDate: dayjs().utc().subtract(15, 'minutes').toDate(),
      });

      setTimeout(() => {
        const { printers, printerQueue, addPrinterQueueJob } =
          usePricelistStore.getState();

        orders
          .filter(
            (order) => !printerQueue.map((job) => job.id).includes(order.id)
          )
          .forEach((order) => {
            const pricelistPrinters = printers[order.pricelist.id];

            if (!pricelistPrinters?.length) {
              return;
            }

            pricelistPrinters.forEach((printer) => {
              for (let idx = 0; idx < printer.copies; idx += 1) {
                addPrinterQueueJob(order as Order);
                window.native.print.order(order, printer);
              }
            });
          });
      }, 5 * 1000);
    }, 60 * 1000);

    return () => {
      clearInterval(interval);
    };
  }, [printers]);
};
