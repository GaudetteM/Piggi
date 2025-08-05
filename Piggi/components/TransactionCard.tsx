import React from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { Transaction } from '../store/useTransactionsStore';
import { colors } from '../theme/colors';
import { ArrowUpRight, ArrowDownLeft, Trash2 } from 'lucide-react-native';
import { formatCurrencyFull } from '../utils/formatters';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  runOnJS,
  withSpring,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

type Props = {
  transaction: Transaction;
  onPress?: () => void;
  onDelete?: () => void;
};

export default function TransactionCard({ transaction, onPress, onDelete }: Props) {
  const translateX = useSharedValue(0);
  const isIncome = transaction.type === 'income';
  const amountColor = isIncome ? colors.income : colors.expense;
  const sign = isIncome ? '+' : '-';
  const Icon = isIncome ? ArrowUpRight : ArrowDownLeft;

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
      ]
    );
  };

  const panGesture = Gesture.Pan()
    .activeOffsetX([-10, 10]) // Only activate when horizontal movement is significant
    .failOffsetY([-5, 5]) // Allow vertical scrolling to pass through
    .onUpdate((event) => {
      if (event.translationX < 0) {
        translateX.value = Math.max(event.translationX, -80);
      }
    })
    .onEnd((event) => {
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
          <TouchableOpacity onPress={onPress} style={styles.card} activeOpacity={0.7}>
            <View style={styles.iconContainer}>
              <View style={[styles.iconCircle, { backgroundColor: `${amountColor}15` }]}>
                <Icon size={20} color={amountColor} />
              </View>
            </View>
            
            <View style={styles.content}>
              <Text style={styles.title} numberOfLines={1}>
                {transaction.title}
              </Text>
              <Text style={styles.date}>{formatDate(transaction.date)}</Text>
            </View>
            
            <View style={styles.amountContainer}>
              <Text style={[styles.amount, { color: amountColor }]}>
                {formatCurrencyFull(transaction.amount * (isIncome ? 1 : -1))}
              </Text>
            </View>
          </TouchableOpacity>
        </Animated.View>
      </GestureDetector>
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
    marginBottom: 4,
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
});
