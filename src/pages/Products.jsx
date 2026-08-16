import React, { useState, useEffect, useMemo } from 'react';
import { Search, SlidersHorizontal, X, ArrowUpDown } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { apiService } from '../services/api';
import { zebrChillBeanbag } from '../assets/mascot';

export const Products = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('recommended');
  const [maxPrice, setMaxPrice] = useState(500);

  const [productsList, setProductsList] = useState([]);
  const [categoriesList, setCategoriesList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      apiService.getProducts({ size: 100 }),
      apiService.getCategories()
    ])
      .then(([prodRes, catRes]) => {
        if (prodRes.data?.content) setProductsList(prodRes.data.content);
        if (catRes.data) setCategoriesList(catRes.data);
      })
      .catch(err => {
        console.error("Error loading products list:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const filteredProducts = useMemo(() => {
    return productsList.filter((p) => {
      const matchedCat = categoriesList.find(c => c.slug === selectedCategory || c.id === selectedCategory);
      const matchesCategory = selectedCategory === 'all' || 
        p.category === selectedCategory || 
        p.categoryId === selectedCategory ||
        (matchedCat && (p.category === matchedCat.id || p.category === matchedCat.slug || p.categoryId === matchedCat.id));
      
      const nameMatch = (p.name || p.title || '').toLowerCase().includes(searchTerm.toLowerCase());
      const descMatch = (p.shortDescription || p.description || '').toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSearch = nameMatch || descMatch;

      const matchesPrice = p.price <= maxPrice;

      return matchesCategory && matchesSearch && matchesPrice;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      if (sortBy === 'newest') return b.id - a.id;
      return (b.ratingCount || 0) - (a.ratingCount || 0);
    });
  }, [productsList, categoriesList, searchTerm, selectedCategory, sortBy, maxPrice]);

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Products Top Hero with Relaxing Coffee Beanbag Mascot */}
      <div className="p-8 sm:p-10 rounded-3xl bg-slate-900 text-white dark:bg-[#14171D] border border-slate-800 mb-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden">
        <div className="space-y-3 z-10 max-w-2xl">
          <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-mono font-bold uppercase tracking-wider">
            RƏSMİ RƏQƏMSAL KATALOQ
          </span>
          <h1 className="text-3xl sm:text-4xl font-black leading-tight">
            Bütün Rəqəmsal Paketlər Və Lisenziyalar
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
            Qəhvənizi süzün, sevdiyiniz abunəlik və ya xidməti seçin. Anında avtomatik təhvil və rəsmi zəmanətlə.
          </p>
        </div>
        <img 
          src={zebrChillBeanbag} 
          alt="ZEBR Chill Beanbag Coffee Mascot" 
          className="w-44 h-36 sm:w-56 sm:h-44 object-contain filter drop-shadow-2xl z-10 shrink-0 hover:scale-105 transition-transform" 
        />
      </div>

      <div className="bg-white dark:bg-[#14171D] border border-slate-200 dark:border-slate-800 p-5 rounded-3xl mb-10 shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          
          {/* Search Input */}
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Məhsul adı və ya kateqoriya axtarın..."
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl pl-11 pr-10 py-3 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-slate-400"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-900 dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="md:col-span-3 relative">
            <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-4 py-3 text-xs text-slate-600 dark:text-slate-300">
              <ArrowUpDown className="w-4 h-4 text-slate-400 shrink-0" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full bg-transparent text-slate-900 dark:text-white focus:outline-none cursor-pointer"
              >
                <option value="recommended" className="bg-white dark:bg-slate-900">Tövsiyə olunanlar</option>
                <option value="newest" className="bg-white dark:bg-slate-900">Ən yenilər</option>
                <option value="price-asc" className="bg-white dark:bg-slate-900">Qiymət: Aşağıdan yuxarı</option>
                <option value="price-desc" className="bg-white dark:bg-slate-900">Qiymət: Yuxarıdan aşağı</option>
                <option value="rating" className="bg-white dark:bg-slate-900">Yüksək reytinq</option>
              </select>
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="md:col-span-3 flex items-center gap-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-4 py-2.5 text-xs text-slate-600 dark:text-slate-300">
            <SlidersHorizontal className="w-4 h-4 text-slate-400 shrink-0" />
            <div className="w-full">
              <div className="flex justify-between font-mono mb-1">
                <span>Maks. qiymət:</span>
                <span className="font-bold text-slate-900 dark:text-white">{maxPrice} AZN</span>
              </div>
              <input
                type="range"
                min="10"
                max="500"
                step="5"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-slate-900 dark:accent-slate-100 cursor-pointer h-1 bg-slate-200 dark:bg-slate-800 rounded-lg"
              />
            </div>
          </div>

        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-2 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === 'all'
                ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-sm'
                : 'bg-slate-50 dark:bg-slate-900 text-slate-500 border border-slate-200 dark:border-slate-800'
            }`}
          >
            Bütün Kateqoriyalar ({productsList.length})
          </button>
          {categoriesList.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.slug)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat.slug
                  ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-sm'
                  : 'bg-slate-50 dark:bg-slate-900 text-slate-500 border border-slate-200 dark:border-slate-800'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between mb-6 text-xs text-slate-500 font-mono">
        <span>Tapılan məhsul sayı: <strong>{filteredProducts.length}</strong></span>
      </div>

      {loading ? (
        <div className="text-center py-20 text-slate-500 text-xs">Məhsullar yüklənir...</div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-[#14171D] border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-400 mx-auto mb-4">
            <Search className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold mb-2">Məhsul tapılmadı</h3>
          <p className="text-slate-500 text-xs max-w-md mx-auto mb-6">
            Axtarış sorğusuna uyğun nəticə tapılmadı. Zəhmət olmasa axtarış sözünü və ya filtrləri dəyişdirin.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('all');
              setMaxPrice(500);
            }}
            className="px-6 py-2.5 rounded-xl bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 text-xs font-bold"
          >
            Filtrləri sıfırla
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

    </div>
  );
};
