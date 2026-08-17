/**
 * ZEBR Market - Spring Boot REST API Service
 * Backend API Base URL: https://zebr-market-backend-production.up.railway.app/api/v1
 * OpenAPI/Swagger Doc: https://zebr-market-backend-production.up.railway.app/api/v1/swagger-ui/index.html#/
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL || (import.meta.env.DEV ? '/api/v1' : 'https://zebr-market-backend-production.up.railway.app/api/v1');

/**
 * Normalizes product object returned from Spring Boot backend
 * ensuring seamless compatibility with all frontend UI components.
 */
export function normalizeProduct(prod) {
  if (!prod) return prod;

  const imagesList = Array.isArray(prod.images) ? prod.images : [];
  const primaryObj = imagesList.find(img => img.primary) || imagesList[0];
  const primaryImg = primaryObj?.imageUrl || prod.image || (Array.isArray(prod.imageUrls) ? prod.imageUrls[0] : null);
  const fallbackImg = 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=600&auto=format&fit=crop';

  const categoryObj = typeof prod.category === 'object' ? prod.category : null;
  const categorySlug = categoryObj?.slug || prod.category || prod.categorySlug || 'digital';
  const categoryId = categoryObj?.id || prod.categoryId || 1;
  const categoryName = categoryObj?.name || prod.categoryName || 'Rəqəmsal';

  return {
    ...prod,
    id: prod.id,
    name: prod.title || prod.name || '',
    title: prod.title || prod.name || '',
    slug: prod.slug || '',
    description: prod.description || '',
    shortDescription: prod.description || '',
    fullDescription: prod.description || '',
    price: typeof prod.discountedPrice === 'number' && prod.discountedPrice > 0 ? prod.discountedPrice : (prod.price || 0),
    originalPrice: prod.price || 0,
    oldPrice: (prod.discountPercentage && prod.discountPercentage > 0 && prod.price)
      ? prod.price
      : (prod.oldPrice || null),
    discountPercentage: prod.discountPercentage || 0,
    discountedPrice: prod.discountedPrice ?? prod.price ?? 0,
    stockQuantity: prod.stockQuantity ?? prod.stock ?? 50,
    status: prod.status || 'ACTIVE',
    category: categorySlug,
    categoryId: categoryId,
    categoryName: categoryName,
    image: primaryImg || fallbackImg,
    images: imagesList,
    imageUrls: imagesList.length > 0 ? imagesList.map(i => i.imageUrl) : (prod.imageUrls || [primaryImg || fallbackImg]),
    duration: prod.duration || '1 ay',
    rating: prod.rating || 5.0,
    ratingCount: prod.ratingCount || 12,
    createdAt: prod.createdAt,
    updatedAt: prod.updatedAt
  };
}

/**
 * Normalizes category object from Spring Boot backend
 */
export function normalizeCategory(cat) {
  if (!cat) return cat;
  return {
    ...cat,
    id: cat.id,
    name: cat.name || '',
    slug: cat.slug || (cat.name ? cat.name.toLowerCase().replace(/\s+/g, '-') : ''),
    description: cat.description || '',
    icon: cat.iconUrl || cat.icon || 'Tv',
    iconUrl: cat.iconUrl || cat.icon || 'Tv',
    parentId: cat.parentId || null,
    subCategories: cat.subCategories || []
  };
}

/**
 * Custom Fetch Helper with Bearer Auth Header and Auto Token Refresh
 */
async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;

  const headers = {
    'Accept': 'application/json',
    ...options.headers
  };

  // If body is not FormData, default to application/json
  if (options.body && !(options.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  // Attach JWT Bearer Token if available
  const token = localStorage.getItem('accessToken');
  if (token && token !== 'undefined' && token !== 'null') {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers
  };

  try {
    let response = await fetch(url, config);

    // If 401 Unauthorized, attempt refresh token once
    if (response.status === 401 && !options._retry) {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken && refreshToken !== 'undefined' && refreshToken !== 'null') {
        options._retry = true;
        try {
          const refreshRes = await fetch(`${BASE_URL}/auth/refresh-token`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken })
          });

          if (refreshRes.ok) {
            const refreshData = await refreshRes.json();
            const newToken = refreshData.data?.accessToken || refreshData.accessToken;
            if (newToken) {
              localStorage.setItem('accessToken', newToken);
              headers['Authorization'] = `Bearer ${newToken}`;
              response = await fetch(url, { ...options, headers });
            }
          } else {
            // Token refresh failed, clear local auth
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
          }
        } catch (e) {
          // Token refresh network error
        }
      }
    }

    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch (e) {
        // Response was not JSON
      }
      throw new Error(errorMessage);
    }

    // Handle 204 No Content
    if (response.status === 204) {
      return { success: true, data: null };
    }

    const json = await response.json();
    return json;
  } catch (error) {
    console.error(`API Error [${options.method || 'GET'} ${endpoint}]:`, error);
    throw error;
  }
}

export const apiService = {
  // -------------------------------------------------------------
  // AUTH ENDPOINTS (/auth)
  // -------------------------------------------------------------

  /**
   * Login user with email and password
   * POST /auth/login
   */
  async login({ email, password }) {
    const res = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });

    const data = res.data || {};
    if (data.accessToken) {
      localStorage.setItem('accessToken', data.accessToken);
    }
    if (data.refreshToken) {
      localStorage.setItem('refreshToken', data.refreshToken);
    }

    const fullName = `${data.firstName || ''} ${data.lastName || ''}`.trim() || data.email || email;
    const roles = data.roles || ['ROLE_USER'];
    const mainRole = roles.includes('ROLE_ADMIN') ? 'ROLE_ADMIN' : 'ROLE_USER';

    const userObj = {
      id: data.id || Date.now(),
      email: data.email || email,
      name: fullName,
      fullName: fullName,
      firstName: data.firstName || '',
      lastName: data.lastName || '',
      role: mainRole,
      roles: roles,
      accessToken: data.accessToken
    };

    return {
      ...res,
      user: userObj,
      data: {
        ...data,
        user: userObj
      }
    };
  },

  /**
   * Register a new user account
   * POST /auth/register
   */
  async register({ name, email, password, firstName, lastName }) {
    let fName = firstName;
    let lName = lastName;

    if (!fName && name) {
      const parts = name.trim().split(/\s+/);
      fName = parts[0] || 'User';
      lName = parts.slice(1).join(' ') || 'ZEBR';
    }

    const res = await request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        email,
        password,
        firstName: fName || 'User',
        lastName: lName || 'ZEBR'
      })
    });

    const data = res.data || {};
    if (data.accessToken) {
      localStorage.setItem('accessToken', data.accessToken);
    }
    if (data.refreshToken) {
      localStorage.setItem('refreshToken', data.refreshToken);
    }

    const fullName = `${data.firstName || fName || ''} ${data.lastName || lName || ''}`.trim() || email;
    const roles = data.roles || ['ROLE_USER'];
    const mainRole = roles.includes('ROLE_ADMIN') ? 'ROLE_ADMIN' : 'ROLE_USER';

    const userObj = {
      id: data.id || Date.now(),
      email: data.email || email,
      name: fullName,
      fullName: fullName,
      firstName: data.firstName || fName || '',
      lastName: data.lastName || lName || '',
      role: mainRole,
      roles: roles,
      accessToken: data.accessToken
    };

    return {
      ...res,
      user: userObj,
      data: {
        ...data,
        user: userObj
      }
    };
  },

  /**
   * Refresh access token
   * POST /auth/refresh-token
   */
  async refreshToken(refreshToken) {
    const res = await request('/auth/refresh-token', {
      method: 'POST',
      body: JSON.stringify({ refreshToken })
    });
    if (res.data?.accessToken) {
      localStorage.setItem('accessToken', res.data.accessToken);
    }
    return res;
  },

  // -------------------------------------------------------------
  // USER PROFILE ENDPOINTS (/users)
  // -------------------------------------------------------------

  /**
   * Get authenticated user profile
   * GET /users/me
   */
  async getMe() {
    const res = await request('/users/me');
    if (res.data) {
      const data = res.data;
      const fullName = `${data.firstName || ''} ${data.lastName || ''}`.trim() || data.email;
      res.data.name = fullName;
      res.data.fullName = fullName;
    }
    return res;
  },

  /**
   * Update current user profile
   * PUT /users/me
   */
  async updateMe(profileData) {
    return await request('/users/me', {
      method: 'PUT',
      body: JSON.stringify(profileData)
    });
  },

  /**
   * Change current user password
   * POST /users/me/change-password
   */
  async changePassword({ currentPassword, newPassword }) {
    return await request('/users/me/change-password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword })
    });
  },

  /**
   * Assign role to user (Admin only)
   * PUT /users/admin/{userId}/role?roleName={roleName}
   */
  async updateUserRole(userId, roleName) {
    return await request(`/users/admin/${userId}/role?roleName=${encodeURIComponent(roleName)}`, {
      method: 'PUT'
    });
  },

  /**
   * Get all users in system (Admin only)
   * Fallback for Admin page user list
   */
  async getAllUsersAdmin() {
    try {
      const meRes = await this.getMe();
      if (meRes.data) {
        return {
          success: true,
          data: {
            content: [meRes.data]
          }
        };
      }
    } catch (e) {}
    return { success: true, data: { content: [] } };
  },

  // -------------------------------------------------------------
  // PRODUCTS ENDPOINTS (/products)
  // -------------------------------------------------------------

  /**
   * Get paginated list of products with filters
   * GET /products
   */
  async getProducts(params = {}) {
    const queryParams = new URLSearchParams();
    if (params.search) queryParams.append('search', params.search);
    if (params.categoryId) queryParams.append('categoryId', params.categoryId);
    if (params.status) queryParams.append('status', params.status);
    if (params.minPrice !== undefined) queryParams.append('minPrice', params.minPrice);
    if (params.maxPrice !== undefined) queryParams.append('maxPrice', params.maxPrice);
    if (params.page !== undefined) queryParams.append('page', params.page);
    if (params.size !== undefined) queryParams.append('size', params.size);
    if (params.sort) queryParams.append('sort', params.sort);

    const queryString = queryParams.toString();
    const endpoint = `/products${queryString ? '?' + queryString : ''}`;
    const res = await request(endpoint);

    if (res.data) {
      if (Array.isArray(res.data.content)) {
        res.data.content = res.data.content.map(normalizeProduct);
      } else if (Array.isArray(res.data)) {
        const normalized = res.data.map(normalizeProduct);
        res.data = { content: normalized };
      }
    }

    return res;
  },

  /**
   * Get product by ID
   * GET /products/{id}
   */
  async getProductById(id) {
    const res = await request(`/products/${id}`);
    if (res.data) {
      res.data = normalizeProduct(res.data);
    }
    return res;
  },

  /**
   * Get product by unique slug
   * GET /products/slug/{slug}
   */
  async getProductBySlug(slug) {
    const res = await request(`/products/slug/${encodeURIComponent(slug)}`);
    if (res.data) {
      res.data = normalizeProduct(res.data);
    }
    return res;
  },

  /**
   * Create product (Admin only)
   * POST /products
   */
  async createProduct(productData) {
    const payload = {
      title: productData.title || productData.name,
      description: productData.description || productData.shortDescription || '',
      price: Number(productData.price || 0),
      discountPercentage: Number(productData.discountPercentage || 0),
      stockQuantity: Number(productData.stockQuantity || productData.stock || 50),
      categoryId: Number(productData.categoryId || 1),
      status: productData.status || 'ACTIVE',
      imageUrls: Array.isArray(productData.imageUrls) && productData.imageUrls.length > 0
        ? productData.imageUrls
        : [productData.image || 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=600&auto=format&fit=crop']
    };

    const res = await request('/products', {
      method: 'POST',
      body: JSON.stringify(payload)
    });

    if (res.data) {
      res.data = normalizeProduct(res.data);
    }
    return res;
  },

  /**
   * Update product by ID (Admin only)
   * PUT /products/{id}
   */
  async updateProduct(id, productData) {
    const payload = {
      title: productData.title || productData.name,
      description: productData.description || productData.shortDescription || '',
      price: Number(productData.price || 0),
      discountPercentage: Number(productData.discountPercentage || 0),
      stockQuantity: Number(productData.stockQuantity || productData.stock || 50),
      categoryId: Number(productData.categoryId || 1),
      status: productData.status || 'ACTIVE',
      imageUrls: Array.isArray(productData.imageUrls) && productData.imageUrls.length > 0
        ? productData.imageUrls
        : [productData.image || 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=600&auto=format&fit=crop']
    };

    const res = await request(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload)
    });

    if (res.data) {
      res.data = normalizeProduct(res.data);
    }
    return res;
  },

  /**
   * Delete product by ID (Admin only)
   * DELETE /products/{id}
   */
  async deleteProduct(id) {
    return await request(`/products/${id}`, {
      method: 'DELETE'
    });
  },

  // -------------------------------------------------------------
  // CATEGORIES ENDPOINTS (/categories)
  // -------------------------------------------------------------

  /**
   * Get all categories
   * GET /categories
   */
  async getCategories() {
    const res = await request('/categories');
    if (res.data && Array.isArray(res.data)) {
      res.data = res.data.map(normalizeCategory);
    }
    return res;
  },

  /**
   * Get root level categories
   * GET /categories/roots
   */
  async getCategoryRoots() {
    const res = await request('/categories/roots');
    if (res.data && Array.isArray(res.data)) {
      res.data = res.data.map(normalizeCategory);
    }
    return res;
  },

  /**
   * Get category by ID
   * GET /categories/{id}
   */
  async getCategoryById(id) {
    const res = await request(`/categories/${id}`);
    if (res.data) {
      res.data = normalizeCategory(res.data);
    }
    return res;
  },

  /**
   * Get category by slug
   * GET /categories/slug/{slug}
   */
  async getCategoryBySlug(slug) {
    const res = await request(`/categories/slug/${encodeURIComponent(slug)}`);
    if (res.data) {
      res.data = normalizeCategory(res.data);
    }
    return res;
  },

  /**
   * Create category (Admin only)
   * POST /categories
   */
  async createCategory(categoryData) {
    const payload = {
      name: categoryData.name,
      description: categoryData.description || '',
      iconUrl: categoryData.iconUrl || categoryData.icon || 'Tv',
      parentId: categoryData.parentId || null
    };

    const res = await request('/categories', {
      method: 'POST',
      body: JSON.stringify(payload)
    });

    if (res.data) {
      res.data = normalizeCategory(res.data);
    }
    return res;
  },

  /**
   * Update category by ID (Admin only)
   * PUT /categories/{id}
   */
  async updateCategory(id, categoryData) {
    const payload = {
      name: categoryData.name,
      description: categoryData.description || '',
      iconUrl: categoryData.iconUrl || categoryData.icon || 'Tv',
      parentId: categoryData.parentId || null
    };

    const res = await request(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload)
    });

    if (res.data) {
      res.data = normalizeCategory(res.data);
    }
    return res;
  },

  /**
   * Delete category by ID (Admin only)
   * DELETE /categories/{id}
   */
  async deleteCategory(id) {
    return await request(`/categories/${id}`, {
      method: 'DELETE'
    });
  },

  // -------------------------------------------------------------
  // CART ENDPOINTS (/cart)
  // -------------------------------------------------------------

  /**
   * Get user shopping cart
   * GET /cart
   */
  async getCart() {
    return await request('/cart');
  },

  /**
   * Add item to shopping cart
   * POST /cart
   */
  async addToCart({ productId, quantity = 1 }) {
    return await request('/cart', {
      method: 'POST',
      body: JSON.stringify({ productId, quantity })
    });
  },

  /**
   * Update item quantity in shopping cart
   * PUT /cart/items/{cartItemId}?quantity={quantity}
   */
  async updateCartItem(cartItemId, quantity) {
    return await request(`/cart/items/${cartItemId}?quantity=${quantity}`, {
      method: 'PUT'
    });
  },

  /**
   * Remove item from shopping cart
   * DELETE /cart/items/{cartItemId}
   */
  async removeFromCartItem(cartItemId) {
    return await request(`/cart/items/${cartItemId}`, {
      method: 'DELETE'
    });
  },

  /**
   * Clear all items from shopping cart
   * DELETE /cart
   */
  async clearCart() {
    return await request('/cart', {
      method: 'DELETE'
    });
  },

  // -------------------------------------------------------------
  // WISHLIST ENDPOINTS (/wishlist)
  // -------------------------------------------------------------

  /**
   * Get user wishlist
   * GET /wishlist
   */
  async getWishlist() {
    const res = await request('/wishlist');
    if (res.data?.products && Array.isArray(res.data.products)) {
      res.data.products = res.data.products.map(normalizeProduct);
    }
    return res;
  },

  /**
   * Add product to wishlist
   * POST /wishlist/{productId}
   */
  async addToWishlist(productId) {
    const res = await request(`/wishlist/${productId}`, {
      method: 'POST'
    });
    if (res.data?.products && Array.isArray(res.data.products)) {
      res.data.products = res.data.products.map(normalizeProduct);
    }
    return res;
  },

  /**
   * Remove product from wishlist
   * DELETE /wishlist/{productId}
   */
  async removeFromWishlist(productId) {
    const res = await request(`/wishlist/${productId}`, {
      method: 'DELETE'
    });
    if (res.data?.products && Array.isArray(res.data.products)) {
      res.data.products = res.data.products.map(normalizeProduct);
    }
    return res;
  },

  // -------------------------------------------------------------
  // ORDERS ENDPOINTS (/orders)
  // -------------------------------------------------------------

  /**
   * Get user order history
   * GET /orders
   */
  async getOrders(params = {}) {
    const queryParams = new URLSearchParams();
    if (params.page !== undefined) queryParams.append('page', params.page);
    if (params.size !== undefined) queryParams.append('size', params.size);
    if (params.sort) queryParams.append('sort', params.sort);

    const queryString = queryParams.toString();
    const endpoint = `/orders${queryString ? '?' + queryString : ''}`;
    return await request(endpoint);
  },

  /**
   * Create order from cart (Checkout)
   * POST /orders
   */
  async createOrder(orderData = {}) {
    let paymentMethod = 'CARD';
    if (orderData.paymentMethod) {
      const pm = String(orderData.paymentMethod).toUpperCase();
      if (pm.includes('EMANAT') || pm.includes('E_MANAT') || pm.includes('MILLI')) {
        paymentMethod = 'E_MANAT';
      } else {
        paymentMethod = 'CARD';
      }
    }

    const res = await request('/orders', {
      method: 'POST',
      body: JSON.stringify({ paymentMethod })
    });

    const orderId = res.data?.orderNumber || (res.data?.id ? `ORD-${res.data.id}` : `ORD-${Date.now()}`);

    return {
      ...res,
      orderId: orderId,
      total: res.data?.totalAmount || orderData.total || 0,
      data: {
        ...res.data,
        orderId: orderId
      }
    };
  },

  /**
   * Alias for checkout (matches frontend Cart component call)
   */
  async checkout(orderData = {}) {
    return await this.createOrder(orderData);
  },

  /**
   * Get order by ID
   * GET /orders/{id}
   */
  async getOrderById(id) {
    return await request(`/orders/${id}`);
  },

  /**
   * Get order by order number
   * GET /orders/number/{orderNumber}
   */
  async getOrderByNumber(orderNumber) {
    return await request(`/orders/number/${encodeURIComponent(orderNumber)}`);
  },

  /**
   * Cancel an order
   * POST /orders/{id}/cancel
   */
  async cancelOrder(id) {
    return await request(`/orders/${id}/cancel`, {
      method: 'POST'
    });
  },

  /**
   * Get all orders in system (Admin only)
   * GET /orders/admin/all
   */
  async getAllOrdersAdmin(params = {}) {
    const queryParams = new URLSearchParams();
    if (params.page !== undefined) queryParams.append('page', params.page);
    if (params.size !== undefined) queryParams.append('size', params.size);
    if (params.sort) queryParams.append('sort', params.sort);

    const queryString = queryParams.toString();
    const endpoint = `/orders/admin/all${queryString ? '?' + queryString : ''}`;
    return await request(endpoint);
  },

  /**
   * Update order status (Admin only)
   * PUT /orders/admin/{id}/status?status={status}
   */
  async updateOrderStatusAdmin(id, status) {
    return await request(`/orders/admin/${id}/status?status=${encodeURIComponent(status)}`, {
      method: 'PUT'
    });
  },

  // -------------------------------------------------------------
  // FILE UPLOAD ENDPOINT (/files)
  // -------------------------------------------------------------

  /**
   * Upload image or file (Admin only)
   * POST /files/upload
   */
  async uploadFile(file) {
    const formData = new FormData();
    formData.append('file', file);

    return await request('/files/upload', {
      method: 'POST',
      body: formData
    });
  }
};

export default apiService;
