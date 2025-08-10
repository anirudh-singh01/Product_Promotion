/* scripts.js
   Handles:
   - multiple independent sliders (auto-play, prev/next/pause)
   - counters
   - clicking images opens fullscreen modal + download link
*/

document.addEventListener('DOMContentLoaded', () => {
  // Initialize sliders
  const sliders = document.querySelectorAll('.slider');

  const sliderState = new Map();

  sliders.forEach(slider => {
    const id = slider.id || `slider-${Math.random().toString(36).slice(2,9)}`;
    slider.id = id;
    const slides = Array.from(slider.querySelectorAll('.slide'));
    const controls = document.querySelector(`.slider-controls[data-slider="${id}"]`);
    const intervalMs = parseInt(slider.dataset.interval || 4000, 10);

    // initial state
    const state = {
      idx: slides.findIndex(s => s.classList.contains('active')) >= 0 ? slides.findIndex(s => s.classList.contains('active')) : 0,
      timer: null,
      playing: true,
      slides,
      intervalMs,
      controls
    };

    // ensure only one active
    slides.forEach((s, i) => s.classList.toggle('active', i === state.idx));
    updateCounter(controls, state.idx + 1, slides.length);

    // auto-play
    state.timer = setInterval(() => slideTo(slider, state, state.idx + 1), intervalMs);

    // wire controls
    if (controls) {
      controls.addEventListener('click', (ev) => {
        const action = ev.target.closest('button')?.dataset?.action;
        if (!action) return;
        if (action === 'prev') {
          slideTo(slider, state, state.idx - 1);
          restartTimer(state);
        } else if (action === 'next') {
          slideTo(slider, state, state.idx + 1);
          restartTimer(state);
        } else if (action === 'pause') {
          if (state.playing) {
            clearInterval(state.timer);
            state.playing = false;
            ev.target.innerText = '▶️';
          } else {
            state.timer = setInterval(() => slideTo(slider, state, state.idx + 1), state.intervalMs);
            state.playing = true;
            ev.target.innerText = '⏸️';
          }
        }
      });
    }

    // store
    sliderState.set(id, state);
  });

  function slideTo(slider, state, newIdx) {
    const { slides } = state;
    const len = slides.length;
    const wrapped = ((newIdx % len) + len) % len; // wrap properly
    if (wrapped === state.idx) return;
    slides[state.idx].classList.remove('active');
    slides[wrapped].classList.add('active');
    state.idx = wrapped;
    if (state.controls) updateCounter(state.controls, state.idx + 1, len);
    else {
      // find controls
      const ctrls = document.querySelector(`.slider-controls[data-slider="${slider.id}"]`);
      if (ctrls) updateCounter(ctrls, state.idx + 1, len);
    }
  }

  function restartTimer(state) {
    if (!state.playing) return;
    clearInterval(state.timer);
    state.timer = setInterval(() => slideTo(document.getElementById(state.slides[0].closest('.slider').id), state, state.idx + 1), state.intervalMs);
  }

  function updateCounter(controlsEl, current, total) {
    const span = controlsEl.querySelector('.counter');
    if (span) span.textContent = `${current} of ${total}`;
  }

  /* Modal open/close + download */
  const modal = document.getElementById('fullscreen-modal');
  const modalImg = document.getElementById('modal-img');
  const downloadBtn = document.getElementById('download-btn');
  const closeBtn = modal.querySelector('.modal-close');

  document.body.addEventListener('click', (ev) => {
    const img = ev.target.closest('.clickable-image');
    if (!img) return;
    // open modal
    const src = img.getAttribute('src');
    const alt = img.getAttribute('alt') || '';
    modalImg.src = src;
    modalImg.alt = alt;
    downloadBtn.href = src;
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  });

  function closeModal() {
    modal.setAttribute('aria-hidden', 'true');
    modalImg.src = '';
    document.body.style.overflow = '';
  }

  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // close on ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false') closeModal();
  });
});
