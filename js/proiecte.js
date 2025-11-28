// Active states

const links = document.querySelectorAll('#navLinks a');
const currentUrl = window.location.href;

links.forEach(link => {
  if (link.href === currentUrl) {
    link.classList.add('scale-102', 'text-lime-200');
  }
});

// Dark Mode

const themeButtons = document.querySelectorAll(".themeToggle");
const html = document.documentElement;

function updateDots(isDark) {
  themeButtons.forEach(btn => {
    const themeDot = btn.querySelector(".themeDot");
    themeDot.classList.toggle("left-1", !isDark);
    themeDot.classList.toggle("right-1", isDark);
  });
}

let isDark = localStorage.theme === "dark" || (!localStorage.theme && window.matchMedia("(prefers-color-scheme:dark)").matches);
html.classList.toggle("dark", isDark);
updateDots(isDark);

themeButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    isDark = !isDark;
    html.classList.toggle("dark", isDark);
    localStorage.theme = isDark ? "dark" : "light";
    updateDots(isDark);
  })
})

// Hamburger menu

const btnMenu = document.getElementById("btnMenu");
const sidebar = document.getElementById("sidebar");
const sideBarBackdrop = document.getElementById("sidebarBackdrop");
const closeSidebar = document.getElementById("closeSidebar");
const sidebarContent = sidebar.querySelector("aside");

btnMenu.addEventListener("click", () => {
  sidebar.classList.remove("opacity-0", "pointer-events-none");
  sideBarBackdrop.classList.remove("opacity-40");
  sidebarContent.classList.remove("-translate-x-full");
  btnMenu.classList.add("hidden");
});


const close = () => {
  sidebarContent.classList.add("-translate-x-full");
  sideBarBackdrop.classList.add("opacity-30");
  sidebar.classList.add("opacity-0", "pointer-events-none");
  btnMenu.classList.remove("hidden");
};


sideBarBackdrop.addEventListener("click", close);
closeSidebar.addEventListener("click", close);


document.addEventListener("keydown", e => {
  if (e.key === "Escape" && !sidebar.classList.contains("pointer-events-none")) close();
});

// Portfolio Modal - GALLERY VERSION

(function () {
  const modal = document.getElementById("modal");
  const modalImg = document.getElementById("modalImg");
  const modalTitle = document.getElementById("modalTitle");
  const modalDesc = document.getElementById("modalDesc");
  const closeModal = document.getElementById("closeModal");
  const nextBtn = document.getElementById("nextImg");
  const prevBtn = document.getElementById("prevImg");

  let images = [];
  let currentIndex = 0;

  // Utility: open modal (ensure modal becomes a flex container)
  function openModal() {
    modal.classList.remove("opacity-0", "pointer-events-none");
    modal.classList.add("flex", "opacity-100");
  }

  function hideModal() {
    modal.classList.remove("opacity-100", "flex");
    modal.classList.add("opacity-0", "pointer-events-none");
  }

  // Load cards (use a more specific selector if you have many .group elements)
  document.querySelectorAll(".project-card, .group.project-card").forEach(card => {
    card.addEventListener("click", () => {
      const raw = card.dataset.images || card.dataset.img || "";
      // accept either data-images or data-img (backwards compat). split+trim.
      images = raw.split(",").map(s => s.trim()).filter(Boolean);
      if (images.length === 0) return; // nothing to show

      currentIndex = 0;
      modalTitle.textContent = card.dataset.title || "";
      modalDesc.textContent = card.dataset.desc || "";
      updateImage(true);
      openModal();
    });
  });

  function updateImage(initial = false) {
    // Fade out / in
    modalImg.style.opacity = 0;
    // If initial, no delay so open looks snappy
    const delay = initial ? 0 : 150;
    setTimeout(() => {
      modalImg.src = images[currentIndex];
      modalImg.setAttribute("alt", modalTitle.textContent || `Image ${currentIndex + 1}`);
      modalImg.style.opacity = 1;
    }, delay);
  }

  function nextImage() {
    if (!images.length) return;
    currentIndex = (currentIndex + 1) % images.length;
    updateImage();
  }

  function prevImage() {
    if (!images.length) return;
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    updateImage();
  }

  // Buttons
  nextBtn.addEventListener("click", (e) => { e.stopPropagation(); nextImage(); });
  prevBtn.addEventListener("click", (e) => { e.stopPropagation(); prevImage(); });

  // Close handlers
  closeModal.addEventListener("click", hideModal);
  modal.addEventListener("click", e => {
    // click on backdrop closes (but not clicks inside the modal content)
    if (e.target === modal) hideModal();
  });

  // Keyboard navigation
  document.addEventListener("keydown", (e) => {
    if (!modal.classList.contains("opacity-100")) return;
    if (e.key === "ArrowRight") nextImage();
    if (e.key === "ArrowLeft") prevImage();
    if (e.key === "Escape") hideModal();
  });

  // Swipe support on the image
  let startX = 0;
  modalImg.addEventListener("touchstart", (e) => {
    if (!e.touches || !e.touches[0]) return;
    startX = e.touches[0].clientX;
  }, {passive: true});

  modalImg.addEventListener("touchend", (e) => {
    if (!e.changedTouches || !e.changedTouches[0]) return;
    const endX = e.changedTouches[0].clientX;
    const diff = startX - endX;
    if (diff > 50) nextImage();      // swipe left
    if (diff < -50) prevImage();     // swipe right
  });

  // Small sanity helper: log any missing references in console
  if (!modal || !modalImg || !closeModal || !nextBtn || !prevBtn) {
    console.warn("Gallery modal: missing one or more required elements (#modal, #modalImg, #closeModal, #nextImg, #prevImg).");
  }
})();