"use strict";

/* =====================================================
   LAWYER SPA
   ANIMATION.JS
===================================================== */

const Animation = {
  observer: null,

  animatedElements: [],
};

/* =====================================================
   CACHE ELEMENTS
===================================================== */

Animation.cache = function () {
  this.animatedElements = Array.from(document.querySelectorAll(".animate"));
};

/* =====================================================
   SHOW ELEMENT
===================================================== */

Animation.show = function (element) {
  element.classList.add("show");
};

/* =====================================================
   CREATE OBSERVER
===================================================== */

Animation.createObserver = function () {
  this.observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.show(entry.target);

          this.observer.unobserve(entry.target);
        }
      });
    },

    {
      threshold: 0.15,
    },
  );
};

/* =====================================================
   OBSERVE ELEMENTS
===================================================== */

Animation.observe = function () {
  this.animatedElements.forEach((element) => {
    this.observer.observe(element);
  });
};

/* =====================================================
   RIPPLE EFFECT
===================================================== */

Animation.ripple = function (event) {
  const button = event.currentTarget;

  const circle = document.createElement("span");

  const diameter = Math.max(
    button.clientWidth,

    button.clientHeight,
  );

  const radius = diameter / 2;

  circle.style.width = diameter + "px";

  circle.style.height = diameter + "px";

  circle.style.left =
    event.clientX - button.getBoundingClientRect().left - radius + "px";

  circle.style.top =
    event.clientY - button.getBoundingClientRect().top - radius + "px";

  circle.classList.add("ripple");

  const oldRipple = button.querySelector(".ripple");

  if (oldRipple) {
    oldRipple.remove();
  }

  button.appendChild(circle);
};

/* =====================================================
   BIND RIPPLE
===================================================== */

Animation.bindRipple = function () {
  const buttons = document.querySelectorAll(".hero-button");

  buttons.forEach((button) => {
    button.addEventListener(
      "click",

      (event) => {
        this.ripple(event);
      },
    );
  });
};

/* =====================================================
   INIT
===================================================== */

Animation.init = function () {
  this.cache();

  this.createObserver();

  this.observe();

  this.bindRipple();
};

/* =====================================================
   START
===================================================== */
