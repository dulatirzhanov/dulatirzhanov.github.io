/*
 * Рендер раздела «Библиотека источников» (прототип v2).
 * SourcesIndex.init() - список тем (index.html)
 * SourcesTopic.init() - страница темы (topic.html?id=<id>)
 * Данные: sources-data.js (тексты) + sources-meta.js (lead и маршрут чтения).
 */
(function () {
  var MONTHS = ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"];
  var NEW_DAYS = 30;

  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
  function apaHtml(s) { return esc(s).replace(/\*([^*]+)\*/g, "<em>$1</em>"); }
  function noteHtml(s) {
    return esc(s).replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener">$1</a>');
  }
  function plural(n, a, b, c) {
    var m10 = n % 10, m100 = n % 100;
    if (m10 === 1 && m100 !== 11) return a;
    if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return b;
    return c;
  }
  function srcWord(n) { return n + " " + plural(n, "источник", "источника", "источников"); }
  function dateRu(iso) {
    var p = iso.split("-");
    return parseInt(p[2], 10) + " " + MONTHS[parseInt(p[1], 10) - 1] + " " + p[0];
  }
  function isNew(iso) {
    var d = (Date.now() - new Date(iso + "T00:00:00").getTime()) / 86400000;
    return d >= 0 && d <= NEW_DAYS;
  }
  function chars(src) { return src.summary.join(" ").length + src.practice.length; }
  function minutesFor(sources) {
    var c = sources.reduce(function (a, s) { return a + chars(s); }, 0);
    return Math.max(2, Math.round(c / 1200));
  }
  function meta(id) { return (window.SOURCES_META || {})[id] || {}; }

  function subscribeBlock() {
    return '' +
      '<section class="subscribe-block" id="subscribe">' +
      '<p class="subscribe-label">Получать письма о новых подборках:</p>' +
      '<form class="subscribe-form" action="https://dulatedu.us6.list-manage.com/subscribe/post?u=9b32c150eb1859f084bfe3bcb&amp;id=c702192e41&amp;f_id=009822e2f0" method="POST" target="_blank">' +
      '<label class="sr-only" for="sub-email">Ваш email</label>' +
      '<input id="sub-email" type="email" name="EMAIL" placeholder="name@school.kz" autocomplete="email" required>' +
      '<div style="position:absolute;left:-5000px" aria-hidden="true"><input type="text" name="b_9b32c150eb1859f084bfe3bcb_c702192e41" tabindex="-1" value=""></div>' +
      '<button type="submit">Подписаться</button>' +
      '</form><p class="subscribe-note">Новые подборки появляются по мере готовности. Я использую адрес только для писем об обновлениях.</p></section>';
  }

  function footer() {
    return '' +
      '<div class="lang-note"><p><strong>EN:</strong> An English translation is planned for the future. You can use your browser built-in auto-translate.</p></div>' +
      '<footer class="lib-footer">' +
      '<div class="copyright">© 2026 Dulat Irzhanov</div>' +
      '<div class="footer-links">' +
      '<a href="/ru/">dulatedu.com</a>' +
      '<a href="https://www.linkedin.com/in/dulat-irzhanov/" target="_blank" rel="noopener">LinkedIn</a>' +
      '</div></footer>';
  }

  function stars(n) {
    var s = "★★★★★☆☆☆☆☆".slice(5 - n, 10 - n);
    return '<span class="stars" role="img" aria-label="Авторитетность ' + n + ' из 5">' + s + '</span>';
  }

  function expertBlock(topic) {
    if (!topic.expert) return "";
    var e = topic.expert;
    var paras = e.paragraphs.map(function (p) { return "<p>" + noteHtml(p) + "</p>"; }).join("");
    var note = e.note ? '<p class="expert-note-small">' + noteHtml(e.note) + "</p>" : "";
    return '' +
      '<details class="expert-note">' +
      '<summary><span class="sum-text"><span>' + esc(e.label || "Экспертная записка") + '</span>' +
      '<small>Контекст: что происходит с актами и сроками</small></span><span class="pm" aria-hidden="true"></span></summary>' +
      paras + note + '</details>';
  }

  /* Нормализованный маршрут: шаги + хвост «Остальное» */
  function routeOf(topic) {
    var m = meta(topic.id);
    if (!m.steps) return null;
    var used = {};
    var steps = m.steps.map(function (st) {
      st.items.forEach(function (n) { used[n] = true; });
      return st;
    });
    var rest = [];
    topic.sources.forEach(function (_, i) { if (!used[i + 1]) rest.push(i + 1); });
    if (rest.length) steps = steps.concat([{ title: "Остальное", note: "", items: rest }]);
    return steps;
  }

  function sourceRow(src, n, total) {
    var summary = src.summary.map(function (p) { return '<p class="body-text">' + esc(p) + "</p>"; }).join("");
    return '' +
      '<details class="src" id="src-' + n + '">' +
      '<summary><span class="r-num">' + n + '</span><span class="r-name">' + esc(src.authorsShort) + '</span>' +
      stars(src.stars) + '<span class="pm" aria-hidden="true"></span></summary>' +
      '<div class="src-body">' +
      '<a class="btn-read" href="' + esc(src.readUrl) + '" target="_blank" rel="noopener">Открыть источник <span aria-hidden="true">↗</span></a>' +
      '<div class="practice"><div class="source-section-label">Практическое значение для директоров школ</div>' +
      '<p>' + esc(src.practice) + '</p></div>' +
      '<div class="source-section-label">Краткое саммари</div>' + summary +
      '<p class="authority-note">' + stars(src.stars) + ' ' + esc(src.starsNote) + '</p>' +
      '<div class="apa"><span class="apa-label">APA 7</span>' + apaHtml(src.apa) + '</div>' +
      '</div></details>';
  }

  function routeBlock(topic, steps) {
    var total = topic.sources.length;
    var html = steps.map(function (st, si) {
      var rows = st.items.map(function (n) { return sourceRow(topic.sources[n - 1], n, total); }).join("");
      return '' +
        '<section class="step' + (st.first ? ' step-first' : '') + '">' +
        '<div class="step-head"><span class="step-n">Шаг ' + (si + 1) + '</span>' +
        (st.first ? '<span class="chip-first">Начните здесь</span>' : '') + '</div>' +
        '<h2 class="step-title">' + esc(st.title) + '</h2>' +
        (st.note ? '<p class="step-note">' + esc(st.note) + '</p>' : '') +
        '<div class="src-list">' + rows + '</div></section>';
    }).join("");
    return '<div class="route" id="route">' + html + '</div>';
  }

  function plainList(topic) {
    var total = topic.sources.length;
    return '<div class="route plain"><div class="src-list">' +
      topic.sources.map(function (s, i) { return sourceRow(s, i + 1, total); }).join("") + '</div></div>';
  }

  function wireTopic() {
    var all = document.getElementById("toggle-all");
    var rows = [].slice.call(document.querySelectorAll("details.src"));
    if (all) all.addEventListener("click", function () {
      var open = all.getAttribute("data-open") !== "1";
      rows.forEach(function (d) { d.open = open; });
      all.setAttribute("data-open", open ? "1" : "0");
      all.textContent = open ? "Свернуть все" : "Развернуть все";
    });
    var h = location.hash.match(/^#src-(\d+)$/);
    if (h) {
      var el = document.getElementById("src-" + h[1]);
      if (el) { el.open = true; el.scrollIntoView({ block: "start" }); }
    }
  }

  window.SourcesTopic = {
    init: function () {
      var id = new URLSearchParams(location.search).get("id");
      var topic = SOURCES_TOPICS.find(function (t) { return t.id === id; }) || SOURCES_TOPICS[0];
      var m = meta(topic.id);
      document.title = topic.title + " | Библиотека источников | Дулат Иржанов";
      var steps = routeOf(topic);
      var total = topic.sources.length;

      document.body.innerHTML = '' +
        '<div class="lang-switcher"><a href="/sources/kz/topic.html?id=' + esc(topic.id) + '">KZ</a> | <a href="/sources/topic.html?id=' + esc(topic.id) + '" class="active">RU</a></div>' +
        '<nav class="crumbs" aria-label="Путь"><a href="/ru/">Главная</a><span aria-hidden="true">/</span><a href="/sources/">Библиотека источников</a></nav>' +
        '<header><h1>' + esc(topic.title) + '</h1></header>' +
        '<div class="lead"><div class="lead-label">Когда пригодится</div><p>' + esc(m.lead || topic.intro) + '</p></div>' +
        '<p class="topic-updated">' + srcWord(total) + ' · обзор целиком около ' + minutesFor(topic.sources) + ' мин · обновлено ' + dateRu(topic.updated) + '</p>' +
        '<details class="about"><summary><span>О подборке целиком</span><span class="pm" aria-hidden="true"></span></summary><p>' + esc(topic.intro) + '</p></details>' +
        expertBlock(topic) +
        '<div class="list-tools"><h2 class="list-title">Источники</h2><button type="button" id="toggle-all" class="link-btn" data-open="0">Развернуть все</button></div>' +
        (steps ? routeBlock(topic, steps) : plainList(topic)) +
        subscribeBlock() +
        footer();
      wireTopic();
    }
  };

  window.SourcesIndex = {
    init: function () {
      document.title = "Библиотека источников | Дулат Иржанов";
      var cards = SOURCES_TOPICS.map(function (t) {
        var m = meta(t.id);
        var first = routeOf(t);
        var hint = first ? "Есть порядок чтения" : "Порядок чтения любой";
        return '' +
          '<a class="topic-card" href="/sources/topic.html?id=' + esc(t.id) + '">' +
          '<div class="tc-top"><span class="tc-count">' + srcWord(t.sources.length) + ' · около ' + minutesFor(t.sources) + ' мин</span>' +
          (isNew(t.updated) ? '<span class="chip-new">Новое</span>' : '') + '</div>' +
          '<div class="title">' + esc(t.title) + '</div>' +
          '<p class="excerpt">' + esc(m.lead || t.intro) + '</p>' +
          '<div class="tc-foot"><span class="meta">' + hint + ' · обновлено ' + dateRu(t.updated) + '</span>' +
          '<span class="tc-cta">Открыть подборку <span aria-hidden="true">→</span></span></div></a>';
      }).join("");

      document.body.innerHTML = '' +
        '<div class="lang-switcher"><a href="/sources/kz/">KZ</a> | <a href="/sources/" class="active">RU</a></div>' +
        '<nav class="crumbs" aria-label="Путь"><a href="/ru/">Главная</a><span aria-hidden="true">/</span><span aria-current="page">Библиотека источников</span></nav>' +
        '<header><h1>Библиотека источников</h1></header>' +
        '<p class="lead lead-plain">Аннотированные обзоры современных источников по школьному управлению: авторитетность, краткое саммари и практическое значение для директоров школ.</p>' +
        '<div class="topic-list">' + cards + '</div>' +
        subscribeBlock() +
        footer();
    }
  };
})();
