import {
  CreateAccountBilling,
  CreateAccountHotel,
  CreateAccountUser,
} from '@src/components/templates';
import { theme } from '@src/components/theme';
import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import styled from 'styled-components';

const SCreateAccountWrapper = styled.div`
  display: grid;
  grid-template-columns: 480px auto;
  overflow-y: auto;
  height: 100vh;

  ${theme.mediaQueries.desktop} {
    grid-template-columns: auto;
  }
`;

const SSidebar = styled.div`
  width: 480px;
  background: #f1f3f5;
  min-height: 100vh;

  ${theme.mediaQueries.desktop} {
    display: none;
  }
`;

export const CreateAccount: React.FC = () => {
  return (
    <SCreateAccountWrapper>
      <SSidebar />
      <Switch>
        <Route
          path={['/create-account/user', '/join/:userId']}
          component={CreateAccountUser}
        />
        <Route path="/create-account/hotel" component={CreateAccountHotel} />
        <Route
          path="/create-account/billing"
          component={CreateAccountBilling}
        />
        <Redirect to="/create-account/user" />
      </Switch>
    </SCreateAccountWrapper>
  );
};
