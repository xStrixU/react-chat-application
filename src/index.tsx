import React from 'react';
import ReactDOM from 'react-dom';

import { AppProviders } from 'providers/AppProviders';
import { Root } from 'Root';

import './utils/firebase';
import './assets/styles/styles.scss';

ReactDOM.render(
  <React.StrictMode>
    <AppProviders>
      <Root />
    </AppProviders>
  </React.StrictMode>,
  document.getElementById('root')
);
