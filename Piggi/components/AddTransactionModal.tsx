import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { colors } from '../theme/colors';
import {
  useTransactionsStore,
  Transaction,
} from '../store/useTransactionsStore';
import uuid from 'react-native-uuid';
import { suggestCategoryFromTitle } from '../utils/categoryHelpers';

type Props = {
  visible: boolean;
  onClose: () => void;
};

export default function AddTransactionModal({ visible, onClose }: Props) {
  const addTransaction = useTransactionsStore(state => state.addTransaction);
  const categories = useTransactionsStore(state => state.categories);

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [date, setDate] = useState(new Date());
  const [isDateModalVisible, setDateModalVisible] = useState(false);

  // Filter categories based on selected type
  const availableCategories = categories.filter(
    cat => cat.type === type || cat.type === 'both'
  );

  // Auto-select first category when type changes
  React.useEffect(() => {
    if (availableCategories.length > 0 && !selectedCategory) {
      setSelectedCategory(availableCategories[0].id);
    }
  }, [type, availableCategories, selectedCategory]);

  // Auto-suggest category based on title
  React.useEffect(() => {
    if (title.trim().length > 2) {
      const suggestedCategoryId = suggestCategoryFromTitle(title, type);
      if (suggestedCategoryId && availableCategories.some(cat => cat.id === suggestedCategoryId)) {
        setSelectedCategory(suggestedCategoryId);
      }
    }
  }, [title, type, availableCategories]);

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
    setSelectedCategory('');
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
      category: selectedCategory,
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

          {/* Category Selection */}
          <Text style={styles.sectionLabel}>Category</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.categoryScroll}
            contentContainerStyle={styles.categoryScrollContent}
          >
            {availableCategories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryChip,
                  selectedCategory === category.id && [
                    styles.categoryChipActive,
                    { backgroundColor: category.color }
                  ]
                ]}
                onPress={() => setSelectedCategory(category.id)}
              >
                <Text
                  style={[
                    styles.categoryChipText,
                    selectedCategory === category.id && styles.categoryChipTextActive
                  ]}
                >
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

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
  sectionLabel: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    marginTop: 5,
  },
  categoryScroll: {
    marginBottom: 15,
  },
  categoryScrollContent: {
    paddingHorizontal: 5,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#333',
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#444',
  },
  categoryChipActive: {
    borderColor: 'transparent',
  },
  categoryChipText: {
    color: '#aaa',
    fontSize: 14,
    fontWeight: '500',
  },
  categoryChipTextActive: {
    color: 'white',
    fontWeight: '600',
  },
});
