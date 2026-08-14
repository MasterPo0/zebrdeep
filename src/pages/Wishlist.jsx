import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Trash2, ArrowLeft } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { ProductCard } from '../components/ProductCard';
import { zebrChillBeanbag } from '../assets/mascot';

export const Wishlist = () => {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      
      <Link
        to="/products"
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors mb-4 group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span>Məhsullara Qayıt</span>
      </Link>

      <div className="p-8 sm:p-10 rounded-3xl bg-slate-900 text-white dark:bg-[#14171D] border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden">
        <div className="space-y-2 z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-mono font-bold">
            <Heart className="w-3.5 h-3.5 fill-rose-500" />
            <span>İSTƏK SİYAHINIZ</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black">
            Sevilən Məhsullarınız ({wishlist.length})
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm max-w-xl">
            Bəyəndiyiniz və sonra almaq üçün saxladığınız bütün rəqəmsal abunəliklər və lisenziyalar.
          </p>
        </div>

        <img 
          src={zebrChillBeanbag} 
          alt="ZEBR Mascot Wishlist" 
          className="w-36 h-32 sm:w-48 sm:h-36 object-contain filter drop-shadow-xl z-10 shrink-0 hover:scale-105 transition-transform" 
        />
      </div>

      {wishlist.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-[#14171D] rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm space-y-4">
          <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-500 flex items-center justify-center mx-auto">
            <Heart className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold">İstək siyahınız boşdur</h2>
          <p className="text-slate-500 text-xs max-w-md mx-auto">
            Bəyəndiyiniz məhsulların üzərindəki ürək simvoluna klikləyərək buraya saxlaya bilərsiniz.
          </p>
          <Link
            to="/products"
            className="px-8 py-3.5 rounded-2xl bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 font-bold text-xs inline-block active:scale-95 transition-all shadow-md"
          >
            Məhsulları kəşf edin
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {wishlist.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

    </div>
  );
};

export default Wishlist;
