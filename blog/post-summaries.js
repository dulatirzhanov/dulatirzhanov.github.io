const postSummaries = [
  {
    en: `Three CIS school visits showed that strong schools cannot be copied as a model; each one grows from its context, community, and the professional dialogue around it.`,
    kz: `Үш CIS сапары мықты мектептің дайын үлгісі болмайтынын көрсетті: әр мектеп өз контекстінен, қауымдастығынан және кәсіби диалогтан қалыптасады.`,
    ru: `Три визита CIS показали, что сильную школу нельзя просто скопировать: каждая складывается из своего контекста, сообщества и профессионального диалога.`
  },
  {
    en: `A reflection on the gap between school policy and daily practice, using Severance to ask when guiding statements become something people actually feel.`,
    kz: `Мектеп саясаты мен күнделікті тәжірибе арасындағы алшақтық туралы ой. Severance мысалы арқылы құндылықтар қағазда ғана емес, мектеп өмірінде сезіле ме деген сұрақ қойылады.`,
    ru: `Размышление о разрыве между школьной политикой и повседневной практикой. Через Severance текст задает вопрос: становятся ли ценности тем, что люди действительно ощущают в школе?`
  },
  {
    en: `A story about entering teaching, looking for stronger peers, and discovering that professional growth often begins with the question: who can I learn with?`,
    kz: `Мұғалімдік жолдың басындағы ізденіс туралы мәтін: кәсіби өсу көбіне кімнен және кіммен бірге үйрене аламын деген сұрақтан басталады.`,
    ru: `История о входе в профессию учителя, поиске сильных коллег и понимании, что профессиональный рост часто начинается с вопроса: у кого и с кем я могу учиться?`
  },
  {
    en: `HQLT is presented as a practical lens for decisions, teacher development, and the everyday quality of learning.`,
    kz: `HQLT шешім қабылдау, мұғалімдердің дамуы және оқудың күнделікті сапасын түсінуге көмектесетін практикалық құрал ретінде сипатталады.`,
    ru: `HQLT здесь раскрывается как практическая оптика для решений, развития учителей и ежедневного качества обучения.`
  },
  {
    en: `The ADKAR model helps explain why good ideas fail when people do not understand, want, know, can, or sustain the change.`,
    kz: `ADKAR моделі жақсы идеялардың неге іске аспай қалатынын түсіндіреді: адамдар өзгерістің мәнін түсінбесе, қаламаса, білмесе, жасай алмаса немесе сақтай алмаса, өзгеріс орнықпайды.`,
    ru: `Модель ADKAR помогает понять, почему хорошие идеи не приживаются: без понимания, желания, знаний, способности действовать и закрепления изменение распадается.`
  },
  {
    en: `The NIS talent reserve experience becomes a stress test for leadership, showing that fast, responsible decision-making is a skill that needs practice.`,
    kz: `НЗМ кадрлық резервіндегі тәжірибе көшбасшылыққа арналған стресс-тестке айналады: жылдам әрі жауапты шешім қабылдау тұрақты жаттығуды қажет ететін дағды.`,
    ru: `Опыт кадрового резерва НИШ становится стресс-тестом для лидерства и показывает, что быстрое ответственное решение - это навык, который нужно тренировать.`
  },
  {
    en: `A personal story of seeking a mentor and unexpectedly becoming useful to someone else, showing how trust can turn one conversation into mutual growth.`,
    kz: `Ментор іздеп барып, күтпеген жерден басқа адамға пайдалы болу туралы жеке оқиға. Сенім бір әңгімені екі жақты өсуге айналдыра алады.`,
    ru: `Личная история о поиске ментора и неожиданной возможности самому стать полезным другому человеку. Доверие превращает разговор во взаимный рост.`
  },
  {
    en: `A simple life-mapping tool becomes a way to see time, goals, family, and career as one system that deserves structure and meaning.`,
    kz: `Қарапайым өмір картасы уақытты, мақсаттарды, отбасын және мансапты бір жүйе ретінде көруге көмектеседі. Жеке өмірге де құрылым мен мағына қажет.`,
    ru: `Простой инструмент для планирования жизни помогает увидеть время, цели, семью и карьеру как единую систему, которой тоже нужны структура и смысл.`
  },
  {
    en: `Rural education can offer what city schools often cannot: depth, attentiveness, and a more conscious way of thinking about learning and life.`,
    kz: `Ауылдағы білім қала мектебі әрдайым бере алмайтын нәрсені ұсына алады: ойдың тереңдігін, зейінділікті және оқу мен өмірге саналы қарауды.`,
    ru: `Сельское образование может дать то, что городская школа не всегда способна дать: глубину, внимательность и более осознанный взгляд на учебу и жизнь.`
  },
  {
    en: `The CIS Team Leader journey is told through a laptop, school visits, and moments of recognition that shaped both professional confidence and responsibility.`,
    kz: `CIS Team Leader болу жолы ноутбук, мектеп сапарлары және кәсіби сенім мен жауапкершілікті қалыптастырған сәттер арқылы баяндалады.`,
    ru: `Путь к роли CIS Team Leader рассказан через ноутбук, школьные визиты и моменты признания, которые сформировали профессиональную уверенность и ответственность.`
  },
  {
    en: `A short reflection on how metrics can become the goal, narrowing learning into test preparation and weakening the meaning of education.`,
    kz: `Метрика мақсаттың өзін алмастырғанда, оқу тестке дайындыққа тарылып, білімнің мәні әлсірейтіні туралы қысқа рефлексия.`,
    ru: `Короткое размышление о том, как метрики могут подменить цель, сузить обучение до подготовки к тесту и ослабить смысл образования.`
  },
  {
    en: `Integrity is treated as institutional design: systems, rules, and norms shape what people see as acceptable more than personal willpower alone.`,
    kz: `Академиялық адалдық жеке ерік-жігер ғана емес, институционалдық дизайн ретінде қарастырылады: жүйелер, ережелер мен нормалар ненің қалыпты екенін қалыптастырады.`,
    ru: `Честность рассматривается как институциональный дизайн: системы, правила и нормы формируют представление о допустимом сильнее, чем одна только личная воля.`
  },
  {
    en: `A management decision only becomes real when it can be reconstructed later; otherwise discussion can quietly turn into confusion and blame.`,
    kz: `Басқарушылық шешім кейін қайта қалпына келтіріп түсіндіруге болатын кезде ғана шынайы шешімге айналады. Әйтпесе талқылау түсінбеушілік пен кінәлауға ұласады.`,
    ru: `Управленческое решение становится настоящим только тогда, когда его можно восстановить позже. Иначе обсуждение легко превращается в путаницу и взаимные обвинения.`
  },
  {
    en: `The post argues that schools should not depend on one overloaded person; sustainable management needs a model, shared roles, and clear processes.`,
    kz: `Мектеп бір ғана шамадан тыс жүктелген адамға тәуелді болмауы керек. Тұрақты басқару үшін модель, бөлінген рөлдер және түсінікті процестер қажет.`,
    ru: `Текст показывает, что школа не должна держаться на одном перегруженном человеке: устойчивому управлению нужны модель, распределенные роли и понятные процессы.`
  },
  {
    en: `CIS evaluation visits are described as a way to build the muscle of responsibility through careful observation, trust, and professional judgement.`,
    kz: `CIS бағалау сапарлары мұқият бақылау, сенім және кәсіби пайым арқылы жауапкершілік бұлшықетін дамытатын тәжірибе ретінде сипатталады.`,
    ru: `Визиты CIS описаны как опыт, который развивает мышцу ответственности через внимательное наблюдение, доверие и профессиональное суждение.`
  },
  {
    en: `Conference talk at the 10th annual NU GSPP conference in Astana, 16 October 2026. Title: Management Capacity and the Fragmentation of Education Reforms.`,
    kz: `Астанада өткен NU GSPP 10-жылдық конференциясындағы баяндама, 2026 жылғы 16 қазан. Тақырыбы: басқару әлеуеті және білім беру реформаларының бытыраңқылығы.`,
    ru: `Доклад на 10-й ежегодной конференции NU GSPP в Астане 16 октября 2026 года. Тема: управленческий потенциал и фрагментация реформ в образовании.`
  },
  {
    en: `Conference talk at the NIS Conference, 29-30 October 2026. Title: Institutional Memory as a Foundation for Sustainable School Transformation.`,
    kz: `2026 жылғы 29-30 қазанда өткен NIS конференциясындағы баяндама. Тақырыбы: институционалдық жады мектепті тұрақты өзгертудің негізі ретінде.`,
    ru: `Доклад на конференции NIS 29-30 октября 2026 года. Тема: институциональная память как основа устойчивых изменений в школе.`
  }
];
