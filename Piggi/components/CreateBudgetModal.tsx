import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import { colors } from '../theme/colors';
import { useBudgetStore, BudgetCategory } from '../store/useBudgetStore';
import { X, Plus, Minus, Save } from 'lucide-react-native';
import uuid from 'react-native-uuid';

type Props = {
  visible: boolean;
  onClose: () => void;
};

const defaultBudgetCategories = [
  { name: 'Food & Dining', budgetAmount: 400, color: '#FF6B6B', icon: '🍽️' },
  { name: 'Transportation', budgetAmount: 200, color: '#4ECDC4', icon: '🚗' },
  { name: 'Shopping', budgetAmount: 150, color: '#45B7D1', icon: '🛍️' },
  { name: 'Entertainment', budgetAmount: 100, color: '#96CEB4', icon: '🎬' },
  { name: 'Bills & Utilities', budgetAmount: 300, color: '#FECA57', icon: '💡' },
  { name: 'Healthcare', budgetAmount: 150, color: '#FF9FF3', icon: '🏥' },
  { name: 'Coffee', budgetAmount: 50, color: '#8D6E63', icon: '☕' },
];

export const CreateBudgetModal = ({ visible, onClose }: Props) => {
  const addBudget = useBudgetStore(state => state.addBudget);
  
  const [budgetName, setBudgetName] = useState('My Monthly Budget');
  const [period, setPeriod] = useState<'weekly' | 'monthly' | 'yearly'>('monthly');
  const [categories, setCategories] = useState<Omit<BudgetCategory, 'id' | 'spent'>[]>(
    defaultBudgetCategories.map(cat => ({ ...cat, spent: 0 }))
  );

  const updateCategoryAmount = (index: number, amount: string) => {
    const numAmount = parseFloat(amount) || 0;
    setCategories(prev => prev.map((cat, i) => 
      i === index ? { ...cat, budgetAmount: numAmount } : cat
    ));
  };

  const removeCategory = (index: number) => {
    if (categories.length > 1) {
      setCategories(prev => prev.filter((_, i) => i !== index));
    }
  };

  const addCustomCategory = () => {
    setCategories(prev => [...prev, {
      name: 'New Category',
      budgetAmount: 100,
      spent: 0,
      color: '#6C63FF',
      icon: '📱',
    }]);
  };

  const updateCategoryName = (index: number, name: string) => {
    setCategories(prev => prev.map((cat, i) => 
      i === index ? { ...cat, name } : cat
    ));
  };

  const handleSave = () => {
    if (!budgetName.trim()) {
      Alert.alert('Error', 'Please enter a budget name');
      return;
    }

    if (categories.length === 0) {
      Alert.alert('Error', 'Please add at least one category');
      return;
    }

    const today = new Date();
    let startDate: Date;
    let endDate: Date;

    switch (period) {
      case 'weekly':
        startDate = new Date(today);
        startDate.setDate(today.getDate() - today.getDay()); // Start of week
        endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 6); // End of week
        break;
      case 'yearly':
        startDate = new Date(today.getFullYear(), 0, 1); // Start of year
        endDate = new Date(today.getFullYear(), 11, 31); // End of year
        break;
      case 'monthly':
      default:
        startDate = new Date(today.getFullYear(), today.getMonth(), 1); // Start of month
        endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0); // End of month
        break;
    }

    const budgetCategories: BudgetCategory[] = categories.map(cat => ({
      id: uuid.v4().toString(),
      ...cat,
      spent: 0,
    }));

    addBudget({
      name: budgetName.trim(),
      period,
      categories: budgetCategories,
      startDate: startDate.toISOString().slice(0, 10),
      endDate: endDate.toISOString().slice(0, 10),
    });

    // Reset form
    setBudgetName('My Monthly Budget');
    setPeriod('monthly');
    setCategories(defaultBudgetCategories.map(cat => ({ ...cat, spent: 0 })));
    
    onClose();
  };

  const totalBudget = categories.reduce((sum, cat) => sum + cat.budgetAmount, 0);

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Create Budget</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Budget Name */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Budget Name</Text>
              <TextInput
                style={styles.input}
                value={budgetName}
                onChangeText={setBudgetName}
                placeholder="Enter budget name"
                placeholderTextColor={colors.text + '60'}
              />
            </View>

            {/* Period Selection */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Period</Text>
              <View style={styles.periodSelector}>
                {(['weekly', 'monthly', 'yearly'] as const).map((p) => (
                  <TouchableOpacity
                    key={p}
                    style={[
                      styles.periodButton,
                      period === p && styles.periodButtonActive
                    ]}
                    onPress={() => setPeriod(p)}
                  >
                    <Text style={[
                      styles.periodButtonText,
                      period === p && styles.periodButtonTextActive
                    ]}>
                      {p.charAt(0).toUpperCase() + p.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Categories */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Categories</Text>
                <TouchableOpacity onPress={addCustomCategory} style={styles.addButton}>
                  <Plus size={20} color={colors.accent} />
                </TouchableOpacity>
              </View>

              {categories.map((category, index) => (
                <View key={index} style={styles.categoryRow}>
                  <Text style={styles.categoryIcon}>{category.icon}</Text>
                  <TextInput
                    style={styles.categoryNameInput}
                    value={category.name}
                    onChangeText={(text) => updateCategoryName(index, text)}
                    placeholder="Category name"
                    placeholderTextColor={colors.text + '60'}
                  />
                  <Text style={styles.dollarSign}>$</Text>
                  <TextInput
                    style={styles.amountInput}
                    value={category.budgetAmount.toString()}
                    onChangeText={(text) => updateCategoryAmount(index, text)}
                    keyboardType="decimal-pad"
                    placeholder="0"
                    placeholderTextColor={colors.text + '60'}
                  />
                  {categories.length > 1 && (
                    <TouchableOpacity
                      onPress={() => removeCategory(index)}
                      style={styles.removeButton}
                    >
                      <Minus size={20} color={colors.expense} />
                    </TouchableOpacity>
                  )}
                </View>
              ))}

              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Total Budget:</Text>
                <Text style={styles.totalAmount}>${totalBudget.toLocaleString()}</Text>
              </View>
            </View>
          </ScrollView>

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Save size={20} color="white" />
            <Text style={styles.saveButtonText}>Create Budget</Text>
          </TouchableOpacity>
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
    borderRadius: 16,
    padding: 20,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
  closeButton: {
    padding: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    color: colors.text,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  periodSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  periodButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  periodButtonActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  periodButtonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    opacity: 0.8,
  },
  periodButtonTextActive: {
    color: 'white',
    opacity: 1,
  },
  addButton: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 8,
  },
  categoryIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  categoryNameInput: {
    flex: 1,
    color: colors.text,
    fontSize: 16,
    marginRight: 12,
  },
  dollarSign: {
    color: colors.text,
    fontSize: 16,
    marginRight: 4,
  },
  amountInput: {
    color: colors.text,
    fontSize: 16,
    textAlign: 'right',
    minWidth: 80,
    marginRight: 8,
  },
  removeButton: {
    padding: 4,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.accent,
  },
  saveButton: {
    backgroundColor: colors.accent,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 16,
    gap: 8,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});
