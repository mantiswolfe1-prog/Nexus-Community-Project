import React from 'react';

export function Slider({ value = [0], onValueChange, min = 0, max = 100, step = 1, className = '' }) {
  const handleChange = (e) => {
    const newValue = parseFloat(e.target.value);
    if (onValueChange) {
      onValueChange([newValue]);
    }
  };

  return (
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value[0]}
      onChange={handleChange}
      className={`w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-400 ${className}`}
      style={{
        background: `linear-gradient(to right, #00f0ff ${((value[0] - min) / (max - min)) * 100}%, rgba(255,255,255,0.1) ${((value[0] - min) / (max - min)) * 100}%)`
      }}
    />
  );
}
