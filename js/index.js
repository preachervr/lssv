// Active states

const links = document.querySelectorAll('#navLinks a');
const currentUrl = window.location.href;

  links.forEach(link => {
    if (link.href === currentUrl) {
      link.classList.add('bg-lime-400/20', 'text-lime-200');
    }
  });