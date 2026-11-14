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
  let shell=metadata(read(`sim/${dir}/case.html`),item.title[lang]+' | '+(lang==='kk'?'Дулат Бауыржанұлы':'Дулат Иржанов'),short(item.excerpt[lang]||item.excerpt.ru),url,`/sim/ru/${item.id}.html`,`/sim/kz/${item.id}.html`,'article');
  shell=shell.replace('<body>','<body class="case-view">\n'+body+'\n<noscript><style>.pane{display:block!important}.sidebar,.case-topbar,.drawer-backdrop,.pane-nav,.stepper,.substeps{display:none!important}.content{margin:0 auto;max-width:900px;height:auto;overflow:visible}</style></noscript>');
  shell=shell.replace('<script>SimCase.init();</script>',`<script>window.SIM_DEFAULT_CASE_ID=${JSON.stringify(item.id)};SimCase.init();</script>`);
  write(url.slice(1),shell); built.push(url);
 }
 // Links remain available to crawlers and readers without JavaScript.
 const index=`sim/${dir}/index.html`;
 let shell=read(index).replace(/\n<!-- library-fallback -->[\s\S]*?<!-- \/library-fallback -->\n/,'');
 const fallback=`\n<!-- library-fallback -->\n<noscript><h1>${lang==='kk'?'Кейстер кітапханасы':'Библиотека кейсов'}</h1></noscript>\n<div id="library-fallback"><ul>${data.map(x=>`<li><a href="/sim/${dir}/${x.id}.html">${esc(x.title[lang]||x.title.ru)}</a></li>`).join('')}</ul></div>\n<!-- /library-fallback -->\n`;
 write(index,shell.replace('<body>','<body>'+fallback));
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
