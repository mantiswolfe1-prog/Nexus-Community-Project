import React, { useEffect, useRef } from 'react';

export default function CircuitBoard({ 
  accentColor = '#00ff00',
  nodeCount = 40,
  speed = 1,
  opacity = 0.7,
  showData = true
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Create circuit nodes
    const nodes = Array.from({ length: nodeCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      connections: [],
      pulse: Math.random() * Math.PI * 2,
      pulseSpeed: Math.random() * 0.02 + 0.01
    }));

    // Create connections between nearby nodes
    nodes.forEach((node, i) => {
      nodes.forEach((otherNode, j) => {
        if (i !== j) {
          const dx = node.x - otherNode.x;
          const dy = node.y - otherNode.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 200 && node.connections.length < 3) {
            node.connections.push({ node: otherNode, distance });
          }
        }
      });
    });

    // Data packets
    const packets = [];
    
    const createPacket = () => {
      if (showData && packets.length < nodeCount * 2) {
        const node = nodes[Math.floor(Math.random() * nodes.length)];
        if (node.connections.length > 0) {
          const connection = node.connections[Math.floor(Math.random() * node.connections.length)];
          packets.push({
            from: node,
            to: connection.node,
            progress: 0,
            speed: 0.01 * speed
          });
        }
      }
    };

    const draw = () => {
      // Dark circuit board background
      ctx.fillStyle = '#0a0a0f';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw connections
      nodes.forEach(node => {
        node.connections.forEach(connection => {
          const brightness = (Math.sin(node.pulse) + 1) / 2 * 0.3;
          
          // Draw circuit trace
          ctx.strokeStyle = `rgba(0, 255, 100, ${0.1 + brightness})`;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(connection.node.x, connection.node.y);
          ctx.stroke();

          // Draw glow
          ctx.strokeStyle = `rgba(0, 255, 100, ${0.05 + brightness * 0.5})`;
          ctx.lineWidth = 4;
          ctx.stroke();
        });
        
        node.pulse += node.pulseSpeed;
      });

      // Draw nodes
      nodes.forEach(node => {
        const brightness = (Math.sin(node.pulse) + 1) / 2;
        
        // Node glow
        const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, 10);
        gradient.addColorStop(0, `rgba(0, 255, 100, ${brightness * 0.8})`);
        gradient.addColorStop(0.5, `rgba(0, 255, 100, ${brightness * 0.3})`);
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(node.x, node.y, 10, 0, Math.PI * 2);
        ctx.fill();

        // Node center
        ctx.fillStyle = brightness > 0.7 ? '#ffffff' : '#00ff00';
        ctx.beginPath();
        ctx.arc(node.x, node.y, 4, 0, Math.PI * 2);
        ctx.fill();

        // Node ring
        ctx.strokeStyle = `rgba(0, 255, 100, ${brightness})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(node.x, node.y, 6, 0, Math.PI * 2);
        ctx.stroke();
      });

      // Draw and update data packets
      if (showData) {
        packets.forEach((packet, index) => {
          packet.progress += packet.speed;
          
          if (packet.progress >= 1) {
            packets.splice(index, 1);
            return;
          }

          const x = packet.from.x + (packet.to.x - packet.from.x) * packet.progress;
          const y = packet.from.y + (packet.to.y - packet.from.y) * packet.progress;

          // Packet glow
          const gradient = ctx.createRadialGradient(x, y, 0, x, y, 8);
          gradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
          gradient.addColorStop(0.5, 'rgba(0, 255, 255, 0.6)');
          gradient.addColorStop(1, 'transparent');
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(x, y, 8, 0, Math.PI * 2);
          ctx.fill();

          // Packet core
          ctx.fillStyle = '#00ffff';
          ctx.beginPath();
          ctx.arc(x, y, 3, 0, Math.PI * 2);
          ctx.fill();
        });
      }
    };

    const interval = setInterval(draw, 33);
    const packetInterval = setInterval(createPacket, 500 / speed);

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      clearInterval(interval);
      clearInterval(packetInterval);
      window.removeEventListener('resize', handleResize);
    };
  }, [accentColor, nodeCount, speed, showData]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full"
      style={{ opacity }}
    />
  );
}
