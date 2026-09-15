// script.js

// JavaScript is demonstrably running: release the no-JS CSS fallbacks
// (html.no-js preloader guard, [data-aos] visibility, etc.).
document.documentElement.classList.remove("no-js");

// Shared reduced-motion probe — used by every animated feature below.
function prefersReducedMotion() {
  try {
    return window
      .matchMedia("(prefers-reduced-motion: reduce)")
      .matches;
  } catch (e) {
    return false;
  }
}

// ==================== THEME MANAGEMENT WITH VIEW TRANSITION ====================
// localStorage can throw (private mode, security settings, quota, disabled
// storage) — every access goes through these safe wrappers.

function safeGetTheme() {
  try {
    return localStorage.getItem("theme");
  } catch (e) {
    return null; // storage unavailable — fall through to system preference
  }
}

function safeSetTheme(theme) {
  try {
    localStorage.setItem("theme", theme);
  } catch (e) {
    /* ignore — theme still applies for the current session */
  }
}

function getPreferredTheme() {
  // Default theme is LIGHT; only an explicit saved choice overrides it.
  const saved = safeGetTheme();
  return saved === "dark" || saved === "light" ? saved : "light";
}

// Single source of truth for theme application. The CSS keys off
// body.light-mode, so the body class is always kept in sync here.
function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  document.body.classList.toggle("light-mode", theme === "light");
}

function initTheme() {
  applyTheme(getPreferredTheme());
}

function toggleThemeWithTransition(event) {
  const newTheme = document.body.classList.contains("light-mode")
    ? "dark"
    : "light";

  const reducedMotion = prefersReducedMotion();

  const commit = () => {
    applyTheme(newTheme);
    safeSetTheme(newTheme);
  };

  // Reduced motion or no View Transition support: switch immediately.
  if (reducedMotion || !document.startViewTransition) {
    commit();
    return;
  }

  // Reveal origin: the pointer position for mouse/touch. Keyboard activation
  // reports clientX/clientY of 0 (top-left corner), which is not a sensible
  // origin — fall back to the toggle button's center.
  let x = event ? event.clientX : 0;
  let y = event ? event.clientY : 0;
  const pointerReliable = x > 0 || y > 0;
  if (!pointerReliable) {
    const button =
      (event && event.currentTarget) ||
      document.getElementById("themeToggle");
    if (button && typeof button.getBoundingClientRect === "function") {
      const rect = button.getBoundingClientRect();
      x = rect.left + rect.width / 2;
      y = rect.top + rect.height / 2;
    }
    // Last resort (no button reference at all): viewport center.
    if (x === 0 && y === 0) {
      x = window.innerWidth / 2;
      y = window.innerHeight / 2;
    }
  }

  // Distance to the farthest viewport corner so the circle always covers
  // the whole screen.
  const radius = Math.hypot(
    Math.max(x, window.innerWidth - x),
    Math.max(y, window.innerHeight - y),
  );

  document.documentElement.style.setProperty("--x", `${x}px`);
  document.documentElement.style.setProperty("--y", `${y}px`);
  document.documentElement.style.setProperty("--radius", `${radius}px`);

  document.startViewTransition(commit);
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
// Robust: the preloader can never block the page permanently. It hides on
// window load, but a hard timeout also hides it if `load` is delayed by
// slow images, fonts, or failed resources.
const preloader = document.getElementById("preloader");
let preloaderHidden = false;

const preloaderReducedMotion = prefersReducedMotion();

function hidePreloader() {
  if (preloaderHidden || !preloader) return;
  preloaderHidden = true;
  preloader.classList.add("hide");
}

window.addEventListener("load", () => {
  setTimeout(hidePreloader, preloaderReducedMotion ? 0 : 600);
});

// Safety net — maximum time the preloader may stay on screen.
setTimeout(hidePreloader, preloaderReducedMotion ? 600 : 4000);

// ==================== AOS ====================
// Non-fatal: if AOS is missing, its init throws, or the user prefers reduced
// motion, reveal [data-aos] content via the html.no-aos fallback in
// style.css and keep running.
if (typeof AOS !== "undefined" && !prefersReducedMotion()) {
  try {
    AOS.init({ duration: 900, once: true, offset: 80 });
    // Tells the inline pre-paint fallback that animated content is managed.
    window.__aosReady = true;
    // Race safety: if the inline 3s fallback added no-aos before this script
    // finally ran, clear it now — AOS owns the reveal again and animations
    // are not permanently disabled. (Content stays visible either way.)
    document.documentElement.classList.remove("no-aos");
  } catch (e) {
    document.documentElement.classList.add("no-aos");
  }
} else {
  document.documentElement.classList.add("no-aos");
}

// ==================== CUSTOM CURSOR ====================
const cursor = document.getElementById("cursor");
if (cursor) {
  document.addEventListener("mousemove", (e) => {
    // Top-left anchored: clientX/clientY minus half the 36px box centers the
    // ring on the pointer. Scale on hover lives in --cursor-scale (CSS), so
    // movement never cancels the hover effect.
    cursor.style.setProperty("--cursor-x", `${e.clientX - 18}px`);
    cursor.style.setProperty("--cursor-y", `${e.clientY - 18}px`);
  });

  document
    .querySelectorAll(
      "a, button, input, textarea, select, .service-card-advanced, .case-card-advanced, .blog-card-advanced, .faq-item",
    )
    .forEach((el) => {
      el.addEventListener("mouseenter", () =>
        cursor.classList.add("hover"),
      );
      el.addEventListener("mouseleave", () =>
        cursor.classList.remove("hover"),
      );
    });
}

// ==================== SCROLL PROGRESS + BACK TO TOP + NAVBAR ====================
// One passive scroll listener drives every scroll-linked effect (progress
// bar, back-to-top visibility, navbar state) — cheap reads/writes only, no
// layout thrashing.
const backTop = document.getElementById("backTop");
const progressBar = document.getElementById("scroll-progress");
const navbar = document.getElementById("navbar");

window.addEventListener(
  "scroll",
  () => {
    const h = document.documentElement;

    // Guard against division by zero when the page has no scrollable height.
    const max = h.scrollHeight - h.clientHeight;
    const pct = max > 0 ? h.scrollTop / max : 0;

    if (progressBar) {
      progressBar.style.transform = `scaleX(${pct})`;
    }

    if (backTop) {
      backTop.classList.toggle("is-visible", h.scrollTop > 400);
    }

    // Theme-safe: only toggles a class — the scrolled border and shadow live
    // in style.css with dark-mode and light-mode variants.
    if (navbar) {
      navbar.classList.toggle("is-scrolled", h.scrollTop > 100);
    }
  },
  { passive: true },
);

if (backTop) {
  backTop.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion() ? "auto" : "smooth",
    });
  });
}

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
let typingTimer = null;
let heroVisible = true;

// Single timer chain. While the hero is off-screen the chain stops instead
// of mutating hidden text; the IntersectionObserver resumes it later from
// the exact same word/char state — no duplicate timers, no leaks.
function type() {
  typingTimer = null;
  if (!typedEl || !heroVisible) return;
  if (prefersReducedMotion()) {
    typedEl.textContent = words[0];
    return;
  }
  const word = words[wordIndex];
  if (!deleting) {
    typedEl.textContent = word.slice(0, ++charIndex);
    if (charIndex === word.length) {
      deleting = true;
      scheduleType(1800);
      return;
    }
  } else {
    typedEl.textContent = word.slice(0, --charIndex);
    if (charIndex === 0) {
      deleting = false;
      wordIndex = (wordIndex + 1) % words.length;
    }
  }
  scheduleType(deleting ? 40 : 90);
}

function scheduleType(delay) {
  if (!heroVisible || typingTimer !== null) return;
  typingTimer = setTimeout(type, delay);
}

if (typedEl) {
  if ("IntersectionObserver" in window) {
    const heroObserver = new IntersectionObserver((entries) => {
      const visible = entries[0].isIntersecting;
      const wasVisible = heroVisible;
      heroVisible = visible;
      if (visible && !wasVisible && typingTimer === null) {
        scheduleType(150);
      }
    });
    heroObserver.observe(typedEl);
  }
  type();
}

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
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      return;

    cancelAnimationFrame(animationFrame);

    animationFrame = requestAnimationFrame(() => {
      const rect = card.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const distanceX = e.clientX - centerX;
      const distanceY = e.clientY - centerY;
      const distance = Math.sqrt(
        distanceX * distanceX + distanceY * distanceY,
      );

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
    card.style.transition =
      "transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)";
    card.style.transform = "translate(0, 0)";
    setTimeout(() => {
      card.style.transition =
        "transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)";
    }, 500);
  });
});

// ==================== RIPPLE EFFECT ====================
function createRipple(e, element) {
  if (window.innerWidth < 768) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches)
    return;

  const rect = element.getBoundingClientRect();
  const x =
    (e.clientX || (e.touches && e.touches[0].clientX)) - rect.left;
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
  const open = item.classList.toggle("open");
  const btn = item.querySelector("button");
  if (btn) btn.setAttribute("aria-expanded", String(open));
}

// ==================== MODAL ====================
let lastFocusedElement = null;

function openModal() {
  // If opened from inside the mobile menu, close the menu first so the two
  // overlays never stack and the scroll lock state stays consistent.
  if (mobileMenu && !mobileMenu.classList.contains("hidden")) {
    setMenuOpen(false);
  }
  lastFocusedElement = document.activeElement;
  document.getElementById("modal").classList.add("active");
  document.body.style.overflow = "hidden";
  // First meaningful FORM FIELD (not the close button) gets initial focus.
  const firstField = document.querySelector("#modal input, #modal select");
  if (firstField) {
    // Wait one painted frame: the overlay's visibility transitions from
    // hidden, and focusing synchronously would silently fail.
    requestAnimationFrame(() => requestAnimationFrame(() => firstField.focus()));
  }
}

function closeModal() {
  document.getElementById("modal").classList.remove("active");
  document.body.style.overflow = "";
  // Hand focus back to whichever element opened the dialog.
  if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
    lastFocusedElement.focus();
  }
  lastFocusedElement = null;
}

// Focus trap: while the dialog is open, Tab cycles inside it only.
document.addEventListener("keydown", (e) => {
  if (e.key !== "Tab") return;
  const modal = document.getElementById("modal");
  if (!modal || !modal.classList.contains("active")) return;
  const focusables = modal.querySelectorAll(
    "button, input, select, textarea, a[href]",
  );
  if (!focusables.length) return;
  const first = focusables[0];
  const last = focusables[focusables.length - 1];
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault();
    first.focus();
  }
});

document.getElementById("modal").addEventListener("click", (e) => {
  if (e.target.id === "modal") closeModal();
});

// Escape: close the modal if it is open; otherwise close the mobile menu
// and return focus to the burger button so keyboard users are not stranded.
document.addEventListener("keydown", (e) => {
  if (e.key !== "Escape") return;
  if (document.getElementById("modal").classList.contains("active")) {
    closeModal();
  } else if (mobileMenu && !mobileMenu.classList.contains("hidden")) {
    setMenuOpen(false);
    if (burger) burger.focus();
  }
});

// ==================== PHONE VALIDATION ====================
// Persian (۰-۹) and Arabic (٠-٩) digits are normalized to ASCII, and common
// separators (spaces, dashes, parentheses) are dropped, so the 11-digit rule
// works with any keyboard layout. Typing is never harshly punished: valid
// digits are kept and converted, not deleted.
function normalizeDigits(value) {
  const persian = "۰۱۲۳۴۵۶۷۸۹";
  const arabic = "٠١٢٣٤٥٦٧٨٩";
  return String(value)
    .replace(/[۰-۹]/g, (d) => String(persian.indexOf(d)))
    .replace(/[٠-٩]/g, (d) => String(arabic.indexOf(d)))
    .replace(/[\s\-()]/g, "");
}

function validatePhone(input, errorElement) {
  input.addEventListener("input", function () {
    const normalized = normalizeDigits(this.value)
      .replace(/[^0-9]/g, "")
      .slice(0, 11);
    // Rewrite only when something changed so the caret never jumps.
    if (normalized !== this.value) {
      this.value = normalized;
    }
    // Typing clears a stale error immediately.
    if (errorElement) errorElement.classList.add("hidden");
  });

  input.addEventListener("blur", function () {
    if (!errorElement) return;
    const len = this.value.length;
    if (len > 0 && len !== 11) {
      errorElement.textContent =
        "⚠ شماره تلفن باید دقیقاً ۱۱ رقم باشد (" +
        len.toLocaleString("fa-IR") +
        " رقم وارد شده).";
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

  // Normalize at submit time too (autofill / programmatic fills skip the
  // input event), so validation always sees clean ASCII digits.
  const phoneInput = e.target.querySelector("#phoneInput");
  if (phoneInput) {
    phoneInput.value = normalizeDigits(phoneInput.value)
      .replace(/[^0-9]/g, "")
      .slice(0, 11);
  }
  const modalPhoneInput = e.target.querySelector("#modalPhoneInput");
  if (modalPhoneInput) {
    modalPhoneInput.value = normalizeDigits(modalPhoneInput.value)
      .replace(/[^0-9]/g, "")
      .slice(0, 11);
  }

  const phoneError = document.getElementById("phoneError");
  if (phoneInput && phoneInput.value.length !== 11) {
    if (phoneError) phoneError.classList.remove("hidden");
    return;
  }

  const modalPhoneError = document.getElementById("modalPhoneError");
  if (modalPhoneInput && modalPhoneInput.value.length !== 11) {
    if (modalPhoneError) modalPhoneError.classList.remove("hidden");
    return;
  }

  const modal = document.getElementById("modal");
  const inModal = modal.classList.contains("active");
  const modalStatus = document.getElementById("modalFormStatus");

  if (inModal) {
    // Success feedback must be visible where the user is looking — inside
    // the modal itself. Keep it open briefly, then close and clean up.
    if (modalStatus) modalStatus.classList.remove("hidden");
    e.target.reset();
    setTimeout(() => {
      if (modalStatus) modalStatus.classList.add("hidden");
      closeModal();
    }, 2000);
    return;
  }

  const status = document.getElementById("formStatus");
  if (status) {
    status.classList.remove("hidden");
    setTimeout(() => status.classList.add("hidden"), 5000);
  }
  e.target.reset();
}

// ==================== NEWSLETTER ====================
const newsletterForm = document.getElementById("newsletterForm");
if (newsletterForm) {
  newsletterForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const status = document.getElementById("newsletterStatus");
    const email = document.getElementById("newsletterEmail");
    if (!status || !email) return;

    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim());
    status.classList.remove("hidden");
    if (valid) {
      status.textContent = "✓ عضویت شما با موفقیت ثبت شد.";
      status.className = "mt-2 text-xs text-green-400";
      e.target.reset();
    } else {
      status.textContent = "⚠ لطفاً یک ایمیل معتبر وارد کنید.";
      status.className = "mt-2 text-xs text-red-400";
    }
  });
}

// ==================== DELEGATED HANDLERS ====================
// Replaces inline onclick/onsubmit attributes (CSP-friendly). Elements opt in
// with data attributes: [data-open-modal], [data-close-modal],
// [data-faq-toggle], [data-consult-form].
document.addEventListener("click", (e) => {
  if (e.target.closest("[data-open-modal]")) {
    openModal();
    return;
  }
  if (e.target.closest("[data-close-modal]")) {
    closeModal();
    return;
  }
  const faqToggle = e.target.closest("[data-faq-toggle]");
  if (faqToggle) {
    toggleFaq(faqToggle.closest(".faq-item"));
  }
});

document.addEventListener("submit", (e) => {
  if (e.target.matches("[data-consult-form]")) {
    submitForm(e);
  }
});

// ==================== MOBILE MENU ====================
const burger = document.getElementById("burger");
const mobileMenu = document.getElementById("mobileMenu");

// Single source of truth for menu state — keeps the hidden class and the
// button's aria-expanded/label in sync from every open/close path.
function setMenuOpen(open) {
  if (!burger || !mobileMenu) return;
  mobileMenu.classList.toggle("hidden", !open);
  burger.setAttribute("aria-expanded", String(open));
  burger.setAttribute("aria-label", open ? "بستن منو" : "باز کردن منو");
}

if (burger && mobileMenu) {
  burger.addEventListener("click", () => {
    setMenuOpen(mobileMenu.classList.contains("hidden"));
  });

  mobileMenu
    .querySelectorAll("a")
    .forEach((a) =>
      a.addEventListener("click", () => setMenuOpen(false)),
    );
}

// Outside click closes the menu (only when it is open).
document.addEventListener("click", (e) => {
  if (mobileMenu && !mobileMenu.classList.contains("hidden")) {
    if (!mobileMenu.contains(e.target) && !burger.contains(e.target)) {
      setMenuOpen(false);
    }
  }
});

// Resize desktop-ward: the menu is display:none by CSS at >=1024px, but its
// state must be reset too — otherwise it would pop back open when resizing
// down again. aria-expanded is synced by setMenuOpen.
const desktopMQ = window.matchMedia("(min-width: 1024px)");
if (typeof desktopMQ.addEventListener === "function") {
  desktopMQ.addEventListener("change", (e) => {
    if (e.matches) setMenuOpen(false);
  });
} else if (typeof desktopMQ.addListener === "function") {
  desktopMQ.addListener((e) => {
    if (e.matches) setMenuOpen(false);
  });
}

// ==================== GSAP ====================
// Non-fatal: animations run only when BOTH gsap and ScrollTrigger exist.
// fromTo() pins the end state to visible, so an interrupted or failed
// animation can never leave the hero hidden. If anything throws, the
// catch block forces the hero content visible.
if (
  typeof gsap !== "undefined" &&
  typeof ScrollTrigger !== "undefined" &&
  !prefersReducedMotion()
) {
  try {
    gsap.registerPlugin(ScrollTrigger);

    const homeSection = document.getElementById("home");
    if (homeSection) {
      gsap.fromTo(
        "#home h1",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: "power3.out",
          clearProps: "transform",
        },
      );
      gsap.fromTo(
        "#home p",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          delay: 0.3,
          ease: "power3.out",
          clearProps: "transform",
        },
      );
    }
  } catch (e) {
    document
      .querySelectorAll("#home h1, #home p")
      .forEach((el) => {
        el.style.opacity = "1";
        el.style.transform = "none";
      });
  }
}

// ==================== NAVBAR ====================
// Scroll styling is handled by the consolidated scroll listener above.

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
