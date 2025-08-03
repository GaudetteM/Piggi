import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { colors } from '../theme/colors';
import { useLoansStore } from '../store/useLoansStore';
import { AddLoanModal } from '../components/AddLoanModal';
import { LoanToolModal } from '../components/LoanToolModal';
import { SafeAreaView } from 'react-native-safe-area-context';

export const LoansScreen = () => {
  const loans = useLoansStore(s => s.loans);
  const [modalVisible, setModalVisible] = useState(false);
  const [showLoanTool, setShowLoanTool] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Your Loans</Text>

      {loans.length === 0 ? (
        <Text style={styles.empty}>No loans yet. Add one to get started.</Text>
      ) : (
        <FlatList
          data={loans}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.details}>
                ${item.principal.toFixed(2)} @ {item.interestRate}% APR
              </Text>
              <Text style={styles.details}>
                Monthly: ${item.monthlyPayment}
              </Text>
            </View>
          )}
        />
      )}

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setShowLoanTool(true)}
      >
        <Text style={styles.addButtonText}>+ Add / Simulate Loan</Text>
      </TouchableOpacity>

      <AddLoanModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
      <LoanToolModal
        visible={showLoanTool}
        onClose={() => setShowLoanTool(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  empty: {
    color: colors.text,
    fontStyle: 'italic',
    marginTop: 40,
    textAlign: 'center',
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  details: {
    color: colors.text,
    marginTop: 4,
  },
  addButton: {
    backgroundColor: colors.accent,
    paddingVertical: 10,
    borderRadius: 8,
    marginVertical: 10,
    alignSelf: 'center',
    paddingHorizontal: 20,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
