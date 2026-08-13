import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Zap, 
  ShieldCheck, 
  Award, 
  Headphones, 
  ArrowRight, 
  CheckCircle2,
  Coins
} from 'lucide-react';
import { Hero } from '../components/Hero';
import { Zebra } from '../components/Zebra';
import { SectionTitle } from '../components/SectionTitle';
import { ProductCard } from '../components/ProductCard';
import { CategoryCard } from '../components/CategoryCard';
import { ScrollReveal } from '../components/ScrollReveal';
import { products } from '../data/products';
import { categories } from '../data/categories';
import { zebrPhone, zebrThumbsup } from '../assets/mascot';

export const Home = () => {
  const [selectedFilter, setSelectedFilter] = useState('all');

  const benefits = [
    {
      icon: Zap,
      title: "Sürətli Çatdırılma",
      description: "Ödəniş təsdiqləndikdən sonra rəqəmsal lisenziya və ya abunəlik məlumatlarınızı ən qısa zamanda əldə edin."
    },
    {
      icon: ShieldCheck,
      title: "Təhlükəsiz Ödəniş",
      description: "Ödəniş prosesində ISO27001 və 256-Bit SSL şifrələmə ilə tam məxfilik və təhlükəsizlik təmin edilir."
    },
    {
      icon: Award,
      title: "Etibarlı Məhsullar",
      description: "Yalnız əməkdaşlarımız tərəfindən yoxlanılmış 100% zəmanətli rəqəmsal kodlar."
    },
    {
      icon: Headphones,
      title: "7/24 Dəstək Xidməti",
      description: "Hər hansı sualınız və ya texniki çətinliyiniz yarandıqda mütəxəssislərimiz sizə kömək etməyə hazırdır."
    }
  ];

  const filteredProducts = selectedFilter === 'all'
    ? products.slice(0, 8)
    : products.filter(p => p.category === selectedFilter).slice(0, 8);

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Interactive Zebra Companion */}
      <Zebra />

      {/* 1. HERO SECTION */}
      <Hero />

      {/* 2. TRUST & BENEFITS SECTION */}
      <section className="py-20 relative z-10 border-y border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            badge="ÜSTÜNLÜKLƏRİMİZ"
            title="Nə üçün ZEBR Market-i seçməlisiniz?"
            subtitle="Rəqəmsal alış-verişinizi rahat, təhlükəsiz və anında həyata keçirməyiniz üçün ən müasir standartları tətbiq edirik."
            centered
            
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((item, idx) => {
              const Icon = item.icon;
              return (
                <ScrollReveal key={idx} delay={idx * 0.08}>
                  <div className="h-full p-6 rounded-3xl bg-white dark:bg-[#14171D] border border-slate-200 dark:border-slate-800 transition-all duration-300 group hover:-translate-y-1 hover:shadow-lg">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-800 dark:text-slate-200 group-hover:bg-slate-900 group-hover:text-white dark:group-hover:bg-slate-100 dark:group-hover:text-slate-900 transition-colors mb-5">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                      {item.title}
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. CATEGORIES SECTION */}
      <section className="py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <SectionTitle
              badge="KATEQORİYALAR"
              title="Zəngin rəqəmsal kataloq"
              subtitle="Ehtiyacınıza uyğun ən populyar kateqoriyalar üzrə rəqəmsal məhsulları kəşf edin."
            />
            <Link
              to="/categories"
              className="inline-flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white hover:text-slate-600 transition-colors mb-8 md:mb-12 group font-mono"
            >
              <span>Bütün kateqoriyalara baxın</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat, idx) => (
              <CategoryCard key={cat.id} category={cat} index={idx} />
            ))}
          </div>
        </div>
      </section>

      {/* 4. FEATURED PRODUCTS SECTION */}
      <section className="py-24 relative z-10 bg-slate-50/50 dark:bg-slate-900/30 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
            <SectionTitle
              badge="SEÇİLMİŞ MƏHSULLAR"
              title="Ən çox tələb olunan rəqəmsal abunəliklər"
              subtitle="Rəsmi zəmanətli və anında aktivləşdirilən rəqəmsal paketlər."
            />

            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2 mb-8 md:mb-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1.5 rounded-2xl shadow-sm">
              <button
                onClick={() => setSelectedFilter('all')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  selectedFilter === 'all'
                    ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Hamısı
              </button>
              <button
                onClick={() => setSelectedFilter('streaming')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  selectedFilter === 'streaming'
                    ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Streaming
              </button>
              <button
                onClick={() => setSelectedFilter('suniki-intellekt')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  selectedFilter === 'suniki-intellekt'
                    ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                AI Alətləri
              </button>
              <button
                onClick={() => setSelectedFilter('oyun')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  selectedFilter === 'oyun'
                    ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Oyun
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="mt-14 text-center">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-100 dark:hover:bg-white dark:text-slate-900 text-xs font-bold transition-all shadow-md"
            >
              <span>Bütün Məhsulları İncələyin ({products.length})</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 5. ZEBR BONUS LOYALTY SHOWCASE */}
      <section className="py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-slate-900 text-white dark:bg-[#14171D] border border-slate-800 p-8 sm:p-12 lg:p-16 shadow-xl relative overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
              
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 text-xs font-mono">
                  <Coins className="w-3.5 h-3.5" />
                  <span>ZEBR BONUS XÜSUSİYYƏTİ</span>
                </div>

                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight">
                  Hər alışda <br />
                  <span className="text-amber-400">ZEBR Coin qazanın!</span>
                </h2>

                <p className="text-slate-400 text-sm leading-relaxed">
                  ZEBR Market platformasında hər bir alış-verişinizdən sonra hesabınıza ZEBR Coin bonusları əlavə olunur. Növbəti alışınızda bu puanlardan pul kimi istifadə edin.
                </p>

                <div className="space-y-3.5 pt-2 text-sm text-slate-300">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" />
                    <span>Ödəniş etdiyiniz məbləğin 5%-i instantly hesabınıza qaytarılır</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" />
                    <span>100 ZEBR Coin = 1.00 AZN dəyərində səbətdə çıxılır</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" />
                    <span>Müddətsiz istifadə hüququ</span>
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    to="/dashboard"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md active:scale-95 transition-all"
                  >
                    <span>Bonus Balansınızı Yoxlayın</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* Mascot & Stat Cards Container */}
              <div className="lg:col-span-5 flex flex-col items-center gap-6">
                <div className="relative">
                  <img 
                    src={zebrPhone} 
                    alt="ZEBR Phone Loyalty Mascot" 
                    className="w-44 h-56 sm:w-52 sm:h-64 object-contain filter drop-shadow-2xl hover:scale-105 transition-transform" 
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 w-full">
                  <div className="p-4 rounded-2xl bg-slate-800/80 dark:bg-slate-900/80 border border-slate-700/60 text-center">
                    <div className="text-2xl sm:text-3xl font-black text-amber-400 font-mono mb-0.5">
                      450 Coin
                    </div>
                    <div className="text-[11px] text-slate-400">Xoş gəldin bonusu</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-800/80 dark:bg-slate-900/80 border border-slate-700/60 text-center">
                    <div className="text-2xl sm:text-3xl font-black text-amber-400 font-mono mb-0.5">
                      5%
                    </div>
                    <div className="text-[11px] text-slate-400">Cashback dərəcəsi</div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* 6. FINAL CALL TO ACTION SECTION */}
      <section className="py-24 relative z-10 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <ScrollReveal direction="scale">
            <div className="p-10 sm:p-16 rounded-3xl bg-slate-900 text-white dark:bg-[#14171D] border border-slate-800 relative overflow-hidden shadow-xl">
              
              <div className="relative z-10 space-y-6">
                <img 
                  src={zebrThumbsup} 
                  alt="ZEBR Final Mascot" 
                  className="w-28 h-36 object-contain mx-auto filter drop-shadow-xl hover:scale-105 transition-transform" 
                />

                <span className="px-3.5 py-1.5 rounded-full bg-slate-800 text-slate-300 text-xs font-mono uppercase tracking-widest inline-block">
                  İNDİ BAŞLAYIN
                </span>

                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight">
                  Sevdiyiniz rəqəmsal məhsulu <br />
                  <span className="text-slate-400">elə indi əldə edin.</span>
                </h2>

                <p className="text-slate-400 text-sm max-w-xl mx-auto leading-relaxed">
                  ZEBR Market ilə rəqəmsal imkanlardan dərhal faydalanın. Sadə ödəniş, anında aktivasiya və etibarlı xidmət.
                </p>

                <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link
                    to="/products"
                    className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white text-slate-900 font-bold text-sm shadow-md transition-all active:scale-95"
                  >
                    Kataloqa keçin
                  </Link>
                  <Link
                    to="/support"
                    className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-800 text-white border border-slate-700 text-sm font-semibold transition-colors"
                  >
                    Suallarınız var?
                  </Link>
                </div>
              </div>

            </div>
          </ScrollReveal>
        </div>
      </section>

    </div>
  );
};
