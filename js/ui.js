"use strict";

/* =====================================================
   LAWYER SPA
   UI.JS
===================================================== */

/* =====================================================
   UI
===================================================== */

const UI = {
  elements: {},
};

/* =====================================================
   CACHE ELEMENTS
===================================================== */

UI.cache = function () {
  this.elements.serviceButton = document.querySelector("#serviceButton");

  this.elements.services = document.querySelector("#services");
};

/* =====================================================
   SCROLL TO SERVICES
===================================================== */

UI.scrollToServices = function () {
  if (!this.elements.services) {
    return;
  }

  this.elements.services.scrollIntoView({
    behavior: "smooth",

    block: "start",
  });
};

/* =====================================================
   BUTTON EVENTS
===================================================== */

UI.bindButtons = function () {
  if (!this.elements.serviceButton) {
    return;
  }

  this.elements.serviceButton.addEventListener(
    "click",

    () => {
      this.scrollToServices();
    },
  );
};

/* =====================================================
   KEYBOARD SUPPORT
===================================================== */

UI.keyboard = function () {
  document.addEventListener(
    "keydown",

    (event) => {
      if (event.key === "Home") {
        window.scrollTo({
          top: 0,

          behavior: "smooth",
        });
      }
    },
  );
};

/* =====================================================
   INIT
===================================================== */

UI.init = function () {
  this.cache();

  this.bindButtons();

  this.keyboard();
};

/* =====================================================
   START
===================================================== */
