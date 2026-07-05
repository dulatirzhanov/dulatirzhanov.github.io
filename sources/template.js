/*
 * Рендер раздела «Библиотека источников».
 * SourcesIndex.init() — список тем (index.html)
 * SourcesTopic.init() — страница темы (topic.html?id=<id>)
 */
(function () {
  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  function starsHtml(n) {
    return "★★★★★☆☆☆☆☆".slice(5 - n, 10 - n);
  }

  function footer() {
    return `
      <footer class="lib-footer">
        <div class="copyright">© 2026 Dulat Irzhanov</div>
        <div class="footer-links">
          <a href="https://dulatedu.com/">dulatedu.com</a>
          <a href="https://www.linkedin.com/in/dulat-irzhanov/" target="_blank" rel="noopener">LinkedIn</a>
        </div>
      </footer>`;
  }

  function sourceCard(src, i) {
    const summary = src.summary.map(p => `<p class="body-text">${esc(p)}</p>`).join("");
    return `
      <article class="source-card" id="src-${i + 1}">
        <div class="source-num">Источник ${i + 1}</div>
        <h2 class="source-title">${esc(src.authorsShort)}</h2>
        <div class="apa"><span class="apa-label">APA 7</span>${esc(src.apa)}</div>
        <a class="read-link" href="${esc(src.readUrl)}" target="_blank" rel="noopener">📖 Читать →</a>
        <p class="authority"><span class="stars">${starsHtml(src.stars)}</span>${esc(src.starsNote)}</p>
        <div class="source-section-label">Краткое саммари</div>
        ${summary}
        <div class="practice">
          <div class="source-section-label">Практическое значение для директоров школ</div>
          <p>${esc(src.practice)}</p>
        </div>
      </article>`;
  }

  window.SourcesTopic = {
    init: function () {
      const id = new URLSearchParams(location.search).get("id");
      const topic = SOURCES_TOPICS.find(t => t.id === id) || SOURCES_TOPICS[0];
      document.title = topic.title + " | Библиотека источников | Дулат Иржанов";

      const toc = topic.sources.map((s, i) =>
        `<li><a href="#src-${i + 1}">${esc(s.authorsShort)}</a></li>`).join("");

      document.body.innerHTML = `
        <header>
          <h1>${esc(topic.title)}</h1>
        </header>
        <nav class="backnav"><a href="/sources/">← Все темы</a> &nbsp;·&nbsp; <a href="/">← На главную</a></nav>
        <p class="subtitle">${esc(topic.intro)}</p>
        <p class="topic-updated">Обновлено: ${esc(topic.updated)} · Источников: ${topic.sources.length}</p>
        <nav class="toc">
          <div class="toc-label">В этом обзоре</div>
          <ol>${toc}</ol>
        </nav>
        ${topic.sources.map(sourceCard).join("")}
        ${footer()}`;
    }
  };

  window.SourcesIndex = {
    init: function () {
      document.title = "Библиотека источников | Дулат Иржанов";
      const cards = SOURCES_TOPICS.map(t => `
        <a class="topic-card" href="/sources/topic.html?id=${esc(t.id)}">
          <div class="title">${esc(t.title)}</div>
          <p class="meta">Источников: ${t.sources.length} · Обновлено: ${esc(t.updated)}</p>
          <p class="excerpt">${esc(t.intro)}</p>
        </a>`).join("");

      document.body.innerHTML = `
        <header>
          <h1>Библиотека источников</h1>
        </header>
        <nav class="backnav"><a href="/">← На главную</a></nav>
        <p class="subtitle">Аннотированные обзоры современных источников по школьному управлению: авторитетность, краткое саммари и практическое значение для директоров школ.</p>
        <div class="topic-list">${cards}</div>
        ${footer()}`;
    }
  };
})();
