import { Thread } from '@hm/sdk';
import { Text } from '@src/components/atoms';
import { MessagesThreadsTile } from '@src/components/organisms';
import { theme } from '@src/components/theme';
import React from 'react';
import { MoonLoader } from 'react-spinners';
import styled from 'styled-components';

const SWrapper = styled.div`
  border-right: 1px solid #e8eaef;

  ${theme.mediaQueries.tablet} {
    border-right: none;
  }
`;

const SHeader = styled.div`
  display: grid;
  gap: 8px;
`;

const SHeaderSection = styled.div`
  display: grid;
  grid-auto-flow: column;
  grid-template-columns: max-content max-content 1fr;
  align-items: center;
`;

const SResolvedThreadsToggleWrapper = styled(SHeaderSection)`
  display: grid;
  grid-auto-flow: column;
  justify-content: start;
  gap: 8px;
  padding-left: 32px;
  border-bottom: 0.5px solid #e8eaef;
  user-select: none;
  height: 50px;

  ${theme.mediaQueries.laptop} {
    padding: 0 12px;
    margin-right: -16px;
  }
`;

const SResolveButton = styled(Text.Body)<{ active: boolean }>`
  font-weight: ${(props) => props.theme.fontWeights.semibold};
  padding: 8px 12px;
  background-color: ${(props) => (props.active ? '#efefef' : undefined)};
  border-radius: 8px;
  cursor: pointer;
`;

const SThreadsTilesWrapper = styled.div`
  height: calc(100vh - 128px);
  overflow-y: scroll;

  ::-webkit-scrollbar {
    display: none;
  }
`;

const SMoonLoader = styled.div<{ threadLength: number }>`
  display: grid;
  justify-content: center;
  margin-top: ${(props) => (!props.threadLength ? 16 : 0)}px;
  margin-bottom: 16px;
`;

interface Props {
  view: 'resolved' | 'unresolved';
  onToggleView: (view: Props['view']) => void;
  onScrollBottom: () => void;
  threads: Array<Thread>;
  isLoadingMore: boolean;
  isEndReached: boolean;
}

export const MessagesSidebar: React.FC<Props> = ({
  view,
  onToggleView,
  onScrollBottom,
  threads,
  isLoadingMore,
  isEndReached,
}) => {
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const bottom =
      e.currentTarget.scrollHeight - e.currentTarget.scrollTop ===
      e.currentTarget.clientHeight;
    if (bottom) {
      if (isEndReached || isLoadingMore) {
        return;
      }
      onScrollBottom();
    }
  };

  return (
    <SWrapper>
      <SHeader>
        <SResolvedThreadsToggleWrapper>
          <SResolveButton
            active={view === 'unresolved'}
            onClick={() => onToggleView('unresolved')}
          >
            Unresolved
          </SResolveButton>
          <SResolveButton
            active={view === 'resolved'}
            onClick={() => onToggleView('resolved')}
          >
            Resolved
          </SResolveButton>
        </SResolvedThreadsToggleWrapper>
      </SHeader>
      <SThreadsTilesWrapper onScroll={handleScroll}>
        {threads.map((thread) => (
          <MessagesThreadsTile thread={thread} key={thread.id} />
        ))}
        {isLoadingMore ? (
          <SMoonLoader threadLength={threads.length}>
            <MoonLoader size={16} color={theme.colors.blue} />
          </SMoonLoader>
        ) : null}
        {!threads.length && !isLoadingMore ? (
          <Text.Body fontWeight="semibold" textAlign="center" mt="16px">
            No {view} messages
          </Text.Body>
        ) : null}
      </SThreadsTilesWrapper>
    </SWrapper>
  );
};
