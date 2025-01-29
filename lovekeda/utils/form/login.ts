// import libs
import { z } from 'zod';

// import utils

export const DEFAULT_LOGIN_FORM_VALUES = {
  email: '',
  password: '',
};

export const loginFormSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'This field has to be filled.' })
    .email('This is not a valid email.'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});
