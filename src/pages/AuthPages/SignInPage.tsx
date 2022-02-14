import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { FirebaseError } from 'firebase/app';
import { Link, useNavigate } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';

import type { InferType } from 'yup';

import { signIn } from 'helpers/firebase';
import { signInSchema } from 'schemas/auth';

import { FormField } from 'components/molecules/FormField/FormField';
import { PasswordFormField } from 'components/molecules/FormField/PasswordFormField';

import styles from './AuthPages.module.scss';

type FormValues = InferType<typeof signInSchema>;

export const SignInPage = () => {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<FormValues>({
    reValidateMode: 'onSubmit',
    resolver: yupResolver(signInSchema),
  });
  const [authError, setAuthError] = useState('');
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<FormValues> = async data => {
    const { email, password } = data;

    try {
      await signIn(email, password);

      navigate('/');
    } catch (err) {
      if (err instanceof FirebaseError) {
        setAuthError(err.code);
      } else {
        console.error(err);
      }
    }
  };

  return (
    <>
      <h1 className={styles.title}>Sign in</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormField title="Email" error={errors.email} {...register('email')} />
        <PasswordFormField
          title="Password"
          error={errors.password}
          {...register('password')}
        />
        {authError && (
          <span className={styles.error}>
            An error occurred while logging in: {authError}
          </span>
        )}
        <button className={styles.button}>Sign in</button>
        <Link to="/" className={`${styles.link} ${styles.forgotPassword}`}>
          Forgot password?
        </Link>
      </form>
      <div className={styles.footer}>
        <span>Don&apos;t have an account?</span>
        <Link to="/auth/sign-up" className={styles.link}>
          Sign up
        </Link>
      </div>
    </>
  );
};
