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

export const BUTTON_STYLES = {
  primary:
    'flex items-center gap-2 rounded-md bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700',

  secondary:
    'rounded-md border border-gray-300 bg-white px-5 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50',

  ghost: 'flex items-center gap-2 rounded-md px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100',
};
