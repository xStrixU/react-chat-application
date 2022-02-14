import clsx from 'clsx';
import { forwardRef, useState } from 'react';

import type { FormFieldProps } from './FormField';

import { ReactComponent as ShowIcon } from 'assets/icons/show-icon.svg';
import { ReactComponent as HideIcon } from 'assets/icons/hide-icon.svg';

import styles from './FormField.module.scss';

export const PasswordFormField = forwardRef<HTMLInputElement, FormFieldProps>(
  ({ title, error, ...props }, ref) => {
    const [isPasswordShown, setIsPasswordShown] = useState(false);

    const togglePasswordIcon = !isPasswordShown ? (
      <ShowIcon
        className={styles.passwordVisibilityIcon}
        onClick={() => setIsPasswordShown(true)}
      />
    ) : (
      <HideIcon
        className={styles.passwordVisibilityIcon}
        onClick={() => setIsPasswordShown(false)}
      />
    );

    return (
      <div className={styles.wrapper}>
        <label className={styles.label}>
          <span className={styles.title}>{title}</span>
          <input
            className={clsx(styles.input, error && styles.error)}
            type={!isPasswordShown ? 'password' : 'text'}
            ref={ref}
            {...props}
          />
          {error && (
            <span className={styles.errorMessage}>{error.message}</span>
          )}
        </label>
        {togglePasswordIcon}
      </div>
    );
  }
);

PasswordFormField.displayName = 'PasswordFormField';
