import { object, ref, string } from 'yup';

export const signInSchema = object({
  email: string().required('Email is required'),
  password: string().required('Password is required'),
}).required();

export const signUpSchema = object({
  firstName: string().required('First name is required'),
  lastName: string().required('Last name is required'),
  email: string().email('Invalid email format').required('Email is required'),
  password: string()
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.{8,})/,
      'Password must contains at least 8 characters, one lowercase and uppercase'
    )
    .required('Password is required'),
  confirmPassword: string()
    .oneOf([ref('password'), null], 'Confirm password does not match')
    .required('Confirm password is required'),
}).required();
