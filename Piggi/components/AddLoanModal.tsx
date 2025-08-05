import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Alert,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { colors } from '../theme/colors';
import { useLoansStore } from '../store/useLoansStore';

type Props = {
  visible: boolean;
  onClose: () => void;
};

export const AddLoanModal = ({ visible, onClose }: Props) => {
  const addLoan = useLoansStore(s => s.addLoan);

  const [name, setName] = useState('');
  const [principal, setPrincipal] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [monthlyPayment, setMonthlyPayment] = useState('');
  const [extraMonthly, setExtraMonthly] = useState('');
  const [lumpSum, setLumpSum] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const resetForm = () => {
    setName('');
    setPrincipal('');
    setInterestRate('');
    setMonthlyPayment('');
    setExtraMonthly('');
    setLumpSum('');
    setStartDate(new Date());
  };

  const handleAdd = () => {
    const p = parseFloat(principal);
    const i = parseFloat(interestRate);
    const m = parseFloat(monthlyPayment);
    const extra = parseFloat(extraMonthly);
    const lump = parseFloat(lumpSum);

    if (!name.trim() || isNaN(p) || isNaN(i) || isNaN(m)) {
      Alert.alert(
        'Please fill in required fields (name, principal, interest, monthly)',
      );
      return;
    }

    addLoan({
      name: name.trim(),
      principal: p,
      interestRate: i,
      monthlyPayment: m,
      extraMonthly: isNaN(extra) ? undefined : extra,
      lumpSum: isNaN(lump) ? undefined : lump,
      startDate: startDate.toISOString().slice(0, 10),
    });

    resetForm();
    onClose();
  };

  const onChangeDate = (_event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) setStartDate(selectedDate);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.heading}>Add New Loan</Text>

          <TextInput
            style={styles.input}
            placeholder="Loan Name"
            placeholderTextColor="#888"
            value={name}
            onChangeText={setName}
          />

          <TextInput
            style={styles.input}
            placeholder="Principal ($)"
            placeholderTextColor="#888"
            keyboardType="numeric"
            value={principal}
            onChangeText={setPrincipal}
          />

          <TextInput
            style={styles.input}
            placeholder="Interest Rate (%)"
            placeholderTextColor="#888"
            keyboardType="numeric"
            value={interestRate}
            onChangeText={setInterestRate}
          />

          <TextInput
            style={styles.input}
            placeholder="Monthly Payment ($)"
            placeholderTextColor="#888"
            keyboardType="numeric"
            value={monthlyPayment}
            onChangeText={setMonthlyPayment}
          />

          <TextInput
            style={styles.input}
            placeholder="Extra Monthly Payment (optional)"
            placeholderTextColor="#888"
            keyboardType="numeric"
            value={extraMonthly}
            onChangeText={setExtraMonthly}
          />

          <TextInput
            style={styles.input}
            placeholder="One-time Lump Sum (optional)"
            placeholderTextColor="#888"
            keyboardType="numeric"
            value={lumpSum}
            onChangeText={setLumpSum}
          />

          <TouchableOpacity
            style={styles.datePickerButton}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.datePickerText}>
              Start Date: {startDate.toLocaleDateString()}
            </Text>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={startDate}
              mode="date"
              display={Platform.OS === 'ios' ? 'inline' : 'calendar'}
              onChange={onChangeDate}
              maximumDate={new Date()}
            />
          )}

          <View style={styles.buttonsRow}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
              <Text style={styles.addButtonText}>Add Loan</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

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
    marginBottom: 12,
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
