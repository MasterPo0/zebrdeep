import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Minus, 
  ArrowLeft, 
  CreditCard, 
  ShieldCheck, 
  CheckCircle, 
  Zap,
  Tag,
  Coins
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatCurrency } from '../utils/formatCurrency';
import { apiService } from '../services/api';
import { zebrThumbsup, zebrPresenting } from '../assets/mascot';

export const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart, subtotal } = useCart();
  const { user, deductCoins } = useAuth();
  const navigate = useNavigate();

  const [promoCode, setPromoCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  
  // ZEBR Coin usage checkbox
  const [useZebrCoins, setUseZebrCoins] = useState(false);

  const [selectedPayment, setSelectedPayment] = useState('card');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderResult, setOrderResult] = useState(null);

  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    note: ''
  });

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === 'ZEBR2026' || promoCode.trim().toUpperCase() === 'ZEBR') {
      setDiscountAmount(subtotal * 0.1); // 10% promo discount
    } else {
      alert("Daxil etdiyiniz promo kod keçərsizdir. (Sınaq üçün 'ZEBR' yazın)");
    }
  };

  const coinDiscountValue = useZebrCoins && user?.zebrCoins ? user.zebrCoins / 100 : 0;
  const totalDiscount = discountAmount + coinDiscountValue;
  const finalTotal = Math.max(0, subtotal - totalDiscount);

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) return;
    if (!formData.email || !formData.fullName) {
      alert("Zəhmət olmasa ad, soyad və e-poçt ünvanınızı daxil edin.");
      return;
    }

    setIsSubmitting(true);
    try {
      if (useZebrCoins && user?.zebrCoins) {
        deductCoins(user.zebrCoins);
      }
      const res = await apiService.checkout({
        items: cartItems,
        customer: formData,
        paymentMethod: selectedPayment,
        total: finalTotal
      });
      setOrderResult(res);
      clearCart();
    } catch (err) {
      alert("Xəta baş verdi. Zəhmət olmasa yenidən cəhd edin.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (orderResult) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-4 max-w-xl mx-auto text-center space-y-6">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-[#14171D] border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6 relative overflow-hidden"
        >
          <img 
            src={zebrThumbsup} 
            alt="ZEBR Thumbs Up Mascot" 
            className="w-32 h-40 object-contain mx-auto filter drop-shadow-xl animate-bounce-slow"
          />

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-mono font-bold">
            <CheckCircle className="w-4 h-4" />
            <span>SİFARİŞ UĞURLA TAMAMLANDI</span>
          </div>

          <h1 className="text-3xl font-black">Təbriklər! Sifarişiniz Təsdiqləndi</h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">
            Təşəkkür edirik! Rəqəmsal məhsulunuzun aktivasiya koda və məlumatları e-poçt ünvanınıza və şəxsi kabinetinizə göndərildi.
          </p>

          <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-left space-y-2 text-xs font-mono">
            <div className="flex justify-between">
              <span className="text-slate-500">Sifariş Nömrəsi:</span>
              <span className="font-bold">{orderResult.orderId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Tarix:</span>
              <span>{new Date().toLocaleString('az-AZ')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Ödənilən Məbləğ:</span>
              <span className="text-emerald-500 font-bold">{formatCurrency(finalTotal)}</span>
            </div>
          </div>

          <button
            onClick={() => navigate('/dashboard')}
            className="w-full py-4 rounded-2xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-bold text-xs shadow-md active:scale-95 transition-all"
          >
            İdarəetmə Panelinə Keçin
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      <Link
        to="/products"
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors mb-8 group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span>Məhsullara Qayıt</span>
      </Link>

      <h1 className="text-3xl sm:text-4xl font-black mb-8">
        Səbət və Ödəniş
      </h1>

      {cartItems.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-[#14171D] rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm space-y-4">
          <img 
            src={zebrPresenting} 
            alt="ZEBR Mascot Presenting" 
            className="w-36 h-44 object-contain mx-auto filter drop-shadow-lg hover:scale-105 transition-transform"
          />
          <h2 className="text-xl font-bold">Səbətinizdə hələlik məhsul yoxdur</h2>
          <p className="text-slate-500 text-xs max-w-md mx-auto">
            Kataloqa keçid edərək ən son rəqəmsal abunəliklər, AI alətləri və lisenziyaları kəşf edin.
          </p>
          <Link
            to="/products"
            className="px-8 py-3.5 rounded-2xl bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 font-bold text-xs inline-block active:scale-95 transition-all shadow-md"
          >
            Məhsullara Baxın
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT: Cart Items & Contact Info */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Items Card */}
            <div className="bg-white dark:bg-[#14171D] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-sm">
              <h2 className="text-lg font-bold border-b border-slate-100 dark:border-slate-800/80 pb-4">
                Səbətdəki Məhsullar ({cartItems.length})
              </h2>

              <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {cartItems.map((item) => (
                  <div
                    key={`${item.product.id}-${item.selectedDuration}`}
                    className="py-4 flex items-center justify-between gap-4"
                  >
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-16 h-16 rounded-xl object-cover shrink-0"
                    />

                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-bold truncate">
                        {item.product.name}
                      </h3>
                      <p className="text-xs text-slate-500 font-mono">
                        {item.selectedDuration}
                      </p>
                      <span className="text-xs text-slate-400">
                        {formatCurrency(item.price)} / bir ədəd
                      </span>
                    </div>

                    {/* Quantity */}
                    <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-1">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.selectedDuration, -1)}
                        className="p-1 text-slate-500 hover:text-slate-900 dark:hover:text-white"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-bold px-2">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.selectedDuration, 1)}
                        className="p-1 text-slate-500 hover:text-slate-900 dark:hover:text-white"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="text-right">
                      <span className="text-sm font-extrabold font-mono block">
                        {formatCurrency(item.price * item.quantity)}
                      </span>
                      <button
                        onClick={() => removeFromCart(item.product.id, item.selectedDuration)}
                        className="text-xs text-slate-400 hover:text-red-500 transition-colors mt-1"
                      >
                        Sil
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Customer Contact Form */}
            <div className="bg-white dark:bg-[#14171D] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-sm">
              <h2 className="text-lg font-bold border-b border-slate-100 dark:border-slate-800/80 pb-4">
                Əlaqə və Çatdırılma Məlumatları
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-medium text-slate-600 dark:text-slate-400 mb-1.5">
                    Ad və Soyad *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="Elvin Məmmədov"
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-slate-900 dark:text-white focus:outline-none focus:border-slate-400"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-600 dark:text-slate-400 mb-1.5">
                    E-poçt Ünvanı *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="elvin@example.com"
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-slate-900 dark:text-white focus:outline-none focus:border-slate-400"
                  />
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT: Order Summary & Loyalty Discount */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white dark:bg-[#14171D] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 sticky top-28 shadow-sm">
              
              <h2 className="text-xl font-bold">Sifariş Xülasəsi</h2>

              {/* Promo Code Input */}
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Promo kod (məs: ZEBR)"
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs font-mono uppercase focus:outline-none focus:border-slate-400"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-bold"
                >
                  Tətbiq et
                </button>
              </form>

              {/* ZEBR Bonus Coin Discount Toggle */}
              {user && user.zebrCoins > 0 && (
                <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between text-xs">
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={useZebrCoins}
                      onChange={(e) => setUseZebrCoins(e.target.checked)}
                      className="w-4 h-4 rounded accent-amber-500 cursor-pointer"
                    />
                    <div>
                      <span className="font-bold flex items-center gap-1 text-amber-600 dark:text-amber-400">
                        <Coins className="w-3.5 h-3.5" />
                        ZEBR Coin-ləri istifadə et
                      </span>
                      <span className="text-[11px] text-slate-500 block">
                        {user.zebrCoins} Coin = {formatCurrency(user.zebrCoins / 100)} Qənaət
                      </span>
                    </div>
                  </label>
                </div>
              )}

              {/* Payment Methods */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block">
                  Ödəniş Üsulu:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedPayment('card')}
                    className={`p-3 rounded-xl border text-xs font-semibold text-left flex items-center gap-2 ${
                      selectedPayment === 'card'
                        ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 border-slate-900'
                        : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500'
                    }`}
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Bank Kartı / BirKart</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedPayment('emanat')}
                    className={`p-3 rounded-xl border text-xs font-semibold text-left flex items-center gap-2 ${
                      selectedPayment === 'emanat'
                        ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 border-slate-900'
                        : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500'
                    }`}
                  >
                    <Zap className="w-4 h-4" />
                    <span>E-Manat / MilliÖN</span>
                  </button>
                </div>
              </div>

              {/* Calculation List */}
              <div className="space-y-2.5 text-xs text-slate-500 border-t border-b border-slate-100 dark:border-slate-800/80 py-4 font-mono">
                <div className="flex justify-between">
                  <span>Məhsulların cəmi:</span>
                  <span className="text-slate-900 dark:text-white">{formatCurrency(subtotal)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-500">
                    <span>Promo Endirimi:</span>
                    <span>-{formatCurrency(discountAmount)}</span>
                  </div>
                )}
                {useZebrCoins && coinDiscountValue > 0 && (
                  <div className="flex justify-between text-amber-500">
                    <span>ZEBR Coin Qənaəti:</span>
                    <span>-{formatCurrency(coinDiscountValue)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-bold text-slate-900 dark:text-white pt-2 font-sans">
                  <span>Yekun Məbləğ:</span>
                  <span className="text-2xl font-mono">{formatCurrency(finalTotal)}</span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleCheckout}
                disabled={isSubmitting}
                className="w-full py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-100 dark:hover:bg-white dark:text-slate-900 font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                {isSubmitting ? (
                  <span>Sifariş emal olunur...</span>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Sifarişi təsdiqlə və ödə ({formatCurrency(finalTotal)})</span>
                  </>
                )}
              </button>

            </div>
          </div>

        </div>
      )}

    </div>
  );
};
