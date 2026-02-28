import { z } from 'zod';

export const DashboardStatsSchema = z.object({
    activeLoans: z.number(),
    overdueLoans: z.number(),
    totalPrincipal: z.number(),
    loanRecoveryRate: z.number(),
    customerRetentionRate: z.number(),
    lastBackup: z.string().optional(),
});

export type DashboardStats = z.infer<typeof DashboardStatsSchema>;

export const LoanCountPageSchema = z.object({
    success: z.boolean(),
    message: z.string(),
    data: z.object({
        totalElements: z.number(),
        content: z.array(
            z.object({
                totalPayableAmount: z.number().nullish(),
            })
        ),
    }),
});