/* Approved case-001 revisions, compared with the published 15 November edition.
 * Ranges are precomputed from word differences and editorial significance; a text hash
 * suppresses stale annotations if a field is edited in a later edition. */
(function () {
  const entries = {
  "scene1.text.paragraph1": {
    "hash": 2365724098,
    "ranges": [
      [
        0,
        56
      ],
      [
        73,
        138
      ],
      [
        140,
        161
      ],
      [
        163,
        263
      ]
    ],
    "reason": "Учтено, что причины ухода нужно выяснить в разговоре."
  },
  "scene1.text.paragraph2": {
    "hash": 1149780823,
    "ranges": [
      [
        136,
        145
      ],
      [
        152,
        170
      ],
      [
        182,
        192
      ],
      [
        194,
        251
      ]
    ],
    "reason": "Убран готовый вывод, чтобы читатель мог сделать его сам."
  },
  "action0.detail.paragraph0": {
    "hash": 4262924450,
    "ranges": [
      [
        47,
        55
      ],
      [
        57,
        203
      ],
      [
        205,
        278
      ]
    ],
    "reason": "Уточнены вопросы о причинах ухода."
  },
  "action0.detail.paragraph1": {
    "hash": 2615617484,
    "ranges": [
      [
        138,
        342
      ]
    ],
    "reason": "Учтена разница между годовым доходом и деньгами, нужными семье сейчас."
  },
  "action1.detail.paragraph1": {
    "hash": 4136303988,
    "ranges": [
      [
        0,
        73
      ],
      [
        76,
        110
      ],
      [
        112,
        147
      ],
      [
        150,
        183
      ]
    ],
    "reason": "Учтено право учителя выбрать другую школу."
  },
  "action1.detail.paragraph2": {
    "hash": 1886863402,
    "ranges": [
      [
        234,
        277
      ]
    ],
    "reason": "Уточнена поддержка педагога, который продолжит проекты."
  },
  "action2.detail.paragraph2": {
    "hash": 856822753,
    "ranges": [
      [
        0,
        93
      ],
      [
        95,
        149
      ],
      [
        151,
        190
      ],
      [
        192,
        363
      ]
    ],
    "reason": "Учтен риск неполной передачи проектов."
  },
  "action2.detail.paragraph3": {
    "hash": 1072747917,
    "ranges": [
      [
        0,
        335
      ]
    ],
    "reason": "Добавлена проверка готовности коллеги на конкретной задаче."
  },
  "action2.detail.paragraph5": {
    "hash": 4033179146,
    "ranges": [
      [
        100,
        138
      ],
      [
        158,
        190
      ],
      [
        217,
        223
      ]
    ],
    "reason": "Учтена ситуация, когда постоянная замена еще не найдена."
  },
  "action3.detail.paragraph1": {
    "hash": 2876801419,
    "ranges": [
      [
        0,
        348
      ]
    ],
    "reason": "Учтены время и нагрузка при подготовке коллег."
  },
  "plan.0.1.what": {
    "hash": 40018389,
    "ranges": [
      [
        75,
        115
      ],
      [
        128,
        177
      ]
    ],
    "reason": "Учтено, что учитель может окончательно решить уйти."
  },
  "plan.0.1.done": {
    "hash": 3695188327,
    "ranges": [
      [
        0,
        22
      ],
      [
        25,
        89
      ]
    ],
    "reason": "Учтено, что учитель может окончательно решить уйти."
  },
  "plan.1.0.what": {
    "hash": 925980795,
    "ranges": [
      [
        50,
        124
      ],
      [
        241,
        277
      ],
      [
        279,
        313
      ]
    ],
    "reason": "Добавлены время на передачу и временный объем работы."
  },
  "plan.1.0.done": {
    "hash": 275196152,
    "ranges": [
      [
        52,
        60
      ],
      [
        62,
        136
      ]
    ],
    "reason": "Добавлены время на передачу и временный объем работы."
  },
  "say.0": {
    "hash": 3876729478,
    "ranges": [
      [
        30,
        62
      ],
      [
        65,
        108
      ],
      [
        110,
        149
      ]
    ],
    "reason": "Уточнены вопросы для первого разговора с учителем."
  }
};
  const intro = "<details class=\"how-block\" id=\"updates\"><summary><span>Изменения и дополнения</span><small>25 ноября 2026</small></summary><div class=\"how-content\"><p class=\"section-intro\">Подчеркнуты дополнения, которые влияют на действия директора. Нажмите на фрагмент, чтобы узнать причину правки.</p><div class=\"how-steps\"><div class=\"how-step\"><span>1</span><div><strong><a href=\"#scene1\" data-next=\"scene1\">Ситуация</a></strong><p>Уточнено, что директору предстоит выяснить в разговоре с учителем.</p></div></div><div class=\"how-step\"><span>2</span><div><strong><a href=\"#action0\" data-next=\"action0\">Вариант A</a></strong><p>Добавлено сравнение условий работы с учетом приоритетов учителя.</p></div></div><div class=\"how-step\"><span>3</span><div><strong><a href=\"#action1\" data-next=\"action1\">Вариант B</a></strong><p>Уточнены действия, если учитель решил уйти.</p></div></div><div class=\"how-step\"><span>4</span><div><strong><a href=\"#action2\" data-next=\"action2\">Вариант C</a></strong><p>Добавлены действия на случай неполной передачи проектов и проверка готовности коллеги на конкретной задаче.</p></div></div><div class=\"how-step\"><span>5</span><div><strong><a href=\"#action3\" data-next=\"action3\">Вариант D</a></strong><p>Уточнена подготовка коллег к продолжению работы.</p></div></div><div class=\"how-step\"><span>6</span><div><strong><a href=\"#plan\" data-next=\"plan\">План действий</a></strong><p>Обновлены задачи, фраза для первой встречи и печатный лист.</p></div></div></div><div class=\"how-note\">Спасибо всем, кто поделился опытом и замечаниями. Ваши комментарии помогли уточнить разговор с учителем и план передачи проектов.</div></div></details>";
  const entriesKk = {
  "scene1.text.paragraph1": {
    "hash": 407840155,
    "ranges": [
      [
        20,
        238
      ],
      [
        249,
        302
      ]
    ],
    "reason": "Кету себептерін әңгіме барысында анықтау қажеттігі ескерілді."
  },
  "scene1.text.paragraph2": {
    "hash": 2729272403,
    "ranges": [
      [
        152,
        168
      ],
      [
        175,
        210
      ],
      [
        224,
        265
      ]
    ],
    "reason": "Оқырман өзі қорытынды жасай алуы үшін дайын тұжырым алынып тасталды."
  },
  "action0.detail.paragraph0": {
    "hash": 666523501,
    "ranges": [
      [
        34,
        233
      ],
      [
        235,
        325
      ]
    ],
    "reason": "Кету себептері туралы сұрақтар нақтыланды."
  },
  "action0.detail.paragraph1": {
    "hash": 2628731624,
    "ranges": [
      [
        156,
        373
      ]
    ],
    "reason": "Жылдық табыс пен отбасына дәл қазір қажет ақшаның айырмасы ескерілді."
  },
  "action1.detail.paragraph1": {
    "hash": 4234242936,
    "ranges": [
      [
        0,
        139
      ],
      [
        141,
        181
      ]
    ],
    "reason": "Мұғалімнің басқа мектепті таңдау құқығы ескерілді."
  },
  "action1.detail.paragraph2": {
    "hash": 449586223,
    "ranges": [
      [
        233,
        277
      ]
    ],
    "reason": "Жобаларды жалғастыратын педагогке қажет қолдау нақтыланды."
  },
  "action2.detail.paragraph2": {
    "hash": 1662018308,
    "ranges": [
      [
        0,
        335
      ],
      [
        341,
        383
      ]
    ],
    "reason": "Жобалардың толық тапсырылмау қаупі ескерілді."
  },
  "action2.detail.paragraph3": {
    "hash": 3901203875,
    "ranges": [
      [
        0,
        80
      ],
      [
        82,
        343
      ]
    ],
    "reason": "Әріптестің дайындығын нақты тапсырма арқылы тексеру қосылды."
  },
  "action2.detail.paragraph5": {
    "hash": 851402288,
    "ranges": [
      [
        118,
        148
      ],
      [
        159,
        174
      ],
      [
        202,
        213
      ]
    ],
    "reason": "Тұрақты мұғалім әлі табылмаған жағдай ескерілді."
  },
  "action3.detail.paragraph1": {
    "hash": 661693390,
    "ranges": [
      [
        0,
        107
      ],
      [
        115,
        351
      ]
    ],
    "reason": "Әріптестерді дайындауға қажет уақыт пен жүктеме ескерілді."
  },
  "plan.0.1.what": {
    "hash": 1011005990,
    "ranges": [
      [
        63,
        116
      ],
      [
        126,
        174
      ],
      [
        181,
        187
      ]
    ],
    "reason": "Мұғалімнің кету туралы түпкілікті шешім қабылдауы мүмкін екені ескерілді."
  },
  "plan.0.1.done": {
    "hash": 528817570,
    "ranges": [
      [
        0,
        54
      ],
      [
        62,
        87
      ],
      [
        106,
        116
      ]
    ],
    "reason": "Мұғалімнің кету туралы түпкілікті шешім қабылдауы мүмкін екені ескерілді."
  },
  "plan.1.0.what": {
    "hash": 2258873518,
    "ranges": [
      [
        39,
        128
      ],
      [
        242,
        318
      ]
    ],
    "reason": "Істі тапсыруға уақыт бөлу және уақытша жұмыс көлемін келісу қосылды."
  },
  "plan.1.0.done": {
    "hash": 2506568747,
    "ranges": [
      [
        37,
        44
      ],
      [
        55,
        128
      ]
    ],
    "reason": "Істі тапсыруға уақыт бөлу және уақытша жұмыс көлемін келісу қосылды."
  },
  "say.0": {
    "hash": 4292395706,
    "ranges": [
      [
        36,
        63
      ],
      [
        69,
        171
      ]
    ],
    "reason": "Мұғаліммен алғашқы әңгімеде қойылатын сұрақтар нақтыланды."
  }
};
  const introKk = "<details class=\"how-block\" id=\"updates\"><summary><span>Өзгерістер мен толықтырулар</span><small>2026 жылғы 25 қараша</small></summary><div class=\"how-content\"><p class=\"section-intro\">Директордың әрекетіне әсер ететін толықтырулардың асты сызылған. Өзгерістің себебін білу үшін сол үзіндіні басыңыз.</p><div class=\"how-steps\"><div class=\"how-step\"><span>1</span><div><strong><a href=\"#scene1\" data-next=\"scene1\">Жағдай</a></strong><p>Мұғаліммен әңгімеде директордың нені анықтауы керегі нақтыланды.</p></div></div><div class=\"how-step\"><span>2</span><div><strong><a href=\"#action0\" data-next=\"action0\">A нұсқасы</a></strong><p>Мұғалім үшін маңызды жағдайларды ескеріп, жұмыс шарттарын салыстыру қосылды.</p></div></div><div class=\"how-step\"><span>3</span><div><strong><a href=\"#action1\" data-next=\"action1\">B нұсқасы</a></strong><p>Мұғалім кетуге шешім қабылдаған жағдайда атқарылатын әрекеттер нақтыланды.</p></div></div><div class=\"how-step\"><span>4</span><div><strong><a href=\"#action2\" data-next=\"action2\">C нұсқасы</a></strong><p>Жобалар толық тапсырылмаған кездегі әрекеттер және әріптестің дайындығын нақты тапсырма арқылы тексеру қосылды.</p></div></div><div class=\"how-step\"><span>5</span><div><strong><a href=\"#action3\" data-next=\"action3\">D нұсқасы</a></strong><p>Әріптестерді жұмысты жалғастыруға дайындау нақтыланды.</p></div></div><div class=\"how-step\"><span>6</span><div><strong><a href=\"#plan\" data-next=\"plan\">Іс-қимыл жоспары</a></strong><p>Міндеттер, алғашқы кездесуде айтылатын сөз және басып шығаруға арналған парақ жаңартылды.</p></div></div></div><div class=\"how-note\">Тәжірибесімен және ескертулерімен бөліскен баршаңызға рақмет. Пікірлеріңіз мұғаліммен әңгімелесуді және жобаларды тапсыру жоспарын нақтылауға көмектесті.</div></div></details>";
  function hash(s) { let h=2166136261; for(let i=0;i<s.length;i++) h=Math.imul(h^s.charCodeAt(i),16777619); return h>>>0; }
  function esc(s) { return s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;'); }
  window.SimCaseRevisions = {
    create(caseData, lang) {
      const enabled=caseData.id==='case-001' && (lang==='ru' || lang==='kk');
      const localizedEntries=lang==='kk' ? entriesKk : entries;
      const localizedIntro=lang==='kk' ? introKk : intro;
      const date=lang==='kk' ? '2026 жылғы 25 қараша' : '25 ноября 2026';
      const label=lang==='kk' ? 'Өзгеріске түсініктеме' : 'Пояснение к правке';
      const closeLabel=lang==='kk' ? 'Түсініктемені жабу' : 'Закрыть пояснение';
      let serial=0;
      return {
        intro() { return enabled ? localizedIntro : ''; },
        render(tag,key,text,attrs='',prefix='') {
          const entry=enabled && localizedEntries[key];
          if(!entry || entry.hash!==hash(text)) return '<'+tag+attrs+'>'+prefix+text+'</'+tag+'>';
          const id='revision-help-'+(++serial);
          let content='',at=0;
          for(const [start,end] of entry.ranges) {
            content+=esc(text.slice(at,start))+'<span class="summary-text" role="button" tabindex="0" aria-expanded="false" aria-controls="'+id+'">'+esc(text.slice(start,end))+'</span>';
            at=end;
          }
          content+=esc(text.slice(at));
          return '<'+tag+attrs+' data-revision="'+key+'">'+prefix+content+'<span class="summary-tooltip" id="'+id+'" role="region" aria-label="'+label+'" hidden><button type="button" class="summary-close" aria-label="'+closeLabel+'">×</button><span class="revision-explanation"><strong>'+date+'</strong><br>'+esc(entry.reason)+'</span></span></'+tag+'>';
        },
        mount() {
          if(!enabled) return;
          let active=null,trigger=null;
          function close(restore=false) {
            if(!active) return;
            active.classList.remove('is-open');
            active.querySelector('.summary-tooltip').hidden=true;
            trigger.setAttribute('aria-expanded','false');
            if(restore) trigger.focus({preventScroll:true});
            active=null;trigger=null;
          }
          function toggle(el) {
            const same=el===trigger;close();if(same)return;
            active=el.closest('[data-revision]');trigger=el;
            active.querySelector('.summary-tooltip').hidden=false;
            active.classList.add('is-open');el.setAttribute('aria-expanded','true');
          }
          document.addEventListener('click',e=>{
            const el=e.target.closest('.summary-text');
            if(el){toggle(el);return;}
            if(e.target.closest('.summary-close')){close(true);return;}
            if(e.target.closest('[data-next],[data-pane]') || (active&&!active.contains(e.target))) close();
          });
          document.addEventListener('keydown',e=>{
            if(e.key==='Escape'&&active){e.preventDefault();e.stopPropagation();close(true);}
            else if((e.key==='Enter'||e.key===' ')&&e.target.matches('.summary-text')){e.preventDefault();toggle(e.target);}
          });
          function syncHash(){close();if(location.hash==='#updates'){const details=document.getElementById('updates');if(details)details.open=true;}}
          window.addEventListener('popstate',syncHash);
          syncHash();
        }
      };
    }
  };
})();
