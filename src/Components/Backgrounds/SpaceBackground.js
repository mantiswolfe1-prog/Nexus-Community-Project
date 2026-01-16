import React, { useEffect, useRef } from 'react';

export default function SpaceBackground({ 
  accentColor = '#ffffff',
  starCount = 200,
  speed = 0.5,
  opacity = 1,
  showPlanets = true,
  showNebula = true
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Create stars
    const stars = Array.from({ length: starCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2 + 0.5,
      speed: Math.random() * 0.5 + 0.1,
      twinkle: Math.random() * Math.PI * 2,
      twinkleSpeed: Math.random() * 0.02 + 0.01
    }));

    // Create planets
    const planets = showPlanets ? [
      {
        x: canvas.width * 0.8,
        y: canvas.height * 0.3,
        radius: 60,
        color: '#ff6b6b',
        rings: true
      },
      {
        x: canvas.width * 0.2,
        y: canvas.height * 0.7,
        radius: 40,
        color: '#4ecdc4',
        rings: false
      }
    ] : [];

    // Nebula clouds
    const nebulaClouds = showNebula ? Array.from({ length: 5 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 200 + 100,
      color: `hsla(${Math.random() * 360}, 70%, 50%, 0.1)`
    })) : [];

    const draw = () => {
      // Clear canvas with deep space black
      ctx.fillStyle = '#000814';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw nebula clouds
      nebulaClouds.forEach(cloud => {
        const gradient = ctx.createRadialGradient(cloud.x, cloud.y, 0, cloud.x, cloud.y, cloud.radius);
        gradient.addColorStop(0, cloud.color);
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      });

      // Draw planets
      planets.forEach(planet => {
        // Planet shadow
        const shadowGradient = ctx.createRadialGradient(
          planet.x - planet.radius * 0.2, 
          planet.y - planet.radius * 0.2, 
          planet.radius * 0.1,
          planet.x, 
          planet.y, 
          planet.radius
        );
        shadowGradient.addColorStop(0, planet.color);
        shadowGradient.addColorStop(0.7, planet.color);
        shadowGradient.addColorStop(1, '#000000');
        
        ctx.fillStyle = shadowGradient;
        ctx.beginPath();
        ctx.arc(planet.x, planet.y, planet.radius, 0, Math.PI * 2);
        ctx.fill();

        // Rings
        if (planet.rings) {
          ctx.strokeStyle = `${planet.color}80`;
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.ellipse(planet.x, planet.y, planet.radius * 1.5, planet.radius * 0.3, Math.PI * 0.2, 0, Math.PI * 2);
          ctx.stroke();
        }
      });

      // Draw and animate stars
      stars.forEach(star => {
        // Twinkling effect
        star.twinkle += star.twinkleSpeed;
        const brightness = (Math.sin(star.twinkle) + 1) / 2;
        
        ctx.fillStyle = `rgba(255, 255, 255, ${brightness * 0.8})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();

        // Add star glow
        if (brightness > 0.7) {
          const glowGradient = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, star.size * 3);
          glowGradient.addColorStop(0, `rgba(255, 255, 255, ${brightness * 0.3})`);
          glowGradient.addColorStop(1, 'transparent');
          ctx.fillStyle = glowGradient;
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.size * 3, 0, Math.PI * 2);
          ctx.fill();
        }

        // Move stars slowly
        star.y += star.speed * speed;
        if (star.y > canvas.height) {
          star.y = 0;
          star.x = Math.random() * canvas.width;
        }
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
  }, [accentColor, starCount, speed, showPlanets, showNebula]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full"
      style={{ opacity }}
    />
  );
}
