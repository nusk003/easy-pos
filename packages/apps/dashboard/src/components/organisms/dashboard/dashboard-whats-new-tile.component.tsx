import { Button, Text, CircleIcon } from '@src/components/atoms';
import { theme } from '@src/components/theme';
import dayjs from 'dayjs';
import React from 'react';
import { FaHeart } from 'react-icons/fa';
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
  display: grid;
  grid-auto-flow: column;
  justify-content: space-between;
  align-items: center;
`;

const SDescriptionText = styled(Text.Body)`
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

interface Props {
  headline?: string;
  description?: string;
  link?: string;
  date?: string;
}

export const DashboardWhatsNewTile: React.FC<Props> = ({
  description,
  headline,
  link,
  date,
}) => {
  return (
    <SWrapper>
      <SHeaderWrapper>
        <Text.Body fontWeight="semibold" color={theme.textColors.lightGray}>
          {headline}&zwnj;
        </Text.Body>
        <Text.Body fontWeight="semibold" color={theme.textColors.lightGray}>
          {date}
        </Text.Body>
      </SHeaderWrapper>
      <SContentWrapper>
        <div>
          <SDescriptionText mt="4px">{description}</SDescriptionText>
        </div>
        {headline ? (
          <CircleIcon mr="0" color={theme.textColors.purple} icon={FaHeart} />
        ) : null}
      </SContentWrapper>
      <SActionsWrapper>
        <Button buttonStyle="secondary">View</Button>
      </SActionsWrapper>
    </SWrapper>
  );
};
