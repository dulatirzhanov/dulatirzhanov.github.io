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

  const printHead = subtitle => `<header class="audit-print-head"><div class="audit-print-brand">DULAT IRZHANOV <span>EDUCATION ADVISORY · dulatedu.com</span></div><div class="audit-print-title"><div><span>${subtitle}</span><p class="audit-print-name">${t.title}</p></div><b class="auditDate"></b></div>`;
  const printFoot = subtitle => `<footer><span>${subtitle}</span><a href="https://dulatedu.com/">dulatedu.com</a></footer>`;

  app.innerHTML = `<div class="tool-view audit-view">
    <nav class="tool-nav"><a href="https://dulatedu.com/">dulatedu.com</a><span class="language-switch"><a href="${routes.ru}"${lang === "ru" ? ' aria-current="page"' : ""}>RU</a><a href="${routes.kk}"${lang === "kk" ? ' aria-current="page"' : ""}>KZ</a><a href="${routes.en}"${lang === "en" ? ' aria-current="page"' : ""}>EN</a></span></nav>
    <main><header class="tool-hero"><div class="tool-eyebrow">${t.eyebrow}</div><h1>${t.title}</h1><p class="tool-lede">${t.lede}</p><p class="privacy-note">${t.privacy}</p></header>
    <section class="audit-overview">${t.metrics.map(item => `<div><strong>${item[0]}</strong><span>${item[1]}</span></div>`).join("")}</section>
    <form id="auditForm" novalidate>${formSections}<section class="audit-complete"><div><h2>${t.complete}</h2><p id="completionText">${t.filled(0, total)}</p></div><div class="completion-bar"><span id="completionBar"></span></div><div class="audit-actions"><button type="button" class="button primary" id="sendWhatsApp">${t.sendWhatsApp}</button><button type="button" class="button" id="sendEmail">${t.sendEmail}</button></div><p class="audit-status" id="auditStatus" role="status" aria-live="polite" hidden></p><p class="email-note">${t.sendNote}</p><div class="audit-actions audit-actions-secondary"><button type="button" class="button" id="copyAnswers">${t.copy}</button><button type="button" class="button" id="printAudit">${t.print}</button><button type="button" class="button" id="printBlankAudit">${t.printBlank}</button><button type="button" class="button quiet" id="clearAudit">${t.clear}</button></div></section></form>
    <section class="audit-print audit-report print-only">${printHead(t.reportSubtitle)}<div class="audit-print-meta"><div><span>${t.school}</span><strong id="auditSchool">${t.notGiven}</strong></div><div><span>${t.preparedBy}</span><strong id="auditPreparedBy">${t.notGiven}</strong></div></div></header><p class="audit-print-notice">${t.notice}</p><div id="auditPrintAnswers"></div>${printFoot(t.reportSubtitle)}</section>
    <section class="audit-print audit-blank print-only">${printHead(t.blankSubtitle)}</header><p class="audit-print-notice">${t.blankInstruction}</p><div id="blankPrintAnswers"></div>${printFoot(t.blankSubtitle)}</section>
    </main><footer class="tool-footer"><span>© 2026 Dulat Irzhanov</span><a href="https://dulatedu.com/">dulatedu.com</a></footer></div>`;

  const form = document.getElementById("auditForm");
  const fields = Array.from(form.querySelectorAll("input[name], textarea[name]"));
  const status = document.getElementById("auditStatus");
  const answers = () => fields.map((field, index) => ({ question: questions[index][0], answer: field.value.trim() }));
  const valueHtml = item => escapeHtml(item.answer || t.notGiven).replaceAll("\n", "<br>");

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
    document.getElementById("auditSchool").textContent = items[Q.school].answer || t.notGiven;
    document.getElementById("auditPreparedBy").textContent = items[Q.contact].answer || t.notGiven;
    const response = index => `<div class="print-response"><h3>${index + 1}. ${escapeHtml(items[index].question)}</h3><p>${valueHtml(items[index])}</p></div>`;
    const profile = [Q.type, Q.founded, Q.curriculum, Q.owner, Q.licence, Q.principal];
    document.getElementById("auditPrintAnswers").innerHTML = `<section class="print-highlight"><span>${t.managementRequest}</span><p>${valueHtml(items[Q.reason])}</p><div><b>${t.deadline}</b><strong>${valueHtml(items[Q.deadline])}</strong></div></section><section class="print-content-section">${response(Q.tried)}</section><section class="print-profile"><h2><span>01</span> ${t.profile}</h2><div class="print-profile-grid">${profile.map((index, position) => `<div${position > 3 ? ' class="profile-wide"' : ""}><span>${escapeHtml(items[index].question)}</span><strong>${valueHtml(items[index])}</strong></div>`).join("")}</div></section><section class="print-content-section"><h2><span>02</span> ${t.leadership}</h2>${response(Q.decisions)}${response(Q.team)}${response(Q.systems)}</section><section class="print-content-section"><h2><span>03</span> ${t.horizon}</h2>${response(Q.plans)}</section>`;
  }

  // В сообщение идут только вопросы, на которые есть ответ.
  function reportText() {
    const date = new Intl.DateTimeFormat(locale, { day: "numeric", month: "long", year: "numeric" }).format(new Date());
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

  const dateText = new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" }).format(new Date());
  document.querySelectorAll(".auditDate").forEach(node => { node.textContent = dateText; });
  document.getElementById("blankPrintAnswers").innerHTML = questions.map((question, index) => `<section class="blank-question"><h2>${index + 1}. ${escapeHtml(question[0])}</h2><div></div></section>`).join("");

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
  document.getElementById("printAudit").addEventListener("click", () => { document.body.classList.remove("print-blank"); update(); window.print(); track("school_form_send", { method: "print" }); });
  document.getElementById("printBlankAudit").addEventListener("click", () => { document.body.classList.add("print-blank"); window.print(); });
  window.addEventListener("afterprint", () => document.body.classList.remove("print-blank"));
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
