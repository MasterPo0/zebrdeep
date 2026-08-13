import { products } from '../data/products';
import { categories } from '../data/categories';

// Simulated API delay for asynchronous behavior
const delay = (ms = 150) => new Promise(resolve => setTimeout(resolve, ms));

export const apiService = {
  // Products API
  async getProducts(params = {}) {
    await delay();
    let result = [...products];

    if (params.category) {
      result = result.filter(p => p.category === params.category);
    }

    if (params.search) {
      const q = params.search.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.shortDescription.toLowerCase().includes(q) ||
        p.categoryName.toLowerCase().includes(q)
      );
    }

    if (params.minPrice) {
      result = result.filter(p => p.price >= Number(params.minPrice));
    }

    if (params.maxPrice) {
      result = result.filter(p => p.price <= Number(params.maxPrice));
    }

    if (params.sortBy) {
      if (params.sortBy === 'price-asc') result.sort((a, b) => a.price - b.price);
      if (params.sortBy === 'price-desc') result.sort((a, b) => b.price - a.price);
      if (params.sortBy === 'rating') result.sort((a, b) => b.rating - a.rating);
      if (params.sortBy === 'newest') result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
      if (params.sortBy === 'popular') result.sort((a, b) => b.ratingCount - a.ratingCount);
    }

    return {
      data: result,
      total: result.length,
      status: 200
    };
  },

  async getProductById(id) {
    await delay();
    const product = products.find(p => p.id === Number(id));
    if (!product) {
      throw new Error("Məhsul tapılmadı");
    }
    return { data: product, status: 200 };
  },

  async getProductBySlug(slug) {
    await delay();
    const product = products.find(p => p.slug === slug);
    if (!product) {
      throw new Error("Məhsul tapılmadı");
    }
    return { data: product, status: 200 };
  },

  // Categories API
  async getCategories() {
    await delay();
    return { data: categories, status: 200 };
  },

  async getCategoryBySlug(slug) {
    await delay();
    const category = categories.find(c => c.slug === slug || c.id === slug);
    if (!category) {
      throw new Error("Kateqoriya tapılmadı");
    }
    return { data: category, status: 200 };
  },

  // Cart & Checkout API (Spring Boot ready)
  async checkout(orderData) {
    await delay(600);
    return {
      success: true,
      orderId: `ZEBR-${Math.floor(100000 + Math.random() * 900000)}`,
      message: "Sifarişiniz uğurla rəsmiləşdirildi!",
      timestamp: new Date().toISOString()
    };
  },

  // Auth API
  async login(credentials) {
    await delay(400);
    if (credentials.email && credentials.password) {
      return {
        user: {
          id: "usr_10293",
          name: "Elvin Məmmədov",
          email: credentials.email,
          avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop"
        },
        token: "jwt_mock_token_zebr_2026",
        status: 200
      };
    }
    throw new Error("E-poçt və ya şifrə yanlışdır");
  },

  async register(userData) {
    await delay(500);
    return {
      user: {
        id: `usr_${Math.floor(Math.random() * 100000)}`,
        name: userData.name,
        email: userData.email
      },
      token: "jwt_mock_token_zebr_2026",
      status: 201
    };
  }
};
