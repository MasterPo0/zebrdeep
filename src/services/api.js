const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://zebr-market-backend-production.up.railway.app/api/v1';

<<<<<<< HEAD
// Helper to normalize product response objects for UI compatibility
function normalizeProduct(p) {
  if (!p) return null;
  const image = (p.images && p.images.length > 0 && p.images[0].imageUrl && p.images[0].imageUrl !== 'string')
    ? p.images[0].imageUrl
    : (p.image || 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=600&auto=format&fit=crop');
=======
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://zebr-market-backend-production.up.railway.app/api/v1';
>>>>>>> 7c5976914b1f7e85a108cb590d723896467c89bf

  const oldPrice = (p.discountPercentage > 0 && p.price > 0)
    ? p.price
    : (p.oldPrice || null);

  const price = (p.discountedPrice !== undefined && p.discountedPrice !== null && p.discountPercentage > 0)
    ? p.discountedPrice
    : p.price;

  const discount = p.discountPercentage > 0 ? `-${Math.round(p.discountPercentage)}%` : p.discount;

  return {
    id: p.id,
    name: p.title || p.name || 'Rəqəmsal Məhsul',
    title: p.title || p.name || 'Rəqəmsal Məhsul',
    slug: p.slug || (p.title || p.name || '').toLowerCase().replace(/\s+/g, '-'),
    shortDescription: p.description || p.shortDescription || '',
    fullDescription: p.description || p.fullDescription || p.shortDescription || '',
    description: p.description || p.shortDescription || '',
    price: Number(price || 0),
    oldPrice: oldPrice ? Number(oldPrice) : null,
    discount: discount || null,
    category: p.category?.slug || p.category?.id || p.category || 'general',
    categoryName: p.category?.name || p.categoryName || 'Rəqəmsal',
    categoryId: p.category?.id || p.categoryId || null,
    duration: p.duration || '1 ay',
    rating: p.rating || 5.0,
    ratingCount: p.ratingCount || 1,
    stock: p.stockQuantity ?? p.stock ?? 50,
    stockQuantity: p.stockQuantity ?? p.stock ?? 50,
    instantDelivery: p.instantDelivery !== false,
    status: p.status || 'ACTIVE',
    image: image,
    images: p.images || [{ imageUrl: image }],
    createdAt: p.createdAt || new Date().toISOString()
  };
}

// Helper to normalize category response objects for UI compatibility
function normalizeCategory(c) {
  if (!c) return null;
  return {
    id: c.id,
    slug: c.slug || String(c.id),
    name: c.name || 'Kateqoriya',
    description: c.description || '',
    icon: (c.iconUrl && c.iconUrl !== 'string') ? c.iconUrl : (c.icon || 'Grid'),
    productCount: c.productCount || 0,
    featured: c.featured !== false,
    parentId: c.parentId || null,
    subCategories: c.subCategories || []
  };
}

// Helper to make API requests with Authorization header
async function request(endpoint, options = {}) {
  const token = localStorage.getItem('accessToken');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers
  });
  
  const json = await response.json();
  if (!response.ok || json.success === false) {
    throw new Error(json.message || 'API Request Failed');
  }
  return json;
}

export const apiService = {
  // 1. AUTH MODULE (/auth)
  async register(data) {
    return request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  async login(credentials) {
    return request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
  },

  async refreshToken(refreshToken) {
    return request('/auth/refresh-token', {
      method: 'POST',
      body: JSON.stringify({ refreshToken })
    });
  },

  // 2. USER MODULE (/users)
  async getMe() {
    return request('/users/me', { method: 'GET' });
  },

  async updateProfile(data) {
    return request('/users/me', {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },

  async changePassword(data) {
    return request('/users/me/change-password', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  async updateUserRole(userId, roleName) {
    return request(`/users/admin/${userId}/role?roleName=${roleName}`, {
      method: 'PUT'
    });
  },

  async getAllUsersAdmin() {
    return request('/users/admin/all', { method: 'GET' });
  },

  // 3. PRODUCTS MODULE (/products)
  async getProducts(params = {}) {
    const query = new URLSearchParams(params).toString();
    const json = await request(`/products${query ? '?' + query : ''}`, { method: 'GET' });
    const rawContent = json.data?.content || (Array.isArray(json.data) ? json.data : []);
    const normalized = rawContent.map(normalizeProduct);
    return {
      ...json,
      data: {
        content: normalized,
        pageNumber: json.data?.pageNumber || 0,
        pageSize: json.data?.pageSize || 12,
        totalElements: json.data?.totalElements || normalized.length,
        totalPages: json.data?.totalPages || 1,
        last: json.data?.last ?? true
      }
    };
  },

  async getProductById(id) {
    const json = await request(`/products/${id}`, { method: 'GET' });
    return {
      ...json,
      data: normalizeProduct(json.data)
    };
  },

  async getProductBySlug(slug) {
    const json = await request(`/products/slug/${slug}`, { method: 'GET' });
    return {
      ...json,
      data: normalizeProduct(json.data)
    };
  },

  async createProduct(productData) {
    const payload = {
      title: productData.name || productData.title,
      description: productData.shortDescription || productData.description || '',
      price: Number(productData.price),
      discountPercentage: (productData.oldPrice && Number(productData.oldPrice) > Number(productData.price))
        ? Math.round(((Number(productData.oldPrice) - Number(productData.price)) / Number(productData.oldPrice)) * 100)
        : 0,
      stockQuantity: Number(productData.stockQuantity || productData.stock || 10),
      status: productData.status || 'ACTIVE',
      categoryId: productData.categoryId ? Number(productData.categoryId) : undefined,
      images: productData.image ? [{ imageUrl: productData.image, primary: true }] : []
    };
    const json = await request('/products', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    return {
      ...json,
      data: normalizeProduct(json.data)
    };
  },

  async updateProduct(id, productData) {
    const payload = {
      title: productData.name || productData.title,
      description: productData.shortDescription || productData.description || '',
      price: Number(productData.price),
      discountPercentage: (productData.oldPrice && Number(productData.oldPrice) > Number(productData.price))
        ? Math.round(((Number(productData.oldPrice) - Number(productData.price)) / Number(productData.oldPrice)) * 100)
        : 0,
      stockQuantity: Number(productData.stockQuantity || productData.stock || 10),
      status: productData.status || 'ACTIVE',
      categoryId: productData.categoryId ? Number(productData.categoryId) : undefined
    };
    const json = await request(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload)
    });
    return {
      ...json,
      data: normalizeProduct(json.data)
    };
  },

  async deleteProduct(id) {
    return request(`/products/${id}`, { method: 'DELETE' });
  },

  // 4. CATEGORIES MODULE (/categories)
  async getCategories() {
    const json = await request('/categories', { method: 'GET' });
    const rawList = Array.isArray(json.data) ? json.data : [];
    return {
      ...json,
      data: rawList.map(normalizeCategory)
    };
  },

  async getRootCategories() {
    const json = await request('/categories/roots', { method: 'GET' });
    const rawList = Array.isArray(json.data) ? json.data : [];
    return {
      ...json,
      data: rawList.map(normalizeCategory)
    };
  },

  async getCategoryById(id) {
    const json = await request(`/categories/${id}`, { method: 'GET' });
    return {
      ...json,
      data: normalizeCategory(json.data)
    };
  },

  async getCategoryBySlug(slug) {
    const json = await request(`/categories/slug/${slug}`, { method: 'GET' });
    return {
      ...json,
      data: normalizeCategory(json.data)
    };
  },

  async createCategory(categoryData) {
    const payload = {
      name: categoryData.name,
      description: categoryData.description || '',
      iconUrl: categoryData.icon || categoryData.iconUrl || 'Grid',
      parentId: categoryData.parentId || null
    };
    const json = await request('/categories', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    return {
      ...json,
      data: normalizeCategory(json.data)
    };
  },

  async updateCategory(id, categoryData) {
    const payload = {
      name: categoryData.name,
      description: categoryData.description || '',
      iconUrl: categoryData.icon || categoryData.iconUrl || 'Grid',
      parentId: categoryData.parentId || null
    };
    const json = await request(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload)
    });
    return {
      ...json,
      data: normalizeCategory(json.data)
    };
  },

  async deleteCategory(id) {
    return request(`/categories/${id}`, { method: 'DELETE' });
  },

  // 5. CART MODULE (/cart)
  async getCart() {
    return request('/cart', { method: 'GET' });
  },

  async addToCart(productId, quantity = 1) {
    return request('/cart', {
      method: 'POST',
      body: JSON.stringify({ productId, quantity })
    });
  },

  async updateCartItem(cartItemId, quantity) {
    return request(`/cart/items/${cartItemId}?quantity=${quantity}`, {
      method: 'PUT'
    });
  },

  async removeCartItem(cartItemId) {
    return request(`/cart/items/${cartItemId}`, {
      method: 'DELETE'
    });
  },

  async clearCart() {
    return request('/cart', { method: 'DELETE' });
  },

  // 6. ORDERS MODULE (/orders)
  async checkout(orderData) {
    return request('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData)
    });
  },

  async getOrders(params = {}) {
    return request('/orders', { method: 'GET' });
  },

  async getOrderById(id) {
    return request(`/orders/${id}`, { method: 'GET' });
  },

  async getOrderByNumber(orderNumber) {
    return request(`/orders/number/${orderNumber}`, { method: 'GET' });
  },

  async cancelOrder(id) {
    return request(`/orders/${id}/cancel`, { method: 'POST' });
  },

  async getAllOrdersAdmin() {
    return request('/orders/admin/all', { method: 'GET' });
  },

  async updateOrderStatusAdmin(id, status) {
    return request(`/orders/admin/${id}/status?status=${status}`, {
      method: 'PUT'
    });
  },

  // 7. WISHLIST MODULE (/wishlist)
  async getWishlist() {
    return request('/wishlist', { method: 'GET' });
  },

  async addToWishlist(productId) {
    return request(`/wishlist/${productId}`, { method: 'POST' });
  },

  async removeFromWishlist(productId) {
    return request(`/wishlist/${productId}`, { method: 'DELETE' });
  },

  // 8. FILE UPLOAD MODULE (/files)
  async uploadFile(file) {
    const formData = new FormData();
    formData.append('file', file);
    const token = localStorage.getItem('accessToken');

    const res = await fetch(`${API_BASE_URL}/files/upload`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData
    });
    return res.json();
  }
};

export default apiService;
