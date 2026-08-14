import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const initialMockUser = {
  id: "usr_10293",
  name: "Elvin Məmmədov",
  email: "elvin@zebr.az",
  phone: "+994 50 123 45 67",
  role: "ROLE_USER", // 'ROLE_USER' or 'ROLE_ADMIN'
  roles: ["ROLE_USER"],
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop",
  zebrCoins: 450,
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
    }
  ]
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('zebr_user');
    return saved ? JSON.parse(saved) : initialMockUser;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('zebr_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('zebr_user');
      localStorage.removeItem('accessToken');
    }
  }, [user]);

  const login = (userData) => {
    const role = userData.role || (userData.email?.includes('admin') ? 'ROLE_ADMIN' : 'ROLE_USER');
    const fullUser = { 
      ...initialMockUser, 
      ...userData,
      role,
      roles: [role]
    };
    if (userData.accessToken) {
      localStorage.setItem('accessToken', userData.accessToken);
    }
    setUser(fullUser);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('accessToken');
  };

  const toggleRole = () => {
    if (!user) return;
    const newRole = user.role === 'ROLE_ADMIN' ? 'ROLE_USER' : 'ROLE_ADMIN';
    setUser(prev => ({
      ...prev,
      role: newRole,
      roles: [newRole]
    }));
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

  const addOrder = (orderData) => {
    if (!user) return;
    const newOrder = {
      id: orderData.orderId,
      date: new Date().toISOString().split('T')[0],
      productName: orderData.items?.map(i => i.product.name).join(', ') || 'Rəqəmsal Məhsul',
      duration: orderData.items?.[0]?.selectedDuration || '1 ay',
      price: orderData.total,
      status: 'Aktiv',
      activationKey: `ZEBR-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}-KEY`,
      coinsEarned: Math.floor(orderData.total * 5)
    };

    const newSubscriptions = orderData.items?.map((item, idx) => ({
      id: `sub_${Date.now()}_${idx}`,
      name: item.product.name,
      plan: `${item.selectedDuration} Abunəlik`,
      expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      daysLeft: 30,
      accountInfo: `${orderData.customer?.email || user.email} (Aktivasiya Kodu Təsdiqləndi)`,
      status: 'Aktiv',
      autoRenew: true
    })) || [];

    setUser(prev => ({
      ...prev,
      zebrCoins: prev.zebrCoins + Math.floor(orderData.total * 5),
      orders: [newOrder, ...prev.orders],
      subscriptions: [...newSubscriptions, ...prev.subscriptions]
    }));
  };

  const isAdmin = user?.role === 'ROLE_ADMIN' || user?.roles?.includes('ROLE_ADMIN');

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      isAuthenticated: !!user,
      isAdmin,
      toggleRole,
      deductCoins,
      useCoins: deductCoins,
      addCoins,
      addOrder,
      updateProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
