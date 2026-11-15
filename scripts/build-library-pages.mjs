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
 const ui={ru:{print:'Распечатать',back:'К кейсу',who:'Кто',when:'Срок',what:'Что делать и кто отвечает',what3:'Что делать',sheet:'Лист 1',author:'Дулат Иржанов'},kk:{print:'Басып шығару',back:'Кейске қайту',who:'Кім',when:'Мерзім',what:'Не істеу және кім жауапты',what3:'Не істеу',sheet:'Парақ 1',author:'Дулат Бауыржанұлы'}}[lang]||{print:'Print',back:'Back',who:'Who',when:'When',what:'What',what3:'What',sheet:'Sheet 1',author:'Dulat Irzhanov'};
 const paras=a=>a.map(x=>`<p>${esc(f(x))}</p>`).join('');
 const li=a=>a.map(x=>`<li>${esc(f(x))}</li>`).join('');
 const opts=sh.options.map((x,i)=>{const t=f(x),k=t.indexOf('. ');return `<p><b>${'ABCD'[i]}. ${esc(t.slice(0,k+1))}</b> ${esc(t.slice(k+2))}</p>`;}).join('');
 const hor=plan.horizons.map(h=>`<tr><th scope="row">${esc(f(h.title))}</th><td class="what"><ul>${h.items.map(it=>`<li><b>${esc(f(it.who))}.</b> ${esc(f(it.what))}</li>`).join('')}</ul></td></tr>`).join('');
 const thead=`<th>${ui.when}</th><th>${ui.what}</th>`;
 /* Intro of the plan: the sentence about the "sign of completion" is not on the sheet, so it is dropped. */
 const sents=f(plan.intro).split(/(?<=[.!?»])\s+/).filter(Boolean);
 if(sents.length>1&&/признак|белгі/i.test(sents[sents.length-1])) sents.pop();
 const intro=sents.length?`<p class="intro"><b>${esc(sents[0])}</b></p>${sents.length>1?`<p class="intro">${esc(sents.slice(1).join(' '))}</p>`:''}`:'';
 return `<!DOCTYPE html>
<html lang="${lang==='kk'?'kk':'ru'}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(f(sh.heading))}: ${esc(f(item.title))}</title>
  <meta name="robots" content="noindex, follow">
  <link rel="canonical" href="${origin+url.replace('.html','-sheet.html')}">
  <link rel="stylesheet" href="/site.css?v=10">
  <link rel="stylesheet" href="/editorial-base.css?v=3">
  <link rel="stylesheet" href="/sim/sim-sheet.css?v=1">
</head>
<body>
<div class="bar"><a href="${url}">← ${ui.back}</a><button type="button" onclick="(document.fonts&&document.fonts.ready?document.fonts.ready:Promise.resolve()).then(function(){window.print()})">${ui.print}</button></div>
<main class="sheet${lang==='kk'?' kk':''}">
  <p class="vert">© 2026 ${ui.author} · dulatedu.com</p>
  <header class="head"><div class="head-main"><h1>${esc(f(item.title))}</h1><p class="sub">${esc(f(sh.heading))}</p></div></header>
  <div class="cols">
    <section class="left">
      <h2>${esc(f(sh.situationTitle))}</h2><div class="body first">${paras(sh.situation)}</div>
      <h2 class="next">${esc(f(sh.optionsTitle))}</h2><div class="body">${opts}</div>
    </section>
    <section class="right">
      <h2>${esc(f(sh.planTitle))}</h2>
      <div class="body">${intro}<table><thead><tr>${thead}</tr></thead><tbody>${hor}</tbody></table>
      <h3 class="sub">${esc(f(sh.questionsTitle))}</h3><ol class="qs">${li(sh.teamQuestions)}</ol></div>
    </section>
  </div>
  <div class="foot"><span>${esc(f(sh.footer))} · <a href="${url}">${origin.replace('https://','')+url}</a></span><span class="no">${ui.sheet}</span></div>
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
