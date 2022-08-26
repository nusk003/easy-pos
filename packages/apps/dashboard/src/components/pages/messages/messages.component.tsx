import { Message, MessageAuthor } from '@hm/sdk';
import { ReactComponent as MessagesIcon } from '@src/assets/icons/message-button-icon.svg';
import { Button, toast } from '@src/components/atoms';
import { ToggleDropdown } from '@src/components/molecules';
import {
  Header,
  MessagesSidebar,
  MessagesThread,
} from '@src/components/templates';
import { theme } from '@src/components/theme';
import { useStore } from '@src/store';
import { NewMessageResponse } from '@src/xhr';
import { sdk } from '@src/xhr/graphql-request';
import {
  useHotel,
  useThreadsInfinite,
  useUnreadThreadCount,
} from '@src/xhr/query';
import React, { useCallback, useEffect, useState } from 'react';
import { Route, Switch, useHistory, useLocation } from 'react-router-dom';
import styled from 'styled-components';

const SWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  height: calc(100vh - 166px);

  ${theme.mediaQueries.laptop} {
    grid-template-columns: repeat(8, 1fr);
  }
`;

const SNewChatButton = styled(Button)<{ isNewChatVisible: boolean }>`
  ${theme.mediaQueries.tablet} {
    display: ${(props) => (props.isNewChatVisible ? 'none' : undefined)};
  }
`;

const SThreadsSidebarWrapper = styled.div<{ threadVisible: boolean }>`
  display: grid;
  grid-column: 1 / 5;

  ${theme.mediaQueries.laptop} {
    grid-column: 1 / 4;
  }

  ${theme.mediaQueries.tablet} {
    display: ${(props) => (!props.threadVisible ? undefined : 'none')};
    grid-column: 1 / 9;
  }
`;

const SThreadWrapper = styled.div<{ threadVisible: boolean }>`
  display: grid;
  grid-column: 5 / 13;

  ${theme.mediaQueries.laptop} {
    grid-column: 4 / 9;
  }

  ${theme.mediaQueries.tablet} {
    grid-column: 1 / 9;
    display: ${(props) => (props.threadVisible ? undefined : 'none')};
  }
`;

export const Messages: React.FC = () => {
  const history = useHistory();
  const location = useLocation();
  const threadId = location.pathname.split('/messages/')[1];

  const {
    data: hotel,
    isValidating: isHotelValidating,
    mutate: mutateHotel,
  } = useHotel();

  const [isNewChatVisible, setIsNewChatVisible] = useState(false);

  const { ws } = useStore(useCallback((state) => ({ ws: state.WS }), []));

  const [state, setState] = useState<{ view: 'resolved' | 'unresolved' }>({
    view: 'unresolved',
  });

  const limit = 20;

  const {
    data: threadsStack,
    setSize,
    size,
    mutate: mutateThreads,
    error,
  } = useThreadsInfinite({
    resolved: state.view === 'resolved',
    limit,
  });

  const isThreadEmpty = !threadsStack || threadsStack.length === 0;

  const isThreadsReachingEnd =
    isThreadEmpty || (threadsStack && threadsStack?.[size - 1]?.length < limit);

  const isLoadingInitialThreads = !threadsStack && !error;

  const isThreadsLoadingMore =
    isLoadingInitialThreads ||
    (size > 0 &&
      threadsStack &&
      typeof threadsStack?.[size - 1] === 'undefined');

  const { mutate: mutateUnreadThreadCount } = useUnreadThreadCount(false);

  const handleOnUpdateThreads = (message: Message) => {
    mutateThreads((threads) => {
      if (!threads) {
        threads = [];
      }

      const flatThreads = [...threads.flat()];
      const threadIdx = flatThreads.findIndex(
        (t) => t.id === message.thread.id
      );

      if (threadIdx > -1) {
        const thread = flatThreads[threadIdx];
        thread.lastMessage = message;
        thread.dateUpdated = new Date();
        if (thread.resolved) {
          thread.resolved = false;

          if (state.view === 'unresolved') {
            flatThreads.splice(threadIdx, 1);
            flatThreads.unshift(thread);
          } else {
            setState({ view: 'unresolved' });
          }
        } else {
          flatThreads.splice(threadIdx, 1);
          flatThreads.unshift(thread);
        }
      } else if (message.author === MessageAuthor.Guest) {
        flatThreads.unshift({
          id: message.thread.id,
          guest: message.guest,
          lastMessage: message,
          dateCreated: new Date(message.dateCreated),
          dateUpdated: new Date(message.dateUpdated),
        });
      }

      return [flatThreads];
    }, false);
  };

  const handleOnMessage = useCallback(
    (response: NewMessageResponse) => {
      mutateThreads((threads) => {
        if (!threads) {
          threads = [];
        }

        const flatThreads = [...threads.flat()];
        const threadIdx = flatThreads.findIndex(
          (t) => t.id === response.data.thread.id
        );

        if (threadIdx > -1) {
          const thread = flatThreads[threadIdx];
          thread.lastMessage = response.data.message;
          if (thread.resolved) {
            thread.resolved = false;

            if (state.view === 'unresolved') {
              flatThreads.splice(threadIdx, 1);
              flatThreads.unshift(thread);
            } else {
              flatThreads.splice(threadIdx, 1);
            }
          } else {
            flatThreads.splice(threadIdx, 1);
            flatThreads.unshift(thread);
          }
        } else {
          flatThreads.unshift({
            id: response.data.thread.id,
            guest: response.data.thread.guest,
            lastMessage: response.data.message,
            dateCreated: new Date(response.data.message.dateCreated),
            dateUpdated: new Date(response.data.message.dateCreated),
          });
        }

        return [flatThreads];
      }, false);
    },
    [mutateThreads, state.view]
  );

  useEffect(() => {
    ws?.addOnNewMessageListener(handleOnMessage);

    return () => {
      ws?.removeOnNewMessageListener(handleOnMessage);
    };
  }, [handleOnMessage, ws]);

  const handleResolveThread = (id: string) => {
    mutateUnreadThreadCount((count) => {
      if (!count || !threadsStack) {
        return 0;
      }

      const flatThreads = threadsStack.flat();
      const thread = flatThreads.find((thread) => thread.id === id);

      if (!thread) {
        return count;
      }

      if (thread.lastMessage?.author === MessageAuthor.Guest) {
        return count - 1;
      }

      return count;
    }, false);

    mutateThreads((threads) => {
      if (!threads) {
        threads = [];
      }

      const flatThreads = threads.flat();

      const threadIdx = flatThreads.findIndex((thread) => thread.id === id);

      if (threadIdx > -1) {
        flatThreads.splice(threadIdx, 1);
      }

      return [flatThreads];
    }, false);
  };

  const handleToggleEnabled = async (value: boolean) => {
    try {
      await sdk.updateHotel({ data: { messagesSettings: { enabled: value } } });
      toast.info(`Successfully ${value ? 'enabled' : 'disabled'} chat`);
    } catch {
      toast.info(`Unable to ${value ? 'enable' : 'disable'} chat`);
    }

    await mutateHotel();
  };

  const handleOpenNewThread = () => {
    history.push('/messages', { thread: undefined });
    setIsNewChatVisible(true);
  };

  const handleHeaderBack = () => {
    if (isNewChatVisible) {
      setIsNewChatVisible(false);
    } else {
      history.goBack();
    }
  };

  useEffect(() => {
    if (!isHotelValidating && !hotel?.messagesSettings) {
      history.push('/manage/messages');
    }
  }, [history, hotel?.messagesSettings, isHotelValidating]);

  if (!hotel || (hotel && !hotel?.messagesSettings)) {
    return null;
  }

  return (
    <>
      <Header
        title="Chat"
        indicator={
          !hotel?.messagesSettings?.enabled ? (
            <ToggleDropdown
              enabled={!!hotel?.messagesSettings?.enabled}
              onToggle={handleToggleEnabled}
            />
          ) : undefined
        }
        onBack={handleHeaderBack}
        dropdownButtons={[
          {
            title: 'Manage',
            onClick: () => history.push('/manage/messages'),
          },
        ]}
        primaryButton={
          hotel?.messagesSettings?.enabled ? (
            <SNewChatButton
              onClick={handleOpenNewThread}
              leftIcon={<MessagesIcon />}
              buttonStyle="primary"
              isNewChatVisible={isNewChatVisible}
            >
              New Chat
            </SNewChatButton>
          ) : null
        }
      />
      <SWrapper>
        <SThreadsSidebarWrapper threadVisible={!!threadId || isNewChatVisible}>
          <MessagesSidebar
            view={state.view}
            isLoadingMore={!!isThreadsLoadingMore}
            isEndReached={!!isThreadsReachingEnd}
            onToggleView={(view) => setState((s) => ({ ...s, view }))}
            onScrollBottom={() => setSize(size + 1)}
            threads={threadsStack?.filter(Boolean).flat() || []}
          />
        </SThreadsSidebarWrapper>
        <SThreadWrapper threadVisible={!!threadId || isNewChatVisible}>
          <Switch>
            <Route
              path="/messages/:threadId?"
              render={(props) => (
                <MessagesThread
                  {...props}
                  onResolveThread={handleResolveThread}
                  onUpdateThreads={handleOnUpdateThreads}
                />
              )}
            />
          </Switch>
        </SThreadWrapper>
      </SWrapper>
    </>
  );
};
