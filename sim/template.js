(function () {
  function s(key) {
    return UI_STRINGS[CURRENT_LANG]?.[key] ?? UI_STRINGS.ru[key] ?? key;
  }

  function tagLabel(tag) {
    return TAG_LABELS[tag]?.[CURRENT_LANG] || TAG_LABELS[tag]?.ru || tag;
  }

  function basePath() {
    return LANG_BASE_PATHS[CURRENT_LANG] || LANG_BASE_PATHS.ru || "/sim/";
  }

  function homePath() {
    return CURRENT_LANG === "kk" ? "/kz/" : CURRENT_LANG === "ru" ? "/ru/" : "/";
  }

  function languageSwitcher(caseId) {
    const suffix = caseId ? `case.html?id=${caseId}` : "";
    const kzClass = CURRENT_LANG === "kk" ? ' class="active"' : "";
    const ruClass = CURRENT_LANG === "ru" ? ' class="active"' : "";
    return `<div class="lang-switcher"><a href="${LANG_BASE_PATHS.kk}${suffix}"${kzClass}>KZ</a> | <a href="${LANG_BASE_PATHS.ru}${suffix}"${ruClass}>RU</a></div>`;
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
      const hasReleaseOneContent = CURRENT_LANG === "ru" || CURRENT_LANG === "kk";

      const howBlock = hasReleaseOneContent ? `
        <details class="how-block" id="how">
          <summary><span>${s("howTitle")}</span><small>${s("howSummary")}</small></summary>
          <div class="how-content">
            <p class="section-intro">${s("howIntro")}</p>
            <div class="how-steps">
            <div class="how-step"><span>1</span><div><strong>${s("howStep1Title")}</strong><p>${s("howStep1Text")}</p></div></div>
            <div class="how-step"><span>2</span><div><strong>${s("howStep2Title")}</strong><p>${s("howStep2Text")}</p></div></div>
            <div class="how-step"><span>3</span><div><strong>${s("howStep3Title")}</strong><p>${s("howStep3Text")}</p></div></div>
            </div>
            <p class="how-note">${s("howNote")}</p>
          </div>
        </details>
      ` : "";

      const libraryActions = hasReleaseOneContent ? `
        <div class="library-actions">
          <a class="primary" href="#cases">${s("jumpToCases")}</a>
          <a href="#how" id="howOpen">${s("jumpToHow")}</a>
        </div>
      ` : "";

      const aboutBlock = hasReleaseOneContent ? `
        <section class="about-block" aria-labelledby="about-title">
          <img src="/profile.png" alt="Дулат Иржанов" width="88" height="88">
          <div>
            <h2 id="about-title">${s("aboutTitle")}</h2>
            <p>${s("aboutText")}</p>
            <p class="about-method">${s("aboutMethod")}</p>
          </div>
        </section>
      ` : "";

      const subscribeBlock = `
        <div class="subscribe-block">
          <p class="subscribe-label">${s("subscribeLabel")}</p>
          <form class="subscribe-form" action="https://dulatedu.us6.list-manage.com/subscribe/post?u=9b32c150eb1859f084bfe3bcb&amp;id=c702192e41&amp;f_id=009822e2f0" method="POST" target="_blank">
            <input type="email" name="EMAIL" placeholder="${s("subscribePlaceholder")}" required>
            <div style="position:absolute;left:-5000px" aria-hidden="true"><input type="text" name="b_9b32c150eb1859f084bfe3bcb_c702192e41" tabindex="-1" value=""></div>
            <button type="submit">${s("subscribeButton")}</button>
          </form>
          ${hasReleaseOneContent ? `<p class="subscribe-note">${s("subscribeNote")}</p>` : ""}
        </div>
      `;

      document.body.innerHTML = `
        ${languageSwitcher()}
        <nav class="crumbs" aria-label="${s("crumbsLabel")}"><a href="${homePath()}">${s("crumbHome")}</a><span aria-hidden="true">/</span><span aria-current="page">${s("libraryTitle")}</span></nav>
        <header>
          <h1>${s("libraryTitle")}</h1>
        </header>
        <p class="subtitle">${s("librarySubtitle")}</p>
        ${hasReleaseOneContent ? `<ol class="how-strip"><li><span>1</span>${s("howStep1Title")}</li><li><span>2</span>${s("howStep2Title")}</li><li><span>3</span>${s("howStep3Title")}</li></ol>` : ""}
        ${hasReleaseOneContent ? `<p class="topic-updated">${LX_().count(CASES_DATA.length)} · ${LX_().updated(latestVersion())}</p>` : ""}
        ${hasReleaseOneContent ? `<details class="about"><summary><span>${LX_().about}</span><span class="pm" aria-hidden="true"></span></summary><p>${s("libraryPromise")}</p></details>` : ""}
        ${hasReleaseOneContent ? "" : subscribeBlock}
        ${hasReleaseOneContent ? `<div class="list-tools"><h2 class="cases-heading" id="cases">${s("casesTitle")}</h2></div>` : ""}
        <div class="filters" id="filters"></div>
        <div class="grid" id="grid"></div>
        <div class="empty-state" id="emptyState" style="display:none">${s("noResults")}</div>
        ${howBlock}
        ${aboutBlock}
        ${hasReleaseOneContent ? subscribeBlock : ""}
        <div class="lang-note"><p><strong>EN:</strong> An English translation is planned for the future. You can use your browser's built-in auto-translate.</p></div>
        <footer class="lib-footer">
          <div class="copyright">© 2026 Dulat Irzhanov</div>
          <div class="footer-links">
            <a href="${homePath()}">dulatedu.com</a>
            <a href="https://www.linkedin.com/in/dulat-irzhanov/" target="_blank" rel="noopener">LinkedIn</a>
          </div>
        </footer>
      `;

      document.title = s("libraryTitle") + " | Dulat Irzhanov";

      const howOpen = document.getElementById("howOpen");
      if (howOpen) {
        howOpen.addEventListener("click", () => {
          const how = document.getElementById("how");
          if (how) how.open = true;
        });
      }

      function LX_() { return LX[CURRENT_LANG] || LX.ru; }
      function latestVersion() {
        const c = CASES_DATA[0]; const v = c && c.versionDate; return v ? (v[CURRENT_LANG] || v.ru || "") : "";
      }
      let activeFilter = "all";

      function renderFilters() {
        const container = document.getElementById("filters");
        if (CASES_DATA.length < 6) { container.style.display = "none"; return; }
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
          const tagPills = c.tags.map(tag => `<span class="tag">${tagLabel(tag)}</span>`).join("");
          const caseHref = basePath() + "case.html?id=" + c.id;

          return `
            <a class="card" href="${caseHref}">
              <div class="tc-top"><span class="tc-count">${LX_().caseWord} ${CASES_DATA.indexOf(c) + 1} · ${chapter} · <span class="nw">${LX_().mins(caseMinutes(c, displayLang))}</span></span></div>
              <div class="title">${title}</div>
              <div class="excerpt">${firstSentence(excerpt)}</div>
              <div class="tc-foot"><span class="tags">${tagPills}</span><span class="tc-cta">${LX_().start} <span aria-hidden="true">→</span></span></div>
            </a>
          `;
        }).join("");
      }

      renderFilters();
      renderCards();

    }
  };

  /* Подписи страницы библиотеки кейсов */
  function plRu(n, a, b, c) { const m10 = n % 10, m100 = n % 100; return m10 === 1 && m100 !== 11 ? a : (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14) ? b : c); }
  const LX = {
    ru: { count: n => n + " " + plRu(n, "кейс", "кейса", "кейсов"), updated: d => "обновлено " + d, about: "О библиотеке", start: "Начать кейс", mins: n => "около " + n + " мин", caseWord: "Кейс" },
    kk: { count: n => n + " кейс", updated: d => d, about: "Кітапхана туралы", start: "Кейсті бастау", mins: n => "шамамен " + n + " мин", caseWord: "Кейс" },
    en: { count: n => n + " cases", updated: d => "updated " + d, about: "About the library", start: "Start the case", mins: n => "about " + n + " min", caseWord: "Case" }
  };
  function caseMinutes(c, lang) {
    const g = o => (o && (o[lang] || o.ru)) || "";
    const w = x => String(x || "").split(/\s+/).filter(Boolean).length;
    const sc = (c.narrativeScenes || []).reduce((a, x) => a + w(g(x.text)), 0);
    const ac = c.actions || [];
    const av = ac.length ? ac.reduce((a, x) => a + w(g(x.detail)), 0) / ac.length : 0;
    const an = (c.analysisSections || []).reduce((a, x) => a + w(g(x.text)), 0);
    return Math.max(5, Math.round((sc + av + an + 250) / 170 / 5) * 5);
  }

  /* Подписи входа в кейс («О кейсе») и кнопок навигации */
  const INTRO = {
    ru: { nav: "О кейсе", eyebrow: "О кейсе", youWill: "Что вам предстоит", steps: ["Прочитать ситуацию.", "Выбрать, как поступить: четыре направления, A-D.", "Сравнить свой выбор с разбором и ответить на вопросы."], time: n => "Около " + n + " мин", start: "Начать", back: "← Назад", crumbCases: "Библиотека кейсов", crumbHome: "Главная" },
    en: { nav: "About this case", eyebrow: "About this case", youWill: "What you will do", steps: ["Read the situation.", "Choose how to act: four directions, A-D.", "Compare your choice with the analysis and answer the questions."], time: n => "About " + n + " min", start: "Start", back: "← Back", crumbCases: "Case Library", crumbHome: "Home" },
    kk: { nav: "Кейс туралы", eyebrow: "Кейс туралы", youWill: "Сізге не істеу керек", steps: ["Жағдаймен танысыңыз.", "Қалай әрекет ету керегін таңдаңыз: төрт бағыт, A-D.", "Таңдауыңызды талдаумен салыстырып, сұрақтарға жауап беріңіз."], time: n => "Шамамен " + n + " мин", start: "Бастау", back: "← Артқа", crumbCases: "Кейстер кітапханасы", crumbHome: "Басты бет" }
  };

  /* ===== CASE PAGE ===== */
  window.SimCase = {
    init: function () {
      document.body.classList.add("case-view");

      const params = new URLSearchParams(window.location.search);
      const id = params.get("id") || window.SIM_DEFAULT_CASE_ID;
      const caseData = CASES_DATA.find(c => c.id === id);

      if (!caseData) {
        document.body.innerHTML = `<div style="padding:60px 40px;font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">
          <p>${s("caseNotFound")} <a href="${basePath()}" style="color:#205c73">${s("backToLib")}</a></p>
        </div>`;
        return;
      }

      const displayLang = caseData.availableLangs.includes(CURRENT_LANG) ? CURRENT_LANG : caseData.availableLangs[0];

      function f(obj) {
        if (!obj) return "";
        return obj[displayLang] || obj[caseData.availableLangs[0]] || obj.ru || "";
      }

      const caseIndex = CASES_DATA.indexOf(caseData) + 1;
      const versionDate = f(caseData.versionDate);
      const scenes = caseData.narrativeScenes || [];
      const actions = caseData.actions || [];
      const hasContent = scenes.length > 0;
      const hasReleaseOneContent = CURRENT_LANG === "ru" || CURRENT_LANG === "kk";
      const I = INTRO[CURRENT_LANG] || INTRO.ru;
      const wordsOf = x => String(x || "").split(/\s+/).filter(Boolean).length;
      const readWords = scenes.reduce((a, sc) => a + wordsOf(f(sc.text)), 0)
        + (actions.length ? actions.reduce((a, ac) => a + wordsOf(f(ac.detail)), 0) / actions.length : 0) + 150
        + (caseData.analysisSections || []).reduce((a, sc) => a + wordsOf(f(sc.text)), 0) + 100;
      const readMinutes = Math.max(5, Math.round(readWords / 170 / 5) * 5);

      // Sidebar nav
      let sidebarNav = "";
      if (hasContent) {
        sidebarNav += `<div class="nav-item" data-pane="intro"><span class="check">✓</span><span>${I.nav}</span></div>`;
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
        panesHtml += `
          <section class="pane" data-id="intro">
            <div class="eyebrow">${I.eyebrow}</div>
            <h2>${f(caseData.title)}</h2>
            <p class="intro-lead">${f(caseData.excerpt)}</p>
            <div class="intro-card">
              <div class="intro-label">${I.youWill}</div>
              <ol>${I.steps.map(x => `<li>${x}</li>`).join("")}</ol>
              <div class="intro-time">${I.time(readMinutes)}</div>
            </div>
            <div class="pane-nav"><a class="back-link primary" data-next="scene0">${I.start} →</a></div>
          </section>`;

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
              <div class="pane-nav"><a class="back-link" data-next="${i === 0 ? "intro" : "scene" + (i - 1)}">${I.back}</a><a class="back-link primary" data-next="${nextPane}">${nextBtnText}</a></div>
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
            ${hasReleaseOneContent ? `<aside class="actions-guidance">
              <strong>${s("actionsGuidanceTitle")}</strong>
              <p>${s("actionsGuidanceText")}</p>
            </aside>` : ""}
            <div class="actions-list">${actionRows}</div>
            <div class="pane-nav"><a class="back-link" data-next="scene${scenes.length - 1}">${I.back}</a><a class="back-link primary" data-next="expert">${s("next")}</a></div>
          </section>
        `;

        // Individual action panes
        actions.forEach((action, i) => {
          const pq = action.pullQuote;
          const pqText = f(pq?.text);
          const quoteSource = f(pq?.source);
          const quoteMetaText = quoteSource || (hasReleaseOneContent && pq?.kind === "practice" && pq?.adapted
            ? s("quoteAdaptedLabel") : "");
          const quoteMeta = quoteMetaText ? `<span class="source"><span class="quote-source">${quoteMetaText}</span></span>` : "";
          const pqHtml = pqText ? `
            <div class="pull-quote">
              ${pqText}
              ${quoteMeta}
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
              <div class="pane-nav"><a class="back-link" data-next="actionsOverview">${s("backToActions")}</a></div>
            </section>
          `;
        });

        // Expert commentary
        const analysisLabelKeys = {
          research: "analysisResearchLabel",
          interpretation: "analysisInterpretationLabel",
          practice: "analysisPracticeLabel",
          application: "analysisApplicationLabel"
        };
        const analysisSections = hasReleaseOneContent ? (caseData.analysisSections || []) : [];
        const expertHtml = analysisSections.length ? analysisSections.map(section => {
          const sectionHtml = f(section.text).split("\n\n").map(p => `<p>${p.trim()}</p>`).join("");
          const labelKey = analysisLabelKeys[section.kind] || "analysisInterpretationLabel";
          return `<section class="analysis-section analysis-${section.kind}">
            <div class="analysis-label">${s(labelKey)}</div>
            ${sectionHtml}
          </section>`;
        }).join("") : f(caseData.expertCommentary?.text).split("\n\n").map(p => `<p>${p.trim()}</p>`).join("");
        const accNote = f(caseData.expertCommentary?.accreditationNote);
        const accNoteHtml = accNote.split("\n\n").map(p => `<p>${p.trim()}</p>`).join("");
        const accHtml = accNote ? `
          <details class="accreditation-block">
            <summary><span>${s("accreditationView")}</span>${hasReleaseOneContent ? `<small>${s("accreditationSummary")}</small>` : ""}</summary>
            <div class="accreditation-content">
              ${hasReleaseOneContent ? `<p class="accreditation-disclaimer">${s("accreditationDisclaimer")}</p>` : ""}
              <div class="accreditation-note">${accNoteHtml}</div>
            </div>
          </details>
        ` : "";
        panesHtml += `
          <section class="pane" data-id="expert">
            <div class="eyebrow">${s("conclusionSection")}</div>
            <h2>${s("expertLabel")}</h2>
            ${expertHtml}
            ${accHtml}
            <div class="pane-nav"><a class="back-link" data-next="actionsOverview">${I.back}</a><a class="back-link primary" data-next="reflection">${s("next")}</a></div>
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
            <div class="pane-nav"><a class="back-link" data-next="expert">${I.back}</a><a class="back-link primary" data-next="resources">${s("next")}</a></div>
          </section>
        `;

        // Resources & share
        const followItems = (caseData.followUpResources || []).filter(r => r.url).map(r =>
          `<li><a href="${r.url}" target="_blank" rel="noopener">${f(r.label)}</a></li>`
        ).join("");
        const followHtml = followItems ? `<ul class="resource-list">${followItems}</ul>` : "";

        const emailSubject = encodeURIComponent(f(caseData.title));
        const feedbackQuestions = hasReleaseOneContent ? `
          <ol class="feedback-questions">
            <li>${s("shareQuestion1")}</li>
            <li>${s("shareQuestion2")}</li>
            <li>${s("shareQuestion3")}</li>
            <li>${s("shareQuestion4")}</li>
          </ol>
          <p class="share-privacy">${s("sharePrivacy")}</p>
        ` : "";
        panesHtml += `
          <section class="pane" data-id="resources">
            <div class="eyebrow">${s("conclusionSection")}</div>
            <h2>${s("furtherResources")}</h2>
            ${followHtml}
            <div class="share-block">
              <p class="share-heading"><strong>${s("shareCTA")}</strong></p>
              <p>${s("shareText")}</p>
              ${feedbackQuestions}
              <a class="cta" href="mailto:${caseData.shareEmail}?subject=${emailSubject}">${s("shareButton")}</a>
              <span class="email-text">${s("shareEmailLabel")} ${caseData.shareEmail}</span>
            </div>
            <div class="content-footer">
               <a class="sidebar-back" href="${basePath()}" style="display:inline-block;margin-bottom:14px;">${s("backToLib")}</a>
              <div class="copyright">© 2026 Dulat Irzhanov</div>
              <div class="footer-links">
                 <a href="${homePath()}">dulatedu.com</a>
                <a href="https://www.linkedin.com/in/dulat-irzhanov/" target="_blank" rel="noopener">LinkedIn</a>
              </div>
            </div>
          </section>
        `;
      }

      // Pane order for progress tracking
      const paneOrder = hasContent ? [
        "intro",
        ...scenes.map((_, i) => `scene${i}`),
        "actionsOverview",
        ...actions.map((_, i) => `action${i}`),
        "expert", "reflection", "resources"
      ] : ["main"];

      // Render DOM
      document.body.innerHTML = `
        ${languageSwitcher(caseData.id)}
        <header class="case-topbar">
          <button class="hamburger" id="hamburger" aria-label="${s("openMenu")}" aria-controls="sidebar" aria-expanded="false">☰</button>
          <div class="topbar-title">${f(caseData.title)}</div>
          <div class="topbar-progress"><span id="topbarProgress"></span></div>
        </header>
        <div class="drawer-backdrop" id="drawerBackdrop"></div>
        <nav class="sidebar" id="sidebar" aria-label="${f(caseData.title)}">
          <div class="case-label">${s("caseLabel")} ${caseIndex} · ${f(caseData.chapter)}</div>
          <h1>${f(caseData.title)}</h1>
          ${versionDate ? `<div class="case-version">${s("versionLabel")} ${versionDate}</div>` : ""}
          <div class="progress-track"><div class="progress-fill" id="progressFill"></div></div>
          <div class="progress-label" id="progressLabel">0${s("progressLabel")}</div>
          <div class="sidebar-nav">${sidebarNav}</div>
          <a class="sidebar-back" href="${basePath()}">${s("backToLib")}</a>
          <div class="sidebar-footer">
            <div class="drawer-lang">${languageSwitcher(caseData.id)}</div>
            <div class="copyright">© 2026 Dulat Irzhanov</div>
            <div class="footer-links">
              <a href="${homePath()}">dulatedu.com</a>
              <a href="https://www.linkedin.com/in/dulat-irzhanov/" target="_blank" rel="noopener">LinkedIn</a>
            </div>
          </div>
        </nav>
        <main class="content"><nav class="crumbs" aria-label="Path"><a href="${homePath()}">${I.crumbHome}</a><span aria-hidden="true">/</span><a href="${basePath()}">${I.crumbCases}</a><span aria-hidden="true">/</span><span aria-current="page">${s("caseLabel")} ${caseIndex}</span></nav>${panesHtml}</main>
      `;

      document.title = f(caseData.title) + " | Dulat Irzhanov";

      // Mobile drawer open/close
      const sidebar = document.getElementById("sidebar");
      const hamburger = document.getElementById("hamburger");
      const backdrop = document.getElementById("drawerBackdrop");

      function openDrawer() {
        sidebar.classList.add("open");
        backdrop.classList.add("show");
        document.body.classList.add("drawer-open");
        hamburger.setAttribute("aria-expanded", "true");
      }
      function closeDrawer() {
        sidebar.classList.remove("open");
        backdrop.classList.remove("show");
        document.body.classList.remove("drawer-open");
        hamburger.setAttribute("aria-expanded", "false");
      }
      hamburger.addEventListener("click", () => {
        sidebar.classList.contains("open") ? closeDrawer() : openDrawer();
      });
      backdrop.addEventListener("click", closeDrawer);
      window.addEventListener("resize", () => { if (window.innerWidth > 700) closeDrawer(); });
      document.addEventListener("keydown", e => { if (e.key === "Escape") closeDrawer(); });

      if (!hasContent) return;

      // Navigation logic
      const navItems = document.querySelectorAll(".nav-item");
      const panes = document.querySelectorAll(".pane");
      const visited = new Set();

      function showPane(paneId, push) {
        if (push !== false && location.hash !== "#" + paneId) history.pushState({ pane: paneId }, "", "#" + paneId);
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
      window.addEventListener("popstate", () => {
        const id = location.hash.slice(1);
        showPane(paneOrder.includes(id) ? id : "intro", false);
      });
      const startId = location.hash.slice(1);
      showPane(paneOrder.includes(startId) ? startId : "intro", false);
    }
  };
})();
