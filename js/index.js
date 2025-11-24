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

// Hero Photo Slides

const slides = document.querySelectorAll("section.relative > div[data-index]");
const bars = document.querySelectorAll(".bar");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");

let currentIndex = 0;
let slideInterval = setInterval(nextSlide, 5000);

function showSlide(index) {
  slides.forEach((slide, i) => {
    slide.classList.toggle("opacity-100", i === index);
    slide.classList.toggle("opacity-0", i !== index);
    bars[i].classList.toggle("bg-white/80", i === index);
    bars[i].classList.toggle("bg-white/40", i !== index);
  });
  currentIndex = index;
}

function nextSlide() {
  const newIndex = (currentIndex + 1 ) % slides.length;
  showSlide(newIndex);
}

function prevSlide() {
  const newIndex = (currentIndex - 1 + slides.length) % slides.length;
  showSlide(newIndex);
}

function resetInterval() {
  clearInterval(slideInterval);
  slideInterval = setInterval(nextSlide, 5000);
}

bars.forEach(bar => {
  bar.addEventListener("click", () => {
    showSlide(parseInt(bar.dataset.bar));
    resetInterval();
  });
});

nextBtn.addEventListener("click", () => {
  nextSlide();
  resetInterval();
});

prevBtn.addEventListener("click", () => {
  prevSlide();
  resetInterval();
});

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

// AOS

document.addEventListener('DOMContentLoaded', () => {
  AOS.init();
});

