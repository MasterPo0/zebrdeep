import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { categories } from '../data/categories';
import { products } from '../data/products';
import { ProductCard } from '../components/ProductCard';

export const Category = () => {
  const { slug } = useParams();
  
  const category = categories.find((c) => c.slug === slug || c.id === slug) || categories[0];
  const categoryProducts = products.filter((p) => p.category === category.id || p.category === category.slug);

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      <Link
        to="/categories"
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors mb-8 group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span>Bütün Kateqoriyalara Qayıt</span>
      </Link>

      <div className="p-8 sm:p-12 rounded-3xl bg-white dark:bg-[#14171D] border border-slate-200 dark:border-slate-800 mb-12 shadow-sm">
        <span className="px-3.5 py-1 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs font-mono mb-4 inline-block">
          {categoryProducts.length} Məhsul Mövcuddur
        </span>
        <h1 className="text-3xl sm:text-5xl font-black mb-4">
          {category.name}
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm max-w-2xl leading-relaxed">
          {category.description}
        </p>
      </div>

      {categoryProducts.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-[#14171D] rounded-3xl border border-slate-200 dark:border-slate-800">
          <p className="text-slate-500 text-sm">Bu kateqoriyada hələlik məhsul yoxdur.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categoryProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}

    </div>
  );
};
