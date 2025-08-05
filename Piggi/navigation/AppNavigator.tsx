import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import DashboardScreen from '../screens/DashboardScreen';
import TransactionsScreen from '../screens/TransactionsScreen';
import { BudgetScreen } from '../screens/BudgetScreen';
import { NavigationContainer } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors } from '../theme/colors';
import { Banknote } from 'lucide-react-native';
import LoansStack from './LoansStack';

const Tab = createBottomTabNavigator();

const getTabBarIcon = (routeName: string, color: string, size: number) => {
  switch (routeName) {
    case 'Dashboard':
      return <Ionicons name="pie-chart-outline" size={size} color={color} />;
    case 'Transactions':
      return <Ionicons name="list-outline" size={size} color={color} />;
    case 'Budget':
      return <Ionicons name="wallet-outline" size={size} color={color} />;
    case 'Loans':
      return <Banknote color={color} size={size} />;
    default:
      return <Ionicons name="home-outline" size={size} color={color} />;
  }
};

export const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: colors.accent,
          tabBarStyle: { backgroundColor: colors.background },
          tabBarIcon: ({ color, size }) => getTabBarIcon(route.name, color, size),
        })}
      >
        <Tab.Screen name="Dashboard" component={DashboardScreen} />
        <Tab.Screen name="Transactions" component={TransactionsScreen} />
        <Tab.Screen name="Budget" component={BudgetScreen} />
        <Tab.Screen name="Loans" component={LoansStack} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};
