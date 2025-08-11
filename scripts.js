document.addEventListener('DOMContentLoaded', () => {
  const sliders = document.querySelectorAll('.slider');
  const sliderState = new Map();
  let visibilityPaused = false;

  sliders.forEach(slider => {
    const id = slider.id || `slider-${Math.random().toString(36).slice(2,9)}`;
    slider.id = id;
    const slides = [...slider.querySelectorAll('.slide')];
    const controls = document.querySelector(`.slider-controls[data-slider="${id}"]`);
    const intervalMs = +slider.dataset.interval || 12000;
    let idx = slides.findIndex(s => s.classList.contains('active'));
    if (idx < 0) idx = 0;

    const state = { idx, timer: null, playing: true, slides, intervalMs, controls, slider };

    slides.forEach((s, i) => s.classList.toggle('active', i === idx));
    updateCounter(controls, idx + 1, slides.length);

    const autoSlide = () => {
      if (!state.playing || visibilityPaused) return;
      slideTo(state, state.idx + 1);
      state.timer = setTimeout(autoSlide, state.intervalMs);
    };
    state.timer = setTimeout(autoSlide, state.intervalMs);

    controls?.addEventListener('click', e => {
      const action = e.target.closest('button')?.dataset?.action;
      if (!action) return;
      if (action === 'prev') slideTo(state, state.idx - 1);
      if (action === 'next') slideTo(state, state.idx + 1);
      if (action === 'pause') {
        state.playing = !state.playing;
        e.target.innerText = state.playing ? '⏸️' : '▶️';
        if (state.playing) state.timer = setTimeout(autoSlide, state.intervalMs);
      }
    });

    sliderState.set(id, state);
  });

  function slideTo(state, newIdx) {
    const { slides } = state;
    const len = slides.length;
    const wrapped = ((newIdx % len) + len) % len;
    if (wrapped === state.idx) return;
    slides[state.idx].classList.remove('active');
    slides[wrapped].classList.add('active');
    state.idx = wrapped;
    updateCounter(state.controls, state.idx + 1, len);
  }

  function updateCounter(controlsEl, current, total) {
    const span = controlsEl?.querySelector('.counter');
    if (span) span.textContent = `${current} of ${total}`;
  }

  // Pause sliders when tab is inactive
  document.addEventListener('visibilitychange', () => {
    visibilityPaused = document.hidden;
  });

  // Modal handling
  const modal = document.getElementById('fullscreen-modal');
  const modalImg = document.getElementById('modal-img');
  const downloadBtn = document.getElementById('download-btn');
  const closeBtn = modal.querySelector('.modal-close');

  document.body.addEventListener('click', e => {
    const img = e.target.closest('.clickable-image');
    if (!img) return;
    modalImg.src = img.src;
    modalImg.alt = img.alt || '';
    downloadBtn.href = img.src;
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  });

  function closeModal() {
    modal.setAttribute('aria-hidden', 'true');
    modalImg.src = '';
    document.body.style.overflow = '';
  }
  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false') closeModal(); });
});
