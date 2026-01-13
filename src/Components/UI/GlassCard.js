import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils';

export default function GlassCard({ 
  children, 
  className, 
  accentColor = '#00f0ff',
  hover = true,
  glow = false,
  onClick,
  ...props 
}) {
  return (
    <motion.div
      whileHover={hover ? { scale: 1.02, y: -2 } : {}}
      whileTap={onClick ? { scale: 0.98 } : {}}
      onClick={onClick}
      className={cn(
        "relative rounded-2xl border border-white/10 backdrop-blur-xl",
        "bg-gradient-to-br from-white/5 to-white/[0.02]",
        "shadow-xl transition-all duration-300",
        hover && "hover:border-white/20 hover:shadow-2xl cursor-pointer",
        glow && "shadow-[0_0_30px_-5px_var(--glow-color)]",
        className
      )}
      style={{ 
        '--glow-color': glow ? accentColor + '40' : 'transparent'
      }}
      {...props}
    >
      {glow && (
        <div 
          className="absolute inset-0 rounded-2xl opacity-20 blur-xl -z-10"
          style={{ background: `radial-gradient(circle at center, ${accentColor}, transparent 70%)` }}
        />
      )}
      {children}
    </motion.div>
  );
}
