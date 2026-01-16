import React, { useEffect, useRef } from 'react';

export default function WaveGradient({ 
  accentColor = '#00f0ff',
  waveCount = 3,
  speed = 1,
  opacity = 0.6,
  amplitude = 50
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let offset = 0;

    // Parse accent color to create gradient
    const hexToRgb = (hex) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : { r: 0, g: 240, b: 255 };
    };

    const rgb = hexToRgb(accentColor);

    const draw = () => {
      // Background gradient
      const bgGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      bgGradient.addColorStop(0, '#0a0a0f');
      bgGradient.addColorStop(1, '#1a1a2e');
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw waves
      for (let i = 0; i < waveCount; i++) {
        const waveOpacity = 0.3 - (i * 0.08);
        const waveY = canvas.height * 0.5 + (i * 80);
        const frequency = 0.005 + (i * 0.001);

        ctx.beginPath();
        ctx.moveTo(0, waveY);

        // Draw wave curve
        for (let x = 0; x < canvas.width; x += 5) {
          const y = waveY + Math.sin((x + offset) * frequency) * amplitude;
          ctx.lineTo(x, y);
        }

        ctx.lineTo(canvas.width, canvas.height);
        ctx.lineTo(0, canvas.height);
        ctx.closePath();

        // Gradient fill
        const gradient = ctx.createLinearGradient(0, waveY - amplitude, 0, waveY + amplitude);
        gradient.addColorStop(0, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${waveOpacity})`);
        gradient.addColorStop(1, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0)`);
        ctx.fillStyle = gradient;
        ctx.fill();
      }

      offset += speed;
    };

    const interval = setInterval(draw, 33);

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', handleResize);
    };
  }, [accentColor, waveCount, speed, amplitude]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full"
      style={{ opacity }}
    />
  );
}
