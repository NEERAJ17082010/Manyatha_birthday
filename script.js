const pages = document.querySelectorAll('.page');
const dots = document.querySelectorAll('.dot');
const backBtn = document.querySelector('.back-btn');
const forwardBtn = document.querySelector('.forward-btn');
const surpriseBtn = document.getElementById('btn');
const balloonsContainer = document.getElementById('balloons');
const finalText = document.getElementById('finalText');
let currentPage = 0;
let alreadyOpened = false;

// Random initial glow
(function randomGlow() {
  const colors = ['#7f5af0', '#ff7ac7', '#00eaff', '#ffd166', '#06d6a0'];
  const chosen = colors[Math.floor(Math.random() * colors.length)];
  document.documentElement.style.setProperty('--glow-color', chosen);
})();

// Greeting
function getGreeting() {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "Good morning 🌤️";
  if (hour >= 12 && hour < 17) return "Good afternoon ☀️";
  if (hour >= 17 && hour < 21) return "Good evening 🌙";
  return "Hey, night owl ✨";
}
finalText.textContent = `${getGreeting()}, Happy Birthday! 💫`;

// Update page
function goToPage(index) {
  if (index < 0 || index >= pages.length) return;

  pages.forEach(p => p.classList.remove('active'));
  dots.forEach(d => d.classList.remove('active'));

  pages[index].classList.add('active');
  dots[index].classList.add('active');

  currentPage = index;

  // Update glow color
  const color = pages[index].getAttribute('data-color');
  document.documentElement.style.setProperty('--glow-color', color);

  // Update button states
  backBtn.disabled = index === 0;
  forwardBtn.disabled = index === pages.length - 1;

  // Finale on last page
  if (index === pages.length - 1) {
    setTimeout(() => {
      createBalloons(20);
      bigFinaleSurprise();
    }, 600);
  }
}

// Navigation buttons
backBtn.addEventListener('click', () => goToPage(currentPage - 1));
forwardBtn.addEventListener('click', () => goToPage(currentPage + 1));

// Surprise button starts the journey
surpriseBtn.addEventListener('click', () => {
  if (alreadyOpened) return;
  alreadyOpened = true;
  goToPage(1);
  createBalloons(12);
  startConfetti();
  surpriseBtn.style.display = 'none';
});

// Swipe & keyboard still work (optional, kept from previous)
document.addEventListener('keydown', (e) => {
  if (!alreadyOpened) return;
  if (e.key === 'ArrowRight') goToPage(currentPage + 1);
  if (e.key === 'ArrowLeft') goToPage(currentPage - 1);
});

// Touch swipe
let touchStartX = 0;
document.addEventListener('touchstart', e => touchStartX = e.changedTouches[0].screenX, { passive: true });
document.addEventListener('touchend', e => {
  if (!alreadyOpened) return;
  const diff = touchStartX - e.changedTouches[0].screenX;
  if (Math.abs(diff) > 50) {
    if (diff > 0) goToPage(currentPage + 1);
    else goToPage(currentPage - 1);
  }
}, { passive: true });

// Balloons, Confetti, and Finale functions remain the same as previous version
// (createBalloons, startConfetti, animateConfetti, bigFinaleSurprise)

function createBalloons(count = 12) {
  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      const balloon = document.createElement('div');
      balloon.className = 'balloon';
      balloon.style.left = Math.random() * 90 + 'vw';
      balloon.style.animationDuration = (8 + Math.random() * 6) + 's';
      balloon.style.background = `hsl(${Math.random() * 360}, 80%, 65%)`;
      
      balloon.addEventListener('click', () => {
        balloon.style.transform = 'scale(0)';
        balloon.style.opacity = '0';
        startConfetti();
        setTimeout(() => balloon.remove(), 300);
      });
      
      balloonsContainer.appendChild(balloon);
    }, i * 300);
  }
}

const canvas = document.getElementById('confetti');
const ctx = canvas.getContext('2d');
let confettiParticles = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

function startConfetti() {
  const colors = ['#ff7ac7', '#00eaff', '#ffd166', '#ff6b6b', '#4ecdc4', '#a29bfe'];
  for (let i = 0; i < 60; i++) {
    confettiParticles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      w: Math.random() * 12 + 4,
      h: Math.random() * 8 + 2,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      speed: Math.random() * 6 + 3,
      spin: Math.random() * 0.2 - 0.1
    });
  }
}

function animateConfetti() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  confettiParticles.forEach((p, i) => {
    p.y += p.speed;
    p.rotation += p.spin;
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation * Math.PI / 180);
    ctx.fillStyle = p.color;
    ctx.fillRect(-p.w/2, -p.h/2, p.w, p.h);
    ctx.restore();
    if (p.y > canvas.height) confettiParticles.splice(i, 1);
  });
  requestAnimationFrame(animateConfetti);
}
animateConfetti();

function bigFinaleSurprise() {
  let bursts = 0;
  const interval = setInterval(() => {
    if (bursts >= 10) clearInterval(interval);
    for (let i = 0; i < 100; i++) {
      confettiParticles.push({
        x: canvas.width / 2 + (Math.random() - 0.5) * 500,
        y: canvas.height / 2 + (Math.random() - 0.5) * 400,
        w: Math.random() * 16 + 8,
        h: Math.random() * 12 + 4,
        color: ['#ffd166', '#ff7ac7', '#00eaff', '#ff6b6b'][Math.floor(Math.random() * 4)],
        rotation: Math.random() * 360,
        speed: Math.random() * 12 + 6,
        spin: Math.random() * 0.4 - 0.2
      });
    }
    bursts++;
  }, 350);
}

// Initialize
goToPage(0); // Sets initial button states
