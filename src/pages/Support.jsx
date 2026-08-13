import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronDown, 
  Send, 
  HelpCircle,
  CheckCircle2
} from 'lucide-react';
import { SectionTitle } from '../components/SectionTitle';
import { zebrLaptop } from '../assets/mascot';

export const Support = () => {
  const [openIndex, setOpenIndex] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const faqs = [
    {
      q: "Məhsulu necə əldə edə bilərəm?",
      a: "Bəyəndiyiniz rəqəmsal məhsulu seçib 'Səbətə əlavə et' düyməsini sıxın. Daha sonra ödənişi tamamladıqdan dərhal sonra rəqəmsal açar və ya abunəlik giriş məlumatları sizə e-poçt vasitəsilə təqdim olunur."
    },
    {
      q: "Ödənişdən sonra nə baş verir?",
      a: "Ödəniş sistemimiz 24/7 avtomatlaşdırılmışdır. Ödəniş təsdiqlənən kimi sistem avtomatik olaraq məhsulunuzun rəsmi aktivasiya kodunu ekranınızda göstərir və nüsxəsini e-poçt ünvanınıza göndərir."
    },
    {
      q: "Rəqəmsal məhsullar necə təqdim olunur?",
      a: "Məhsulun növündən asılı olaraq rəsmi lisenziya açarı (Retail Key), dəvət linki və ya tam şəxsi hesab formatında təqdim olunur. Hər bir məhsul üçün addım-baaddım təlimat verilir."
    },
    {
      q: "Hansı ödəniş üsullarından istifadə edə bilərəm?",
      a: "Biz VISA, MasterCard, BirKart, TamKart, E-Manat və MilliÖN terminalları vasitəsilə ödənişləri qəbul edirik. Bütün ödənişlər 256-Bit SSL mühafizəsi altındadır."
    },
    {
      q: "Problem yaranarsa nə etməliyəm?",
      a: "Hər hansı texniki çətinlik və ya sualınız yarandıqda 7/24 fəaliyyət göstərən Dəstək Mərkəzimizə yazıb anında canlı yardım ala bilərsiniz. Bütün məhsullarımıza rəsmi zəmanət şamil olunur."
    }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setForm({ name: '', email: '', subject: '', message: '' });
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
      
      <SectionTitle
        badge="DƏSTƏK MƏRKƏZİ"
        title="Sizə necə kömək edə bilərik?"
        subtitle="Suallarınızın cavabını aşağıdakı FAQ bölməsindən tapa və ya birbaşa dəstək komandamıza müraciət edə bilərsiniz."
        centered
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl bg-white dark:bg-[#14171D] border border-slate-200 dark:border-slate-800 text-center space-y-3 shadow-sm group">
          <h3 className="text-base font-bold">E-poçt Dəstəyi</h3>
          <p className="text-slate-500 text-xs">support@zebr.az</p>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-[#14171D] border border-slate-200 dark:border-slate-800 text-center space-y-3 shadow-sm group">
          <h3 className="text-base font-bold">Ticket yaradın</h3>
        </div>
      </div>

      {/* FAQ Accordions with Developer Zebra Mascot */}
      <div className="max-w-4xl mx-auto bg-white dark:bg-[#14171D] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-sm space-y-6 relative overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <HelpCircle className="w-6 h-6 text-slate-700 dark:text-slate-300" />
            <div>
              <h2 className="text-2xl font-black">Tez-tez Verilən Suallar (FAQ)</h2>
              <p className="text-xs text-slate-400">ZEBR Texniki Dəstək Komandası Cavablandırır</p>
            </div>
          </div>
          <img src={zebrLaptop} alt="ZEBR Support Mascot Laptop" className="w-24 h-24 sm:w-28 sm:h-28 object-contain filter drop-shadow-xl hidden sm:block hover:scale-105 transition-transform" />
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-slate-50/50 dark:bg-slate-900/50"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm text-slate-900 dark:text-white transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <div className="px-5 pb-5 text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-200/60 dark:border-slate-800/60 pt-3">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>

      {/* Contact Form Section */}
      <div className="max-w-3xl mx-auto bg-white dark:bg-[#14171D] border border-slate-200 dark:border-slate-800 rounded-3xl p-8 sm:p-12 shadow-sm space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-black">Bizə Mesaj Göndərin</h2>
          <p className="text-slate-500 text-xs">
            Formu doldurun, mütəxəssislərimiz ən qısa zamanda sizinlə əlaqə saxlasın.
          </p>
        </div>

        {submitted ? (
          <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center text-emerald-600 dark:text-emerald-400 space-y-2">
            <CheckCircle2 className="w-8 h-8 mx-auto" />
            <h4 className="font-bold text-sm">Mesajınız uğurla göndərildi!</h4>
            <p className="text-xs text-slate-500">Tezliklə e-poçt ünvanınıza cavab yazacağıq.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Adınız *
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Elvin Məmmədov"
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-slate-900 dark:text-white focus:outline-none focus:border-slate-400"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  E-poçt Ünvanınız *
                </label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="elvin@example.com"
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-slate-900 dark:text-white focus:outline-none focus:border-slate-400"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Mövzu *
              </label>
              <input
                type="text"
                required
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                placeholder="Ödəniş və ya aktivasiya haqqında sual"
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-slate-900 dark:text-white focus:outline-none focus:border-slate-400"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Mesajınız *
              </label>
              <textarea
                rows="4"
                required
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="Suallarınızı ətraflı qeyd edin..."
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-slate-900 dark:text-white focus:outline-none focus:border-slate-400"
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-100 dark:hover:bg-white dark:text-slate-900 font-bold text-xs shadow-md flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              <Send className="w-4 h-4" />
              <span>Mesaj göndər</span>
            </button>
          </form>
        )}
      </div>

    </div>
  );
};
