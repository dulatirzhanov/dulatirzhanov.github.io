/*
 * Переключатель «день / ночь».
 * Подключается синхронным <script src="/theme.js?v=1"></script> в самом начале <head>,
 * до таблиц стилей: первая часть ставит data-theme на <html> до отрисовки, без вспышки.
 * Вторая часть после загрузки DOM вставляет кнопку внутрь .lang-switcher (главные, блог, /sim/, /sources/)
 * или .language-switch (анкета школы); на странице без переключателя языка кнопка плавает в углу.
 *
 * Правила:
 *   - первый визит следует системной теме и меняется вместе с ней;
 *   - нажатие переключает на противоположную тему; если выбор совпал с системой, запись стирается
 *     (так сайт возвращается к «как в системе», третий режим не нужен);
 *   - localStorage может быть закрыт (приватный режим): тогда тема живет до перезагрузки, ошибок нет;
 *   - при печати тема временно светлая;
 *   - листы кейсов (*-sheet.html) файл не подключают и всегда светлые.
 * Стили кнопки и защита от анимации при смене темы: /theme.css.
 * Событие аналитики: theme_toggle, параметр theme = dark | light.
 */
(function () {
  "use strict";
  var KEY = "dulatedu-theme";
  var root = document.documentElement;
  var mq = null;
  try { mq = window.matchMedia("(prefers-color-scheme: dark)"); } catch (e) { /* старый браузер: светлая */ }

  function system() { return mq && mq.matches ? "dark" : "light"; }
  function stored() {
    try {
      var v = window.localStorage.getItem(KEY);
      return v === "dark" || v === "light" ? v : null;
    } catch (e) { return null; }
  }
  function store(v) {
    try {
      if (v === null) window.localStorage.removeItem(KEY);
      else window.localStorage.setItem(KEY, v);
    } catch (e) { /* закрыто: выбор живет до перезагрузки */ }
  }
  function current() { return root.getAttribute("data-theme") === "dark" ? "dark" : "light"; }

  // --- Тексты кнопки: действие, которое произойдет при нажатии ---
  var TEXT = {
    ru: { dark: "Ночной режим", light: "Дневной режим" },
    kk: { dark: "Түнгі режим", light: "Күндізгі режим" },
    en: { dark: "Dark mode", light: "Light mode" }
  };
  function labels() {
    var l = (root.getAttribute("lang") || "en").slice(0, 2).toLowerCase();
    return TEXT[l] || TEXT.en;
  }

  var buttons = [];
  function refresh() {
    var t = labels()[current() === "dark" ? "light" : "dark"];
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].setAttribute("aria-label", t);
      buttons[i].setAttribute("title", t);
    }
  }

  function apply(theme, quiet) {
    if (!quiet) {
      // одна кадровая пауза без transition, чтобы страница не «плыла» между темами
      root.classList.add("theme-switching");
      window.requestAnimationFrame(function () {
        window.requestAnimationFrame(function () { root.classList.remove("theme-switching"); });
      });
    }
    root.setAttribute("data-theme", theme);
    refresh();
  }

  // --- Первая часть: до отрисовки ---
  apply(stored() || system(), true);

  // Системная тема меняется, пока выбор не сохранен
  function onSystem() { if (!stored()) apply(system()); }
  if (mq) {
    if (mq.addEventListener) mq.addEventListener("change", onSystem);
    else if (mq.addListener) mq.addListener(onSystem);
  }
  // Другая вкладка сменила тему
  window.addEventListener("storage", function (e) {
    if (e.key === KEY || e.key === null) apply(stored() || system());
  });
  // Печать всегда светлая: и события beforeprint/afterprint, и медиазапрос print (Safari)
  var beforePrint = null;
  function enterPrint() {
    if (beforePrint !== null) return;
    beforePrint = current();
    if (beforePrint === "dark") root.setAttribute("data-theme", "light");
  }
  function leavePrint() {
    if (beforePrint === "dark") root.setAttribute("data-theme", "dark");
    beforePrint = null;
  }
  window.addEventListener("beforeprint", enterPrint);
  window.addEventListener("afterprint", leavePrint);
  try {
    var pm = window.matchMedia("print");
    var onPrint = function (e) { if (e.matches) enterPrint(); else leavePrint(); };
    if (pm.addEventListener) pm.addEventListener("change", onPrint);
    else if (pm.addListener) pm.addListener(onPrint);
  } catch (e) { /* без поддержки: остаются события */ }

  function toggle() {
    var next = current() === "dark" ? "light" : "dark";
    store(next === system() ? null : next);
    apply(next);
    try {
      var params = { theme: next };
      if (typeof window.track === "function") window.track("theme_toggle", params);
      else if (typeof window.gtag === "function") window.gtag("event", "theme_toggle", params);
    } catch (e) { /* счетчик не должен ломать страницу */ }
  }

  // --- Вторая часть: кнопка ---
  var SVG_NS = "http://www.w3.org/2000/svg";
  function icon() {
    var svg = document.createElementNS(SVG_NS, "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("width", "18");
    svg.setAttribute("height", "18");
    svg.setAttribute("fill", "none");
    svg.setAttribute("stroke", "currentColor");
    svg.setAttribute("stroke-width", "1.6");
    svg.setAttribute("stroke-linecap", "butt");
    svg.setAttribute("stroke-linejoin", "miter");
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("focusable", "false");
    // луна видна в дневной теме (нажатие включит ночь), солнце в ночной
    var moon = document.createElementNS(SVG_NS, "path");
    moon.setAttribute("class", "theme-icon-moon");
    moon.setAttribute("d", "M20 14.5A8 8 0 1 1 9.5 4a6.3 6.3 0 0 0 10.5 10.5Z");
    var sun = document.createElementNS(SVG_NS, "g");
    sun.setAttribute("class", "theme-icon-sun");
    var disc = document.createElementNS(SVG_NS, "circle");
    disc.setAttribute("cx", "12"); disc.setAttribute("cy", "12"); disc.setAttribute("r", "4");
    sun.appendChild(disc);
    var rays = ["12 2 12 5", "12 19 12 22", "2 12 5 12", "19 12 22 12", "4.9 4.9 7 7", "17 17 19.1 19.1", "4.9 19.1 7 17", "17 7 19.1 4.9"];
    for (var i = 0; i < rays.length; i++) {
      var p = rays[i].split(" ");
      var ln = document.createElementNS(SVG_NS, "line");
      ln.setAttribute("x1", p[0]); ln.setAttribute("y1", p[1]); ln.setAttribute("x2", p[2]); ln.setAttribute("y2", p[3]);
      sun.appendChild(ln);
    }
    svg.appendChild(moon);
    svg.appendChild(sun);
    return svg;
  }
  function makeButton() {
    var b = document.createElement("button");
    b.type = "button";
    b.className = "theme-toggle";
    b.appendChild(icon());
    b.addEventListener("click", toggle);
    buttons.push(b);
    return b;
  }

  var HOSTS = ".lang-switcher, .language-switch";
  function mount() {
    // забыть кнопки, вырезанные из страницы при перерисовке шаблона
    buttons = buttons.filter(function (b) { return document.contains(b); });
    var hosts = document.querySelectorAll(HOSTS);
    for (var i = 0; i < hosts.length; i++) {
      if (hosts[i].querySelector(".theme-toggle")) continue;
      hosts[i].appendChild(makeButton());
    }
    refresh();
  }
  function mountFloating() {
    if (document.querySelector(".theme-toggle")) return;
    var box = document.createElement("div");
    box.className = "theme-toggle-float";
    box.appendChild(makeButton());
    document.body.appendChild(box);
    refresh();
  }

  var queued = false;
  function schedule() {
    if (queued) return;
    queued = true;
    window.requestAnimationFrame(function () { queued = false; mount(); });
  }
  function ready() {
    mount();
    // шаблоны /sim/ и /sources/ собирают страницу скриптом: следим за новыми переключателями языка
    if (window.MutationObserver) {
      new MutationObserver(schedule).observe(document.body, { childList: true, subtree: true });
    }
    // нет ни одного переключателя языка (404): кнопка в углу
    window.addEventListener("load", mountFloating);
    if (document.readyState === "complete") mountFloating();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", ready);
  else ready();
})();
