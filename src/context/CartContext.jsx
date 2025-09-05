import { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const stored = localStorage.getItem("cart");
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, { variant = {}, quantity = 1 } = {}) => {
    const { color = null, length = null, lace = null, price, original_price } = variant;

    // Unique key to distinguish different variants of the same product
    const key = `${product.id}-${color}-${length}-${lace}`;

    setCartItems((prev) => {
      const existing = prev.find((item) => item.key === key);

      if (existing) {
        toast.success(`${product.name} updated in cart`);
        return prev.map((item) =>
          item.key === key
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }

      toast.success(`${product.name} added to cart`);
      return [
        ...prev,
        {
          key,
          id: product.id,
          name: product.name,
          image: variant.image || product.cover_image,
          quantity,
          variant: {
          id: variant.id,
          color: variant.color,
          length: variant.length,
          lace: variant.lace,
          size: variant.size,
          price: variant.price,
        },
        },
      ];
    });
  };

  const updateQuantity = (key, newQuantity) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.key === key ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeFromCart = (key) => {
    setCartItems((prev) => prev.filter((item) => item.key !== key));
    toast.success("Item removed from cart");
  };

  const clearCart = () => {
    setCartItems([]);
    toast.success("Cart cleared");
  };

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, updateQuantity, removeFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};
