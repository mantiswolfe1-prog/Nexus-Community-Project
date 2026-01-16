import React, { useEffect, useRef } from 'react';

export default function AuroraLights({ 
  accentColor = '#00ff88',
  intensity = 0.7,
  speed = 1,
  opacity = 0.6
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let time = 0;

    // Aurora wave layers
    const layers = [
      { color: '#00ff88', offset: 0, amplitude: 80, frequency: 0.002 },
      { color: '#00ddff', offset: 100, amplitude: 60, frequency: 0.0025 },
      { color: '#ff00ff', offset: 200, amplitude: 70, frequency: 0.0018 },
      { color: '#ffaa00', offset: 300, amplitude: 50, frequency: 0.0022 }
    ];

    const draw = () => {
      // Dark gradient background
      const bgGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      bgGradient.addColorStop(0, '#000814');
      bgGradient.addColorStop(0.5, '#001f3f');
      bgGradient.addColorStop(1, '#000814');
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw aurora layers
      layers.forEach((layer, index) => {
        ctx.beginPath();
        ctx.moveTo(0, canvas.height);

        // Create wave path
        for (let x = 0; x <= canvas.width; x += 2) {
          const y1 = Math.sin((x + time * speed) * layer.frequency) * layer.amplitude;
          const y2 = Math.cos((x + time * speed * 0.7) * layer.frequency * 1.3) * layer.amplitude * 0.5;
          const y = canvas.height * 0.3 + layer.offset + y1 + y2;
          ctx.lineTo(x, y);
        }

        ctx.lineTo(canvas.width, canvas.height);
        ctx.closePath();

        // Gradient fill for aurora effect
        const gradient = ctx.createLinearGradient(0, canvas.height * 0.2, 0, canvas.height);
        gradient.addColorStop(0, layer.color + Math.floor(intensity * 60).toString(16).padStart(2, '0'));
        gradient.addColorStop(0.5, layer.color + '20');
        gradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = gradient;
        ctx.fill();

        // Add glow effect
        ctx.shadowBlur = 30;
        ctx.shadowColor = layer.color;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // Stars in background
      for (let i = 0; i < 100; i++) {
        const x = (i * 137.5) % canvas.width;
        const y = (i * 237.5) % (canvas.height * 0.4);
        const size = Math.random() * 2;
        const twinkle = Math.sin(time * 0.01 + i) * 0.5 + 0.5;
        
        ctx.fillStyle = `rgba(255, 255, 255, ${twinkle * 0.8})`;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      }

      time += 1;
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
  }, [accentColor, intensity, speed]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full"
      style={{ opacity }}
    />
  );
}
