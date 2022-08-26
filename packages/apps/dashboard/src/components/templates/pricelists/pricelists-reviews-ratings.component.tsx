import { PricelistFeedbackRating } from '@hm/sdk';
import { Text } from '@src/components/atoms';
import { theme } from '@src/components/theme';
import { format } from '@src/util/format';
import React from 'react';
import styled from 'styled-components';
import { color, ColorProps } from 'styled-system';

const SWrapper = styled.div`
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 4px;
  column-gap: 8px;
  align-items: center;
`;

interface SProgressBarProps extends ColorProps {
  progress: number;
}

const SProgressBar = styled.div<SProgressBarProps>`
  width: ${(props) => props.progress * 100}%;
  height: 4px;
  ${color}
  border-radius: 16px;
`;

const SProgressBarWrapper = styled.div`
  height: 4px;
  background-color: rgba(84, 142, 229, 0.1);
  width: 100%;
  border-radius: 16px;
`;

interface Props {
  ratings?: PricelistFeedbackRating[];
}

export const PricelistsReviewsRatings: React.FC<Props> = ({
  ratings = Array.from({ length: 5 }, (_, i) => ({
    percentage: 0,
    count: 0,
    value: i + 1,
  })),
}) => {
  return (
    <SWrapper>
      {ratings.map((rating) => {
        return (
          <>
            <Text.Descriptor>{rating.value} star</Text.Descriptor>
            <SProgressBarWrapper>
              <SProgressBar
                progress={rating.percentage}
                bg={theme.colors.blue}
              />
            </SProgressBarWrapper>
            <Text.Descriptor>
              {format.percentage((rating.percentage * 100).toFixed(0))}
            </Text.Descriptor>
          </>
        );
      })}
    </SWrapper>
  );
};
