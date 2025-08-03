import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { PolarChart, Pie } from 'victory-native';
import { colors } from '../theme/colors';
import { useTransactionsStore } from '../store/useTransactionsStore';

export default function DashboardScreen() {
  const transactions = useTransactionsStore(s => s.transactions);

  const incomeTotal = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const expenseTotal = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = incomeTotal - expenseTotal;

  const data = [
    { label: 'Income', value: incomeTotal, color: colors.incomeGraph },
    { label: 'Expense', value: expenseTotal, color: colors.expenseGraph },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Balance</Text>
      <Text style={styles.balance}>${balance.toFixed(2)}</Text>

      <View style={{ height: 300 }}>
        <PolarChart
          data={data}
          labelKey="label"
          valueKey="value"
          colorKey="color"
        >
          <Pie.Chart />
        </PolarChart>
      </View>

      <View style={styles.legend}>
        <Text style={[styles.legendText, { color: colors.income }]}>
          ● Income: ${incomeTotal.toFixed(2)}
        </Text>
        <Text style={[styles.legendText, { color: colors.expense }]}>
          ● Expense: ${expenseTotal.toFixed(2)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 20,
    alignItems: 'center',
    paddingTop: 40,
  },
  title: {
    fontSize: 22,
    color: colors.text,
    fontWeight: '600',
  },
  balance: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.accent,
    marginVertical: 20,
  },
  legend: {
    marginTop: 20,
    alignItems: 'flex-start',
  },
  legendText: {
    fontSize: 16,
    marginBottom: 4,
    color: colors.text,
  },
});
