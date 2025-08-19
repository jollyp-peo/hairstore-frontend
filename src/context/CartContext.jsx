import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    // Load from localStorage on first load
    const stored = localStorage.getItem('cart');
    return stored ? JSON.parse(stored) : [];
  });

  // Save to localStorage whenever cartItems change
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, options = {}) => {
    const { quantity = 1, length = null, color = null } = options;

    setCartItems(prev => {
      const existing = prev.find(
        item =>
          item.id === product.id &&
          item.length === length &&
          item.color === color
      );

      if (existing) {
        return prev.map(item =>
          item.id === product.id &&
          item.length === length &&
          item.color === color
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }

      return [...prev, { ...product, quantity, length, color }];
    });
  };

  const updateQuantity = (productId, length, color, newQuantity) => {
    setCartItems(prev =>
      prev.map(item =>
        item.id === productId &&
        item.length === length &&
        item.color === color
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const removeFromCart = (productId, length, color) => {
    setCartItems(prev =>
      prev.filter(
        item =>
          !(item.id === productId &&
            item.length === length &&
            item.color === color)
      )
    );
  };

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, updateQuantity, removeFromCart }}
    >
      {children}
    </CartContext.Provider>
  );
};
