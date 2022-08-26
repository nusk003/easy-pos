import { CircleIcon, Row, Text } from '@src/components/atoms';
import { Card } from '@src/components/molecules';
import React from 'react';
import styled from 'styled-components';
import { SpaceProps } from 'styled-system';

type StyledProps = SpaceProps;

interface Props extends StyledProps {
  icon: React.FC;
  iconColor: string;
  iconBackgroundColor: string;
  count: number;
  countSuffix: string;
  description?: string | React.ReactNode;
}

const SDescriptionWrapper = styled.div`
  margin-top: 4px;
`;

export const BookingsOverviewCard: React.FC<Props> = ({
  icon,
  iconBackgroundColor,
  iconColor,
  count,
  countSuffix,
  description,
  ...rest
}) => {
  return (
    <Card {...rest} cardStyle="white-shadow" maxWidth={370}>
      <Row>
        <CircleIcon
          icon={icon}
          color={iconColor}
          background={iconBackgroundColor}
        />
        <div>
          <Row>
            <Text.BodyBold mr="4px">{count}</Text.BodyBold>
            <Text.Body>{countSuffix}</Text.Body>
          </Row>
          {description ? (
            <SDescriptionWrapper>
              {typeof description === 'string' ? (
                <Text.Body>{description}</Text.Body>
              ) : (
                description
              )}
            </SDescriptionWrapper>
          ) : null}
        </div>
      </Row>
    </Card>
  );
};
