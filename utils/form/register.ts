// import libs
import { z } from 'zod';

// import utils

export const DEFAULT_REGISTER_FORM_VALUES = {
  name: '',
  email: '',
  password: '',
  passwordConfirm: '',
};

export const registerFormSchema = z
  .object({
    name: z.string().min(1, { message: 'Name must be at least 3 characters long.' }),
    email: z
      .string()
      .min(1, { message: 'This field has to be filled.' })
      .email('This is not a valid email.'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    passwordConfirm: z.string().min(8, 'Password must be at least 8 characters'),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: 'Passwords do not match',
    path: ['passwordConfirm'],
  });
