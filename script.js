// ===============================
// NAVBAR HAMBURGER TOGGLE
// ===============================
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navLinks.classList.toggle('show');
});

// ===============================
// SCROLL ANIMATIONS
// ===============================
const animatedElements = document.querySelectorAll('.animate-fade-in, .animate-slide-up');

const revealOnScroll = () => {
  const triggerBottom = window.innerHeight * 0.85;

  animatedElements.forEach(el => {
    const boxTop = el.getBoundingClientRect().top;
    if (boxTop < triggerBottom) {
      el.classList.add('animate-visible');
    }
  });
};

window.addEventListener('scroll', revealOnScroll);
window.addEventListener('load', revealOnScroll);

// ===============================
// BACK TO TOP BUTTON
// ===============================
const backToTopBtn = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  if (window.scrollY > 300) {
    backToTopBtn.style.display = 'block';
  } else {
    backToTopBtn.style.display = 'none';
  }
});

backToTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ===============================
// NEWSLETTER FORM VALIDATION
// ===============================
const newsletterForm = document.querySelector('.newsletter-form');

if (newsletterForm) {
  newsletterForm.addEventListener('submit', e => {
    e.preventDefault();
    const emailInput = newsletterForm.querySelector('input[type="email"]');
    const email = emailInput.value.trim();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      alert('Please enter a valid email address.');
      return;
    }

    // Placeholder: handle subscription logic
    alert('Thank you for subscribing!');
    emailInput.value = '';
  });
}
