/* Анкета школы перед первым разговором.
   Сайт ничего не отправляет сам: ответы уходят только через WhatsApp или почту посетителя.
   Черновик лежит в localStorage этого браузера и общий для трех языковых версий. */
(function () {
  const lang = window.AUDIT_LANG || "ru";
  const t = window.AUDIT_COPY[lang];
  const routes = { ru: "../ru/express-audit.html", kk: "../kz/express-audit.html", en: "../en/express-audit.html" };
  const locale = { ru: "ru-RU", kk: "kk-KZ", en: "en-GB" }[lang];
  const app = document.getElementById("auditApp");
  const AUTHOR_EMAIL = "d@dulatedu.com";
  const AUTHOR_WHATSAPP = "77761070090";
  const DRAFT_KEY = "dulatedu.schoolForm.v2";
  // Кириллица в адресе занимает шесть знаков на букву, длинные ссылки обрезаются почтой и мессенджером.
  const LINK_LIMIT = 3500;

  const questions = t.sections.flatMap(section => section.questions);
  const total = questions.length;
  const FIRST = 0;
  const LAST = total - 1;
  // Номера вопросов по порядку в audit-copy.js (с нуля).
  const Q = { reason: 0, tried: 1, deadline: 2, school: 3, type: 4, founded: 5, curriculum: 6, licence: 7, owner: 8, principal: 9, decisions: 10, team: 11, systems: 12, plans: 13, contact: 14 };

  const formatDate = date => t.formatDate ? t.formatDate(date) : new Intl.DateTimeFormat(locale, { day: "numeric", month: "long", year: "numeric" }).format(date);

  function escapeHtml(value) {
    return String(value || "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
  }

  function questionField(question, index) {
    const [label, type, placeholder] = question;
    const required = index === FIRST || index === LAST;
    const attrs = `name="q${index + 1}" placeholder="${escapeHtml(placeholder)}"${required ? ' aria-required="true"' : ""}`;
    const control = type === "text"
      ? `<input ${attrs}>`
      : `<textarea ${attrs} rows="${type === "long" ? 5 : 3}"></textarea>`;
    const mark = required ? ` <em class="audit-required">${t.required}</em>` : "";
    return `<label class="audit-field"><span><b>${index + 1}.</b> ${escapeHtml(label)}${mark}</span>${control}</label>`;
  }

  let offset = 0;
  const formSections = t.sections.map((section, sectionIndex) => {
    const fields = section.questions.map((question, localIndex) => questionField(question, offset + localIndex)).join("");
    offset += section.questions.length;
    return `<section class="audit-section${section.wide ? " is-wide" : ""}"><div class="audit-section-head"><span>${sectionIndex + 1}</span><div><h2>${t.sections[sectionIndex].title}</h2><p>${section.note}</p></div></div><div class="audit-fields">${fields}</div></section>`;
  }).join("");

  // Печатная версия сверстана как бланк: подпись поля стоит на линейке, ответ набран цветом.
  // Шапка по первой полосе журнала: гриф над линейкой, слева курсивный анонс, справа заголовок, подзаголовок и подпись автора.
  const printHead = subtitle => `<header class="form-masthead"><div class="form-side">${t.confidential} · dulatedu.com</div></header><div class="form-title"><p class="form-dek">${t.brandLine}</p><div class="form-head-main"><p class="form-name">${t.title}</p><p class="form-sub">${subtitle}</p><p class="form-by">Dulat Irzhanov · <span class="auditDate"></span></p></div></div>`;

  // items: ответы по порядку вопросов; blank: пустой бланк с линейками для письма от руки.
  function printBody(items, blank) {
    const text = index => items && items[index].answer ? escapeHtml(items[index].answer).replaceAll("\n", "<br>") : "";
    const field = (label, index, size) => `<div class="form-field${size ? " is-" + size : ""}"><span class="form-label">${escapeHtml(label)}</span><span class="form-value">${text(index)}</span></div>`;
    const block = (index, lines) => `<div class="form-block"><p class="form-question">${escapeHtml(questions[index][0])}</p>${blank ? "<i></i>".repeat(lines) : `<p class="form-answer">${text(index)}</p>`}</div>`;
    const part = (title, body) => `<section class="form-section"><h2>${title}</h2>${body}</section>`;
    const short = t.shortLabels;
    return part(t.sections[0].title, block(Q.reason, 4) + block(Q.tried, 3) + `<div class="form-row">${field(t.deadline, Q.deadline)}</div>`)
      + part(t.sections[1].title, `<div class="form-row">${field(short.school, Q.school)}</div><div class="form-row">${field(short.type, Q.type, "half")}${field(short.founded, Q.founded, "half")}</div><div class="form-row">${field(short.curriculum, Q.curriculum, "half")}${field(short.owner, Q.owner, "half")}</div><div class="form-row">${field(short.principal, Q.principal)}</div>` + block(Q.licence, 2))
      + part(t.sections[2].title, block(Q.decisions, 2) + block(Q.team, 2) + block(Q.systems, 2) + block(Q.plans, 3))
      + part(t.sections[3].title, `<div class="form-row">${field(t.preparedBy, Q.contact)}</div>`);
  }

  // Заполненная анкета печатается как полоса журнала: слева повод и контакт, справа таблица фактов о школе и ответы об управлении.
  // Вопросы без ответа в тексте пропускаются, в таблице на их месте тире.
  function reportBody(items) {
    const val = index => items[index].answer;
    const para = value => escapeHtml(value).replaceAll("\n", "<br>");
    const qa = (index, label) => val(index) ? `<div class="rep-qa"><h3>${escapeHtml(label || questions[index][0])}</h3><p>${para(val(index))}</p></div>` : "";
    const short = t.shortLabels;
    const row = (label, index) => `<tr><th scope="row">${escapeHtml(label)}</th><td>${val(index) ? para(val(index)) : "—"}</td></tr>`;
    const left = `<div class="rep-left"><h2>${t.sections[0].title}</h2><div class="rep-body">${qa(Q.reason)}${qa(Q.tried)}${qa(Q.deadline, t.deadline)}${qa(Q.contact, t.sections[3].title)}</div><p class="rep-note">${t.notice}</p></div>`;
    const right = `<div class="rep-right"><h2>${t.schoolAndManagement}</h2><div class="rep-body"><p class="rep-school"><b>${val(Q.school) ? para(val(Q.school)) : "—"}</b><br>${t.dateLabel}: ${formatDate(new Date())}</p><table class="rep-table"><thead><tr><th>${t.factHead[0]}</th><th>${t.factHead[1]}</th></tr></thead><tbody>${row(short.type, Q.type)}${row(short.founded, Q.founded)}${row(short.curriculum, Q.curriculum)}${row(short.licence, Q.licence)}${row(short.owner, Q.owner)}${row(short.principal, Q.principal)}</tbody></table><h3 class="rep-label">${t.sections[2].title}</h3><div class="rep-text">${qa(Q.decisions)}${qa(Q.team)}${qa(Q.systems)}${qa(Q.plans)}</div></div></div>`;
    return left + right + `<p class="rep-vert">${t.confidential} · Dulat Irzhanov · dulatedu.com</p>`;
  }

  app.innerHTML = `<div class="tool-view audit-view">
    <nav class="tool-nav"><a href="https://dulatedu.com/">dulatedu.com</a><span class="language-switch"><a href="${routes.ru}"${lang === "ru" ? ' aria-current="page"' : ""}>RU</a><a href="${routes.kk}"${lang === "kk" ? ' aria-current="page"' : ""}>KZ</a><a href="${routes.en}"${lang === "en" ? ' aria-current="page"' : ""}>EN</a></span></nav>
    <main><header class="tool-hero"><div class="tool-eyebrow">${t.eyebrow}</div><h1>${t.title}</h1><p class="tool-lede">${t.lede}</p><p class="privacy-note">${t.privacy}</p></header>
    <section class="audit-overview">${t.metrics.map(item => `<div><strong>${item[0]}</strong><span>${item[1]}</span></div>`).join("")}</section>
    <form id="auditForm" novalidate>${formSections}<section class="audit-complete"><div><h2>${t.complete}</h2><p id="completionText">${t.filled(0, total)}</p></div><div class="completion-bar"><span id="completionBar"></span></div><div class="audit-actions"><button type="button" class="button primary" id="sendWhatsApp">${t.sendWhatsApp}</button><button type="button" class="button" id="sendEmail">${t.sendEmail}</button></div><p class="audit-status" id="auditStatus" role="status" aria-live="polite" hidden></p><p class="email-note">${t.sendNote}</p><div class="audit-actions audit-actions-secondary"><button type="button" class="button" id="copyAnswers">${t.copy}</button><button type="button" class="button" id="printAudit">${t.print}</button><button type="button" class="button" id="printBlankAudit">${t.printBlank}</button><button type="button" class="button quiet" id="clearAudit">${t.clear}</button></div></section></form>
    <section class="audit-print audit-report print-only"><header class="rep-head"><div class="rep-head-main"><p class="rep-title">${t.title}</p><p class="rep-sub">${t.reportSubtitle}</p></div></header><div class="rep-cols" id="auditPrintAnswers"></div></section>
    <section class="audit-print audit-blank print-only">${printHead(t.blankSubtitle)}<div id="blankPrintAnswers"></div><p class="form-note">${t.blankInstruction}</p></section>
    </main><footer class="tool-footer"><span>© 2026 Dulat Irzhanov</span><a href="https://dulatedu.com/">dulatedu.com</a></footer></div>`;

  const form = document.getElementById("auditForm");
  const dateText = formatDate(new Date());
  const pageStyle = document.head.appendChild(document.createElement("style"));
  const fields = Array.from(form.querySelectorAll("input[name], textarea[name]"));
  const status = document.getElementById("auditStatus");
  const answers = () => fields.map((field, index) => ({ question: questions[index][0], answer: field.value.trim() }));
  function track(name, params) {
    if (typeof window.gtag === "function") window.gtag("event", name, params || {});
  }

  function showStatus(message, link) {
    status.textContent = message;
    if (link) {
      const a = document.createElement("a");
      a.href = link.href; a.target = "_blank"; a.rel = "noopener noreferrer"; a.textContent = link.text;
      status.append(" ", a);
    }
    status.hidden = false;
  }

  function saveDraft() {
    try {
      const values = fields.map(field => field.value);
      if (values.some(value => value.trim())) localStorage.setItem(DRAFT_KEY, JSON.stringify(values));
      else localStorage.removeItem(DRAFT_KEY);
    } catch (error) { /* хранилище недоступно: анкета работает без черновика */ }
  }

  function restoreDraft() {
    try {
      const values = JSON.parse(localStorage.getItem(DRAFT_KEY) || "null");
      if (!Array.isArray(values) || values.length !== total) return false;
      values.forEach((value, index) => { fields[index].value = typeof value === "string" ? value : ""; });
      return values.some(value => typeof value === "string" && value.trim());
    } catch (error) { return false; }
  }

  function update() {
    const items = answers();
    const completed = items.filter(item => item.answer).length;
    document.getElementById("completionText").textContent = t.filled(completed, total);
    document.getElementById("completionBar").style.width = `${completed / total * 100}%`;
    document.getElementById("auditPrintAnswers").innerHTML = reportBody(items);
    // Длинные ответы печатаются мельче, чтобы анкета осталась на одной странице A4.
    const chars = items.reduce((sum, item) => sum + item.answer.length, 0);
    document.body.dataset.repSize = chars > 2100 ? "xs" : chars > 1600 ? "s" : chars > 1200 ? "m" : "";
    // верхнее поле каждой страницы: только дата (решение автора 15.11.2026: название школы не печатается)
    const running = dateText;
    pageStyle.textContent = `@media print { @page { @top-right { content: "${running}"; } @bottom-right { content: "${t.pageWord} " counter(page) " / " counter(pages); } } }`;
  }

  // В сообщение идут только вопросы, на которые есть ответ.
  function reportText() {
    const date = formatDate(new Date());
    const filled = answers().map((item, index) => ({ ...item, index })).filter(item => item.answer);
    return [t.title, date, "", ...filled.flatMap(item => [`${item.index + 1}. ${item.question}`, item.answer, ""]), t.source].join("\n");
  }

  function requiredReady() {
    const missing = [FIRST, LAST].find(index => !fields[index].value.trim());
    if (missing === undefined) return true;
    showStatus(t.needRequired);
    fields[missing].focus();
    return false;
  }

  async function copyReport() {
    try { await navigator.clipboard.writeText(reportText()); return true; } catch (error) { return false; }
  }

  async function sendWhatsApp() {
    if (!requiredReady()) return;
    const report = reportText();
    const base = `https://wa.me/${AUTHOR_WHATSAPP}?text=`;
    if (encodeURIComponent(report).length <= LINK_LIMIT) {
      const href = base + encodeURIComponent(report);
      showStatus(t.openedWa, { href, text: t.openChat });
      window.open(href, "_blank", "noopener");
      track("school_form_send", { method: "whatsapp_full" });
      return;
    }
    const school = fields[Q.school].value.trim();
    const href = base + encodeURIComponent(t.waShort(school ? ` (${school})` : ""));
    if (!(await copyReport())) { showStatus(t.copyFailed); return; }
    showStatus(t.copiedWa, { href, text: t.openChat });
    window.open(href, "_blank", "noopener");
    track("school_form_send", { method: "whatsapp_copy" });
  }

  async function sendEmail() {
    if (!requiredReady()) return;
    const report = reportText();
    const subject = encodeURIComponent(t.emailSubject);
    if (encodeURIComponent(report).length <= LINK_LIMIT) {
      showStatus(t.openedMail);
      window.location.href = `mailto:${AUTHOR_EMAIL}?subject=${subject}&body=${encodeURIComponent(report)}`;
      track("school_form_send", { method: "email_full" });
      return;
    }
    if (!(await copyReport())) { showStatus(t.copyFailed); return; }
    showStatus(t.copiedMail);
    window.location.href = `mailto:${AUTHOR_EMAIL}?subject=${subject}`;
    track("school_form_send", { method: "email_copy" });
  }

  document.querySelectorAll(".auditDate").forEach(node => { node.textContent = dateText; });
  document.getElementById("blankPrintAnswers").innerHTML = printBody(null, true);

  let started = false;
  fields.forEach(field => field.addEventListener("input", () => {
    if (!started) { started = true; track("school_form_start"); }
    update();
    saveDraft();
  }));
  document.getElementById("sendWhatsApp").addEventListener("click", sendWhatsApp);
  document.getElementById("sendEmail").addEventListener("click", sendEmail);
  document.getElementById("copyAnswers").addEventListener("click", async () => {
    showStatus((await copyReport()) ? t.copiedOnly : t.copyFailed);
    track("school_form_send", { method: "copy" });
  });
  // Печать идет после загрузки шрифтов: блоки для печати скрыты на экране, и без явной загрузки
  // Source Serif 4 в PDF попал бы запасным шрифтом. Образец текста тянет нужные начертания (кириллица, латиница, казахские буквы).
  function printWhenReady() {
    const sample = document.querySelector(".audit-print").textContent.slice(0, 400) + " Аәғқңөүұһі Dulat Irzhanov";
    const faces = ['300 21pt "Source Serif 4"', '400 11pt "Source Serif 4"', 'italic 400 11pt "Source Serif 4"', '400 10pt "PT Sans"', '700 8pt "PT Sans"', '300 9pt "Source Sans 3"', '400 9pt "Source Sans 3"', '600 9pt "Source Sans 3"', '600 16pt "Open Sans"'];
    Promise.all(faces.map(face => document.fonts.load(face, sample))).catch(() => {}).then(() => document.fonts.ready).then(() => window.print());
  }
  document.getElementById("printAudit").addEventListener("click", () => { document.body.classList.remove("print-blank"); update(); printWhenReady(); track("school_form_send", { method: "print" }); });
  document.getElementById("printBlankAudit").addEventListener("click", () => { document.body.classList.add("print-blank"); update(); printWhenReady(); });
  window.addEventListener("afterprint", () => { document.body.classList.remove("print-blank"); update(); });
  document.getElementById("clearAudit").addEventListener("click", () => {
    if (!window.confirm(t.confirmClear)) return;
    form.reset();
    try { localStorage.removeItem(DRAFT_KEY); } catch (error) { /* нечего удалять */ }
    status.hidden = true;
    update();
  });
  if (new URLSearchParams(window.location.search).get("print") === "blank") document.body.classList.add("print-blank");
  if (restoreDraft()) showStatus(t.restored);
  update();
})();
