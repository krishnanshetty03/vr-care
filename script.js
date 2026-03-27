// VR Care - Interactivity Script

// Navbar scroll effect
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 20) {
    navbar.style.background = 'rgba(7, 13, 26, 0.95)';
    navbar.style.borderBottomColor = 'rgba(0, 201, 167, 0.15)';
  } else {
    navbar.style.background = 'rgba(11, 17, 32, 0.85)';
    navbar.style.borderBottomColor = 'rgba(255, 255, 255, 0.08)';
  }
});

// Mobile Menu Toggle
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const navLinks = document.getElementById('nav-links');

if (mobileMenuBtn && navLinks) {
  mobileMenuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    
    // Simple icon animation
    const isActive = navLinks.classList.contains('active');
    mobileMenuBtn.style.transform = isActive ? 'rotate(90deg)' : 'rotate(0)';
  });

  // Close menu when clicking a link
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
      mobileMenuBtn.style.transform = 'rotate(0)';
    });
  });
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href !== '#') {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  });
});

// ===========================
// Animated Counter on Scroll
// ===========================
function animateCounters() {
  const counters = document.querySelectorAll('.counter');
  
  counters.forEach(counter => {
    const target = parseInt(counter.getAttribute('data-target'));
    const duration = 2000; // 2 seconds
    const startTime = performance.now();
    
    function updateCounter(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease-out cubic for a nice deceleration effect
      const easeOut = 1 - Math.pow(1 - progress, 3);
      
      const currentValue = Math.round(easeOut * target);
      counter.textContent = currentValue;
      
      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        counter.textContent = target;
      }
    }
    
    requestAnimationFrame(updateCounter);
  });
}

// Intersection Observer to trigger counter animation on scroll
let countersAnimated = false;

const statsSection = document.getElementById('stats');
if (statsSection) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !countersAnimated) {
        countersAnimated = true;
        animateCounters();
      }
    });
  }, {
    threshold: 0.3 // Trigger when 30% of the section is visible
  });

  observer.observe(statsSection);
}

// ===========================
// Insights Carousel Auto-Scroll
// ===========================
const insightsCarousel = document.getElementById('insights-carousel');

if (insightsCarousel) {
  let autoScrollInterval;
  let scrollDirection = 1;

  function getCardScrollAmount() {
    const card = insightsCarousel.querySelector('.insight-card');
    if (!card) return 300;
    return card.offsetWidth + 24; // card width + gap
  }

  function autoScroll() {
    const maxScroll = insightsCarousel.scrollWidth - insightsCarousel.clientWidth;
    const currentScroll = insightsCarousel.scrollLeft;
    const scrollAmount = getCardScrollAmount();

    if (currentScroll >= maxScroll - 5) {
      // At the end, scroll back to start smoothly
      insightsCarousel.scrollTo({ left: 0, behavior: 'smooth' });
    } else {
      insightsCarousel.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  }

  function startAutoScroll() {
    stopAutoScroll();
    autoScrollInterval = setInterval(autoScroll, 4000);
  }

  function stopAutoScroll() {
    clearInterval(autoScrollInterval);
  }

  // Pause on hover
  insightsCarousel.addEventListener('mouseenter', stopAutoScroll);
  insightsCarousel.addEventListener('mouseleave', startAutoScroll);

  // Drag to scroll support
  let isDown = false;
  let startX;
  let scrollLeft;

  insightsCarousel.addEventListener('mousedown', (e) => {
    isDown = true;
    insightsCarousel.style.cursor = 'grabbing';
    startX = e.pageX - insightsCarousel.offsetLeft;
    scrollLeft = insightsCarousel.scrollLeft;
  });

  insightsCarousel.addEventListener('mouseleave', () => {
    isDown = false;
    insightsCarousel.style.cursor = 'grab';
  });

  insightsCarousel.addEventListener('mouseup', () => {
    isDown = false;
    insightsCarousel.style.cursor = 'grab';
  });

  insightsCarousel.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - insightsCarousel.offsetLeft;
    const walk = (x - startX) * 2;
    insightsCarousel.scrollLeft = scrollLeft - walk;
  });

  // Start auto-scrolling
  startAutoScroll();
}

// ===========================
// Consultation Modal
// ===========================
const modal = document.getElementById('consultationModal');
const modalClose = document.getElementById('modalClose');

function openModal() {
  if (!modal) return;
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  modal.classList.remove('active');
  document.body.style.overflow = '';
}

// Close on X button
if (modalClose) {
  modalClose.addEventListener('click', closeModal);
}

// Close on overlay click (outside the form)
if (modal) {
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });
}

// Close on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
    closeModal();
  }
});

// Open modal from all "Book Consultation" and "Book Free Consultation" buttons
document.querySelectorAll('.btn-cta, .btn-primary, .btn-cta-partner').forEach(btn => {
  btn.addEventListener('click', (e) => {
    // Skip if this is an external link (e.g. Google Forms on Leaders Circle page)
    if (btn.getAttribute('target') === '_blank') return;
    e.preventDefault();
    openModal();
  });
});

// Also open from navbar Book Consultation button
const navBookBtn = document.querySelector('.nav-cta');
if (navBookBtn) {
  navBookBtn.addEventListener('click', (e) => {
    // Skip if this is an external link (e.g. Google Forms on Leaders Circle page)
    if (navBookBtn.getAttribute('target') === '_blank') return;
    e.preventDefault();
    openModal();
  });
}

// Form submission handler
const consultationForm = document.getElementById('consultationForm');
if (consultationForm) {
  consultationForm.addEventListener('submit', (e) => {
    e.preventDefault();
    // Show success feedback
    const submitBtn = consultationForm.querySelector('.btn-submit');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '✓ Request Sent!';
    submitBtn.style.background = '#059669';
    
    setTimeout(() => {
      submitBtn.innerHTML = originalText;
      submitBtn.style.background = '';
      closeModal();
      consultationForm.reset();
    }, 2000);
  });
}
