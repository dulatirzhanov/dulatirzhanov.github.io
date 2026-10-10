/*
 * «Дереккөздер кітапханасы» бөлімінің қазақша нұсқасы.
 * SourcesIndex.init() - список тем (index.html)
 * SourcesTopic.init() - страница темы (topic.html?id=<id>)
 * Данные: sources-data.js (тексты) + sources-meta.js (lead и маршрут чтения).
 */
(function () {
  var MONTHS = ["қаңтар", "ақпан", "наурыз", "сәуір", "мамыр", "маусым", "шілде", "тамыз", "қыркүйек", "қазан", "қараша", "желтоқсан"];
  var NEW_DAYS = 30;

  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
  function apaHtml(s) { return esc(s).replace(/\*([^*]+)\*/g, "<em>$1</em>"); }
  function noteHtml(s) {
    return esc(s).replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener">$1</a>');
  }
  function srcWord(n) { return n + " дереккөз"; }
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
      '<h2 class="subscribe-title">Жаңа топтамалар туралы хат</h2>' +
      '<p class="subscribe-label">Хат жаңа топтама шыққанда келеді. Одан кез келген хаттағы сілтеме арқылы бас тартуға болады.</p>' +
      '<form class="subscribe-form" action="https://dulatedu.us6.list-manage.com/subscribe/post?u=9b32c150eb1859f084bfe3bcb&amp;id=c702192e41&amp;f_id=009822e2f0" method="POST" target="_blank">' +
      '<label class="sr-only" for="sub-email">Email мекенжайыңыз</label>' +
      '<input id="sub-email" type="email" name="EMAIL" placeholder="name@school.kz" autocomplete="email" required>' +
      '<div style="position:absolute;left:-5000px" aria-hidden="true"><input type="text" name="b_9b32c150eb1859f084bfe3bcb_c702192e41" tabindex="-1" value=""></div>' +
      '<button type="submit">Жазылу</button>' +
      '</form></section>';
  }

  function footer() {
    return '' +
      '<footer class="lib-footer">' +
      '<p class="lang-line"><strong>EN:</strong> An English translation is planned for the future. Browser auto-translate works.</p>' +
      '<div class="copyright">© 2026 Dulat Irzhanov</div>' +
      '<div class="footer-links">' +
      '<a href="/kz/">dulatedu.com</a>' +
      '<a href="https://www.linkedin.com/in/dulat-irzhanov/" target="_blank" rel="noopener">LinkedIn</a>' +
      '</div></footer>';
  }

  function stars(n) {
    var s = "★★★★★☆☆☆☆☆".slice(5 - n, 10 - n);
    return '<span class="stars" role="img" aria-label="Сенімділік бағасы: ' + n + ' / 5">' + s + '</span>';
  }

  function expertBlock(topic) {
    if (!topic.expert) return "";
    var e = topic.expert;
    var paras = e.paragraphs.map(function (p) { return "<p>" + noteHtml(p) + "</p>"; }).join("");
    var note = e.note ? '<p class="expert-note-small">' + noteHtml(e.note) + "</p>" : "";
    return '' +
      '<details class="expert-note">' +
      '<summary><span class="sum-text"><span>' + esc(e.label || "Сараптамалық жазба") + '</span>' +
      '<small>Контекст: актілер мен мерзімдердің қазіргі жағдайы</small></span><span class="pm" aria-hidden="true"></span></summary>' +
      paras + note + '</details>';
  }

  /* Нормализованный маршрут: қадамдар + «Қалғандары» */
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
    if (rest.length) steps = steps.concat([{ title: "Қалғандары", note: "", items: rest }]);
    return steps;
  }

  function sourceRow(src, n, total) {
    var summary = src.summary.map(function (p) { return '<p class="body-text">' + esc(p) + "</p>"; }).join("");
    return '' +
      '<details class="src" id="src-' + n + '">' +
      '<summary><span class="r-num">' + n + '</span><span class="r-name">' + esc(src.authorsShort) + '</span>' +
      stars(src.stars) + '<span class="pm" aria-hidden="true"></span></summary>' +
      '<div class="src-body">' +
      '<a class="btn-read" href="' + esc(src.readUrl) + '" target="_blank" rel="noopener">Дереккөзді ашу <span aria-hidden="true">↗</span></a>' +
      '<div class="practice"><div class="source-section-label">Мектеп директорлары үшін практикалық маңызы</div>' +
      '<p>' + esc(src.practice) + '</p></div>' +
      '<div class="source-section-label">Қысқаша мазмұны</div>' + summary +
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
        '<div class="step-head"><span class="step-n">' + (si + 1) + '-қадам</span>' +
        (st.first ? '<span class="chip-first">Осыдан бастаңыз</span>' : '') + '</div>' +
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
      all.textContent = open ? "Барлығын жабу" : "Барлығын ашу";
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
      document.title = topic.title + " | Дереккөздер кітапханасы | Дулат Иржанов";
      var steps = routeOf(topic);
      var total = topic.sources.length;

      document.body.innerHTML = '' +
        '<div class="lang-switcher"><a href="/sources/kz/topic.html?id=' + esc(topic.id) + '" class="active">KZ</a> | <a href="/sources/topic.html?id=' + esc(topic.id) + '">RU</a></div>' +
        '<nav class="crumbs" aria-label="Жол"><a href="/kz/">Басты бет</a><span aria-hidden="true">/</span><a href="/sources/kz/">Дереккөздер кітапханасы</a></nav>' +
        '<header><h1>' + esc(topic.title) + '</h1></header>' +
        '<div class="lead"><div class="lead-label">Қашан қажет</div><p>' + esc(m.lead || topic.intro) + '</p></div>' +
        '<p class="topic-updated">' + srcWord(total) + ' · шолудың өзі шамамен ' + minutesFor(topic.sources) + ' мин · ' + dateRu(topic.updated) + '</p>' +
        '<details class="about"><summary><span>Топтама туралы толығырақ</span><span class="pm" aria-hidden="true"></span></summary><p>' + esc(topic.intro) + '</p></details>' +
        expertBlock(topic) +
        '<div class="list-tools"><h2 class="list-title">Дереккөздер</h2><button type="button" id="toggle-all" class="link-btn" data-open="0">Барлығын ашу</button></div>' +
        (steps ? routeBlock(topic, steps) : plainList(topic)) +
        subscribeBlock() +
        footer();
      wireTopic();
    }
  };

  window.SourcesIndex = {
    init: function () {
      document.title = "Дереккөздер кітапханасы | Дулат Иржанов";
      var cards = SOURCES_TOPICS.map(function (t) {
        var m = meta(t.id);
        var first = routeOf(t);
        var hint = first ? "Оқу реті белгіленген" : "Оқу реті еркін";
        return '' +
          '<a class="topic-card" href="/sources/kz/topic.html?id=' + esc(t.id) + '">' +
          '<div class="tc-top"><span class="tc-count">' + srcWord(t.sources.length) + ' · шамамен ' + minutesFor(t.sources) + ' мин</span>' +
          (isNew(t.updated) ? '<span class="chip-new">Жаңа</span>' : '') + '</div>' +
          '<div class="title">' + esc(t.title) + '</div>' +
          '<p class="excerpt">' + esc(m.lead || t.intro) + '</p>' +
          '<div class="tc-foot"><span class="meta">' + hint + ' · ' + dateRu(t.updated) + '</span>' +
          '<span class="tc-cta">Топтаманы ашу <span aria-hidden="true">→</span></span></div></a>';
      }).join("");

      document.body.innerHTML = '' +
        '<div class="lang-switcher"><a href="/sources/kz/" class="active">KZ</a> | <a href="/sources/">RU</a></div>' +
        '<nav class="crumbs" aria-label="Жол"><a href="/kz/">Басты бет</a><span aria-hidden="true">/</span><span aria-current="page">Дереккөздер кітапханасы</span></nav>' +
        '<header><h1>Дереккөздер кітапханасы</h1></header>' +
        '<p class="lead lead-plain">Мектепті басқару жөніндегі заманауи дереккөздерге аннотацияланған шолулар: сенімділік бағасы, қысқаша мазмұны және мектеп директорлары үшін практикалық маңызы.</p>' +
        '<div class="topic-list">' + cards + '</div>' +
        subscribeBlock() +
        footer();
    }
  };
})();
