// App.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Mock API data with additional fields (restaurants and menu items)
const mockRestaurants = [
  {
    id: 1,
    name: 'Pizza Palace',
    cuisine: 'Italian',
    rating: 4.5,
    image: 'https://picsum.photos/200/300?random=1',
    description: 'Authentic Italian pizzas made with fresh ingredients.',
    menu: [
      { id: 'm1', name: 'Margherita Pizza', price: 12.99 },
      { id: 'm2', name: 'Pepperoni Pizza', price: 14.99 },
    ],
  },
  {
    id: 2,
    name: 'Sushi Haven',
    cuisine: 'Japanese',
    rating: 4.8,
    image: 'https://picsum.photos/200/300?random=2',
    description: 'Fresh sushi and Japanese delicacies.',
    menu: [
      { id: 'm3', name: 'California Roll', price: 8.99 },
      { id: 'm4', name: 'Spicy Tuna Roll', price: 9.99 },
    ],
  },
  {
    id: 3,
    name: 'Taco Fiesta',
    cuisine: 'Mexican',
    rating: 4.2,
    image: 'https://picsum.photos/200/300?random=3',
    description: 'Vibrant Mexican flavors in every bite.',
    menu: [
      { id: 'm5', name: 'Beef Taco', price: 3.99 },
      { id: 'm6', name: 'Chicken Burrito', price: 7.99 },
    ],
  },
  {
    id: 4,
    name: 'Curry Delight',
    cuisine: 'Indian',
    rating: 4.6,
    image: 'https://picsum.photos/200/300?random=4',
    description: 'Rich and spicy Indian curries.',
    menu: [
      { id: 'm7', name: 'Butter Chicken', price: 11.99 },
      { id: 'm8', name: 'Naan Bread', price: 2.99 },
    ],
  },
  {
    id: 5,
    name: 'Burger Bonanza',
    cuisine: 'American',
    rating: 4.3,
    image: 'https://picsum.photos/200/300?random=5',
    description: 'Juicy burgers and classic American fare.',
    menu: [
      { id: 'm9', name: 'Cheeseburger', price: 6.99 },
      { id: 'm10', name: 'Fries', price: 2.49 },
    ],
  },
  {
    id: 6,
    name: 'Noodle Nook',
    cuisine: 'Chinese',
    rating: 4.7,
    image: 'https://picsum.photos/200/300?random=6',
    description: 'Delicious Chinese noodle dishes.',
    menu: [
      { id: 'm11', name: 'Beef Chow Mein', price: 9.99 },
      { id: 'm12', name: 'Spring Rolls', price: 4.99 },
    ],
  },
];

const Stack = createStackNavigator();

// Home Screen Component
const HomeScreen = ({ navigation }) => {
  const [restaurants, setRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCuisine, setSelectedCuisine] = useState('All');
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    fetchRestaurants();
    loadCartCount();
  }, []);

  useEffect(() => {
    const filtered = selectedCuisine === 'All'
      ? restaurants
      : restaurants.filter(restaurant => restaurant.cuisine === selectedCuisine);
    setFilteredRestaurants(filtered);
  }, [selectedCuisine, restaurants]);

  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      setError(null);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
      setRestaurants(mockRestaurants);
      setFilteredRestaurants(mockRestaurants);
    } catch (err) {
      setError('Error fetching restaurants. Please try again.');
      Alert.alert('Error', 'Failed to load restaurants.');
    } finally {
      setLoading(false);
    }
  };

  const loadCartCount = async () => {
    try {
      const cart = await AsyncStorage.getItem('cart');
      const cartItems = cart ? JSON.parse(cart) : [];
      setCartCount(cartItems.length);
    } catch (err) {
      console.error('Error loading cart:', err);
    }
  };

  const cuisines = ['All', ...new Set(mockRestaurants.map(r => r.cuisine))];

  const renderRestaurantCard = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('Details', { restaurant: item, updateCartCount: setCartCount })}
    >
      <Image source={{ uri: item.image }} style={styles.restaurantImage} />
      <LinearGradient colors={['transparent', 'rgba(0,0,0,0.9)']} style={styles.gradient}>
        <Text style={styles.name} numberOfLines={2}>{item.name}</Text>
        <Text style={styles.cuisine}>{item.cuisine}</Text>
        <View style={styles.ratingContainer}>
          <Icon name="star" size={16} color="#FFD700" />
          <Text style={styles.rating}>{item.rating}</Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  const renderHeader = () => (
    <>
      <View style={styles.header}>
        <Text style={styles.headerText}>Food Delivery</Text>
        <TouchableOpacity onPress={() => Alert.alert('Cart', `Items: ${cartCount}`)}>
          <Icon name="shopping-cart" size={24} color="#fff" />
          {cartCount > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{cartCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
      <View style={styles.filterContainer}>
        <Text style={styles.filterLabel}>Cuisine:</Text>
        <Picker
          selectedValue={selectedCuisine}
          style={styles.picker}
          onValueChange={(itemValue) => setSelectedCuisine(itemValue)}
        >
          {cuisines.map(cuisine => (
            <Picker.Item key={cuisine} label={cuisine} value={cuisine} />
          ))}
        </Picker>
        <TouchableOpacity onPress={fetchRestaurants} style={styles.refreshButton}>
          <Icon name="refresh" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </>
  );

  if (loading) {
    return (
      <LinearGradient colors={['#FF6F61', '#DE1D53']} style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#fff" />
        <Text style={styles.loadingText}>Loading Restaurants...</Text>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#FF6F61', '#DE1D53']} style={styles.container}>
      <FlatList
        data={filteredRestaurants}
        renderItem={renderRestaurantCard}
        keyExtractor={item => item.id.toString()}
        numColumns={2}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.restaurantList}
        ListEmptyComponent={<Text style={styles.emptyText}>No restaurants found</Text>}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </LinearGradient>
  );
};

// Details Screen Component
const DetailsScreen = ({ route }) => {
  const { restaurant, updateCartCount } = route.params;

  const addToCart = async (menuItem) => {
    try {
      const cart = await AsyncStorage.getItem('cart');
      const cartItems = cart ? JSON.parse(cart) : [];
      const updatedCart = [...cartItems, { ...menuItem, restaurantId: restaurant.id }];
      await AsyncStorage.setItem('cart', JSON.stringify(updatedCart));
      updateCartCount(updatedCart.length);
      Alert.alert('Success', `${menuItem.name} added to cart!`);
    } catch (err) {
      Alert.alert('Error', 'Failed to add to cart.');
    }
  };

  const renderMenuItem = ({ item }) => (
    <View style={styles.menuItem}>
      <Text style={styles.menuName}>{item.name}</Text>
      <View style={styles.menuPriceContainer}>
        <Text style={styles.menuPrice}>${item.price.toFixed(2)}</Text>
        <TouchableOpacity onPress={() => addToCart(item)} style={styles.addButton}>
          <Icon name="add-shopping-cart" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <LinearGradient colors={['#FF6F61', '#DE1D53']} style={styles.detailsContainer}>
      <ScrollView>
        <Image source={{ uri: restaurant.image }} style={styles.detailsImage} />
        <View style={styles.detailsContent}>
          <Text style={styles.detailsName}>{restaurant.name}</Text>
          <Text style={styles.detailsCuisine}>{restaurant.cuisine}</Text>
          <View style={styles.detailsRatingContainer}>
            <Icon name="star" size={20} color="#FFD700" />
            <Text style={styles.detailsRating}>{restaurant.rating}</Text>
          </View>
          <Text style={styles.detailsDescription}>{restaurant.description}</Text>
          <Text style={styles.menuTitle}>Menu</Text>
          <FlatList
            data={restaurant.menu}
            renderItem={renderMenuItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.menuList}
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
        initialRouteName="Home"
        screenOptions={{
          headerStyle: { backgroundColor: '#FF6F61' },
          headerTintColor: '#fff',
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Details" component={DetailsScreen} options={{ title: 'Restaurant Details' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 40,
  },
  headerText: {
    color: '#fff',
    fontSize: 26,
    fontWeight: 'bold',
  },
  cartBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#fff',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: '#FF6F61',
    fontSize: 12,
    fontWeight: 'bold',
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  filterLabel: {
    color: '#fff',
    fontSize: 16,
    marginRight: 10,
  },
  picker: {
    flex: 1,
    color: '#fff',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 10,
  },
  refreshButton: {
    marginLeft: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 10,
  },
  errorText: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    padding: 20,
  },
  restaurantList: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  card: {
    flex: 1,
    margin: 10,
    borderRadius: 15,
    backgroundColor: '#fff',
    elevation: 5,
    overflow: 'hidden',
    maxWidth: '45%',
  },
  restaurantImage: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  gradient: {
    padding: 10,
    alignItems: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  cuisine: {
    fontSize: 12,
    color: '#ddd',
    marginTop: 5,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  rating: {
    fontSize: 14,
    color: '#FFD700',
    marginLeft: 5,
  },
  detailsContainer: {
    flex: 1,
  },
  detailsImage: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
  },
  detailsContent: {
    padding: 20,
  },
  detailsName: {
    color: '#fff',
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  detailsCuisine: {
    color: '#ddd',
    fontSize: 16,
    marginBottom: 10,
  },
  detailsRatingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  detailsRating: {
    color: '#FFD700',
    fontSize: 18,
    marginLeft: 5,
  },
  detailsDescription: {
    color: '#fff',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 20,
  },
  menuTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  menuList: {
    paddingBottom: 20,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  menuName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  menuPriceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuPrice: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 10,
  },
  addButton: {
    backgroundColor: '#FF4081',
    borderRadius: 20,
    padding: 5,
  },
});