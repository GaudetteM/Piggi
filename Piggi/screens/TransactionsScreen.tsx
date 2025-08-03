import React, { useState } from 'react';
import { Text, StyleSheet, FlatList } from 'react-native';
import { colors } from '../theme/colors';
import { FAB } from '../components/FAB';
import { useTransactionsStore } from '../store/useTransactionsStore';
import TransactionCard from '../components/TransactionCard';
import AddTransactionModal from '../components/AddTransactionModal';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TransactionsScreen() {
  const transactions = useTransactionsStore(s => s.transactions);
  const [modalVisible, setModalVisible] = useState(false);

  const handleAddPress = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Transactions</Text>

      <FlatList
        data={transactions}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => <TransactionCard transaction={item} />}
      />

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
    paddingTop: 20,
  },
  title: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 16,
  },
  list: {
    paddingBottom: 100,
  },
});
