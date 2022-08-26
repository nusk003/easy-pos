import { Text } from '@src/components/atoms';
import { theme } from '@src/components/theme';
import React from 'react';
import styled from 'styled-components';

const SPricingCardWrapper = styled.div`
  display: grid;
  grid-gap: 24px;
  box-shadow: 0px 4px 16px rgba(18, 45, 115, 0.1);
  border-radius: 12px;
  padding: 16px;
  width: max-content;
`;

const STitleWrapper = styled.div`
  display: grid;
  grid-gap: 8px;
  padding-bottom: 8px;
  width: 180px;
  border-bottom: 0.5px solid #e8eaef;
`;

const SCardHeading = styled(Text.SmallHeading)`
  font-weight: 600;
  font-size: 12px;
  text-transform: uppercase;
  color: ${theme.textColors.ashGray};
`;

const SPriceNotes = styled(Text.Notes)`
  padding-left: 4px;
  font-size: 12px;
  font-weight: normal;
  align-self: center;
  color: ${theme.textColors.altBlue};
`;

const SPriceText = styled(Text.Primary)`
  display: flex;
  font-weight: 600;
  font-size: 24px;
  color: ${theme.textColors.altBlue};
`;

const SFeaturesWrapper = styled.div`
  display: grid;
  grid-gap: 4px;
`;

const SDetailsWrapper = styled.div`
  display: grid;
  grid-gap: 8px;
  justify-content: center;
`;

const SDetails = styled(Text.Secondary)`
  font-size: 12px;
  color: ${theme.textColors.ashGray};
`;

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  heading: string;
  price: string;
  priceNotes?: string;
  features: Array<string>;
  children: React.ReactNode;
  details: string;
}

export const CreateAccountPricingCard: React.FC<Props> = ({
  heading,
  price,
  priceNotes,
  features,
  children,
  details,
}) => {
  return (
    <SPricingCardWrapper>
      <STitleWrapper>
        <SCardHeading>{heading}</SCardHeading>
        <SPriceText>
          {price}
          {priceNotes ? <SPriceNotes>{priceNotes}</SPriceNotes> : null}
        </SPriceText>
      </STitleWrapper>
      <SFeaturesWrapper>
        {features.map((feature: string) => {
          return (
            <Text.Descriptor fontWeight="medium" key={feature}>
              ✓ {feature}
            </Text.Descriptor>
          );
        })}
      </SFeaturesWrapper>
      <SDetailsWrapper>
        {children}
        <SDetails>{details}</SDetails>
      </SDetailsWrapper>
    </SPricingCardWrapper>
  );
};
