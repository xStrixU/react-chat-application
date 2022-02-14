import { UsersListItem } from '../UsersListItem/UsersListItem';

import { useChannel } from 'providers/ChannelProvider';

import type { UserData } from 'types/types';

import styles from './UsersList.module.scss';

interface UsersListProps {
  usersData: UserData[] | null;

  reset(): void;
}

export const UsersList = ({ usersData, reset }: UsersListProps) => {
  const { setChannelWithUser } = useChannel();

  const handleUserClick = (userData: UserData) => {
    setChannelWithUser(userData);
    reset();
  };

  return (
    <div className={styles.wrapper}>
      {!usersData ? (
        <span className={styles.span}>Loading...</span>
      ) : (
        <>
          {usersData.length === 0 ? (
            <span className={styles.span}>No such persons were found</span>
          ) : (
            usersData.map(userData => (
              <UsersListItem
                key={userData.uid}
                userData={userData}
                onClick={() => handleUserClick(userData)}
              />
            ))
          )}
        </>
      )}
    </div>
  );
};
