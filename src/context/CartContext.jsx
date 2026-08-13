import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('zebr_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    localStorage.setItem('zebr_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const addToCart = (product, quantity = 1, selectedDuration = null) => {
    const duration = selectedDuration || product.duration;
    const priceToUse = selectedDuration 
      ? (product.durations?.find(d => d.label === selectedDuration)?.price || product.price)
      : product.price;

    setCartItems(prev => {
      const existingIndex = prev.findIndex(
        item => item.product.id === product.id && item.selectedDuration === duration
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      }

      return [...prev, {
        product,
        quantity,
        selectedDuration: duration,
        price: priceToUse
      }];
    });

    showToast(`${product.name} (${duration}) səbətə əlavə edildi!`);
    setIsCartOpen(true);
  };

  const removeFromCart = (productId, selectedDuration) => {
    setCartItems(prev => prev.filter(
      item => !(item.product.id === productId && item.selectedDuration === selectedDuration)
    ));
    showToast("Məhsul səbətdən silindi.");
  };

  const updateQuantity = (productId, selectedDuration, delta) => {
    setCartItems(prev => {
      return prev.map(item => {
        if (item.product.id === productId && item.selectedDuration === selectedDuration) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : item;
        }
        return item;
      });
    });
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalItemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      cartItems,
      isCartOpen,
      setIsCartOpen,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      subtotal,
      totalItemsCount,
      toastMessage,
      showToast
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
