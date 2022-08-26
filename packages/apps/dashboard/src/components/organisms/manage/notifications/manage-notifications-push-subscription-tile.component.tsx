import { UserPushSubscription } from '@hm/sdk';
import { Link, Tag, Text } from '@src/components/atoms';
import { Inputs } from '@src/components/molecules';
import { theme } from '@src/components/theme';
import React from 'react';
import styled from 'styled-components';

const SDeviceWrapper = styled.div`
  display: grid;
  grid-auto-flow: column;
  grid-template-columns: max-content;
  align-items: center;
  gap: 8px;
`;

const SCheckboxWrapper = styled.div`
  display: grid;
  grid-template-columns: min-content min-content;
  align-items: center;
  gap: 32px;

  ${theme.mediaQueries.tablet} {
    margin-bottom: 16px;
    grid-template-columns: auto;
    gap: 4px;
  }
`;

const SCheckbox = styled(Inputs.Checkbox)`
  font-weight: ${(props) => props.theme.fontWeights.medium};

  div:nth-child(3) {
    display: none;
  }

  ${theme.mediaQueries.tablet} {
    div:nth-child(3) {
      display: block;
    }
  }
`;

interface Props {
  pushSubscription: UserPushSubscription;
  onSubscribeNotification: (pushSubscriptionId: string, sound: boolean) => void;
  onUnsubscribeNotification: (pushSubscriptionId: string) => void;
  loading: boolean;
}

export const ManageNotificationsPushSubscriptionTile: React.FC<Props> = ({
  pushSubscription,
  onSubscribeNotification,
  onUnsubscribeNotification,
  loading,
}) => {
  const deviceId = localStorage.getItem('deviceId');

  return (
    <>
      <SDeviceWrapper>
        <Text.Primary fontWeight="medium">
          {pushSubscription.device.os} -{' '}
          <Text.Primary as="span">
            {pushSubscription.device.browser}
          </Text.Primary>
        </Text.Primary>
        {deviceId === pushSubscription.id ? (
          <Tag tagStyle="gray">This device</Tag>
        ) : null}
      </SDeviceWrapper>

      <SCheckboxWrapper>
        <SCheckbox
          name="sound"
          sideLabel="Sound"
          toggle
          disabled={!pushSubscription.enabled || loading}
          noRegister
          value={!pushSubscription.enabled || pushSubscription.sound}
          onClick={(value) =>
            onSubscribeNotification(pushSubscription.id, value)
          }
        />
        {pushSubscription.enabled ? (
          <Link
            linkStyle="red"
            onClick={() => onUnsubscribeNotification(pushSubscription.id)}
            disableOnClick={false}
          >
            Disable notifications
          </Link>
        ) : (
          <Link
            onClick={() => onSubscribeNotification(pushSubscription.id, true)}
            disableOnClick={false}
          >
            Enable notifications
          </Link>
        )}
      </SCheckboxWrapper>
    </>
  );
};
