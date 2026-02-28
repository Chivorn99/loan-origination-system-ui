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
          <span className="text-muted-foreground text-sm">Principal</span>
          <span className="text-foreground text-sm font-medium">
            ${Number(loanAmount || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground text-sm">Accrued Interest</span>
          <span className="text-foreground text-sm font-medium">${interest.toFixed(2)}</span>
        </div>
        <Separator />
        <div className="flex items-center justify-between">
          <span className="text-foreground text-sm font-semibold">Total Due</span>
          <span className="text-primary text-base font-bold">${total.toFixed(2)}</span>
        </div>
      </CardContent>
    </Card>
  );
}
