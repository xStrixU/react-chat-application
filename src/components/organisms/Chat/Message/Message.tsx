import clsx from 'clsx';
import { ProfilePicture } from 'components/atoms/ProfilePicture/ProfilePicture';
import { useAuth } from 'providers/AuthProvider';

import type { ChannelMessage } from 'types/types';

import styles from './Message.module.scss';

export const Message = ({ message }: { message: ChannelMessage }) => {
  const { user } = useAuth();

  if (!user) return null;

  const { uid, firstName, lastName } = message.userData;
  const isOwnMessage = uid === user.uid;

  return (
    <div className={clsx(styles.wrapper, isOwnMessage && styles.wrapperOwn)}>
      <ProfilePicture user={message.userData} />
      <div>
        <span className={styles.username}>
          {isOwnMessage ? 'You' : `${firstName} ${lastName}`}
        </span>
        <div
          className={`${styles.message} ${
            isOwnMessage ? styles.messageOwn : styles.messageNotOwn
          }`}
        >
          {message.content}
        </div>
      </div>
    </div>
  );
};
