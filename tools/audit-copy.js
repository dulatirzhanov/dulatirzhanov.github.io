/* Тексты анкеты школы перед первым разговором.
   Вопрос: [формулировка, тип поля (text | area | long), подсказка].
   Обязательны первый вопрос (повод) и последний (контакт): их номера не задаются отдельно,
   скрипт берет первый и последний по порядку. */
(function () {
  window.AUDIT_COPY = {
    ru: {
      title: "Анкета школы", eyebrow: "Перед первым разговором · бесплатно",
      lede: "Ответьте на вопросы, которые помогут провести первый разговор по делу. Обязательны только первый и последний, остальные можно пропустить.",
      privacy: "Сайт сам никуда не отправляет ответы. Черновик хранится только в этом браузере, пока вы его не очистите.",
      metrics: [["15 вопросов","Обязательны первый и последний"],["Около 10 минут","Можно отвечать кратко, точные цифры не нужны"],["Ответ за два рабочих дня","Первый разговор бесплатный"]],
      sections: [
        { title: "Повод", note: "С чего начать разговор.", wide: true, questions: [
          ["Что происходит в школе и что вы хотите решить?","long","Двух-трех предложений достаточно"],
          ["Что вы уже пробовали?","area",""],
          ["Есть ли срок, к которому нужно определиться?","text","Дата или событие"]
        ] },
        { title: "О школе", note: "Основные факты. Точные цифры не нужны.", questions: [
          ["Название школы и город","text",""],
          ["Тип школы","text","Частная, государственная, сетевая, международная франшиза или другое"],
          ["Год основания и число учеников сейчас","text",""],
          ["Программа обучения","text","Национальная, IB, Cambridge, смешанная или другая"],
          ["Какие у школы лицензия, аккредитации и членство в международных организациях?","area",""],
          ["Кто учредитель или владелец школы?","text",""]
        ] },
        { title: "Управление", note: "Кто принимает решения и на чем держится работа.", questions: [
          ["Кто директор и сколько лет работает в этой должности?","text",""],
          ["Кто принимает ключевые решения: директор, учредитель, совет или управляющая организация?","area",""],
          ["Кто входит в руководящую команду и менялся ли ее состав за последние два года?","area",""],
          ["Какими системами школа пользуется для управления и кто за них отвечает?","area","Учет учеников и оценок, финансы, Excel, WhatsApp или другие инструменты"],
          ["Какие крупные планы или трудности ждут школу в ближайшие два-пять лет? Записаны ли они в документе?","area",""]
        ] },
        { title: "Контакт", note: "Чтобы я мог ответить.", wide: true, questions: [
          ["Ваше имя, роль в школе и удобный способ связи","text","Имя, должность, телефон или email"]
        ] }
      ],
      required: "обязательно",
      complete: "Отправка", filled: (n, total) => `Заполнено ${n} из ${total} вопросов.`,
      sendWhatsApp: "Отправить в WhatsApp", sendEmail: "Отправить по почте", copy: "Скопировать ответы",
      print: "Сохранить PDF или распечатать", printBlank: "Пустая форма для печати", clear: "Очистить",
      sendNote: "Ответы уходят только после вашего нажатия. Я отвечу в течение двух рабочих дней.",
      needRequired: "Ответьте на первый и последний вопросы: что вы хотите решить и как с вами связаться.",
      waShort: school => `Здравствуйте! Отправляю анкету школы${school}. Ответы вставлю следующим сообщением.`,
      openedWa: "Открылся чат с готовым текстом. Осталось нажать «Отправить».",
      openedMail: "Открылось письмо с ответами. Осталось его отправить.",
      copiedWa: "Ответы скопированы. В открывшемся чате вставьте их в сообщение и отправьте.",
      copiedMail: "Ответы скопированы. Вставьте их в открывшееся письмо и отправьте.",
      copiedOnly: "Ответы скопированы.",
      copyFailed: "Скопировать не получилось. Сохраните анкету в PDF и отправьте файл на d@dulatedu.com или в WhatsApp.",
      openChat: "Открыть чат", restored: "Черновик восстановлен из этого браузера.",
      confirmClear: "Очистить все ответы? Восстановить их после этого будет невозможно.",
      reportSubtitle: "Материалы к первому разговору", school: "Школа", preparedBy: "Заполнил(а)", notGiven: "Ответ не указан",
      notice: "Документ составлен по сведениям, предоставленным представителем школы. Он служит основой для первого разговора и не является заключением о качестве работы школы.",
      profile: "Профиль школы", managementRequest: "С чем обращается школа", deadline: "Срок решения", leadership: "Управление и рабочие системы", horizon: "Планы на два-пять лет",
      blankSubtitle: "Форма для заполнения от руки", blankInstruction: "Пишите кратко. Если места недостаточно, продолжите ответ на отдельном листе.",
      emailSubject: "Анкета школы", source: "Форма: dulatedu.com"
    },
    kk: {
      title: "Мектеп сауалнамасы", eyebrow: "Алғашқы әңгіме алдында · тегін",
      lede: "Алғашқы әңгіме нақты өтуі үшін бірнеше сұраққа жауап беріңіз. Бірінші және соңғы сұраққа жауап беру міндетті, қалғанын өткізіп жіберуге болады.",
      privacy: "Сайт жауаптарды өздігінен ешқайда жібермейді. Жауаптарыңыз өзіңіз тазартқанға дейін осы браузерде ғана сақталады.",
      metrics: [["15 сұрақ","Бірінші және соңғысы міндетті"],["Шамамен 10 минут","Қысқа жазуға болады, нақты сандар қажет емес"],["Екі жұмыс күнінде жауап беремін","Алғашқы әңгіме тегін"]],
      sections: [
        { title: "Хабарласу себебі", note: "Әңгімені неден бастаған жөн.", wide: true, questions: [
          ["Мектепте не болып жатыр және қандай мәселені шешкіңіз келеді?","long","Екі-үш сөйлем жеткілікті"],
          ["Бұған дейін не істеп көрдіңіз?","area",""],
          ["Шешім қабылдауға белгіленген мерзім бар ма?","text","Күні немесе оқиға"]
        ] },
        { title: "Мектеп туралы", note: "Негізгі деректер. Нақты сандар қажет емес.", questions: [
          ["Мектептің атауы және қаласы","text",""],
          ["Мектептің түрі","text","Жекеменшік, мемлекеттік, желілік, халықаралық франшиза немесе басқа"],
          ["Құрылған жылы және қазіргі оқушы саны","text",""],
          ["Оқу бағдарламасы","text","Ұлттық, IB, Cambridge, аралас немесе басқа бағдарлама"],
          ["Мектептің қандай лицензиясы, акредиттеуі және халықаралық ұйымдарға мүшелігі бар?","area",""],
          ["Мектептің құрылтайшысы немесе иесі кім?","text",""]
        ] },
        { title: "Басқару", note: "Шешімді кім қабылдайды және жұмыс неге сүйенеді.", questions: [
          ["Директор кім және осы қызметте неше жыл жұмыс істейді?","text",""],
          ["Негізгі шешімдерді кім қабылдайды: директор, құрылтайшы, кеңес әлде басқарушы ұйым ба?","area",""],
          ["Басқарушы командаға кімдер кіреді және соңғы екі жылда оның құрамы өзгерді ме?","area",""],
          ["Мектепті басқаруға қандай жүйелер қолданылады және оларға кім жауап береді?","area","Оқушылар мен бағаларды есепке алу, қаржы, Excel, WhatsApp немесе басқа құралдар"],
          ["Алдағы екі-бес жылда мектепті қандай ірі жоспарлар немесе қиындықтар күтіп тұр? Олар құжатта жазылған ба?","area",""]
        ] },
        { title: "Байланыс", note: "Жауап беруім үшін.", wide: true, questions: [
          ["Аты-жөніңіз, мектептегі қызметіңіз және қолайлы байланыс тәсілі","text","Аты-жөні, қызметі, телефон немесе email"]
        ] }
      ],
      required: "міндетті",
      complete: "Жіберу", filled: (n, total) => `${n}/${total} сұраққа жауап берілді.`,
      sendWhatsApp: "WhatsApp арқылы жіберу", sendEmail: "Поштамен жіберу", copy: "Жауаптарды көшіру",
      print: "PDF сақтау немесе басып шығару", printBlank: "Басып шығаруға арналған бос нысан", clear: "Тазарту",
      sendNote: "Жауаптар өзіңіз батырманы басқаннан кейін ғана жіберіледі. Екі жұмыс күні ішінде жауап беремін.",
      needRequired: "Бірінші және соңғы сұраққа жауап беріңіз: қандай мәселені шешкіңіз келеді және сізбен қалай байланысуға болады.",
      waShort: school => `Сәлеметсіз бе! Мектеп сауалнамасын жіберіп отырмын${school}. Жауаптарды келесі хабарламамен жіберемін.`,
      openedWa: "Дайын мәтіні бар чат ашылды. Тек «Жіберу» батырмасын басу қалды.",
      openedMail: "Жауаптар жазылған хат ашылды. Тек жіберу қалды.",
      copiedWa: "Жауаптар көшірілді. Ашылған чатта оларды хабарламаға қойып, жіберіңіз.",
      copiedMail: "Жауаптар көшірілді. Ашылған хатқа қойып, жіберіңіз.",
      copiedOnly: "Жауаптар көшірілді.",
      copyFailed: "Көшіру мүмкін болмады. Сауалнаманы PDF түрінде сақтап, файлды d@dulatedu.com поштасына немесе WhatsApp арқылы жіберіңіз.",
      openChat: "Чатты ашу", restored: "Сақталған жауаптар осы браузерден қалпына келтірілді.",
      confirmClear: "Барлық жауап өшірілсін бе? Оларды кейін қалпына келтіру мүмкін болмайды.",
      reportSubtitle: "Алғашқы әңгімеге арналған материалдар", school: "Мектеп", preparedBy: "Толтырған адам", notGiven: "Жауап берілмеген",
      notice: "Құжат мектеп өкілі ұсынған мәліметтер негізінде жасалды. Ол алғашқы әңгімеге дайындалуға арналған және мектеп жұмысының сапасы туралы қорытынды болып саналмайды.",
      profile: "Мектеп туралы мәлімет", managementRequest: "Мектептің хабарласу себебі", deadline: "Шешім қабылдау мерзімі", leadership: "Басқару және жұмыс жүйелері", horizon: "Екі-бес жылға арналған жоспарлар",
      blankSubtitle: "Қолмен толтыруға арналған нысан", blankInstruction: "Қысқа жазыңыз. Орын жетпесе, жауапты бөлек парақта жалғастырыңыз.",
      emailSubject: "Мектеп сауалнамасы", source: "Нысан: dulatedu.com"
    },
    en: {
      title: "School questionnaire", eyebrow: "Before the first conversation · free",
      lede: "Answer the questions that will make the first conversation useful. Only the first and the last are required; the rest can be skipped.",
      privacy: "The website never sends your answers on its own. The draft is kept only in this browser until you clear it.",
      metrics: [["15 questions","The first and the last are required"],["About 10 minutes","Brief answers are fine, exact figures are not needed"],["A reply within two working days","The first conversation is free"]],
      sections: [
        { title: "Reason for writing", note: "Where the conversation should start.", wide: true, questions: [
          ["What is happening at the school and what do you want to resolve?","long","Two or three sentences are enough"],
          ["What have you already tried?","area",""],
          ["Is there a deadline by which a decision must be made?","text","A date or an event"]
        ] },
        { title: "About the school", note: "Essential facts. Exact figures are not needed.", questions: [
          ["School name and city","text",""],
          ["Type of school","text","Private, public, network school, international franchise, or other"],
          ["Year founded and current enrolment","text",""],
          ["Curriculum","text","National, IB, Cambridge, blended, or other"],
          ["Which licence, accreditations and international memberships does the school hold?","area",""],
          ["Who founded or owns the school?","text",""]
        ] },
        { title: "Governance", note: "Who decides and what the work relies on.", questions: [
          ["Who is the principal and how many years have they been in the role?","text",""],
          ["Who makes the major decisions: the principal, the founder, the board, or a managing organisation?","area",""],
          ["Who is on the senior leadership team, and has it changed over the past two years?","area",""],
          ["Which systems does the school use for management, and who is responsible for them?","area","Student records and grades, finance, Excel, WhatsApp, or other tools"],
          ["What major plans or difficulties does the school face over the next two to five years? Are they written down?","area",""]
        ] },
        { title: "Contact", note: "So that I can reply.", wide: true, questions: [
          ["Your name, role at the school and preferred way to be contacted","text","Name, position, phone or email"]
        ] }
      ],
      required: "required",
      complete: "Send", filled: (n, total) => `${n} of ${total} questions answered.`,
      sendWhatsApp: "Send via WhatsApp", sendEmail: "Send by email", copy: "Copy answers",
      print: "Save as PDF or print", printBlank: "Blank form for printing", clear: "Clear",
      sendNote: "Your answers are sent only when you press a button. I will reply within two working days.",
      needRequired: "Please answer the first and the last questions: what you want to resolve and how to reach you.",
      waShort: school => `Hello! I am sending the school questionnaire${school}. I will paste the answers in the next message.`,
      openedWa: "A chat with the text has opened. All that is left is to press Send.",
      openedMail: "An email with your answers has opened. All that is left is to send it.",
      copiedWa: "The answers have been copied. Paste them into the chat that opened and send.",
      copiedMail: "The answers have been copied. Paste them into the email that opened and send.",
      copiedOnly: "The answers have been copied.",
      copyFailed: "Copying did not work. Save the questionnaire as a PDF and send the file to d@dulatedu.com or via WhatsApp.",
      openChat: "Open the chat", restored: "Your draft has been restored from this browser.",
      confirmClear: "Clear all answers? They cannot be recovered afterwards.",
      reportSubtitle: "Materials for the first conversation", school: "School", preparedBy: "Completed by", notGiven: "No answer provided",
      notice: "This document is based on information supplied by a representative of the school. It supports an initial conversation and is not an evaluation of the quality of the school.",
      profile: "School profile", managementRequest: "Why the school is writing", deadline: "Decision deadline", leadership: "Governance and operating systems", horizon: "Plans for the next two to five years",
      blankSubtitle: "Form for handwritten completion", blankInstruction: "Keep your answers brief. If you need more space, continue on a separate sheet.",
      emailSubject: "School questionnaire", source: "Form: dulatedu.com"
    }
  };
})();
