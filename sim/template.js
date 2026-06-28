(function () {
  function s(key) {
    return UI_STRINGS.ru[key] || key;
  }

  function tagLabel(tag) {
    return TAG_LABELS[tag]?.ru || tag;
  }

  function uniqueTags() {
    const set = new Set();
    CASES_DATA.forEach(c => c.tags.forEach(t => set.add(t)));
    return Array.from(set);
  }

  function firstSentence(text) {
    if (!text) return "";
    const m = text.match(/^.+?[.!?…]/);
    return m ? m[0] : text.substring(0, 100) + (text.length > 100 ? "…" : "");
  }

  /* ===== LIBRARY ===== */
  window.SimLib = {
    init: function () {
      document.body.classList.add("lib-view");

      document.body.innerHTML = `
        <header>
          <h1>${s("libraryTitle")}</h1>
        </header>
        <nav class="backnav"><a href="/">${s("backToHome")}</a></nav>
        <p class="subtitle">${s("librarySubtitle")}</p>
        <div class="subscribe-block">
          <p class="subscribe-label">${s("subscribeLabel")}</p>
          <form class="subscribe-form" action="https://dulatedu.us6.list-manage.com/subscribe/post?u=9b32c150eb1859f084bfe3bcb&amp;id=c702192e41&amp;f_id=009822e2f0" method="POST" target="_blank">
            <input type="email" name="EMAIL" placeholder="${s("subscribePlaceholder")}" required>
            <div style="position:absolute;left:-5000px" aria-hidden="true"><input type="text" name="b_9b32c150eb1859f084bfe3bcb_c702192e41" tabindex="-1" value=""></div>
            <button type="submit">${s("subscribeButton")}</button>
          </form>
        </div>
        <div class="filters" id="filters"></div>
        <div class="grid" id="grid"></div>
        <div class="empty-state" id="emptyState" style="display:none">${s("noResults")}</div>
        <div class="lang-note">
          <p><strong>KZ:</strong> Осы ақпарат уақыт үнемдеу мақсатымен орыс тілінде жазылды. Алдағы уақытта қазақ тіліне аударылады. Браузердегі авто-аударманы қолдануға болады.</p>
          <p><strong>EN:</strong> This content is written in Russian to save time. A Kazakh translation is planned for the future. You can use your browser's built-in auto-translate.</p>
        </div>
        <footer class="lib-footer">
          <div class="copyright">© 2026 Dulat Irzhanov</div>
          <div class="footer-links">
            <a href="https://dulatedu.com/">dulatedu.com</a>
            <a href="https://www.linkedin.com/in/dulat-irzhanov/" target="_blank" rel="noopener">LinkedIn</a>
          </div>
        </footer>
      `;

      document.title = s("libraryTitle") + " — Sim";

      let activeFilter = "all";

      function renderFilters() {
        const container = document.getElementById("filters");
        const allChip = `<button class="filter-chip ${activeFilter === "all" ? "active" : ""}" data-tag="all">${s("filterAll")}</button>`;
        const chips = uniqueTags().map(tag => {
          const label = tagLabel(tag);
          return `<button class="filter-chip ${activeFilter === tag ? "active" : ""}" data-tag="${tag}">${label}</button>`;
        }).join("");
        container.innerHTML = allChip + chips;
        container.querySelectorAll(".filter-chip").forEach(btn => {
          btn.addEventListener("click", () => {
            activeFilter = btn.dataset.tag;
            renderFilters();
            renderCards();
          });
        });
      }

      function renderCards() {
        const grid = document.getElementById("grid");
        const filtered = CASES_DATA.filter(c => activeFilter === "all" || c.tags.includes(activeFilter));
        document.getElementById("emptyState").style.display = filtered.length ? "none" : "block";

        grid.innerHTML = filtered.map(c => {
          const displayLang = c.availableLangs.includes("ru") ? "ru" : c.availableLangs[0];
          const title = c.title[displayLang] || c.title.ru || "";
          const excerpt = c.excerpt[displayLang] || c.excerpt.ru || "";
          const chapter = c.chapter[displayLang] || c.chapter.ru || "";
          const tagPills = c.tags.map(tag => `<span class="tag">${tagLabel(tag)}</span>`).join("");
          const caseHref = LANG_BASE_PATHS.ru + "case.html?id=" + c.id;

          return `
            <a class="card" href="${caseHref}">
              <div class="chapter">${chapter}</div>
              <div class="title">${title}</div>
              <div class="excerpt">${excerpt}</div>
              <div class="tags">${tagPills}</div>
            </a>
          `;
        }).join("");
      }

      renderFilters();
      renderCards();

    }
  };

  /* ===== CASE PAGE ===== */
  window.SimCase = {
    init: function () {
      document.body.classList.add("case-view");

      const params = new URLSearchParams(window.location.search);
      const id = params.get("id") || window.SIM_DEFAULT_CASE_ID;
      const caseData = CASES_DATA.find(c => c.id === id);

      if (!caseData) {
        document.body.innerHTML = `<div style="padding:60px 40px;font-family:Arial,sans-serif">
          <p>Кейс не найден. <a href="${LANG_BASE_PATHS.ru}" style="color:#0a66c2">${s("backToLib")}</a></p>
        </div>`;
        return;
      }

      const displayLang = caseData.availableLangs.includes("ru") ? "ru" : caseData.availableLangs[0];

      function f(obj) {
        if (!obj) return "";
        return obj[displayLang] || obj[caseData.availableLangs[0]] || obj.ru || "";
      }

      const caseIndex = CASES_DATA.indexOf(caseData) + 1;
      const scenes = caseData.narrativeScenes || [];
      const actions = caseData.actions || [];
      const hasContent = scenes.length > 0;

      // Sidebar nav
      let sidebarNav = "";
      if (hasContent) {
        sidebarNav += `<div class="nav-section-title">${s("situationSection")}</div>`;
        scenes.forEach((scene, i) => {
          sidebarNav += `<div class="nav-item" data-pane="scene${i}"><span class="check">✓</span><span>${f(scene.heading)}</span></div>`;
        });
        sidebarNav += `<div class="nav-section-title">${s("actionsSection")}</div>`;
        sidebarNav += `<div class="nav-item" data-pane="actionsOverview"><span class="check">✓</span><span>${s("actionsTitle")}</span></div>`;
        actions.forEach((action, i) => {
          sidebarNav += `<div class="nav-item sub" data-pane="action${i}"><span class="check">✓</span><span>${f(action.label)}</span></div>`;
        });
        sidebarNav += `<div class="nav-section-title">${s("conclusionSection")}</div>`;
        sidebarNav += `<div class="nav-item" data-pane="expert"><span class="check">✓</span><span>${s("expertLabel")}</span></div>`;
        sidebarNav += `<div class="nav-item" data-pane="reflection"><span class="check">✓</span><span>${s("reflectionLabel")}</span></div>`;
        sidebarNav += `<div class="nav-item" data-pane="resources"><span class="check">✓</span><span>${s("resourcesLabel")}</span></div>`;
      }

      // Build panes HTML
      let panesHtml = "";

      if (!hasContent) {
        panesHtml = `
          <div class="coming-soon-pane pane active" data-id="main">
            <h2>${s("comingSoonTitle")}</h2>
            <p>${s("comingSoonText")}</p>
          </div>
        `;
      } else {
        // Scene panes
        scenes.forEach((scene, i) => {
          const isLast = i === scenes.length - 1;
          const nextPane = isLast ? "actionsOverview" : `scene${i + 1}`;
          const nextBtnText = isLast ? s("viewOptions") : s("next");
          const textHtml = f(scene.text).split("\n\n").map(p => `<p>${p.trim()}</p>`).join("");
          const bridgeHtml = isLast && f(caseData.bridgeQuestion)
            ? `<div class="bridge-question">${f(caseData.bridgeQuestion)}</div>` : "";
          panesHtml += `
            <section class="pane" data-id="scene${i}">
              <div class="eyebrow">${s("situationSection")}</div>
              <h2>${f(scene.heading)}</h2>
              ${textHtml}
              ${bridgeHtml}
              <a class="back-link" data-next="${nextPane}">${nextBtnText}</a>
            </section>
          `;
        });

        // Actions overview
        const actionRows = actions.map((action, i) => `
          <div class="action-row">
            <div>
              <div class="label">${f(action.label)}</div>
              <div class="desc">${firstSentence(f(action.detail))}</div>
            </div>
            <button data-next="action${i}">${s("openAction")}</button>
          </div>
        `).join("");

        panesHtml += `
          <section class="pane" data-id="actionsOverview">
            <div class="eyebrow">${s("actionsSection")}</div>
            <h2>${s("actionsTitle")}</h2>
            <p>${f(caseData.actionsIntro)}</p>
            <div class="actions-list">${actionRows}</div>
            <a class="back-link" data-next="expert">${s("next")}</a>
          </section>
        `;

        // Individual action panes
        actions.forEach((action, i) => {
          const pq = action.pullQuote;
          const pqText = f(pq?.text);
          const pqHtml = pqText ? `
            <div class="pull-quote">
              ${pqText}
              ${f(pq?.source) ? `<span class="source">${f(pq.source)}</span>` : ""}
            </div>` : "";

          const resItems = (action.resources || []).filter(r => r.url).map(r =>
            `<li><a href="${r.url}" target="_blank" rel="noopener">${f(r.label)}</a></li>`
          ).join("");
          const resHtml = resItems ? `<ul class="resource-list">${resItems}</ul>` : "";

          const detailHtml = f(action.detail).split("\n\n").map(p => `<p>${p.trim()}</p>`).join("");

          panesHtml += `
            <section class="pane" data-id="action${i}">
              <div class="eyebrow">${s("actionsSection")}</div>
              <h2>${f(action.label)}</h2>
              ${detailHtml}
              ${pqHtml}
              ${resHtml}
              <a class="back-link" data-next="actionsOverview">${s("backToActions")}</a>
            </section>
          `;
        });

        // Expert commentary
        const expertHtml = f(caseData.expertCommentary?.text).split("\n\n").map(p => `<p>${p.trim()}</p>`).join("");
        const accNote = f(caseData.expertCommentary?.accreditationNote);
        const accHtml = accNote ? `
          <button class="accreditation-toggle" aria-expanded="false">Как это выглядит с точки зрения международной аккредитации?</button>
          <p class="accreditation-note" hidden>${accNote}</p>
        ` : "";
        panesHtml += `
          <section class="pane" data-id="expert">
            <div class="eyebrow">${s("conclusionSection")}</div>
            <h2>${s("expertLabel")}</h2>
            ${expertHtml}
            ${accHtml}
            <a class="back-link" data-next="reflection">${s("next")}</a>
          </section>
        `;

        // Reflection questions
        let reflHtml = "";
        let inList = false;
        (caseData.reflectionQuestions || []).forEach(q => {
          if (q.isHeading) {
            if (inList) { reflHtml += "</ol>"; inList = false; }
            reflHtml += `<p class="reflection-section-title">${f(q)}</p>`;
          } else {
            if (!inList) { reflHtml += `<ol class="reflection-list">`; inList = true; }
            reflHtml += `<li>${f(q)}</li>`;
          }
        });
        if (inList) reflHtml += "</ol>";
        panesHtml += `
          <section class="pane" data-id="reflection">
            <div class="eyebrow">${s("conclusionSection")}</div>
            <h2>${s("reflectionLabel")}</h2>
            ${reflHtml}
            <a class="back-link" data-next="resources">${s("next")}</a>
          </section>
        `;

        // Resources & share
        const followItems = (caseData.followUpResources || []).filter(r => r.url).map(r =>
          `<li><a href="${r.url}" target="_blank" rel="noopener">${f(r.label)}</a></li>`
        ).join("");
        const followHtml = followItems ? `<ul class="resource-list">${followItems}</ul>` : "";

        const emailSubject = encodeURIComponent(f(caseData.title));
        panesHtml += `
          <section class="pane" data-id="resources">
            <div class="eyebrow">${s("conclusionSection")}</div>
            <h2>${s("furtherResources")}</h2>
            ${followHtml}
            <div class="share-block">
              <p style="margin-top:0"><strong>${s("shareCTA")}</strong> ${s("shareText")}</p>
              <a class="cta" href="mailto:${caseData.shareEmail}?subject=${emailSubject}">${s("shareButton")}</a>
              <span class="email-text">${s("shareEmailLabel")} ${caseData.shareEmail}</span>
            </div>
            <div class="content-footer">
              <div class="copyright">© 2026 Dulat Irzhanov</div>
              <div class="footer-links">
                <a href="https://dulatedu.com/">dulatedu.com</a>
                <a href="https://www.linkedin.com/in/dulat-irzhanov/" target="_blank" rel="noopener">LinkedIn</a>
              </div>
            </div>
          </section>
        `;
      }

      // Pane order for progress tracking
      const paneOrder = hasContent ? [
        ...scenes.map((_, i) => `scene${i}`),
        "actionsOverview",
        ...actions.map((_, i) => `action${i}`),
        "expert", "reflection", "resources"
      ] : ["main"];

      // Render DOM
      document.body.innerHTML = `
        <header class="case-topbar">
          <button class="hamburger" id="hamburger" aria-label="Открыть меню кейса" aria-controls="sidebar" aria-expanded="false">☰</button>
          <div class="topbar-title">${f(caseData.title)}</div>
          <div class="topbar-progress"><span id="topbarProgress"></span></div>
        </header>
        <div class="drawer-backdrop" id="drawerBackdrop"></div>
        <nav class="sidebar" id="sidebar" aria-label="${f(caseData.title)}">
          <div class="case-label">${s("caseLabel")} ${caseIndex} · ${f(caseData.chapter)}</div>
          <h1>${f(caseData.title)}</h1>
          <div class="progress-track"><div class="progress-fill" id="progressFill"></div></div>
          <div class="progress-label" id="progressLabel">0${s("progressLabel")}</div>
          <div class="sidebar-nav">${sidebarNav}</div>
          <a class="sidebar-back" href="${LANG_BASE_PATHS.ru}">${s("backToLib")}</a>
          <div class="sidebar-footer">
            <div class="copyright">© 2026 Dulat Irzhanov</div>
            <div class="footer-links">
              <a href="https://dulatedu.com/">dulatedu.com</a>
              <a href="https://www.linkedin.com/in/dulat-irzhanov/" target="_blank" rel="noopener">LinkedIn</a>
            </div>
          </div>
        </nav>
        <main class="content">
          ${panesHtml}
          <footer class="case-page-footer">
            <div class="copyright">© 2026 Dulat Irzhanov</div>
            <div class="footer-links">
              <a href="https://dulatedu.com/">dulatedu.com</a>
              <a href="https://www.linkedin.com/in/dulat-irzhanov/" target="_blank" rel="noopener">LinkedIn</a>
            </div>
          </footer>
        </main>
      `;

      document.title = f(caseData.title) + " — Sim";

      // Mobile drawer open/close
      const sidebar = document.getElementById("sidebar");
      const hamburger = document.getElementById("hamburger");
      const backdrop = document.getElementById("drawerBackdrop");

      function openDrawer() {
        sidebar.classList.add("open");
        backdrop.classList.add("show");
        hamburger.setAttribute("aria-expanded", "true");
      }
      function closeDrawer() {
        sidebar.classList.remove("open");
        backdrop.classList.remove("show");
        hamburger.setAttribute("aria-expanded", "false");
      }
      hamburger.addEventListener("click", () => {
        sidebar.classList.contains("open") ? closeDrawer() : openDrawer();
      });
      backdrop.addEventListener("click", closeDrawer);
      document.addEventListener("keydown", e => { if (e.key === "Escape") closeDrawer(); });

      if (!hasContent) return;

      // Navigation logic
      const navItems = document.querySelectorAll(".nav-item");
      const panes = document.querySelectorAll(".pane");
      const visited = new Set();

      function showPane(paneId) {
        panes.forEach(p => p.classList.toggle("active", p.dataset.id === paneId));
        navItems.forEach(n => n.classList.toggle("active", n.dataset.pane === paneId));
        visited.add(paneId);
        navItems.forEach(n => { if (visited.has(n.dataset.pane)) n.classList.add("visited"); });
        const pct = Math.round((visited.size / paneOrder.length) * 100);
        document.getElementById("progressFill").style.width = pct + "%";
        document.getElementById("progressLabel").textContent = pct + s("progressLabel");
        const topbarProgress = document.getElementById("topbarProgress");
        if (topbarProgress) topbarProgress.style.width = pct + "%";
        closeDrawer();
        window.scrollTo(0, 0);
        const content = document.querySelector(".content");
        if (content) content.scrollTop = 0;
      }

      navItems.forEach(item => item.addEventListener("click", () => showPane(item.dataset.pane)));
      document.querySelectorAll("[data-next]").forEach(el => {
        el.addEventListener("click", e => { e.preventDefault(); showPane(el.dataset.next); });
      });
      document.querySelectorAll(".accreditation-toggle").forEach(btn => {
        btn.addEventListener("click", () => {
          const note = btn.nextElementSibling;
          const expanded = btn.getAttribute("aria-expanded") === "true";
          btn.setAttribute("aria-expanded", String(!expanded));
          note.hidden = expanded;
        });
      });

      showPane("scene0");
    }
  };
})();
