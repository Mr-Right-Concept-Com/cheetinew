import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().trim().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const signupSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(50, "Name must be under 50 characters"),
  email: z.string().trim().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain at least one uppercase letter")
    .regex(/[0-9]/, "Must contain at least one number"),
  confirmPassword: z.string(),
  agreedToTerms: z.literal(true, { errorMap: () => ({ message: "You must agree to the terms" }) }),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export const billingSchema = z.object({
  fullName: z.string().trim().min(2, "Full name is required"),
  email: z.string().trim().email("Valid email required"),
  address: z.string().trim().min(3, "Address is required"),
  city: z.string().trim().min(2, "City is required"),
  country: z.string().trim().min(2, "Country is required"),
  zip: z.string().trim().min(3, "ZIP/Postal code is required").max(10, "ZIP code too long"),
});

export const hostingSchema = z.object({
  name: z.string().trim().min(3, "Domain must be at least 3 characters").max(50, "Domain too long")
    .regex(/^[a-zA-Z0-9][a-zA-Z0-9.-]+[a-zA-Z0-9]$/, "Invalid domain format"),
  plan: z.string().min(1, "Please select a plan"),
  region: z.string().min(1, "Please select a region"),
});

export const ticketSchema = z.object({
  subject: z.string().trim().min(5, "Subject must be at least 5 characters").max(100, "Subject too long"),
  description: z.string().trim().min(10, "Description must be at least 10 characters").max(2000, "Description too long"),
  priority: z.enum(["low", "medium", "high", "urgent"]),
  category: z.enum(["general", "billing", "technical", "sales", "abuse"]),
});

export const profileSchema = z.object({
  full_name: z.string().trim().min(2, "Name must be at least 2 characters").max(50, "Name too long"),
  company_name: z.string().trim().max(100, "Company name too long").optional().or(z.literal("")),
  phone: z.string().trim().regex(/^(\+?[\d\s\-().]{7,20})?$/, "Invalid phone format").optional().or(z.literal("")),
});

export const passwordSchema = z.object({
  newPassword: z.string().min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain at least one uppercase letter")
    .regex(/[0-9]/, "Must contain at least one number"),
  confirmPassword: z.string(),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export const clientSchema = z.object({
  name: z.string().trim().min(2, "Name required").max(100),
  email: z.string().trim().email("Valid email required"),
  phone: z.string().trim().optional().or(z.literal("")),
  company: z.string().trim().optional().or(z.literal("")),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
export type BillingInput = z.infer<typeof billingSchema>;
export type HostingInput = z.infer<typeof hostingSchema>;
export type TicketInput = z.infer<typeof ticketSchema>;
export type ProfileInput = z.infer<typeof profileSchema>;
export type PasswordInput = z.infer<typeof passwordSchema>;
export type ClientInput = z.infer<typeof clientSchema>;
