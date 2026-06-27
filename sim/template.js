(function () {
  const ALL_LANGS = ["ru", "kk", "en"];
  const LANG_LABELS = { ru: "RU", kk: "KZ", en: "EN" };

  function s(key) {
    return UI_STRINGS[CURRENT_LANG][key] || UI_STRINGS.en[key] || key;
  }

  function tagLabel(tag) {
    return TAG_LABELS[tag]?.[CURRENT_LANG] || TAG_LABELS[tag]?.en || tag;
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

  function langSwitcherHtml(activeLang, links) {
    return ALL_LANGS.map(l => {
      const label = LANG_LABELS[l];
      if (l === activeLang) return `<span class="active">${label}</span>`;
      return `<a href="${links[l]}">${label}</a>`;
    }).join(" | ");
  }

  /* ===== LIBRARY ===== */
  window.SimLib = {
    init: function () {
      document.body.classList.add("lib-view");

      const libLinks = {};
      ALL_LANGS.forEach(l => { libLinks[l] = LANG_BASE_PATHS[l]; });

      const banner = s("i18nBanner") && CURRENT_LANG === "en"
        ? `<div class="i18n-banner">${s("i18nBanner")}</div>` : "";

      document.body.innerHTML = `
        <div class="lang-switcher">${langSwitcherHtml(CURRENT_LANG, libLinks)}</div>
        <header>
          <h1>${s("libraryTitle")}</h1>
          <p class="subtitle">${s("librarySubtitle")}</p>
        </header>
        <nav class="backnav"><a href="/">${s("backToHome")}</a></nav>
        ${banner}
        <div class="filters" id="filters"></div>
        <div class="grid" id="grid"></div>
        <div class="empty-state" id="emptyState" style="display:none">${s("noResults")}</div>
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
          const displayLang = c.availableLangs.includes(CURRENT_LANG) ? CURRENT_LANG : c.availableLangs[0];
          const title = c.title[displayLang] || c.title.ru || "";
          const excerpt = c.excerpt[displayLang] || c.excerpt.ru || "";
          const chapter = c.chapter[displayLang] || c.chapter.ru || "";
          const fallbackNote = displayLang !== CURRENT_LANG
            ? ` <span class="fallback-lang">(${LANG_LABELS[displayLang]})</span>` : "";

          const langPills = ALL_LANGS.map(l => {
            const on = c.availableLangs.includes(l);
            if (on) {
              const href = LANG_BASE_PATHS[l] + "case.html?id=" + c.id;
              return `<a href="${href}" class="lang-pill" onclick="event.stopPropagation()">${LANG_LABELS[l]}</a>`;
            }
            return `<span class="lang-pill off">${LANG_LABELS[l]}</span>`;
          }).join("");

          const tagPills = c.tags.map(tag => `<span class="tag">${tagLabel(tag)}</span>`).join("");
          const caseHref = LANG_BASE_PATHS[displayLang] + "case.html?id=" + c.id;

          return `
            <a class="card" href="${caseHref}">
              <div class="chapter">${chapter}</div>
              <div class="title">${title}${fallbackNote}</div>
              <div class="excerpt">${excerpt}</div>
              <div class="tags">${tagPills}</div>
              <div class="langs">${langPills}</div>
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
      const id = params.get("id");
      const caseData = CASES_DATA.find(c => c.id === id);

      if (!caseData) {
        document.body.innerHTML = `<div style="padding:60px 40px;font-family:Arial,sans-serif">
          <p>Case not found. <a href="${LANG_BASE_PATHS[CURRENT_LANG]}" style="color:#0a66c2">${s("backToLib")}</a></p>
        </div>`;
        return;
      }

      const displayLang = caseData.availableLangs.includes(CURRENT_LANG)
        ? CURRENT_LANG : caseData.availableLangs[0];

      function f(obj) {
        if (!obj) return "";
        return obj[displayLang] || obj[caseData.availableLangs[0]] || obj.ru || "";
      }

      const caseIndex = CASES_DATA.indexOf(caseData) + 1;
      const scenes = caseData.narrativeScenes || [];
      const actions = caseData.actions || [];
      const hasContent = scenes.length > 0;

      // Lang switcher links for this case
      const caseLinks = {};
      ALL_LANGS.forEach(l => {
        caseLinks[l] = caseData.availableLangs.includes(l)
          ? LANG_BASE_PATHS[l] + "case.html?id=" + id
          : LANG_BASE_PATHS[l];
      });

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
              <div class="eyebrow">${f(action.label)}</div>
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
        panesHtml += `
          <section class="pane" data-id="expert">
            <div class="eyebrow">${s("expertLabel")}</div>
            <h2>${s("expertLabel")}</h2>
            ${expertHtml}
            <a class="back-link" data-next="reflection">${s("next")}</a>
          </section>
        `;

        // Reflection questions
        const reflItems = (caseData.reflectionQuestions || []).map(q => `<li>${f(q)}</li>`).join("");
        panesHtml += `
          <section class="pane" data-id="reflection">
            <div class="eyebrow">${s("reflectionLabel")}</div>
            <h2>${s("reflectionLabel")}</h2>
            <ol class="reflection-list">${reflItems}</ol>
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
            <div class="eyebrow">${s("resourcesLabel")}</div>
            <h2>${s("furtherResources")}</h2>
            ${followHtml}
            <div class="share-block">
              <p style="margin-top:0"><strong>${s("shareCTA")}</strong> ${s("shareText")}</p>
              <a class="cta" href="mailto:${caseData.shareEmail}?subject=${emailSubject}">${s("shareButton")}</a>
              <span class="email-text">${s("shareEmailLabel")} ${caseData.shareEmail}</span>
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

      // Sidebar toggle label per language
      const toggleLabels = { en: "Case structure", ru: "Структура кейса", kk: "Кейс құрылымы" };
      const toggleLabel = toggleLabels[CURRENT_LANG] || toggleLabels.en;

      // Render DOM
      document.body.innerHTML = `
        <button class="sidebar-toggle" id="sidebarToggle" aria-expanded="false" aria-controls="sidebar">
          ☰ ${toggleLabel}
        </button>
        <nav class="sidebar" id="sidebar" aria-label="${toggleLabel}">
          <div class="case-label">${s("caseLabel")} ${caseIndex} · ${f(caseData.chapter)}</div>
          <h1>${f(caseData.title)}</h1>
          <div class="lang-switcher">${langSwitcherHtml(CURRENT_LANG, caseLinks)}</div>
          <div class="progress-track"><div class="progress-fill" id="progressFill"></div></div>
          <div class="progress-label" id="progressLabel">0${s("progressLabel")}</div>
          ${sidebarNav}
          <a class="sidebar-back" href="${LANG_BASE_PATHS[CURRENT_LANG]}">${s("backToLib")}</a>
        </nav>
        <main class="content">${panesHtml}</main>
      `;

      document.title = f(caseData.title) + " — Sim";

      // Mobile sidebar toggle
      const toggleBtn = document.getElementById("sidebarToggle");
      const sidebar = document.getElementById("sidebar");
      toggleBtn.addEventListener("click", () => {
        const isOpen = sidebar.classList.toggle("open");
        toggleBtn.classList.toggle("is-open", isOpen);
        toggleBtn.setAttribute("aria-expanded", isOpen);
        toggleBtn.textContent = (isOpen ? "✕ " : "☰ ") + toggleLabel;
      });
      // Close sidebar when a nav item is clicked on mobile
      function closeSidebarOnMobile() {
        if (window.innerWidth <= 700) {
          sidebar.classList.remove("open");
          toggleBtn.classList.remove("is-open");
          toggleBtn.setAttribute("aria-expanded", "false");
          toggleBtn.textContent = "☰ " + toggleLabel;
        }
      }

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
        closeSidebarOnMobile();
        window.scrollTo(0, 0);
        const content = document.querySelector(".content");
        if (content) content.scrollTop = 0;
      }

      navItems.forEach(item => item.addEventListener("click", () => showPane(item.dataset.pane)));
      document.querySelectorAll("[data-next]").forEach(el => {
        el.addEventListener("click", e => { e.preventDefault(); showPane(el.dataset.next); });
      });

      showPane("scene0");
    }
  };
})();
