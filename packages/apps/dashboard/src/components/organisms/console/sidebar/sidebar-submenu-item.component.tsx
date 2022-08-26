import { Badge, Text } from '@src/components/atoms';
import { theme } from '@src/components/theme';
import React, { useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';

const SWrapper = styled.div<{ isActive: boolean; badgeCount: number }>`
  display: grid;
  grid-auto-flow: column;
  align-items: center;
  justify-content: space-between;
  border-radius: 8px;
  cursor: pointer;
  user-select: none;
  padding: ${(props) => (props.badgeCount > 0 ? 6 : 8)}px 0px;
  padding-right: 8px;
  padding-left: 36px;

  background-color: ${(props) =>
    props.isActive ? '#f2f2f2 !important' : undefined};

  :hover {
    background-color: #f2f2f2;
  }

  transition: background-color 0.3s, color 0.3s;
`;

interface Props {
  title: string;
  location: string;
  locationsBlacklist?: string[];
  matchedLocations?: string[];
  badgeCount?: number;
  onClick?: () => void;
}

export const SidebarSubmenuItem: React.FC<Props> = ({
  title,
  location,
  matchedLocations,
  locationsBlacklist,
  badgeCount = 0,
  onClick,
}) => {
  const history = useHistory();

  const handleClick = () => {
    onClick?.();

    if (location) {
      history.push(location);
    }
  };

  const isActive = useMemo(() => {
    if (
      location &&
      history.location.pathname.replace(/([^/])$/, '$1/') ===
        location.replace(/([^/])$/, '$1/') &&
      (history.location.pathname.includes('manage')
        ? location.includes('manage')
        : true)
    ) {
      return true;
    }

    if (matchedLocations) {
      return matchedLocations.some((l) => {
        if (
          locationsBlacklist
            ?.map((lb) => lb.replace(/([^/])$/, '$1/'))
            ?.includes(history.location.pathname.replace(/([^/])$/, '$1/'))
        ) {
          return false;
        }

        const regex = new RegExp(
          l.replace(/([^/])$/, '$1/').replace(/\/:.*\//g, '\\/.*\\/')
        );
        return regex.test(history.location.pathname.replace(/([^/])$/, '$1/'));
      });
    }

    return false;
  }, [
    history.location.pathname,
    location,
    locationsBlacklist,
    matchedLocations,
  ]);

  return (
    <SWrapper isActive={isActive} onClick={handleClick} badgeCount={badgeCount}>
      <Text.Body
        fontWeight="medium"
        color={isActive ? theme.textColors.gray : '#9a9ba0'}
      >
        {title}
      </Text.Body>
      {badgeCount > 0 ? <Badge count={badgeCount} /> : null}
    </SWrapper>
  );
};
