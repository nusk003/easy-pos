import { Button, ButtonStyle } from '@src/components/atoms';
import React from 'react';
import styled from 'styled-components';

const SWrapper = styled.div`
  display: grid;
  grid-auto-flow: column;
  justify-content: flex-end;
  grid-gap: 8px;
`;

interface Props extends React.HTMLAttributes<HTMLButtonElement> {
  onCancel?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  children?: React.ReactChild;
  loading?: boolean;
  cancelText?: string;
  buttonStyle?: ButtonStyle;
  disabled?: boolean;
}

export const Submit: React.FC<Props> = ({
  onCancel,
  children,
  loading,
  cancelText,
  disabled = false,
  buttonStyle = 'primary',
  ...rest
}) => {
  return (
    <SWrapper>
      {onCancel ? (
        <Button onClick={onCancel} buttonStyle="secondary" type="button">
          {cancelText || 'Cancel'}
        </Button>
      ) : null}

      <Button
        loading={loading}
        type="submit"
        buttonStyle={buttonStyle}
        disabled={disabled}
        {...rest}
      >
        {children || 'Submit'}
      </Button>
    </SWrapper>
  );
};
