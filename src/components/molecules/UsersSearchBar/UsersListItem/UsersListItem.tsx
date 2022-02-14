import { ProfilePicture } from 'components/atoms/ProfilePicture/ProfilePicture';

import type { UserData } from 'types/types';

import styles from './UsersListItem.module.scss';

interface UsersListItemProps {
  userData: UserData;

  onClick(): void;
}

export const UsersListItem = ({ userData, onClick }: UsersListItemProps) => (
  <div className={styles.wrapper} onClick={onClick}>
    <ProfilePicture user={userData} />
    <span className={styles.username}>
      {userData.firstName} {userData.lastName}
    </span>
  </div>
);
