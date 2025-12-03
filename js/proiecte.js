// Active states

const links = document.querySelectorAll('#navLinks a');
const currentUrl = window.location.href;

links.forEach(link => {
  if (link.href === currentUrl) {
    link.classList.add('scale-102', 'text-lime-200');
  }
});

// Submenu

document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("mobileSubmenuToggle");
  const submenu = document.getElementById("mobileSubmenu");
  const arrow = document.getElementById("mobileArrow");

  if (toggle && submenu && arrow) {
    toggle.addEventListener("click", () => {
      submenu.classList.toggle("hidden");
      arrow.classList.toggle("rotate-180");
    });
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
  let activeCard = null;
  let currentIndex = 0;

  function openModal() {
    modal.classList.remove("opacity-0", "pointer-events-none");
    modal.classList.add("flex", "opacity-100");
  }

  function hideModal() {
    modal.classList.remove("opacity-100");
    modal.classList.add("opacity-0", "pointer-events-none");

    const onTransitionEnd = (e) => {
      if (e.target === modal && e.propertyName === 'opacity') {
        modal.classList.remove('flex');
        modal.removeEventListener('transitionend', onTransitionEnd);
      }
    };
    modal.addEventListener('transitionend', onTransitionEnd);
  }

  // Helper: check if an image can be loaded (with timeout)
  function checkImageExists(src, timeout = 5000) {
    return new Promise(resolve => {
      if (!src) return resolve(false);
      const img = new Image();
      let done = false;
      const cleanup = () => { img.onload = img.onerror = null; clearTimeout(t); };
      img.onload = () => { if (done) return; done = true; cleanup(); resolve(true); };
      img.onerror = () => { if (done) return; done = true; cleanup(); resolve(false); };
      img.src = src;
      const t = setTimeout(() => { if (done) return; done = true; cleanup(); resolve(false); }, timeout);
    });
  }

  document.querySelectorAll(".project-card, .group.project-card").forEach(card => {
    card.addEventListener("click", async () => {
      activeCard = card;
      const raw = card.dataset.images || card.dataset.img || "";
      const candidateImages = raw.split(",").map(s => s.trim()).filter(Boolean);

      // Validate each candidate image and keep only those that successfully load.
      const validated = [];
      for (const src of candidateImages) {
        try {
          // note: encodeURI to avoid spaces breaking the loader
          const ok = await checkImageExists(encodeURI(src));
          if (ok) validated.push(src);
        } catch (err) { }
      }

      // If none of the provided images load, fall back to the card thumbnail (if any)
      if (validated.length === 0) {
        const thumb = card.querySelector('img');
        images = thumb && thumb.src ? [thumb.src] : [];
      } else {
        images = validated;
      }

      if (images.length === 0) return;

      currentIndex = 0;
      modalTitle.textContent = card.dataset.title || "";
      modalDesc.textContent = card.dataset.desc || "";
      updateImage(true);
      openModal();
    });
  });

  function updateImage(initial = false) {
    modalImg.style.opacity = 0;
    const delay = initial ? 0 : 150;
    setTimeout(() => {
      let srcCandidate = images[currentIndex] || "";
      if ((!srcCandidate || srcCandidate === "") && activeCard) {
        const thumb = activeCard.querySelector('img');
        srcCandidate = thumb ? thumb.src : srcCandidate;
      }

      try {
        srcCandidate = encodeURI(srcCandidate);
      } catch (err) {      }
      modalImg.onerror = function () {
        modalImg.onerror = null;
        if (activeCard) {
          const thumb = activeCard.querySelector('img');
          if (thumb && thumb.src && thumb.src !== modalImg.src) {
            modalImg.src = thumb.src;
            modalImg.setAttribute("alt", modalTitle.textContent || `Image ${currentIndex + 1}`);
            modalImg.style.opacity = 1;
            return;
          }
        }
      };

      modalImg.src = srcCandidate;
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

  nextBtn.addEventListener("click", (e) => { e.stopPropagation(); nextImage(); });
  prevBtn.addEventListener("click", (e) => { e.stopPropagation(); prevImage(); });

  closeModal.addEventListener("click", hideModal);
  modal.addEventListener("click", e => {
    if (e.target === modal) hideModal();
  });

  document.addEventListener("keydown", (e) => {
    if (!modal.classList.contains("opacity-100")) return;
    if (e.key === "ArrowRight") nextImage();
    if (e.key === "ArrowLeft") prevImage();
    if (e.key === "Escape") hideModal();
  });

  let startX = 0;
  modalImg.addEventListener("touchstart", (e) => {
    if (!e.touches || !e.touches[0]) return;
    startX = e.touches[0].clientX;
  }, {passive: true});

  modalImg.addEventListener("touchend", (e) => {
    if (!e.changedTouches || !e.changedTouches[0]) return;
    const endX = e.changedTouches[0].clientX;
    const diff = startX - endX;
    if (diff > 50) nextImage();
    if (diff < -50) prevImage();
  });


  if (!modal || !modalImg || !closeModal || !nextBtn || !prevBtn) {
    console.warn("Gallery modal: missing one or more required elements (#modal, #modalImg, #closeModal, #nextImg, #prevImg).");
  }
})();

// Back To Top Button

const backToTopButton = document.getElementById("backToTop");
const footer = document.getElementById("footer");
if (backToTopButton) {
  const updateBackToTopVisibility = () => {
    if (window.scrollY > 300) {
      backToTopButton.classList.remove("opacity-0");
      backToTopButton.classList.add("opacity-100");
    } else {
      backToTopButton.classList.add("opacity-0");
      backToTopButton.classList.remove("opacity-100");
    }

    if (footer) {
      const footerRect = footer.getBoundingClientRect();
      const overlap = window.innerHeight - footerRect.top;
      if (overlap > 0) {
        backToTopButton.style.bottom = `${overlap + 24}px`;
      } else {
        backToTopButton.style.bottom = "24px";
      }
    }
  };

  window.addEventListener("scroll", updateBackToTopVisibility);
  window.addEventListener("resize", updateBackToTopVisibility);

  updateBackToTopVisibility();

  backToTopButton.addEventListener("click", (e) => {
    if (e) e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });


  backToTopButton.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      backToTopButton.click();
    }
  });
}