import React from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { Transaction, useTransactionsStore } from '../store/useTransactionsStore';
import { colors } from '../theme/colors';
import { ArrowUpRight, ArrowDownLeft, Trash2 } from 'lucide-react-native';
import { AnimatedCard } from './AnimatedCard';

type Props = {
  transaction: Transaction;
  onPress?: () => void;
};

export const SwipeableTransactionCard = ({ transaction, onPress }: Props) => {
  const removeTransaction = useTransactionsStore(s => s.removeTransaction);
  
  const isIncome = transaction.type === 'income';
  const amountColor = isIncome ? colors.income : colors.expense;
  const sign = isIncome ? '+' : '-';
  const Icon = isIncome ? ArrowUpRight : ArrowDownLeft;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const confirmDelete = () => {
    Alert.alert(
      'Delete Transaction',
      `Are you sure you want to delete "${transaction.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => removeTransaction(transaction.id)
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <AnimatedCard onPress={onPress} style={styles.card}>
        <View style={styles.iconContainer}>
          <View style={[styles.iconCircle, { backgroundColor: `${amountColor}20` }]}>
            <Icon size={20} color={amountColor} />
          </View>
        </View>
        
        <View style={styles.content}>
          <Text style={styles.title} numberOfLines={1}>
            {transaction.title}
          </Text>
          <Text style={styles.date}>{formatDate(transaction.date)}</Text>
        </View>
        
        <View style={styles.amountContainer}>
          <Text style={[styles.amount, { color: amountColor }]}>
            {sign}${Math.abs(transaction.amount).toFixed(2)}
          </Text>
          <Text style={[styles.type, { color: amountColor }]}>
            {transaction.type.toUpperCase()}
          </Text>
        </View>

        <TouchableOpacity onPress={confirmDelete} style={styles.deleteButton}>
          <Trash2 size={18} color={colors.expense} />
        </TouchableOpacity>
      </AnimatedCard>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
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
    marginRight: 12,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    marginRight: 12,
  },
  title: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  date: {
    color: '#999',
    fontSize: 12,
  },
  amountContainer: {
    alignItems: 'flex-end',
    marginRight: 12,
  },
  amount: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 2,
  },
  type: {
    fontSize: 10,
    fontWeight: '600',
    opacity: 0.8,
  },
  deleteButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: colors.expense + '20',
  },
});
