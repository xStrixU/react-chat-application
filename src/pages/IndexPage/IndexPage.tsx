import { Navigate } from 'react-router-dom';

import { useAuth } from 'providers/AuthProvider';

import { AsideMenu } from 'components/organisms/AsideMenu/AsideMenu';
import { LoadingSpinner } from 'components/atoms/LoadingSpinner/LoadingSpinner';
import { Chat } from 'components/organisms/Chat/Chat';

import styles from './IndexPage.module.scss';

export const IndexPage = () => {
  const { isUserLoaded, user, userData } = useAuth();

  if (user === null) {
    return isUserLoaded ? <Navigate to="/auth/sign-in" /> : null;
  }

  if (userData === null) {
    return (
      <div className={styles.loadingWrapper}>
        <LoadingSpinner />
        <span>Loading</span>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <AsideMenu />
      <Chat />
    </div>
  );
};
