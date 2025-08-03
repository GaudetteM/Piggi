import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { colors } from '../theme/colors';
import {
  useTransactionsStore,
  Transaction,
} from '../store/useTransactionsStore';
import uuid from 'react-native-uuid';

type Props = {
  visible: boolean;
  onClose: () => void;
};

export default function AddTransactionModal({ visible, onClose }: Props) {
  const addTransaction = useTransactionsStore(state => state.addTransaction);

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [date, setDate] = useState(new Date());
  const [isDateModalVisible, setDateModalVisible] = useState(false);

  const showDatePicker = () => setDateModalVisible(true);
  const hideDatePicker = () => setDateModalVisible(false);

  const handleConfirm = (selectedDate: Date) => {
    setDate(selectedDate);
    hideDatePicker();
  };

  const resetForm = () => {
    setTitle('');
    setAmount('');
    setType('expense');
    setDate(new Date());
  };

  const handleAdd = () => {
    const numAmount = parseFloat(amount);

    const newTransaction: Transaction = {
      id: uuid.v4().toString(),
      title: title.trim(),
      amount: numAmount,
      type,
      date: date.toISOString().slice(0, 10), // YYYY-MM-DD
    };

    addTransaction(newTransaction);
    resetForm();
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.heading}>Add Transaction</Text>
          <TextInput
            style={styles.input}
            placeholder="Title"
            placeholderTextColor="#888"
            value={title}
            onChangeText={setTitle}
          />
          <TextInput
            style={styles.input}
            placeholder="Amount"
            placeholderTextColor="#888"
            value={amount}
            onChangeText={setAmount}
            keyboardType="decimal-pad"
          />
          <View style={styles.typeSwitch}>
            <TouchableOpacity
              style={[
                styles.typeButton,
                type === 'income' && styles.typeButtonActive,
              ]}
              onPress={() => setType('income')}
            >
              <Text
                style={[
                  styles.typeButtonText,
                  type === 'income' && styles.typeButtonTextActive,
                ]}
              >
                Income
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.typeButton,
                type === 'expense' && styles.typeButtonActive,
              ]}
              onPress={() => setType('expense')}
            >
              <Text
                style={[
                  styles.typeButtonText,
                  type === 'expense' && styles.typeButtonTextActive,
                ]}
              >
                Expense
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.datePickerButton}
            onPress={showDatePicker}
          >
            <Text style={styles.datePickerText}>
              {date.toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </Text>
          </TouchableOpacity>
          <DateTimePickerModal
            isVisible={isDateModalVisible}
            mode="date"
            date={date}
            maximumDate={new Date()}
            onConfirm={handleConfirm}
            onCancel={hideDatePicker}
          />
          <View style={styles.buttonsRow}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  container: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 20,
    elevation: 5,
  },
  heading: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#222',
    color: colors.text,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 15,
  },
  typeSwitch: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 15,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#333',
    marginHorizontal: 5,
  },
  typeButtonActive: {
    backgroundColor: colors.accent,
  },
  typeButtonText: {
    color: '#aaa',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  typeButtonTextActive: {
    color: '#fff',
  },
  datePickerButton: {
    paddingVertical: 12,
    backgroundColor: '#333',
    borderRadius: 8,
    marginBottom: 15,
  },
  datePickerText: {
    color: colors.text,
    fontSize: 16,
    textAlign: 'center',
  },
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    backgroundColor: '#555',
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    marginRight: 10,
  },
  cancelButtonText: {
    color: '#eee',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 16,
  },
  addButton: {
    backgroundColor: colors.accent,
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 16,
  },
});
