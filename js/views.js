"use strict";

/* =====================================================
   LAWYER SPA
   VIEWS.JS
===================================================== */

const Views = {
  views: [],

  active: null,
};

/* =====================================================
   CACHE VIEWS
===================================================== */

Views.cache = function () {
  this.views = Array.from(document.querySelectorAll(".view"));
};

/* =====================================================
   HIDE ALL
===================================================== */

Views.hideAll = function () {
  this.views.forEach((view) => {
    view.style.display = "none";

    view.classList.remove("active-view");
  });
};

/* =====================================================
   SHOW VIEW
===================================================== */

Views.show = function (id) {
  this.hideAll();

  const view = document.getElementById(id);

  if (!view) {
    console.warn(id + " view not found.");

    return;
  }

  view.style.display = "";

  view.classList.add("active-view");

  this.active = id;
};

/* =====================================================
   CURRENT VIEW
===================================================== */

Views.current = function () {
  return this.active;
};

/* =====================================================
   START
===================================================== */

document.addEventListener(
  "DOMContentLoaded",

  () => {
    Views.cache();

    Views.show("home");
  },
);
