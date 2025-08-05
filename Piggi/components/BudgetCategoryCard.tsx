import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BudgetCategory } from '../store/useBudgetStore';
import { colors } from '../theme/colors';
import { AnimatedCard } from './AnimatedCard';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

type Props = {
  category: BudgetCategory;
  onPress?: () => void;
};

export const BudgetCategoryCard = ({ category, onPress }: Props) => {
  const progressWidth = useSharedValue(0);
  
  const spentPercentage = Math.min(100, (category.spent / category.budgetAmount) * 100);
  const remaining = Math.max(0, category.budgetAmount - category.spent);
  
  const isOverBudget = category.spent > category.budgetAmount;
  const progressColor = isOverBudget ? colors.expense : 
                       spentPercentage > 80 ? '#FFA726' : category.color;

  React.useEffect(() => {
    progressWidth.value = withTiming(spentPercentage, { duration: 1000 });
  }, [spentPercentage, progressWidth]);

  const progressStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value}%`,
    backgroundColor: progressColor,
  }));

  return (
    <AnimatedCard onPress={onPress} style={styles.card}>
      <View style={styles.header}>
        <View style={styles.categoryInfo}>
          <Text style={styles.icon}>{category.icon}</Text>
          <View style={styles.textContainer}>
            <Text style={styles.categoryName} numberOfLines={1}>
              {category.name}
            </Text>
            <Text style={styles.budgetAmount}>
              ${category.budgetAmount.toFixed(0)} budget
            </Text>
          </View>
        </View>
        
        <View style={styles.amountContainer}>
          <Text style={[styles.spentAmount, { color: progressColor }]}>
            ${category.spent.toFixed(0)}
          </Text>
          <Text style={styles.remainingAmount}>
            ${remaining.toFixed(0)} left
          </Text>
        </View>
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressTrack}>
          <Animated.View style={[styles.progressFill, progressStyle]} />
        </View>
        <Text style={[styles.percentageText, { color: progressColor }]}>
          {spentPercentage.toFixed(0)}%
        </Text>
      </View>

      {isOverBudget && (
        <View style={styles.warningContainer}>
          <Text style={styles.warningText}>
            ⚠️ Over budget by ${(category.spent - category.budgetAmount).toFixed(0)}
          </Text>
        </View>
      )}
    </AnimatedCard>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  icon: {
    fontSize: 24,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  budgetAmount: {
    fontSize: 13,
    color: colors.text,
    opacity: 0.6,
  },
  amountContainer: {
    alignItems: 'flex-end',
  },
  spentAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  remainingAmount: {
    fontSize: 12,
    color: colors.text,
    opacity: 0.6,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressTrack: {
    flex: 1,
    height: 6,
    backgroundColor: colors.background,
    borderRadius: 3,
    overflow: 'hidden',
    marginRight: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  percentageText: {
    fontSize: 12,
    fontWeight: '600',
    minWidth: 35,
    textAlign: 'right',
  },
  warningContainer: {
    marginTop: 8,
    padding: 8,
    backgroundColor: colors.expense + '15',
    borderRadius: 6,
  },
  warningText: {
    fontSize: 12,
    color: colors.expense,
    fontWeight: '500',
    textAlign: 'center',
  },
});
