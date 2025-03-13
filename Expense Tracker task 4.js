// App.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Mock API data with additional fields
const mockTransactions = [
  { id: 1, amount: 1500, category: 'Salary', date: '2025-03-01', type: 'income', description: 'Monthly salary', account: 'Bank' },
  { id: 2, amount: -200, category: 'Groceries', date: '2025-03-02', type: 'expense', description: 'Weekly shopping', account: 'Cash' },
  { id: 3, amount: -50, category: 'Transport', date: '2025-03-03', type: 'expense', description: 'Bus fare', account: 'Card' },
  { id: 4, amount: 2000, category: 'Freelance', date: '2025-03-05', type: 'income', description: 'Project payment', account: 'PayPal' },
  { id: 5, amount: -300, category: 'Rent', date: '2025-03-06', type: 'expense', description: 'Apartment rent', account: 'Bank' },
  { id: 6, amount: -75, category: 'Entertainment', date: '2025-03-07', type: 'expense', description: 'Movie night', account: 'Card' },
];

const Stack = createStackNavigator();

// Dashboard Screen Component
const DashboardScreen = ({ navigation }) => {
  const [transactions, setTransactions] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, []);

  useEffect(() => {
    const filtered = transactions.filter(t =>
      t.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredTransactions(filtered);
  }, [searchQuery, transactions]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
      setTransactions(mockTransactions);
      setFilteredTransactions(mockTransactions);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch transactions');
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const totals = transactions.reduce(
    (acc, transaction) => {
      if (transaction.type === 'income') {
        acc.income += transaction.amount;
      } else {
        acc.expenses += Math.abs(transaction.amount);
      }
      acc.balance = acc.income - acc.expenses;
      return acc;
    },
    { income: 0, expenses: 0, balance: 0 }
  );

  const renderTransaction = ({ item }) => (
    <TouchableOpacity
      style={styles.transactionCard}
      onPress={() => navigation.navigate('Details', { transaction: item })}
    >
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
    </TouchableOpacity>
  );

  const renderHeader = () => (
    <>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Expense Tracker</Text>
        <TouchableOpacity onPress={fetchTransactions}>
          <Icon name="refresh" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Summary Section */}
      <View style={styles.summaryContainer}>
        <LinearGradient colors={['#2c2c54', '#474787']} style={styles.summaryGradient}>
          <Text style={styles.summaryTitle}>Financial Overview</Text>
          <View style={styles.summaryCards}>
            <View style={styles.summaryCard}>
              <Icon name="trending-up" size={28} color="#4CAF50" />
              <Text style={styles.summaryLabel}>Income</Text>
              <Text style={styles.summaryAmount}>${totals.income.toFixed(2)}</Text>
            </View>
            <View style={styles.summaryCard}>
              <Icon name="trending-down" size={28} color="#FF5252" />
              <Text style={styles.summaryLabel}>Expenses</Text>
              <Text style={styles.summaryAmount}>${totals.expenses.toFixed(2)}</Text>
            </View>
            <View style={styles.summaryCard}>
              <Icon name="account-balance" size={28} color="#FFD700" />
              <Text style={styles.summaryLabel}>Balance</Text>
              <Text style={styles.summaryAmount}>${totals.balance.toFixed(2)}</Text>
            </View>
          </View>
        </LinearGradient>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color="#888" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search transactions..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#888"
        />
      </View>

      <Text style={styles.transactionsTitle}>Recent Transactions</Text>
    </>
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
      <FlatList
        data={filteredTransactions}
        renderItem={renderTransaction}
        keyExtractor={item => item.id.toString()}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={<Text style={styles.emptyText}>No transactions found</Text>}
      />
    </LinearGradient>
  );
};

// Details Screen Component
const DetailsScreen = ({ route }) => {
  const { transaction } = route.params;

  return (
    <LinearGradient colors={['#1a1a2e', '#16213e']} style={styles.detailsContainer}>
      <View style={styles.detailsHeader}>
        <Icon
          name={transaction.type === 'income' ? 'arrow-upward' : 'arrow-downward'}
          size={40}
          color={transaction.type === 'income' ? '#4CAF50' : '#FF5252'}
          style={styles.detailsIcon}
        />
        <Text style={styles.detailsAmount}>
          {transaction.type === 'income' ? '+' : '-'}${Math.abs(transaction.amount).toFixed(2)}
        </Text>
      </View>
      <View style={styles.detailsContent}>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Category:</Text>
          <Text style={styles.detailValue}>{transaction.category}</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Date:</Text>
          <Text style={styles.detailValue}>{transaction.date}</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Description:</Text>
          <Text style={styles.detailValue}>{transaction.description}</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Account:</Text>
          <Text style={styles.detailValue}>{transaction.account}</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Type:</Text>
          <Text style={styles.detailValue}>{transaction.type}</Text>
        </View>
      </View>
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
        <Stack.Screen name="Dashboard" component={DashboardScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Details" component={DetailsScreen} options={{ title: 'Transaction Details' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 40,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 26,
    fontWeight: 'bold',
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
  summaryGradient: {
    borderRadius: 15,
    padding: 20,
  },
  summaryTitle: {
    color: '#fff',
    fontSize: 22,
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 25,
    paddingHorizontal: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
    padding: 10,
  },
  transactionsTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  transactionCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 10,
    padding: 15,
    marginHorizontal: 20,
    marginBottom: 10,
    alignItems: 'center',
    elevation: 2,
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
  detailsContainer: {
    flex: 1,
    padding: 20,
  },
  detailsHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  detailsIcon: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 30,
    padding: 10,
  },
  detailsAmount: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 10,
  },
  detailsContent: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 10,
    padding: 15,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  detailLabel: {
    color: '#ddd',
    fontSize: 16,
    fontWeight: 'bold',
  },
  detailValue: {
    color: '#fff',
    fontSize: 16,
    flexShrink: 1,
    textAlign: 'right',
  },
});