import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiService } from '../services/api';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem('zebr_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('zebr_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Load wishlist from backend API on mount if authenticated
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token && token !== 'undefined' && token !== 'null') {
      apiService.getWishlist()
        .then(res => {
          if (res.data?.products && Array.isArray(res.data.products)) {
            setWishlist(res.data.products);
          }
        })
        .catch(() => {});
    }
  }, []);

  const isInWishlist = (productId) => {
    return wishlist.some(item => item.id === productId || item.id === Number(productId));
  };

  const addToWishlist = async (product) => {
    if (!isInWishlist(product.id)) {
      const updated = [...wishlist, product];
      setWishlist(updated);
      try {
        await apiService.addToWishlist(product.id);
      } catch (err) {}
    }
  };

  const removeFromWishlist = async (productId) => {
    const updated = wishlist.filter(item => item.id !== productId && item.id !== Number(productId));
    setWishlist(updated);
    try {
      await apiService.removeFromWishlist(productId);
    } catch (err) {}
  };

  const toggleWishlist = (product) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <WishlistContext.Provider value={{
      wishlist,
      isInWishlist,
      addToWishlist,
      removeFromWishlist,
      toggleWishlist,
      wishlistCount: wishlist.length
    }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
