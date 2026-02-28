'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCreateFullLoan } from '@/hooks/useLoan';
import { useCurrencies } from '@/hooks/useCurrency';
import { useBranches } from '@/hooks/useBranch';
import { CustomerForm, ItemForm, LoanForm } from '@/components/loan/create/types';
import CustomerStep from '@/components/loan/create/CustomerForm';
import ItemStep from '@/components/loan/create/PawnItemForm';
import LoanDetailsStep from '@/components/loan/create/LoanDetailsForm';
import ReviewStep from '@/components/loan/create/ReviewConfirm';
import StepIndicator from '@/components/loan/create/StepIndicator';

const STEPS = [
  { num: 1, label: 'Customer' },
  { num: 2, label: 'Pawn Item' },
  { num: 3, label: 'Loan Details' },
  { num: 4, label: 'Review & Confirm' },
];

export default function CreateLoanPage() {
  const router = useRouter();
  const createLoan = useCreateFullLoan();

  const [step, setStep] = useState(1);
  const { data: currencies, isLoading: currenciesLoading } = useCurrencies(0, 100, 'ACTIVE');
  const { data: branches, isLoading: branchesLoading } = useBranches(0, 100, 'ACTIVE');

  const [customerForm, setCustomerForm] = useState<CustomerForm>({ fullName: '', phone: '', idNumber: '', address: '' });
  const [itemForm, setItemForm] = useState<ItemForm>({ itemType: '', description: '', estimatedValue: 0, photoUrl: '' });
  const [loanForm, setLoanForm] = useState<LoanForm>({
    currencyId: 0, branchId: 0, loanAmount: '', interestRate: '',
    dueDate: '', loanDurationDays: 30, gracePeriodDays: 7, storageFee: 0, penaltyRate: 0,
  });

  const loanAmount = Number(loanForm.loanAmount || 0);
  const interestRate = Number(loanForm.interestRate || 0);
  const interest = (loanAmount * interestRate) / 100;
  const total = loanAmount + interest;

  const handleCreateLoan = async () => {
    if (createLoan.isPending) return;

    const payload = {
      nationalId: customerForm.idNumber.trim(),
      customerInfo: {
        fullName: customerForm.fullName.trim(),
        phone: customerForm.phone.trim(),
        address: customerForm.address.trim(),
      },
      collateralInfo: {
        itemType: itemForm.itemType.trim(),
        description: itemForm.description.trim() || undefined,
        estimatedValue: Number(itemForm.estimatedValue),
        photoUrl: itemForm.photoUrl?.trim() || undefined,
      },
      loanInfo: {
        branchId: Number(loanForm.branchId),
        currencyId: Number(loanForm.currencyId),
        loanAmount,
        interestRate,
        dueDate: loanForm.dueDate,
        loanDurationDays: loanForm.loanDurationDays,
        gracePeriodDays: loanForm.gracePeriodDays,
        storageFee: loanForm.storageFee,
        penaltyRate: loanForm.penaltyRate,
        paymentFrequency: 'ONE_TIME' as const,
        numberOfInstallments: 1,
      },
    };

    try {
      await createLoan.mutateAsync(payload);
      router.push('/loans');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-muted min-h-screen">
      <div className="mx-auto max-w-7xl space-y-6 p-6">

        <div className="flex items-center justify-between">
          <div>
            <nav className="mb-1 flex items-center gap-2 text-sm text-muted-foreground">
              <span
                className="cursor-pointer transition-colors hover:text-foreground"
                onClick={() => router.push('/loans')}
              >
                Loans
              </span>
              <span>/</span>
              <span className="font-medium text-foreground">Create New Loan</span>
            </nav>
            <h1 className="text-2xl font-semibold text-foreground">Create New Loan</h1>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Setup terms and collateral for a new pawn agreement
            </p>
          </div>
        </div>

        <StepIndicator steps={STEPS} currentStep={step} />

        {step === 1 && (
          <CustomerStep
            form={customerForm}
            onChange={setCustomerForm}
            onNext={() => setStep(2)}
            onCancel={() => router.push('/loans')}
          />
        )}
        {step === 2 && (
          <ItemStep
            form={itemForm}
            onChange={setItemForm}
            onNext={() => setStep(3)}
            onBack={() => setStep(1)}
          />
        )}
        {step === 3 && (
          <LoanDetailsStep
            form={loanForm}
            itemForm={itemForm}
            onChange={setLoanForm}
            onNext={() => setStep(4)}
            onBack={() => setStep(2)}
            currencies={currencies?.content}
            currenciesLoading={currenciesLoading}
            branches={branches?.content}
            branchesLoading={branchesLoading}
            interest={interest}
            total={total}
          />
        )}
        {step === 4 && (
          <ReviewStep
            customerForm={customerForm}
            itemForm={itemForm}
            loanForm={loanForm}
            interest={interest}
            total={total}
            isPending={createLoan.isPending}
            onConfirm={handleCreateLoan}
            onBack={() => setStep(3)}
            onCancel={() => router.push('/loans')}
          />
        )}
      </div>
    </div>
  );
}