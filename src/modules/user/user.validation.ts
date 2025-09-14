import z from "zod";
import { Role } from "./user.interface";

export const createuserZodSchema = z.object({
      name: z.string({ message: "Name must be string" }).min(2, { message: "name too short. Mimimum 2 character long" }).max(20, { message: "Name is too long" }),
      email: z.string({ message: "Email mush be string" }).email({ message: "Invalid email address format" }).min(5, { message: "email must be at least 5 characters long" }).max(100, { message: "email cannot exceed 1000 characters" }),
      password: z.string({ message: "password must be string" })
            .min(8, { message: "Password must be at least 8 characters long" })
            .regex(/^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/, {
                  message: "Password must contain at least 1 uppercase letter, 1 number, and 1 special character"
            }),
      phone: z.string({ message: "Phone must be string" })
            .regex(/^(\+91|91)?[6-9]\d{9}$/, { message: "Invalid Indian phone number format. Must be 10 digits starting with 6-9 or +91/91 prefix" }).optional(),
      address: z.string({ message: "Address must be string" })
            .max(200, { message: "Address cannot exceed 200 characters" })
            .optional(),


})
export const updateZodSchema = z.object({
      name: z.string({ message: "Name must be string" }).min(2, { message: "name too short. Mimimum 2 character long" }).max(20, { message: "Name is too long" }).optional(),

      password: z.string({ message: "password must be string" })
            .min(8, { message: "Password must be at least 8 characters long" })
            .regex(/^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/, {
                  message: "Password must contain at least 1 uppercase letter, 1 number, and 1 special character"
            }).optional(),
      phone: z.string({ message: "Phone must be string" })
            .regex(/^(\+91|91)?[6-9]\d{9}$/, { message: "Invalid Indian phone number format. Must be 10 digits starting with 6-9 or +91/91 prefix" }).optional(),
      address: z.string({ message: "Address must be string" })
            .max(200, { message: "Address cannot exceed 200 characters" })
            .optional(),
      role: z.enum(Object.values(Role) as [string]).optional(),


})