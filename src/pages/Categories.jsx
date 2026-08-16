import React, { useState, useEffect } from 'react';
import { SectionTitle } from '../components/SectionTitle';
import { CategoryCard } from '../components/CategoryCard';
import { apiService } from '../services/api';

export const Categories = () => {
  const [categoriesList, setCategoriesList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiService.getCategories()
      .then(res => {
        if (res.data) setCategoriesList(res.data);
      })
      .catch(err => {
        console.error("Error fetching categories:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <SectionTitle
        badge="KATEQORİYALAR"
        title="Bütün Rəqəmsal Kateqoriyalar"
        subtitle="Ehtiyacınıza uyğun ən populyar rəqəmsal xidmət və abunəliklər."
      />

      {loading ? (
        <div className="text-center py-16 text-slate-500 text-xs">Yüklənir...</div>
      ) : categoriesList.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-[#14171D] rounded-3xl border border-slate-200 dark:border-slate-800">
          <p className="text-slate-500 text-sm">Hələlik heç bir kateqoriya mövcud deyil.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categoriesList.map((cat, idx) => (
            <CategoryCard key={cat.id} category={cat} index={idx} />
          ))}
        </div>
      )}
    </div>
  );
};
