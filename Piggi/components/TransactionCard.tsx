import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {
  Transaction,
  useTransactionsStore,
} from '../store/useTransactionsStore';
import { colors } from '../theme/colors';
import {
  ArrowUpRight,
  ArrowDownLeft,
  Trash2,
  Edit3,
  X,
  ChevronDown,
} from 'lucide-react-native';
import { formatCurrencyFull } from '../utils/formatters';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  runOnJS,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import EditTransactionModal from './EditTransactionModal';

type Props = {
  transaction: Transaction;
  onPress?: () => void;
  onDelete?: () => void;
};

export default function TransactionCard({
  transaction,
  onPress,
  onDelete,
}: Props) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditingCategory, setIsEditingCategory] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

  const translateX = useSharedValue(0);
  const expandHeight = useSharedValue(0);

  const categories = useTransactionsStore(s => s.categories);
  const updateTransaction = useTransactionsStore(s => s.updateTransaction);

  const category = categories.find(c => c.id === transaction.category);

  const isIncome = transaction.type === 'income';
  const amountColor = isIncome ? colors.income : colors.expense;
  const Icon = isIncome ? ArrowUpRight : ArrowDownLeft;

  // Filter categories based on transaction type
  const availableCategories = categories.filter(
    cat => cat.type === transaction.type || cat.type === 'both',
  );

  const toggleExpanded = () => {
    const newExpanded = !isExpanded;
    setIsExpanded(newExpanded);
    expandHeight.value = withTiming(newExpanded ? 80 : 0, { duration: 300 });

    if (newExpanded && onPress) {
      onPress();
    }

    // Reset editing state when collapsing
    if (!newExpanded) {
      setIsEditingCategory(false);
    }
  };

  const handleCategoryUpdate = (categoryId: string) => {
    updateTransaction(transaction.id, { category: categoryId });
    setIsEditingCategory(false);
  };

  const handleCardPress = () => {
    // Only expand if not currently swiped
    if (translateX.value === 0) {
      toggleExpanded();
    }
  };

  const handleLongPress = () => {
    setIsEditModalVisible(true);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const confirmDelete = () => {
    Alert.alert(
      'Delete Transaction',
      `Are you sure you want to delete "${transaction.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: onDelete },
      ],
    );
  };

  const panGesture = Gesture.Pan()
    .activeOffsetX([-10, 10]) // Only activate when horizontal movement is significant
    .failOffsetY([-5, 5]) // Allow vertical scrolling to pass through
    .onUpdate(event => {
      if (event.translationX < 0) {
        translateX.value = Math.max(event.translationX, -80);
      }
    })
    .onEnd(event => {
      if (event.translationX < -40) {
        translateX.value = withSpring(-80);
      } else {
        translateX.value = withSpring(0);
      }
    });

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const deleteButtonStyle = useAnimatedStyle(() => ({
    opacity: translateX.value < -30 ? 1 : 0,
  }));

  const expandedStyle = useAnimatedStyle(() => ({
    height: expandHeight.value,
    opacity: expandHeight.value > 0 ? 1 : 0,
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.deleteButton, deleteButtonStyle]}>
        <TouchableOpacity
          style={styles.deleteButtonInner}
          onPress={() => {
            translateX.value = withSpring(0);
            runOnJS(confirmDelete)();
          }}
        >
          <Trash2 size={20} color="white" />
        </TouchableOpacity>
      </Animated.View>

      <GestureDetector gesture={panGesture}>
        <Animated.View style={cardStyle}>
          <TouchableOpacity
            onPress={handleCardPress}
            onLongPress={handleLongPress}
            style={styles.card}
            activeOpacity={0.7}
          >
            <View style={styles.iconContainer}>
              <View
                style={[
                  styles.iconCircle,
                  {
                    backgroundColor: category?.color
                      ? `${category.color}20`
                      : `${amountColor}15`,
                  },
                ]}
              >
                <Icon size={20} color={category?.color || amountColor} />
              </View>
            </View>

            <View style={styles.content}>
              <Text style={styles.title} numberOfLines={1}>
                {transaction.title}
              </Text>
              <View style={styles.metadata}>
                {category && (
                  <View
                    style={[
                      styles.categoryBadge,
                      { backgroundColor: `${category.color}20` },
                    ]}
                  >
                    <Text
                      style={[styles.categoryText, { color: category.color }]}
                    >
                      {category.name}
                    </Text>
                  </View>
                )}
                <Text style={styles.date}>{formatDate(transaction.date)}</Text>
              </View>
            </View>

            <View style={styles.amountContainer}>
              <Text style={[styles.amount, { color: amountColor }]}>
                {formatCurrencyFull(transaction.amount * (isIncome ? 1 : -1))}
              </Text>
              <Animated.View
                style={[
                  styles.chevronContainer,
                  {
                    transform: [{ rotate: isExpanded ? '180deg' : '0deg' }],
                  },
                ]}
              >
                <ChevronDown
                  size={16}
                  color={colors.text}
                  style={styles.chevronIcon}
                />
              </Animated.View>
            </View>
          </TouchableOpacity>

          {/* Simplified Expandable Section - Category Only */}
          <Animated.View style={[styles.expandedSection, expandedStyle]}>
            <View style={styles.expandedContent}>
              <View style={styles.editRow}>
                <Text style={styles.editLabel}>Quick Edit Category</Text>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => setIsEditingCategory(!isEditingCategory)}
                >
                  {isEditingCategory ? (
                    <X size={16} color={colors.text} />
                  ) : (
                    <Edit3 size={16} color={colors.accent} />
                  )}
                </TouchableOpacity>
              </View>

              {isEditingCategory ? (
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={styles.categoryEditScroll}
                  contentContainerStyle={styles.categoryEditScrollContent}
                >
                  {availableCategories.map(cat => (
                    <TouchableOpacity
                      key={cat.id}
                      style={[
                        styles.editCategoryChip,
                        transaction.category === cat.id && [
                          styles.editCategoryChipActive,
                          { backgroundColor: cat.color },
                        ],
                      ]}
                      onPress={() => handleCategoryUpdate(cat.id)}
                    >
                      <Text
                        style={[
                          styles.editCategoryChipText,
                          transaction.category === cat.id &&
                            styles.editCategoryChipTextActive,
                        ]}
                      >
                        {cat.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              ) : (
                <View style={styles.categoryDisplay}>
                  <Text style={styles.currentCategoryText}>
                    {category?.name || 'No category'}
                  </Text>
                  <Text style={styles.longPressHint}>
                    Long press to edit transaction details
                  </Text>
                </View>
              )}
            </View>
          </Animated.View>
        </Animated.View>
      </GestureDetector>

      <EditTransactionModal
        visible={isEditModalVisible}
        transaction={transaction}
        onClose={() => setIsEditModalVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  deleteButton: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonInner: {
    backgroundColor: colors.expense,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  iconContainer: {
    marginRight: 16,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    marginRight: 16,
  },
  title: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 6,
  },
  metadata: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '500',
  },
  date: {
    color: colors.text,
    opacity: 0.6,
    fontSize: 14,
  },
  amountContainer: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: 18,
    fontWeight: '700',
  },
  chevronContainer: {
    marginTop: 4,
  },
  chevronIcon: {
    opacity: 0.5,
  },
  expandedSection: {
    overflow: 'hidden',
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  expandedContent: {
    padding: 20,
    paddingTop: 16,
  },
  editRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  editLabel: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  editButton: {
    padding: 4,
  },
  categoryEditScroll: {
    marginTop: 8,
  },
  categoryEditScrollContent: {
    paddingHorizontal: 4,
  },
  editCategoryChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  editCategoryChipActive: {
    borderColor: 'transparent',
  },
  editCategoryChipText: {
    color: colors.text,
    fontSize: 12,
    fontWeight: '500',
    opacity: 0.8,
  },
  editCategoryChipTextActive: {
    color: 'white',
    fontWeight: '600',
    opacity: 1,
  },
  currentCategoryText: {
    color: colors.text,
    fontSize: 14,
    opacity: 0.7,
    fontStyle: 'italic',
  },
  categoryDisplay: {
    marginTop: 8,
  },
  longPressHint: {
    color: colors.text,
    fontSize: 11,
    opacity: 0.5,
    marginTop: 4,
    fontStyle: 'italic',
  },
});
