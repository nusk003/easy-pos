import {
  getMessageDayFromNow,
  getMessageTimeFromNow,
  ParsedMessagesSection,
} from '@hm/messages';
import { MessageAuthor, Thread } from '@hm/sdk';
import { Text } from '@src/components/atoms';
import { theme } from '@src/components/theme';
import { useHotel } from '@src/xhr/query';
import dayjs from 'dayjs';
import parseHTML from 'html-react-parser';
import MarkdownIt from 'markdown-it';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { color, ColorProps } from 'styled-system';

const SWrapper = styled.div``;

const SMessageText = styled(Text.Primary)<ColorProps>`
  word-break: break-word;
  > a {
    text-decoration: none;
    color: ${theme.colors.blue};
  }
  ${color}
`;

interface Props {
  section: ParsedMessagesSection;
  thread: Thread;
}

const parseMessage = (text: string) => {
  const md = new MarkdownIt({
    html: true,
    linkify: true,
    xhtmlOut: true,
    breaks: true,
  });

  const markdownText = md.renderInline(text);

  const jsx = parseHTML(markdownText, {
    replace: (domNode) => {
      if (domNode.name === 'a') {
        return React.createElement(
          'a',
          { ...domNode.attribs, target: '_blank' },
          domNode.children?.[0].data
        );
      }
      return domNode;
    },
  });

  return jsx;
};

export const MessagesSection: React.FC<Props> = ({ section, thread }) => {
  const { data: hotel } = useHotel(false);
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setDate(new Date());
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  const isGuest = section.author === MessageAuthor.Guest;

  return (
    <SWrapper>
      {section.newDay ? (
        <Text.Primary
          color={theme.textColors.lightGray}
          fontWeight="semibold"
          textAlign="center"
        >
          {getMessageDayFromNow(section.dateCreated)}
        </Text.Primary>
      ) : null}

      <Text.Primary
        fontWeight="semibold"
        color={isGuest ? theme.textColors.blue : theme.textColors.lightGray}
        mb={12}
        textAlign={isGuest ? 'left' : 'right'}
      >
        {isGuest ? thread.guest.firstName : hotel?.name}
      </Text.Primary>
      {section.messageStack.map((messageStack) => {
        return (
          <React.Fragment key={String(messageStack.dateCreated)}>
            {messageStack.messages.map((message, idx) => {
              const nextMessage = messageStack.messages[idx + 1];

              const error =
                message.error &&
                dayjs(new Date()).diff(message.dateCreated, 's') > 10;

              const nextMessageError =
                nextMessage?.error &&
                dayjs(new Date()).diff(nextMessage?.dateCreated, 's') > 10;

              return (
                <React.Fragment key={message.id}>
                  <SMessageText
                    textAlign={isGuest ? 'left' : 'right'}
                    color={error ? 'orange' : 'black'}
                    mb={
                      idx === messageStack.messages.length - 1 || error
                        ? undefined
                        : 'small'
                    }
                  >
                    {parseMessage(message.text)}
                  </SMessageText>
                  {error && !nextMessageError ? (
                    <Text.Primary
                      textAlign={isGuest ? 'left' : 'right'}
                      color="orange"
                    >
                      Unable to send
                    </Text.Primary>
                  ) : null}
                </React.Fragment>
              );
            })}
            <Text.Descriptor
              color={theme.textColors.lightGray}
              mb="small"
              mt="tiny"
              textAlign={isGuest ? 'left' : 'right'}
            >
              {getMessageTimeFromNow(messageStack.dateCreated, date)}
            </Text.Descriptor>
          </React.Fragment>
        );
      })}
    </SWrapper>
  );
};
