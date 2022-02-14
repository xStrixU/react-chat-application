import { Navigate, Route, Routes } from 'react-router-dom';

import { useAuth } from 'providers/AuthProvider';

import { AuthTemplate } from 'components/templates/AuthTemplate/AuthTemplate';

import { SignInPage } from 'pages/AuthPages/SignInPage';
import { SignUpPage } from 'pages/AuthPages/SignUpPage';

export const AuthView = () => {
  const { user } = useAuth();

  if (user) {
    return <Navigate to="/" />;
  }

  return (
    <AuthTemplate>
      <Routes>
        <Route path="/sign-in" element={<SignInPage />} />
        <Route path="/sign-up" element={<SignUpPage />} />
      </Routes>
    </AuthTemplate>
  );
};
