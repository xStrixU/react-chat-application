import clsx from 'clsx';
import { FormEvent, useState } from 'react';

import { useChannel } from 'providers/ChannelProvider';
import { putMessage } from 'helpers/user';

import { ReactComponent as SendIcon } from 'assets/icons/send-icon.svg';

import styles from './MessageInput.module.scss';

export const MessageInput = () => {
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const { channel } = useChannel();

  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (channel === null || !inputValue) return;

    putMessage(channel.channelId, inputValue).then(() =>
      console.log('sent!!!')
    );
    setInputValue('');
  };

  return (
    <form
      className={clsx(styles.form, isInputFocused && styles.focusedForm)}
      onSubmit={handleFormSubmit}
    >
      <input
        type="text"
        placeholder="Your message..."
        value={inputValue}
        className={styles.input}
        onChange={({ target }) => setInputValue(target.value)}
        onFocus={() => setIsInputFocused(true)}
        onBlur={() => setIsInputFocused(false)}
      />
      <button className={styles.iconButton}>
        <SendIcon className={styles.sendIcon} />
      </button>
    </form>
  );
};
