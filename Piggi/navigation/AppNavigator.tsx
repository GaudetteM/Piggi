import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import DashboardScreen from '../screens/DashboardScreen';
import TransactionsScreen from '../screens/TransactionsScreen';
import { LoansScreen } from '../screens/LoansScreen';
import { NavigationContainer } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors } from '../theme/colors';
import { Banknote } from 'lucide-react-native';

const Tab = createBottomTabNavigator();

export const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: colors.accent,
          tabBarStyle: { backgroundColor: colors.background },
          tabBarIcon: ({ color, size }) => {
            let iconName = 'home-outline';
            if (route.name === 'Dashboard') iconName = 'pie-chart-outline';
            if (route.name === 'Transactions') iconName = 'list-outline';
            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen name="Dashboard" component={DashboardScreen} />
        <Tab.Screen name="Transactions" component={TransactionsScreen} />
        <Tab.Screen
          name="Loans"
          component={LoansScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Banknote color={color} size={size} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};
