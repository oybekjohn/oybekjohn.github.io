/* ============================================
   Neural Network Background
   Animated particles + connections canvas
   Performance-optimized: squared-distance culling,
   pauses on hidden tab, respects reduced-motion
   ============================================ */

(function() {
  const canvas = document.getElementById('starfield');
  if (!canvas) return;
  const ctx = canvas.getContext('2d', { alpha: true });

  const isMobile = window.innerWidth < 768;

  // --- Config ---
  const CONFIG = {
    particleCount: isMobile ? 45 : 90,
    connectionDistance: isMobile ? 120 : 160,
    particleMinSize: 1.5,
    particleMaxSize: 3.5,
    speed: 0.4,
    pulseSpeed: 0.02,
    mouseRadius: 220,
    colors: {
      particle: [26, 143, 212],     // matches --c-accent
      particleAlt: [124, 58, 237],  // matches accent gradient purple
      connection: [26, 143, 212],
      pulse: [58, 189, 176]
    }
  };
  CONFIG.connectionDistanceSq = CONFIG.connectionDistance * CONFIG.connectionDistance;

  let particles = [];
  let mouse = { x: -1000, y: -1000 };
  let animFrame;
  let width, height;
  let isVisible = true;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * CONFIG.speed;
      this.vy = (Math.random() - 0.5) * CONFIG.speed;
      this.baseSize = CONFIG.particleMinSize + Math.random() * (CONFIG.particleMaxSize - CONFIG.particleMinSize);
      this.size = this.baseSize;
      this.pulse = Math.random() * Math.PI * 2;
      this.pulseSpeed = CONFIG.pulseSpeed + Math.random() * 0.01;
      this.isAlt = Math.random() > 0.6;
      this.opacity = 0.4 + Math.random() * 0.5;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      this.pulse += this.pulseSpeed;
      this.size = this.baseSize + Math.sin(this.pulse) * 0.8;

      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const distSq = dx * dx + dy * dy;
      if (distSq < CONFIG.mouseRadius * CONFIG.mouseRadius && distSq > 0) {
        const dist = Math.sqrt(distSq);
        const force = (CONFIG.mouseRadius - dist) / CONFIG.mouseRadius * 0.012;
        this.vx += dx / dist * force;
        this.vy += dy / dist * force;
        this.opacity = Math.min(0.95, this.opacity + 0.01);
      } else {
        this.opacity = Math.max(0.4 + Math.random() * 0.1, this.opacity - 0.005);
      }

      const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
      if (speed > CONFIG.speed * 1.5) {
        this.vx *= 0.98;
        this.vy *= 0.98;
      }

      if (this.x < -20) this.x = width + 20;
      if (this.x > width + 20) this.x = -20;
      if (this.y < -20) this.y = height + 20;
      if (this.y > height + 20) this.y = -20;
    }

    draw(colors) {
      const color = this.isAlt ? colors.particleAlt : colors.particle;
      const glowSize = this.size * 3;

      ctx.beginPath();
      const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, glowSize);
      gradient.addColorStop(0, `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${this.opacity * 0.3})`);
      gradient.addColorStop(1, `rgba(${color[0]}, ${color[1]}, ${color[2]}, 0)`);
      ctx.fillStyle = gradient;
      ctx.arc(this.x, this.y, glowSize, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.fillStyle = `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${this.opacity})`;
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function init() {
    resize();
    particles = [];
    for (let i = 0; i < CONFIG.particleCount; i++) {
      particles.push(new Particle());
    }
  }

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
  }

  // Squared-distance pre-check avoids Math.sqrt() for the majority of
  // out-of-range pairs — the O(n^2) loop is the main cost at 90 particles.
  function drawConnections(colors) {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distSq = dx * dx + dy * dy;

        if (distSq < CONFIG.connectionDistanceSq) {
          const dist = Math.sqrt(distSq);
          const opacity = (1 - dist / CONFIG.connectionDistance) * 0.2;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(${colors.connection[0]}, ${colors.connection[1]}, ${colors.connection[2]}, ${opacity})`;
          ctx.lineWidth = 0.8;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    const mouseRadiusSq = CONFIG.mouseRadius * CONFIG.mouseRadius;
    for (let i = 0; i < particles.length; i++) {
      const dx = mouse.x - particles[i].x;
      const dy = mouse.y - particles[i].y;
      const distSq = dx * dx + dy * dy;

      if (distSq < mouseRadiusSq) {
        const dist = Math.sqrt(distSq);
        const opacity = (1 - dist / CONFIG.mouseRadius) * 0.25;
        ctx.beginPath();
        ctx.strokeStyle = `rgba(${colors.pulse[0]}, ${colors.pulse[1]}, ${colors.pulse[2]}, ${opacity})`;
        ctx.lineWidth = 0.8;
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.stroke();
      }
    }
  }

  function animate() {
    if (!isVisible) {
      animFrame = requestAnimationFrame(animate);
      return;
    }

    ctx.clearRect(0, 0, width, height);

    for (const p of particles) {
      p.update();
    }

    drawConnections(CONFIG.colors);

    for (const p of particles) {
      p.draw(CONFIG.colors);
    }

    animFrame = requestAnimationFrame(animate);
  }

  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      resize();
      for (const p of particles) {
        if (p.x > width || p.y > height) {
          p.x = Math.random() * width;
          p.y = Math.random() * height;
        }
      }
    }, 200);
  }, { passive: true });

  let mouseThrottle = false;
  document.addEventListener('mousemove', (e) => {
    if (mouseThrottle) return;
    mouseThrottle = true;
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    requestAnimationFrame(() => { mouseThrottle = false; });
  }, { passive: true });

  document.addEventListener('mouseleave', () => {
    mouse.x = -1000;
    mouse.y = -1000;
  });

  document.addEventListener('touchmove', (e) => {
    if (mouseThrottle || !e.touches[0]) return;
    mouseThrottle = true;
    mouse.x = e.touches[0].clientX;
    mouse.y = e.touches[0].clientY;
    requestAnimationFrame(() => { mouseThrottle = false; });
  }, { passive: true });

  document.addEventListener('touchend', () => {
    mouse.x = -1000;
    mouse.y = -1000;
  });

  document.addEventListener('visibilitychange', () => {
    isVisible = !document.hidden;
  });

  // --- Start ---
  init();

  if (prefersReducedMotion) {
    ctx.clearRect(0, 0, width, height);
    for (const p of particles) p.draw(CONFIG.colors);
  } else {
    animate();
  }
})();
