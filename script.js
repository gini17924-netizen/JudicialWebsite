function initTheme() {
  const saved = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const theme = saved || (prefersDark ? "dark" : "light");

  document.documentElement.setAttribute("data-theme", theme);
  if (theme === "light") {
    document.body.classList.add("light-mode");
  } else {
    document.body.classList.remove("light-mode");
  }
}

function toggleThemeWithTransition(event) {
  const isLight = document.body.classList.contains("light-mode");
  const newTheme = isLight ? "dark" : "light";

  // Calculate click position for circular reveal
  const x = event.clientX;
  const y = event.clientY;

  // Calculate max radius
  const maxDim = Math.max(window.innerWidth, window.innerHeight);
  const radius = Math.sqrt(
    x * x +
      y * y +
      (window.innerWidth - x) ** 2 +
      (window.innerHeight - y) ** 2,
  );

  // Set CSS variables for animation
  document.documentElement.style.setProperty("--x", `${x}px`);
  document.documentElement.style.setProperty("--y", `${y}px`);
  document.documentElement.style.setProperty("--radius", `${radius}px`);

  // Use View Transition API if available
  if (document.startViewTransition) {
    document.startViewTransition(() => {
      document.body.classList.toggle("light-mode");
      document.documentElement.setAttribute("data-theme", newTheme);
      localStorage.setItem("theme", newTheme);
    });
  } else {
    // Fallback for browsers without View Transitions
    document.body.classList.toggle("light-mode");
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  }
}

// Initialize theme
initTheme();

// Bind toggle buttons
const themeToggle = document.getElementById("themeToggle");
const themeToggleMobile = document.getElementById("themeToggleMobile");

if (themeToggle) {
  themeToggle.addEventListener("click", toggleThemeWithTransition);
}

if (themeToggleMobile) {
  themeToggleMobile.addEventListener("click", toggleThemeWithTransition);
}

// ==================== PRELOADER ====================
// ==================== PRELOADER ====================
function hidePreloader() {
  const preloader = document.getElementById("preloader");
  if (preloader && !preloader.classList.contains("hide")) {
    preloader.classList.add("hide");
  }
}

// روش اول: وقتی تمام منابع (تصاویر و...) لود شدند
window.addEventListener("load", () => {
  setTimeout(hidePreloader, 300); // 300ms تاخیر برای انیمیشن نرم‌تر
});

// روش دوم (تضمینی): اگر تصاویر لود نشدند، بعد از ۳ ثانیه در هر صورت پرلودر را حذف کن
setTimeout(hidePreloader, 3000);

// روش سوم: اگر DOM آماده شد و کاربر اینترنت کندی داشت، با تاخیر کم حذف شود
document.addEventListener("DOMContentLoaded", () => {
  setTimeout(hidePreloader, 1500);
});

// ==================== AOS ====================
// AOS.init({ duration: 900, once: true, offset: 80 });//

// ==================== CUSTOM CURSOR ====================
const cursor = document.getElementById("cursor");
if (cursor) {
  document.addEventListener("mousemove", (e) => {
    cursor.style.transform = `translate(${e.clientX - 18}px, ${e.clientY - 18}px)`;
  });

  document
    .querySelectorAll(
      "a, button, input, textarea, select, .service-card-advanced, .case-card-advanced, .blog-card-advanced, .faq-item",
    )
    .forEach((el) => {
      el.addEventListener("mouseenter", () => cursor.classList.add("hover"));
      el.addEventListener("mouseleave", () => cursor.classList.remove("hover"));
    });
}

// ==================== SCROLL PROGRESS ====================
const backTop = document.getElementById("backTop");
const progressBar = document.getElementById("scroll-progress");

window.addEventListener("scroll", () => {
  const h = document.documentElement;
  const pct = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
  progressBar.style.width = pct + "%";

  if (h.scrollTop > 400) {
    backTop.style.opacity = "1";
    backTop.style.visibility = "visible";
  } else {
    backTop.style.opacity = "0";
    backTop.style.visibility = "hidden";
  }
});

// ==================== TYPING EFFECT ====================
const words = [
  "با ما تجربه کنید",
  "در کنار شما می‌سازیم",
  "به حرف می‌آوریم",
  "با تخصص به نتیجه می‌رسانیم",
];
const typedEl = document.getElementById("typed");
let wordIndex = 0,
  charIndex = 0,
  deleting = false;

function type() {
  if (!typedEl) return;
  const word = words[wordIndex];
  if (!deleting) {
    typedEl.textContent = word.slice(0, ++charIndex);
    if (charIndex === word.length) {
      deleting = true;
      setTimeout(type, 1800);
      return;
    }
  } else {
    typedEl.textContent = word.slice(0, --charIndex);
    if (charIndex === 0) {
      deleting = false;
      wordIndex = (wordIndex + 1) % words.length;
    }
  }
  setTimeout(type, deleting ? 40 : 90);
}
type();

// ==================== COUNTER ====================
const counters = document.querySelectorAll(".counter");
const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = +el.dataset.target;
        let current = 0;
        const inc = target / 60;
        const update = () => {
          current += inc;
          if (current < target) {
            el.textContent = Math.ceil(current).toLocaleString("fa-IR");
            requestAnimationFrame(update);
          } else {
            el.textContent = target.toLocaleString("fa-IR");
          }
        };
        update();
        counterObserver.unobserve(el);
      }
    });
  },
  { threshold: 0.5 },
);
counters.forEach((c) => counterObserver.observe(c));

// ==================== MAGNETIC EFFECT ====================
document.querySelectorAll(".magnetic-container").forEach((container) => {
  const card = container.querySelector(
    ".service-card-advanced, .case-card-advanced, .blog-card-advanced",
  );
  if (!card) return;

  let animationFrame;

  container.addEventListener("mousemove", (e) => {
    if (window.innerWidth < 768) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    cancelAnimationFrame(animationFrame);

    animationFrame = requestAnimationFrame(() => {
      const rect = card.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const distanceX = e.clientX - centerX;
      const distanceY = e.clientY - centerY;
      const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

      const maxDistance = 150;

      if (distance < maxDistance) {
        const moveX = distanceX * 0.15;
        const moveY = distanceY * 0.15;
        card.style.transform = `translate(${moveX}px, ${moveY}px)`;
      } else {
        card.style.transform = "translate(0, 0)";
      }
    });
  });

  container.addEventListener("mouseleave", () => {
    card.style.transition = "transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)";
    card.style.transform = "translate(0, 0)";
    setTimeout(() => {
      card.style.transition = "transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)";
    }, 500);
  });
});

// ==================== RIPPLE EFFECT ====================
function createRipple(e, element) {
  if (window.innerWidth < 768) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const rect = element.getBoundingClientRect();
  const x = (e.clientX || (e.touches && e.touches[0].clientX)) - rect.left;
  const y = (e.clientY || (e.touches && e.touches[0].clientY)) - rect.top;

  const maxDistanceX = Math.max(x, rect.width - x);
  const maxDistanceY = Math.max(y, rect.height - y);
  const maxRadius = Math.sqrt(
    maxDistanceX * maxDistanceX + maxDistanceY * maxDistanceY,
  );

  const ripple = document.createElement("span");
  ripple.className = "ripple";
  ripple.style.width = ripple.style.height = `${maxRadius * 2}px`;
  ripple.style.left = `${x - maxRadius}px`;
  ripple.style.top = `${y - maxRadius}px`;

  element.appendChild(ripple);

  ripple.addEventListener("animationend", () => {
    ripple.remove();
  });
}

// Apply ripple to all advanced cards
document
  .querySelectorAll(
    ".service-card-advanced, .case-card-advanced, .blog-card-advanced",
  )
  .forEach((card) => {
    card.addEventListener("mousedown", (e) => createRipple(e, card));
    card.addEventListener("touchstart", (e) => createRipple(e, card), {
      passive: true,
    });
  });

// ==================== FAQ ====================
function toggleFaq(item) {
  item.classList.toggle("open");
}

// ==================== MODAL ====================
function openModal() {
  document.getElementById("modal").classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  document.getElementById("modal").classList.remove("active");
  document.body.style.overflow = "";
}

document.getElementById("modal").addEventListener("click", (e) => {
  if (e.target.id === "modal") closeModal();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModal();
});

// ==================== PHONE VALIDATION ====================
function validatePhone(input, errorElement) {
  input.addEventListener("input", function () {
    this.value = this.value.replace(/[^0-9]/g, "");
    if (this.value.length > 11) {
      this.value = this.value.slice(0, 11);
    }
  });

  input.addEventListener("blur", function () {
    if (this.value.length > 0 && this.value.length !== 11) {
      errorElement.classList.remove("hidden");
    } else {
      errorElement.classList.add("hidden");
    }
  });
}

const phoneInput = document.getElementById("phoneInput");
const phoneError = document.getElementById("phoneError");
if (phoneInput && phoneError) {
  validatePhone(phoneInput, phoneError);
}

const modalPhoneInput = document.getElementById("modalPhoneInput");
const modalPhoneError = document.getElementById("modalPhoneError");
if (modalPhoneInput && modalPhoneError) {
  validatePhone(modalPhoneInput, modalPhoneError);
}

// ==================== FORM ====================
function submitForm(e) {
  e.preventDefault();

  const phoneInput = e.target.querySelector("#phoneInput");
  const phoneError = document.getElementById("phoneError");
  if (phoneInput && phoneInput.value.length !== 11) {
    if (phoneError) phoneError.classList.remove("hidden");
    return;
  }

  const modalPhoneInput = e.target.querySelector("#modalPhoneInput");
  const modalPhoneError = document.getElementById("modalPhoneError");
  if (modalPhoneInput && modalPhoneInput.value.length !== 11) {
    if (modalPhoneError) modalPhoneError.classList.remove("hidden");
    return;
  }

  const status = document.getElementById("formStatus");
  if (status) {
    status.classList.remove("hidden");
    setTimeout(() => status.classList.add("hidden"), 5000);
  }
  e.target.reset();

  const modal = document.getElementById("modal");
  if (modal.classList.contains("active")) {
    closeModal();
  }
}

// ==================== MOBILE MENU ====================
const burger = document.getElementById("burger");
const mobileMenu = document.getElementById("mobileMenu");

if (burger && mobileMenu) {
  burger.addEventListener("click", () => {
    mobileMenu.classList.toggle("hidden");
  });

  mobileMenu
    .querySelectorAll("a")
    .forEach((a) =>
      a.addEventListener("click", () => mobileMenu.classList.add("hidden")),
    );
}

document.addEventListener("click", (e) => {
  if (mobileMenu && !mobileMenu.classList.contains("hidden")) {
    if (!mobileMenu.contains(e.target) && !burger.contains(e.target)) {
      mobileMenu.classList.add("hidden");
    }
  }
});

// ==================== GSAP ====================
if (typeof gsap !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);

  const homeSection = document.getElementById("home");
  if (homeSection) {
    gsap.from("#home h1", {
      opacity: 0,
      y: 40,
      duration: 1.2,
      ease: "power3.out",
    });
    gsap.from("#home p", {
      opacity: 0,
      y: 30,
      duration: 1,
      delay: 0.3,
      ease: "power3.out",
    });
  }
}

// ==================== NAVBAR ====================
const navbar = document.getElementById("navbar");

window.addEventListener("scroll", () => {
  if (navbar) {
    if (window.pageYOffset > 100) {
      navbar.style.borderBottomColor = "rgba(216, 153, 36, 0.1)";
      navbar.style.boxShadow = "0 4px 30px rgba(0, 0, 0, 0.3)";
    } else {
      navbar.style.borderBottomColor = "rgba(255, 255, 255, 0.05)";
      navbar.style.boxShadow = "none";
    }
  }
});

// ==================== SECTION REVEAL ====================
const sections = document.querySelectorAll("section");
const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
      }
    });
  },
  { threshold: 0.05 },
);

sections.forEach((section) => {
  section.style.opacity = "1";
  section.style.transform = "translateY(0)";
  section.style.transition = "opacity 0.6s ease, transform 0.6s ease";
  sectionObserver.observe(section);
});
