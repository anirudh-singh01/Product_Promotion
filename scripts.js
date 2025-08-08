function createSlider(sliderId, intervalTime = 10000) {
  const container = document.getElementById(sliderId);
  const slides = container.getElementsByTagName("img");
  const controls = document.querySelector(`.slider-controls[data-slider="${sliderId}"]`);
  const counter = controls.querySelector(".counter");
  const pauseBtn = controls.querySelector('[data-action="pause"]');
  const nextBtn = controls.querySelector('[data-action="next"]');
  const prevBtn = controls.querySelector('[data-action="prev"]');

  let current = 0;
  let playing = true;
  let interval;

  function updateCounter() {
    counter.textContent = `${current + 1} of ${slides.length}`;
  }

  function showSlide(index) {
    Array.from(slides).forEach(slide => slide.classList.remove("active"));
    slides[index].classList.add("active");
    updateCounter();
  }

  function nextSlide() {
    current = (current + 1) % slides.length;
    showSlide(current);
  }

  function prevSlide() {
    current = (current - 1 + slides.length) % slides.length;
    showSlide(current);
  }

  function play() {
    interval = setInterval(nextSlide, intervalTime);
    playing = true;
    pauseBtn.textContent = "⏸️";
  }

  function pause() {
    clearInterval(interval);
    playing = false;
    pauseBtn.textContent = "▶️";
  }

  pauseBtn.addEventListener("click", () => {
    playing ? pause() : play();
  });

  nextBtn.addEventListener("click", () => {
    nextSlide();
    if (playing) pause();
  });

  prevBtn.addEventListener("click", () => {
    prevSlide();
    if (playing) pause();
  });

  // Init
  showSlide(current);
  play();
}

// Create both sliders
createSlider("slider1", 10000);
createSlider("slider2", 10000);

// Fullscreen Viewer
document.querySelectorAll(".clickable").forEach(img => {
  img.addEventListener("click", () => {
    const viewer = document.getElementById("fullscreenViewer");
    const viewerImg = document.getElementById("fullscreenImage");
    viewerImg.src = img.src;
    viewer.style.display = "flex";
  });
});

document.querySelector(".fullscreen .close").addEventListener("click", () => {
  document.getElementById("fullscreenViewer").style.display = "none";
});
