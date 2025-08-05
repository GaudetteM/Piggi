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
import { Edit3, Save, X } from 'lucide-react-native';

type Props = {
  visible: boolean;
  transaction: Transaction | null;
  onClose: () => void;
};

export default function EditTransactionModal({ visible, transaction, onClose }: Props) {
  const updateTransaction = useTransactionsStore(state => state.updateTransaction);
  const categories = useTransactionsStore(state => state.categories);

  const [title, setTitle] = useState(transaction?.title || '');
  const [amount, setAmount] = useState(transaction?.amount.toString() || '');
  const [type, setType] = useState<'income' | 'expense'>(transaction?.type || 'expense');
  const [selectedCategory, setSelectedCategory] = useState(transaction?.category || '');
  const [date, setDate] = useState(new Date(transaction?.date || new Date()));
  const [isDateModalVisible, setDateModalVisible] = useState(false);

  // Update state when transaction changes
  React.useEffect(() => {
    if (transaction) {
      setTitle(transaction.title);
      setAmount(transaction.amount.toString());
      setType(transaction.type);
      setSelectedCategory(transaction.category);
      setDate(new Date(transaction.date));
    }
  }, [transaction]);

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

  const showDatePicker = () => setDateModalVisible(true);
  const hideDatePicker = () => setDateModalVisible(false);

  const handleConfirm = (selectedDate: Date) => {
    setDate(selectedDate);
    hideDatePicker();
  };

  const handleSave = () => {
    if (!transaction) return;
    
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || !title.trim() || !selectedCategory) {
      return; // Basic validation
    }

    updateTransaction(transaction.id, {
      title: title.trim(),
      amount: numAmount,
      type,
      date: date.toISOString().slice(0, 10), // YYYY-MM-DD
      category: selectedCategory,
    });

    onClose();
  };

  if (!transaction) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Edit3 size={20} color={colors.accent} />
            <Text style={styles.heading}>Edit Transaction</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={20} color={colors.text} />
            </TouchableOpacity>
          </View>

          <TextInput
            style={styles.input}
            placeholder="Title"
            placeholderTextColor={colors.text + '60'}
            value={title}
            onChangeText={setTitle}
          />

          <TextInput
            style={styles.input}
            placeholder="Amount"
            placeholderTextColor={colors.text + '60'}
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

            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Save size={16} color="white" />
              <Text style={styles.saveButtonText}>Save Changes</Text>
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
    borderRadius: 16,
    padding: 20,
    elevation: 5,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  heading: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
    textAlign: 'center',
    marginLeft: -20, // Compensate for the close button
  },
  closeButton: {
    padding: 4,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    color: colors.text,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  typeSwitch: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginHorizontal: 5,
  },
  typeButtonActive: {
    backgroundColor: colors.accent,
  },
  typeButtonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    opacity: 0.8,
  },
  typeButtonTextActive: {
    color: 'white',
    opacity: 1,
  },
  sectionLabel: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    marginTop: 5,
  },
  categoryScroll: {
    marginBottom: 20,
  },
  categoryScrollContent: {
    paddingHorizontal: 5,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  categoryChipActive: {
    borderColor: 'transparent',
  },
  categoryChipText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '500',
    opacity: 0.8,
  },
  categoryChipTextActive: {
    color: 'white',
    fontWeight: '600',
    opacity: 1,
  },
  datePickerButton: {
    paddingVertical: 12,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
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
    backgroundColor: 'rgba(255,255,255,0.1)',
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    marginRight: 10,
  },
  cancelButtonText: {
    color: colors.text,
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: colors.accent,
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  saveButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
});
