import { ChangeEvent, useEffect, useState } from 'react';

import { findUsers } from 'helpers/user';
import { useDebounce } from 'hooks/useDebounce';

import { ReactComponent as SearchIcon } from 'assets/icons/search-icon.svg';

import type { UserData } from 'types/types';

import styles from './UsersSearchBar.module.scss';
import { UsersList } from './UsersList/UsersList';

export const UsersSearchBar = () => {
  const [inputValue, setInputValue] = useState('');
  const debouncedInputValue = useDebounce(inputValue, 500);

  const [showUsersList, setShowUsersList] = useState(false);
  const [foundUsers, setFoundUsers] = useState<UserData[] | null>(null);

  const reset = (resetInput = true) => {
    setShowUsersList(false);
    setFoundUsers(null);

    if (resetInput) {
      setInputValue('');
    }
  };

  const handleInputChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
    reset(false);
    setInputValue(target.value);
  };

  useEffect(() => {
    if (!debouncedInputValue) {
      return reset();
    }

    const splitted = debouncedInputValue.replace(/\s+/g, ' ').trim().split(' ');

    setShowUsersList(true);
    findUsers(splitted[0] || '', splitted[1] || '').then(setFoundUsers);
  }, [debouncedInputValue]);

  return (
    <div className={styles.wrapper}>
      <input
        className={styles.input}
        placeholder="Search..."
        value={inputValue}
        onChange={handleInputChange}
      />
      <SearchIcon />
      {showUsersList && <UsersList usersData={foundUsers} reset={reset} />}
    </div>
  );
};
