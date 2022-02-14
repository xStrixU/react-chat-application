import type { ReactNode } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import { AuthProvider } from './AuthProvider';
import { ChannelProvider } from './ChannelProvider';

export const AppProviders = ({ children }: { children: ReactNode }) => (
  <Router>
    <AuthProvider>
      <ChannelProvider>{children}</ChannelProvider>
    </AuthProvider>
  </Router>
);
