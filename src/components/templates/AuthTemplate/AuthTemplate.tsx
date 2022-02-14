import { ReactNode } from 'react';

import styles from './AuthTemplate.module.scss';

export const AuthTemplate = ({ children }: { children: ReactNode }) => (
  <div className={styles.wrapper}>
    <div className={styles.box}>{children}</div>
  </div>
);
