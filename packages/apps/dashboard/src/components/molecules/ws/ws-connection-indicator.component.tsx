import { ReactComponent as ConnectedIcon } from '@src/assets/icons/connected-icon.svg';
import { ReactComponent as DisconnectedIcon } from '@src/assets/icons/disconnected-icon.svg';
import { Tooltip } from '@src/components/atoms';
import React, { useCallback } from 'react';
import { useStore } from '@src/store';

export const WSConnectionIndicator = () => {
  const { WSStatus } = useStore(
    useCallback(
      (state) => ({
        WSStatus: state.WSStatus,
      }),
      []
    )
  );

  const connectionMessage =
    WSStatus === 'open'
      ? "You're auto-receiving live updates"
      : "You're not connected to live updates";

  return (
    <Tooltip message={connectionMessage}>
      {WSStatus === 'open' ? <ConnectedIcon /> : <DisconnectedIcon />}
    </Tooltip>
  );
};
