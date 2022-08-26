import { MarketplaceApp } from '@hm/sdk';
import { Button, Text, toast } from '@src/components/atoms';
import { Modal } from '@src/components/molecules';
import { theme } from '@src/components/theme';
import { sdk } from '@src/xhr/graphql-request';
import React, { useState } from 'react';
import { AiOutlineCopy } from 'react-icons/ai';
import styled from 'styled-components';

const SWrapper = styled.div`
  padding: 16px;
`;

const SButtonWrapper = styled.div`
  display: grid;
  grid-auto-flow: column;
  gap: 16px;
  justify-content: flex-end;
  margin-top: 16px;
`;

const SKeyWrapper = styled.div`
  margin-top: 16px;
  border-radius: 8px;
  padding: 8px;
  display: grid;
  grid-template-columns: auto min-content;
  background: ${theme.colors.lightGray};
  align-items: center;
`;

const SKeyText = styled(Text.Body)`
  font-family: 'Monaco', monospace;
`;

const SCopyButtonWrapper = styled.div`
  cursor: pointer;
  user-select: none;
  display: grid;
  align-items: center;
  justify-content: center;
  padding: 4px;
  border-radius: 4px;

  :hover {
    background: #e0e0e0;
  }
`;

interface Props {
  visible: boolean;
  onClose: () => void;
  marketplaceApp: MarketplaceApp | undefined;
}

export const ManageDeveloeprMarketplaceAppKeyModal: React.FC<Props> = ({
  visible,
  onClose,
  marketplaceApp,
}) => {
  const [key, setKey] = useState<string>();
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);

  if (!marketplaceApp) {
    return null;
  }

  const handleGenerateKey = async () => {
    setSubmitLoading(true);

    const toastId = toast.loader('Generating new API key');

    try {
      const { generateMarketplaceAppKey } =
        await sdk.generateMarketplaceAppKey();
      setKey(generateMarketplaceAppKey);

      toast.update(toastId, 'Successfully generated new API Key');
    } catch {
      toast.update(toastId, 'Unable to generate new API Key');
    }

    setSubmitLoading(false);
  };

  const handleCopyKey = async () => {
    if (!key) {
      return;
    }

    try {
      await navigator.clipboard.writeText(key);
      toast.info('Copied key');
    } catch {
      toast.warn('Unable to copy key');
    }
  };

  return (
    <Modal visible={visible} onClose={onClose}>
      <SWrapper>
        <Text.Interactive>Generate new API Key</Text.Interactive>
        {key ? (
          <>
            <Text.Body mt="16px">
              Please ensure that you save your key in a safe place.
            </Text.Body>
            <Text.Body mt="8px">
              You will not be able to view this key again once you navigate away
              from this page.
            </Text.Body>
            <SKeyWrapper>
              <SKeyText>{key}</SKeyText>
              <SCopyButtonWrapper onClick={handleCopyKey}>
                <AiOutlineCopy size={16} />
              </SCopyButtonWrapper>
            </SKeyWrapper>
          </>
        ) : (
          <>
            <Text.Body mt="16px">
              Are you sure you want to generate a new API Key?
            </Text.Body>
            <Text.Descriptor mt="8px">
              Note: Generating a new key will invalidate any keys you have
              previously generated.
            </Text.Descriptor>
          </>
        )}
        <SButtonWrapper>
          <Button type="button" buttonStyle="secondary" onClick={onClose}>
            {key ? 'Close' : 'Cancel'}
          </Button>
          {!key ? (
            <Button
              buttonStyle="primary"
              onClick={handleGenerateKey}
              loading={submitLoading}
            >
              Generate API Key
            </Button>
          ) : null}
        </SButtonWrapper>
      </SWrapper>
    </Modal>
  );
};
