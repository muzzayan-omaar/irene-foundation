import { z } from "zod";

export const donateSchema = z.object({
  fullName: z.string().min(2, "Please enter your full name"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().optional(),
  country: z.string().optional(),
  amount: z.coerce.number().positive("Enter an amount greater than 0"),
  currency: z.string().default("USD"),
  campaignId: z.string().optional(),
  frequency: z.enum(["ONE_TIME", "MONTHLY"]).default("ONE_TIME"),
  message: z.string().optional(),
  isAnonymous: z.boolean().default(false),
});

export type DonateInput = z.infer<typeof donateSchema>;