/** Build crawlable case/topic pages from the same data and templates used in the browser.
 * Run: node scripts/build-library-pages.mjs (Node.js 22+, no dependencies).
 * Commit generated HTML with any change to library data, templates or shared versions.
 */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = p => fs.readFileSync(path.join(root,p),'utf8');
const write = (p,s) => fs.writeFileSync(path.join(root,p),s.replace(/[ \t]+$/gm,''));
const esc = s => String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const plain = s => String(s).replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim();
const short = s => { s=plain(s); return s.length > 157 ? s.slice(0,156).replace(/\s+\S*$/,'')+'…' : s; };
const origin='https://dulatedu.com';
const built=[];
function context(files, globals={}) {
 const c=vm.createContext({URLSearchParams,console,...globals}); c.window=c;
 for(const file of files) vm.runInContext(read(file),c,{filename:file});
 return c;
}
function render(c, template, init) {
 let markup=''; const done={};
 c.document={body:{classList:{add(){}},set innerHTML(s){markup=s;throw done;}},title:''};
 vm.runInContext(read(template),c,{filename:template});
 try {vm.runInContext(init,c);} catch(e) {if(e!==done) throw e;}
 if(!markup.includes('<h1')) throw Error('Missing rendered heading: '+template);
 return markup;
}
function metadata(shell,title,description,url,ru,kk,type) {
 shell=shell.replace(/\s*<title>[\s\S]*?<\/title>/g,'').replace(/\s*<meta (?:name="(?:description|robots|twitter:[^"]+)"|property="og:[^"]+")[^>]*>/g,'').replace(/\s*<link rel="(?:canonical|alternate)"[^>]*>/g,'');
 const tags=`\n  <title>${esc(title)}</title>\n  <meta name="description" content="${esc(description)}">\n  <link rel="canonical" href="${origin+url}">\n  <link rel="alternate" hreflang="ru" href="${origin+ru}">\n  <link rel="alternate" hreflang="kk" href="${origin+kk}">\n  <link rel="alternate" hreflang="x-default" href="${origin+ru}">\n  <meta property="og:type" content="${type}">\n  <meta property="og:url" content="${origin+url}">\n  <meta property="og:title" content="${esc(title)}">\n  <meta property="og:description" content="${esc(description)}">\n  <meta property="og:image" content="${origin}/og-image.jpg">\n  <meta property="og:locale" content="${url.includes('/kz/')?'kk_KZ':'ru_RU'}">\n  <meta name="twitter:card" content="summary_large_image">\n  <meta name="twitter:title" content="${esc(title)}">\n  <meta name="twitter:description" content="${esc(description)}">\n  <meta name="twitter:image" content="${origin}/og-image.jpg">\n`;
 return shell.replace('</head>',tags+'</head>');
}
for(const lang of ['ru','kk']) {
 const dir=lang==='kk'?'kz':'ru';
 const files=['sim/cases-data.js',...(lang==='kk'?['sim/kz/cases-data-kz.js']:[]),'sim/ui-strings.js','sim/tag-labels.js'];
 const globals={CURRENT_LANG:lang,LANG_BASE_PATHS:{ru:'/sim/ru/',kk:'/sim/kz/'}};
 const data=vm.runInContext('CASES_DATA',context(files,globals));
 for(const item of data.filter(x=>x.availableLangs.includes(lang))) {
  if(!/^[a-z0-9-]+$/.test(item.id)) throw Error('Invalid case id');
  const url=`/sim/${dir}/${item.id}.html`;
  const c=context(files,{...globals,SIM_DEFAULT_CASE_ID:item.id,location:{search:'',hash:'',pathname:url}});
  const body=render(c,'sim/template.js','SimCase.init()');
  let shell=metadata(read(`sim/${dir}/case.html`),item.seoTitle?.[lang] || item.title[lang]+' | '+(lang==='kk'?'Дулат Бауыржанұлы':'Дулат Иржанов'),short(item.excerpt[lang]||item.excerpt.ru),url,`/sim/ru/${item.id}.html`,`/sim/kz/${item.id}.html`,'article');
  shell=shell.replace('<body>','<body class="case-view">\n'+body+'\n<noscript><style>.pane{display:block!important}.sidebar,.case-topbar,.drawer-backdrop,.pane-nav,.stepper,.substeps{display:none!important}.content{margin:0 auto;max-width:900px;height:auto;overflow:visible}</style></noscript>');
  shell=shell.replace('<script>SimCase.init();</script>',`<script>window.SIM_DEFAULT_CASE_ID=${JSON.stringify(item.id)};SimCase.init();</script>`);
  write(url.slice(1),shell); built.push(url);
 }
 // Links remain available to crawlers and readers without JavaScript.
 const index=`sim/${dir}/index.html`;
 let shell=read(index).replace(/\r?\n<!-- library-fallback -->[\s\S]*?<!-- \/library-fallback -->\r?\n/g,'');
 const fallback=`\n<!-- library-fallback -->\n<noscript><h1>${lang==='kk'?'Кейстер кітапханасы':'Библиотека кейсов'}</h1></noscript>\n<div id="library-fallback"><ul>${data.map(x=>`<li><a href="/sim/${dir}/${x.id}.html">${esc(x.title[lang]||x.title.ru)}</a></li>`).join('')}</ul></div>\n<!-- /library-fallback -->\n`;
 write(index,shell.replace('<body>','<body>'+fallback));
}

/* One-page A4 team sheet per case that has printSheet and actionPlan. Not indexed, not in the sitemap. */
function sheetPage(item,lang,dir) {
 const f=o=>(o&&(o[lang]||o[item.availableLangs[0]]||o.ru))||'';
 const sh=item.printSheet, plan=item.actionPlan, url=`/sim/${dir}/${item.id}.html`;
 const ui={ru:{print:'Распечатать',back:'К кейсу',who:'Кто',open:'Читать кейс онлайн'},kk:{print:'Басып шығару',back:'Кейске қайту',who:'Кім',open:'Кейсті онлайн оқу'}}[lang]||{print:'Print',back:'Back',who:'Who',open:'Read the case online'};
 const li=a=>a.map(x=>`<li>${esc(f(x))}</li>`).join('');
 const opts=sh.options.map((x,i)=>{const t=f(x),k=t.indexOf('. ');return `<li><b>${'ABCD'[i]}. ${esc(t.slice(0,k+1))}</b> ${esc(t.slice(k+2))}</li>`;}).join('');
 const hor=plan.horizons.map(h=>`<tr><th rowspan="${h.items.length}">${esc(f(h.title))}</th>${h.items.map((it,i)=>`${i?'<tr>':''}<td class="who">${esc(f(it.who))}</td><td>${esc(f(it.what))}</td></tr>`).join('')}`).join('');
 return `<!DOCTYPE html>
<html lang="${lang==='kk'?'kk':'ru'}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(f(sh.heading))}: ${esc(f(item.title))}</title>
  <meta name="robots" content="noindex, follow">
  <link rel="canonical" href="${origin+url.replace('.html','-sheet.html')}">
  <link rel="stylesheet" href="/site.css?v=9">
  <style>
  html body { margin: 0; background: #eef1ef; color: #111; font: 10.5pt/1.32 "PT Sans", Arial, sans-serif; }
  .bar { display: flex; justify-content: space-between; align-items: center; gap: 12px; max-width: 190mm; margin: 0 auto; padding: 12px 0; }
  .bar a, .bar button { font: 700 15px "PT Sans", Arial, sans-serif; color: #205c73; }
  .bar button { padding: 10px 18px; border: 0; border-radius: 8px; background: #205c73; color: #fff; cursor: pointer; }
  .sheet { box-sizing: border-box; width: 190mm; min-height: 277mm; margin: 0 auto 24px; padding: 11mm 12mm 10mm; background: #fff; box-shadow: 0 1px 6px rgba(0,0,0,.18); }
  .head { display: flex; align-items: center; gap: 10px; padding-bottom: 6px; border-bottom: 1.5pt solid #17566e; }
  .mono { flex: none; width: 34px; height: 34px; border-radius: 4px; background: #17566e; color: #fff; font: 700 14px/34px "PT Sans", Arial, sans-serif; text-align: center; }
  .head h1 { margin: 0; font: 700 15pt/1.15 "PT Sans", Arial, sans-serif; color: #17566e; }
  .head small { display: block; font-size: 8.5pt; color: #444; }
  h2 { margin: 9px 0 3px; font: 700 10.5pt/1.2 "PT Sans", Arial, sans-serif; color: #17566e; text-transform: uppercase; letter-spacing: .03em; }
  ul, ol { margin: 0; padding-left: 16px; }
  li { margin: 0 0 1.5px; }
  table { width: 100%; border-collapse: collapse; table-layout: fixed; font-size: 9pt; line-height: 1.25; }
  th, td { border: .6pt solid #9ba9a5; padding: 2.5px 5px; vertical-align: top; text-align: left; }
  th { width: 16mm; background: #eaf1ef; color: #173f50; font-size: 8.5pt; }
  td.who { width: 42mm; color: #17566e; font-weight: 700; }
${lang==='kk'?`  /* Kazakh text runs longer: a smaller table keeps the sheet on one A4 page. */
  table { font-size: 8pt; line-height: 1.15; }
  th { font-size: 7.5pt; }
  td.who { width: 38mm; }
`:''}  .foot { margin-top: 8px; padding-top: 4px; border-top: .5pt solid #aeb8b5; display: flex; justify-content: space-between; gap: 10px; font-size: 8pt; color: #444; }
  @media print {
    @page { size: A4 portrait; margin: 0; }
    html body { background: #fff; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .bar { display: none; }
    .sheet { margin: 0; box-shadow: none; width: 210mm; min-height: 0; height: 297mm; padding: 10mm 13mm 8mm; overflow: hidden; }
  }
  </style>
</head>
<body>
<div class="bar"><a href="${url}">← ${ui.back}</a><button type="button" onclick="window.print()">${ui.print}</button></div>
<main class="sheet">
  <div class="head"><div class="mono" aria-hidden="true">DI</div><div><h1>${esc(f(item.title))}</h1><small>${esc(f(sh.heading))}</small></div></div>
  <h2>${esc(f(sh.situationTitle))}</h2><ul>${li(sh.situation)}</ul>
  <h2>${esc(f(sh.optionsTitle))}</h2><ul style="list-style:none;padding-left:0">${opts}</ul>
  <h2>${esc(f(sh.planTitle))}</h2><table><tbody>${hor}</tbody></table>
  <h2>${esc(f(sh.questionsTitle))}</h2><ol>${li(sh.teamQuestions)}</ol>
  <div class="foot"><span>${esc(f(sh.footer))}</span><a href="${url}">${origin.replace('https://','')+url}</a></div>
</main>
</body>
</html>
`;
}
for(const lang of ['ru','kk']) {
 const dir=lang==='kk'?'kz':'ru';
 const files=['sim/cases-data.js',...(lang==='kk'?['sim/kz/cases-data-kz.js']:[]),'sim/ui-strings.js','sim/tag-labels.js'];
 const data=vm.runInContext('CASES_DATA',context(files,{CURRENT_LANG:lang,LANG_BASE_PATHS:{ru:'/sim/ru/',kk:'/sim/kz/'}}));
 for(const item of data.filter(x=>x.availableLangs.includes(lang)&&x.printSheet&&x.actionPlan&&x.actionPlan.intro&&x.actionPlan.intro[lang])) write(`sim/${dir}/${item.id}-sheet.html`,sheetPage(item,lang,dir));
}
for(const dir of ['sources','sources/kz']) {
 const kk=dir.endsWith('/kz');
 const files=['sources/sources-data.js',...(kk?['sources/kz/sources-data.js']:[]),`${dir}/sources-meta.js`];
 const data=vm.runInContext('SOURCES_TOPICS',context(files));
 const pages=[{id:null},...data];
 for(const item of pages) {
  if(item.id&&!/^[a-z0-9-]+$/.test(item.id)) throw Error('Invalid topic id');
  const url=`/${dir}/`+(item.id?item.id+'.html':'');
  const c=context(files,{SOURCES_DEFAULT_TOPIC_ID:item.id,location:{search:'',hash:'',pathname:url}});
  const body=render(c,`${dir}/template.js`,item.id?'SourcesTopic.init()':'SourcesIndex.init()');
  const title=(item.id?item.title+' | ':'')+(kk?'Дереккөздер кітапханасы | Дулат Бауыржанұлы':'Библиотека источников | Дулат Иржанов');
  const description=short(item.id?item.intro:kk?'Мектепті басқару туралы заманауи дереккөздердің аннотацияланған шолулары: қысқаша мазмұны және мектеп басшыларына практикалық маңызы.':'Аннотированные обзоры источников по управлению школой: делегирование, решения и ответственность. Краткое содержание и применение в работе директора.');
  let shell=metadata(read(`${dir}/${item.id?'topic':'index'}.html`),title,description,url,'/sources/'+(item.id?item.id+'.html':''),'/sources/kz/'+(item.id?item.id+'.html':''),item.id?'article':'website');
  shell=shell.replace(/<body>[\s\S]*?(?=<script src=)/,'<body>\n'+body+'\n<noscript><style>#toggle-all{display:none}</style></noscript>\n');
  if(item.id) shell=shell.replace('<script>SourcesTopic.init();</script>',`<script>window.SOURCES_DEFAULT_TOPIC_ID=${JSON.stringify(item.id)};SourcesTopic.init();</script>`);
  write(`${dir}/${item.id?item.id+'.html':'index.html'}`,shell); if(item.id) built.push(url);
 }
}
let sitemap=read('sitemap.xml').replace(/\s*<!-- (?:generated-library-pages|build-pages:start) -->[\s\S]*?<!-- (?:\/generated-library-pages|build-pages:end) -->/g,'');
sitemap=sitemap.replace(/\s*<\/urlset>/,'\n  <!-- build-pages:start -->\n'+built.map(url=>`  <url><loc>${origin+url}</loc></url>`).join('\n')+'\n  <!-- build-pages:end -->\n</urlset>');
write('sitemap.xml',sitemap);
console.log('Generated '+built.length+' detail pages and updated four library indexes.');
