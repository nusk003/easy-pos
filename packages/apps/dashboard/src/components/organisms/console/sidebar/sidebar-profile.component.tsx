import { Text, TextAvatar } from '@src/components/atoms';
import { Verify } from '@src/components/molecules';
import { theme } from '@src/components/theme';
import { logout } from '@src/util/auth';
import { useUser } from '@src/xhr/query';
import React, { useState } from 'react';
import styled from 'styled-components';

const SWrapper = styled.div<{ isMenuVisible: boolean }>`
  display: grid;
  margin-left: 8px;
  grid-auto-flow: column;
  gap: 8px;
  justify-content: start;
  align-items: center;
  user-select: none;
  margin-top: 16px;

  ${theme.mediaQueries.desktop} {
    display: ${(props) => (!props.isMenuVisible ? 'none' : undefined)};
  }
`;

const SNameText = styled(Text.Body)`
  width: 136px;
  font-weight: ${(props) => props.theme.fontWeights.medium};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const SSignOutLink = styled(Text.BoldDescriptor)`
  color: ${(props) => props.theme.textColors.lightGray};
  cursor: pointer;
  user-select: none;
`;

interface Props {
  isMenuVisible: boolean;
}

export const SidebarProfile: React.FC<Props> = ({ isMenuVisible }) => {
  const { data: user } = useUser(false);

  const [isVerifyVisible, setIsVerifyVisible] = useState(false);

  return (
    <SWrapper isMenuVisible={isMenuVisible}>
      <TextAvatar
        size={40}
        background="linear-gradient(150deg, #0784f8 20%, #7dbeff 100%)"
        color={theme.textColors.white}
      >
        {user ? `${user?.firstName?.[0]}${user?.lastName?.[0]}` : ''}
      </TextAvatar>
      <div>
        <SNameText>
          {user?.firstName} {user?.lastName}
        </SNameText>
        <Verify
          visible={isVerifyVisible}
          modal
          type="delete"
          title="Sign out"
          buttonText="Sign Out"
          message="Are you sure you want to sign out?"
          onVerify={logout}
          onClose={() => setIsVerifyVisible(false)}
        >
          <SSignOutLink onClick={() => setIsVerifyVisible(true)}>
            Sign out
          </SSignOutLink>
        </Verify>
      </div>
    </SWrapper>
  );
};
