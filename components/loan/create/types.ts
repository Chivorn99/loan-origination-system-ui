import { z } from 'zod';

export interface CustomerForm {
  fullName: string;
  phone: string;
  idNumber: string;
  address: string;
}

export interface ItemForm {
  itemType: string;
  description: string;
  estimatedValue: number;
  photoUrl: string;
}

export interface LoanForm {
  currencyId: number;
  branchId: number;
  loanAmount: string;
  interestRate: string;
  dueDate: string;
  loanDurationDays: number;
  gracePeriodDays: number;
  storageFee: number;
  penaltyRate: number;
}

export const CustomerStepSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  phone: z.string().min(1, 'Phone number is required'),
  idNumber: z
    .string()
    .length(9, 'ID number must be exactly 9 digits')
    .regex(/^\d+$/, 'ID number must contain only digits'),
  address: z.string().optional(),
});

export const ItemStepSchema = z.object({
  itemType: z.string().min(1, 'Item type is required'),
  estimatedValue: z
    .string()
    .min(1, 'Estimated value is required')
    .refine(v => Number(v) > 0, 'Must be greater than 0')
    .transform(v => Number(v)),
  description: z.string().optional(),
  photoUrl: z
    .string()
    .optional()
    .transform(val => (val === '' ? undefined : val))
    .pipe(z.string().url('Must be a valid URL').optional()),
});

export const LoanStepSchema = z.object({
  currencyId: z.number().min(1, 'Currency is required'),
  branchId: z.number().min(1, 'Branch is required'),
  loanAmount: z
    .string()
    .min(1, 'Loan amount is required')
    .refine(v => Number(v) > 0, 'Must be greater than 0'),
  interestRate: z
    .string()
    .min(1, 'Interest rate is required')
    .refine(v => Number(v) > 0, 'Must be greater than 0'),
  dueDate: z
    .string()
    .min(1, 'Due date is required')
    .refine(date => {
      const selected = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return selected >= today;
    }, 'Due date must be today or in the future'),
  loanDurationDays: z.number().min(1, 'Must be at least 1 day'),
  gracePeriodDays: z.number().min(0),
  storageFee: z.number().min(0),
  penaltyRate: z.number().min(0),
});

export type CustomerStepData = z.infer<typeof CustomerStepSchema>;
export type ItemStepData = z.infer<typeof ItemStepSchema>;
export type LoanStepData = z.infer<typeof LoanStepSchema>;
