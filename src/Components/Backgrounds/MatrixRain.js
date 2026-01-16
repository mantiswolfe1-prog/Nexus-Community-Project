import React, { useEffect, useRef } from 'react';

export default function MatrixRain({ 
  accentColor = '#00ff00', 
  speed = 1,
  density = 0.95,
  opacity = 0.8,
  fontSize = 16
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Characters to display - mix of letters, numbers, and symbols
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()_+-={}[]|;:,.<>?/~`';
    const columns = Math.floor(canvas.width / fontSize);
    const drops = Array(columns).fill(1);

    const draw = () => {
      // Fade effect
      ctx.fillStyle = `rgba(0, 0, 0, ${0.05 * speed})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = accentColor;
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        // Only draw based on density
        if (Math.random() > density) continue;

        const text = chars[Math.floor(Math.random() * chars.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        // Gradient effect - brighter at the head
        const gradient = ctx.createLinearGradient(x, y - fontSize * 10, x, y);
        gradient.addColorStop(0, 'rgba(0, 255, 0, 0)');
        gradient.addColorStop(0.5, accentColor);
        gradient.addColorStop(1, '#ffffff');
        ctx.fillStyle = gradient;

        ctx.fillText(text, x, y);

        // Reset drop randomly
        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }

        drops[i] += speed;
      }
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
  }, [accentColor, speed, density, fontSize]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full"
      style={{ opacity }}
    />
  );
}
