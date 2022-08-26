import { Text } from '@src/components/atoms';
import { theme } from '@src/components/theme';
import axios from 'axios';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { NotionRenderer } from 'react-notion';
import { useHistory } from 'react-router';
import MoonLoader from 'react-spinners/MoonLoader';
import styled from 'styled-components';

import 'react-notion/src/styles.css';

const SWrapper = styled.div<{ visible: boolean }>`
  position: absolute;
  right: ${(props) => (props.visible ? '0' : 'calc(min(-40vw, -500px))')};
  visibility: ${(props) => (props.visible ? 'visible' : 'hidden')};
  width: 40vw;
  min-width: 500px;
  z-index: 100000;
  height: 100vh;
  background: #fff;
  overflow: auto;
  box-shadow: 0px 8px 50px rgba(100, 100, 100, 0.25);

  ${theme.mediaQueries.tablet} {
    right: ${(props) => (props.visible ? '0' : 'calc(min(-100vw, -500px))')};
    width: 100vw;
    min-width: unset;
  }

  & div > main {
    padding: 24px;
  }

  .notion-page-header {
    display: none;
  }

  .notion-page {
    margin-top: 0px;
  }

  .notion-blank {
    display: none;
  }

  .notion-page-link {
    cursor: pointer;
    user-select: none;
  }

  .notion-title {
    margin-top: 0;
  }

  scrollbar-width: thin;
  scrollbar-color: #bbb #fff;

  ::-webkit-scrollbar {
    width: 11px;
    height: 20px;
  }

  ::-webkit-scrollbar-track {
    background-clip: content-box;
    border-top-right-radius: 12px;
    border-bottom-right-radius: 12px;
    border: 20px solid transparent;
  }

  ::-webkit-scrollbar-thumb {
    background-color: #bbb;
    border-radius: 12px;
    border: 3px solid #fff;
  }

  transition: right 0.3s;
  transition-delay: 0, 0.3s;
  transition-property: right, visibility;
`;

const SHeaderWrapper = styled.div`
  padding: 24px;
  padding-bottom: 16px;
  background: #fff;
  position: sticky;
  top: 0;
  z-index: 10000;

  display: grid;
  grid-auto-flow: column;
  justify-content: space-between;
  align-items: center;
`;

const SHeaderButton = styled(Text.Heading)`
  cursor: pointer;
  user-select: none;
`;

const SCloseButton = styled(Text.Primary)<{ visible: boolean }>`
  align-items: center;
  justify-content: center;
  gap: 6px;
  z-index: 10001;

  display: grid;
  visiblity: ${(props) => (props.visible ? 'visible' : 'hidden')};
  position: fixed;
  top: 16px;
  right: ${(props) => (props.visible ? 16 : -80)}px;

  background: #fff;
  box-shadow: 0px 8px 50px rgba(100, 100, 100, 0.5);
  width: 48px;
  height: 48px;
  border-radius: 50%;

  cursor: pointer;
  user-select: none;

  transition: right 0.4s;
`;

const SLoadingIndicatorWrapper = styled.div<{ loading: boolean }>`
  height: ${(props) => (props.loading ? '100vh' : '0')};
  display: grid;
  align-items: center;
  justify-content: center;
`;

const SLoadingIndicator = styled(MoonLoader)<{ loading: boolean }>`
  display: ${(props) => (props.loading ? 'block' : 'none')};
`;

interface NotionTablePageMap {
  page: string;
  slug: string;
}

interface Props {
  visible: boolean;
  onSupportClose: () => void;
}

export const Support: React.FC<Props> = ({ visible, onSupportClose }) => {
  const history = useHistory();

  const [blockMap, setBlockMap] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const notionHistory = useRef<string[]>([]);

  const handleGoBack = () => {
    if (notionHistory.current.length === 1) {
      if (notionHistory.current[0] === 'ba10cee87735432d89ef5f790a768004') {
        return;
      }

      fetchPage('ba10cee87735432d89ef5f790a768004');
      return;
    }

    notionHistory.current = notionHistory.current.slice(0, -1);

    const lastPageId = notionHistory.current.pop();

    if (lastPageId) {
      fetchPage(lastPageId);
    }
  };

  const pushHistory = (pageId: string) => {
    const lastPageId = notionHistory.current[notionHistory.current.length - 1];

    if (pageId !== lastPageId) {
      notionHistory.current.push(pageId);
    }
  };

  const fetchPage = useCallback(
    async (pageId?: string) => {
      setIsLoading(true);

      try {
        if (!pageId) {
          const { data: table } = await axios.get(
            'https://notion-api.splitbee.io/v1/table/82696b2e1dac4096b8791dbdb2085119'
          );

          const pageMap: NotionTablePageMap = table.find(
            (page: NotionTablePageMap) => {
              return page.slug === history.location.pathname;
            }
          );

          if (!pageMap) {
            pageId = 'ba10cee87735432d89ef5f790a768004';
          } else {
            pageId = pageMap.page;
          }
        }

        pushHistory(pageId);

        const { data } = await axios.get(
          `https://notion-api.splitbee.io/v1/page/${pageId}`
        );

        setBlockMap(data);
      } finally {
        setIsLoading(false);
      }
    },
    [history.location.pathname]
  );

  const redirectLinks = useCallback(() => {
    if (!visible) {
      return;
    }

    document
      .querySelectorAll<HTMLAnchorElement>('.notion-page-link')
      .forEach((el) => {
        el.onclick = function (this: GlobalEventHandlers, event: MouseEvent) {
          event.preventDefault();
          const el = this as HTMLAnchorElement;
          const id = el.getAttribute('href')?.replace(/\//g, '');
          fetchPage(id);
        };

        el.setAttribute('id', el.href.split('/')[3]);
      });
  }, [fetchPage, visible]);

  useEffect(() => {
    redirectLinks();
  }, [redirectLinks, blockMap]);

  useEffect(() => {
    if (visible) {
      fetchPage();
    }
  }, [fetchPage, visible]);

  useEffect(() => {
    if (!visible) {
      notionHistory.current = [];
    }
  }, [visible]);

  useEffect(() => {
    notionHistory.current = [];
  }, [history.location.pathname]);

  return (
    <SWrapper visible={visible}>
      <SHeaderWrapper>
        <SHeaderButton fontWeight="semibold" onClick={handleGoBack}>
          {'← Back'}
        </SHeaderButton>
        <SCloseButton
          visible={visible}
          fontWeight="semibold"
          onClick={onSupportClose}
        >
          ✕
        </SCloseButton>
      </SHeaderWrapper>
      <SLoadingIndicatorWrapper loading={isLoading}>
        <SLoadingIndicator size={24} loading={isLoading} />
      </SLoadingIndicatorWrapper>
      {blockMap ? <NotionRenderer fullPage={true} blockMap={blockMap} /> : null}
    </SWrapper>
  );
};
