import { create } from 'zustand';
import uuid from 'react-native-uuid';

export type BudgetCategory = {
  id: string;
  name: string;
  budgetAmount: number;
  spent: number;
  color: string;
  icon: string;
};

export type Budget = {
  id: string;
  name: string;
  period: 'weekly' | 'monthly' | 'yearly';
  categories: BudgetCategory[];
  startDate: string;
  endDate: string;
};

type BudgetState = {
  budgets: Budget[];
  activeBudget: Budget | null;
  addBudget: (budget: Omit<Budget, 'id'>) => void;
  updateBudget: (id: string, budget: Partial<Budget>) => void;
  deleteBudget: (id: string) => void;
  setActiveBudget: (budget: Budget | null) => void;
  addExpenseToBudget: (categoryId: string, amount: number) => void;
};

const defaultCategories: Omit<BudgetCategory, 'id'>[] = [
  { name: 'Food & Dining', budgetAmount: 400, spent: 0, color: '#FF6B6B', icon: '🍽️' },
  { name: 'Transportation', budgetAmount: 200, spent: 0, color: '#4ECDC4', icon: '🚗' },
  { name: 'Shopping', budgetAmount: 150, spent: 0, color: '#45B7D1', icon: '🛍️' },
  { name: 'Entertainment', budgetAmount: 100, spent: 0, color: '#96CEB4', icon: '🎬' },
  { name: 'Bills & Utilities', budgetAmount: 300, spent: 0, color: '#FECA57', icon: '💡' },
  { name: 'Healthcare', budgetAmount: 150, spent: 0, color: '#FF9FF3', icon: '🏥' },
];

export const useBudgetStore = create<BudgetState>((set, get) => ({
  budgets: [],
  activeBudget: null,

  addBudget: (budget) => {
    const newBudget: Budget = {
      id: uuid.v4().toString(),
      ...budget,
      categories: budget.categories.length > 0 
        ? budget.categories 
        : defaultCategories.map(cat => ({
            id: uuid.v4().toString(),
            ...cat,
          })),
    };

    set((state) => ({
      budgets: [...state.budgets, newBudget],
      activeBudget: state.activeBudget || newBudget,
    }));
  },

  updateBudget: (id, updatedBudget) => {
    set((state) => ({
      budgets: state.budgets.map((budget) =>
        budget.id === id ? { ...budget, ...updatedBudget } : budget
      ),
      activeBudget:
        state.activeBudget?.id === id
          ? { ...state.activeBudget, ...updatedBudget }
          : state.activeBudget,
    }));
  },

  deleteBudget: (id) => {
    set((state) => ({
      budgets: state.budgets.filter((budget) => budget.id !== id),
      activeBudget:
        state.activeBudget?.id === id ? null : state.activeBudget,
    }));
  },

  setActiveBudget: (budget) => {
    set({ activeBudget: budget });
  },

  addExpenseToBudget: (categoryId, amount) => {
    const { activeBudget } = get();
    if (!activeBudget) return;

    const updatedCategories = activeBudget.categories.map((category) =>
      category.id === categoryId
        ? { ...category, spent: category.spent + amount }
        : category
    );

    const updatedBudget = { ...activeBudget, categories: updatedCategories };

    set((state) => ({
      budgets: state.budgets.map((budget) =>
        budget.id === activeBudget.id ? updatedBudget : budget
      ),
      activeBudget: updatedBudget,
    }));
  },
}));
