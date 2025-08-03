import { create } from 'zustand'

export type Transaction = {
  id: string
  title: string
  amount: number
  type: 'income' | 'expense'
  date: string
}

type Store = {
  transactions: Transaction[]
  addTransaction: (tx: Transaction) => void
  removeTransaction: (id: string) => void
}

const mockTransactions: Transaction[] = [
  {
    id: '1',
    title: 'Freelance Payment',
    amount: 500,
    type: 'income',
    date: '2025-08-01',
  },
  {
    id: '2',
    title: 'Groceries',
    amount: 75.25,
    type: 'expense',
    date: '2025-08-01',
  },
  {
    id: '3',
    title: 'Spotify Subscription',
    amount: 9.99,
    type: 'expense',
    date: '2025-07-30',
  },
  {
    id: '4',
    title: 'Paycheck',
    amount: 1200,
    type: 'income',
    date: '2025-07-28',
  },
]

export const useTransactionsStore = create<Store>((set) => ({
  transactions: mockTransactions,
  addTransaction: (tx) =>
    set((state) => ({
      transactions: [tx, ...state.transactions],
    })),
  removeTransaction: (id) =>
    set((state) => ({
      transactions: state.transactions.filter((t) => t.id !== id),
    })),
}))
