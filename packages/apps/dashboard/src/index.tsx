import * as Sentry from '@sentry/react';
import React from 'react';
import ReactDOM from 'react-dom';
import { App } from './app.component';

if (process.env.REACT_APP_STAGE !== 'development') {
  Sentry.init({
    dsn: 'https://5bfa16b8f0ef45a5af528fa8dd7059c1@o429361.ingest.sentry.io/5375794',
    environment: process.env.REACT_APP_STAGE,
  });
}

ReactDOM.render(<App />, document.getElementById('root'));
