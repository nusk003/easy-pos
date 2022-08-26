import { theme } from '@src/components/theme';
import styled, { css } from 'styled-components';
import {
  color,
  ColorProps,
  grid,
  GridProps,
  layout,
  LayoutProps,
  space,
  SpaceProps,
  typography,
  TypographyProps,
  border,
  BorderProps,
  flexbox,
  FlexboxProps,
} from 'styled-system';

type StyledSystemProps = SpaceProps &
  TypographyProps &
  ColorProps &
  GridProps &
  LayoutProps &
  BorderProps &
  FlexboxProps;

const styledSystem = css`
  ${space}
  ${typography}
  ${color}
  ${grid}
  ${layout}
  ${border}
  ${flexbox}
`;

const SuperHeading = styled.div<StyledSystemProps>`
  font-size: 1.25rem;
  line-height: 1.5rem;
  color: ${theme.textColors.gray};
  ${styledSystem}
`;

const Heading = styled.div<StyledSystemProps>`
  font-size: 1.125rem;
  line-height: 1.25rem;
  color: ${theme.textColors.gray};
  ${styledSystem}
`;

const MediumHeading = styled.div<StyledSystemProps>`
  font-size: 1rem;
  line-height: 1.25rem;
  color: ${theme.textColors.gray};
  ${styledSystem}
`;

const SmallHeading = styled.div<StyledSystemProps>`
  font-size: 0.75rem;
  line-height: 0.875rem;
  color: ${theme.textColors.gray};
  text-transform: uppercase;
  font-weight: 600;
  ${styledSystem}
`;

const Interactive = styled.div<StyledSystemProps>`
  font-size: 0.875rem;
  line-height: 1.125rem;
  color: ${theme.textColors.gray};
  font-weight: 600;
  ${styledSystem}
`;

const Primary = styled.div<StyledSystemProps>`
  color: ${theme.textColors.gray};
  font-size: 0.875rem;
  line-height: 1.125rem;
  ${styledSystem}
`;

const Body = styled.div<StyledSystemProps>`
  color: ${theme.textColors.gray};
  font-size: 0.8125rem;
  line-height: 1rem;
  ${styledSystem}
`;

const BodyBold = styled.div<StyledSystemProps>`
  color: ${theme.textColors.gray};
  font-size: 0.8125rem;
  line-height: 1rem;
  font-weight: 600;
  ${styledSystem}
`;

const Descriptor = styled.div<StyledSystemProps>`
  color: ${theme.textColors.lightGray};
  font-size: 12.5px;
  line-height: 1rem;
  ${styledSystem}
`;

const BoldDescriptor = styled.div<StyledSystemProps>`
  color: ${theme.textColors.lightGray};
  font-size: 0.8125rem;
  line-height: 1rem;
  font-weight: 600;
  ${styledSystem}
`;

const Secondary = styled.div<StyledSystemProps>`
  color: ${theme.textColors.lightGray};
  font-size: 0.75rem;
  line-height: 0.875rem;
  ${styledSystem}
`;

const SecondarySubtitle = styled.div<StyledSystemProps>`
  color: ${theme.textColors.lightGray};
  font-size: 0.75rem;
  line-height: 0.875rem;
  ${styledSystem}
`;

const Notes = styled.div<StyledSystemProps>`
  color: ${theme.textColors.ultraLightGray};
  font-size: 0.75rem;
  line-height: 0.8125rem;
  ${styledSystem}
`;

export const Text = {
  SuperHeading,
  Heading,
  MediumHeading,
  SmallHeading,
  Interactive,
  Body,
  BodyBold,
  Primary,
  Descriptor,
  BoldDescriptor,
  Secondary,
  SecondarySubtitle,
  Notes,
};
