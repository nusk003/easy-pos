import { Guest } from '@hm/sdk';
import { Button, Text, TextAvatar } from '@src/components/atoms';
import { theme } from '@src/components/theme';
import dayjs from 'dayjs';
import React from 'react';
import styled from 'styled-components';

const SWrapper = styled.div`
  height: calc(215px - 40px);
  width: calc(333px - 32px);

  display: grid;
  justify-content: space-between;
  grid-template-columns: 100%;
  grid-template-rows: max-content 1fr max-content;

  box-shadow: 0px 4px 16px rgb(100 100 100 / 16%);
  padding-top: 16px;
  border-radius: 16px;

  user-select: none;
  cursor: pointer;
  white-space: pre-wrap;
`;

const SHeaderWrapper = styled.div`
  padding: 0 16px;
  display: grid;
  grid-auto-flow: column;
  justify-content: space-between;
  align-items: start;
`;

const SContentWrapper = styled.div`
  padding: 0 16px;
  padding-top: 24px;

  display: grid;
  grid-auto-flow: column;
  justify-content: space-between;
`;

const SDescriptionText = styled(Text.Body)`
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const SActionsWrapper = styled.div`
  padding: 12px 16px;
  border-top: 0.5px solid #dde0e7;

  display: grid;
  align-content: end;
  justify-content: end;
  grid-auto-flow: column;
  gap: 8px;
`;

export interface DashboardNotificationTileProps {
  id: string;
  title?: string;
  subtitle?: string;
  description?: string | JSX.Element | JSX.Element[];
  guest?: Guest;
  dateUpdated?: Date;
  onClick?: () => void;
}

export const DashboardNotificationTile: React.FC<DashboardNotificationTileProps> =
  ({ dateUpdated, description, guest, subtitle, title, onClick }) => {
    return (
      <SWrapper onClick={onClick}>
        <SHeaderWrapper>
          <Text.Body fontWeight="semibold" color={theme.textColors.lightGray}>
            {title}&zwnj;
          </Text.Body>
          <Text.Body fontWeight="semibold" color={theme.textColors.lightGray}>
            {dateUpdated ? dayjs(dateUpdated).format('hh:mma') : null}
          </Text.Body>
        </SHeaderWrapper>
        <SContentWrapper>
          <div>
            <Text.Primary fontWeight="semibold">{subtitle}</Text.Primary>
            <SDescriptionText mt="4px">{description}</SDescriptionText>
          </div>
          <TextAvatar
            background={theme.colors.lightGray}
            size={38}
            color={theme.textColors.lightGray}
            ml="24px"
          >
            {guest?.firstName?.slice(0, 1)}
            {guest?.lastName?.slice(0, 1)}
          </TextAvatar>
        </SContentWrapper>
        <SActionsWrapper>
          <Button buttonStyle="secondary">View</Button>
        </SActionsWrapper>
      </SWrapper>
    );
  };
