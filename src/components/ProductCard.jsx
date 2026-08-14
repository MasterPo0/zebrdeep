import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, ShoppingBag, Zap, Heart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { formatCurrency } from '../utils/formatCurrency';

export const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const isLiked = isInWishlist(product.id);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.25 }}
      className="group relative bg-white dark:bg-[#14171D] border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:border-slate-400 dark:hover:border-slate-600"
    >
      {/* Top Badges */}
      <div className="absolute top-3.5 left-3.5 right-3.5 z-10 flex items-center justify-between pointer-events-none">
        {product.discount ? (
          <span className="px-2.5 py-1 rounded-full bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-[11px] font-extrabold tracking-wider uppercase shadow-sm">
            {product.discount}
          </span>
        ) : (
          <div />
        )}
        
        {product.instantDelivery && (
          <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold tracking-wide flex items-center gap-1 backdrop-blur-md">
            <Zap className="w-3 h-3 fill-emerald-500" />
            <span>Ani Təhvil</span>
          </span>
        )}
      </div>

      <Link to={`/product/${product.id}`} className="block flex-1 p-5">
        {/* Product Image Wrapper */}
        <div className="relative aspect-[16/10] rounded-2xl overflow-hidden mb-4 bg-slate-100 dark:bg-slate-900 flex items-center justify-center">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          
          <span className="absolute bottom-2.5 left-2.5 text-[10px] uppercase font-bold text-slate-800 dark:text-slate-200 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-2.5 py-0.5 rounded-md border border-slate-200 dark:border-slate-800">
            {product.categoryName}
          </span>

          {/* Wishlist Heart Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleWishlist(product);
            }}
            className="absolute bottom-2.5 right-2.5 p-2 rounded-full bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 backdrop-blur-md text-slate-600 dark:text-slate-300 hover:scale-110 active:scale-95 transition-all z-10"
            title={isLiked ? "İstək siyahısından çıxar" : "İstək siyahısına əlavə et"}
          >
            <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
          </button>
        </div>

        {/* Rating & Duration */}
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2 font-mono">
          <div className="flex items-center gap-1 text-amber-500 font-bold">
            <Star className="w-3.5 h-3.5 fill-amber-500" />
            <span>{product.rating}</span>
            <span className="text-slate-400 font-normal">({product.ratingCount})</span>
          </div>
          <span className="text-slate-600 dark:text-slate-300 font-semibold">
            {product.duration}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors line-clamp-1 mb-1.5">
          {product.name}
        </h3>

        {/* Short Description */}
        <p className="text-slate-500 dark:text-slate-400 text-xs line-clamp-2 leading-relaxed mb-4">
          {product.shortDescription}
        </p>
      </Link>

      {/* Card Footer Price & Buy Action */}
      <div className="px-5 pb-5 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/30">
        <div>
          {product.oldPrice && (
            <span className="block text-[11px] text-slate-400 line-through font-mono">
              {formatCurrency(product.oldPrice)}
            </span>
          )}
          <span className="text-base font-black text-slate-900 dark:text-white tracking-tight font-mono">
            {formatCurrency(product.price)}
          </span>
        </div>

        <button
          onClick={handleAddToCart}
          className="relative inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-100 dark:hover:bg-white dark:text-slate-900 text-xs font-bold shadow-sm transition-all duration-200 active:scale-95"
          aria-label={`${product.name} səbətə əlavə et`}
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>Səbətə əlavə et</span>
        </button>
      </div>
    </motion.div>
  );
};
