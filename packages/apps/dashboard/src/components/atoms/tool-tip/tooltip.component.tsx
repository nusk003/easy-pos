import React, { useState } from 'react';
import styled from 'styled-components';
import { Text } from '@src/components/atoms';

const STooltipWrapper = styled.div`
  display: grid;
  width: fit-content;
`;

interface TooltipTextProps {
  visibility: boolean | undefined;
  y: number;
  x: number;
}

const TooltipText = styled(Text.BodyBold).attrs((props: TooltipTextProps) => ({
  style: {
    top: props.y,
    left: props.x + 12,
    visibility: props.visibility ? 'visible' : 'hidden',
  },
}))<TooltipTextProps>`
  background: rgba(255, 255, 255, 0.95);
  position: fixed;
  border: 0.5px solid #ececec;
  box-shadow: 0px 4px 16px rgba(100, 100, 100, 0.08);
  border-radius: 6px;
  padding: 6px;
  z-index: 100000;
  max-width: 400px;
  word-break: normal;
  white-space: pre-wrap;
`;

interface Props {
  message: string;
  children: React.ReactNode;
  enabled?: boolean;
}

export const Tooltip: React.FC<Props> = ({
  message,
  children,
  enabled = true,
}) => {
  const [visibility, setVisibility] = useState(false);
  const [coordinates, setCoordinates] = useState({ x: 0, y: 0 });

  if (!enabled || !message) {
    return <>{children}</>;
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setCoordinates({ x: e.clientX, y: e.clientY });
  };

  const toggleTooltip = () => {
    setVisibility(!visibility);
  };

  return (
    <STooltipWrapper
      onMouseEnter={toggleTooltip}
      onMouseLeave={toggleTooltip}
      onMouseMove={handleMouseMove}
    >
      {children}
      <TooltipText
        x={coordinates.x}
        y={coordinates.y}
        visibility={visibility || undefined}
      >
        {message}
      </TooltipText>
    </STooltipWrapper>
  );
};
