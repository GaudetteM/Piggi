import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Transaction } from '../store/useTransactionsStore';
import { colors } from '../theme/colors';

type Props = {
  transaction: Transaction;
};

export default function TransactionCard({ transaction }: Props) {
  const isIncome = transaction.type === 'income';
  const amountColor = isIncome ? colors.income : colors.expense;
  const sign = isIncome ? '+' : '-';

  return (
    <View style={styles.card}>
      <View>
        <Text style={styles.title}>{transaction.title}</Text>
        <Text style={styles.date}>{transaction.date}</Text>
      </View>
      <Text style={[styles.amount, { color: amountColor }]}>
        {sign}${Math.abs(transaction.amount).toFixed(2)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '500',
  },
  date: {
    color: '#999',
    fontSize: 12,
    marginTop: 4,
  },
  amount: {
    fontSize: 18,
    fontWeight: '600',
  },
});
