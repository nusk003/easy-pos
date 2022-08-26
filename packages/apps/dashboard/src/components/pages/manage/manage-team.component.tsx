import React, { useState } from 'react';
import { Header } from '@src/components/templates';
import styled from 'styled-components';
import { theme } from '@src/components/theme';
import { User, UserRole } from '@hm/sdk';
import { Button, Text } from '@src/components/atoms';
import {
  ManageTeamUserTile,
  ManageTeamAddUserModal,
} from '@src/components/organisms';
import { getUserRole, getReadableUserRole } from '@src/util/users';
import { useUsers, useUser } from '@src/xhr/query';
import { FaUserAlt } from 'react-icons/fa';

const SWrapper = styled.div`
  min-height: calc(100vh - 141px);
  margin-right: -16px;

  background: #fafafa;
  padding: 32px;

  display: grid;
  align-content: start;
  gap: 32px;

  ${theme.mediaQueries.tablet} {
    padding: 16px;
    min-height: calc(100vh - 101px);
  }
`;

const SUserTilesWrapper = styled.div`
  display: grid;
  row-gap: 16px;
  column-gap: 32px;
  grid-template-columns: auto auto;
  align-items: center;
  padding-bottom: 24px;
  user-select: none;
  justify-content: start;

  ${theme.mediaQueries.tablet} {
    grid-template-columns: auto;
  }
`;

const SRoleText = styled(Text.Primary)`
  ${theme.mediaQueries.tablet} {
    display: none;
  }
`;

const SHeaderText = styled(SRoleText)``;

export const ManageTeam = () => {
  const { data: users } = useUsers();
  const { data: adminUser } = useUser();

  const [state, setState] = useState<{
    isAddUserModalVisible: boolean;
    addUserModalDefaultValues?: User;
  }>({ isAddUserModalVisible: false, addUserModalDefaultValues: undefined });

  const toggleAddUserModal = (user?: User) => {
    setState((s) => {
      if (!s.isAddUserModalVisible) {
        return {
          ...s,
          isAddUserModalVisible: !s.isAddUserModalVisible,
          addUserModalDefaultValues: user,
        };
      }
      return {
        ...s,
        isAddUserModalVisible: !s.isAddUserModalVisible,
      };
    });
  };

  const adminUserRole = getUserRole(adminUser);

  if (!adminUser) {
    return null;
  }

  return (
    <>
      <Header
        title="Team"
        primaryButton={
          adminUserRole !== UserRole.HotelMember ? (
            <Button
              buttonStyle="primary"
              leftIcon={<FaUserAlt size={10} />}
              onClick={() => toggleAddUserModal()}
            >
              Invite user
            </Button>
          ) : null
        }
        backgroundColor="#fafafa"
      />

      <SWrapper>
        <div>
          <Text.Primary fontWeight="semibold">Team</Text.Primary>
          <Text.Descriptor mt="8px">
            Manage team members and their permissions.
          </Text.Descriptor>
        </div>

        <SUserTilesWrapper>
          <SHeaderText mb="small" fontWeight="medium">
            User
          </SHeaderText>
          <SHeaderText mb="small" fontWeight="medium">
            Role
          </SHeaderText>

          <>
            <ManageTeamUserTile
              onClick={() => toggleAddUserModal(adminUser)}
              user={adminUser}
            />
            <SRoleText
              fontWeight="medium"
              color={adminUser.hotelManager ? 'blue' : undefined}
            >
              {getReadableUserRole(adminUser)}
            </SRoleText>
          </>

          {users?.map((user) => {
            const role = getReadableUserRole(user);
            return (
              <React.Fragment key={user.id}>
                <ManageTeamUserTile
                  onClick={() => toggleAddUserModal(user)}
                  user={user}
                />
                <SRoleText
                  fontWeight="medium"
                  color={user.hotelManager ? 'blue' : undefined}
                >
                  {role}
                </SRoleText>
              </React.Fragment>
            );
          })}
        </SUserTilesWrapper>
      </SWrapper>

      <ManageTeamAddUserModal
        onClose={toggleAddUserModal}
        visible={state.isAddUserModalVisible}
        defaultValues={state.addUserModalDefaultValues}
      />
    </>
  );
};
