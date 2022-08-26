import { OutstandingGuest } from '@hm/sdk';
import { Button, CircleIcon, Text } from '@src/components/atoms';
import { theme } from '@src/components/theme';
import { format } from '@src/util/format';
import React from 'react';
import { MdKeyboardArrowDown, MdPerson } from 'react-icons/md';
import styled from 'styled-components';

const STopLevelWrapper = styled.div`
  display: grid;
  grid-auto-flow: column;
  grid-template-columns: max-content;
`;

const SContentWrapper = styled.div`
  display: grid;
  grid-auto-flow: column;
  justify-content: space-between;
`;

const SInformationWrapper = styled.div`
  display: grid;
  gap: 2px;
`;

const STitleText = styled(Text.Body)`
  display: grid;
  grid-auto-flow: column;
  align-content: center;
  gap: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;
`;

interface Props {
  outstandingGuest: OutstandingGuest;
  onSettleGuest: (outstandingGuest: OutstandingGuest) => void;
  collapsed: boolean;
  onDropdownClick: (outstandingGuest: OutstandingGuest) => void;
}

export const OrdersOutstandingGuestsTile: React.FC<Props> = ({
  outstandingGuest,
  collapsed,
  onDropdownClick,
  onSettleGuest,
}) => {
  const handleToggleDropdown = () => {
    if (onDropdownClick) {
      onDropdownClick(outstandingGuest);
    }
  };

  return (
    <STopLevelWrapper>
      <CircleIcon icon={MdPerson} color={theme.colors.altBlue} width={32} />
      <SContentWrapper>
        <SInformationWrapper>
          <STitleText onClick={handleToggleDropdown} fontWeight={600}>
            {outstandingGuest.guest.firstName} {outstandingGuest.guest.lastName}
            {collapsed ? (
              <MdKeyboardArrowDown onClick={handleToggleDropdown} />
            ) : null}
          </STitleText>
        </SInformationWrapper>
        <Button
          preventDoubleClick
          onClick={() => onSettleGuest(outstandingGuest)}
          buttonStyle="secondary"
          ml="8px"
        >
          Settle total {format.currency(outstandingGuest.totalPrice)}
        </Button>
      </SContentWrapper>
    </STopLevelWrapper>
  );
};
