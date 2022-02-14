import { Route, Routes } from 'react-router-dom';

import { IndexPage } from 'pages/IndexPage/IndexPage';

import { AuthView } from 'views/AuthView';

export const Root = () => (
  <Routes>
    <Route path="/" element={<IndexPage />} />
    <Route path="/auth/*" element={<AuthView />} />
  </Routes>
);
