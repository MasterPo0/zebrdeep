import { products as initialProducts } from '../data/products';
import { categories as initialCategories } from '../data/categories';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://backend-vauu-production.up.railway.app/api';

// In-memory mock storage synced for demo mode when backend is offline
let mockProducts = [...initialProducts];
let mockCategories = [...initialCategories];
let mockWishlist = [initialProducts[0], initialProducts[2]]; // Default sample wishlist items
let mockOrders = [
  {
    id: 15,
    orderNumber: "ORD-20260814-9876",
    totalAmount: 159.98,
    status: "COMPLETED",
    paymentMethod: "CREDIT_CARD",
    customerName: "Elvin MÉ™mmÉ™dov",
    customerEmail: "elvin@zebr.az",
    items: [
      {
        id: 20,
        productId: 1,
        productTitle: "Netflix Premium 4K",
        productSlug: "netflix-premium-4k",
        price: 129.99,
        quantity: 1,
        subTotal: 129.99
      },
      {
        id: 21,
        productId: 3,
        productTitle: "ChatGPT Plus (GPT-4o)",
        productSlug: "chatgpt-plus-gpt4o",
        price: 29.99,
        quantity: 1,
        subTotal: 29.99
      }
    ],
    createdAt: "2026-08-14T22:10:00",
    updatedAt: "2026-08-14T22:10:00"
  },
  {
    id: 14,
    orderNumber: "ORD-20260810-4102",
    totalAmount: 17.99,
    status: "PENDING",
    paymentMethod: "E_MANAT",
    customerName: "Ali Aliyev",
    customerEmail: "user@example.com",
    items: [
      {
        id: 19,
        productId: 2,
        productTitle: "Spotify Premium",
        productSlug: "spotify-premium",
        price: 17.99,
        quantity: 1,
        subTotal: 17.99
      }
    ],
    createdAt: "2026-08-10T15:30:00",
    updatedAt: "2026-08-10T15:30:00"
  }
];

let mockUsers = [
  {
    id: 1,
    email: "elvin@zebr.az",
    firstName: "Elvin",
    lastName: "MÉ™mmÉ™dov",
    fullName: "Elvin MÉ™mmÉ™dov",
    phoneNumber: "+994501234567",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop",
    role: "ROLE_USER",
    roles: ["ROLE_USER"],
    isEmailVerified: true,
    createdAt: "2026-08-01T10:00:00"
  },
  {
    id: 2,
    email: "admin@zebr.az",
    firstName: "ZEBR",
    lastName: "Admin",
    fullName: "ZEBR Admin",
    phoneNumber: "+994509998877",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
    role: "ROLE_ADMIN",
    roles: ["ROLE_ADMIN", "ROLE_USER"],
    isEmailVerified: true,
    createdAt: "2026-08-01T08:00:00"
  }
];

// Helper to make API requests with Authorization header & Fallback
async function request(endpoint, options = {}, mockFallback = null) {
  const token = localStorage.getItem('accessToken');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers
    });
    const json = await response.json();
    if (!response.ok || json.success === false) {
      throw new Error(json.message || 'API Request Failed');
    }
    return json;
  } catch (err) {
    // If backend server is unreachable or offline, use local fallback logic
    if (mockFallback) {
      const mockData = await mockFallback();
      return {
        success: true,
        message: "Operation completed successfully (Mock Mode)",
        data: mockData,
        timestamp: new Date().toISOString()
      };
    }
    throw err;
  }
}

export const apiService = {
  // 1. AUTH MODULE (/auth)
  async register(data) {
    return request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data)
    }, async () => {
      const newUser = {
        id: mockUsers.length + 1,
        email: data.email,
        firstName: data.firstName || data.name?.split(' ')[0] || "Ä°stifadÉ™Ã§i",
        lastName: data.lastName || data.name?.split(' ')[1] || "ZEBR",
        fullName: data.name || `${data.firstName || ''} ${data.lastName || ''}`.trim(),
        avatarUrl: null,
        phoneNumber: null,
        isEmailVerified: false,
        role: "ROLE_USER",
        roles: ["ROLE_USER"],
        createdAt: new Date().toISOString()
      };
      mockUsers.push(newUser);
      return {
        accessToken: "mock_jwt_access_token_" + Date.now(),
        refreshToken: "mock_refresh_token_" + Date.now(),
        tokenType: "Bearer",
        ...newUser,
        user: newUser
      };
    });
  },

  async login(credentials) {
    return request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    }, async () => {
      const found = mockUsers.find(u => u.email.toLowerCase() === credentials.email.toLowerCase()) || {
        id: 1,
        email: credentials.email,
        firstName: "Elvin",
        lastName: "MÉ™mmÉ™dov",
        fullName: "Elvin MÉ™mmÉ™dov",
        avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop",
        role: credentials.email.includes('admin') ? "ROLE_ADMIN" : "ROLE_USER",
        roles: credentials.email.includes('admin') ? ["ROLE_ADMIN", "ROLE_USER"] : ["ROLE_USER"],
        isEmailVerified: true,
        createdAt: "2026-08-01T10:00:00"
      };

      return {
        accessToken: "mock_jwt_access_token_" + Date.now(),
        refreshToken: "mock_refresh_token_" + Date.now(),
        tokenType: "Bearer",
        ...found,
        user: found
      };
    });
  },

  async refreshToken(refreshToken) {
    return request('/auth/refresh-token', {
      method: 'POST',
      body: JSON.stringify({ refreshToken })
    }, async () => {
      return {
        accessToken: "mock_refreshed_access_token_" + Date.now(),
        refreshToken: "mock_refreshed_refresh_token_" + Date.now(),
        tokenType: "Bearer"
      };
    });
  },

  // 2. USER MODULE (/users)
  async getMe() {
    return request('/users/me', { method: 'GET' }, async () => {
      return mockUsers[0];
    });
  },

  async updateProfile(data) {
    return request('/users/me', {
      method: 'PUT',
      body: JSON.stringify(data)
    }, async () => {
      mockUsers[0] = { ...mockUsers[0], ...data };
      return mockUsers[0];
    });
  },

  async changePassword(data) {
    return request('/users/me/change-password', {
      method: 'POST',
      body: JSON.stringify(data)
    }, async () => {
      return null;
    });
  },

  async updateUserRole(userId, roleName) {
    return request(`/users/admin/${userId}/role?roleName=${roleName}`, {
      method: 'PUT'
    }, async () => {
      const idx = mockUsers.findIndex(u => u.id === Number(userId));
      if (idx !== -1) {
        mockUsers[idx].role = roleName;
        mockUsers[idx].roles = [roleName];
        return mockUsers[idx];
      }
      return { id: userId, role: roleName };
    });
  },

  async getAllUsersAdmin() {
    return request('/users/admin/all', { method: 'GET' }, async () => {
      return mockUsers;
    });
  },

  // 3. PRODUCTS MODULE (/products)
  async getProducts(params = {}) {
    const query = new URLSearchParams(params).toString();
    return request(`/products${query ? '?' + query : ''}`, { method: 'GET' }, async () => {
      let result = [...mockProducts];

      if (params.search) {
        const q = params.search.toLowerCase();
        result = result.filter(p => p.name.toLowerCase().includes(q) || (p.shortDescription && p.shortDescription.toLowerCase().includes(q)));
      }
      if (params.category || params.categoryId) {
        const catVal = params.category || params.categoryId;
        result = result.filter(p => p.category === catVal || p.categorySlug === catVal);
      }
      if (params.maxPrice) {
        result = result.filter(p => p.price <= Number(params.maxPrice));
      }
      if (params.sortBy) {
        if (params.sortBy === 'price-asc') result.sort((a, b) => a.price - b.price);
        if (params.sortBy === 'price-desc') result.sort((a, b) => b.price - a.price);
        if (params.sortBy === 'rating') result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        if (params.sortBy === 'newest') result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
      }

      return {
        content: result,
        pageNumber: Number(params.page || 0),
        pageSize: Number(params.size || 12),
        totalElements: result.length,
        totalPages: Math.ceil(result.length / (params.size || 12)),
        isLast: true
      };
    });
  },

  async getProductById(id) {
    return request(`/products/${id}`, { method: 'GET' }, async () => {
      const product = mockProducts.find(p => p.id === Number(id)) || mockProducts[0];
      return product;
    });
  },

  async getProductBySlug(slug) {
    return request(`/products/slug/${slug}`, { method: 'GET' }, async () => {
      const product = mockProducts.find(p => p.slug === slug) || mockProducts[0];
      return product;
    });
  },

  async createProduct(productData) {
    return request('/products', {
      method: 'POST',
      body: JSON.stringify(productData)
    }, async () => {
      const newId = mockProducts.length ? Math.max(...mockProducts.map(p => p.id)) + 1 : 1;
      const newProd = {
        id: newId,
        title: productData.name || productData.title,
        name: productData.name || productData.title,
        slug: (productData.name || productData.title).toLowerCase().replace(/\s+/g, '-'),
        shortDescription: productData.shortDescription || productData.description || '',
        fullDescription: productData.fullDescription || productData.description || '',
        price: Number(productData.price),
        oldPrice: productData.oldPrice ? Number(productData.oldPrice) : null,
        discount: productData.discount || null,
        category: productData.category || 'streaming',
        categoryName: productData.categoryName || 'RÉ™qÉ™msal',
        duration: productData.duration || '1 ay',
        rating: 5.0,
        ratingCount: 1,
        stock: productData.stockQuantity || productData.stock || 50,
        instantDelivery: true,
        status: productData.status || 'ACTIVE',
        image: productData.image || "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=600&auto=format&fit=crop",
        createdAt: new Date().toISOString()
      };
      mockProducts.unshift(newProd);
      return newProd;
    });
  },

  async updateProduct(id, productData) {
    return request(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData)
    }, async () => {
      const idx = mockProducts.findIndex(p => p.id === Number(id));
      if (idx !== -1) {
        mockProducts[idx] = { ...mockProducts[idx], ...productData };
        return mockProducts[idx];
      }
      return productData;
    });
  },

  async deleteProduct(id) {
    return request(`/products/${id}`, {
      method: 'DELETE'
    }, async () => {
      mockProducts = mockProducts.filter(p => p.id !== Number(id));
      return null;
    });
  },

  // 4. CATEGORIES MODULE (/categories)
  async getCategories() {
    return request('/categories', { method: 'GET' }, async () => {
      return mockCategories;
    });
  },

  async getRootCategories() {
    return request('/categories/roots', { method: 'GET' }, async () => {
      return mockCategories.filter(c => !c.parentId);
    });
  },

  async getCategoryById(id) {
    return request(`/categories/${id}`, { method: 'GET' }, async () => {
      return mockCategories.find(c => c.id === id || c.id === Number(id)) || mockCategories[0];
    });
  },

  async getCategoryBySlug(slug) {
    return request(`/categories/slug/${slug}`, { method: 'GET' }, async () => {
      return mockCategories.find(c => c.slug === slug || c.id === slug) || mockCategories[0];
    });
  },

  async createCategory(categoryData) {
    return request('/categories', {
      method: 'POST',
      body: JSON.stringify(categoryData)
    }, async () => {
      const newCat = {
        id: categoryData.slug || categoryData.name.toLowerCase().replace(/\s+/g, '-'),
        slug: categoryData.slug || categoryData.name.toLowerCase().replace(/\s+/g, '-'),
        name: categoryData.name,
        description: categoryData.description || '',
        icon: categoryData.icon || 'Grid',
        productCount: 0,
        featured: true,
        createdAt: new Date().toISOString()
      };
      mockCategories.push(newCat);
      return newCat;
    });
  },

  async updateCategory(id, categoryData) {
    return request(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(categoryData)
    }, async () => {
      const idx = mockCategories.findIndex(c => c.id === id || c.slug === id);
      if (idx !== -1) {
        mockCategories[idx] = { ...mockCategories[idx], ...categoryData };
        return mockCategories[idx];
      }
      return categoryData;
    });
  },

  async deleteCategory(id) {
    return request(`/categories/${id}`, {
      method: 'DELETE'
    }, async () => {
      mockCategories = mockCategories.filter(c => c.id !== id && c.slug !== id);
      return null;
    });
  },

  // 5. CART MODULE (/cart)
  async getCart() {
    return request('/cart', { method: 'GET' }, async () => {
      return {
        id: 1,
        items: [],
        totalPrice: 0,
        totalItems: 0
      };
    });
  },

  async addToCart(productId, quantity = 1) {
    return request('/cart', {
      method: 'POST',
      body: JSON.stringify({ productId, quantity })
    }, async () => {
      return { success: true };
    });
  },

  async updateCartItem(cartItemId, quantity) {
    return request(`/cart/items/${cartItemId}?quantity=${quantity}`, {
      method: 'PUT'
    }, async () => {
      return { success: true };
    });
  },

  async removeCartItem(cartItemId) {
    return request(`/cart/items/${cartItemId}`, {
      method: 'DELETE'
    }, async () => {
      return { success: true };
    });
  },

  async clearCart() {
    return request('/cart', { method: 'DELETE' }, async () => {
      return null;
    });
  },

  // 6. ORDERS MODULE (/orders)
  async checkout(orderData) {
    return request('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData)
    }, async () => {
      const orderNum = `ORD-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-${Math.floor(1000 + Math.random() * 9000)}`;
      const newOrder = {
        id: mockOrders.length + 10,
        orderNumber: orderNum,
        orderId: orderNum,
        totalAmount: orderData.total,
        status: "PENDING",
        paymentMethod: orderData.paymentMethod || "CREDIT_CARD",
        customerName: orderData.customer?.fullName || "MÃ¼ÅŸtÉ™ri",
        customerEmail: orderData.customer?.email || "user@example.com",
        items: (orderData.items || []).map((item, i) => ({
          id: i + 1,
          productId: item.product.id,
          productTitle: item.product.name,
          productSlug: item.product.slug,
          price: item.price,
          quantity: item.quantity,
          subTotal: item.price * item.quantity
        })),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      mockOrders.unshift(newOrder);
      return newOrder;
    });
  },

  async getOrders(params = {}) {
    return request('/orders', { method: 'GET' }, async () => {
      return {
        content: mockOrders,
        pageNumber: 0,
        pageSize: 10,
        totalElements: mockOrders.length,
        totalPages: 1,
        isLast: true
      };
    });
  },

  async getOrderById(id) {
    return request(`/orders/${id}`, { method: 'GET' }, async () => {
      return mockOrders.find(o => o.id === Number(id)) || mockOrders[0];
    });
  },

  async getOrderByNumber(orderNumber) {
    return request(`/orders/number/${orderNumber}`, { method: 'GET' }, async () => {
      return mockOrders.find(o => o.orderNumber === orderNumber) || mockOrders[0];
    });
  },

  async cancelOrder(id) {
    return request(`/orders/${id}/cancel`, { method: 'POST' }, async () => {
      const idx = mockOrders.findIndex(o => o.id === Number(id));
      if (idx !== -1) {
        mockOrders[idx].status = 'CANCELLED';
        return mockOrders[idx];
      }
      return mockOrders[0];
    });
  },

  async getAllOrdersAdmin() {
    return request('/orders/admin/all', { method: 'GET' }, async () => {
      return {
        content: mockOrders,
        pageNumber: 0,
        pageSize: 20,
        totalElements: mockOrders.length,
        totalPages: 1,
        isLast: true
      };
    });
  },

  async updateOrderStatusAdmin(id, status) {
    return request(`/orders/admin/${id}/status?status=${status}`, {
      method: 'PUT'
    }, async () => {
      const idx = mockOrders.findIndex(o => o.id === Number(id));
      if (idx !== -1) {
        mockOrders[idx].status = status;
        return mockOrders[idx];
      }
      return { id, status };
    });
  },

  // 7. WISHLIST MODULE (/wishlist)
  async getWishlist() {
    return request('/wishlist', { method: 'GET' }, async () => {
      return {
        id: 1,
        products: mockWishlist,
        totalItems: mockWishlist.length
      };
    });
  },

  async addToWishlist(productId) {
    return request(`/wishlist/${productId}`, { method: 'POST' }, async () => {
      const product = mockProducts.find(p => p.id === Number(productId));
      if (product && !mockWishlist.some(p => p.id === product.id)) {
        mockWishlist.push(product);
      }
      return {
        id: 1,
        products: mockWishlist,
        totalItems: mockWishlist.length
      };
    });
  },

  async removeFromWishlist(productId) {
    return request(`/wishlist/${productId}`, { method: 'DELETE' }, async () => {
      mockWishlist = mockWishlist.filter(p => p.id !== Number(productId));
      return {
        id: 1,
        products: mockWishlist,
        totalItems: mockWishlist.length
      };
    });
  },

  // 8. FILE UPLOAD MODULE (/files)
  async uploadFile(file) {
    const formData = new FormData();
    formData.append('file', file);
    const token = localStorage.getItem('accessToken');

    try {
      const res = await fetch(`${API_BASE_URL}/files/upload`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData
      });
      const json = await res.json();
      return json;
    } catch (err) {
      // Mock File Upload Response
      await new Promise(r => setTimeout(r, 400));
      return {
        success: true,
        message: "File uploaded successfully (Mock Mode)",
        data: {
          url: URL.createObjectURL(file)
        },
        timestamp: new Date().toISOString()
      };
    }
  }
};

export default apiService;

