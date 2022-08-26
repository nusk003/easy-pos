import { CircleIcon, Text } from '@src/components/atoms';
import { theme } from '@src/components/theme';
import React from 'react';
import styled from 'styled-components';
import { space, SpaceProps } from 'styled-system';

type StyleProps = SpaceProps & React.HTMLAttributes<HTMLDivElement>;

const SContentWrapper = styled.div`
  display: flex;
  cursor: pointer;
  flex-direction: column;
  align-items: center;
  padding: 16px;
  border-radius: 16px;
  text-align: center;
  border: 1px solid ${theme.colors.lightGray};
  width: 196px;
  height: 200px;
  ${space}
`;

type color = 'orange' | 'blue';
interface Props extends StyleProps {
  color?: color;
  icon: React.FC<any>;
  title: string;
  subtitle: string;
}

export const PointsOfInterestSetupModeCard: React.FC<Props> = ({
  icon,
  color,
  title,
  subtitle,
  ...rest
}) => {
  return (
    <SContentWrapper {...rest}>
      <CircleIcon
        width={40}
        icon={icon}
        background={
          color === 'blue' ? theme.colors.lightBlue : theme.colors.lightOrange
        }
        color={color === 'blue' ? theme.colors.blue : theme.colors.orange}
      />
      <Text.Body
        mt="16px"
        color={color === 'blue' ? theme.colors.blue : theme.colors.orange}
        fontWeight="semibold"
      >
        {title}
      </Text.Body>
      <Text.Body mt="16px" color={theme.textColors.lightGray}>
        {subtitle}
      </Text.Body>
    </SContentWrapper>
  );
};
