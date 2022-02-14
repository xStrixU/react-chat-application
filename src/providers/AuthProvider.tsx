import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { getUser } from 'helpers/user';
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

import type { UserData } from 'types/types';

interface AuthContextValue {
  isUserLoaded: boolean;
  user: User | null;
  userData: UserData | null;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isUserLoaded, setIsUserLoaded] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(
    () =>
      onAuthStateChanged(getAuth(), user => {
        setUser(user);
        setIsUserLoaded(true);

        if (user) {
          const { metadata } = user;
          const firstTime = metadata.creationTime === metadata.lastSignInTime;

          setTimeout(
            () => getUser(user.uid).then(setUserData),
            firstTime ? 1000 : 0
          );
        } else {
          setUserData(null);
        }
      }),
    []
  );

  return (
    <AuthContext.Provider value={{ isUserLoaded, user, userData }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth needs to be used inside AuthProvider!');
  }

  return context;
};
