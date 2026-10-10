(function () {
  const lang = window.AUDIT_LANG || "ru";
  const t = window.AUDIT_COPY[lang];
  const routes = { ru: "../ru/express-audit.html", kk: "../kz/express-audit.html", en: "../en/express-audit.html" };
  const locale = { ru: "ru-RU", kk: "kk-KZ", en: "en-GB" }[lang];
  const app = document.getElementById("auditApp");

  function escapeHtml(value) {
    return String(value || "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
  }

  function questionField(question, index) {
    const [label, type, placeholder] = question;
    const rows = type === "long" ? 5 : 3;
    const control = type === "text"
      ? `<input name="q${index + 1}" placeholder="${escapeHtml(placeholder)}" required>`
      : `<textarea name="q${index + 1}" rows="${rows}" placeholder="${escapeHtml(placeholder)}" required></textarea>`;
    return `<label class="audit-field"><span><b>${index + 1}.</b> ${escapeHtml(label)}</span>${control}</label>`;
  }

  const sectionQuestions = [t.questions.slice(0, 6), t.questions.slice(6, 11), t.questions.slice(11)];
  let questionOffset = 0;
  const formSections = sectionQuestions.map((questions, sectionIndex) => {
    const fields = questions.map((question, localIndex) => questionField(question, questionOffset + localIndex)).join("");
    questionOffset += questions.length;
    return `<section class="audit-section"><div class="audit-section-head"><span>${sectionIndex + 1}</span><div><h2>${t.sections[sectionIndex][0]}</h2><p>${t.sections[sectionIndex][1]}</p></div></div><div class="audit-fields">${fields}</div></section>`;
  }).join("");

  app.innerHTML = `<div class="tool-view audit-view">
    <nav class="tool-nav"><a href="https://dulatedu.com/">dulatedu.com</a><span class="language-switch"><a href="${routes.ru}"${lang === "ru" ? ' aria-current="page"' : ""}>RU</a><a href="${routes.kk}"${lang === "kk" ? ' aria-current="page"' : ""}>KZ</a><a href="${routes.en}"${lang === "en" ? ' aria-current="page"' : ""}>EN</a></span></nav>
    <main><header class="tool-hero"><div class="tool-eyebrow">${t.eyebrow}</div><h1>${t.title}</h1><p class="tool-lede">${t.lede}</p><p class="privacy-note">${t.privacy}</p></header>
    <section class="audit-overview">${t.metrics.map(item => `<div><strong>${item[0]}</strong><span>${item[1]}</span></div>`).join("")}</section>
    <form id="auditForm" novalidate>${formSections}<section class="audit-complete"><div><h2>${t.complete}</h2><p id="completionText">${t.filled(0)}</p></div><div class="completion-bar"><span id="completionBar"></span></div><label class="self-email"><span>${t.selfEmail}</span><input type="email" id="selfEmail" placeholder="name@example.com" autocomplete="email"></label><div class="audit-actions"><button type="button" class="button primary" id="printAudit">${t.print}</button><button type="button" class="button" id="printBlankAudit">${t.printBlank}</button><button type="button" class="button" id="sendToAuthor">${t.sendAuthor}</button><button type="button" class="button" id="sendToSelf">${t.sendSelf}</button><button type="button" class="button quiet" id="clearAudit">${t.clear}</button></div><p class="email-note">${t.emailNote}</p></section></form>
    <section class="audit-print audit-report print-only"><header class="audit-print-head"><div class="audit-print-brand">DULAT IRZHANOV <span>EDUCATION ADVISORY · dulatedu.com/tools/</span></div><div class="audit-print-title"><div><span>${t.reportSubtitle}</span><h1>${t.title}</h1></div><b class="auditDate"></b></div><div class="audit-print-meta"><div><span>${t.school}</span><strong id="auditSchool">${t.notGiven}</strong></div><div><span>${t.preparedBy}</span><strong id="auditPreparedBy">${t.notGiven}</strong></div></div></header><p class="audit-print-notice">${t.notice}</p><div id="auditPrintAnswers"></div><footer><span>${t.reportSubtitle}</span><a href="https://dulatedu.com/tools/">dulatedu.com/tools/</a></footer></section>
    <section class="audit-print audit-blank print-only"><header class="audit-print-head"><div class="audit-print-brand">DULAT IRZHANOV <span>EDUCATION ADVISORY · dulatedu.com/tools/</span></div><div class="audit-print-title"><div><span>${t.blankSubtitle}</span><h1>${t.title}</h1></div><b class="auditDate"></b></div></header><p class="audit-print-notice">${t.blankInstruction}</p><div id="blankPrintAnswers"></div><footer><span>${t.blankSubtitle}</span><a href="https://dulatedu.com/tools/">dulatedu.com/tools/</a></footer></section>
    </main><footer class="tool-footer"><span>© 2026 Dulat Irzhanov</span><a href="https://dulatedu.com/">dulatedu.com</a></footer></div>`;

  const form = document.getElementById("auditForm");
  const fields = Array.from(form.querySelectorAll("input[name], textarea[name]"));
  const answers = () => fields.map((field, index) => ({ question: t.questions[index][0], answer: field.value.trim() }));
  const valueHtml = item => escapeHtml(item.answer || t.notGiven).replaceAll("\n", "<br>");

  function update() {
    const items = answers();
    const completed = items.filter(item => item.answer).length;
    document.getElementById("completionText").textContent = t.filled(completed);
    document.getElementById("completionBar").style.width = `${completed / 14 * 100}%`;
    document.getElementById("auditSchool").textContent = items[0].answer || t.notGiven;
    document.getElementById("auditPreparedBy").textContent = items[10].answer || t.notGiven;
    const response = index => `<div class="print-response"><h3>${index + 1}. ${escapeHtml(items[index].question)}</h3><p>${valueHtml(items[index])}</p></div>`;
    document.getElementById("auditPrintAnswers").innerHTML = `<section class="print-profile"><h2><span>01</span> ${t.profile}</h2><div class="print-profile-grid">${[1,2,3,5,4,6].map((index, position) => `<div${position > 3 ? ' class="profile-wide"' : ""}><span>${escapeHtml(items[index].question)}</span><strong>${valueHtml(items[index])}</strong></div>`).join("")}</div></section><section class="print-highlight"><span>${t.managementRequest}</span><p>${valueHtml(items[11])}</p><div><b>${t.deadline}</b><strong>${valueHtml(items[13])}</strong></div></section><section class="print-content-section"><h2><span>02</span> ${t.leadership}</h2>${response(7)}${response(8)}${response(9)}</section><section class="print-content-section"><h2><span>03</span> ${t.horizon}</h2>${response(12)}</section>`;
  }

  function reportText() {
    const date = new Intl.DateTimeFormat(locale, { day: "numeric", month: "long", year: "numeric" }).format(new Date());
    return [t.title, date, "", ...answers().flatMap((item, index) => [`${index + 1}. ${item.question}`, item.answer || t.notGiven, ""]), t.source].join("\n");
  }

  async function openEmail(recipient) {
    const report = reportText();
    const body = encodeURIComponent(report);
    if (body.length < 6500) { window.location.href = `mailto:${recipient}?subject=${encodeURIComponent(t.emailSubject)}&body=${body}`; return; }
    try { await navigator.clipboard.writeText(report); window.alert(t.copied); } catch (error) { window.alert(t.tooLong); }
    window.location.href = `mailto:${recipient}?subject=${encodeURIComponent(t.emailSubject)}`;
  }

  const dateText = new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" }).format(new Date());
  document.querySelectorAll(".auditDate").forEach(node => { node.textContent = dateText; });
  document.getElementById("blankPrintAnswers").innerHTML = t.questions.map((question, index) => `<section class="blank-question"><h2>${index + 1}. ${escapeHtml(question[0])}</h2><div></div></section>`).join("");
  fields.forEach(field => field.addEventListener("input", update));
  document.getElementById("printAudit").addEventListener("click", () => { document.body.classList.remove("print-blank"); update(); window.print(); });
  document.getElementById("printBlankAudit").addEventListener("click", () => { document.body.classList.add("print-blank"); window.print(); });
  window.addEventListener("afterprint", () => document.body.classList.remove("print-blank"));
  document.getElementById("sendToAuthor").addEventListener("click", () => openEmail("dulatirzhanov@gmail.com"));
  document.getElementById("sendToSelf").addEventListener("click", () => { const email = document.getElementById("selfEmail").value.trim(); if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) openEmail(email); else window.alert(t.invalidEmail); });
  document.getElementById("clearAudit").addEventListener("click", () => { if (!window.confirm(t.confirmClear)) return; form.reset(); update(); });
  if (new URLSearchParams(window.location.search).get("print") === "blank") document.body.classList.add("print-blank");
  update();
})();
