import clsx from 'clsx';
import { useChannel } from 'providers/ChannelProvider';

import { ProfilePicture } from 'components/atoms/ProfilePicture/ProfilePicture';

import type { Channel } from 'types/types';

import styles from './ChannelsList.module.scss';

const ChannelListItem = ({
  channel: { channelId, userData },
  isCurrentChannel,
  onClick,
}: {
  channel: Channel;
  isCurrentChannel: boolean;
  onClick(): void;
}) => (
  <div
    key={channelId}
    className={clsx(styles.channel, isCurrentChannel && styles.currentChannel)}
    onClick={onClick}
  >
    <ProfilePicture user={userData} />
    <span className={styles.username}>{userData.username}</span>
  </div>
);

export const ChannelsList = () => {
  const { channel, channels, setChannel } = useChannel();

  return (
    <div className={styles.wrapper}>
      <span className={styles.title}>All Messages</span>
      {channels.map(ch => (
        <ChannelListItem
          key={ch.channelId}
          channel={ch}
          isCurrentChannel={
            channel !== null && channel.channelId === ch.channelId
          }
          onClick={() => setChannel(ch)}
        />
      ))}
    </div>
  );
};
