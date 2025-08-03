import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { colors } from '../theme/colors';

function calculateLoan(principal: number, apr: number, termMonths: number) {
  const monthlyRate = apr / 100 / 12;

  if (monthlyRate === 0) {
    const monthlyPayment = principal / termMonths;
    return {
      monthlyPayment,
      totalPaid: monthlyPayment * termMonths,
      totalInterest: 0,
    };
  }

  const numerator = principal * monthlyRate;
  const denominator = 1 - Math.pow(1 + monthlyRate, -termMonths);
  const monthlyPayment = numerator / denominator;
  const totalPaid = monthlyPayment * termMonths;
  const totalInterest = totalPaid - principal;

  return {
    monthlyPayment,
    totalPaid,
    totalInterest,
  };
}

export default function LoanCalculatorForm() {
  const [principal, setPrincipal] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [termMonths, setTermMonths] = useState('');
  const [result, setResult] = useState<null | {
    monthlyPayment: number;
    totalPaid: number;
    totalInterest: number;
  }>(null);

  const handleCalculate = () => {
    const p = parseFloat(principal);
    const i = parseFloat(interestRate);
    const t = parseInt(termMonths);

    if (isNaN(p) || isNaN(i) || isNaN(t)) {
      Alert.alert('Enter valid numbers for all fields');
      return;
    }

    const res = calculateLoan(p, i, t);
    setResult(res);
  };

  return (
    <View>
      <TextInput
        style={styles.input}
        placeholder="Loan Amount ($)"
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
        placeholder="Term (months)"
        placeholderTextColor="#888"
        keyboardType="numeric"
        value={termMonths}
        onChangeText={setTermMonths}
      />

      <TouchableOpacity style={styles.calcButton} onPress={handleCalculate}>
        <Text style={styles.calcButtonText}>Calculate</Text>
      </TouchableOpacity>

      {result && (
        <View style={styles.results}>
          <Text style={styles.resultText}>
            💵 Monthly Payment:{' '}
            <Text style={styles.resultHighlight}>
              ${result.monthlyPayment.toFixed(2)}
            </Text>
          </Text>
          <Text style={styles.resultText}>
            📈 Total Interest:{' '}
            <Text style={styles.resultHighlight}>
              ${result.totalInterest.toFixed(2)}
            </Text>
          </Text>
          <Text style={styles.resultText}>
            🧾 Total Paid:{' '}
            <Text style={styles.resultHighlight}>
              ${result.totalPaid.toFixed(2)}
            </Text>
          </Text>
        </View>
      )}
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
  calcButton: {
    backgroundColor: colors.accent,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  calcButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 16,
  },
  results: {
    padding: 12,
    backgroundColor: '#333',
    borderRadius: 8,
  },
  resultText: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 8,
  },
  resultHighlight: {
    fontWeight: 'bold',
    color: colors.accent,
  },
});
