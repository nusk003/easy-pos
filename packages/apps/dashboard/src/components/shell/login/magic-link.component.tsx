import * as Sentry from '@sentry/react';
import { Text, toast } from '@src/components/atoms';
import { theme } from '@src/components/theme';
import { useStore } from '@src/store';
import { sdk } from '@src/xhr/graphql-request';
import { queryMap } from '@src/xhr/query';
import React, {
  KeyboardEvent as ReactKeyboardEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { FaTelegramPlane } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { cache } from 'swr';

const fadeIn = keyframes`
  from {
    opacity: 0
  }

  to {
    opacity: 1
  }
`;

const SMagicLinkWrapper = styled.div`
  position: fixed;
  display: grid;
  justify-content: center;
  align-content: center;
  justify-items: center;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  grid-auto-rows: min-content;
  text-align: center;
  gap: 8px;
  opacity: 0;

  animation: ${fadeIn} 0.7s;
  animation-fill-mode: forwards;
`;

const STokenInputWrapper = styled.div`
  display: grid;
  grid-auto-flow: column;
  gap: 12px;
`;

const STokenInput = styled.input`
  width: 30px;
  height: 30px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial,
    sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji';
  border-style: none;
  border-radius: 8px;
  border: 1px solid ${theme.textColors.ashGray};
  text-align: center;
  font-size: 20px;
  padding: 4px;

  :focus-visible {
    outline: ${theme.colors.blue} auto 1px;
  }

  :disabled {
    background: ${theme.colors.fadedGray};
  }
`;

interface Props {
  email: string;
  verificationTokenOnly?: boolean;
}

export const MagicLink: React.FC<Props> = ({
  email: propsEmail,
  verificationTokenOnly,
}) => {
  const location = useLocation<{ email: string }>();

  const email = (propsEmail || location.state?.email).trim().toLowerCase();

  const [isTokenLoginLoading, setIsTokenLoginLoading] = useState(false);

  const tokenRefs = [...Array(6).keys()].map(() =>
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useRef<HTMLInputElement>(null)
  );

  const { setLoggedIn } = useStore(
    useCallback(
      (state) => ({
        setLoggedIn: state.setLoggedIn,
      }),
      []
    )
  );

  useEffect(() => {
    tokenRefs[0].current?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTokenLogin = async () => {
    const verificationToken = tokenRefs
      .map((ref) => ref.current?.value)
      .join('');

    setIsTokenLoginLoading(true);

    try {
      const { userTokenLogin: user } = await sdk.userTokenLogin({
        email,
        password: '',
      });

      const { setHotelId } = useStore.getState();
      setHotelId(user.hotels?.[0].id);
      cache.set(queryMap.user.key, user);

      Sentry.configureScope((scope) => {
        if (process.env.REACT_APP_STAGE !== 'development') {
          scope.setUser({ email: user!.email });
        }
      });

      localStorage.setItem('loggedIn', 'true');
      setLoggedIn(true);
    } catch {
      toast.warn('Token in not valid');
      setIsTokenLoginLoading(false);

      setTimeout(() => {
        tokenRefs[5].current?.focus();
      });
    }
  };

  useEffect(() => {
    const handleKeyPress = async (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'v') {
        const verificationToken = await navigator.clipboard.readText();

        tokenRefs.forEach((ref, idx) => {
          if (ref.current) {
            ref.current.value = verificationToken[idx];
          }
        });

        handleTokenLogin();
      }
    };

    document.addEventListener('keydown', handleKeyPress);

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  return (
    <SMagicLinkWrapper>
      <FaTelegramPlane color={theme.colors.blue} size={40} />
      {email ? (
        <>
          <Text.MediumHeading mt="16px" fontWeight="medium">
            We&apos;ve sent an email to you at
          </Text.MediumHeading>
          <Text.MediumHeading fontWeight="semibold">{email}</Text.MediumHeading>
        </>
      ) : (
        <Text.MediumHeading fontWeight="medium">
          We&apos;ve sent an email to you at your registered email address
        </Text.MediumHeading>
      )}
      {!verificationTokenOnly ? (
        <Text.Primary mt="16px" fontWeight="medium">
          It contains a magic link that will log you in to your Dashboard
        </Text.Primary>
      ) : null}

      <Text.Primary
        fontWeight="medium"
        color={verificationTokenOnly ? undefined : theme.textColors.lightGray}
        mt="16px"
        mb="8px"
      >
        {verificationTokenOnly ? 'Enter' : 'Or enter'} the token from the email
        below
      </Text.Primary>

      <STokenInputWrapper>
        {[...Array(6).keys()].map((refId) => {
          const handleChange = (e: ReactKeyboardEvent<HTMLInputElement>) => {
            e.preventDefault();

            if (!tokenRefs[refId].current) {
              return;
            }

            let value = '';
            let isValid = false;

            if (/^[0-9]$/.test(e.key)) {
              value = e.key;

              if (refId < 5) {
                tokenRefs[refId + 1].current!.focus();
              }

              if (
                ![...Array(6).keys()].some(
                  (id) => !tokenRefs[id].current?.value && id !== refId
                )
              ) {
                isValid = true;
              }
            } else if (e.key === 'Backspace') {
              if (refId > 0) {
                tokenRefs[refId - 1].current!.focus();
              }
            } else if (e.key === 'Tab') {
              if (e.shiftKey && refId > 0) {
                tokenRefs[refId - 1].current!.focus();
              } else if (refId < 5) {
                tokenRefs[refId + 1].current!.focus();
              }

              value = tokenRefs[refId].current!.value;
            } else if (tokenRefs[refId].current!.value) {
              value = tokenRefs[refId].current!.value;
            }

            tokenRefs[refId].current!.value = value;

            if (isValid) {
              handleTokenLogin();
            }
          };

          return (
            <STokenInput
              onKeyDown={handleChange}
              key={refId}
              ref={tokenRefs[refId]}
              disabled={isTokenLoginLoading}
            />
          );
        })}
      </STokenInputWrapper>
    </SMagicLinkWrapper>
  );
};
