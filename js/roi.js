// Active Link Logic

document.addEventListener('DOMContentLoaded', () => {
  
  let currentPath = window.location.pathname.split('/').pop();
  if (currentPath === '' || currentPath === '/') {
    currentPath = 'index.html';
  }

  const navLinks = document.querySelectorAll('#navLinks a, #sidebar nav a');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return; // Skip if no href
    
    const linkPath = href.split(/[?#]/)[0].split('/').pop();

    if (linkPath === currentPath) {
      
      makeLinkActive(link);

      const desktopSubmenu = link.closest('#submenu');
      if (desktopSubmenu) {
        const desktopToggle = document.getElementById('toggleSubmenu');
        if (desktopToggle) {
          makeLinkActive(desktopToggle);
        }
      }

      const mobileSubmenu = link.closest('#mobileSubmenu');
      if (mobileSubmenu) {
        const mobileToggle = document.getElementById('mobileSubmenuToggle');
        if (mobileToggle) {
          makeLinkActive(mobileToggle);
          
          mobileSubmenu.classList.remove('hidden');
          mobileSubmenu.classList.add('flex');
          const mobileArrow = document.getElementById('mobileArrow');
          if (mobileArrow) {
            mobileArrow.classList.add('rotate-180');
          }
        }
      }
    }
  });

  function makeLinkActive(el) {
    el.classList.remove('text-zinc-600', 'dark:text-zinc-300', 'text-zinc-700', 'dark:text-zinc-200', 'font-semibold');
    el.classList.add('text-green-600', 'dark:text-green-500', 'font-bold');
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
  sideBarBackdrop.classList.remove("opacity-30");
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

window.addEventListener("load", function () {
  AOS.init({once: true, offset: 50, duration: 700});
})

// Current Year

const currentYear = document.getElementById("currentYear");
currentYear.textContent = new Date().getFullYear();