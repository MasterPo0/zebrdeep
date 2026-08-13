import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Zap } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-slate-100 dark:bg-[#07090C] border-t border-slate-200 dark:border-slate-800 pt-16 pb-12 transition-colors relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-200 dark:border-slate-800">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <span className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                ZEBR<span className="text-slate-400">.</span>
              </span>
            </Link>
            <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed max-w-sm">
              Azərbaycanın rəsmi rəqəmsal bazar platforması. Streaming, oyun, proqram təminatı və AI abunəliklərini anında təhvil və 256-Bit SSL təhlükəsizlik ilə əldə edin.
            </p>
            <div className="flex items-center gap-4 text-slate-500 text-xs pt-2 font-mono">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>100% Zəmanətli</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-500" />
                <span>Anında Təhvil</span>
              </div>
            </div>
          </div>

          {/* Column 1: Məhsullar */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4 font-mono">
              Məhsullar
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/products" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                  Bütün Məhsullar
                </Link>
              </li>
              <li>
                <Link to="/product/1" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                  Netflix Premium
                </Link>
              </li>
              <li>
                <Link to="/product/3" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                  ChatGPT Plus
                </Link>
              </li>
              <li>
                <Link to="/product/2" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                  Spotify Premium
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Kateqoriyalar */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4 font-mono">
              Kateqoriyalar
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/category/streaming" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                  Streaming
                </Link>
              </li>
              <li>
                <Link to="/category/oyun" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                  Oyun & Key-lər
                </Link>
              </li>
              <li>
                <Link to="/category/suniki-intellekt" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                  Süni İntellekt
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Dəstək & Şirkət */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4 font-mono">
              Dəstək
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/support" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                  FAQ & Əlaqə
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                  İdarəetmə Paneli
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-mono">
          <p>© 2026 ZEBR Market. Bütün hüquqlar qorunur.</p>
          <div>
            <span>Ödəniş Üsulları: VISA, MasterCard, BirKart, E-Manat</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
