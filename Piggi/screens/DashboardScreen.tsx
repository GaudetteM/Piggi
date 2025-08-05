import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableWithoutFeedback, TouchableOpacity } from 'react-native';
import { PolarChart, Pie } from 'victory-native';
import { colors } from '../theme/colors';
import { useTransactionsStore } from '../store/useTransactionsStore';
import { useLoansStore } from '../store/useLoansStore';
import { StatCard } from '../components/StatCard';
import { SpendingInsights } from '../components/SpendingInsights';
import { QuickActionMenu } from '../components/QuickActionMenu';
import { DollarSign, TrendingUp, TrendingDown, CreditCard, PieChart, BarChart3 } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

export default function DashboardScreen() {
  const navigation = useNavigation();
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [chartView, setChartView] = useState<'pie' | 'line'>('pie');
  const transactions = useTransactionsStore(s => s.transactions);
  const loans = useLoansStore(s => s.loans);

  const incomeTotal = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const expenseTotal = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = incomeTotal - expenseTotal;
  const totalLoans = loans.reduce((sum, loan) => sum + loan.principal, 0);

  const pieData = [
    { label: 'Income', value: incomeTotal, color: colors.incomeGraph },
    { label: 'Expense', value: expenseTotal, color: colors.expenseGraph },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <TouchableWithoutFeedback
          onLongPress={() => setShowQuickActions(true)}
          delayLongPress={500}
        >
          <View style={styles.headerSection}>
            <Text style={styles.greeting}>Good Morning</Text>
            <Text style={styles.subtitle}>Here's your financial overview</Text>
          </View>
        </TouchableWithoutFeedback>

        {/* Main Balance Overview */}
        <View style={styles.balanceOverview}>
          <Text style={styles.balanceLabel}>Current Balance</Text>
          <Text style={[styles.balanceAmount, { 
            color: balance >= 0 ? colors.income : colors.expense 
          }]}>
            ${Math.abs(balance).toFixed(2)}
          </Text>
          <Text style={styles.balanceSubtext}>
            {balance >= 0 ? 'Available' : 'Overdrawn'}
          </Text>
        </View>

        {/* Stats Cards Grid - Simplified */}
        <View style={styles.statsGrid}>
          <StatCard
            title="Monthly Income"
            amount={incomeTotal}
            subtitle="This month"
            gradientColors={[colors.income, colors.income + '80']}
            icon={<TrendingUp size={20} color="white" />}
            onPress={() => navigation.navigate('Transactions' as never)}
          />
          
          <StatCard
            title="Monthly Expenses"
            amount={expenseTotal}
            subtitle="This month"
            gradientColors={[colors.expense, colors.expense + '80']}
            icon={<TrendingDown size={20} color="white" />}
            onPress={() => navigation.navigate('Transactions' as never)}
          />
          
          <StatCard
            title="Active Loans"
            amount={totalLoans}
            subtitle={`${loans.length} loan${loans.length !== 1 ? 's' : ''}`}
            gradientColors={[colors.accent, colors.accent + '80']}
            icon={<CreditCard size={20} color="white" />}
            onPress={() => navigation.navigate('Loans' as never)}
          />
          
          <StatCard
            title="Net Worth"
            amount={balance - totalLoans}
            subtitle="After loans"
            backgroundColor={colors.card}
            icon={<DollarSign size={20} color={colors.accent} />}
          />
        </View>

        {/* Spending Insights */}
        <SpendingInsights transactions={transactions} />

        {/* Interactive Chart Section */}
        {(incomeTotal > 0 || expenseTotal > 0) && (
          <View style={styles.chartSection}>
            <View style={styles.chartHeader}>
              <Text style={styles.sectionTitle}>Financial Overview</Text>
              <View style={styles.chartToggle}>
                <TouchableOpacity
                  style={[styles.toggleButton, chartView === 'pie' && styles.toggleButtonActive]}
                  onPress={() => setChartView('pie')}
                >
                  <PieChart size={18} color={chartView === 'pie' ? 'white' : colors.text} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.toggleButton, chartView === 'line' && styles.toggleButtonActive]}
                  onPress={() => setChartView('line')}
                >
                  <BarChart3 size={18} color={chartView === 'line' ? 'white' : colors.text} />
                </TouchableOpacity>
              </View>
            </View>
            
            <View style={styles.chartContainer}>
              {chartView === 'pie' ? (
                <PolarChart
                  data={pieData}
                  labelKey="label"
                  valueKey="value"
                  colorKey="color"
                >
                  <Pie.Chart />
                </PolarChart>
              ) : (
                <View style={styles.placeholderContainer}>
                  <Text style={styles.placeholderTitle}>
                    Balance Trend Chart
                  </Text>
                  <Text style={styles.placeholderSubtext}>
                    Coming Soon...
                  </Text>
                </View>
              )}
            </View>

            {chartView === 'pie' ? (
              <View style={styles.legend}>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: colors.income }]} />
                  <Text style={styles.legendText}>
                    Income: ${incomeTotal.toFixed(2)}
                  </Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: colors.expense }]} />
                  <Text style={styles.legendText}>
                    Expenses: ${expenseTotal.toFixed(2)}
                  </Text>
                </View>
              </View>
            ) : (
              <View style={styles.legend}>
                <Text style={styles.legendText}>Balance Over Time</Text>
                <Text style={styles.legendSubtext}>
                  Current: ${balance.toFixed(2)}
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Recent Activity Preview */}
        <View style={styles.recentSection}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          {transactions.slice(0, 3).map((transaction) => (
            <View key={transaction.id} style={styles.recentItem}>
              <Text style={styles.recentTitle}>{transaction.title}</Text>
              <Text style={[
                styles.recentAmount,
                { color: transaction.type === 'income' ? colors.income : colors.expense }
              ]}>
                {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>

      <QuickActionMenu
        visible={showQuickActions}
        onClose={() => setShowQuickActions(false)}
        onAddTransaction={() => {
          // Add navigation to transaction screen or modal
          console.log('Navigate to add transaction');
        }}
        onAddLoan={() => {
          // Add navigation to loan screen or modal
          console.log('Navigate to add loan');
        }}
        onCreateBudget={() => {
          // Add navigation to budget creation
          console.log('Navigate to create budget');
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  headerSection: {
    paddingHorizontal: 20,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 10,
  },
  subtitle: {
    fontSize: 16,
    color: colors.text,
    opacity: 0.7,
    marginBottom: 20,
  },
  balanceOverview: {
    backgroundColor: colors.card,
    marginHorizontal: 20,
    marginBottom: 24,
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  balanceLabel: {
    fontSize: 16,
    color: colors.text,
    opacity: 0.8,
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  balanceSubtext: {
    fontSize: 14,
    opacity: 0.7,
    color: colors.text,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 24,
    gap: 4,
  },
  chartSection: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  chartToggle: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: 4,
  },
  toggleButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    marginHorizontal: 2,
  },
  toggleButtonActive: {
    backgroundColor: colors.accent,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
  },
  chartContainer: {
    height: 250,
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
  legendSubtext: {
    fontSize: 12,
    color: colors.text,
    opacity: 0.7,
  },
  recentSection: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  recentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  recentTitle: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
  },
  recentAmount: {
    fontSize: 16,
    fontWeight: '600',
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderTitle: {
    color: colors.text,
    fontSize: 16,
  },
  placeholderSubtext: {
    color: colors.text,
    opacity: 0.7,
    marginTop: 8,
  },
});
