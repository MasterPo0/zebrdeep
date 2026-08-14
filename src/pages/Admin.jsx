import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Package, 
  FolderTree, 
  ShoppingBag, 
  Users, 
  Upload, 
  Plus, 
  Edit3, 
  Trash2, 
  Check, 
  X, 
  ShieldCheck, 
  Coins, 
  Search, 
  Sparkles,
  ArrowRight,
  Lock,
  Mail,
  RefreshCw,
  SlidersHorizontal,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/api';
import { formatCurrency } from '../utils/formatCurrency';
import { zebrLaptop, zebrThumbsup } from '../assets/mascot';

export const Admin = () => {
  const { user, login, isAdmin, toggleRole } = useAuth();
  const navigate = useNavigate();

  // Admin Navigation Tabs
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'products', 'categories', 'orders', 'users', 'files'

  // Admin Login State (if unauthenticated or not admin)
  const [adminEmail, setAdminEmail] = useState('admin@zebr.az');
  const [adminPassword, setAdminPassword] = useState('admin123');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Data States
  const [productsList, setProductsList] = useState([]);
  const [categoriesList, setCategoriesList] = useState([]);
  const [ordersList, setOrdersList] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [loadingData, setLoadingData] = useState(false);

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');

  // Modals State
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '',
    category: 'streaming',
    price: '',
    oldPrice: '',
    stockQuantity: 50,
    duration: '1 ay',
    shortDescription: '',
    fullDescription: '',
    image: '',
    status: 'ACTIVE'
  });

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    slug: '',
    description: '',
    icon: 'Tv',
    parentId: null
  });

  // Upload File State
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState('');

  // Load Data
  const loadAdminData = async () => {
    setLoadingData(true);
    try {
      const [prodRes, catRes, ordRes, usrRes] = await Promise.all([
        apiService.getProducts({ size: 100 }),
        apiService.getCategories(),
        apiService.getAllOrdersAdmin(),
        apiService.getAllUsersAdmin()
      ]);

      if (prodRes.data?.content) setProductsList(prodRes.data.content);
      if (catRes.data) setCategoriesList(catRes.data);
      if (ordRes.data?.content) setOrdersList(ordRes.data.content);
      if (usrRes.data) setUsersList(usrRes.data);
    } catch (err) {
      console.error("Admin data load error:", err);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      loadAdminData();
    }
  }, [isAdmin]);

  // Handle Admin Quick Login
  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError('');
    try {
      const res = await apiService.login({ email: adminEmail, password: adminPassword });
      login({ ...res.user, role: 'ROLE_ADMIN', roles: ['ROLE_ADMIN'] });
    } catch (err) {
      setLoginError(err.message || 'Giriş zamanı xəta baş verdi');
    } finally {
      setLoginLoading(false);
    }
  };

  // Create or Update Product
  const handleSaveProduct = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await apiService.updateProduct(editingProduct.id, productForm);
      } else {
        await apiService.createProduct(productForm);
      }
      setIsProductModalOpen(false);
      setEditingProduct(null);
      loadAdminData();
    } catch (err) {
      alert("Xəta: " + err.message);
    }
  };

  // Delete Product
  const handleDeleteProduct = async (id) => {
    if (window.confirm("Bu məhsulu silməyə əminsiniz?")) {
      await apiService.deleteProduct(id);
      loadAdminData();
    }
  };

  // Create Category
  const handleSaveCategory = async (e) => {
    e.preventDefault();
    try {
      await apiService.createCategory(categoryForm);
      setIsCategoryModalOpen(false);
      setCategoryForm({ name: '', slug: '', description: '', icon: 'Tv', parentId: null });
      loadAdminData();
    } catch (err) {
      alert("Xəta: " + err.message);
    }
  };

  // Delete Category
  const handleDeleteCategory = async (id) => {
    if (window.confirm("Bu kateqoriyanı silməyə əminsiniz?")) {
      await apiService.deleteCategory(id);
      loadAdminData();
    }
  };

  // Update Order Status
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    await apiService.updateOrderStatusAdmin(orderId, newStatus);
    loadAdminData();
  };

  // Update User Role
  const handleUpdateUserRole = async (userId, newRole) => {
    await apiService.updateUserRole(userId, newRole);
    loadAdminData();
  };

  // Handle File Upload Test
  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;
    setUploadingFile(true);
    try {
      const res = await apiService.uploadFile(selectedFile);
      setUploadedUrl(res.data?.url || '');
    } catch (err) {
      alert("Fayl yüklənməsində xəta");
    } finally {
      setUploadingFile(false);
    }
  };

  // UNAUTHENTICATED OR NON-ADMIN VIEW
  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-4 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-white dark:bg-[#14171D] border border-slate-200 dark:border-slate-800 p-8 sm:p-10 rounded-3xl shadow-2xl space-y-6 text-center"
        >
          <div className="space-y-2">
            <img 
              src={zebrLaptop} 
              alt="ZEBR Admin Laptop Mascot" 
              className="w-28 h-32 object-contain mx-auto filter drop-shadow-lg hover:scale-105 transition-transform" 
            />
            <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-600 dark:text-purple-400 text-xs font-mono font-bold">
              SPRING BOOT ADMIN PANEL
            </span>
            <h1 className="text-2xl font-black">İdarəçi Girişi</h1>
            <p className="text-slate-500 dark:text-slate-400 text-xs">
              Məhsul, kateqoriya, sifarişlər və istifadəçi rollarını idarə etmək üçün sistemə daxil olun.
            </p>
          </div>

          {loginError && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs font-semibold">
              {loginError}
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4 text-xs text-left">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1.5">
                Admin E-poçt *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-4 py-3 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1.5">
                Admin Şifrə *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-4 py-3 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full py-3.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 active:scale-95 transition-all mt-4"
            >
              <span>{loginLoading ? 'Giriş edilir...' : 'Admin Panelə Giriş'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Direct Role Switcher for Test */}
          {user && (
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <p className="text-[11px] text-slate-400">Və ya cari hesabı Admin rejiminə keçirin:</p>
              <button
                onClick={toggleRole}
                className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-bold flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4 text-amber-500" />
                <span>Admin Rejimini Aktiv Et (`ROLE_ADMIN`)</span>
              </button>
            </div>
          )}
        </motion.div>
      </div>
    );
  }

  // ADMIN DASHBOARD MAIN VIEW
  return (
    <div className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      
      {/* Top Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-purple-950 via-slate-900 to-slate-950 text-white border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 z-10">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-300 text-xs font-mono font-bold">
              ROLE_ADMIN MANAGEMENT
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-mono">
              ● Spring Boot REST API
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black">
            ZEBR İdarəetmə Paneli
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm max-w-xl">
            Məhsullar, kateqoriyalar, sifariş statusları, fayllar və istifadəçi rollarının idarə edilməsi.
          </p>
        </div>

        <div className="flex items-center gap-3 z-10">
          <button
            onClick={loadAdminData}
            className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700/60 hover:bg-slate-700 transition-colors text-slate-300 flex items-center gap-2 text-xs font-bold"
            title="Yenilə"
          >
            <RefreshCw className={`w-4 h-4 ${loadingData ? 'animate-spin' : ''}`} />
            <span>Yenilə</span>
          </button>
          <button
            onClick={toggleRole}
            className="px-4 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center gap-2"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>User Rejiminə Keç</span>
          </button>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'overview'
              ? 'bg-purple-600 text-white shadow-md'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>İcmal & Statistika</span>
        </button>

        <button
          onClick={() => setActiveTab('products')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'products'
              ? 'bg-purple-600 text-white shadow-md'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Məhsullar ({productsList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('categories')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'categories'
              ? 'bg-purple-600 text-white shadow-md'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <FolderTree className="w-4 h-4" />
          <span>Kateqoriyalar ({categoriesList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'orders'
              ? 'bg-purple-600 text-white shadow-md'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Sifarişlər ({ordersList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'users'
              ? 'bg-purple-600 text-white shadow-md'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>İstifadəçilər & Rollar ({usersList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('files')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'files'
              ? 'bg-purple-600 text-white shadow-md'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Upload className="w-4 h-4" />
          <span>Fayl Yükləmə</span>
        </button>
      </div>

      {/* TAB CONTENTS */}
      <div className="space-y-8">
        
        {/* 1. OVERVIEW & STATS */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-6 rounded-3xl bg-white dark:bg-[#14171D] border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
                <span className="text-xs text-slate-500 font-mono">Ümumi Gəlir:</span>
                <div className="text-3xl font-black font-mono text-purple-600 dark:text-purple-400">
                  {formatCurrency(ordersList.reduce((acc, o) => acc + (o.totalAmount || o.price || 0), 0))}
                </div>
                <span className="text-[11px] text-emerald-500 block">Spring Boot API live calculation</span>
              </div>

              <div className="p-6 rounded-3xl bg-white dark:bg-[#14171D] border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
                <span className="text-xs text-slate-500 font-mono">Toplam Məhsul:</span>
                <div className="text-3xl font-black font-mono">
                  {productsList.length} ədəd
                </div>
                <span className="text-[11px] text-slate-400 block">Kataloqdakı məhsullar</span>
              </div>

              <div className="p-6 rounded-3xl bg-white dark:bg-[#14171D] border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
                <span className="text-xs text-slate-500 font-mono">Sifariş Sayı:</span>
                <div className="text-3xl font-black font-mono text-amber-500">
                  {ordersList.length} sifariş
                </div>
                <span className="text-[11px] text-slate-400 block">Sistemdəki sənədlər</span>
              </div>

              <div className="p-6 rounded-3xl bg-white dark:bg-[#14171D] border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
                <span className="text-xs text-slate-500 font-mono">Aktiv İstifadəçilər:</span>
                <div className="text-3xl font-black font-mono text-blue-500">
                  {usersList.length} istifadəçi
                </div>
                <span className="text-[11px] text-slate-400 block">Qeydiyyatlı hesablar</span>
              </div>
            </div>

            {/* Quick API Spec Table Overview */}
            <div className="p-6 rounded-3xl bg-white dark:bg-[#14171D] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="font-bold text-base">API Birləşmə Statusu (Spring Boot REST Service)</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                  <span className="text-slate-400">ApiResponse&lt;T&gt; Handler:</span>
                  <p className="font-bold text-emerald-500">✓ Aktiv (success, message, data, timestamp)</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                  <span className="text-slate-400">PageResponse&lt;T&gt; Handler:</span>
                  <p className="font-bold text-emerald-500">✓ Aktiv (content, pageNumber, totalPages)</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. PRODUCTS MANAGEMENT */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Məhsul adı və ya ID axtarın..."
                  className="w-full bg-white dark:bg-[#14171D] border border-slate-200 dark:border-slate-800 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <button
                onClick={() => {
                  setEditingProduct(null);
                  setProductForm({
                    name: '', category: 'streaming', price: '', oldPrice: '',
                    stockQuantity: 50, duration: '1 ay', shortDescription: '', fullDescription: '', image: '', status: 'ACTIVE'
                  });
                  setIsProductModalOpen(true);
                }}
                className="px-5 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Yeni Məhsul Əlavə Et</span>
              </button>
            </div>

            {/* Products Table */}
            <div className="bg-white dark:bg-[#14171D] border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-slate-400 font-mono">
                    <tr>
                      <th className="p-4">ID</th>
                      <th className="p-4">Məhsul</th>
                      <th className="p-4">Kateqoriya</th>
                      <th className="p-4">Qiymət</th>
                      <th className="p-4">Stok</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Əməliyyatlar</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                    {productsList
                      .filter(p => p.name?.toLowerCase().includes(searchQuery.toLowerCase()))
                      .map((prod) => (
                        <tr key={prod.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50">
                          <td className="p-4 font-mono font-bold text-slate-400">#{prod.id}</td>
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <img src={prod.image} alt={prod.name} className="w-10 h-10 rounded-xl object-cover shrink-0" />
                              <div>
                                <span className="font-bold text-slate-900 dark:text-white block line-clamp-1">{prod.name}</span>
                                <span className="text-[10px] text-slate-400 font-mono">{prod.duration}</span>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 font-mono text-slate-500">{prod.categoryName || prod.category}</td>
                          <td className="p-4 font-mono font-bold">{formatCurrency(prod.price)}</td>
                          <td className="p-4 font-mono">{prod.stock || prod.stockQuantity || 50} ədəd</td>
                          <td className="p-4">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              prod.status === 'ACTIVE' ? 'bg-emerald-500/20 text-emerald-500' : 'bg-red-500/20 text-red-500'
                            }`}>
                              {prod.status || 'ACTIVE'}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => {
                                  setEditingProduct(prod);
                                  setProductForm({ ...prod, stockQuantity: prod.stock || 50 });
                                  setIsProductModalOpen(true);
                                }}
                                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300"
                                title="Redaktə et"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(prod.id)}
                                className="p-2 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-600 hover:bg-red-100"
                                title="Sil"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 3. CATEGORIES MANAGEMENT */}
        {activeTab === 'categories' && (
          <div className="space-y-6">
            <div className="flex justify-end">
              <button
                onClick={() => setIsCategoryModalOpen(true)}
                className="px-5 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Yeni Kateqoriya Yarad</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categoriesList.map((cat) => (
                <div key={cat.id} className="p-6 rounded-3xl bg-white dark:bg-[#14171D] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-mono font-bold">
                      {cat.slug}
                    </span>
                    <button
                      onClick={() => handleDeleteCategory(cat.id)}
                      className="p-1.5 rounded-xl text-slate-400 hover:text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold">{cat.name}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">{cat.description}</p>
                  </div>

                  <div className="pt-2 flex justify-between text-xs text-slate-400 font-mono border-t border-slate-100 dark:border-slate-800">
                    <span>Məhsul sayı:</span>
                    <span className="font-bold text-slate-900 dark:text-white">{cat.productCount || 0}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. ORDERS MANAGEMENT */}
        {activeTab === 'orders' && (
          <div className="bg-white dark:bg-[#14171D] border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-slate-400 font-mono">
                  <tr>
                    <th className="p-4">Sifariş №</th>
                    <th className="p-4">Müştəri</th>
                    <th className="p-4">Tarix</th>
                    <th className="p-4">Məbləğ</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Statusu Yenilə</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                  {ordersList.map((ord) => (
                    <tr key={ord.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50">
                      <td className="p-4 font-mono font-bold">{ord.orderNumber || ord.id}</td>
                      <td className="p-4">
                        <span className="font-bold block">{ord.customerName || 'Müştəri'}</span>
                        <span className="text-[10px] text-slate-400">{ord.customerEmail}</span>
                      </td>
                      <td className="p-4 font-mono text-slate-400">{ord.createdAt?.slice(0,10) || new Date().toISOString().slice(0,10)}</td>
                      <td className="p-4 font-mono font-bold">{formatCurrency(ord.totalAmount || ord.price || 0)}</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          ord.status === 'COMPLETED' ? 'bg-emerald-500/20 text-emerald-500' :
                          ord.status === 'CANCELLED' ? 'bg-red-500/20 text-red-500' : 'bg-amber-500/20 text-amber-500'
                        }`}>
                          {ord.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <select
                          value={ord.status}
                          onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value)}
                          className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-900 dark:text-white cursor-pointer font-mono"
                        >
                          <option value="PENDING">PENDING</option>
                          <option value="COMPLETED">COMPLETED</option>
                          <option value="CANCELLED">CANCELLED</option>
                          <option value="SHIPPED">SHIPPED</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 5. USERS & ROLES */}
        {activeTab === 'users' && (
          <div className="bg-white dark:bg-[#14171D] border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-base">İstifadəçi Rollarının İdarə Edilməsi (`/users/admin/{'{userId}'}/role`)</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-slate-400 font-mono">
                  <tr>
                    <th className="p-4">ID</th>
                    <th className="p-4">İstifadəçi</th>
                    <th className="p-4">E-poçt</th>
                    <th className="p-4">Cari Rol</th>
                    <th className="p-4 text-right">Rolu Dəyiş</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                  {usersList.map((usr) => (
                    <tr key={usr.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50">
                      <td className="p-4 font-mono">#{usr.id}</td>
                      <td className="p-4 font-bold">{usr.fullName || usr.firstName}</td>
                      <td className="p-4 font-mono text-slate-400">{usr.email}</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                          usr.role === 'ROLE_ADMIN' ? 'bg-purple-500/20 text-purple-500' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                        }`}>
                          {usr.role || 'ROLE_USER'}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleUpdateUserRole(usr.id, usr.role === 'ROLE_ADMIN' ? 'ROLE_USER' : 'ROLE_ADMIN')}
                          className="px-3 py-1.5 rounded-xl bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 font-bold text-xs"
                        >
                          {usr.role === 'ROLE_ADMIN' ? 'Make User' : 'Make Admin'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 6. FILE UPLOAD */}
        {activeTab === 'files' && (
          <div className="max-w-xl bg-white dark:bg-[#14171D] border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm space-y-6">
            <h3 className="font-bold text-lg">Spring Boot File Upload (`/files/upload`)</h3>
            
            <form onSubmit={handleFileUpload} className="space-y-4">
              <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 p-8 rounded-2xl text-center space-y-3">
                <Upload className="w-10 h-10 text-slate-400 mx-auto" />
                <input
                  type="file"
                  onChange={(e) => setSelectedFile(e.target.files[0])}
                  className="text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-purple-500/10 file:text-purple-600 cursor-pointer"
                />
              </div>

              <button
                type="submit"
                disabled={uploadingFile || !selectedFile}
                className="w-full py-3.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md disabled:opacity-50"
              >
                {uploadingFile ? 'Yüklənir...' : 'Serverə Yüklə'}
              </button>
            </form>

            {uploadedUrl && (
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono space-y-2">
                <span className="text-emerald-500 font-bold">✓ Fayl uğurla yükləndi:</span>
                <a href={uploadedUrl} target="_blank" rel="noreferrer" className="block text-purple-500 underline truncate">
                  {uploadedUrl}
                </a>
              </div>
            )}
          </div>
        )}

      </div>

      {/* CREATE / EDIT PRODUCT MODAL */}
      <AnimatePresence>
        {isProductModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
          >
            <div className="bg-white dark:bg-[#14171D] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-xl w-full space-y-6 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                <h3 className="text-lg font-bold">{editingProduct ? 'Məhsulu Redaktə Et' : 'Yeni Məhsul Əlavə Et'}</h3>
                <button onClick={() => setIsProductModalOpen(false)} className="text-slate-400 hover:text-slate-900 dark:hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold mb-1">Məhsul Adı *</label>
                  <input
                    type="text"
                    required
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold mb-1">Qiymət (AZN) *</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={productForm.price}
                      onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                      className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Köhnə Qiymət (AZN)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={productForm.oldPrice}
                      onChange={(e) => setProductForm({ ...productForm, oldPrice: e.target.value })}
                      className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold mb-1">Kateqoriya</label>
                    <select
                      value={productForm.category}
                      onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                      className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
                    >
                      {categoriesList.map(c => (
                        <option key={c.id} value={c.slug}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Stok Sayı</label>
                    <input
                      type="number"
                      value={productForm.stockQuantity}
                      onChange={(e) => setProductForm({ ...productForm, stockQuantity: e.target.value })}
                      className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold mb-1">Şəkil URL</label>
                  <input
                    type="text"
                    value={productForm.image}
                    onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                    className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Qısa Təsvir</label>
                  <textarea
                    rows="2"
                    value={productForm.shortDescription}
                    onChange={(e) => setProductForm({ ...productForm, shortDescription: e.target.value })}
                    className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsProductModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold"
                  >
                    Ləğv et
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-purple-600 text-white font-bold"
                  >
                    Yadda Saxla
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CREATE CATEGORY MODAL */}
      <AnimatePresence>
        {isCategoryModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white dark:bg-[#14171D] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-6 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                <h3 className="text-lg font-bold">Yeni Kateqoriya</h3>
                <button onClick={() => setIsCategoryModalOpen(false)} className="text-slate-400 hover:text-slate-900 dark:hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveCategory} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold mb-1">Kateqoriya Adı *</label>
                  <input
                    type="text"
                    required
                    value={categoryForm.name}
                    onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                    className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Təsvir</label>
                  <textarea
                    rows="2"
                    value={categoryForm.description}
                    onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                    className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsCategoryModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold"
                  >
                    Ləğv et
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-purple-600 text-white font-bold"
                  >
                    Yarat
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Admin;
