import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Key, 
  Settings, 
  Coins, 
  Check, 
  Copy,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { formatCurrency } from '../utils/formatCurrency';

export const Dashboard = () => {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'orders', 'subscriptions', 'coins', 'settings'
  const [copiedKey, setCopiedKey] = useState(null);

  // Settings Form State
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [savedNotice, setSavedNotice] = useState(false);

  if (!user) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-4 text-center">
        <h2 className="text-xl font-bold mb-4">Giriş etməmisiniz</h2>
        <button 
          onClick={() => navigate('/login')}
          className="px-6 py-2.5 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-bold"
        >
          Giriş səhifəsinə keçin
        </button>
      </div>
    );
  }

  const handleCopy = (keyText) => {
    navigator.clipboard.writeText(keyText);
    setCopiedKey(keyText);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleSaveSettings = (e) => {
    e.preventDefault();
    updateProfile({ name, email, phone });
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      
      {/* Dashboard Top Header & Profile Banner with Mascot */}
      <div className="relative overflow-hidden p-6 sm:p-8 rounded-3xl bg-slate-900 text-white dark:bg-[#14171D] dark:border dark:border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-4 relative z-10">
          <img 
            src={user.avatar} 
            alt={user.name} 
            className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-700 shrink-0"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black">{user.name}</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[11px] font-bold">
                {user.tier}
              </span>
            </div>
            <p className="text-slate-400 text-xs">{user.email}</p>
          </div>
        </div>

        {/* ZEBR Mascot Badge & Quick Pill */}
        <div className="flex items-center gap-4 relative z-10">
          <div className="flex items-center gap-4 bg-slate-800/80 dark:bg-slate-900/80 border border-slate-700/60 p-3.5 rounded-2xl">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
              <Coins className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] text-slate-400 block font-mono">ZEBR Bonus Balansı</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-lg font-black text-amber-400 font-mono">{user.zebrCoins} Coin</span>
                <span className="text-xs text-slate-400 font-mono">({formatCurrency(user.zebrCoins / 100)})</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'overview'
              ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-md'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>İcmal & ZEBR Bonus Kartı</span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'orders'
              ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-md'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Keçmiş Sifarişlər ({user.orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('subscriptions')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'subscriptions'
              ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-md'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Key className="w-4 h-4" />
          <span>Aktiv Hesablar ({user.subscriptions.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'settings'
              ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-md'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Tənzimləmələr</span>
        </button>
      </div>

      {/* TAB CONTENTS */}
      <div className="space-y-8">
        
        {/* 1. OVERVIEW & ZEBR BONUS LOYALTY CARD */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            
            {/* ZEBR Bonus Loyalty Card */}
            <div className="relative overflow-hidden rounded-3xl p-8 bg-gradient-to-br from-slate-900 via-slate-950 to-black text-white border border-slate-800 shadow-2xl">
              <div className="absolute top-0 right-0 p-8 opacity-10 font-mono text-8xl font-black select-none pointer-events-none">
                ZEBR
              </div>

              <div className="relative z-10 flex flex-col md:flex-row justify-between gap-8 items-start md:items-center">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-mono">
                    <Coins className="w-3.5 h-3.5" />
                    <span>ZEBR COIN LOYALTY CARD</span>
                  </div>

                  <h2 className="text-3xl sm:text-4xl font-black">
                    {user.zebrCoins} ZEBR Coin
                  </h2>

                  <p className="text-slate-400 text-xs max-w-md leading-relaxed">
                    Hər alış-verişinizdə {user.cashbackRate} cashback olaraq hesabınıza ZEBR Coin əlavə olunur. 100 ZEBR Coin = 1.00 AZN dəyərindədir.
                  </p>
                </div>

                <div className="bg-slate-800/80 backdrop-blur-md p-6 rounded-2xl border border-slate-700/60 text-right space-y-2 min-w-[220px]">
                  <span className="text-xs text-slate-400 block font-mono">Real Pul Dəyəri:</span>
                  <div className="text-3xl font-black text-amber-400 font-mono">
                    {formatCurrency(user.zebrCoins / 100)}
                  </div>
                  <span className="text-[11px] text-emerald-400 block">Səbətdə birbaşa istifadə oluna bilər</span>
                </div>
              </div>
            </div>

            {/* Quick Summary Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Recent Active Subscriptions */}
              <div className="p-6 rounded-3xl bg-white dark:bg-[#14171D] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm flex items-center gap-2">
                    <Key className="w-4 h-4 text-emerald-500" />
                    <span>Aktiv Abunəliklər</span>
                  </h3>
                  <button 
                    onClick={() => setActiveTab('subscriptions')}
                    className="text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white"
                  >
                    Hamısı
                  </button>
                </div>

                <div className="space-y-3">
                  {user.subscriptions.map((sub) => (
                    <div key={sub.id} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-bold">{sub.name}</h4>
                        <span className="text-[11px] text-slate-500">{sub.accountInfo}</span>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[11px] font-bold">
                        {sub.daysLeft} gün qaldı
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Orders */}
              <div className="p-6 rounded-3xl bg-white dark:bg-[#14171D] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4 text-purple-500" />
                    <span>Son Sifarişlər</span>
                  </h3>
                  <button 
                    onClick={() => setActiveTab('orders')}
                    className="text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white"
                  >
                    Hamısı
                  </button>
                </div>

                <div className="space-y-3">
                  {user.orders.map((ord) => (
                    <div key={ord.id} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-bold">{ord.productName}</h4>
                        <span className="text-[11px] text-slate-500 font-mono">{ord.id} • {ord.date}</span>
                      </div>
                      <span className="text-xs font-bold font-mono">
                        {formatCurrency(ord.price)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        )}

        {/* 2. ORDER HISTORY */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold">Keçmiş Sifarişləriniz</h2>
            
            <div className="space-y-4">
              {user.orders.map((ord) => (
                <div 
                  key={ord.id} 
                  className="p-6 rounded-3xl bg-white dark:bg-[#14171D] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
                    <div>
                      <span className="text-xs font-mono text-slate-400 block">{ord.id} • {ord.date}</span>
                      <h3 className="text-base font-bold">{ord.productName}</h3>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                        {ord.status}
                      </span>
                      <span className="text-lg font-black font-mono">
                        {formatCurrency(ord.price)}
                      </span>
                    </div>
                  </div>

                  {/* Activation Key Box */}
                  <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
                    <div>
                      <span className="text-[11px] text-slate-400 block font-mono">Rəqəmsal Lisenziya / Aktivasiya Kodu:</span>
                      <code className="text-sm font-mono font-bold text-slate-900 dark:text-slate-100">
                        {ord.activationKey}
                      </code>
                    </div>

                    <button
                      onClick={() => handleCopy(ord.activationKey)}
                      className="px-3 py-2 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-bold flex items-center gap-1.5 shrink-0"
                    >
                      {copiedKey === ord.activationKey ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Kopyalandı</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Kopyala</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. ACTIVE SUBSCRIPTIONS */}
        {activeTab === 'subscriptions' && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold">Aktiv Hesablar Və Abunəliklər</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {user.subscriptions.map((sub) => (
                <div 
                  key={sub.id} 
                  className="p-6 rounded-3xl bg-white dark:bg-[#14171D] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                      {sub.status}
                    </span>
                    <span className="text-xs font-mono text-slate-400">{sub.plan}</span>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold mb-1">{sub.name}</h3>
                    <p className="text-xs text-slate-500">{sub.accountInfo}</p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-900 flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-500">Bitmə Tarixi:</span>
                    <span className="font-bold">{sub.expiryDate} ({sub.daysLeft} gün)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. SETTINGS */}
        {activeTab === 'settings' && (
          <div className="max-w-2xl bg-white dark:bg-[#14171D] border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm space-y-6">
            <h2 className="text-lg font-bold">Profil Tənzimləmələri</h2>

            {savedNotice && (
              <div className="p-3.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                ✓ Məlumatlarınız uğurla yeniləndi.
              </div>
            )}

            <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Ad və Soyad
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  E-poçt Ünvanı
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Telefon Nömrəsi
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-bold text-xs shadow-md"
              >
                Yadda Saxla
              </button>
            </form>
          </div>
        )}

      </div>

    </div>
  );
};
