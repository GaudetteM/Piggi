import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { colors } from '../theme/colors';
import { useBudgetStore } from '../store/useBudgetStore';
import { BudgetCategoryCard } from '../components/BudgetCategoryCard';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PieChart } from 'lucide-react-native';

export const BudgetScreen = () => {
  const { activeBudget } = useBudgetStore();
  const [showBudgetPicker, setShowBudgetPicker] = useState(false);

  if (!activeBudget) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyState}>
          <PieChart size={64} color={colors.accent} />
          <Text style={styles.emptyTitle}>No Budget Created</Text>
          <Text style={styles.emptySubtitle}>
            Create your first budget to start tracking your spending
          </Text>
          <TouchableOpacity style={styles.createButton}>
            <Text style={styles.createButtonText}>Create Budget</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const totalBudget = activeBudget.categories.reduce((sum, cat) => sum + cat.budgetAmount, 0);
  const totalSpent = activeBudget.categories.reduce((sum, cat) => sum + cat.spent, 0);
  const remainingBudget = totalBudget - totalSpent;
  const spentPercentage = (totalSpent / totalBudget) * 100;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Budget</Text>
          <TouchableOpacity 
            style={styles.budgetSelector}
            onPress={() => setShowBudgetPicker(!showBudgetPicker)}
          >
            <Text style={styles.budgetName}>{activeBudget.name}</Text>
            <Text style={styles.budgetPeriod}>
              {activeBudget.period.charAt(0).toUpperCase() + activeBudget.period.slice(1)}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Budget Overview */}
      <View style={styles.overviewCard}>
        <View style={styles.overviewHeader}>
          <View style={styles.overviewItem}>
            <Text style={styles.overviewAmount}>
              ${totalBudget.toLocaleString()}
            </Text>
            <Text style={styles.overviewLabel}>Total Budget</Text>
          </View>
          
          <View style={styles.overviewItem}>
            <Text style={[styles.overviewAmount, { color: colors.expense }]}>
              ${totalSpent.toLocaleString()}
            </Text>
            <Text style={styles.overviewLabel}>Spent</Text>
          </View>
          
          <View style={styles.overviewItem}>
            <Text style={[
              styles.overviewAmount, 
              { color: remainingBudget >= 0 ? colors.income : colors.expense }
            ]}>
              ${Math.abs(remainingBudget).toLocaleString()}
            </Text>
            <Text style={styles.overviewLabel}>
              {remainingBudget >= 0 ? 'Remaining' : 'Over Budget'}
            </Text>
          </View>
        </View>

        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>Overall Progress</Text>
            <Text style={[
              styles.progressPercentage,
              { color: spentPercentage > 100 ? colors.expense : colors.accent }
            ]}>
              {spentPercentage.toFixed(0)}%
            </Text>
          </View>
          <View style={styles.progressTrack}>
            <View 
              style={[
                styles.progressFill, 
                { 
                  width: `${Math.min(100, spentPercentage)}%`,
                  backgroundColor: spentPercentage > 100 ? colors.expense : colors.accent
                }
              ]} 
            />
          </View>
        </View>
      </View>

      {/* Categories */}
      <Text style={styles.sectionTitle}>Categories</Text>
      <FlatList
        data={activeBudget.categories}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <BudgetCategoryCard 
            category={item}
            onPress={() => {
              // TODO: Navigate to category details or add expense
            }}
          />
        )}
        contentContainerStyle={styles.categoriesList}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
  },
  budgetSelector: {
    alignItems: 'flex-end',
  },
  budgetName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  budgetPeriod: {
    fontSize: 12,
    color: colors.text,
    opacity: 0.6,
  },
  overviewCard: {
    backgroundColor: colors.card,
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  overviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  overviewItem: {
    alignItems: 'center',
  },
  overviewAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  overviewLabel: {
    fontSize: 12,
    color: colors.text,
    opacity: 0.6,
  },
  progressSection: {
    marginTop: 8,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  progressPercentage: {
    fontSize: 14,
    fontWeight: '600',
  },
  progressTrack: {
    height: 8,
    backgroundColor: colors.background,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginHorizontal: 20,
    marginBottom: 16,
  },
  categoriesList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: colors.text,
    opacity: 0.6,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  createButton: {
    backgroundColor: colors.accent,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  createButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
