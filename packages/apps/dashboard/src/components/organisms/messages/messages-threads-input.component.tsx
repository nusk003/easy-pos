import { Button } from '@src/components/atoms';
import { theme } from '@src/components/theme';
import React, { useRef } from 'react';
import styled from 'styled-components';
import sanitizeHTML from 'sanitize-html';
import TurndownService from 'turndown';

const td = new TurndownService();

const SWrapper = styled.div`
  display: grid;
  justify-content: space-between;
  border: 1px solid ${theme.colors.gray};
  padding: 8px;
  grid-template-columns: 1fr max-content;
  gap: 16px;
  border-radius: 6px;
  align-items: center;
  align-content: center;
  border: 1px solid #dadce1;
  box-shadow: 0px 0px 4px rgba(170, 177, 196, 0.25);
  margin-top: 8px;
  margin-left: 16px;
`;

const SInput = styled.div`
  outline: 0px solid transparent;
  font-size: 13px;
  line-height: 16px;
  word-break: break-all;

  :empty:before {
    content: attr(placeholder);
    color: ${theme.textColors.lightGray};
  }
`;

const SInputWrapper = styled.div`
  display: grid;
  align-items: center;
`;

interface Props {
  onSend: (message: string) => Promise<boolean>;
}

const sanitizeInput = (input: string): string => {
  const sanitizedInput = sanitizeHTML(input, {
    allowedTags: ['br'],
    allowedAttributes: false,
  });

  return sanitizedInput;
};

export const MessagesThreadsInput: React.FC<Props> = ({ onSend }) => {
  const inputRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async () => {
    if (inputRef.current) {
      if (inputRef.current?.innerText) {
        const markdown = td
          .turndown(sanitizeInput(inputRef.current?.innerHTML))
          .trim()
          // remove escape backslashes
          .replace(/(?:\\(.))/g, '$1');
        const isMessageSent = await onSend(markdown);

        if (isMessageSent) {
          inputRef.current.innerHTML = '';
        }
      }
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.ctrlKey || event.metaKey) {
      if (
        event.key === 'b' ||
        event.key === 'B' ||
        event.key === 'i' ||
        event.key === 'I'
      ) {
        event.preventDefault();
      }
    } else if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSubmit();
    }
  };

  const handlePaste = (event: React.ClipboardEvent<HTMLDivElement>) => {
    event.preventDefault();
    const clipboardText = event.clipboardData.getData('text');
    if (inputRef.current) {
      const selection = window.getSelection();
      if (selection?.rangeCount) {
        selection.deleteFromDocument();

        const nodes = clipboardText.split('\n').flatMap((text) => {
          return [document.createTextNode(text), document.createElement('br')];
        });

        nodes
          .slice(0, nodes.length - 1)
          .reverse()
          .forEach((node) => {
            selection.getRangeAt(0).insertNode(node);
          });

        selection.collapseToEnd();
      }
    }
  };

  return (
    <SWrapper>
      <SInputWrapper>
        <SInput
          contentEditable
          spellCheck
          placeholder="Start typing your message"
          ref={inputRef}
          onKeyDown={handleKeyPress}
          onPaste={handlePaste}
        />
      </SInputWrapper>
      <Button buttonStyle="primary" alignSelf="flex-end" onClick={handleSubmit}>
        Send
      </Button>
    </SWrapper>
  );
};
