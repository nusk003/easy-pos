import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

const Divider = styled.div`
  height: 1px;
  background: #1c95ed55;
`;

const Item = styled.div`
  cursor: pointer;
  display: grid;
  padding: 12px;
  grid-template-columns: max-content max-content;
  align-items: center;
  grid-gap: 8px;

  :hover {
    background: #ddeffd;
  }
`;

interface ChildrenWrapperProps {
  visible: boolean;
}

const SChildrenWrapper = styled.div<ChildrenWrapperProps>`
  position: fixed;
  visibility: ${(props): string => (props.visible ? 'visible' : 'hidden')};
  z-index: 1;

  > div :first-child {
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
  }

  > div :last-child {
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
  }
`;

const SProvider = styled.div``;

interface MenuProviderProps {
  menu: React.ReactNode;
  children: React.ReactNode;
}

const MenuWrapper = styled.div`
  display: grid;
  grid-gap: 2px;
  background: white;

  user-select: none;

  box-shadow: 0px 0px 19px -2px rgba(0, 0, 0, 0.25);
  border-radius: 8px;
`;

const MenuProvider: React.FC<MenuProviderProps> = ({
  menu: Menu,
  children,
}) => {
  const [state, setState] = useState({
    isVisible: false,
    clientX: 0,
    clientY: 0,
  });

  const wrapperRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (wrapperRef.current !== null) {
      if (!wrapperRef.current.contains(event.target as Node)) {
        if (state.isVisible) {
          const newState = { ...state };
          newState.isVisible = false;
          setState(newState);
        }
      } else {
        setTimeout(() => {
          const newState = { ...state };
          newState.isVisible = false;
          setState(newState);
        }, 200);
      }
    }
  };

  const handleScroll = () => {
    if (state.isVisible) {
      const newState = { ...state };
      newState.isVisible = false;
      setState(newState);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('scroll', handleScroll);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.addEventListener('scroll', handleScroll);
    };
  });

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();

    state.clientX = e.clientX;
    state.clientY = e.clientY;
    state.isVisible = true;

    setState({ ...state });
  };

  return (
    <>
      <SProvider
        onContextMenu={(e: React.MouseEvent<HTMLDivElement>) => {
          handleClick(e);
        }}
      >
        {children}
      </SProvider>
      <SChildrenWrapper
        ref={wrapperRef}
        visible={state.isVisible}
        style={{
          top: state.clientY,
          left: state.clientX,
        }}
      >
        {Menu}
      </SChildrenWrapper>
    </>
  );
};

export const ContextMenu = { Divider, Item, MenuWrapper, MenuProvider };
