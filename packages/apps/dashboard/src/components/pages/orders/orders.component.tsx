import { Text } from '@src/components/atoms';
import { Header, OrdersAll, OrdersKanban } from '@src/components/templates';
import { theme } from '@src/components/theme';
import { useSpaces } from '@src/xhr/query';
import React, { useMemo, useState } from 'react';
import styled from 'styled-components';

const SWrapper = styled.div`
  padding: 32px;
  padding-right: 16px;

  ${theme.mediaQueries.tablet} {
    padding: 16px;
    padding-right: 0;
  }
`;

const SOrdersScreenSelectorWrapper = styled.div`
  display: grid;
  grid-auto-flow: column;
  justify-content: start;
  gap: 8px;
  padding-bottom: 16px;
`;

const SOrdersScreenSelectorButton = styled(Text.Body)<{ active: boolean }>`
  font-weight: ${(props) => props.theme.fontWeights.semibold};
  padding: 8px 12px;
  background-color: ${(props) => (props.active ? '#efefef' : undefined)};
  border-radius: 8px;
  cursor: pointer;
  user-select: none;
`;

enum OrdersScreen {
  Active = 'Active',
  All = 'All',
}

export const Orders: React.FC = () => {
  const { data: spaces } = useSpaces();

  const pricelists = useMemo(() => {
    return spaces?.flatMap((s) => s.pricelists);
  }, [spaces]);

  const [screen, setScreen] = useState(OrdersScreen.Active);

  const RenderedScreen = useMemo(() => {
    if (screen === OrdersScreen.Active) {
      return OrdersKanban;
    } else if (screen === OrdersScreen.All) {
      return OrdersAll;
    }

    return () => null;
  }, [screen]);

  if (!spaces) {
    return null;
  }

  return (
    <>
      <Header title="Orders" />
      <SWrapper>
        {!pricelists?.length ? (
          <>
            <Text.Primary fontWeight="semibold" mb="4px">
              What are orders?
            </Text.Primary>
            <Text.Body mb="16px">
              Orders allow you to manage food & beverage request from guests in
              real-time. You can enable orders when you set up a menu.
            </Text.Body>
          </>
        ) : null}

        <SOrdersScreenSelectorWrapper>
          <SOrdersScreenSelectorButton
            active={screen === OrdersScreen.Active}
            onClick={() => setScreen(OrdersScreen.Active)}
          >
            {OrdersScreen.Active}
          </SOrdersScreenSelectorButton>
          <SOrdersScreenSelectorButton
            active={screen === OrdersScreen.All}
            onClick={() => setScreen(OrdersScreen.All)}
          >
            {OrdersScreen.All}
          </SOrdersScreenSelectorButton>
        </SOrdersScreenSelectorWrapper>

        <RenderedScreen />
      </SWrapper>
    </>
  );
};
