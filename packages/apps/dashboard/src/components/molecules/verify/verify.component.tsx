import { Button, ButtonStyle, Text } from '@src/components/atoms';
import { Modal } from '@src/components/molecules';
import { theme } from '@src/components/theme';
import React from 'react';
import styled from 'styled-components';

const SWrapper = styled.div`
  display: grid;
  gap: 16px;
`;

const SButtonWrapper = styled.div`
  display: grid;
  grid-auto-flow: column;
  gap: 16px;
  justify-content: flex-end;
  margin-top: 16px;
`;

const SRelativeWrapper = styled.div`
  position: relative;
`;

const SVerifyContainer = styled.div`
  padding: 16px;
`;

const SContentWrapper = styled.div<{ visible: boolean }>`
  position: absolute;
  height: 100%;
  z-index: 1;
  width: 100%;
  background-color: ${theme.colors.white};
  opacity: ${({ visible }) => (visible ? '0.5' : '1')};
`;

const SRelativeVerifyContext = styled.div`
  position: absolute;
  background-color: ${theme.colors.white};
  z-index: 2;
  width: 100%;
  bottom: 0;
`;

interface VerifyContextProps {
  title?: string;
  message?: string;
  onClose: () => void;
  onVerify: () => void;
  buttonStyle: ButtonStyle;
  buttonText: string;
  cancelText?: string;
  loading?: boolean;
}

export const VerifyContext: React.FC<VerifyContextProps> = ({
  title,
  message,
  onClose,
  onVerify,
  buttonStyle,
  buttonText,
  cancelText = 'Cancel',
  loading,
}) => {
  return (
    <SVerifyContainer>
      <Text.Interactive>{title}</Text.Interactive>
      <Text.Body mt="16px">{message}</Text.Body>
      <SButtonWrapper>
        <Button
          type="button"
          loading={loading}
          buttonStyle="secondary"
          onClick={onClose}
        >
          {cancelText}
        </Button>
        <Button buttonStyle={buttonStyle} onClick={onVerify} type="button">
          {buttonText}
        </Button>
      </SButtonWrapper>
    </SVerifyContainer>
  );
};

interface Props {
  title?: string;
  message?: string;
  type: 'delete' | 'primary';
  buttonText?: string;
  onVerify: () => void;
  children?: React.ReactNode;
  visible: boolean;
  onClose: () => void;
  modal?: boolean;
  relative?: boolean;
  loading?: boolean;
}

export const Verify: React.FC<Props> = ({
  title,
  message,
  type,
  buttonText: propsButtonText,
  onVerify,
  children,
  visible,
  onClose,
  modal,
  relative,
  loading,
}) => {
  let buttonText = 'Submit';
  let buttonStyle: 'delete' | 'secondary' | 'primary' | 'tertiary' = 'primary';

  switch (type) {
    case 'primary':
      buttonText = 'Submit';
      buttonStyle = 'primary';
      break;
    case 'delete':
      buttonText = 'Delete';
      buttonStyle = 'delete';
      break;
    default:
      break;
  }

  buttonText = propsButtonText || buttonText;

  if (relative) {
    return (
      <SRelativeWrapper>
        {visible && (
          <>
            <SContentWrapper onClick={() => onClose()} visible={visible} />
            <SRelativeVerifyContext>
              <VerifyContext
                title={title}
                message={message}
                buttonStyle={buttonStyle}
                buttonText={buttonText}
                onClose={onClose}
                onVerify={onVerify}
                loading={loading}
              />
            </SRelativeVerifyContext>
          </>
        )}
        {children}
      </SRelativeWrapper>
    );
  }

  if (modal) {
    return (
      <>
        <SWrapper as={Modal} visible={visible} onClose={onClose}>
          <VerifyContext
            title={title}
            message={message}
            buttonStyle={buttonStyle}
            buttonText={buttonText}
            onClose={onClose}
            onVerify={onVerify}
          />
        </SWrapper>
        {children}
      </>
    );
  }

  if (visible) {
    return (
      <SWrapper>
        <VerifyContext
          title={title}
          message={message}
          buttonStyle={buttonStyle}
          buttonText={buttonText}
          onClose={onClose}
          onVerify={onVerify}
        />
      </SWrapper>
    );
  }

  return <>{children}</>;
};
