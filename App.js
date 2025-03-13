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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';

const API_URL = 'https://fakestoreapi.com/products';
const Stack = createStackNavigator();

// Home Screen Component
const HomeScreen = ({ navigation }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    fetchProducts();
    loadCartCount();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      setError('Error fetching products. Please try again.');
      Alert.alert('Error', 'Failed to load products.');
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

  const addToCart = async (product) => {
    try {
      const cart = await AsyncStorage.getItem('cart');
      const cartItems = cart ? JSON.parse(cart) : [];
      const updatedCart = [...cartItems, { ...product, quantity: 1 }];
      await AsyncStorage.setItem('cart', JSON.stringify(updatedCart));
      setCartCount(updatedCart.length);
      Alert.alert('Success', `${product.title} added to cart!`);
    } catch (err) {
      Alert.alert('Error', 'Failed to add to cart.');
    }
  };

  const renderProductCard = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('Details', { product: item, addToCart })}
    >
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <LinearGradient colors={['transparent', 'rgba(0,0,0,0.8)']} style={styles.gradient}>
        <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.price}>${item.price.toFixed(2)}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <LinearGradient colors={['#ff6f61', '#ff4081']} style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#fff" />
        <Text style={styles.loadingText}>Loading Products...</Text>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#ff6f61', '#ff4081']} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Abdul-Rahman E-Commerce</Text>
        <TouchableOpacity onPress={() => Alert.alert('Cart', `Items: ${cartCount}`)}>
          <Icon name="shopping-cart" size={28} color="#fff" />
          {cartCount > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{cartCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <FlatList
          data={products}
          renderItem={renderProductCard}
          keyExtractor={item => item.id.toString()}
          numColumns={2}
          contentContainerStyle={styles.productList}
        />
      )}
    </LinearGradient>
  );
};

// Details Screen Component
const DetailsScreen = ({ route }) => {
  const { product, addToCart } = route.params;

  return (
    <LinearGradient colors={['#ff6f61', '#ff4081']} style={styles.detailsContainer}>
      <ScrollView>
        <Image source={{ uri: product.image }} style={styles.detailsImage} />
        <View style={styles.detailsContent}>
          <Text style={styles.detailsTitle}>{product.title}</Text>
          <Text style={styles.detailsPrice}>${product.price.toFixed(2)}</Text>
          <Text style={styles.detailsCategory}>Category: {product.category}</Text>
          <Text style={styles.detailsDescription}>{product.description}</Text>
          <TouchableOpacity style={styles.addToCartButton} onPress={() => addToCart(product)}>
            <LinearGradient colors={['#ff4081', '#ff6f61']} style={styles.buttonGradient}>
              <Text style={styles.buttonText}>Add to Cart</Text>
            </LinearGradient>
          </TouchableOpacity>
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
          headerStyle: { backgroundColor: '#ff4081' },
          headerTintColor: '#fff',
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Details" component={DetailsScreen} options={{ title: 'Product Details' }} />
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
    fontSize: 24,
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
    color: '#ff4081',
    fontSize: 12,
    fontWeight: 'bold',
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
    marginVertical: 20,
  },
  productList: {
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
  productImage: {
    width: '100%',
    height: 180,
    resizeMode: 'contain',
  },
  gradient: {
    padding: 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  price: {
    fontSize: 16,
    color: '#ddd',
    marginTop: 5,
    fontWeight: 'bold',
  },
  detailsContainer: {
    flex: 1,
  },
  detailsImage: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
  },
  detailsContent: {
    padding: 20,
  },
  detailsTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  detailsPrice: {
    color: '#ffd700',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  detailsCategory: {
    color: '#ddd',
    fontSize: 16,
    marginBottom: 15,
  },
  detailsDescription: {
    color: '#fff',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 20,
  },
  addToCartButton: {
    borderRadius: 25,
    overflow: 'hidden',
  },
  buttonGradient: {
    paddingVertical: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});