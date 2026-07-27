// Preloader
window.addEventListener("load", () => {
  setTimeout(() => {
    document.getElementById("preloader").classList.add("hide");
  }, 600);
});

// AOS
AOS.init({ duration: 900, once: true, offset: 80 });

// Custom cursor
const cursor = document.getElementById("cursor");
document.addEventListener("mousemove", (e) => {
  cursor.style.transform = `translate(${e.clientX - 18}px, ${e.clientY - 18}px)`;
});
document
  .querySelectorAll(
    "a, button, input, textarea, select, .service-card, .faq-item",
  )
  .forEach((el) => {
    el.addEventListener("mouseenter", () => cursor.classList.add("hover"));
    el.addEventListener("mouseleave", () => cursor.classList.remove("hover"));
  });

// Scroll progress & back to top
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

// Typing effect
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

// Counter
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

// Testimonials slider
let tIndex = 0;
const tTrack = document.getElementById("testimonialTrack");
function slideTestimonial(dir) {
  const slides = tTrack.children.length;
  const visible =
    window.innerWidth >= 1024 ? 3 : window.innerWidth >= 768 ? 2 : 1;
  const max = slides - visible;
  tIndex = Math.max(0, Math.min(max, tIndex + dir));
  const pct = tIndex * (100 / visible);
  tTrack.style.transform = `translateX(${pct}%)`;
}

// FAQ
function toggleFaq(item) {
  item.classList.toggle("open");
}

// Modal
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

// Form
function submitForm(e) {
  e.preventDefault();
  const status = document.getElementById("formStatus");
  status.classList.remove("hidden");
  e.target.reset();
  setTimeout(() => status.classList.add("hidden"), 5000);
}

// Mobile menu
const burger = document.getElementById("burger");
const mobileMenu = document.getElementById("mobileMenu");
burger.addEventListener("click", () => mobileMenu.classList.toggle("hidden"));
mobileMenu
  .querySelectorAll("a")
  .forEach((a) =>
    a.addEventListener("click", () => mobileMenu.classList.add("hidden")),
  );

// GSAP hero animations
gsap.registerPlugin(ScrollTrigger);
gsap.from("#home h1", { opacity: 0, y: 40, duration: 1.2, ease: "power3.out" });
gsap.from("#home p", {
  opacity: 0,
  y: 30,
  duration: 1,
  delay: 0.3,
  ease: "power3.out",
});
