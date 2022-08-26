import { theme } from '@src/components/theme';
import React from 'react';
import { FaTimes } from 'react-icons/fa';
import MoonLoader from 'react-spinners/MoonLoader';
import {
  Bounce,
  Flip,
  Slide,
  toast as toaster,
  ToastId,
  ToastOptions,
  UpdateOptions,
  Zoom,
} from 'react-toastify';
import styled from 'styled-components';

const timePerCharacter = 100;

const SMessage = styled.div`
  flex: 1;
  margin-right: 24px;
`;

const SToastWrapper = styled.div`
  display: flex;
  align-items: center;
  color: #414141;
  font-family: ${theme.fontFamily};
  font-weight: 600;
  font-size: 12px;
  line-height: 14px;
  letter-spacing: 0.04em;
  width: max-content;
  max-width: 300px;
  padding: 16px;
  justify-content: space-between;
`;

interface DefaultToastProps {
  closeToast?:
    | ((event: React.MouseEvent<SVGElement, MouseEvent>) => void)
    | undefined;
  message: string;
}

const DefaultToast: React.FC<DefaultToastProps> = ({ closeToast, message }) => {
  return (
    <SToastWrapper>
      <SMessage>{message}</SMessage>
      <FaTimes size={12} onClick={closeToast} />
    </SToastWrapper>
  );
};

export const toast = {
  ...toaster,

  loader(message: string, options: ToastOptions = {}) {
    return toaster(
      <SToastWrapper>
        <SMessage>{message}</SMessage>
        <MoonLoader size={14} />
      </SToastWrapper>,
      {
        autoClose: false,
        closeButton: false,
        ...options,
      }
    );
  },

  info(message: string, options: ToastOptions = {}) {
    return toaster(<DefaultToast message={message} />, {
      closeButton: false,
      autoClose: timePerCharacter * message.length,
      ...options,
    });
  },

  update(toastId: ToastId, message: string, options: UpdateOptions = {}) {
    delete options.closeButton;
    return toaster.update(toastId, {
      render: <DefaultToast message={message} />,
      autoClose: timePerCharacter * message.length,
      transition: Flip,
      ...options,
    });
  },

  get warn(): (message: string, options?: ToastOptions) => ToastId {
    return this.info;
  },
};

export const ToastTransitions = {
  Slide,
  Zoom,
  Flip,
  Bounce,
};
