import { useUser } from '@src/xhr/query';
import { Tag, Text, TextAvatar } from '@src/components/atoms';
import React from 'react';
import styled from 'styled-components';
import { User } from '@hm/sdk';
import { getReadableUserRole } from '@src/util/users';
import { theme } from '@src/components/theme';

const SWrapper = styled.div<{ clickable: boolean }>`
  display: grid;
  grid-auto-flow: column;
  grid-template-columns: max-content;
  gap: 16px;
  align-items: center;
  cursor: ${(props) => (props.clickable ? 'pointer' : undefined)};
  width: max-content;
`;

const SNameWrapper = styled.div`
  display: grid;
  grid-auto-flow: column;
  align-items: center;
`;

const SRoleText = styled(Text.Primary)`
  display: none;

  ${theme.mediaQueries.tablet} {
    display: block;
  }
`;

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  user: User;
}

export const ManageTeamUserTile: React.FC<Props> = ({
  user,
  onClick,
  ...rest
}) => {
  const { data: adminUser } = useUser();

  let isClickable = false;

  const adminRole = getReadableUserRole(adminUser);
  const userRole = getReadableUserRole(user);

  if (adminUser?.id === user.id) {
    isClickable = false;
  } else if (userRole === 'Hotel Manager') {
    isClickable = false;
  } else if (adminRole === 'Hotel Member') {
    isClickable = false;
  } else if (adminRole === 'Hotel Admin' && userRole !== 'Group Admin') {
    isClickable = true;
  } else if (adminRole === 'Group Admin' || adminRole === 'Hotel Manager') {
    isClickable = true;
  }

  const role = getReadableUserRole(user);

  return (
    <SWrapper
      clickable={isClickable}
      onClick={isClickable ? onClick : undefined}
      {...rest}
    >
      <TextAvatar bg="gray" p="medium">
        {user.firstName?.[0]}
        {user.lastName?.[0]}
      </TextAvatar>

      <div>
        <SNameWrapper>
          {user.firstName ? (
            <Text.Primary fontWeight="semibold">
              {user.firstName} {user.lastName}
            </Text.Primary>
          ) : (
            <Text.BoldDescriptor fontStyle="italic">
              Awaiting invite
            </Text.BoldDescriptor>
          )}
          {adminUser?.id === user.id ? (
            <Tag ml="8px" p="4px" tagStyle="blue">
              You
            </Tag>
          ) : null}
        </SNameWrapper>
        <Text.Primary>{user.email.toLowerCase()}</Text.Primary>
        <SRoleText
          fontWeight="medium"
          color={user.hotelManager ? 'blue' : undefined}
          mt="4px"
        >
          {role}
        </SRoleText>
      </div>
    </SWrapper>
  );
};
