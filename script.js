/* ============================================================
   ANGÉLICA FERREIRA — PSICÓLOGA CLÍNICA
   script.js
   ============================================================ */

/* ── CURSOR PERSONALIZADO ───────────────────────────────── */
const cur  = document.getElementById('cur');
const curO = document.getElementById('cur-o');
let mx = 0, my = 0, ox = 0, oy = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cur.style.left = mx + 'px';
  cur.style.top  = my + 'px';
});

function animCursor() {
  ox += (mx - ox) * 0.13;
  oy += (my - oy) * 0.13;
  curO.style.left = ox + 'px';
  curO.style.top  = oy + 'px';
  requestAnimationFrame(animCursor);
}
animCursor();

/* ── PARTÍCULAS INTERATIVAS (canvas) ────────────────────── */
const canvas = document.getElementById('bg-canvas');
const ctx    = canvas.getContext('2d');
let W, H, particles = [];

function resize() {
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', () => { resize(); initParticles(); });

function initParticles() {
  particles = [];
  const count = Math.floor((W * H) / 18000);
  for (let i = 0; i < count; i++) {
    particles.push({
      x:     Math.random() * W,
      y:     Math.random() * H,
      r:     Math.random() * 1.5 + 0.3,
      vx:    (Math.random() - 0.5) * 0.2,
      vy:    (Math.random() - 0.5) * 0.2,
      alpha: Math.random() * 0.5 + 0.1,
      color: Math.random() > 0.5 ? '201,169,110' : '107,79,58'
    });
  }
}
initParticles();

let mouseX = W / 2, mouseY = H / 2;
document.addEventListener('mousemove', e => { mouseX = e.clientX; mouseY = e.clientY; });

function drawParticles() {
  ctx.clearRect(0, 0, W, H);

  /* halo sutil no ponteiro */
  const grad = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, 400);
  grad.addColorStop(0, 'rgba(201,169,110,0.04)');
  grad.addColorStop(1, 'transparent');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  particles.forEach((p, i) => {
    /* atração suave ao mouse */
    const dx = mouseX - p.x, dy = mouseY - p.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 200) { p.vx += dx / dist * 0.003; p.vy += dy / dist * 0.003; }
    p.vx *= 0.995; p.vy *= 0.995;
    p.x += p.vx; p.y += p.vy;

    /* wrap nas bordas */
    if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
    if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;

    /* ponto */
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${p.color},${p.alpha})`;
    ctx.fill();

    /* linhas de conexão */
    for (let j = i + 1; j < particles.length; j++) {
      const q = particles[j];
      const dx2 = p.x - q.x, dy2 = p.y - q.y;
      const d2  = Math.sqrt(dx2 * dx2 + dy2 * dy2);
      if (d2 < 100) {
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(q.x, q.y);
        ctx.strokeStyle = `rgba(201,169,110,${0.06 * (1 - d2 / 100)})`;
        ctx.lineWidth   = 0.5;
        ctx.stroke();
      }
    }
  });

  requestAnimationFrame(drawParticles);
}
drawParticles();

/* ── NAV: compacta ao rolar ─────────────────────────────── */
window.addEventListener('scroll', () => {
  document.getElementById('nav').classList.toggle('scrolled', window.scrollY > 60);
});

/* ── REVEAL ao entrar na viewport ───────────────────────── */
const revObs = new IntersectionObserver(
  entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('vis'); }),
  { threshold: 0.1 }
);
document.querySelectorAll('.reveal').forEach(el => revObs.observe(el));

/* ── FAQ: accordion ─────────────────────────────────────── */
document.querySelectorAll('.faq-q').forEach(q => {
  q.addEventListener('click', () => {
    const item = q.parentElement;
    const open = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
    if (!open) item.classList.add('open');
  });
});

/* ── FORMULÁRIO: envia via WhatsApp ─────────────────────── */
function enviarAgendamento() {
  const nome      = document.getElementById('nome').value.trim();
  const tel       = document.getElementById('telefone').value.trim();
  const email     = document.getElementById('email').value.trim();
  const modalidade = document.getElementById('modalidade').value;
  const mensagem  = document.getElementById('mensagem').value.trim();

  if (!nome) { alert('Por favor, informe seu nome.'); return; }

  const numero = '5521999384566';
  const texto  = encodeURIComponent(
    `Olá Angélica! Gostaria de agendar uma consulta.\n\n` +
    `*Nome:* ${nome}\n` +
    `*Telefone:* ${tel || 'não informado'}\n` +
    `*E-mail:* ${email || 'não informado'}\n` +
    `*Modalidade:* ${modalidade}\n` +
    `*Mensagem:* ${mensagem || '—'}`
  );

  window.open(`https://wa.me/${numero}?text=${texto}`, '_blank');
}
