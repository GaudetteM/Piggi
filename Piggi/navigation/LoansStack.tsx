import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LoansScreen } from '../screens/LoansScreen';
import { LoanDetailScreen } from '../screens/LoanDetailsScreen';
import { colors } from '../theme/colors';
import { ArrowLeft } from 'lucide-react-native';
import { TouchableOpacity, StyleSheet } from 'react-native';

export type LoansStackParamList = {
  Loans: undefined;
  LoanDetail: { loanId: string };
};

const Stack = createNativeStackNavigator<LoansStackParamList>();

const styles = StyleSheet.create({
  backButton: {
    padding: 8,
  },
});

const BackButton = ({ onPress }: { onPress: () => void }) => (
  <TouchableOpacity onPress={onPress} style={styles.backButton}>
    <ArrowLeft size={24} color={colors.text} />
  </TouchableOpacity>
);

const HeaderBackButton = (props: any) => <BackButton onPress={props.onPress} />;

const createHeaderLeft = (navigation: any) => {
  if (!navigation.canGoBack()) return undefined;
  return () => <HeaderBackButton onPress={() => navigation.goBack()} />;
};

export default function LoansStack() {
  return (
    <Stack.Navigator
      screenOptions={({ navigation }) => ({
        navigationBarColor: colors.background,
        headerTintColor: colors.text,
        headerStyle: { backgroundColor: colors.background },
        headerTitleStyle: { color: colors.accent },
        headerTitleAlign: 'center',
        headerShown: true,
        headerBackButtonDisplayMode: 'minimal',
        headerLeft: createHeaderLeft(navigation),
      })}
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
