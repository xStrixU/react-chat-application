import { useChannel } from 'providers/ChannelProvider';

import { Message } from './Message/Message';
import { MessageInput } from './MessageInput/MessageInput';

import styles from './Chat.module.scss';

export const Chat = () => {
  const { channel, messages } = useChannel();

  if (channel === null) {
    return <div className={styles.selectUserWrapper}>Select user to chat</div>;
  }

  const { userData } = channel;

  return (
    <div className={styles.chatWrapper}>
      <div className={styles.header}>
        Chatting with: {userData.firstName} {userData.lastName}
      </div>
      <div className={styles.messagesWrapper}>
        {messages.map((message, i) => (
          <Message key={i} message={message} />
        ))}
      </div>
      <MessageInput />
    </div>
  );
};
