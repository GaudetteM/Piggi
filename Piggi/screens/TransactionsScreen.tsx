import React, { useState } from 'react';
import { Text, StyleSheet, FlatList, View } from 'react-native';
import { colors } from '../theme/colors';
import { FAB } from '../components/FAB';
import { useTransactionsStore } from '../store/useTransactionsStore';
import TransactionCard from '../components/TransactionCard';
import AddTransactionModal from '../components/AddTransactionModal';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TransactionsScreen() {
  const transactions = useTransactionsStore(s => s.transactions);
  const removeTransaction = useTransactionsStore(s => s.removeTransaction);
  const [modalVisible, setModalVisible] = useState(false);

  const handleAddPress = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const handleTransactionPress = (transactionId: string) => {
    // TODO: Navigate to transaction details or show edit modal
    console.log('Transaction pressed:', transactionId);
  };

  const handleDeleteTransaction = (transactionId: string) => {
    removeTransaction(transactionId);
  };

  const sortedTransactions = [...transactions].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Transactions</Text>
        <Text style={styles.subtitle}>
          {transactions.length} transaction{transactions.length !== 1 ? 's' : ''}
        </Text>
      </View>

      {transactions.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No transactions yet</Text>
          <Text style={styles.emptySubtext}>Tap the + button to add your first transaction</Text>
        </View>
      ) : (
        <FlatList
          data={sortedTransactions}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TransactionCard 
              transaction={item} 
              onPress={() => handleTransactionPress(item.id)}
              onDelete={() => handleDeleteTransaction(item.id)}
            />
          )}
        />
      )}

      <FAB onPress={handleAddPress} />

      <AddTransactionModal visible={modalVisible} onClose={handleCloseModal} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 16,
  },
  header: {
    paddingVertical: 20,
  },
  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    color: colors.text,
    fontSize: 16,
    opacity: 0.7,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 16,
    color: colors.text,
    opacity: 0.6,
    textAlign: 'center',
    lineHeight: 22,
  },
  list: {
    paddingBottom: 100,
  },
});
