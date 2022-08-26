import { Product } from '@hm/sdk';
import { Text } from '@src/components/atoms';
import { Modal } from '@src/components/molecules';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { ProductsForm } from './products-form.component';

interface Props {
  visible: boolean;
  onClose: () => void;
  product?: Product;
}

const SWrapper = styled.div`
  padding: 16px;
  width: 530px;
`;

export const ProductsModal: React.FC<Props> = ({
  visible,
  onClose,
  product,
}) => {
  const [forceRemount, setForceRemount] = useState(false);

  useEffect(() => {
    setForceRemount(true);
    setTimeout(() => {
      setForceRemount(false);
    }, 10);
  }, [product?.id]);

  return (
    <Modal visible={visible} onClose={onClose}>
      <SWrapper>
        <Text.Heading fontWeight="semibold" mb="24px">
          {product ? 'Update' : 'Add new'} product
        </Text.Heading>
        {!forceRemount ? (
          <ProductsForm defaultValues={product} onClose={onClose} />
        ) : null}
      </SWrapper>
    </Modal>
  );
};
