import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { colors } from '../theme/colors';
import { calculateLoan } from '../utils/loanHelpers';
import { useLoansStore } from '../store/useLoansStore';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Calendar, DollarSign, Percent, CreditCard, Plus, Zap } from 'lucide-react-native';
import { StatCard } from '../components/StatCard';

type LoanDetailParams = {
  LoanDetail: { loanId: string };
};

type Props = RouteProp<LoanDetailParams, 'LoanDetail'>;

export const LoanDetailScreen = () => {
  const route = useRoute<Props>();
  const navigation = useNavigation();
  const { loanId } = route.params;

  // Load from Zustand store
  const loan = useLoansStore(s => s.loans.find(l => l.id === loanId));

  if (!loan) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <Text style={styles.error}>Loan not found.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const { monthlyPayment, totalPaid, totalInterest, term } = calculateLoan(
    loan.principal,
    loan.interestRate,
    loan.monthlyPayment,
    loan.extraMonthly,
    loan.lumpSum,
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Loan Details</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Loan Name */}
        <View style={styles.titleSection}>
          <Text style={styles.loanName}>{loan.name}</Text>
          <Text style={styles.startDate}>Started {formatDate(loan.startDate)}</Text>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <StatCard
            title="Principal"
            amount={loan.principal}
            icon={<DollarSign size={20} color={colors.accent} />}
            backgroundColor={colors.accent + '15'}
          />
          
          <StatCard
            title="Interest Rate"
            amount={loan.interestRate}
            subtitle="% APR"
            icon={<Percent size={20} color={colors.expense} />}
            backgroundColor={colors.expense + '15'}
          />
          
          <StatCard
            title="Monthly Payment"
            amount={loan.monthlyPayment}
            icon={<Calendar size={20} color={colors.income} />}
            backgroundColor={colors.income + '15'}
          />
          
          <StatCard
            title="Total Interest"
            amount={totalInterest}
            subtitle="Lifetime cost"
            icon={<CreditCard size={20} color={colors.expense} />}
            backgroundColor={colors.expense + '15'}
          />
        </View>

        {/* Additional Payments */}
        {(loan.extraMonthly || loan.lumpSum) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Additional Payments</Text>
            
            {loan.extraMonthly && (
              <View style={styles.infoRow}>
                <View style={styles.infoIcon}>
                  <Plus size={16} color={colors.income} />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Extra Monthly</Text>
                  <Text style={styles.infoValue}>${loan.extraMonthly.toFixed(2)}</Text>
                </View>
              </View>
            )}

            {loan.lumpSum && (
              <View style={styles.infoRow}>
                <View style={styles.infoIcon}>
                  <Zap size={16} color={colors.accent} />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Lump Sum</Text>
                  <Text style={styles.infoValue}>${loan.lumpSum.toFixed(2)}</Text>
                </View>
              </View>
            )}
          </View>
        )}

        {/* Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Loan Summary</Text>
          
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total Amount Paid</Text>
              <Text style={[styles.summaryValue, { color: colors.text }]}>
                ${totalPaid.toFixed(2)}
              </Text>
            </View>
            
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total Interest Paid</Text>
              <Text style={[styles.summaryValue, { color: colors.expense }]}>
                ${totalInterest.toFixed(2)}
              </Text>
            </View>
            
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Time to Pay Off</Text>
              <Text style={[styles.summaryValue, { color: colors.accent }]}>
                {term ? `${Math.ceil(term)} months` : 'Calculating...'}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  placeholder: {
    width: 40,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  titleSection: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    alignItems: 'center',
  },
  loanName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  startDate: {
    fontSize: 16,
    color: colors.text,
    opacity: 0.7,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    marginBottom: 24,
  },
  section: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  infoIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: colors.text,
    opacity: 0.8,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  summaryCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  summaryLabel: {
    fontSize: 16,
    color: colors.text,
    opacity: 0.8,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: '600',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  error: {
    fontSize: 16,
    color: colors.expense,
  },
});
