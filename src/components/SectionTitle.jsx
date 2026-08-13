import React from 'react';
import { motion } from 'framer-motion';

export const SectionTitle = ({ badge, title, subtitle, centered = false }) => {
  return (
    <div className={`mb-12 ${centered ? 'text-center' : ''}`}>
      {badge && (
        <motion.div 
          className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 text-xs font-mono tracking-wider uppercase mb-4 ${centered ? 'mx-auto' : ''}`}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-slate-900 dark:bg-slate-100" />
          {badge}
        </motion.div>
      )}

      <motion.h2 
        className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 dark:text-white mb-4"
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
      >
        {title}
      </motion.h2>

      {subtitle && (
        <motion.p 
          className="text-slate-600 dark:text-slate-400 text-base md:text-lg max-w-2xl leading-relaxed font-normal"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
};
