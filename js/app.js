"use strict";

/* =====================================================
   LAWYER SPA
   APP.JS
===================================================== */

/* =====================================================
   APPLICATION
===================================================== */

const App = {
  /* -------------------------------------------- */

  config: {
    appName: "Lawyer SPA",

    version: "1.0.0",

    debug: false,
  },

  /* -------------------------------------------- */

  state: {
    initialized: false,

    loading: true,
  },

  /* -------------------------------------------- */

  elements: {
    hero: null,

    services: null,

    footer: null,

    serviceButton: null,
  },
};

/* =====================================================
   DOM ELEMENTS
===================================================== */

function cacheDom() {
  App.elements.hero = document.querySelector(".hero");

  App.elements.services = document.querySelector(".services");

  App.elements.footer = document.querySelector(".footer");

  App.elements.serviceButton = document.querySelector("#serviceButton");
}

/* =====================================================
   CHECK DOM
===================================================== */

function validateDom() {
  for (const key in App.elements) {
    if (App.elements[key] === null) {
      console.warn(`${key} not found`);
    }
  }
}

/* =====================================================
   APP START
===================================================== */

function startApplication() {
  cacheDom();

  validateDom();

  Router.init();

  UI.init();

  Animation.init();

  App.state.loading = false;

  App.state.initialized = true;

  console.log(
    `${App.config.appName}

Version ${App.config.version}

Started Successfully.`,
  );
}

/* =====================================================
   DOM READY
===================================================== */

document.addEventListener(
  "DOMContentLoaded",

  startApplication,
);
