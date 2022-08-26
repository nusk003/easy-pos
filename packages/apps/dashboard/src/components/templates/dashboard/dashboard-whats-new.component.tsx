import { Text } from '@src/components/atoms';
import { DashboardWhatsNewTile } from '@src/components/organisms';
import { useWhatsNew } from '@src/xhr/query';
import React from 'react';
import styled from 'styled-components';

const SWrapper = styled.div`
  display: grid;
`;

const SWhatsNewTilesWrapper = styled.div`
  margin-top: 16px;
  display: grid;
  grid-auto-flow: column;
  gap: 24px;
  justify-content: start;
  overflow: auto;

  margin-top: 0;
  padding-top: 16px;

  margin-bottom: -16px;
  padding-bottom: 16px;

  padding-left: 32px;
  margin-left: -32px;

  margin-right: -32px;
  padding-right: 32px;

  ::-webkit-scrollbar {
    display: none;
  }
`;

export const DashboardWhatsNew: React.FC = () => {
  const data = useWhatsNew();

  const whatsNewData =
    data?.data ||
    Array.from({ length: 3 }, (_, idx) => ({
      headline: undefined,
      description: undefined,
      link: String(idx),
    }));

  const date = data?.date;

  return (
    <SWrapper>
      <Text.Body fontWeight="semibold">What&apos;s new</Text.Body>
      <SWhatsNewTilesWrapper>
        {whatsNewData?.map((item) => {
          return (
            <DashboardWhatsNewTile
              date={date}
              headline={item.headline}
              description={item.description}
              link={item.link}
              key={item.link}
            />
          );
        })}
      </SWhatsNewTilesWrapper>
    </SWrapper>
  );
};
