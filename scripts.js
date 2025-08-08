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

  pauseBtn.addEventListener("click", () => playing ? pause() : play());
  nextBtn.addEventListener("click", () => { nextSlide(); if (playing) pause(); });
  prevBtn.addEventListener("click", () => { prevSlide(); if (playing) pause(); });

  showSlide(current);
  play();
}

createSlider("slider1", 10000);
createSlider("slider2", 10000);

// Fullscreen modal logic
const modal = document.getElementById("fullscreen-modal");
const modalImg = document.getElementById("modal-img");
const downloadBtn = document.getElementById("download-btn");

let zoom = 1;

function openModal(src) {
  modal.style.display = "block";
  modalImg.src = src;
  downloadBtn.href = src;
  zoom = 1;
  modalImg.style.transform = `scale(${zoom})`;
}

function closeModal() {
  modal.style.display = "none";
}

document.querySelectorAll(".clickable-image").forEach(img => {
  img.addEventListener("click", () => openModal(img.src));
});

document.querySelector(".modal .close").addEventListener("click", closeModal);

modal.addEventListener("click", (e) => {
  if (e.target === modal) closeModal();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModal();
  if (e.key === "+" || e.key === "=") zoomIn();
  if (e.key === "-") zoomOut();
  if (e.key === "ArrowRight") zoomIn();
  if (e.key === "ArrowLeft") zoomOut();
});

function zoomIn() {
  zoom += 0.1;
  modalImg.style.transform = `scale(${zoom})`;
}

function zoomOut() {
  zoom = Math.max(1, zoom - 0.1);
  modalImg.style.transform = `scale(${zoom})`;
}

modal.addEventListener("wheel", (e) => {
  e.preventDefault();
  e.deltaY < 0 ? zoomIn() : zoomOut();
});
