import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { colors } from '../theme/colors';
import { CreditCard, PieChart, DollarSign, X } from 'lucide-react-native';
import { AnimatedCard } from './AnimatedCard';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

type Props = {
  visible: boolean;
  onClose: () => void;
  onAddTransaction: () => void;
  onAddLoan: () => void;
  onCreateBudget: () => void;
};

export const QuickActionMenu = ({ 
  visible, 
  onClose, 
  onAddTransaction, 
  onAddLoan, 
  onCreateBudget 
}: Props) => {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);

  React.useEffect(() => {
    if (visible) {
      scale.value = withSpring(1);
      opacity.value = withTiming(1);
    } else {
      scale.value = withSpring(0);
      opacity.value = withTiming(0);
    }
  }, [visible, scale, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const actions = [
    {
      id: 'transaction',
      title: 'Add Transaction',
      subtitle: 'Record income or expense',
      icon: DollarSign,
      color: colors.accent,
      onPress: onAddTransaction,
    },
    {
      id: 'loan',
      title: 'Add Loan',
      subtitle: 'Track a new loan',
      icon: CreditCard,
      color: colors.expense,
      onPress: onAddLoan,
    },
    {
      id: 'budget',
      title: 'Create Budget',
      subtitle: 'Set spending limits',
      icon: PieChart,
      color: colors.income,
      onPress: onCreateBudget,
    },
  ];

  if (!visible) return null;

  return (
    <Modal transparent visible={visible} animationType="none">
      <Animated.View style={[styles.overlay, overlayStyle]}>
        <TouchableOpacity 
          style={StyleSheet.absoluteFill} 
          onPress={onClose}
          activeOpacity={1}
        />
        
        <Animated.View style={[styles.container, animatedStyle]}>
          <View style={styles.header}>
            <Text style={styles.title}>Quick Actions</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          <View style={styles.actionsContainer}>
            {actions.map((action) => {
              const IconComponent = action.icon;
              
              return (
                <AnimatedCard
                  key={action.id}
                  onPress={() => {
                    action.onPress();
                    onClose();
                  }}
                  style={styles.actionCard}
                >
                  <View style={[styles.iconContainer, { backgroundColor: action.color + '20' }]}>
                    <IconComponent size={24} color={action.color} />
                  </View>
                  
                  <View style={styles.actionContent}>
                    <Text style={styles.actionTitle}>{action.title}</Text>
                    <Text style={styles.actionSubtitle}>{action.subtitle}</Text>
                  </View>
                </AnimatedCard>
              );
            })}
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  container: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 20,
    width: '100%',
    maxWidth: 320,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  closeButton: {
    padding: 4,
  },
  actionsContainer: {
    gap: 12,
  },
  actionCard: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  actionSubtitle: {
    fontSize: 14,
    color: colors.text,
    opacity: 0.6,
  },
});
