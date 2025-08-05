import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { TrendingUp, TrendingDown } from 'lucide-react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming,
} from 'react-native-reanimated';

type Props = {
  income: number;
  expenses: number;
  period?: string;
};

export const FinancialSummaryCard = ({ income, expenses, period = 'This Month' }: Props) => {
  const balance = income - expenses;
  const incomeWidth = useSharedValue(0);
  const expenseWidth = useSharedValue(0);
  
  const maxAmount = Math.max(income, expenses, 1); // Avoid division by zero
  
  React.useEffect(() => {
    incomeWidth.value = withTiming((income / maxAmount) * 100, { duration: 1000 });
    expenseWidth.value = withTiming((expenses / maxAmount) * 100, { duration: 1000 });
  }, [income, expenses, maxAmount, incomeWidth, expenseWidth]);

  const incomeBarStyle = useAnimatedStyle(() => ({
    width: `${incomeWidth.value}%`,
  }));

  const expenseBarStyle = useAnimatedStyle(() => ({
    width: `${expenseWidth.value}%`,
  }));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Financial Summary</Text>
        <Text style={styles.period}>{period}</Text>
      </View>

      <View style={styles.balanceSection}>
        <Text style={styles.balanceLabel}>Net Balance</Text>
        <Text style={[
          styles.balanceAmount,
          { color: balance >= 0 ? colors.income : colors.expense }
        ]}>
          {balance >= 0 ? '+' : ''}${balance.toFixed(2)}
        </Text>
      </View>

      <View style={styles.barSection}>
        {/* Income Bar */}
        <View style={styles.barContainer}>
          <View style={styles.barHeader}>
            <View style={styles.barLabelContainer}>
              <TrendingUp size={16} color={colors.income} />
              <Text style={styles.barLabel}>Income</Text>
            </View>
            <Text style={styles.barAmount}>${income.toFixed(2)}</Text>
          </View>
          <View style={styles.barTrack}>
            <Animated.View style={[styles.barFill, styles.incomeBar, incomeBarStyle]} />
          </View>
        </View>

        {/* Expense Bar */}
        <View style={styles.barContainer}>
          <View style={styles.barHeader}>
            <View style={styles.barLabelContainer}>
              <TrendingDown size={16} color={colors.expense} />
              <Text style={styles.barLabel}>Expenses</Text>
            </View>
            <Text style={styles.barAmount}>${expenses.toFixed(2)}</Text>
          </View>
          <View style={styles.barTrack}>
            <Animated.View style={[styles.barFill, styles.expenseBar, expenseBarStyle]} />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  period: {
    fontSize: 14,
    color: colors.text,
    opacity: 0.6,
  },
  balanceSection: {
    alignItems: 'center',
    marginBottom: 24,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: colors.background,
  },
  balanceLabel: {
    fontSize: 14,
    color: colors.text,
    opacity: 0.7,
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  barSection: {
    gap: 16,
  },
  barContainer: {
    marginBottom: 4,
  },
  barHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  barLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  barLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  barAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  barTrack: {
    height: 8,
    backgroundColor: colors.background,
    borderRadius: 4,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 4,
  },
  incomeBar: {
    backgroundColor: colors.income,
  },
  expenseBar: {
    backgroundColor: colors.expense,
  },
});
