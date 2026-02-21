import React from 'react';
import { motion } from 'framer-motion';
import { ContentItemProps } from './types';

export const StatsRenderer: React.FC<ContentItemProps> = ({ item }) => {
    if (!item.stats) return null;

    return (
        <div className="my-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {item.stats.map((stat, sIdx) => (
                <div key={sIdx} className="bg-stone-50 border-2 border-os-border p-2 shadow-retro-sm">
                    <div className="flex justify-between text-xs font-bold mb-1">
                        <span>{stat.label}</span>
                        <span>{stat.value}%</span>
                    </div>
                    <div className="h-4 w-full border border-os-border bg-white relative">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${stat.value}%` }}
                            transition={{ duration: 1, delay: 0.2 + (sIdx * 0.1), ease: "circOut" }}
                            className={`h-full border-r border-os-border relative overflow-hidden`}
                            style={{ backgroundColor: stat.color || 'var(--os-accent)' }}
                        >
                            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(45deg, #000 25%, transparent 25%, transparent 50%, #000 50%, #000 75%, transparent 75%, transparent)', backgroundSize: '4px 4px' }} />
                        </motion.div>
                    </div>
                </div>
            ))}
        </div>
    );
};
