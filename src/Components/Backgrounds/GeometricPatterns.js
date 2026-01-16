import React, { useEffect, useRef } from 'react';

export default function GeometricPatterns({ 
  accentColor = '#00f0ff',
  pattern = 'hexagons', // hexagons, triangles, circles
  speed = 0.5,
  opacity = 0.4,
  density = 30
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let rotation = 0;

    const drawHexagon = (x, y, size, angle) => {
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const a = angle + (Math.PI / 3) * i;
        const px = x + size * Math.cos(a);
        const py = y + size * Math.sin(a);
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
    };

    const drawTriangle = (x, y, size, angle) => {
      ctx.beginPath();
      for (let i = 0; i < 3; i++) {
        const a = angle + (Math.PI * 2 / 3) * i;
        const px = x + size * Math.cos(a);
        const py = y + size * Math.sin(a);
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = accentColor;
      ctx.lineWidth = 2;

      const spacing = density;
      const cols = Math.ceil(canvas.width / spacing) + 2;
      const rows = Math.ceil(canvas.height / spacing) + 2;

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const x = i * spacing - spacing;
          const y = j * spacing - spacing;
          const size = spacing * 0.4;
          const angle = rotation + (i + j) * 0.1;

          // Fade based on distance from center
          const centerX = canvas.width / 2;
          const centerY = canvas.height / 2;
          const distance = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
          const maxDistance = Math.sqrt(Math.pow(canvas.width, 2) + Math.pow(canvas.height, 2)) / 2;
          const alpha = 1 - (distance / maxDistance) * 0.5;
          
          ctx.globalAlpha = alpha * 0.6;

          if (pattern === 'hexagons') {
            drawHexagon(x, y, size, angle);
          } else if (pattern === 'triangles') {
            drawTriangle(x, y, size, angle);
          } else if (pattern === 'circles') {
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.closePath();
          }

          ctx.stroke();
        }
      }

      ctx.globalAlpha = 1;
      rotation += 0.005 * speed;
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
  }, [accentColor, pattern, speed, density]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full"
      style={{ opacity }}
    />
  );
}
