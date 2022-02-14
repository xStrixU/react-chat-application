import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { FirebaseError } from 'firebase/app';
import { Link, useNavigate } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';

import type { InferType } from 'yup';

import { signUp } from 'helpers/user';
import { signUpSchema } from 'schemas/auth';

import { FormField } from 'components/molecules/FormField/FormField';
import { PasswordFormField } from 'components/molecules/FormField/PasswordFormField';

import styles from './AuthPages.module.scss';

type FormValues = InferType<typeof signUpSchema>;

export const SignUpPage = () => {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<FormValues>({
    reValidateMode: 'onSubmit',
    resolver: yupResolver(signUpSchema),
  });
  const [authError, setAuthError] = useState('');
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<FormValues> = async data => {
    const { firstName, lastName, email, password } = data;

    try {
      await signUp(email, password, { firstName, lastName });

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
      <h1 className={styles.title}>Sign up</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormField
          title="First name"
          error={errors.firstName}
          {...register('firstName')}
        />
        <FormField
          title="Last name"
          error={errors.lastName}
          {...register('lastName')}
        />
        <FormField title="Email" error={errors.email} {...register('email')} />
        <PasswordFormField
          title="Password"
          error={errors.password}
          {...register('password')}
        />
        <PasswordFormField
          title="Confirm password"
          error={errors.confirmPassword}
          {...register('confirmPassword')}
        />
        {authError && (
          <span className={styles.error}>
            An error occurred while registration: {authError}
          </span>
        )}
        <button className={styles.button}>Sign up</button>
      </form>
      <div className={styles.footer}>
        Already have an account?
        <Link to="/auth/sign-in" className={styles.link}>
          Sign in
        </Link>
      </div>
    </>
  );
};
