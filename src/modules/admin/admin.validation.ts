import { z } from 'zod';
import { Status } from '../user/user.interface';

export const updateUserStatusValidationSchema = z.object({
  status: z.enum([Status.ACTIVE, Status.BLOCK, Status.INACTIVE])
    .refine(
      (val) => [Status.ACTIVE, Status.BLOCK, Status.INACTIVE].includes(val),
      {
        message: "Status must be either ACTIVE, BLOCK, or INACTIVE",
      }
    ),
});