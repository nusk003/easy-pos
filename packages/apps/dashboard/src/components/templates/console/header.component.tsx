import { Text, useTitle } from '@src/components/atoms';
import { DropdownMenu, WSConnectionIndicator } from '@src/components/molecules';
import { theme } from '@src/components/theme';
import { useStore } from '@src/store';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { MdMoreVert } from 'react-icons/md';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';

const SWrapper = styled.div<{ backgroundColor?: string; loggedIn?: boolean }>`
  display: grid;
  position: sticky;
  top: 0;
  grid-auto-flow: column;
  justify-content: space-between;
  padding: 0 32px;
  padding-right: 32px;
  margin-right: -16px;
  border-bottom: 0.5px solid #e8eaef;
  user-select: none;
  align-items: center;
  height: 76px;
  background: ${(props) => props.backgroundColor || '#fff'};
  z-index: 10000;
  white-space: nowrap;

  ${theme.mediaQueries.tablet} {
    height: 60px;
    padding-left: 48px;
    padding-right: ${(props) => (props.loggedIn ? '16px' : undefined)};
  }
`;

const STitleWrapper = styled.div`
  display: grid;
  grid-auto-flow: column;
  gap: 8px;
  padding-right: 16px;
  align-items: center;
`;

const STitle = styled(Text.Heading)`
  cursor: pointer;
  font-weight: ${(props) => props.theme.fontWeights.semibold};
`;

const SActionsWrapper = styled.div`
  display: grid;
  grid-auto-flow: column;
  gap: 16px;
  align-items: center;
`;

const SDropdownButtonWrapper = styled.div`
  box-shadow: 0px 0.5px 2px rgba(86, 80, 104, 0.25);
  border-radius: 6px;
  height: 28px;
  width: 40px;
  display: grid;
  align-items: center;
  justify-content: center;
  user-select: none;
  cursor: pointer;
`;

interface Props {
  title: string;
  indicator?: React.ReactNode;
  primaryButton?: React.ReactNode;
  secondaryButton?: React.ReactNode;
  backgroundColor?: string;
  dropdownButtons?: Array<{ title: string; onClick: () => void }>;
  onBack?: () => void;
}

export const Header: React.FC<Props> = ({
  title,
  indicator,
  primaryButton,
  secondaryButton,
  backgroundColor,
  dropdownButtons,
  onBack,
}) => {
  const { loggedIn } = useStore(
    useCallback(
      (state) => ({
        loggedIn: state.loggedIn,
      }),
      []
    )
  );

  const { setTitle } = useTitle();

  const history = useHistory();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      history.goBack();
    }
  };

  const dropdownButtonRef = useRef<HTMLDivElement>(null);

  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  useEffect(() => {
    if (loggedIn) {
      setTitle(title);
    }
  }, [loggedIn, setTitle, title]);

  return (
    <SWrapper backgroundColor={backgroundColor} loggedIn={loggedIn}>
      <STitleWrapper>
        <STitle onClick={handleBack}>← {title}</STitle>
        {indicator === null ? null : indicator || <WSConnectionIndicator />}
      </STitleWrapper>

      <SActionsWrapper>
        {dropdownButtons ? (
          <>
            <SDropdownButtonWrapper
              ref={dropdownButtonRef}
              onClick={() => setIsDropdownVisible((s) => !s)}
            >
              <MdMoreVert size="20px" />
            </SDropdownButtonWrapper>
            <DropdownMenu.MenuWrapper
              buttonRef={dropdownButtonRef}
              onClose={() => setIsDropdownVisible(false)}
              visible={isDropdownVisible}
            >
              {dropdownButtons.map((button) => (
                <DropdownMenu.Item key={button.title} onClick={button.onClick}>
                  {button.title}
                </DropdownMenu.Item>
              ))}
            </DropdownMenu.MenuWrapper>
          </>
        ) : null}

        {secondaryButton}
        {primaryButton}
      </SActionsWrapper>
    </SWrapper>
  );
};
