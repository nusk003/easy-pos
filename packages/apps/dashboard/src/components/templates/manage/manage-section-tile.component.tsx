import { Text } from '@src/components/atoms';
import { theme } from '@src/components/theme';
import React from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';

const SWrapper = styled.div`
  display: grid;
  grid-auto-flow: column;
  justify-content: start;
  gap: 16px;

  user-select: none;
  cursor: pointer;
`;

const SSquareIcon = styled.div`
  width: 55px;
  height: 55px;

  background: linear-gradient(180deg, #4066c6 0%, #3c8eee 100%);
  border-radius: 8px;
`;

interface Props {
  title: string;
  description: string;
  location: string | { location: string; state: Record<string, unknown> };
}

export const ManageSectionTile: React.FC<Props> = ({
  title,
  description,
  location,
}) => {
  const history = useHistory();

  const handleClick = () => {
    if (typeof location === 'string') {
      history.push(location);
    } else {
      history.push(location.location, location.state);
    }
  };

  return (
    <SWrapper onClick={handleClick}>
      <SSquareIcon />
      <div>
        <Text.Primary fontWeight="medium">{title}</Text.Primary>
        <Text.Descriptor mt="4px" color={theme.textColors.lightGray}>
          {description}
        </Text.Descriptor>
      </div>
    </SWrapper>
  );
};
