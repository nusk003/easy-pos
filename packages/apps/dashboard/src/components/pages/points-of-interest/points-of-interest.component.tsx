import { PointsOfInterestCatalog } from '@src/components/templates';
import { useAttraction } from '@src/xhr/query';
import React, { useEffect } from 'react';
import { useHistory } from 'react-router';

export const PointsOfInterest: React.FC = () => {
  const history = useHistory();

  const { data: attraction, isValidating: isAttractionValidating } =
    useAttraction();

  useEffect(() => {
    if (!isAttractionValidating && !attraction) {
      history.push('/manage/experiences/points-of-interest');
    }
  }, [attraction, history, isAttractionValidating]);

  if (attraction) {
    return <PointsOfInterestCatalog />;
  }

  return null;
};
