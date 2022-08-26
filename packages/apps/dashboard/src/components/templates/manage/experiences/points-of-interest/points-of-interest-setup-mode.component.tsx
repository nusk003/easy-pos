import { ReactComponent as AutomatedIcon } from '@src/assets/icons/circuit.svg';
import { ReactComponent as ManualIcon } from '@src/assets/icons/pointing-finger.svg';
import { Row, Text } from '@src/components/atoms';
import { PointsOfInterestSetupModeCard } from '@src/components/organisms';
import React from 'react';
import styled from 'styled-components';
import { SetupMode } from './points-of-interest-setup-modal.component';

const SWrapperContent = styled.div`
  width: 456px;
  padding: 32px;
`;

interface Props {
  onNext: (option: SetupMode) => void;
}

export const PointsOfInterestSetupMode: React.FC<Props> = ({ onNext }) => {
  return (
    <SWrapperContent>
      <Text.Heading>How would you like to set up?</Text.Heading>
      <Row mt="32px">
        <PointsOfInterestSetupModeCard
          onClick={() => onNext(SetupMode.Manual)}
          title="Set up manually to add your own locations"
          subtitle="Add your own points of interest to share with your guests"
          color="orange"
          mr="24px"
          icon={ManualIcon}
        />

        <PointsOfInterestSetupModeCard
          onClick={() => onNext(SetupMode.Automatic)}
          title="Set up automatically using GPS search"
          subtitle="Select which points of interest you wish to add from our search as well as adding your own"
          color="blue"
          icon={AutomatedIcon}
        />
      </Row>
    </SWrapperContent>
  );
};
