// App.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Mock API data (simulating JSONServer response)
const mockTransactions = [
  { id: 1, amount: 1500, category: 'Salary', date: '2025-03-01', type: 'income' },
  { id: 2, amount: -200, category: 'Groceries', date: '2025-03-02', type: 'expense' },
  { id: 3, amount: -50, category: 'Transport', date: '2025-03-03', type: 'expense' },
  { id: 4, amount: 2000, category: 'Freelance', date: '2025-03-05', type: 'income' },
  { id: 5, amount: -300, category: 'Rent', date: '2025-03-06', type: 'expense' },
  { id: 6, amount: -75, category: 'Entertainment', date: '2025-03-07', type: 'expense' },
];

const Stack = createStackNavigator();

// Dashboard Screen Component
const DashboardScreen = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, []);

  // Simulate API call
  const fetchTransactions = async () => {
    try {
      setLoading(true);
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setTransactions(mockTransactions);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate totals using reduce
  const totals = transactions.reduce(
    (acc, transaction) => {
      if (transaction.type === 'income') {
        acc.income += transaction.amount;
      } else {
        acc.expenses += Math.abs(transaction.amount); // Convert negative to positive
      }
      acc.balance = acc.income - acc.expenses;
      return acc;
    },
    { income: 0, expenses: 0, balance: 0 }
  );

  const renderTransaction = ({ item }) => (
    <View style={styles.transactionCard}>
      <View style={styles.transactionIcon}>
        <Icon
          name={item.type === 'income' ? 'arrow-upward' : 'arrow-downward'}
          size={20}
          color={item.type === 'income' ? '#4CAF50' : '#FF5252'}
        />
      </View>
      <View style={styles.transactionDetails}>
        <Text style={styles.transactionCategory}>{item.category}</Text>
        <Text style={styles.transactionDate}>{item.date}</Text>
      </View>
      <Text
        style={[
          styles.transactionAmount,
          { color: item.type === 'income' ? '#4CAF50' : '#FF5252' },
        ]}
      >
        {item.type === 'income' ? '+' : '-'}${Math.abs(item.amount).toFixed(2)}
      </Text>
    </View>
  );

  if (loading) {
    return (
      <LinearGradient colors={['#1a1a2e', '#16213e']} style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#fff" />
        <Text style={styles.loadingText}>Loading Transactions...</Text>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#1a1a2e', '#16213e']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Summary Section */}
        <View style={styles.summaryContainer}>
          <Text style={styles.summaryTitle}>Financial Overview</Text>
          <View style={styles.summaryCards}>
            <View style={styles.summaryCard}>
              <Icon name="trending-up" size={24} color="#4CAF50" />
              <Text style={styles.summaryLabel}>Income</Text>
              <Text style={styles.summaryAmount}>${totals.income.toFixed(2)}</Text>
            </View>
            <View style={styles.summaryCard}>
              <Icon name="trending-down" size={24} color="#FF5252" />
              <Text style={styles.summaryLabel}>Expenses</Text>
              <Text style={styles.summaryAmount}>${totals.expenses.toFixed(2)}</Text>
            </View>
            <View style={styles.summaryCard}>
              <Icon name="account-balance" size={24} color="#FFD700" />
              <Text style={styles.summaryLabel}>Balance</Text>
              <Text style={styles.summaryAmount}>${totals.balance.toFixed(2)}</Text>
            </View>
          </View>
        </View>

        {/* Transactions List */}
        <View style={styles.transactionsContainer}>
          <Text style={styles.transactionsTitle}>Recent Transactions</Text>
          <FlatList
            data={transactions}
            renderItem={renderTransaction}
            keyExtractor={item => item.id.toString()}
            contentContainerStyle={styles.transactionList}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No transactions found</Text>
            }
          />
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

// Main App Component
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Dashboard"
        screenOptions={{
          headerStyle: { backgroundColor: '#1a1a2e' },
          headerTintColor: '#fff',
        }}
      >
        <Stack.Screen
          name="Dashboard"
          component={DashboardScreen}
          options={{ title: 'Expense Tracker' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    marginTop: 10,
    fontSize: 16,
  },
  summaryContainer: {
    padding: 20,
  },
  summaryTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  summaryCards: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryCard: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    width: '30%',
  },
  summaryLabel: {
    color: '#ddd',
    fontSize: 14,
    marginTop: 5,
  },
  summaryAmount: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 5,
  },
  transactionsContainer: {
    paddingHorizontal: 20,
  },
  transactionsTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  transactionList: {
    paddingBottom: 20,
  },
  transactionCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    alignItems: 'center',
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionCategory: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  transactionDate: {
    color: '#ddd',
    fontSize: 12,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyText: {
    color: '#ddd',
    textAlign: 'center',
    fontSize: 16,
    padding: 20,
  },
});