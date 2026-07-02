const heroTitle = document.getElementById('hero-heading');

if (heroTitle) {
  const text = heroTitle.innerHTML;
  const chars = text.split('');
  heroTitle.innerHTML = '';

  chars.forEach((char, index) => {
    const span = document.createElement('span');
    span.className = 'char';
    if (char === ' ') {
      span.innerHTML = '&nbsp;';
    } else {
      span.textContent = char;
    }
    heroTitle.appendChild(span);

    setTimeout(() => {
      span.classList.add('is-visible');
    }, 35 * index);
  });
}

const revealItems = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      }
    });
  },
  { threshold: 0.2 }
);

revealItems.forEach((item) => observer.observe(item));

const heroCard = document.querySelector('.hero-card');
if (heroCard) {
  setTimeout(() => heroCard.classList.add('is-visible'), 500);
}

const counters = document.querySelectorAll('.counter');
const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const target = Number(entry.target.getAttribute('data-target'));
        let current = 0;
        const increment = Math.max(1, Math.ceil(target / 40));
        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            entry.target.textContent = `${target}+`;
            clearInterval(timer);
          } else {
            entry.target.textContent = current;
          }
        }, 50);
        counterObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.6 }
);

counters.forEach((counter) => counterObserver.observe(counter));

const buttons = document.querySelectorAll('.magnetic');
buttons.forEach((button) => {
  button.addEventListener('mousemove', (event) => {
    const rect = button.getBoundingClientRect();
    const offsetX = event.clientX - rect.left;
    const offsetY = event.clientY - rect.top;
    const x = (offsetX / rect.width - 0.5) * 8;
    const y = (offsetY / rect.height - 0.5) * 8;
    button.style.transform = `translate(${x}px, ${y}px)`;
  });

  button.addEventListener('mouseleave', () => {
    button.style.transform = '';
  });
});

const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(open));
  });

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

document.querySelector('.contact-form')?.addEventListener('submit', (event) => {
  event.preventDefault();
});
