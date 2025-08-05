import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Pressable } from 'react-native';
import { Loan } from '../store/useLoansStore';
import { colors } from '../theme/colors';
import { calculateLoan, formatCurrency, formatTime } from '../utils/loanHelpers';
import { ChevronDown, DollarSign, Clock, Zap, TrendingDown } from 'lucide-react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
} from 'react-native-reanimated';

type Props = {
  loan: Loan;
  onPress: () => void;
};

export const MinimalLoanCard = ({ loan, onPress }: Props) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const expansionHeight = useSharedValue(0);
  
  const calculation = calculateLoan(
    loan.principal,
    loan.interestRate,
    loan.monthlyPayment,
    loan.extraMonthly,
    loan.lumpSum,
  );

  // Calculate progress based on time elapsed
  const startDate = new Date(loan.startDate);
  const now = new Date();
  const monthsElapsed = Math.max(0, 
    (now.getFullYear() - startDate.getFullYear()) * 12 + 
    (now.getMonth() - startDate.getMonth())
  );
  
  const progress = Math.min(100, (monthsElapsed / Math.max(calculation.term, 1)) * 100);
  
  const remainingBalance = calculation.amortization.length > monthsElapsed 
    ? calculation.amortization[Math.max(0, monthsElapsed - 1)]?.balance || loan.principal
    : 0;

  React.useEffect(() => {
    expansionHeight.value = withTiming(isExpanded ? 1 : 0, { duration: 300 });
  }, [isExpanded, expansionHeight]);

  const expandedStyle = useAnimatedStyle(() => ({
    height: interpolate(expansionHeight.value, [0, 1], [0, 140]),
    opacity: interpolate(expansionHeight.value, [0, 1], [0, 1]),
  }));

  const chevronStyle = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${interpolate(expansionHeight.value, [0, 1], [0, 180])}deg` }
    ],
  }));

  const handleExpandToggle = () => {
    setIsExpanded(!isExpanded);
  };

  const handleCardPress = () => {
    if (!isExpanded) {
      onPress();
    }
  };

  return (
    <View style={styles.container}>
      <Pressable onPress={handleCardPress} style={styles.card}>
        {/* Main Content */}
        <View style={styles.header}>
          <View style={styles.loanInfo}>
            <Text style={styles.loanName} numberOfLines={1}>{loan.name}</Text>
            <Text style={styles.loanDetails}>
              {formatCurrency(loan.principal)} • {loan.interestRate}% APR
            </Text>
          </View>
          
          <View style={styles.rightSection}>
            <Text style={styles.remainingBalance}>
              {formatCurrency(remainingBalance)}
            </Text>
            <Text style={styles.balanceLabel}>remaining</Text>
          </View>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressSection}>
          <View style={styles.progressTrack}>
            <View 
              style={[
                styles.progressFill, 
                { 
                  width: `${progress}%`,
                  backgroundColor: progress > 80 ? colors.income : colors.accent 
                }
              ]} 
            />
          </View>
          <View style={styles.progressFooter}>
            <Text style={styles.progressText}>
              {monthsElapsed}/{calculation.term} months • {formatTime(Math.max(0, calculation.term - monthsElapsed))} left
            </Text>
            <Text style={styles.progressPercentage}>{progress.toFixed(0)}%</Text>
          </View>
        </View>

        {/* Extra Payment Badge */}
        {(loan.extraMonthly && loan.extraMonthly > 0) && (
          <View style={styles.extraBadge}>
            <Zap size={12} color={colors.income} />
            <Text style={styles.extraText}>+{formatCurrency(loan.extraMonthly)}/mo</Text>
          </View>
        )}

        {/* Expand Button */}
        <TouchableOpacity 
          style={styles.expandButton} 
          onPress={handleExpandToggle}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={styles.expandText}>Details</Text>
          <Animated.View style={chevronStyle}>
            <ChevronDown size={16} color={colors.text} />
          </Animated.View>
        </TouchableOpacity>

        {/* Expanded Content */}
        <Animated.View style={[styles.expandedContent, expandedStyle]}>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <View style={styles.statIcon}>
                <DollarSign size={14} color={colors.accent} />
              </View>
              <Text style={styles.statValue}>
                {formatCurrency(calculation.monthlyPayment)}
              </Text>
              <Text style={styles.statLabel}>Monthly Payment</Text>
            </View>

            <View style={styles.statItem}>
              <View style={styles.statIcon}>
                <Clock size={14} color={colors.income} />
              </View>
              <Text style={styles.statValue}>
                {formatTime(calculation.term)}
              </Text>
              <Text style={styles.statLabel}>Total Term</Text>
            </View>

            <View style={styles.statItem}>
              <View style={styles.statIcon}>
                <TrendingDown size={14} color={colors.expense} />
              </View>
              <Text style={styles.statValue}>
                {formatCurrency(calculation.totalInterest)}
              </Text>
              <Text style={styles.statLabel}>Total Interest</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.viewDetailButton} onPress={onPress}>
            <Text style={styles.viewDetailText}>View Full Details</Text>
          </TouchableOpacity>
        </Animated.View>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  loanInfo: {
    flex: 1,
    marginRight: 12,
  },
  loanName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  loanDetails: {
    fontSize: 14,
    color: colors.text,
    opacity: 0.7,
  },
  rightSection: {
    alignItems: 'flex-end',
  },
  remainingBalance: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.accent,
  },
  balanceLabel: {
    fontSize: 12,
    color: colors.text,
    opacity: 0.6,
    marginTop: 2,
  },
  progressSection: {
    marginBottom: 12,
  },
  progressTrack: {
    height: 6,
    backgroundColor: colors.background,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressText: {
    fontSize: 12,
    color: colors.text,
    opacity: 0.7,
  },
  progressPercentage: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.accent,
  },
  extraBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: colors.income + '20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 12,
    gap: 4,
  },
  extraText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.income,
  },
  expandButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    gap: 4,
  },
  expandText: {
    fontSize: 14,
    color: colors.text,
    opacity: 0.8,
  },
  expandedContent: {
    overflow: 'hidden',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingTop: 8,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 10,
    color: colors.text,
    opacity: 0.6,
    textAlign: 'center',
  },
  viewDetailButton: {
    backgroundColor: colors.accent + '20',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  viewDetailText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.accent,
  },
});
