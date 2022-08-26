import { Text } from '@src/components/atoms';
import { Inputs } from '@src/components/molecules';
import { theme } from '@src/components/theme';
import React from 'react';
import styled from 'styled-components';

const SWrapper = styled.div`
  display: grid;
  padding: 16px;
  box-shadow: 0px 4px 16px rgba(18, 45, 115, 0.1);
  border-radius: 8px;
`;

const SToggle = styled(Inputs.Checkbox)`
  justify-self: right;
`;

interface Props {
  name: string;
  description: string;
  loading: boolean;
}

export const ManageNotificationsToggleNotificationTile: React.FC<Props> = ({
  name,
  description,
  loading,
}) => {
  return (
    <SWrapper>
      <Text.SmallHeading color={theme.textColors.ashGray} mb="16px">
        {name}
      </Text.SmallHeading>
      <Text.Heading mb="16px">
        Enable {name.slice(0, name.length - 1)} notfications
      </Text.Heading>
      <Text.Body mb="16px">{description}</Text.Body>
      <SToggle disabled={loading} onChangeForm name={name} toggle />
    </SWrapper>
  );
};
