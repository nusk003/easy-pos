import { Link } from '@src/components/atoms';
import React, { forwardRef } from 'react';
import styled from 'styled-components';

interface ModalWrapperProps {
  visible: boolean;
}

const SModalWrapper = styled.div<ModalWrapperProps>`
  z-index: 100000;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: grid;
  align-content: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.05);
  transition: 0.2s all;

  visibility: ${(props): string => (props.visible ? 'visible' : 'hidden')};
  opacity: ${(props): number => (props.visible ? 1 : 0)};
`;

const SContentWrapper = styled.div`
  z-index: 100000;
  border-radius: 12px;
  display: grid;
  background: #fff;
  box-shadow: 0px 0px 30px 0px rgba(0, 0, 0, 0.25);
  max-height: 95vh;
  max-width: 95vw;

  overflow: auto;

  scrollbar-width: thin;
  scrollbar-color: #bbb #fff;

  ::-webkit-scrollbar {
    width: 11px;
    height: 11px;
  }

  ::-webkit-scrollbar-track {
    background-clip: content-box;
    border-top-right-radius: 12px;
    border-bottom-right-radius: 12px;
    border: 20px solid transparent;
  }

  ::-webkit-scrollbar-thumb {
    background-color: #bbb;
    border-radius: 12px;
    border: 3px solid #fff;
  }
`;

const SFullScreen = styled.div<ModalWrapperProps>`
  position: fixed;
  bottom: 0;
  top: 0;
  right: 0;
  left: 0;
  z-index: 100000;
  background: #fff;

  visibility: ${(props): string => (props.visible ? 'visible' : 'hidden')};
  opacity: ${(props): number => (props.visible ? 1 : 0)};
`;

const SFullScreenClose = styled(Link)`
  position: absolute;
  font-weight: 600;
  font-size: 14px;
  right: 56px;
  top: 40px;
  color: #000;
`;

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  onClose: () => void;
  children: React.ReactNode;
  visible: boolean;
  fullScreen?: boolean;
}

const ModalComponent: React.ForwardRefRenderFunction<HTMLDivElement, Props> = (
  { onClose, children, visible, fullScreen, ...rest },
  ref
) => {
  const handleClose = () => {
    onClose();
  };

  const handleWrapperClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  if (fullScreen) {
    return (
      <SFullScreen visible={visible}>
        <SFullScreenClose onClick={handleClose}>Close</SFullScreenClose>
        {children}
      </SFullScreen>
    );
  }

  return (
    <SModalWrapper visible={visible} onClick={handleClose}>
      <SContentWrapper
        onClick={(e) => handleWrapperClick(e)}
        ref={ref}
        {...rest}
      >
        {children}
      </SContentWrapper>
    </SModalWrapper>
  );
};

export const Modal = forwardRef(ModalComponent);
