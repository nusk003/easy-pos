import { __electron__, __macos__ } from '@src/constants';
import React from 'react';
import styled from 'styled-components';

const SWrapper = styled.div<{ sidebar: boolean }>`
  height: 40px;
  margin-top: -16px;

  display: ${(props) => (props.sidebar ? 'grid' : 'none')};
  align-items: center;

  -webkit-app-region: drag;
`;

interface Props {
  sidebar?: boolean;
}

export const TitleBar: React.FC<Props> = ({ sidebar }) => {
  if (!__electron__ || !__macos__) {
    return null;
  }

  return <SWrapper sidebar={!!sidebar} />;
};
