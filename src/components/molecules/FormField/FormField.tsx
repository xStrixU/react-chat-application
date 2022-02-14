import clsx from 'clsx';
import { forwardRef } from 'react';
import { FieldError } from 'react-hook-form';

import type { InputHTMLAttributes } from 'react';

import styles from './FormField.module.scss';

export type FormFieldProps = Readonly<
  {
    title: string;
    error: FieldError | undefined;
  } & InputHTMLAttributes<HTMLInputElement>
>;

export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  ({ title, error, type = 'text', ...props }, ref) => (
    <label className={styles.label}>
      <span className={styles.title}>{title}</span>
      <input
        className={clsx(styles.input, error && styles.error)}
        type={type}
        ref={ref}
        {...props}
      />
      {error && <span className={styles.errorMessage}>{error.message}</span>}
    </label>
  )
);

FormField.displayName = 'FormField';
