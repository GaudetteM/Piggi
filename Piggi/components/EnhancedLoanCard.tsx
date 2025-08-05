import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Loan } from '../store/useLoansStore';
import { colors } from '../theme/colors';
import { calculateLoan } from '../utils/loanHelpers';
import { Calendar, Percent, TrendingDown } from 'lucide-react-native';
import { AnimatedCard } from './AnimatedCard';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

type Props = {
  loan: Loan;
  onPress: () => void;
};

export const EnhancedLoanCard = ({ loan, onPress }: Props) => {
  const progressWidth = useSharedValue(0);
  
  const { totalInterest, term } = calculateLoan(
    loan.principal,
    loan.interestRate,
    loan.monthlyPayment,
    loan.extraMonthly,
    loan.lumpSum,
  );

  // Calculate progress (simplified - based on time elapsed)
  const startDate = new Date(loan.startDate);
  const now = new Date();
  const monthsElapsed = Math.max(0, 
    (now.getFullYear() - startDate.getFullYear()) * 12 + 
    (now.getMonth() - startDate.getMonth())
  );
  
  const progress = Math.min(100, (monthsElapsed / Math.max(term, 1)) * 100);
  
  React.useEffect(() => {
    progressWidth.value = withTiming(progress, { duration: 1500 });
  }, [progress, progressWidth]);

  const progressStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value}%`,
  }));

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric',
    });
  };

  const remainingMonths = Math.max(0, Math.ceil(term - monthsElapsed));

  return (
    <AnimatedCard onPress={onPress} style={styles.card}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.loanName} numberOfLines={1}>
            {loan.name}
          </Text>
          <Text style={styles.startDate}>
            Started {formatDate(loan.startDate)}
          </Text>
        </View>
        <View style={styles.principalContainer}>
          <Text style={styles.principalAmount}>
            ${loan.principal.toLocaleString()}
          </Text>
          <Text style={styles.principalLabel}>Principal</Text>
        </View>
      </View>

      <View style={styles.progressSection}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressLabel}>Loan Progress</Text>
          <Text style={styles.progressPercentage}>
            {progress.toFixed(1)}%
          </Text>
        </View>
        <View style={styles.progressTrack}>
          <Animated.View style={[styles.progressFill, progressStyle]} />
        </View>
        <Text style={styles.remainingText}>
          {remainingMonths} months remaining
        </Text>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <View style={styles.statIcon}>
            <Percent size={14} color={colors.expense} />
          </View>
          <Text style={styles.statValue}>{loan.interestRate}%</Text>
          <Text style={styles.statLabel}>APR</Text>
        </View>

        <View style={styles.statItem}>
          <View style={styles.statIcon}>
            <Calendar size={14} color={colors.income} />
          </View>
          <Text style={styles.statValue}>
            ${loan.monthlyPayment.toFixed(0)}
          </Text>
          <Text style={styles.statLabel}>Monthly</Text>
        </View>

        <View style={styles.statItem}>
          <View style={styles.statIcon}>
            <TrendingDown size={14} color={colors.accent} />
          </View>
          <Text style={styles.statValue}>
            ${totalInterest.toFixed(0)}
          </Text>
          <Text style={styles.statLabel}>Interest</Text>
        </View>
      </View>
    </AnimatedCard>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  titleContainer: {
    flex: 1,
    marginRight: 16,
  },
  loanName: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  startDate: {
    fontSize: 13,
    color: colors.text,
    opacity: 0.6,
  },
  principalContainer: {
    alignItems: 'flex-end',
  },
  principalAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.accent,
    marginBottom: 2,
  },
  principalLabel: {
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
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  progressPercentage: {
    fontSize: 14,
    fontWeight: '600',
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
    backgroundColor: colors.accent,
    borderRadius: 4,
  },
  remainingText: {
    fontSize: 12,
    color: colors.text,
    opacity: 0.7,
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11,
    color: colors.text,
    opacity: 0.6,
  },
});
