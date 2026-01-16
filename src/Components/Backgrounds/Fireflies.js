import React, { useEffect, useRef } from 'react';

export default function Fireflies({ 
  accentColor = '#ffff00',
  count = 30,
  speed = 0.5,
  opacity = 0.8,
  glowSize = 20
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Create fireflies
    const fireflies = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * speed,
      vy: (Math.random() - 0.5) * speed,
      brightness: Math.random(),
      pulseSpeed: Math.random() * 0.02 + 0.01,
      size: Math.random() * 3 + 2,
      hue: Math.random() * 60 + 30 // Yellow to orange range
    }));

    const draw = () => {
      // Fade previous frame for trail effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      fireflies.forEach(firefly => {
        // Update position
        firefly.x += firefly.vx;
        firefly.y += firefly.vy;

        // Bounce off edges
        if (firefly.x < 0 || firefly.x > canvas.width) firefly.vx *= -1;
        if (firefly.y < 0 || firefly.y > canvas.height) firefly.vy *= -1;

        // Keep within bounds
        firefly.x = Math.max(0, Math.min(canvas.width, firefly.x));
        firefly.y = Math.max(0, Math.min(canvas.height, firefly.y));

        // Pulse brightness
        firefly.brightness += firefly.pulseSpeed;
        const brightness = (Math.sin(firefly.brightness) + 1) / 2;

        // Draw glow
        const gradient = ctx.createRadialGradient(
          firefly.x, firefly.y, 0,
          firefly.x, firefly.y, glowSize * brightness
        );
        gradient.addColorStop(0, `hsla(${firefly.hue}, 100%, 70%, ${brightness * 0.8})`);
        gradient.addColorStop(0.3, `hsla(${firefly.hue}, 100%, 60%, ${brightness * 0.4})`);
        gradient.addColorStop(1, 'transparent');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(firefly.x, firefly.y, glowSize * brightness, 0, Math.PI * 2);
        ctx.fill();

        // Draw bright center
        ctx.fillStyle = `hsla(${firefly.hue}, 100%, 90%, ${brightness})`;
        ctx.beginPath();
        ctx.arc(firefly.x, firefly.y, firefly.size, 0, Math.PI * 2);
        ctx.fill();
      });
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
  }, [accentColor, count, speed, glowSize]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full bg-black"
      style={{ opacity }}
    />
  );
}
