/* Тексты анкеты школы перед первым разговором.
   Вопрос: [формулировка, тип поля (text | area | long), подсказка].
   Обязательны первый вопрос (повод) и последний (контакт): их номера не задаются отдельно,
   скрипт берет первый и последний по порядку. */
(function () {
  window.AUDIT_COPY = {
    ru: {
      title: "Анкета школы", eyebrow: "Перед первым разговором · бесплатно",
      lede: "Ответьте на вопросы, которые помогут провести первый разговор по делу. Обязательны только первый и последний вопросы, остальные можно пропустить.",
      privacy: "Сайт не отправляет ответы автоматически. Черновик ответов хранится только в этом браузере. Удалить его можно кнопкой «Очистить».",
      metrics: [["15 вопросов","Обязательны первый и последний"],["Около 10 минут","Можно отвечать кратко, точные цифры не нужны"],["Ответ за два рабочих дня","Первый разговор бесплатный"]],
      sections: [
        { title: "Повод", note: "С чего начать разговор.", wide: true, questions: [
          ["Что происходит в школе и что вы хотите решить?","long","Двух-трех предложений достаточно"],
          ["Что вы уже пробовали?","area",""],
          ["Есть ли срок, к которому нужно принять решение?","text","Дата или событие"]
        ] },
        { title: "О школе", note: "Основные факты. Точные цифры не нужны.", questions: [
          ["Название школы и город","text",""],
          ["Тип школы","text","Частная, государственная, сетевая, международная франшиза или другое"],
          ["Год основания и число учеников сейчас","text",""],
          ["Программа обучения","text","Национальная, IB, Cambridge, смешанная или другая"],
          ["Какие лицензии и аккредитации есть у школы? В каких международных организациях она состоит?","area",""],
          ["Кто учредитель или владелец школы?","text",""]
        ] },
        { title: "Управление", note: "Кто принимает решения и как организована работа школы.", questions: [
          ["Кто директор и сколько лет работает в этой должности?","text",""],
          ["Кто принимает ключевые решения: директор, учредитель, совет или управляющая организация?","area",""],
          ["Кто входит в руководящую команду и менялся ли ее состав за последние два года?","area",""],
          ["Какими системами школа пользуется для управления и кто за них отвечает?","area","Учет учеников и оценок, финансы, Excel, WhatsApp или другие инструменты"],
          ["Какие крупные планы у школы на ближайшие два-пять лет и какие трудности вы ожидаете? Записаны ли они в документе?","area",""]
        ] },
        { title: "Контакт", note: "Чтобы я мог ответить.", wide: true, questions: [
          ["Ваше имя, роль в школе и удобный способ связи","text","Имя, должность, телефон или email"]
        ] }
      ],
      required: "обязательно",
      complete: "Отправка", filled: (n, total) => `Заполнено ${n} из ${total} вопросов.`,
      sendWhatsApp: "Отправить в WhatsApp", sendEmail: "Отправить по почте", copy: "Скопировать ответы",
      print: "Сохранить PDF или распечатать", printBlank: "Пустая форма для печати", clear: "Очистить",
      sendNote: "Проверьте и отправьте сообщение в WhatsApp или почтовой программе. Я отвечу в течение двух рабочих дней.",
      needRequired: "Ответьте на первый и последний вопросы. Укажите, что хотите решить и как с вами связаться.",
      waShort: school => `Здравствуйте! Отправляю анкету школы${school}. Ответы вставлю следующим сообщением.`,
      openedWa: "Отправьте подготовленное сообщение в WhatsApp.",
      openedMail: "Отправьте подготовленное письмо в почтовой программе.",
      copiedWa: "Ответы скопированы. Вставьте их в чат WhatsApp и отправьте сообщение.",
      copiedMail: "Ответы скопированы. Вставьте их в письмо и отправьте его.",
      copiedOnly: "Ответы скопированы.",
      copyFailed: "Скопировать не получилось. Сохраните анкету в PDF и отправьте файл на d@dulatedu.com или в WhatsApp.",
      openChat: "Открыть чат", restored: "Сохраненные в этом браузере ответы восстановлены.",
      confirmClear: "Очистить все ответы? Восстановить их после этого будет невозможно.",
      reportSubtitle: "Материалы к первому разговору", school: "Школа", preparedBy: "Заполнил(а)", notGiven: "Ответ не указан",
      notice: "Документ составлен по сведениям, предоставленным представителем школы. Он служит основой для первого разговора и не является заключением о качестве работы школы.",
      profile: "Профиль школы", managementRequest: "С чем обращается школа", deadline: "Срок принятия решения", leadership: "Управление и рабочие системы", horizon: "Планы на два-пять лет",
      blankSubtitle: "Форма для заполнения", blankInstruction: "Пишите кратко. Если места недостаточно, продолжите ответ на отдельном листе.",
      emailSubject: "Анкета школы", source: "Форма: dulatedu.com",
      brandLine: "Управленческие решения в образовании", confidential: "Конфиденциально", dateLabel: "Дата", pageWord: "стр.", schoolAndManagement: "Школа и управление", factHead: ["Параметр", "Сведения"],
      shortLabels: { school: "Школа", type: "Тип", founded: "Год основания, число учеников", curriculum: "Программа", owner: "Учредитель", principal: "Директор", licence: "Лицензия и аккредитации" }
    },
    kk: {
      title: "Мектеп сауалнамасы", eyebrow: "Алғашқы әңгіме алдында · тегін",
      lede: "Алғашқы әңгімеге дайындалуға көмектесетін сұрақтарға жауап беріңіз. Бірінші және соңғы сұраққа жауап беру міндетті. Қалғанын өткізіп жіберуге болады.",
      privacy: "Жауаптар автоматты түрде жіберілмейді. Жауаптарыңыз тек осы браузерде сақталады. Оларды «Тазарту» батырмасымен өшіруге болады.",
      metrics: [["15 сұрақ","Бірінші және соңғысы міндетті"],["Шамамен 10 минут","Қысқа жазуға болады, нақты сандар қажет емес"],["Екі жұмыс күні ішінде жауап","Алғашқы әңгіме тегін"]],
      sections: [
        { title: "Хабарласу себебі", note: "Әңгімені неден бастаған жөн.", wide: true, questions: [
          ["Мектепте не болып жатыр және қандай мәселені шешкіңіз келеді?","long","Екі-үш сөйлем жеткілікті"],
          ["Бұған дейін не істеп көрдіңіз?","area",""],
          ["Шешім қабылдауға белгіленген мерзім бар ма?","text","Күнін немесе оқиғаны көрсетіңіз"]
        ] },
        { title: "Мектеп туралы", note: "Негізгі деректер. Нақты сандар қажет емес.", questions: [
          ["Мектептің атауы және орналасқан қаласы","text",""],
          ["Мектептің түрі","text","Жекеменшік, мемлекеттік, желілік, халықаралық франшиза немесе басқа"],
          ["Құрылған жылы және қазіргі оқушы саны","text",""],
          ["Оқу бағдарламасы","text","Ұлттық, IB, Cambridge, аралас немесе басқа бағдарлама"],
          ["Мектептің қандай лицензиялары мен акредиттеулері бар? Ол қандай халықаралық ұйымдарға мүше?","area",""],
          ["Мектептің құрылтайшысы немесе иесі кім?","text",""]
        ] },
        { title: "Басқару", note: "Шешімді кім қабылдайды және мектеп жұмысы қалай ұйымдастырылған.", questions: [
          ["Директор кім және бұл қызметте қанша жылдан бері жұмыс істейді?","text",""],
          ["Негізгі шешімдерді кім қабылдайды: директор, құрылтайшы, кеңес әлде басқарушы ұйым ба?","area",""],
          ["Мектептің басшылық құрамына кімдер кіреді және соңғы екі жылда оның құрамы өзгерді ме?","area",""],
          ["Мектепті басқаруға қандай жүйелер қолданылады және оларға кім жауап береді?","area","Оқушылар мен бағаларды есепке алу, қаржы, Excel, WhatsApp немесе басқа құралдар"],
          ["Мектептің алдағы екі-бес жылға қандай ірі жоспарлары бар және қандай қиындықтар болуы мүмкін? Олар құжатта көрсетілген бе?","area",""]
        ] },
        { title: "Байланыс", note: "Жауап беруім үшін.", wide: true, questions: [
          ["Аты-жөніңіз, мектептегі қызметіңіз және қолайлы байланыс тәсілі","text","Аты-жөніңіз, қызметіңіз, телефон немесе email"]
        ] }
      ],
      required: "міндетті",
      complete: "Жіберу", filled: (n, total) => `${n}/${total} сұраққа жауап берілді.`,
      sendWhatsApp: "WhatsApp арқылы жіберу", sendEmail: "Электрондық поштамен жіберу", copy: "Жауаптарды көшіру",
      print: "PDF түрінде сақтау немесе басып шығару", printBlank: "Басып шығаруға арналған бос нысан", clear: "Тазарту",
      sendNote: "WhatsApp не пошта қолданбасында хабарламаны тексеріп, жіберіңіз. Екі жұмыс күні ішінде жауап беремін.",
      needRequired: "Бірінші және соңғы сұраққа жауап беріңіз. Қандай мәселені шешкіңіз келетінін және сізбен қалай байланысуға болатынын жазыңыз.",
      waShort: school => `Сәлеметсіз бе! Мектеп сауалнамасын жіберіп отырмын${school}. Жауаптарды келесі хабарламамен жіберемін.`,
      openedWa: "Дайын хабарламаны WhatsApp арқылы жіберіңіз.",
      openedMail: "Дайын хатты пошта қолданбасында жіберіңіз.",
      copiedWa: "Жауаптар көшірілді. Оларды WhatsApp чатына қойып, хабарламаны жіберіңіз.",
      copiedMail: "Жауаптар көшірілді. Оларды хатқа қойып, хатты жіберіңіз.",
      copiedOnly: "Жауаптар көшірілді.",
      copyFailed: "Көшіру мүмкін болмады. Сауалнаманы PDF түрінде сақтап, файлды d@dulatedu.com поштасына немесе WhatsApp арқылы жіберіңіз.",
      openChat: "Чатты ашу", restored: "Осы браузерде сақталған жауаптар қалпына келтірілді.",
      confirmClear: "Барлық жауапты өшіргіңіз келе ме? Оларды кейін қалпына келтіру мүмкін болмайды.",
      reportSubtitle: "Алғашқы әңгімеге арналған материалдар", school: "Мектеп", preparedBy: "Толтырған адам", notGiven: "Жауап берілмеген",
      notice: "Құжат мектеп өкілі ұсынған мәліметтер негізінде жасалды. Ол алғашқы әңгімеге дайындалуға арналған және мектеп жұмысының сапасы туралы қорытынды болып саналмайды.",
      profile: "Мектеп туралы мәлімет", managementRequest: "Мектептің хабарласу себебі", deadline: "Шешім қабылдау мерзімі", leadership: "Басқару және жұмыс жүйелері", horizon: "Екі-бес жылға арналған жоспарлар",
      blankSubtitle: "Толтыруға арналған нысан", blankInstruction: "Қысқа жазыңыз. Орын жетпесе, жауапты бөлек парақта жалғастырыңыз.",
      emailSubject: "Мектеп сауалнамасы", source: "Нысан: dulatedu.com",
      brandLine: "Білім берудегі басқарушылық шешімдер", confidential: "Құпия", dateLabel: "Күні", pageWord: "бет", schoolAndManagement: "Мектеп және басқару", factHead: ["Көрсеткіш", "Мәліметтер"],
      shortLabels: { school: "Мектеп", type: "Түрі", founded: "Құрылған жылы, оқушы саны", curriculum: "Бағдарлама", owner: "Құрылтайшы", principal: "Директор", licence: "Лицензия және акредиттеу" },
      // в части браузеров нет казахских названий месяцев, дата собирается вручную
      formatDate: d => `${d.getFullYear()} жылғы ${d.getDate()} ${["қаңтар","ақпан","наурыз","сәуір","мамыр","маусым","шілде","тамыз","қыркүйек","қазан","қараша","желтоқсан"][d.getMonth()]}`
    },
    en: {
      title: "School questionnaire", eyebrow: "Before the first conversation · free",
      lede: "Answer these questions to help us prepare for a useful first conversation. Only the first and last questions are required; you can skip the rest.",
      privacy: "The website does not send your answers automatically. Your draft is saved only in this browser. You can delete it using the Clear button.",
      metrics: [["15 questions","Only the first and last questions are required"],["About 10 minutes","Brief answers are fine; exact figures are not needed"],["A reply within two working days","The first conversation is free"]],
      sections: [
        { title: "Reason for writing", note: "Where the conversation should start.", wide: true, questions: [
          ["What is happening at the school, and what would you like to resolve?","long","Two or three sentences are enough"],
          ["What have you already tried?","area",""],
          ["Is there a deadline by which a decision must be made?","text","A date or an event"]
        ] },
        { title: "About the school", note: "Essential facts. Exact figures are not needed.", questions: [
          ["School name and city","text",""],
          ["Type of school","text","Private, state, part of a school network, international franchise, or other"],
          ["Year founded and current enrolment","text",""],
          ["Curriculum","text","National, IB, Cambridge, a combination, or another curriculum"],
          ["What licences and accreditations does the school hold? Which international organisations does it belong to?","area",""],
          ["Who is the school's founder or owner?","text",""]
        ] },
        { title: "Management", note: "Who makes decisions and how the school is run.", questions: [
          ["Who is the principal and how many years have they been in the role?","text",""],
          ["Who makes the major decisions: the principal, the founder, the board, or a managing organisation?","area",""],
          ["Who is on the senior leadership team, and has it changed over the past two years?","area",""],
          ["Which systems does the school use for management, and who is responsible for them?","area","Student records and grades, finance, Excel, WhatsApp, or other tools"],
          ["What major plans does the school have for the next two to five years, and what challenges do you expect? Are these documented?","area",""]
        ] },
        { title: "Contact", note: "So that I can reply.", wide: true, questions: [
          ["Your name, role at the school and preferred way to be contacted","text","Name, position, phone or email"]
        ] }
      ],
      required: "required",
      complete: "Send", filled: (n, total) => `${n} of ${total} questions answered.`,
      sendWhatsApp: "Send via WhatsApp", sendEmail: "Send by email", copy: "Copy answers",
      print: "Save as PDF or print", printBlank: "Blank form for printing", clear: "Clear",
      sendNote: "Review and send the message in WhatsApp or your email app. I will reply within two working days.",
      needRequired: "Please answer the first and last questions. Tell me what you want to resolve and how to contact you.",
      waShort: school => `Hello! I am sending the school questionnaire${school}. I will paste the answers in the next message.`,
      openedWa: "Send the prepared message in WhatsApp.",
      openedMail: "Send the prepared email in your email app.",
      copiedWa: "Answers copied. Paste them into the WhatsApp chat and send the message.",
      copiedMail: "Answers copied. Paste them into the email and send it.",
      copiedOnly: "Answers copied.",
      copyFailed: "Copying did not work. Save the questionnaire as a PDF and send the file to d@dulatedu.com or via WhatsApp.",
      openChat: "Open the chat", restored: "Your saved answers have been restored from this browser.",
      confirmClear: "Clear all answers? They cannot be recovered afterwards.",
      reportSubtitle: "Materials for the first conversation", school: "School", preparedBy: "Completed by", notGiven: "No answer provided",
      notice: "This document is based on information supplied by a representative of the school. It supports an initial conversation and is not an evaluation of the quality of the school.",
      profile: "School profile", managementRequest: "Reason for contacting me", deadline: "Decision deadline", leadership: "Governance and operating systems", horizon: "Plans for the next two to five years",
      blankSubtitle: "Form to complete", blankInstruction: "Keep your answers brief. If you need more space, continue on a separate sheet.",
      emailSubject: "School questionnaire", source: "Form: dulatedu.com",
      brandLine: "Leadership decisions in education", confidential: "Confidential", dateLabel: "Date", pageWord: "page", schoolAndManagement: "School and management", factHead: ["Item", "Details"],
      shortLabels: { school: "School", type: "Type", founded: "Founded, enrolment", curriculum: "Curriculum", owner: "Owner", principal: "Principal", licence: "Licence and accreditation" }
    }
  };
})();
