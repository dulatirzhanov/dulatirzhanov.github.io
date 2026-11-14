/*
 * Общий счетчик Google Analytics (ресурс G-P430YKCERB) и события сайта.
 * Подключается одной строкой в <head> каждой оболочки:
 *   <script src="/analytics.js?v=1"></script>
 * При смене файла менять версию ?v= во всех оболочках.
 *
 * События:
 *   contact_open   - открыто окно контактов (source: menu | cta)
 *   contact_click  - нажата связь (method: email | whatsapp | calendly)
 *   home_card_click - нажата карточка главной (card: название)
 * Остальные события шлют сами страницы через window.track():
 *   case_open, case_option_open, case_analysis_open, topic_open (sim/template.js, sources/template.js);
 *   school_form_start, school_form_send (tools/express-audit.js).
 */
(function () {
  var ID = "G-P430YKCERB";
  if (window.__dulateduAnalytics) return;
  window.__dulateduAnalytics = true;

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
  window.gtag("js", new Date());
  window.gtag("config", ID);

  // На локальной проверке события остаются в dataLayer и в Google не уходят.
  var local = /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname);
  if (!local) {
    var s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + ID;
    document.head.appendChild(s);
  }

  function pageLang() {
    var p = location.pathname;
    if (/^\/(kz)(\/|$)/.test(p) || /\/kz\//.test(p)) return "kk";
    if (/^\/ru(\/|$)/.test(p) || /\/ru\//.test(p) || p.indexOf("/sim/") === 0 || p.indexOf("/sources/") === 0) return "ru";
    return "en";
  }

  window.track = function (name, params) {
    try {
      var p = params || {};
      if (!p.lang) p.lang = pageLang();
      p.transport_type = "beacon";
      window.gtag("event", name, p);
    } catch (e) { /* счетчик не должен ломать страницу */ }
  };

  function contactMethod(href) {
    if (!href) return "";
    if (href.indexOf("mailto:") === 0) return "email";
    if (/^https?:\/\/(wa\.me|api\.whatsapp\.com)\//.test(href)) return "whatsapp";
    if (/^https?:\/\/calendly\.com\//.test(href)) return "calendly";
    return "";
  }

  document.addEventListener("click", function (e) {
    var t = e.target;
    if (!t || !t.closest) return;

    var opener = t.closest("#openContacts, #openContactsCta");
    if (opener) {
      window.track("contact_open", { source: opener.id === "openContacts" ? "menu" : "cta", page: location.pathname });
      return;
    }

    var a = t.closest("a");
    if (!a) return;

    var method = contactMethod(a.getAttribute("href"));
    if (method) {
      window.track("contact_click", { method: method, page: location.pathname });
      return;
    }

    var card = a.closest(".proof-card");
    if (card) {
      var strong = card.querySelector("strong");
      window.track("home_card_click", { card: strong ? strong.textContent.trim() : (a.getAttribute("href") || ""), page: location.pathname });
    }
  }, true);
})();
