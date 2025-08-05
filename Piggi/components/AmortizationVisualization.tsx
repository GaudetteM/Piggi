import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { colors } from '../theme/colors';
import { formatCurrency, formatTime, compareLoanScenarios } from '../utils/loanHelpers';
import { Calculator, Zap, BarChart3 } from 'lucide-react-native';

type LoanCalculation = {
  monthlyPayment: number;
  totalPaid: number;
  totalInterest: number;
  term: number;
  amortization: Array<{
    month: number;
    payment: number;
    principal: number;
    interest: number;
    balance: number;
    totalInterest: number;
  }>;
  payoffDate: Date;
};

type Props = {
  loanCalculation: LoanCalculation;
  principal: number;
  interestRate: number;
  monthlyPayment: number;
  extraMonthly?: number;
};

export const AmortizationVisualization = ({ 
  loanCalculation, 
  principal, 
  interestRate, 
  monthlyPayment,
  extraMonthly = 0
}: Props) => {
  const [selectedTab, setSelectedTab] = useState<'chart' | 'table' | 'scenarios'>('scenarios');

  // Compare scenarios with different extra payments
  const scenarios = extraMonthly > 0 ? 
    compareLoanScenarios(principal, interestRate, monthlyPayment, [0, extraMonthly]) :
    compareLoanScenarios(principal, interestRate, monthlyPayment, [0, 100, 200, 500]);

  const renderChart = () => (
    <View style={styles.chartContainer}>
      <Text style={styles.chartTitle}>Loan Balance Visualization</Text>
      <Text style={styles.comingSoon}>
        📊 Interactive chart coming soon!
      </Text>
      <View style={styles.chartPlaceholder}>
        <View style={styles.chartStats}>
          <View style={styles.chartStat}>
            <Text style={styles.chartStatValue}>{formatCurrency(principal)}</Text>
            <Text style={styles.chartStatLabel}>Starting Balance</Text>
          </View>
          <View style={styles.chartStat}>
            <Text style={styles.chartStatValue}>{formatTime(loanCalculation.term)}</Text>
            <Text style={styles.chartStatLabel}>Total Term</Text>
          </View>
          <View style={styles.chartStat}>
            <Text style={styles.chartStatValue}>{formatCurrency(loanCalculation.totalInterest)}</Text>
            <Text style={styles.chartStatLabel}>Total Interest</Text>
          </View>
        </View>
      </View>
    </View>
  );

  const renderScenarios = () => (
    <View style={styles.scenariosContainer}>
      <Text style={styles.sectionTitle}>Extra Payment Impact</Text>
      {scenarios.map((scenario, index) => {
        const extraAmount = index === 0 ? 0 : (extraMonthly > 0 ? extraMonthly : [100, 200, 500][index - 1]);
        const savings = scenarios[0].totalInterest - scenario.totalInterest;
        const timeSaved = scenarios[0].term - scenario.term;
        
        return (
          <View key={index} style={styles.scenarioCard}>
            <View style={styles.scenarioHeader}>
              <View style={styles.scenarioInfo}>
                <Text style={styles.scenarioTitle}>
                  {extraAmount === 0 ? 'Current Plan' : `+${formatCurrency(extraAmount)}/month`}
                </Text>
                {extraAmount > 0 && (
                  <View style={styles.scenarioBadge}>
                    <Zap size={12} color={colors.income} />
                    <Text style={styles.scenarioBadgeText}>Extra Payment</Text>
                  </View>
                )}
              </View>
              <Text style={styles.scenarioTerm}>{formatTime(scenario.term)}</Text>
            </View>

            <View style={styles.scenarioStats}>
              <View style={styles.scenarioStat}>
                <Text style={styles.scenarioStatLabel}>Total Interest</Text>
                <Text style={styles.scenarioStatValue}>{formatCurrency(scenario.totalInterest)}</Text>
              </View>
              
              {extraAmount > 0 && (
                <>
                  <View style={styles.scenarioStat}>
                    <Text style={styles.scenarioStatLabel}>Interest Saved</Text>
                    <Text style={[styles.scenarioStatValue, { color: colors.income }]}>
                      {formatCurrency(savings)}
                    </Text>
                  </View>
                  
                  <View style={styles.scenarioStat}>
                    <Text style={styles.scenarioStatLabel}>Time Saved</Text>
                    <Text style={[styles.scenarioStatValue, { color: colors.income }]}>
                      {formatTime(timeSaved)}
                    </Text>
                  </View>
                </>
              )}
            </View>

            <View style={styles.progressContainer}>
              <View style={styles.progressTrack}>
                <View 
                  style={[
                    styles.progressFill, 
                    { 
                      width: `${Math.max(5, (scenarios[0].term - scenario.term) / scenarios[0].term * 100)}%`,
                      backgroundColor: extraAmount === 0 ? colors.accent : colors.income
                    }
                  ]} 
                />
              </View>
            </View>
          </View>
        );
      })}
    </View>
  );

  const renderTable = () => {
    const yearsToShow = Math.min(5, Math.ceil(loanCalculation.term / 12));
    const yearlyData = [];
    
    for (let year = 1; year <= yearsToShow; year++) {
      const monthIndex = Math.min(year * 12 - 1, loanCalculation.amortization.length - 1);
      const entry = loanCalculation.amortization[monthIndex];
      if (entry) {
        yearlyData.push({
          year,
          ...entry,
        });
      }
    }

    return (
      <View style={styles.tableContainer}>
        <Text style={styles.sectionTitle}>Amortization Schedule (Yearly)</Text>
        <View style={styles.tableHeader}>
          <Text style={styles.tableHeaderYear}>Year</Text>
          <Text style={styles.tableHeaderMoney}>Payment</Text>
          <Text style={styles.tableHeaderMoney}>Principal</Text>
          <Text style={styles.tableHeaderMoney}>Interest</Text>
          <Text style={styles.tableHeaderMoney}>Balance</Text>
        </View>
        
        <ScrollView style={styles.tableBody} showsVerticalScrollIndicator={false}>
          {yearlyData.map((row) => (
            <View key={row.year} style={styles.tableRow}>
              <Text style={styles.tableCellYear}>{row.year}</Text>
              <Text style={styles.tableCellMoney}>
                {formatCurrency(row.payment * 12)}
              </Text>
              <Text style={styles.tableCellMoney}>
                {formatCurrency(row.principal * 12)}
              </Text>
              <Text style={styles.tableCellMoney}>
                {formatCurrency(row.interest * 12)}
              </Text>
              <Text style={styles.tableCellMoney}>
                {formatCurrency(row.balance)}
              </Text>
            </View>
          ))}
        </ScrollView>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Tab Selector */}
      <View style={styles.tabContainer}>
        {[
          { key: 'chart', label: 'Overview', icon: BarChart3 },
          { key: 'scenarios', label: 'Impact', icon: Zap },
          { key: 'table', label: 'Schedule', icon: Calculator },
        ].map(({ key, label, icon: Icon }) => (
          <TouchableOpacity
            key={key}
            style={[
              styles.tab,
              selectedTab === key && styles.activeTab
            ]}
            onPress={() => setSelectedTab(key as any)}
          >
            <Icon 
              size={16} 
              color={selectedTab === key ? colors.accent : colors.text + '80'} 
            />
            <Text style={[
              styles.tabText,
              selectedTab === key && styles.activeTabText
            ]}>
              {label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Content */}
      {selectedTab === 'chart' && renderChart()}
      {selectedTab === 'scenarios' && renderScenarios()}
      {selectedTab === 'table' && renderTable()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: 16,
    margin: 20,
    overflow: 'hidden',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  activeTab: {
    backgroundColor: colors.accent + '20',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text + '80',
  },
  activeTabText: {
    color: colors.accent,
    fontWeight: '600',
  },
  chartContainer: {
    padding: 20,
    alignItems: 'center',
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  comingSoon: {
    fontSize: 14,
    color: colors.text,
    opacity: 0.6,
    marginBottom: 20,
    textAlign: 'center',
  },
  chartPlaceholder: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 20,
  },
  chartStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  chartStat: {
    alignItems: 'center',
  },
  chartStatValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.accent,
    marginBottom: 4,
  },
  chartStatLabel: {
    fontSize: 12,
    color: colors.text,
    opacity: 0.7,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  scenariosContainer: {
    padding: 20,
  },
  scenarioCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  scenarioHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  scenarioInfo: {
    flex: 1,
  },
  scenarioTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  scenarioBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: colors.income + '20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  scenarioBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.income,
  },
  scenarioTerm: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.accent,
  },
  scenarioStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  scenarioStat: {
    flex: 1,
    alignItems: 'center',
  },
  scenarioStatLabel: {
    fontSize: 11,
    color: colors.text,
    opacity: 0.6,
    marginBottom: 4,
  },
  scenarioStatValue: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
  },
  progressContainer: {
    marginTop: 8,
  },
  progressTrack: {
    height: 4,
    backgroundColor: colors.background,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  tableContainer: {
    padding: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
    marginBottom: 8,
  },
  tableHeaderYear: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
  },
  tableHeaderMoney: {
    flex: 2,
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
  },
  tableBody: {
    maxHeight: 300,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  tableCellYear: {
    flex: 1,
    fontSize: 11,
    color: colors.text,
    textAlign: 'center',
  },
  tableCellMoney: {
    flex: 2,
    fontSize: 11,
    color: colors.text,
    textAlign: 'center',
  },
});
