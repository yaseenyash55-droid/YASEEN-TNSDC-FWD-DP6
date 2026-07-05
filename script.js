const typingText = document.querySelector(".typing");
const words = ["Web Developer", "UI/UX Designer", "Problem Solver"];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;

function type() {
  const currentWord = words[wordIndex];
  if (isDeleting) {
    typingText.textContent = currentWord.substring(0, charIndex--);
  } else {
    typingText.textContent = currentWord.substring(0, charIndex++);
  }

  if (!isDeleting && charIndex === currentWord.length) {
    isDeleting = true;
    setTimeout(type, 1200);
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    wordIndex = (wordIndex + 1) % words.length;
    setTimeout(type, 400);
  } else {
    setTimeout(type, isDeleting ? 60 : 120);
  }
}
if (typingText) type();

document.addEventListener('DOMContentLoaded', function () {
  const toggle = document.getElementById('theme-toggle');
  const icon = document.getElementById('theme-toggle-icon');
  const body = document.body;

  // Load saved theme
  if (localStorage.getItem('theme') === 'light') {
    body.classList.add('light-mode');
    if (icon) icon.textContent = '☀️';
  } else {
    if (icon) icon.textContent = '🌙';
  }

  toggle.addEventListener('click', function () {
    body.classList.toggle('light-mode');
    const isLight = body.classList.contains('light-mode');
    if (icon) icon.textContent = isLight ? '☀️' : '🌙';
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
  });

  // Dashboard card navigation
  const dashboardCards = document.querySelectorAll('.dashboard-card.selectable');
  dashboardCards.forEach(card => {
    card.addEventListener('click', function () {
      // Remove 'selected' from all cards
      dashboardCards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');

      // Hide all main sections except the selected one
      const section = card.getAttribute('data-section');
      const sections = document.querySelectorAll(
        '.about-section, .education-section, .projects-section, .certificates-section, .skills-section'
      );
      sections.forEach(sec => sec.style.display = 'none');
      
      if (section === 'projects') {
        document.querySelector('.projects-section').style.display = 'block';
      } else if (section === 'skills') {
        document.querySelector('.skills-section').style.display = 'block';
      } else if (section === 'certificates') {
        document.querySelector('.certificates-section').style.display = 'block';
      }
    });
  });

  // Smooth scroll links & update active side nav state
  const sidebarLinks = document.querySelectorAll('.sidebar-nav a');
  const sections = document.querySelectorAll('main > section');

  // Handle active class updates on scroll
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (pageYOffset >= sectionTop - 150) {
        current = section.getAttribute('id');
      }
    });

    sidebarLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
});
