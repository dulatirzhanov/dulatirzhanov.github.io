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
  function hash(s) { let h=2166136261; for(let i=0;i<s.length;i++) h=Math.imul(h^s.charCodeAt(i),16777619); return h>>>0; }
  function esc(s) { return s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;'); }
  window.SimCaseRevisions = {
    create(caseData, lang) {
      const enabled=caseData.id==='case-001' && lang==='ru';
      let serial=0;
      return {
        intro() { return enabled ? intro : ''; },
        render(tag,key,text,attrs='',prefix='') {
          const entry=enabled && entries[key];
          if(!entry || entry.hash!==hash(text)) return '<'+tag+attrs+'>'+prefix+text+'</'+tag+'>';
          const id='revision-help-'+(++serial);
          let content='',at=0;
          for(const [start,end] of entry.ranges) {
            content+=esc(text.slice(at,start))+'<span class="summary-text" role="button" tabindex="0" aria-expanded="false" aria-controls="'+id+'">'+esc(text.slice(start,end))+'</span>';
            at=end;
          }
          content+=esc(text.slice(at));
          return '<'+tag+attrs+' data-revision="'+key+'">'+prefix+content+'<span class="summary-tooltip" id="'+id+'" role="region" aria-label="Пояснение к правке" hidden><button type="button" class="summary-close" aria-label="Закрыть пояснение">×</button><span class="revision-explanation"><strong>25 ноября 2026</strong><br>'+esc(entry.reason)+'</span></span></'+tag+'>';
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
