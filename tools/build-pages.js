/*
 * Сборка отдельных страниц для кейсов и тем источников.
 * Запуск из корня сайта: node tools/build-pages.js
 *
 * Зачем: ссылка на кейс или тему должна иметь свой заголовок, описание, картинку
 * предпросмотра и попадать в поиск. Страницы собираются из данных:
 *   sim/cases-data.js + sim/kz/cases-data-kz.js  ->  sim/ru/<id>.html, sim/kz/<id>.html
 *   sources/sources-data.js (+ kz)               ->  sources/<id>.html, sources/kz/<id>.html
 * Содержимое страниц по-прежнему рисует template.js; здесь только оболочка с метаданными.
 * После изменения данных запускать скрипт заново, затем обновить sitemap.xml (скрипт делает это сам).
 */
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = path.resolve(__dirname, "..");
const SITE = "https://dulatedu.com";
const OG_IMAGE = SITE + "/og-image.jpg";

function read(rel) { return fs.readFileSync(path.join(ROOT, rel), "utf8"); }
function write(rel, text) {
  const full = path.join(ROOT, rel);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, text, "utf8");
}
function esc(s) {
  return String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
// Описание до 155 знаков, обрезка по границе слова
function shorten(text, max) {
  text = String(text).replace(/\s+/g, " ").trim();
  if (text.length <= max) return text;
  const cut = text.slice(0, max - 1);
  const sp = cut.lastIndexOf(" ");
  return (sp > 80 ? cut.slice(0, sp) : cut).replace(/[,;:\-–—\s]+$/, "") + "…";
}
function today() { return new Date().toLocaleDateString("sv-SE"); }

/* ---------- данные ---------- */
function loadScript(files, expose) {
  const sandbox = { window: {}, console };
  sandbox.window = sandbox;
  vm.createContext(sandbox);
  files.forEach(f => vm.runInContext(read(f) + "\n", sandbox, { filename: f }));
  return expose.map(name => vm.runInContext("typeof " + name + " !== 'undefined' ? " + name + " : undefined", sandbox));
}

const [CASES] = loadScript(["sim/cases-data.js", "sim/kz/cases-data-kz.js"], ["CASES_DATA"]);
const [TOPICS_RU] = loadScript(["sources/sources-data.js"], ["SOURCES_TOPICS"]);
// казахский слой правит русские данные на месте, поэтому грузим оба файла вместе
const [TOPICS_KZ] = loadScript(["sources/sources-data.js", "sources/kz/sources-data.js"], ["SOURCES_TOPICS"]);

const LANGS = {
  ru: { html: "ru", tag: "ru", hreflang: "ru", author: "Дулат Иржанов", caseFolder: "sim/ru", caseSuffix: "Дулат Иржанов", cur: "ru" },
  kz: { html: "kk", tag: "kk", hreflang: "kk", author: "Дулат Бауыржанұлы", caseFolder: "sim/kz", caseSuffix: "Дулат Бауыржанұлы", cur: "kk" }
};

const outPages = []; // для sitemap

/* ---------- кейсы ---------- */
function caseShell(lang, c, title, description, altUrl) {
  const L = LANGS[lang];
  const url = `${SITE}/${L.caseFolder}/${c.id}.html`;
  const ru = lang === "ru";
  const basePaths = ru
    ? '{ en: "../", ru: "./", kk: "../kz/" }'
    : '{ en: "../", ru: "../ru/", kk: "./" }';
  const kzData = ru ? "" : '<script src="cases-data-kz.js?v=5"></script>\n';
  const fullTitle = `${title} | ${L.caseSuffix}`;
  return `<!DOCTYPE html>
<html lang="${L.html}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <!-- Страница собрана скриптом tools/build-pages.js из sim/cases-data.js. Не править вручную. -->
  <title>${esc(fullTitle)}</title>
  <meta name="description" content="${esc(description)}">
  <meta name="author" content="Dulat Irzhanov">

  <link rel="canonical" href="${url}">
${altUrl ? `  <link rel="alternate" hreflang="${L.hreflang}" href="${url}" />\n  <link rel="alternate" hreflang="${lang === "ru" ? "kk" : "ru"}" href="${altUrl}" />\n  <link rel="alternate" hreflang="x-default" href="${lang === "ru" ? url : altUrl}" />\n` : ""}
  <meta property="og:type" content="article">
  <meta property="og:url" content="${url}">
  <meta property="og:title" content="${esc(fullTitle)}">
  <meta property="og:description" content="${esc(description)}">
  <meta property="og:image" content="${OG_IMAGE}">

  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(fullTitle)}">
  <meta name="twitter:description" content="${esc(description)}">
  <meta name="twitter:image" content="${OG_IMAGE}">

  <link rel="stylesheet" href="/site.css?v=9">

  <link rel="stylesheet" href="../sim.css?v=24">
  <link rel="stylesheet" href="../sim-motion.css?v=1">
<script src="/analytics.js?v=1"></script>
</head>
<body>
<script>
  var CURRENT_LANG = "${L.cur}";
  var LANG_BASE_PATHS = ${basePaths};
  window.SIM_DEFAULT_CASE_ID = "${c.id}";
</script>
<script src="../cases-data.js?v=8"></script>
${kzData}<script src="../ui-strings.js?v=11"></script>
<script src="../tag-labels.js?v=2"></script>
<script src="../template.js?v=20"></script>
<script>SimCase.init();</script>
</body>
</html>
`;
}

CASES.forEach(c => {
  const ruOk = c.title && c.title.ru;
  const kzOk = c.title && c.title.kk;
  const ruUrl = ruOk ? `${SITE}/sim/ru/${c.id}.html` : null;
  const kzUrl = kzOk ? `${SITE}/sim/kz/${c.id}.html` : null;
  if (ruOk) {
    const html = caseShell("ru", c, c.title.ru, shorten(c.excerpt && c.excerpt.ru || c.title.ru, 155), kzUrl);
    write(`sim/ru/${c.id}.html`, html);
    outPages.push(ruUrl);
  }
  if (kzOk) {
    const html = caseShell("kz", c, c.title.kk, shorten(c.excerpt && c.excerpt.kk || c.title.kk, 155), ruUrl);
    write(`sim/kz/${c.id}.html`, html);
    outPages.push(kzUrl);
  }
});

/* ---------- темы источников ---------- */
function topicShell(lang, t) {
  const kz = lang === "kz";
  const folder = kz ? "sources/kz" : "sources";
  const url = `${SITE}/${folder}/${t.id}.html`;
  const alt = kz ? `${SITE}/sources/${t.id}.html` : `${SITE}/sources/kz/${t.id}.html`;
  const hasAlt = kz ? TOPICS_RU.some(x => x.id === t.id) : TOPICS_KZ.some(x => x.id === t.id);
  const suffix = kz ? "Дереккөздер кітапханасы | Дулат Бауыржанұлы" : "Библиотека источников | Дулат Иржанов";
  const fullTitle = `${t.title} | ${suffix}`;
  const description = shorten(t.intro || t.title, 155);
  const ruUrl = kz ? alt : url;
  const kzUrl = kz ? url : alt;
  return `<!DOCTYPE html>
<html lang="${kz ? "kk" : "ru"}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <!-- Страница собрана скриптом tools/build-pages.js из sources-data.js. Не править вручную. -->
  <title>${esc(fullTitle)}</title>
  <meta name="description" content="${esc(description)}">
  <link rel="canonical" href="${url}">
${hasAlt ? `  <link rel="alternate" hreflang="ru" href="${ruUrl}" />\n  <link rel="alternate" hreflang="kk" href="${kzUrl}" />\n  <link rel="alternate" hreflang="x-default" href="${ruUrl}" />\n` : ""}
  <meta property="og:type" content="article">
  <meta property="og:url" content="${url}">
  <meta property="og:title" content="${esc(fullTitle)}">
  <meta property="og:description" content="${esc(description)}">
  <meta property="og:image" content="${OG_IMAGE}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(fullTitle)}">
  <meta name="twitter:description" content="${esc(description)}">
  <meta name="twitter:image" content="${OG_IMAGE}">
  <link rel="stylesheet" href="/site.css?v=9">
  <link rel="stylesheet" href="/sources/sources.css?v=4">
  <link rel="stylesheet" href="/sources/sources-v2.css?v=6">
  <link rel="stylesheet" href="/sources/sources-motion.css?v=1">
<script src="/analytics.js?v=1"></script>
</head>
<body>
<script>window.SOURCES_DEFAULT_TOPIC_ID = "${t.id}";</script>
<script src="/sources/sources-data.js?v=1"></script>
${kz ? '<script src="/sources/kz/sources-data.js?v=1"></script>\n' : ""}<script src="${kz ? "/sources/kz/sources-meta.js?v=1" : "/sources/sources-meta.js?v=1"}"></script>
<script src="${kz ? "/sources/kz/template.js?v=5" : "/sources/template.js?v=4"}"></script>
<script>SourcesTopic.init();</script>
</body>
</html>
`;
}

TOPICS_RU.forEach(t => { write(`sources/${t.id}.html`, topicShell("ru", t)); outPages.push(`${SITE}/sources/${t.id}.html`); });
TOPICS_KZ.forEach(t => { write(`sources/kz/${t.id}.html`, topicShell("kz", t)); outPages.push(`${SITE}/sources/kz/${t.id}.html`); });

/* ---------- sitemap.xml ---------- */
let sitemap = read("sitemap.xml");
// убрать ранее добавленные скриптом адреса (между маркерами), затем вставить заново
sitemap = sitemap.replace(/\s*<!-- build-pages:start -->[\s\S]*?<!-- build-pages:end -->/, "");
const block = outPages.map(u => `  <url>\n    <loc>${u}</loc>\n    <lastmod>${today()}</lastmod>\n  </url>`).join("\n");
sitemap = sitemap.replace("</urlset>", `  <!-- build-pages:start -->\n${block}\n  <!-- build-pages:end -->\n</urlset>`);
write("sitemap.xml", sitemap);

console.log(`Собрано страниц: ${outPages.length}`);
outPages.forEach(u => console.log("  " + u));
