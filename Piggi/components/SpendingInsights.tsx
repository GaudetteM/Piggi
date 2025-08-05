import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { colors } from '../theme/colors';
import { Transaction } from '../store/useTransactionsStore';
import { TrendingUp, TrendingDown, AlertCircle, CheckCircle } from 'lucide-react-native';

type Props = {
  transactions: Transaction[];
};

export const SpendingInsights = ({ transactions }: Props) => {
  // Calculate insights
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const currentMonthTransactions = transactions.filter(t => {
    const transactionDate = new Date(t.date);
    return transactionDate.getMonth() === currentMonth && 
           transactionDate.getFullYear() === currentYear;
  });

  const lastMonthTransactions = transactions.filter(t => {
    const transactionDate = new Date(t.date);
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    return transactionDate.getMonth() === lastMonth && 
           transactionDate.getFullYear() === lastMonthYear;
  });

  const currentExpenses = currentMonthTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const lastExpenses = lastMonthTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const expenseChange = lastExpenses > 0 ? 
    ((currentExpenses - lastExpenses) / lastExpenses) * 100 : 0;

  // Get top spending categories (simplified)
  const categorySpending = currentMonthTransactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      const category = t.title.toLowerCase().includes('food') ? 'Food' :
                      t.title.toLowerCase().includes('gas') ? 'Transportation' :
                      t.title.toLowerCase().includes('shop') ? 'Shopping' :
                      'Other';
      acc[category] = (acc[category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  const topCategory = Object.entries(categorySpending)
    .sort(([,a], [,b]) => b - a)[0];

  const insights = [
    {
      id: 1,
      type: expenseChange > 10 ? 'warning' : expenseChange < -10 ? 'positive' : 'neutral',
      title: expenseChange > 10 ? 'Spending Increase' : 
             expenseChange < -10 ? 'Great Savings!' : 'Stable Spending',
      description: lastExpenses > 0 ? 
        `${Math.abs(expenseChange).toFixed(0)}% ${expenseChange > 0 ? 'more' : 'less'} than last month` :
        'First month tracking',
      icon: expenseChange > 10 ? AlertCircle : 
            expenseChange < -10 ? CheckCircle : TrendingUp,
    },
    {
      id: 2,
      type: 'info',
      title: 'Top Category',
      description: topCategory ? 
        `${topCategory[0]}: $${topCategory[1].toFixed(0)}` : 
        'No expenses yet',
      icon: TrendingDown,
    },
  ];

  if (currentMonthTransactions.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Spending Insights</Text>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {insights.map((insight) => {
          const IconComponent = insight.icon;
          const iconColor = insight.type === 'warning' ? colors.expense :
                           insight.type === 'positive' ? colors.income :
                           colors.accent;
          
          return (
            <View key={insight.id} style={styles.insightCard}>
              <View style={[styles.iconContainer, { backgroundColor: iconColor + '20' }]}>
                <IconComponent size={20} color={iconColor} />
              </View>
              
              <Text style={styles.insightTitle}>{insight.title}</Text>
              <Text style={styles.insightDescription}>{insight.description}</Text>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  scrollContent: {
    paddingRight: 20,
  },
  insightCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    width: 180,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  insightDescription: {
    fontSize: 14,
    color: colors.text,
    opacity: 0.7,
    lineHeight: 18,
  },
});
