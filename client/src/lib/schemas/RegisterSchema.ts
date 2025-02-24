import { z } from 'zod';
const passwordRegex = new RegExp(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[A-Z])(?=.*\W)[A-Za-z\d\W]{6,}$/);
export const registerSchema = z.object({
    //username: z.string().min(1, "Username is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().regex(passwordRegex, "Password must contain at least one letter & one number & 1 capital letter and special character").min(6, "Password must be at least 6 characters long"),
    //confirmPassword: z.string().min(6, "Confirm Password must be at least 6 characters long").regex(passwordRegex, "Confirm Password must contain at least one letter and one number")
//}).refine(data => data.password === data.confirmPassword, {
    //message: "Passwords don't match",
    //path: ["confirmPassword"],
});

export type RegisterSchema = z.infer<typeof registerSchema>;