import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Loan } from '../store/useLoansStore';
import { colors } from '../theme/colors';
import { calculateLoan, formatCurrency, formatTime } from '../utils/loanHelpers';
import { DollarSign, Clock, Zap, TrendingDown } from 'lucide-react-native';
import { AnimatedCard } from './AnimatedCard';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';

type Props = {
  loan: Loan;
  onPress: () => void;
};

export const EnhancedLoanCard = ({ loan, onPress }: Props) => {
  const progressWidth = useSharedValue(0);
  
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
  
  React.useEffect(() => {
    progressWidth.value = withTiming(progress, { duration: 1500 });
  }, [progress, progressWidth]);

  const progressStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value}%`,
  }));

  const remainingBalance = calculation.amortization.length > monthsElapsed 
    ? calculation.amortization[Math.max(0, monthsElapsed - 1)]?.balance || loan.principal
    : 0;

  const monthlyInterest = remainingBalance * (loan.interestRate / 100 / 12);
  const monthlyPrincipal = (loan.monthlyPayment + (loan.extraMonthly || 0)) - monthlyInterest;

  return (
    <AnimatedCard onPress={onPress} style={styles.card}>
      <LinearGradient
        colors={[colors.card, colors.card + 'E6']}
        style={styles.gradient}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.loanInfo}>
            <Text style={styles.loanName} numberOfLines={1}>{loan.name}</Text>
            <Text style={styles.loanType}>
              {formatCurrency(loan.principal)} • {loan.interestRate}% APR
            </Text>
          </View>
          <View style={styles.balanceContainer}>
            <Text style={styles.remainingBalance}>
              {formatCurrency(remainingBalance)}
            </Text>
            <Text style={styles.balanceLabel}>Remaining</Text>
          </View>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>Progress</Text>
            <Text style={styles.progressPercentage}>{progress.toFixed(1)}%</Text>
          </View>
          <View style={styles.progressTrack}>
            <Animated.View 
              style={[
                styles.progressFill, 
                progressStyle,
                { backgroundColor: progress > 80 ? colors.income : colors.accent }
              ]} 
            />
          </View>
          <View style={styles.progressFooter}>
            <Text style={styles.progressText}>
              {monthsElapsed} of {calculation.term} months
            </Text>
            <Text style={styles.progressText}>
              {formatTime(Math.max(0, calculation.term - monthsElapsed))} left
            </Text>
          </View>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <View style={styles.statIcon}>
              <DollarSign size={16} color={colors.accent} />
            </View>
            <Text style={styles.statValue}>
              {formatCurrency(calculation.monthlyPayment)}
            </Text>
            <Text style={styles.statLabel}>Monthly Payment</Text>
          </View>

          <View style={styles.statItem}>
            <View style={styles.statIcon}>
              <Clock size={16} color={colors.income} />
            </View>
            <Text style={styles.statValue}>
              {formatTime(calculation.term)}
            </Text>
            <Text style={styles.statLabel}>Total Term</Text>
          </View>

          <View style={styles.statItem}>
            <View style={styles.statIcon}>
              <TrendingDown size={16} color={colors.expense} />
            </View>
            <Text style={styles.statValue}>
              {formatCurrency(calculation.totalInterest)}
            </Text>
            <Text style={styles.statLabel}>Total Interest</Text>
          </View>
        </View>

        {/* Extra Payment Indicator */}
        {(loan.extraMonthly && loan.extraMonthly > 0) && (
          <View style={styles.extraPaymentBadge}>
            <Zap size={14} color={colors.income} />
            <Text style={styles.extraPaymentText}>
              +{formatCurrency(loan.extraMonthly)}/month extra
            </Text>
          </View>
        )}

        {/* Next Payment Breakdown */}
        <View style={styles.paymentBreakdown}>
          <Text style={styles.breakdownTitle}>Next Payment Breakdown</Text>
          <View style={styles.breakdownRow}>
            <View style={styles.breakdownItem}>
              <View style={[styles.breakdownDot, { backgroundColor: colors.accent }]} />
              <Text style={styles.breakdownLabel}>Principal</Text>
              <Text style={styles.breakdownValue}>{formatCurrency(monthlyPrincipal)}</Text>
            </View>
            <View style={styles.breakdownItem}>
              <View style={[styles.breakdownDot, { backgroundColor: colors.expense }]} />
              <Text style={styles.breakdownLabel}>Interest</Text>
              <Text style={styles.breakdownValue}>{formatCurrency(monthlyInterest)}</Text>
            </View>
          </View>
        </View>
      </LinearGradient>
    </AnimatedCard>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 6,
  },
  gradient: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  loanInfo: {
    flex: 1,
    marginRight: 16,
  },
  loanName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  loanType: {
    fontSize: 14,
    color: colors.text,
    opacity: 0.7,
  },
  balanceContainer: {
    alignItems: 'flex-end',
  },
  remainingBalance: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.accent,
    marginBottom: 2,
  },
  balanceLabel: {
    fontSize: 12,
    color: colors.text,
    opacity: 0.6,
  },
  progressSection: {
    marginBottom: 20,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  progressPercentage: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.accent,
  },
  progressTrack: {
    height: 8,
    backgroundColor: colors.background,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressText: {
    fontSize: 12,
    color: colors.text,
    opacity: 0.6,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingVertical: 12,
    paddingHorizontal: 8,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11,
    color: colors.text,
    opacity: 0.6,
    textAlign: 'center',
  },
  extraPaymentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: colors.income + '20',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 16,
  },
  extraPaymentText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.income,
    marginLeft: 6,
  },
  paymentBreakdown: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 16,
  },
  breakdownTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  breakdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  breakdownDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  breakdownLabel: {
    fontSize: 12,
    color: colors.text,
    opacity: 0.7,
    flex: 1,
  },
  breakdownValue: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
  },
});
