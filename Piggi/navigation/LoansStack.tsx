import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LoansScreen } from '../screens/LoansScreen';
import { LoanDetailScreen } from '../screens/LoanDetailsScreen';
import { colors } from '../theme/colors';

export type LoansStackParamList = {
  Loans: undefined;
  LoanDetail: { loanId: string };
};

const Stack = createNativeStackNavigator<LoansStackParamList>();

export default function LoansStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        navigationBarColor: colors.background,
        headerTintColor: colors.text,
        headerStyle: { backgroundColor: colors.background },
        headerTitleStyle: { color: colors.accent },
        headerTitleAlign: 'center',
        headerShown: true,
      }}
    >
      <Stack.Screen
        name="Loans"
        component={LoansScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="LoanDetail"
        component={LoanDetailScreen}
        options={{ title: 'Loan Details' }}
      />
    </Stack.Navigator>
  );
}
