import { useEffect, useState } from 'react';

import { getUser } from 'helpers/user';

import type { UserData, UserUid } from 'types/types';

import defaultProfilePicture from 'assets/images/default-profile-picture.jpg';

import styles from './ProfilePicture.module.scss';

export const ProfilePicture = ({ user }: { user: UserUid | UserData }) => {
  const [profilePicture, setProfilePicture] = useState(
    typeof user === 'string' ? defaultProfilePicture : user.profilePicture
  );

  useEffect(() => {
    if (typeof user === 'string') {
      getUser(user).then(user => setProfilePicture(user.profilePicture));
    }
  }, []);

  return (
    <img src={profilePicture} alt="Profile picture" className={styles.image} />
  );
};
