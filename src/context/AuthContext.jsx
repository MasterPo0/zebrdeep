import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const initialMockUser = {
  id: "usr_10293",
  name: "Elvin Məmmədov",
  email: "elvin@zebr.az",
  phone: "+994 50 123 45 67",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop",
  zebrCoins: 450, // 450 coins = 4.50 AZN
  tier: "Qızıl Zebra Statusu",
  cashbackRate: "5%",
  orders: [
    {
      id: "ZEBR-849201",
      date: "2026-08-01",
      productName: "Netflix Premium 4K",
      duration: "1 il",
      price: 129.99,
      status: "Çatdırıldı",
      activationKey: "NFLX-AZ-8849-2026-PRO",
      coinsEarned: 65
    },
    {
      id: "ZEBR-629104",
      date: "2026-07-15",
      productName: "ChatGPT Plus (GPT-4o)",
      duration: "1 ay",
      price: 29.99,
      status: "Aktiv",
      activationKey: "GPT4-KEY-ZEBR-9930-PLUS",
      coinsEarned: 15
    },
    {
      id: "ZEBR-310492",
      date: "2026-06-10",
      productName: "Spotify Premium",
      duration: "3 ay",
      price: 17.99,
      status: "Aktiv",
      activationKey: "SPOT-AZ-INVITE-LINK-2026",
      coinsEarned: 9
    }
  ],
  subscriptions: [
    {
      id: "sub_1",
      name: "ChatGPT Plus (GPT-4o)",
      plan: "Aylıq Abunəlik",
      expiryDate: "2026-09-15",
      daysLeft: 34,
      accountInfo: "elvin@zebr.az (Şəxsi hesab)",
      status: "Aktiv",
      autoRenew: true
    },
    {
      id: "sub_2",
      name: "Netflix Premium 4K",
      plan: "İllik Abunəlik",
      expiryDate: "2027-08-01",
      daysLeft: 354,
      accountInfo: "Profil 3 (PIN: 2026)",
      status: "Aktiv",
      autoRenew: true
    }
  ]
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('zebr_user');
    return saved ? JSON.parse(saved) : initialMockUser; // Default logged in for easy demo & inspection
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('zebr_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('zebr_user');
    }
  }, [user]);

  const login = (userData) => {
    const fullUser = { ...initialMockUser, ...userData };
    setUser(fullUser);
  };

  const logout = () => {
    setUser(null);
  };

  const deductCoins = (coinsAmount) => {
    if (!user) return;
    setUser(prev => ({
      ...prev,
      zebrCoins: Math.max(0, prev.zebrCoins - coinsAmount)
    }));
  };

  const addCoins = (coinsAmount) => {
    if (!user) return;
    setUser(prev => ({
      ...prev,
      zebrCoins: prev.zebrCoins + coinsAmount
    }));
  };

  const updateProfile = (updatedFields) => {
    setUser(prev => ({
      ...prev,
      ...updatedFields
    }));
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      isAuthenticated: !!user,
      deductCoins,
      useCoins: deductCoins,
      addCoins,
      updateProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
