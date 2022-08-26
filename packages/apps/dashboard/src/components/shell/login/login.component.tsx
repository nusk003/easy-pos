import { ReactComponent as Logo } from '@src/assets/logos/logo-full-blue.svg';
import { Button, Link, Text, toast } from '@src/components/atoms';
import { Inputs } from '@src/components/molecules';
import { Form } from '@src/components/templates';
import { theme } from '@src/components/theme';
import { __electron__ } from '@src/constants';
import { validationResolver } from '@src/util/form';
import React, { useState } from 'react';
import { FormContext, useForm } from 'react-hook-form';
import { useLocation } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import * as z from 'zod';
import { MagicLink } from './magic-link.component';
import loginBg from '@src/assets/login/login-bg.jpg';
import { sdk } from '@src/xhr/graphql-request';
import { useStore } from '@src/store';

const fadeIn = keyframes`
  from {
    opacity: 0
  }

  to {
    opacity: 1
  }
`;

interface LoggedInProps {
  loggedIn: boolean;
}

const SLoginWrapper = styled.div<LoggedInProps>`
  height: 100vh;
  /* background: #eef5fe; */
  background-image: url(${loginBg}),
    linear-gradient(rgb(0, 0, 0, 0), rgba(222, 157, 26, 0.05));
  background-blend-mode: overlay;
  background-position: 0 0;
  background-repeat: no-repeat;
  background-size: cover;
  visibility: ${(props) => (props.loggedIn ? 'hidden' : 'visible')};
  opacity: ${(props) => (props.loggedIn ? 0 : 1)};

  transition: opacity 0.7s, visibility 0.7s;
  transform: translateZ(0);
`;

const SLogo = styled(Text.SuperHeading)<LoggedInProps>`
  width: 210px;
  height: auto;
  margin-bottom: 16px;
  visibility: ${(props) => (props.loggedIn ? 'hidden' : 'visible')};
  opacity: ${(props) => (props.loggedIn ? 0 : 1)};
  font-weight: bold;
  animation: ${fadeIn} 0.7s;
  transition: opacity 0.7s, visibility 0.7s;
  transform: translateZ(0);
`;

const loginCardAnimation = keyframes`
  from {
    width: 100%;
  }

  to {
    width: 400px;
  }
`;

const SLoginCard = styled.div<LoggedInProps>`
  height: 100%;
  padding: 0 64px;
  background: ${theme.colors.white};

  display: grid;

  width: ${(props) => (props.loggedIn ? '100%' : '400px')};
  visibility: ${(props) => (props.loggedIn ? 'hidden' : 'visible')};

  animation: ${loginCardAnimation} 0.7s;
  transition: width 0.7s, visibility 0.7s;
  transform: translateZ(0);

  ${theme.mediaQueries.tablet} {
    padding: 0 32px;
    width: calc(100% - 64px);
    justify-items: center;

    animation: none;
    transition: visibility 0.7s;
  }
`;

const SFormProvider = styled(Form.Provider)<LoggedInProps>`
  width: 100%;
  max-width: 400px;
  align-content: center;
  visibility: ${(props) => (props.loggedIn ? 'hidden' : 'visible')};
  opacity: ${(props) => (props.loggedIn ? 0 : 1)};

  animation: ${fadeIn} 0.7s;
  transition: opacity 0.7s, visibility 0.7s;
  transform: translateZ(0);
`;

const formSchema = z.object({
  email: z.string().email('Please enter your email'),
  password: z.string().nonempty('Please enter your password'),
});

type FormValues = z.infer<typeof formSchema>;

export const Login: React.FC = () => {
  const { search } = useLocation();

  const searchParams = new URLSearchParams(search);

  const [state, setState] = useState({ loggedIn: false, email: '' });
  const [submitLoading, setSubmitLoading] = useState(false);

  const formMethods = useForm<FormValues>({
    validationContext: formSchema,
    validationResolver,
  });

  const { setLoggedIn } = useStore(({ setLoggedIn }) => ({ setLoggedIn }));

  const isConnectLogin =
    searchParams.has('marketplace_id') && searchParams.has('redirect_url');

  const handleLogin = async ({ email, password }: FormValues) => {
    setSubmitLoading(true);
    try {
      await sdk.userTokenLogin({ email, password });
      setState((s) => ({ ...s, loggedIn: true, email }));
      setLoggedIn(true);
    } catch {
      toast.warn(
        'We were unable to find a Easy POS account with that email address'
      );
    }
    setSubmitLoading(false);
  };

  return (
    <>
      {/* {state.loggedIn ? (
        <MagicLink
          email={state.email}
          verificationTokenOnly={isConnectLogin || __electron__}
        />
      ) : null} */}
      <SLoginWrapper loggedIn={state.loggedIn}>
        <SLoginCard loggedIn={state.loggedIn}>
          <FormContext {...formMethods}>
            <SFormProvider
              gridGap="large"
              loggedIn={state.loggedIn}
              onSubmit={formMethods.handleSubmit(handleLogin)}
            >
              <SLogo loggedIn={state.loggedIn}>EasyPOS</SLogo>
              <Inputs.Text name="email" placeholder="Email" type="email" />
              <Inputs.Text
                name="password"
                placeholder="Password"
                type="password"
              />
              <Button
                buttonStyle="primary"
                loading={submitLoading}
                type="submit"
                style={{ width: '100%' }}
                py="medium"
              >
                Login {isConnectLogin ? 'to connect' : null}
              </Button>
            </SFormProvider>
          </FormContext>
        </SLoginCard>
      </SLoginWrapper>
    </>
  );
};
