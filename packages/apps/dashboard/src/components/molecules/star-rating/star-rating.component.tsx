import { Row } from '@src/components/atoms';
import { theme } from '@src/components/theme';
import React, { useMemo } from 'react';
import { MdStar } from 'react-icons/md';
import styled from 'styled-components';

const SStarIcon = styled(MdStar).attrs({
  size: 20,
})``;

interface Props {
  rating: number;
}

export const StarRating: React.FC<Props> = ({ rating }) => {
  const stars = useMemo(() => {
    const s = [];

    for (let i = 0; i < rating; i++) {
      s.push(<SStarIcon key={i} color={theme.colors.blue} />);
    }

    return s;
  }, [rating]);

  return <Row>{stars}</Row>;
};
