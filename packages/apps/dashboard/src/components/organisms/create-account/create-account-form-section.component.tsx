import { Text } from '@src/components/atoms';
import { theme } from '@src/components/theme';
import React from 'react';
import styled from 'styled-components';

export const CreateAccountFormSectionInputWrapper = styled.div`
  display: grid;
  grid-gap: 16px;
`;

const SWrapper = styled.div`
  margin-top: 80px;
  margin-left: 150px;
  width: 504px;

  ${theme.mediaQueries.desktop} {
    margin: 80px auto;
  }
`;

const STitleWrapper = styled.div`
  display: grid;
  grid-gap: 16px;
`;

const SSectionTitle = styled(Text.Primary)`
  font-weight: 600;
  font-size: 18px;
`;

const SSectionSubtitle = styled(Text.Primary)`
  font-size: 14px;
  color: ${theme.textColors.lightGray};
`;

interface SectionWrapperProps {
  visible?: boolean;
}

const SSectionWrapper = styled.div<SectionWrapperProps>`
  grid-gap: 24px;
  margin-bottom: 48px;
  display: ${(props): string | undefined => (props.visible ? 'grid' : 'none')};
`;

const STitleText = styled(Text.Primary)`
  color: ${theme.textColors.gray};
  font-weight: 600;
  font-size: 24px;
`;

interface SectionProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  visible?: boolean;
  children: React.ReactNode;
}

export const CreateAccountFormSection: React.FC<SectionProps> = ({
  title,
  description,
  visible = true,
  children,
}) => {
  return (
    <SSectionWrapper visible={visible}>
      {title ? (
        <STitleWrapper>
          <SSectionTitle>{title}</SSectionTitle>
          {description ? (
            <SSectionSubtitle>{description}</SSectionSubtitle>
          ) : null}
        </STitleWrapper>
      ) : null}
      {children}
    </SSectionWrapper>
  );
};

interface FormProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  children: React.ReactNode;
}

export const CreateAccountForm: React.FC<FormProps> = ({ title, children }) => {
  return (
    <SWrapper>
      <SSectionWrapper visible>
        <STitleText>{title}</STitleText>
      </SSectionWrapper>
      {children}
    </SWrapper>
  );
};
