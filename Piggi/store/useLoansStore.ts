import { create } from 'zustand';
import uuid from 'react-native-uuid';

export type Loan = {
  id: string;
  name: string;
  principal: number;
  interestRate: number;
  monthlyPayment: number;
  extraMonthly?: number;
  lumpSum?: number;
  startDate: string;
};

type LoansState = {
  loans: Loan[];
  addLoan: (loan: Omit<Loan, 'id'>) => void;
  deleteLoan: (id: string) => void;
};

export const useLoansStore = create<LoansState>(set => ({
  loans: [],
  addLoan: loan =>
    set(state => ({
      loans: [...state.loans, { id: uuid.v4().toString(), ...loan }],
    })),
  deleteLoan: id =>
    set(state => ({
      loans: state.loans.filter(loan => loan.id !== id),
    })),
}));
