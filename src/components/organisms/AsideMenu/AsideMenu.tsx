import { AsideProfilePicture } from './AsideProfilePicture/AsideProfilePicture';

import { useAuth } from 'providers/AuthProvider';

import { UsersSearchBar } from 'components/molecules/UsersSearchBar/UsersSearchBar';
import { ChannelsList } from 'components/molecules/ChannelsList/ChannelsList';

import styles from './AsideMenu.module.scss';

export const AsideMenu = () => {
  const { userData } = useAuth();

  if (userData === null) return null;

  return (
    <aside className={styles.aside}>
      <span className={styles.title}>Chat Application</span>
      <div className={styles.userInfoWrapper}>
        <AsideProfilePicture userData={userData} />
        {userData.username}
      </div>
      <UsersSearchBar />
      <ChannelsList />
    </aside>
  );
};
