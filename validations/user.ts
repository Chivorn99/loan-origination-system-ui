import { z } from 'zod';

export const UserSchema = z.object({
  id: z.number(),
  username: z.string(),
  email: z.string(),
  role: z.object({
    id: z.number(),
    code: z.string(),  
    name: z.string(),
    description: z.string().optional(), 
  }),
  branch: z.object({
    id: z.number(),
    name: z.string(),
    address: z.string(),
    phone: z.string(),
    status: z.string(),
  }).optional(),
});

export type User = z.infer<typeof UserSchema>;