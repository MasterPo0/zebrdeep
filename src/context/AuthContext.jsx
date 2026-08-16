import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiService } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('zebr_user');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('zebr_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('zebr_user');
      localStorage.removeItem('accessToken');
    }
  }, [user]);

  // Load latest profile from API if accessToken exists
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      apiService.getMe()
        .then(res => {
          if (res.data) {
            const fetched = res.data;
            const roles = fetched.roles || [fetched.role || 'ROLE_USER'];
            const mainRole = roles.includes('ROLE_ADMIN') ? 'ROLE_ADMIN' : (fetched.role || 'ROLE_USER');
            setUser(prev => ({
              ...prev,
              ...fetched,
              role: mainRole,
              roles: roles,
              name: fetched.fullName || `${fetched.firstName || ''} ${fetched.lastName || ''}`.trim() || fetched.email
            }));
          }
        })
        .catch(() => {});
    }
  }, []);

  const login = (userData) => {
    const roles = userData.roles || (userData.role ? [userData.role] : (userData.email?.includes('admin') ? ['ROLE_ADMIN', 'ROLE_USER'] : ['ROLE_USER']));
    const mainRole = roles.includes('ROLE_ADMIN') ? 'ROLE_ADMIN' : 'ROLE_USER';

    const fullUser = {
      id: userData.id || Date.now(),
      email: userData.email,
      name: userData.fullName || `${userData.firstName || ''} ${userData.lastName || ''}`.trim() || userData.email,
      firstName: userData.firstName || '',
      lastName: userData.lastName || '',
      role: mainRole,
      roles: roles,
      avatar: userData.avatarUrl || null,
      zebrCoins: userData.zebrCoins || 0,
      orders: userData.orders || [],
      subscriptions: userData.subscriptions || []
    };

    if (userData.accessToken) {
      localStorage.setItem('accessToken', userData.accessToken);
    }
    setUser(fullUser);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('zebr_user');
  };

  const toggleRole = () => {
    if (!user) return;
    const newRole = user.role === 'ROLE_ADMIN' ? 'ROLE_USER' : 'ROLE_ADMIN';
    const newRoles = newRole === 'ROLE_ADMIN' ? ['ROLE_ADMIN', 'ROLE_USER'] : ['ROLE_USER'];
    setUser(prev => ({
      ...prev,
      role: newRole,
      roles: newRoles
    }));
  };

  const deductCoins = (coinsAmount) => {
    if (!user) return;
    setUser(prev => ({
      ...prev,
      zebrCoins: Math.max(0, (prev.zebrCoins || 0) - coinsAmount)
    }));
  };

  const addCoins = (coinsAmount) => {
    if (!user) return;
    setUser(prev => ({
      ...prev,
      zebrCoins: (prev.zebrCoins || 0) + coinsAmount
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
      id: orderData.orderId || `ORD-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      productName: orderData.items?.map(i => i.product.name).join(', ') || 'Rəqəmsal Məhsul',
      duration: orderData.items?.[0]?.selectedDuration || '1 ay',
      price: orderData.total,
      status: 'Aktiv'
    };

    setUser(prev => ({
      ...prev,
      orders: [newOrder, ...(prev.orders || [])]
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
