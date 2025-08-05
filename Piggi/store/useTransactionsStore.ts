import { create } from 'zustand'

export type Transaction = {
  id: string
  title: string
  amount: number
  type: 'income' | 'expense'
  date: string
  category: string
}

export type Category = {
  id: string
  name: string
  color: string
  type: 'income' | 'expense' | 'both'
}

// Default categories
export const defaultCategories: Category[] = [
  // Income categories
  { id: 'salary', name: 'Salary', color: '#4CAF50', type: 'income' },
  { id: 'freelance', name: 'Freelance', color: '#8BC34A', type: 'income' },
  { id: 'investment', name: 'Investment', color: '#CDDC39', type: 'income' },
  { id: 'other-income', name: 'Other Income', color: '#689F38', type: 'income' },
  
  // Expense categories
  { id: 'food', name: 'Food & Dining', color: '#FF9800', type: 'expense' },
  { id: 'coffee', name: 'Coffee', color: '#8D6E63', type: 'expense' },
  { id: 'transport', name: 'Transportation', color: '#FF5722', type: 'expense' },
  { id: 'utilities', name: 'Utilities', color: '#9C27B0', type: 'expense' },
  { id: 'entertainment', name: 'Entertainment', color: '#E91E63', type: 'expense' },
  { id: 'shopping', name: 'Shopping', color: '#2196F3', type: 'expense' },
  { id: 'healthcare', name: 'Healthcare', color: '#00BCD4', type: 'expense' },
  { id: 'education', name: 'Education', color: '#607D8B', type: 'expense' },
  { id: 'other-expense', name: 'Other Expense', color: '#795548', type: 'expense' },
]

type Store = {
  transactions: Transaction[]
  categories: Category[]
  addTransaction: (tx: Transaction) => void
  updateTransaction: (id: string, updates: Partial<Transaction>) => void
  removeTransaction: (id: string) => void
  addCategory: (category: Category) => void
  getUsedCategories: () => string[]
}

const mockTransactions: Transaction[] = [
  {
    id: '1',
    title: 'Freelance Payment',
    amount: 500,
    type: 'income',
    date: '2025-08-01',
    category: 'freelance',
  },
  {
    id: '2',
    title: 'Groceries',
    amount: 75.25,
    type: 'expense',
    date: '2025-08-01',
    category: 'food',
  },
  {
    id: '3',
    title: 'Spotify Subscription',
    amount: 9.99,
    type: 'expense',
    date: '2025-07-30',
    category: 'entertainment',
  },
  {
    id: '4',
    title: 'Paycheck',
    amount: 1200,
    type: 'income',
    date: '2025-07-28',
    category: 'salary',
  },
]

export const useTransactionsStore = create<Store>((set, get) => ({
  transactions: mockTransactions,
  categories: defaultCategories,
  addTransaction: (tx) =>
    set((state) => ({
      transactions: [tx, ...state.transactions],
    })),
  updateTransaction: (id, updates) =>
    set((state) => ({
      transactions: state.transactions.map(t => 
        t.id === id ? { ...t, ...updates } : t
      ),
    })),
  removeTransaction: (id) =>
    set((state) => ({
      transactions: state.transactions.filter((t) => t.id !== id),
    })),
  addCategory: (category) =>
    set((state) => ({
      categories: [...state.categories, category],
    })),
  getUsedCategories: () => {
    const state = get();
    const usedCategoryIds = [...new Set(state.transactions.map(t => t.category))];
    return usedCategoryIds;
  },
}))
