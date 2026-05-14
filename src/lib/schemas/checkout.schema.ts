import { z } from "zod";

export const checkoutSchema = z.object({
  customerName: z.string().min(2, "Name is required"),
  customerEmail: z.string().email("Valid email required"),
  customerPhone: z.string().min(10, "Valid phone number required").max(14),
  address: z.string().min(5, "Address is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(1, "State is required"),
  notes: z.string().optional(),
});

export type CheckoutFormValues = z.infer<typeof checkoutSchema>;
