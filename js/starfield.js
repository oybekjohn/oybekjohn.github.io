/* ============================================
   Soft Particle Starfield Animation
   For light background — subtle blue/gray particles
   Canvas-based, mouse-reactive, performance-optimized
   ============================================ */

(function () {
  'use strict';

  const canvas = document.getElementById('starfield');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let W, H;
  let mouseX = 0, mouseY = 0;
  let animationId;
  let isVisible = true;

  /* ---------- Configuration ---------- */
  const PARTICLE_COUNT = 160;
  const SHOOTING_STAR_INTERVAL = 5000;
  const PARALLAX_STRENGTH = 0.015;
  const DRIFT_SPEED = 0.15;

  /* ---------- Particles ---------- */
  const particles = [];
  const shootingStars = [];

  function createParticle() {
    const hue = 200 + Math.random() * 30; // blue range
    const sat = 40 + Math.random() * 30;
    const light = 55 + Math.random() * 20;
    const alpha = 0.12 + Math.random() * 0.22;
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      baseX: 0,
      baseY: 0,
      radius: Math.random() * 2.2 + 0.5,
      color: `hsla(${hue}, ${sat}%, ${light}%, ${alpha})`,
      glowColor: `hsla(${hue}, ${sat}%, ${light}%, ${alpha * 0.3})`,
      twinkleOffset: Math.random() * Math.PI * 2,
      twinkleSpeed: 0.002 + Math.random() * 0.003,
      driftX: (Math.random() - 0.5) * DRIFT_SPEED,
      driftY: (Math.random() - 0.5) * DRIFT_SPEED * 0.5,
      depth: Math.random() * 3 + 1
    };
  }

  function initParticles() {
    particles.length = 0;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const p = createParticle();
      p.baseX = p.x;
      p.baseY = p.y;
      particles.push(p);
    }
  }

  /* ---------- Shooting Stars ---------- */
  function createShootingStar() {
    const startX = Math.random() * W * 0.8;
    const startY = Math.random() * H * 0.3;
    return {
      x: startX,
      y: startY,
      length: Math.random() * 70 + 50,
      speed: Math.random() * 7 + 9,
      angle: (Math.PI / 6) + Math.random() * (Math.PI / 6),
      opacity: 0.6,
      life: 1,
      decay: 0.015 + Math.random() * 0.01
    };
  }

  /* ---------- Resize ---------- */
  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
    initParticles();
  }

  /* ---------- Draw ---------- */
  function drawParticle(p, time) {
    const twinkle = Math.sin(time * p.twinkleSpeed + p.twinkleOffset) * 0.35 + 0.65;

    // Drift movement
    p.baseX += p.driftX;
    p.baseY += p.driftY;

    // Wrap around edges
    if (p.baseX < -10) p.baseX = W + 10;
    if (p.baseX > W + 10) p.baseX = -10;
    if (p.baseY < -10) p.baseY = H + 10;
    if (p.baseY > H + 10) p.baseY = -10;

    // Parallax offset
    const dx = (mouseX - W / 2) * PARALLAX_STRENGTH * p.depth;
    const dy = (mouseY - H / 2) * PARALLAX_STRENGTH * p.depth;

    const px = p.baseX + dx;
    const py = p.baseY + dy;

    // Glow
    if (p.radius > 1.2) {
      ctx.beginPath();
      ctx.arc(px, py, p.radius * 3, 0, Math.PI * 2);
      ctx.fillStyle = p.glowColor;
      ctx.globalAlpha = twinkle;
      ctx.fill();
    }

    // Core dot
    ctx.beginPath();
    ctx.arc(px, py, p.radius, 0, Math.PI * 2);
    ctx.fillStyle = p.color;
    ctx.globalAlpha = twinkle;
    ctx.fill();

    ctx.globalAlpha = 1;
  }

  function drawShootingStar(ss) {
    const tailX = ss.x - Math.cos(ss.angle) * ss.length;
    const tailY = ss.y - Math.sin(ss.angle) * ss.length;

    const gradient = ctx.createLinearGradient(tailX, tailY, ss.x, ss.y);
    gradient.addColorStop(0, `rgba(26, 143, 212, 0)`);
    gradient.addColorStop(0.7, `rgba(26, 143, 212, ${ss.opacity * 0.25})`);
    gradient.addColorStop(1, `rgba(26, 143, 212, ${ss.opacity * 0.6})`);

    ctx.beginPath();
    ctx.moveTo(tailX, tailY);
    ctx.lineTo(ss.x, ss.y);
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 1.2;
    ctx.stroke();

    // Head
    ctx.beginPath();
    ctx.arc(ss.x, ss.y, 1.5, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(26, 143, 212, ${ss.opacity * 0.7})`;
    ctx.fill();
  }

  /* ---------- Animation Loop ---------- */
  function animate(time) {
    if (!isVisible) {
      animationId = requestAnimationFrame(animate);
      return;
    }

    ctx.clearRect(0, 0, W, H);

    // Draw particles
    for (let i = 0; i < particles.length; i++) {
      drawParticle(particles[i], time);
    }

    // Update & draw shooting stars
    for (let i = shootingStars.length - 1; i >= 0; i--) {
      const ss = shootingStars[i];
      ss.x += Math.cos(ss.angle) * ss.speed;
      ss.y += Math.sin(ss.angle) * ss.speed;
      ss.life -= ss.decay;
      ss.opacity = Math.max(0, ss.life * 0.6);

      if (ss.life <= 0 || ss.x > W + 100 || ss.y > H + 100) {
        shootingStars.splice(i, 1);
      } else {
        drawShootingStar(ss);
      }
    }

    animationId = requestAnimationFrame(animate);
  }

  /* ---------- Events ---------- */
  let mouseThrottle = false;
  document.addEventListener('mousemove', (e) => {
    if (mouseThrottle) return;
    mouseThrottle = true;
    mouseX = e.clientX;
    mouseY = e.clientY;
    requestAnimationFrame(() => { mouseThrottle = false; });
  }, { passive: true });

  document.addEventListener('touchmove', (e) => {
    if (mouseThrottle || !e.touches[0]) return;
    mouseThrottle = true;
    mouseX = e.touches[0].clientX;
    mouseY = e.touches[0].clientY;
    requestAnimationFrame(() => { mouseThrottle = false; });
  }, { passive: true });

  document.addEventListener('visibilitychange', () => {
    isVisible = !document.hidden;
  });

  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(resize, 200);
  }, { passive: true });

  setInterval(() => {
    if (isVisible && shootingStars.length < 2) {
      shootingStars.push(createShootingStar());
    }
  }, SHOOTING_STAR_INTERVAL);

  /* ---------- Init ---------- */
  resize();
  mouseX = W / 2;
  mouseY = H / 2;
  animationId = requestAnimationFrame(animate);

})();
