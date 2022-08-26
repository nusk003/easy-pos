import { Modal } from '@src/components/molecules/';
import React, { useEffect, useState } from 'react';
import {
  OrdersModalDetails,
  OrdersModalReject,
} from '@src/components/organisms';
import { Order } from '@hm/sdk';

interface Props {
  order: Order | undefined;
  visible: boolean;
  onClose: () => void;
}

export const OrdersModal: React.FC<Props> = ({ visible, onClose, order }) => {
  const [isRejectVisible, setIsRejectVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setIsRejectVisible(false);
    }, 300);
  }, [visible]);

  return (
    <Modal visible={visible} onClose={onClose}>
      {order ? (
        <>
          {isRejectVisible ? (
            <OrdersModalReject
              onBack={() => setIsRejectVisible(false)}
              onClose={onClose}
              order={order}
            />
          ) : (
            <OrdersModalDetails
              order={order}
              onClose={onClose}
              onReject={() => setIsRejectVisible(true)}
            />
          )}
        </>
      ) : null}
    </Modal>
  );
};
