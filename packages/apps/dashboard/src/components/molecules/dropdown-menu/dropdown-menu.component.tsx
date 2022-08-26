import { Text } from '@src/components/atoms';
import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

const Divider = styled.div`
  height: 1px;
  background: #bbb;
  margin: 4px 0;
`;

const Item = styled(Text.Body)`
  padding: 8px 12px;
  align-items: center;
  font-weight: ${(props) => props.theme.fontWeights.semibold};
  min-width: 120px;

  user-select: none;
  cursor: pointer;

  :hover {
    background: ${(props) => props.theme.colors.offWhite};
  }
`;

interface WrapperProps extends React.HTMLProps<HTMLDivElement> {
  visible: boolean;
  buttonDimensions: {
    width: number;
    height: number;
    x: number;
    y: number;
  };
  alignRight?: boolean;
  yOffset: number;
  right?: number;
}

const SWrapper = styled.div<WrapperProps>`
  z-index: 10000;
  display: grid;
  background: #fff;
  color: #838383;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  transition: opacity 0.2s;
  position: fixed;
  visibility: ${(props) => (props.visible ? 'visible' : 'hidden')};
  opacity: ${(props) => (props.visible ? 1 : 0)};
  gap: 8px;
  width: max-content;
  justify-content: flex-end;
  border-radius: 8px;
  right: ${(props) => (props.right ? `${props.right}px` : undefined)};

  top: ${(props) =>
    props.buttonDimensions.height +
    props.buttonDimensions.y +
    8 +
    props.yOffset}px;

  left: ${(props) =>
    props.alignRight
      ? `${props.buttonDimensions.x - 220 + props.buttonDimensions.width}px`
      : null};

  padding: 8px 0;
`;

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  closeOnSelect?: boolean;
  onClose: () => void;
  buttonRef:
    | React.MutableRefObject<HTMLDivElement | HTMLButtonElement>
    | React.MutableRefObject<null>;
  children: React.ReactNode;
  visible: boolean;
  alignRight?: boolean;
  yOffset?: number;
}

const MenuWrapper: React.FC<Props> = ({
  closeOnSelect,
  onClose,
  buttonRef,
  children,
  visible,
  alignRight,
  yOffset = 0,
  ...rest
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null);

  const [buttonDimensions, setButtonDimensions] = useState({
    width: 0,
    height: 0,
    x: 0,
    y: 0,
  });

  const [right, setRight] = useState<number>();

  const handleClickOutside = (event: MouseEvent) => {
    if (wrapperRef.current !== null && buttonRef.current !== null) {
      if (
        !wrapperRef.current.contains(event.target as Node) &&
        visible &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        onClose();
      } else if (
        visible &&
        closeOnSelect &&
        wrapperRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    }
  };

  useEffect(() => {
    document.addEventListener('mouseup', handleClickOutside);
    return () => {
      document.removeEventListener('mouseup', handleClickOutside);
    };
  });

  useEffect(() => {
    if (buttonRef.current) {
      setButtonDimensions(buttonRef.current.getBoundingClientRect());
    }
  }, [buttonRef, visible]);

  useEffect(() => {
    if (wrapperRef.current && buttonRef.current) {
      const width = window.innerWidth;
      const wrapperDimensions = wrapperRef.current.getBoundingClientRect();
      const buttonDimensions = buttonRef.current.getBoundingClientRect();

      const rightValue = width - buttonDimensions.x - buttonDimensions.width;

      if (width - buttonDimensions.x - wrapperDimensions.width - 16 < 0) {
        setRight(rightValue);
      } else {
        setRight(undefined);
      }
    }
  }, [buttonRef, visible]);

  return (
    <SWrapper
      {...rest}
      visible={visible}
      buttonDimensions={buttonDimensions}
      ref={wrapperRef}
      alignRight={alignRight}
      yOffset={yOffset}
      right={right}
    >
      {children}
    </SWrapper>
  );
};

export const DropdownMenu = {
  Divider,
  Item,
  MenuWrapper,
};
