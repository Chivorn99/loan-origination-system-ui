import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface RepaymentSummaryProps {
  loanAmount: string;
  interest: number;
  total: number;
}

export default function RepaymentSummary({ loanAmount, interest, total }: RepaymentSummaryProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Repayment Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Principal</span>
          <span className="text-sm font-medium text-foreground">
            ${Number(loanAmount || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Accrued Interest</span>
          <span className="text-sm font-medium text-foreground">${interest.toFixed(2)}</span>
        </div>
        <Separator />
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-foreground">Total Due</span>
          <span className="text-base font-bold text-primary">${total.toFixed(2)}</span>
        </div>
      </CardContent>
    </Card>
  );
}