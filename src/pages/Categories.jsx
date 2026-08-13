import React from 'react';
import { SectionTitle } from '../components/SectionTitle';
import { CategoryCard } from '../components/CategoryCard';
import { categories } from '../data/categories';

export const Categories = () => {
  return (
    <div className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <SectionTitle
        badge="KATEQORİYALAR"
        title="Bütün Rəqəmsal Kateqoriyalar"
        subtitle="Ehtiyacınıza uyğun ən populyar rəqəmsal xidmət və abunəliklər."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat, idx) => (
          <CategoryCard key={cat.id} category={cat} index={idx} />
        ))}
      </div>
    </div>
  );
};
