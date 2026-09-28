/*
 * «Дереккөздер кітапханасы» бөлімінің қазақша нұсқасын көрсету.
 * SourcesIndex.init() - тақырыптар тізімі (index.html)
 * SourcesTopic.init() - тақырып беті (topic.html?id=<id>)
 */
(function () {
  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  function apaHtml(s) {
    return esc(s).replace(/\*([^*]+)\*/g, "<em>$1</em>");
  }

  function starsHtml(n) {
    return "★★★★★☆☆☆☆☆".slice(5 - n, 10 - n);
  }

  function subscribeBlock() {
    return `
      <div class="subscribe-block">
        <p class="subscribe-label">Жаңа материалдар туралы хабар алып тұру үшін жазылыңыз:</p>
        <form class="subscribe-form" action="https://dulatedu.us6.list-manage.com/subscribe/post?u=9b32c150eb1859f084bfe3bcb&amp;id=c702192e41&amp;f_id=009822e2f0" method="POST" target="_blank">
          <input type="email" name="EMAIL" placeholder="Email мекенжайыңыз" required>
          <div style="position:absolute;left:-5000px" aria-hidden="true"><input type="text" name="b_9b32c150eb1859f084bfe3bcb_c702192e41" tabindex="-1" value=""></div>
          <button type="submit">Жазылу</button>
        </form>
      </div>`;
  }

  function noteHtml(s) {
    return esc(s).replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener">$1</a>');
  }

  function expertBlock(topic) {
    if (!topic.expert) return "";
    const e = topic.expert;
    const paras = e.paragraphs.map(p => `<p>${noteHtml(p)}</p>`).join("");
    const note = e.note ? `<p class="expert-note-small">${noteHtml(e.note)}</p>` : "";
    return `
      <section class="expert-note">
        <div class="source-section-label">${esc(e.label || "Сараптамалық жазба")}</div>
        ${paras}
        ${note}
      </section>`;
  }

  function footer() {
    return `
      <div class="lang-note">
        <p><strong>EN:</strong> An English translation is planned for the future. You can use your browser's built-in auto-translate.</p>
      </div>
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
        <div class="source-num">${i + 1}-дереккөз</div>
        <h2 class="source-title">${esc(src.authorsShort)}</h2>
        <div class="apa"><span class="apa-label">APA 7</span>${apaHtml(src.apa)}</div>
        <a class="read-link" href="${esc(src.readUrl)}" target="_blank" rel="noopener">📖 Оқу →</a>
        <p class="authority"><span class="stars">${starsHtml(src.stars)}</span>${esc(src.starsNote)}</p>
        <div class="source-section-label">Қысқаша мазмұны</div>
        ${summary}
        <div class="practice">
          <div class="source-section-label">Мектеп директорлары үшін практикалық маңызы</div>
          <p>${esc(src.practice)}</p>
        </div>
      </article>`;
  }

  window.SourcesTopic = {
    init: function () {
      const id = new URLSearchParams(location.search).get("id");
      const topic = SOURCES_TOPICS.find(t => t.id === id) || SOURCES_TOPICS[0];
      document.title = topic.title + " | Дереккөздер кітапханасы | Дулат Иржанов";

      const toc = topic.sources.map((s, i) =>
        `<li><a href="#src-${i + 1}">${esc(s.authorsShort)}</a></li>`).join("");

      document.body.innerHTML = `
        <div class="lang-switcher">
          <a href="/sources/kz/topic.html?id=${esc(topic.id)}" class="active">KZ</a> | <a href="/sources/topic.html?id=${esc(topic.id)}">RU</a>
        </div>
        <header>
          <h1>${esc(topic.title)}</h1>
        </header>
        <nav class="backnav"><a href="/sources/kz/">← Тақырыптар</a> &nbsp;·&nbsp; <a href="/kz/">← Басты бетке</a></nav>
        <p class="subtitle">${esc(topic.intro)}</p>
        <p class="topic-updated">Жаңартылған күні: ${esc(topic.updated)} · Дереккөз саны: ${topic.sources.length}</p>
        ${expertBlock(topic)}
        ${subscribeBlock()}
        <nav class="toc">
          <div class="toc-label">Осы шолуда</div>
          <ol>${toc}</ol>
        </nav>
        ${topic.sources.map(sourceCard).join("")}
        ${footer()}`;
    }
  };

  window.SourcesIndex = {
    init: function () {
      document.title = "Дереккөздер кітапханасы | Дулат Иржанов";
      const cards = SOURCES_TOPICS.map(t => `
        <a class="topic-card" href="/sources/kz/topic.html?id=${esc(t.id)}">
          <div class="title">${esc(t.title)}</div>
          <p class="meta">Дереккөз саны: ${t.sources.length} · Жаңартылған күні: ${esc(t.updated)}</p>
          <p class="excerpt">${esc(t.intro)}</p>
        </a>`).join("");

      document.body.innerHTML = `
        <div class="lang-switcher">
          <a href="/sources/kz/" class="active">KZ</a> | <a href="/sources/">RU</a>
        </div>
        <header>
          <h1>Дереккөздер кітапханасы</h1>
        </header>
        <nav class="backnav"><a href="/kz/">← Басты бетке</a></nav>
        <p class="subtitle">Мектепті басқару жөніндегі заманауи дереккөздерге аннотацияланған шолулар: сенімділік бағасы, қысқаша мазмұны және мектеп директорлары үшін практикалық маңызы.</p>
        ${subscribeBlock()}
        <div class="topic-list">${cards}</div>
        ${footer()}`;
    }
  };
})();
