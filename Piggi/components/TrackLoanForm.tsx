import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Platform,
  StyleSheet,
  Alert,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useLoansStore } from '../store/useLoansStore';
import { colors } from '../theme/colors';

type Props = {
  onClose: () => void;
};

export default function TrackLoanForm({ onClose }: Props) {
  const addLoan = useLoansStore(s => s.addLoan);

  const [name, setName] = useState('');
  const [principal, setPrincipal] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [monthlyPayment, setMonthlyPayment] = useState('');
  const [extraMonthly, setExtraMonthly] = useState('');
  const [lumpSum, setLumpSum] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

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

    onClose();
  };

  const onChangeDate = (_e: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) setStartDate(selectedDate);
  };

  return (
    <View>
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
        placeholder="Lump Sum (optional)"
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

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
          <Text style={styles.addButtonText}>Add Loan</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#555',
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
    flex: 1,
    backgroundColor: colors.accent,
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
