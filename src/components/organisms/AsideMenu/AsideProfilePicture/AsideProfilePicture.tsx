import Swal from 'sweetalert2';
import { getAuth } from 'firebase/auth';
import { ChangeEvent, useRef, useState } from 'react';

import { setProfilePicture } from 'helpers/user';

import { ProfilePicture } from 'components/atoms/ProfilePicture/ProfilePicture';

import { UserData } from 'types/types';

import styles from './AsideProfilePicture.module.scss';

export const AsideProfilePicture = ({ userData }: { userData: UserData }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const uploadFileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadFile = async ({
    target,
  }: ChangeEvent<HTMLInputElement>) => {
    if (target.files !== null) {
      const image = target.files[0];

      await setProfilePicture(image);

      Swal.fire({
        toast: true,
        icon: 'success',
        title: 'New profile picture has been uploaded!',
        position: 'top-right',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
    }
  };

  const handleUploadProfilePics = () => {
    const { current } = uploadFileInputRef;

    if (current !== null) {
      current.click();
    }
  };

  return (
    <div
      className={styles.wrapper}
      onMouseEnter={() => setIsMenuOpen(true)}
      onMouseLeave={() => setIsMenuOpen(false)}
    >
      <ProfilePicture user={userData} />
      {isMenuOpen && (
        <div className={styles.menu}>
          <input
            type="file"
            className={styles.uploadFileInput}
            ref={uploadFileInputRef}
            onChange={handleUploadFile}
          />
          <button
            className={styles.menuButton}
            onClick={handleUploadProfilePics}
          >
            Upload new image
          </button>
          <button
            className={styles.menuButton}
            onClick={() => getAuth().signOut()}
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
};
