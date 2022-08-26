import { CircleIcon, Text } from '@src/components/atoms';
import { theme } from '@src/components/theme';
import React from 'react';
import { IoMdInformation } from 'react-icons/io';
import { SpaceProps } from 'styled-system';
import { Row } from '@src/components/atoms/row';

type StyleProps = SpaceProps & React.HTMLAttributes<HTMLDivElement>;

interface Props extends StyleProps {
  children: React.ReactNode;
}

export const InfoTooltip: React.FC<Props> = ({ children, ...rest }) => {
  return (
    <Row {...rest}>
      <CircleIcon
        color={theme.colors.white}
        background={theme.textColors.ultraLightGray}
        icon={IoMdInformation}
        width={18}
        innerWidth={18}
        mr="8px"
      />
      <Text.Descriptor color={theme.textColors.lightGray}>
        {children}
      </Text.Descriptor>
    </Row>
  );
};
