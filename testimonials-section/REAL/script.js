const section = document.querySelector('.timeline-section');
const line = document.querySelector('.timeline-indicator .line');

window.addEventListener('scroll', () => {
  const rect = section.getBoundingClientRect();
  const windowHeight = window.innerHeight;

  // قبل دخول السكشن → الخط مخفي
  if (rect.top >= windowHeight) {
    line.style.height = '0px';
    return;
  }

  // بعد الدخول
  const scrolled = windowHeight - rect.top - 180;
  const maxHeight = section.offsetHeight - 200;

  const height = Math.max(0, Math.min(scrolled, maxHeight));
  line.style.height = height + 'px';
});
