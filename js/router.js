"use strict";

/* =====================================================
   LAWYER SPA
   ROUTER.JS
===================================================== */

/* =====================================================
   ROUTER
===================================================== */

const Router = {
  routes: new Map(),

  currentRoute: "/",

  notFound: null,
};

/* =====================================================
   REGISTER ROUTE
===================================================== */

Router.add = function (path, handler) {
  this.routes.set(path, handler);
};

/* =====================================================
   NOT FOUND
===================================================== */

Router.setNotFound = function (handler) {
  this.notFound = handler;
};

/* =====================================================
   GET CURRENT PATH
===================================================== */

Router.path = function () {
  return window.location.pathname;
};

/* =====================================================
   NAVIGATE
===================================================== */

/*Router.navigate = function (path, replace = false) {
  if (path === this.currentRoute) {
    return;
  }

  if (replace) {
    history.replaceState({}, "", path);
  } else {
    history.pushState({}, "", path);
  }

  this.resolve();
};*/

/* =====================================================
   RESOLVE ROUTE
===================================================== */

Router.resolve = function () {
  const path = this.path();

  this.currentRoute = path;

  if (this.routes.has(path)) {
    const handler = this.routes.get(path);

    handler();

    return;
  }

  if (typeof this.notFound === "function") {
    this.notFound();
  }
};

/* =====================================================
   BACK / FORWARD
===================================================== */

window.addEventListener(
  "popstate",

  () => {
    Router.resolve();
  },
);

/* =====================================================
   DEFAULT ROUTES
===================================================== */

Router.add("/", () => {
  console.log("home");
});

Router.add("/services", () => {
  console.log("services");
});

/*Router.add("/about", () => {
  Views.show("about");
});

Router.add("/contact", () => {
  Views.show("contact");
});*/

Router.add("/about", () => {
  console.log("About");
});

Router.add("/contact", () => {
  console.log("Contact");
});

/* =====================================================
   404
===================================================== */

Router.setNotFound(() => {
  console.warn("404");
});

/* =====================================================
   INIT
===================================================== */

Router.init = function () {
  this.resolve();
};
