import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Tv, Gamepad2, Sparkles, Code, Zap, Grid, ArrowRight } from 'lucide-react';
import { 
  zebrDigitalApps, 
  zebrCoolJump, 
  zebrIdea, 
  zebrLaptop, 
  zebrBackpack, 
  zebrShield 
} from '../assets/mascot';

const mascotMap = {
  'streaming': zebrDigitalApps,
  'oyun': zebrCoolJump,
  'suniki-intellekt': zebrIdea,
  'proqramlar': zebrLaptop,
  'tehlukesizlik': zebrShield,
  'diger': zebrBackpack
};

const iconMap = {
  Tv,
  Gamepad2,
  Sparkles,
  Code,
  Zap,
  Grid
};

export const CategoryCard = ({ category, index = 0 }) => {
  const IconComponent = iconMap[category.icon] || Grid;
  const MascotImg = mascotMap[category.slug] || zebrDigitalApps;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.06, duration: 0.4 }}
    >
      <Link
        to={`/category/${category.slug}`}
        className="group relative block p-7 rounded-3xl bg-white dark:bg-[#14171D] border border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-600 transition-all duration-300 overflow-hidden shadow-sm hover:shadow-xl"
      >
        {/* Icon, Mascot & Count Badge */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-13 h-13 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-800 dark:text-slate-200 group-hover:bg-slate-900 group-hover:text-white dark:group-hover:bg-slate-100 dark:group-hover:text-slate-900 transition-all duration-300">
              <IconComponent className="w-6 h-6" />
            </div>
          </div>
          <span className="text-xs font-mono text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-900 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-800">
            {category.productCount} məhsul
          </span>
        </div>

        {/* Category Name */}
        <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors mb-2 flex items-center justify-between">
          <span>{category.name}</span>
          <ArrowRight className="w-5 h-5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-slate-400" />
        </h3>

        {/* Category Description */}
        <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed line-clamp-2 pr-12">
          {category.description}
        </p>
      </Link>
    </motion.div>
  );
};
