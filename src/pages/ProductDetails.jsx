import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Star, 
  ShoppingBag, 
  Zap, 
  ShieldCheck, 
  Check, 
  Clock, 
  ArrowLeft, 
  Plus, 
  Minus,
  Sparkles
} from 'lucide-react';
import { products } from '../data/products';
import { useCart } from '../context/CartContext';
import { ProductCard } from '../components/ProductCard';
import { formatCurrency } from '../utils/formatCurrency';
import { zebrThumbsup } from '../assets/mascot';

export const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const product = products.find((p) => p.id === Number(id)) || products[0];

  const [selectedDuration, setSelectedDuration] = useState(
    product.durations ? product.durations[0].label : product.duration
  );
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    window.scrollTo(0, 0);
    const defaultLabel = product.durations ? product.durations[0].label : product.duration;
    setSelectedDuration(defaultLabel);
  }, [id, product]);

  const activeDurationObj = product.durations?.find((d) => d.label === selectedDuration);
  const currentPrice = activeDurationObj ? activeDurationObj.price : product.price;
  const currentOldPrice = activeDurationObj ? activeDurationObj.oldPrice : product.oldPrice;

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedDuration);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, selectedDuration);
    navigate('/cart');
  };

  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      <Link
        to="/products"
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors mb-8 group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span>Bütün Məhsullara Qayıt</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20">
        
        {/* LEFT: Image Gallery & Description */}
        <div className="lg:col-span-7 space-y-8">
          
          <div className="relative aspect-[16/10] rounded-3xl overflow-hidden bg-slate-100 dark:bg-[#14171D] border border-slate-200 dark:border-slate-800 shadow-sm">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            
            <div className="absolute top-4 left-4 flex gap-2">
              <span className="px-3 py-1 rounded-full bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-extrabold uppercase tracking-wider">
                {product.categoryName}
              </span>
              {product.badge && (
                <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-bold border border-amber-500/30">
                  {product.badge}
                </span>
              )}
            </div>
          </div>

          {/* Description & Features */}
          <div className="bg-white dark:bg-[#14171D] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <span>Məhsul Haqqında Ətraflı</span>
            </h2>

            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
              {product.fullDescription}
            </p>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 font-mono">
                Əsas Üstünlüklər və Funksiyalar
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {product.features?.map((feat, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                    <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center shrink-0 mt-0.5 font-bold">
                      <Check className="w-3 h-3" />
                    </div>
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Trust Guarantees with Zebra Mascot */}
          <div className="p-6 rounded-3xl bg-slate-900 text-white dark:bg-[#14171D] border border-slate-800 flex items-center justify-between gap-4 shadow-lg overflow-hidden relative">
            <div className="space-y-1.5 z-10">
              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-mono font-bold">
                100% ORİJİNAL ZƏMANƏT
              </span>
              <h4 className="text-base font-black">ZEBR Tərəfindən Yoxlanılmışdır</h4>
              <p className="text-xs text-slate-400">Rəsmi lisenziya kodları, 24/7 dəstək və anında təhvil zəmanəti.</p>
            </div>
            <img 
              src={zebrThumbsup} 
              alt="ZEBR Thumbs Up Guarantee" 
              className="w-20 h-24 sm:w-24 sm:h-28 object-contain filter drop-shadow-lg shrink-0 z-10 hover:scale-105 transition-transform" 
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-white dark:bg-[#14171D] border border-slate-200 dark:border-slate-800 flex items-center gap-3 shadow-sm">
              <Zap className="w-6 h-6 text-amber-500 shrink-0" />
              <div>
                <h4 className="text-xs font-bold">Anında Təhvil</h4>
                <p className="text-[11px] text-slate-500">Avtomatik kod göndərilməsi</p>
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-white dark:bg-[#14171D] border border-slate-200 dark:border-slate-800 flex items-center gap-3 shadow-sm">
              <ShieldCheck className="w-6 h-6 text-emerald-500 shrink-0" />
              <div>
                <h4 className="text-xs font-bold">100% Rəsmi</h4>
                <p className="text-[11px] text-slate-500">Zəmanətli lisenziya</p>
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-white dark:bg-[#14171D] border border-slate-200 dark:border-slate-800 flex items-center gap-3 shadow-sm">
              <Clock className="w-6 h-6 text-blue-500 shrink-0" />
              <div>
                <h4 className="text-xs font-bold">7/24 Dəstək</h4>
                <p className="text-[11px] text-slate-500">Canlı yardım mərkəzi</p>
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT: Sticky Purchase Panel */}
        <div className="lg:col-span-5">
          <div className="sticky top-28 bg-white dark:bg-[#14171D] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-md">
            
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">
                  {product.categoryName}
                </span>
                <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                  <Star className="w-4 h-4 fill-amber-500" />
                  <span>{product.rating}</span>
                  <span className="text-slate-400 font-normal">({product.ratingCount})</span>
                </div>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black">
                {product.name}
              </h1>
            </div>

            {/* Price Banner */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 block mb-0.5">Seçilmiş Qiymət:</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black font-mono">
                    {formatCurrency(currentPrice * quantity)}
                  </span>
                  {currentOldPrice && (
                    <span className="text-sm text-slate-400 line-through font-mono">
                      {formatCurrency(currentOldPrice * quantity)}
                    </span>
                  )}
                </div>
              </div>
              {product.discount && (
                <span className="px-3 py-1 rounded-xl bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 font-bold text-xs">
                  {product.discount} Qənaət
                </span>
              )}
            </div>

            {/* Duration Selector */}
            {product.durations && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 block">
                  Müddət seçin:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {product.durations.map((dur) => (
                    <button
                      key={dur.label}
                      onClick={() => setSelectedDuration(dur.label)}
                      className={`py-2.5 px-3 rounded-xl text-xs font-bold text-center border transition-all ${
                        selectedDuration === dur.label
                          ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 border-slate-900'
                          : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500'
                      }`}
                    >
                      {dur.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs font-bold text-slate-500">Say:</span>
              <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-1.5">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-1 text-slate-500 hover:text-slate-900 dark:hover:text-white"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="text-sm font-bold px-2">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-1 text-slate-500 hover:text-slate-900 dark:hover:text-white"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-4">
              <button
                onClick={handleAddToCart}
                className="w-full py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-100 dark:hover:bg-white dark:text-slate-900 font-bold text-sm shadow-md flex items-center justify-center gap-2 active:scale-95 transition-all"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Səbətə əlavə et</span>
              </button>

              <button
                onClick={handleBuyNow}
                className="w-full py-4 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold text-sm text-center transition-all"
              >
                İndi al
              </button>
            </div>

          </div>
        </div>

      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="pt-16 border-t border-slate-200 dark:border-slate-800">
          <h3 className="text-2xl font-bold mb-8">
            Oxşar Rəqəmsal Məhsullar
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
