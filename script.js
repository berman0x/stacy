/* Minimal starter behavior for the experience.
   - Intro typed animation
   - Background/time-of-day class
   - Birthday clock counting upward (since midnight by default)
   - Simple reveal hooks for IntersectionObserver
   - Letter open/close micro interaction
   - Placeholders & comments where to extend (GSAP sequences, confetti, ripples, constellations)
*/

/* Utility: DOM ready */
document.addEventListener('DOMContentLoaded', () => {
  const introEl = document.getElementById('intro');
  const appEl = document.getElementById('app');

  // 1) Typed.js intro (loading sequence)
  const typed = new Typed('#typed-intro', {
    strings: [
      'Initializing Birthday Experience...',
      'Loading Memories...',
      'Rendering Character...',
      'Preparing Something Special...',
      'Done.'
    ],
    typeSpeed: 38,
    backSpeed: 14,
    backDelay: 600,
    showCursor: false,
    onComplete: () => {
      // fade intro then show app
      introEl.style.transition = 'opacity 800ms ease';
      introEl.style.opacity = 0;
      setTimeout(() => introEl.classList.add('hidden'), 900);
      appEl.classList.remove('hidden');
      // start page micro-animations
      startExperience();
    }
  });

  // 2) Set theme based on local time
  setTimeOfDayClass();

  // 3) Birthday clock (counts upward). By default, counts since local start of the birthday (midnight).
  startBirthdayClock();

  // 4) Intersection Observer for reveal sections
  setupRevealObserver();

  // 5) Letter open/close
  setupLetter();

  // 6) Accessibility: enable keyboard reveal for flip-cards (simple)
  document.querySelectorAll('.flip-card').forEach(card => {
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        card.classList.toggle('flipped');
      }
    });
    card.addEventListener('click', () => card.classList.toggle('flipped'));
  });
});

/* ---- Helpers ---- */

function startExperience(){
  // Example: subtle hero entrance via GSAP
  if (window.gsap) {
    gsap.from('.title', {y: 18, opacity: 0, duration: 1.0, ease: 'power3.out'});
    gsap.from('.subtitle', {y: 10, opacity: 0, duration: 1.0, delay: 0.18, ease: 'power3.out'});
    gsap.from('#birthday-clock', {y: 6, opacity: 0, duration: 0.9, delay: 0.36});
  }
  // TODO: start floating particles, subtle background motion, etc.
}

/* Time of day background class */
function setTimeOfDayClass(){
  const hour = new Date().getHours();
  const body = document.body;
  // Morning: 5-11, Afternoon: 11-17, Evening: 17-20, Night: 20-5
  if (hour >= 5 && hour < 11) body.classList.add('morning'); // soft sunrise
  else if (hour >= 11 && hour < 17) body.classList.add('afternoon');
  else if (hour >= 17 && hour < 20) body.classList.add('evening');
  else body.classList.add('night');
  // You can use these classes in CSS to change variables or backgrounds.
}

/* Birthday clock: counts upward.
   By default counts since local midnight of today. Replace `start` with a specific birthday start time if desired.
*/
function startBirthdayClock(){
  // Option: change this to a specific start (e.g., new Date('2026-07-29T07:00:00'))
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);

  const hEl = document.getElementById('clock-hours');
  const mEl = document.getElementById('clock-minutes');
  const sEl = document.getElementById('clock-seconds');

  function update(){
    const diff = Math.max(0, Date.now() - start.getTime());
    const seconds = Math.floor(diff / 1000) % 60;
    const minutes = Math.floor(diff / (1000 * 60)) % 60;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    hEl.textContent = String(hours).padStart(2, '0');
    mEl.textContent = String(minutes).padStart(2, '0');
    sEl.textContent = String(seconds).padStart(2, '0');
  }
  update();
  setInterval(update, 1000);
}

/* IntersectionObserver for reveals (timeline, sections) */
function setupRevealObserver(){
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      }
    });
  }, {threshold: 0.18});

  document.querySelectorAll('.reveal-section').forEach(el => io.observe(el));
}

/* Letter micro-interaction */
function setupLetter(){
  const openBtn = document.getElementById('open-letter');
  const closeBtn = document.getElementById('close-letter');
  const letter = document.getElementById('letter-content');

  openBtn.addEventListener('click', () => {
    letter.classList.remove('hidden');
    openBtn.setAttribute('aria-expanded', 'true');
    // gentle GSAP unfold if available
    if (window.gsap) {
      gsap.fromTo(letter, {y: 12, opacity: 0}, {y:0,opacity:1,duration:0.6,ease:'power3.out'});
    }
  });
  closeBtn.addEventListener('click', () => {
    if (window.gsap) {
      gsap.to(letter, {y: 12, opacity: 0, duration:0.4, onComplete:() => letter.classList.add('hidden')});
    } else {
      letter.classList.add('hidden');
    }
    openBtn.setAttribute('aria-expanded', 'false');
  });
}

/* END starter */
