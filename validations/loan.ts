import { z } from 'zod';

// ─── Enums ────────────────────────────────────────────────────────────────────

export const PaymentFrequencyEnum = z.enum(['ONE_TIME', 'WEEKLY', 'BI_WEEKLY', 'MONTHLY', 'QUARTERLY']);

// ─── Shared Sub-schemas ───────────────────────────────────────────────────────

const BranchSchema = z.object({
  id: z.number(),
  name: z.string(),
});

const CurrencySchema = z.object({
  id: z.number(),
  symbol: z.string(),
  code: z.string().nullish(),
  name: z.string().nullish(),
});

const CustomerSummarySchema = z.object({
  id: z.number(),
  fullName: z.string(),
  phone: z.string().nullish(),
  idNumber: z.string().nullish(),
});

const CustomerDetailSchema = CustomerSummarySchema.extend({
  address: z.string().nullish(),
  email: z.string().nullish(),
  createdAt: z.string().nullish(),
});

const PawnItemSchema = z.object({
  id: z.number(),
  itemType: z.string().nullish(),
  description: z.string().nullish(),
  estimatedValue: z.number().nullish(),
  photoUrl: z.string().nullish(),
});

// ─── List Schema (lightweight) ────────────────────────────────────────────────

export const PawnLoanListSchema = z.object({
  id: z.number(),
  loanCode: z.string(),
  loanAmount: z.number(),
  interestRate: z.number(),
  totalPayableAmount: z.number().nullish(),
  dueDate: z.string().nullish(),
  status: z.string(),
  createdAt: z.string().nullish(),
  customer: CustomerSummarySchema.nullish(),
  branch: BranchSchema.nullish(),
  currency: CurrencySchema.nullish(),
});

export type PawnLoanList = z.infer<typeof PawnLoanListSchema>;

// ─── Detail Schema (full) ─────────────────────────────────────────────────────

export const PawnLoanDetailSchema = z.object({
  id: z.number(),
  loanCode: z.string(),

  loanAmount: z.number(),
  interestRate: z.number(),
  totalPayableAmount: z.number().nullish(),

  loanDate: z.string().nullish(),
  dueDate: z.string().nullish(),
  redemptionDeadline: z.string().nullish(),
  gracePeriodEndDate: z.string().nullish(),

  loanDurationDays: z.number().nullish(),
  gracePeriodDays: z.number().nullish(),
  storageFee: z.number().nullish(),
  penaltyRate: z.number().nullish(),

  paymentFrequency: PaymentFrequencyEnum.nullish(),
  numberOfInstallments: z.number().nullish(),
  installmentAmount: z.number().nullish(),

  status: z.string(),

  redeemedAt: z.string().nullish(),
  defaultedAt: z.string().nullish(),
  overdueAt: z.string().nullish(),

  createdAt: z.string().nullish(),
  updatedAt: z.string().nullish(),

  customer: CustomerDetailSchema.nullish(),
  branch: BranchSchema.nullish(),
  currency: CurrencySchema.nullish(),
  pawnItem: PawnItemSchema.nullish(),
});

export type PawnLoanDetail = z.infer<typeof PawnLoanDetailSchema>;

// ─── Pagination Response (list) ───────────────────────────────────────────────

export const PawnLoanPageResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.object({
    content: z.array(PawnLoanListSchema),
    totalElements: z.number(),
    totalPages: z.number(),
    size: z.number(),
    number: z.number(),
  }),
});

export type PawnLoanPageResponse = z.infer<typeof PawnLoanPageResponseSchema>;

// ─── Single Response (detail) ─────────────────────────────────────────────────

export const PawnLoanDetailResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: PawnLoanDetailSchema,
});

export type PawnLoanDetailResponse = z.infer<typeof PawnLoanDetailResponseSchema>;

// ─── Create Schemas ───────────────────────────────────────────────────────────

export const CustomerInfoSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  phone: z.string().min(1, 'Phone is required'),
  address: z.string().optional(),
});

export const CollateralInfoSchema = z
  .object({
    pawnItemId: z.number().optional(),
    itemType: z.string().optional(),
    description: z.string().optional(),
    estimatedValue: z.number().positive('Estimated value must be positive').optional(),
    photoUrl: z
      .string()
      .optional()
      .transform(val => (val === '' ? undefined : val))
      .pipe(z.string().url('Photo URL must be a valid URL').optional()),
  })
  .refine(
    data => data.pawnItemId || (data.itemType && data.itemType.trim() !== '' && data.estimatedValue),
    {
      message: 'Either existing pawn item or new collateral details must be provided',
      path: ['itemType'],
    },
  );

export const LoanInfoSchema = z.object({
  currencyId: z.number().min(1, 'Currency is required'),
  branchId: z.number().min(1, 'Branch is required'),

  loanAmount: z.number().positive('Loan amount must be positive'),
  interestRate: z.number().positive('Interest rate must be positive'),

  dueDate: z
    .string()
    .min(1, 'Due date is required')
    .refine(date => {
      const selected = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return selected >= today;
    }, 'Due date must be today or in the future'),

  redemptionDeadline: z.string().optional(),

  loanDurationDays: z.number().min(1, 'Loan duration must be at least 1 day').default(30),
  gracePeriodDays: z.number().min(0, 'Grace period cannot be negative').default(7),

  storageFee: z.number().min(0, 'Storage fee cannot be negative').default(0),
  penaltyRate: z.number().min(0, 'Penalty rate cannot be negative').default(0),

  paymentFrequency: PaymentFrequencyEnum.default('ONE_TIME'),
  numberOfInstallments: z.number().min(1, 'Number of installments must be at least 1').default(1),
  installmentAmount: z.number().positive('Installment amount must be positive').optional(),
});

export const CreateFullLoanSchema = z.object({
  nationalId: z.string().min(1, 'National ID is required'),
  customerInfo: CustomerInfoSchema.optional(),
  collateralInfo: CollateralInfoSchema,
  loanInfo: LoanInfoSchema,
});

export type CreateFullLoanPayload = z.infer<typeof CreateFullLoanSchema>;