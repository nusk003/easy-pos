import React from 'react';
import styled from 'styled-components';
import { Text } from '@src/components/atoms';
import { useHistory, useLocation } from 'react-router-dom';
import { getThreadTimeFromNow } from '@hm/messages';
import MarkdownIt from 'markdown-it';
import parseHTML from 'html-react-parser';
import { MessageAuthor, Thread } from '@hm/sdk';
import { theme } from '@src/components/theme';

const SWrapper = styled.div<{ selected: boolean }>`
  display: grid;
  grid-template-columns: max-content auto;
  align-items: center;
  padding: 16px;
  padding-left: 0;
  height: 52px;
  background: ${(props): string =>
    props.selected ? props.theme.colors.fadedBlue : props.theme.colors.white};
  cursor: pointer;
  user-select: none;

  transition: background 0.3s;
`;

const SUnreadBullet = styled.div`
  text-align: center;
  width: 32px;

  ${theme.mediaQueries.tablet} {
    width: 24px;
  }
`;

const SNameWrapper = styled.div`
  display: grid;
  grid-auto-flow: column;
  align-items: center;
  justify-content: space-between;
`;

const SNameText = styled(Text.Interactive)`
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  word-break: break-all;
  width: 100%;
`;

const SMessageText = styled(Text.Body)`
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  word-break: break-word;
`;

const parseMessage = (text: string | undefined) => {
  if (!text) {
    return '';
  }

  const md = new MarkdownIt({ html: true });

  const markdownText = md.renderInline(text);
  const jsx = parseHTML(markdownText);

  return jsx;
};

interface Props {
  thread: Thread;
}

export const MessagesThreadsTile: React.FC<Props> = ({ thread }) => {
  const history = useHistory();
  const location = useLocation();

  const author = thread.lastMessage?.author;

  const handleClick = () => {
    history.push(`/messages/${thread.id}`, { thread });
  };

  if (!thread) {
    return null;
  }

  return (
    <SWrapper
      onClick={handleClick}
      selected={location.pathname.includes(thread.id)}
    >
      <SUnreadBullet>
        {author === MessageAuthor.Guest && !thread.resolved ? (
          <Text.Body color="blue">•</Text.Body>
        ) : null}
      </SUnreadBullet>
      <div>
        <SNameWrapper>
          <SNameText>
            {thread.guest?.firstName} {thread.guest?.lastName}
          </SNameText>
          <Text.Descriptor ml="8px">
            {getThreadTimeFromNow(thread.dateUpdated)}
          </Text.Descriptor>
        </SNameWrapper>
        <SMessageText
          mt="tiny"
          fontWeight={author === MessageAuthor.Guest ? 'semibold' : 'regular'}
        >
          {parseMessage(thread.lastMessage?.text)}
        </SMessageText>
      </div>
    </SWrapper>
  );
};
