/* ----------------------- */
/* SECTION REVEAL ON BUTTON CLICK */
function revealSection(sectionId) {
  const section = document.getElementById(sectionId);
  if (section) {
    section.classList.remove("hidden");
    section.style.opacity = "1";
    section.style.transform = "translateY(0)";
    window.scrollTo({
      top: section.offsetTop - 50,
      behavior: 'smooth'
    });
  }
}

/* ----------------------- */
/* HEART CLICK INTERACTION */
function heartClicked() {
  const heart = document.getElementById("heart");
  const surprise = document.getElementById("surprise");

  heart.style.transform = "scale(1.5) rotate(15deg)";
  heart.style.transition = "transform 0.5s ease";
  
  setTimeout(() => {
    heart.style.transform = "scale(1) rotate(0deg)";
    revealSection('surprise');
  }, 500);
}

/* ----------------------- */
/* CONFETTI FUNCTION */
function showConfetti() {
  // Using simple canvas confetti
  const duration = 5 * 1000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 1000 };

  function randomInRange(min, max) {
    return Math.random() * (max - min) + min;
  }

  const interval = setInterval(function() {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 50 * (timeLeft / duration);
    confetti({
      particleCount,
      origin: { x: Math.random(), y: Math.random() - 0.2 },
      ...defaults
    });
  }, 250);
}

/* ----------------------- */
/* FIREWORKS BACKGROUND */
const canvas = document.getElementById('fireworks');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let fireworks = [];

function random(min, max) {
  return Math.random() * (max - min) + min;
}

function Firework() {
  this.x = random(0, canvas.width);
  this.y = canvas.height;
  this.targetY = random(100, canvas.height / 2);
  this.speed = random(3, 6);
  this.color = `hsl(${random(0, 360)}, 100%, 50%)`;
}

Firework.prototype.update = function() {
  this.y -= this.speed;
  if (this.y <= this.targetY) {
    explode(this.x, this.y, this.color);
    return false;
  }
  return true;
};

function explode(x, y, color) {
  for (let i = 0; i < 30; i++) {
    fireworks.push({
      x: x,
      y: y,
      vx: random(-5, 5),
      vy: random(-5, 5),
      alpha: 1,
      color: color
    });
  }
}

function update() {
  ctx.fillStyle = 'rgba(0,0,0,0.1)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Fireworks movement
  fireworks.forEach((f, i) => {
    f.x += f.vx;
    f.y += f.vy;
    f.alpha -= 0.02;
    ctx.fillStyle = `hsla(${f.color},${f.alpha})`;
    ctx.beginPath();
    ctx.arc(f.x, f.y, 3, 0, Math.PI * 2);
    ctx.fill();

    if (f.alpha <= 0) fireworks.splice(i, 1);
  });

  requestAnimationFrame(update);
}

// Spawn random fireworks
setInterval(() => {
  fireworks.push(new Firework());
}, 800);

update();

/* ----------------------- */
/* RESIZE CANVAS ON WINDOW CHANGE */
window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

/* ----------------------- */
/* OPTIONAL: SIMPLE CONFETTI LIBRARY */
function confetti({particleCount, origin, spread, startVelocity, ticks, zIndex}) {
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.style.position = 'fixed';
    particle.style.width = '6px';
    particle.style.height = '6px';
    particle.style.background = `hsl(${Math.random()*360}, 100%, 50%)`;
    particle.style.top = `${window.innerHeight * origin.y}px`;
    particle.style.left = `${window.innerWidth * origin.x}px`;
    particle.style.zIndex = zIndex;
    particle.style.borderRadius = '50%';
    document.body.appendChild(particle);

    const dx = random(-spread, spread);
    const dy = random(-spread, spread);
    const duration = ticks * 16;

    particle.animate([
      { transform: `translate(0,0)`, opacity: 1 },
      { transform: `translate(${dx}px, ${dy}px)`, opacity: 0 }
    ], {
      duration: duration,
      easing: 'ease-out'
    });

    setTimeout(() => particle.remove(), duration);
  }
}
