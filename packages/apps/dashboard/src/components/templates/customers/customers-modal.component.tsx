import { Customer } from '@hm/sdk';
import { Text } from '@src/components/atoms';
import { Modal } from '@src/components/molecules';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { CustomersForm } from './customers-form.component';

interface Props {
  visible: boolean;
  onClose: () => void;
  customer?: Customer;
}

const SWrapper = styled.div`
  padding: 16px;
  width: 530px;
`;

export const CustomersModal: React.FC<Props> = ({
  visible,
  onClose,
  customer,
}) => {
  const [forceRemount, setForceRemount] = useState(false);

  useEffect(() => {
    setForceRemount(true);
    setTimeout(() => {
      setForceRemount(false);
    }, 10);
  }, [customer?.id]);

  return (
    <Modal visible={visible} onClose={onClose}>
      <SWrapper>
        <Text.Heading fontWeight="semibold" mb="24px">
          {customer ? 'Update' : 'Add new'} customer
        </Text.Heading>
        {!forceRemount ? (
          <CustomersForm defaultValues={customer} onClose={onClose} />
        ) : null}
      </SWrapper>
    </Modal>
  );
};
