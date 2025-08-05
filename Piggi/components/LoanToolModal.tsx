import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import TrackLoanForm from './TrackLoanForm';
import LoanCalculatorForm from './LoanCalculatorForm';
import { PlusCircle, Calculator } from 'lucide-react-native';

type Props = {
  visible: boolean;
  onClose: () => void;
};

export const LoanToolModal = ({ visible, onClose }: Props) => {
  const [activeTab, setActiveTab] = useState<'track' | 'calculator'>('track');

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Tab Switcher */}
          <View style={styles.tabRow}>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'track' && styles.tabActive]}
              onPress={() => setActiveTab('track')}
            >
              <View style={styles.tabContent}>
                <PlusCircle size={16} color="#fff" />
                <Text style={styles.tabText}>Track Loan</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.tab,
                activeTab === 'calculator' && styles.tabActive,
              ]}
              onPress={() => setActiveTab('calculator')}
            >
              <View style={styles.tabContent}>
                <Calculator size={16} color="#fff" />
                <Text style={styles.tabText}>Calculator</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Tab Content */}
          <View style={styles.tabContentContainer}>
            {activeTab === 'track' ? (
              <TrackLoanForm onClose={onClose} />
            ) : (
              <LoanCalculatorForm />
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  container: {
    backgroundColor: colors.card,
    borderRadius: 12,
    paddingTop: 12,
    paddingHorizontal: 20,
    paddingBottom: 24,
    height: '90%',
  },
  tabRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: '#222',
    borderRadius: 6,
    marginHorizontal: 4,
  },
  tabActive: {
    backgroundColor: colors.accent,
  },
  tabContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  tabText: {
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center',
  },
  tabContentContainer: {
    flex: 1,
  },
});
