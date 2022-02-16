import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { getUser } from 'helpers/user';
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import type { UserData } from 'types/types';

interface AuthContextValue {
  isUserLoaded: boolean;
  user: User | null;
  userData: UserData | null;

  setUserData(userData: UserData): void;
  setUserFirstTime(): void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isUserLoaded, setIsUserLoaded] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const isUserFirstTimeRef = useRef(false);

  const setUserFirstTime = () => {
    isUserFirstTimeRef.current = true;
  };

  useEffect(
    () =>
      onAuthStateChanged(getAuth(), user => {
        setUser(user);
        setIsUserLoaded(true);

        if (user) {
          if (isUserFirstTimeRef.current) {
            isUserFirstTimeRef.current = false;
            return;
          }

          getUser(user.uid).then(setUserData);
        } else {
          setUserData(null);
        }
      }),
    []
  );

  return (
    <AuthContext.Provider
      value={{ isUserLoaded, user, userData, setUserData, setUserFirstTime }}
    >
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
