// src/contexts/CartContext.js
import { createContext, useContext, useState, useEffect } from 'react';
import { request } from '../utils/request'
import { toast } from 'react-toastify';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartCount, setCartCount] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updatingItems, setUpdatingItems] = useState({});
  const [removingItem, setRemovingItem] = useState(null);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await request('cart', 'get');
      
      let items = [];
      if (Array.isArray(response)) {
        items = response;
      } else if (response?.data && Array.isArray(response.data)) {
        items = response.data;
      } else if (response?.items) {
        items = response.items;
      }
      
      setCartItems(items);
      setCartCount(items.reduce((total, item) => total + (item.quantity || 0), 0));
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    try {
      await request('cart', 'post', { book_id: productId, quantity });
      await fetchCart();
      toast.success("Added to cart!");
      return true;
    } catch (error) {
      toast.error("Failed to add to cart");
      return false;
    }
  };

  const updateQuantity = async (itemId, change) => {
    try {
      setUpdatingItems(prev => ({ ...prev, [itemId]: true }));
      
      const currentItem = cartItems.find(item => item.id === itemId);
      if (!currentItem) return;
      
      const newQuantity = Math.max(1, currentItem.quantity + change);
      
      // Optimistic update
      setCartItems(prev => 
        prev.map(item => 
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        )
      );
      setCartCount(prev => prev + change);

      await request(`cart/item/${itemId}`, 'put', { quantity: newQuantity });
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast.error(`Failed to update quantity: ${error.message}`);
      
      // Revert on error
      setCartItems(prev => 
        prev.map(item => 
          item.id === itemId ? { ...item, quantity: currentItem.quantity } : item
        )
      );
      setCartCount(prev => prev - change);
    } finally {
      setUpdatingItems(prev => ({ ...prev, [itemId]: false }));
    }
  };

  const removeItem = async (itemId) => {
    try {
      setRemovingItem(itemId);
      const itemToRemove = cartItems.find(item => item.id === itemId);
      if (!itemToRemove) return;
      
      // Optimistic update
      setCartItems(prev => prev.filter(item => item.id !== itemId));
      setCartCount(prev => prev - itemToRemove.quantity);
      
      await request(`cart/item/${itemId}`, 'delete');
      toast.success("Item removed from cart");
    } catch (error) {
      console.error('Error removing item:', error);
      toast.error(`Failed to remove item: ${error.message}`);
      
      // Revert on error
      if (itemToRemove) {
        setCartItems(prev => [...prev, itemToRemove]);
        setCartCount(prev => prev + itemToRemove.quantity);
      }
    } finally {
      setRemovingItem(null);
    }
  };

  return (
    <CartContext.Provider value={{
      cartCount,
      cartItems,
      loading,
      updatingItems,
      removingItem,
      fetchCart,
      addToCart,
      updateQuantity,
      removeItem
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}