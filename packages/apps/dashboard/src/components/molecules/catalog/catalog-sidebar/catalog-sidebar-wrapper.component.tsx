import { theme } from '@src/components/theme';
import styled from 'styled-components';

export const CatalogSidebarWrapper = styled.div<{ visible: boolean }>`
  position: fixed;
  z-index: 5001;
  top: 76.5px;
  right: ${(props) => (props.visible ? 0 : '-492px')};
  visibility: ${(props) => (props.visible ? 'visible' : 'hidden')};
  height: calc(100vh - 76.5px - 24px);
  width: 440px;
  padding: 24px;
  padding-right: 28px;
  padding-top: 0;

  border-left: 1px solid ${theme.colors.lightGray};
  background-color: ${(props) => props.theme.colors.white};

  overflow-y: scroll;
  ::-webkit-scrollbar {
    display: none;
  }

  ${theme.mediaQueries.tablet} {
    top: 61px;
    padding-right: 28px;
    width: calc(100vw - 48px);
    height: calc(100vh - 60px - 24px);
  }

  transition: right 0.3s;
  transition-delay: 0, 0.3s;
  transition-property: right, visibility;
`;
