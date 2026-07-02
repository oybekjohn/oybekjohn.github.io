/* ============================================
   AI Chatbot — Smart Knowledge-Base
   No API key exposed client-side
   Keyword matching + predefined knowledge
   ============================================ */

(function () {
  'use strict';

  const toggle = document.getElementById('chatbotToggle');
  const chatWindow = document.getElementById('chatbotWindow');
  const messagesEl = document.getElementById('chatMessages');
  const suggestionsEl = document.getElementById('chatSuggestions');
  const inputEl = document.getElementById('chatInput');
  const sendBtn = document.getElementById('chatSend');

  if (!toggle || !chatWindow) return;

  let isOpen = false;
  let hasGreeted = false;

  // ---- Knowledge Base (multi-language) ----
  function getKnowledge(lang) {
    const kb = {
      en: {
        greeting: "Hi! 👋 I'm Oybek's AI assistant. I can answer questions about his skills, experience, projects, research, and more. What would you like to know?",
        suggestions: ["What does Oybek do?", "Skills & tech stack", "Projects", "Research & publications", "How to contact?"],
        fallback: "I'm not sure about that. Try asking about Oybek's skills, experience, education, projects, or research! 😊",
        entries: [
          {
            keywords: ["who", "about", "introduction", "oybek", "what does", "tell me"],
            answer: "Oybek Khushvaktov is an AI Automation Developer and Programming Teacher based in Tashkent, Uzbekistan. He builds AI-powered agents, Telegram bots, and automation systems that save time and increase efficiency. He's also active in academic research (PhD track) with published papers and a registered software patent. 5+ years of programming experience and 3+ years of teaching experience. 🚀"
          },
          {
            keywords: ["skill", "tech", "stack", "programming", "language", "tools", "technology"],
            answer: "Oybek's tech stack includes:\n\n🐍 **Python** (main language)\n🧠 **Claude Code, Codex, Antigravity** — AI coding agents\n✨ **Vibe coding & Prompt Engineering**\n🌐 **Django REST Framework**\n🤖 **Telegram Bot API**\n🐘 **PostgreSQL**\n📊 **Data Analytics** (Excel, SQL, Power BI)\n📋 **Project Management**\n🔧 **Git, Docker, Linux, AWS**"
          },
          {
            keywords: ["experience", "work", "job", "career", "history"],
            answer: "Oybek's professional journey:\n\n🏫 **Renaissance University** — IT Lecturer (2023-2025)\n🎓 **Mirzo Ulugbek Presidential School** — Teacher (2022-2023)\n🔵 **GDSC Lead** at IIAU (2022-2023)\n🔬 **IIAU** — Lab Assistant (2021-2022)\n💼 **Zamonaviy Kommunikatsiyalar** — Junior Backend Dev (2021)\n🏢 **IT Park Samarkand** — Web Developer (2020)"
          },
          {
            keywords: ["education", "university", "degree", "study", "school", "academic"],
            answer: "🎓 **Master's Degree** — Information Security Management, International Islamic Academy of Uzbekistan (2021-2023)\n\n🎓 **Bachelor's Degree** — Computer Engineering, Tashkent University of Information Technologies (2016-2020)\n\nHis master's thesis focused on analyzing the educational process using artificial intelligence."
          },
          {
            keywords: ["research", "publication", "paper", "phd", "orcid", "article", "thesis", "scientific", "journal"],
            answer: "Oybek is active in academic research alongside his PhD track:\n\n🆔 **ORCID:** 0009-0003-2532-8918\n📄 Co-authored \"Technologies Used in the Development of AI Systems\" (2025)\n📄 Co-authored \"Systems Thinking in Engineering Analysis\" — published in an OAK-recognized journal (2026)\n💻 Holds an official software copyright certificate (DGU 34208) for an AI-based lesson-monitoring system\n\nSee the Research section on this page for full citations! 🔬"
          },
          {
            keywords: ["contact", "email", "phone", "reach", "hire", "message"],
            answer: "You can reach Oybek through:\n\n📧 **Email:** oybeksjob@gmail.com\n📱 **Phone:** +99895 055 88 69\n💬 **Telegram:** @smartslave — message him directly with one click on the Contact section!\n💼 **LinkedIn:** linkedin.com/in/oybekjohn\n🐙 **GitHub:** github.com/oybekjohn\n\nOr use the contact form on this page! 📩"
          },
          {
            keywords: ["project", "portfolio", "bot", "telegram bot", "automation", "built", "created", "library"],
            answer: "Oybek's key projects:\n\n🤖 **AI-Powered Agents & Automation** — Custom Telegram bots and backend systems for businesses\n📚 **DL-Library.uz** — Co-built digital library for Renessans University (35+ resources across IT, AI, Economics)\n🌐 **Renessans Education Platform** — Free open-access learning platform (renessans.gitbook.io)\n📡 **@data_analitiks** — First Data Analytics Telegram channel in Uzbekistan\n🏫 **muimi.uz** — School website for Mirzo Ulugbek Presidential School"
          },
          {
            keywords: ["award", "achievement", "certificate", "certification", "honor"],
            answer: "🏆 **Teacher of the Year** — 2024-2025 academic year\n🤖 **AI Mentor-Teacher Certificate** — Ministry of Higher Education, Science and Innovation\n🇬🇧 **EF SET English Certificate** — C1 Advanced (63/100)\n📜 **Letter of Appreciation** — University contribution 2023-2024\n🔵 **GDSC Lead Certification** — Google 2022-2023\n📊 **Tableau for Project Management** — Coursera\n🐍 **Python Certification** — HackerRank"
          },
          {
            keywords: ["teach", "teacher", "lecture", "mentor", "coaching", "training"],
            answer: "Oybek is a passionate educator! 📚\n\n• Taught Python, C++, AI and Data Analytics at university level\n• Founded AI Club at two institutions\n• Prepared students for olympiads (2 students won 2nd & 3rd place nationally)\n• Created open education platform: renessans.gitbook.io\n• Runs Uzbekistan's first Data Analytics Telegram channel"
          },
          {
            keywords: ["hobby", "interest", "free time", "fun"],
            answer: "In his free time, Oybek enjoys:\n\n♟️ Chess\n📖 Reading books\n🧩 Problem solving\n🤖 Working on AI projects\n📡 Creating educational content"
          },
          {
            keywords: ["language", "speak", "english", "russian", "uzbek", "arabic"],
            answer: "Oybek speaks:\n\n🇺🇿 **Uzbek** — Native\n🇬🇧 **English** — C1 Advanced (certified via EF SET, 63/100)\n🇷🇺 **Russian** — Good level"
          },
          {
            keywords: ["gdsc", "google", "club", "community", "developer student"],
            answer: "Oybek founded the first official Google Developer Student Club (GDSC) at the International Islamic Academy of Uzbekistan in 2022. He:\n\n• Built a community of 100+ active members\n• Organized seminars on AI, web dev, mobile dev, and cloud\n• Hosted hackathons and networking events\n• Directed talented youth toward IT careers"
          },
          {
            keywords: ["freelance", "hire", "available", "cost", "price", "rate"],
            answer: "Oybek is available for freelance work! He specializes in:\n\n🤖 AI-powered agents & Telegram bots\n⚙️ Automation systems\n🌐 Backend development (Django)\n📊 Data analytics solutions\n\nContact him at oybeksjob@gmail.com, via Telegram @smartslave, or the contact form below! 💼"
          },
          {
            keywords: ["hello", "hi", "hey", "good morning", "good evening", "salom", "privet"],
            answer: "Hello! 👋 Great to see you here! I'm Oybek's virtual assistant. Ask me anything about his skills, experience, projects, research, or how to get in touch!"
          }
        ]
      },
      uz: {
        greeting: "Salom! 👋 Men Oybekning AI yordamchisiman. Uning ko'nikmalari, tajribasi, loyihalari, ilmiy faoliyati va boshqalar haqida savol berishingiz mumkin. Nima bilmoqchisiz?",
        suggestions: ["Oybek kim?", "Texnologiyalari", "Loyihalari", "Ilmiy faoliyati", "Bog'lanish"],
        fallback: "Bu haqda aniq javob bera olmayman. Oybekning ko'nikmalari, tajribasi, loyihalari yoki ilmiy faoliyati haqida so'rang! 😊",
        entries: [
          {
            keywords: ["kim", "haqida", "oybek", "nima", "tanishtir"],
            answer: "Oybek Xushvaqtov — AI Automation Developer va Dasturlash O'qituvchisi, Toshkentda istiqomat qiladi. U AI asosidagi agentlar, Telegram botlar va avtomatlashtirish tizimlarini yaratadi. Bundan tashqari, u ilmiy faoliyat (PhD yo'nalishi) bilan ham shug'ullanadi — nashr qilingan maqolalari va ro'yxatdan o'tgan dasturiy patenti bor. 5+ yillik dasturlash va 3+ yillik o'qituvchilik tajribasiga ega. 🚀"
          },
          {
            keywords: ["skill", "texnologiya", "dasturlash", "til", "bilim", "stack"],
            answer: "Oybekning texnologiyalari:\n\n🐍 **Python** (asosiy)\n🧠 **Claude Code, Codex, Antigravity** — AI kod yozish vositalari\n✨ **Vibe coding va Prompt Engineering**\n🌐 **Django REST Framework**\n🤖 **Telegram Bot API**\n🐘 **PostgreSQL**\n📊 **Data Analytics** (Excel, SQL, Power BI)\n📋 **Loyiha boshqaruvi**\n🔧 **Git, Docker, Linux, AWS**"
          },
          {
            keywords: ["tajriba", "ish", "karera", "kasb"],
            answer: "Oybekning ish tajribasi:\n\n🏫 **Renessans Universiteti** — O'qituvchi (2023-2025)\n🎓 **Mirzo Ulug'bek maktabi** — O'qituvchi (2022-2023)\n🔵 **GDSC Lead** IIAU (2022-2023)\n💼 **Zamonaviy Kommunikatsiyalar** — Backend Dev (2021)\n🏢 **IT Park** — Web dasturchisi (2020)"
          },
          {
            keywords: ["talim", "universit", "maktab", "daraja", "magistr", "bakalavr"],
            answer: "🎓 **Magistratura** — Axborot xavfsizligi, O'zbekiston xalqaro islom akademiyasi (2021-2023)\n\n🎓 **Bakalavr** — Kompyuter injiniringi, TATU (2016-2020)"
          },
          {
            keywords: ["ilmiy", "maqola", "tadqiqot", "orcid", "phd", "tezis", "patent", "jurnal"],
            answer: "Oybek PhD yo'nalishida ilmiy faoliyat bilan ham shug'ullanadi:\n\n🆔 **ORCID:** 0009-0003-2532-8918\n📄 \"Technologies Used in the Development of AI Systems\" maqolasi hammuallifi (2025)\n📄 \"Systems Thinking in Engineering Analysis\" — OAK ro'yxatidagi jurnalda chop etilgan (2026)\n💻 AI asosidagi dars kuzatuv dasturi uchun rasmiy mualliflik guvohnomasi (DGU 34208)\n\nTo'liq ma'lumot uchun sahifadagi Ilmiy faoliyat bo'limini ko'ring! 🔬"
          },
          {
            keywords: ["aloqa", "email", "telefon", "boglanish", "yollash"],
            answer: "Oybek bilan bog'lanish:\n\n📧 oybeksjob@gmail.com\n📱 +99895 055 88 69\n💬 Telegram: @smartslave — Bog'lanish bo'limida bir tugma bilan to'g'ridan-to'g'ri yozing!\n💼 LinkedIn: /in/oybekjohn\n\nYoki sahifadagi kontakt formasidan foydalaning! 📩"
          },
          {
            keywords: ["loyiha", "portfolio", "bot", "dastur", "yaratgan", "kutubxona"],
            answer: "Oybekning asosiy loyihalari:\n\n🤖 **AI Agentlar va Avtomatlashtirish** — Bizneslar uchun Telegram botlar va backend tizimlar\n📚 **DL-Library.uz** — Renessans universiteti uchun hammuallif sifatida qurilgan raqamli kutubxona (35+ resurs)\n🌐 **Renessans Ta'lim Platformasi** — Bepul ochiq ta'lim platformasi (renessans.gitbook.io)\n📡 **@data_analitiks** — O'zbekistondagi birinchi Data Analitika Telegram kanali\n🏫 **muimi.uz** — Mirzo Ulug'bek maktabi uchun veb-sayt"
          },
          {
            keywords: ["yutuq", "sertifikat", "mukofot"],
            answer: "🏆 **Yilning eng yaxshi o'qituvchisi** — 2024-2025\n🤖 **AI Mentor-o'qituvchi sertifikati** — Oliy ta'lim, fan va innovatsiyalar vazirligi\n🇬🇧 **EF SET Ingliz tili sertifikati** — C1 Advanced (63/100)\n📜 **Tashakkurnoma** — 2023-2024\n🔵 **GDSC Lead Certification** — Google 2022-2023\n📊 **Tableau (Project Management)** — Coursera\n🐍 **Python Certification** — HackerRank"
          },
          {
            keywords: ["o'qituvchi", "oqituvchi", "dars", "murabbiy", "mentorlik"],
            answer: "Oybek — ishtiyoqli pedagog! 📚\n\n• Universitet darajasida Python, C++, AI va Data Analitikadan dars bergan\n• Ikki muassasada AI Club asos solgan\n• O'quvchilarni olimpiadalarga tayyorlagan (2 nafari respublika bosqichida 2- va 3-o'rin)\n• Ochiq ta'lim platformasi yaratgan: renessans.gitbook.io\n• O'zbekistondagi birinchi Data Analitika Telegram kanalini yuritadi"
          },
          {
            keywords: ["qiziqish", "hobbi", "bo'sh vaqt"],
            answer: "Bo'sh vaqtida Oybek:\n\n♟️ Shaxmat o'ynaydi\n📖 Kitob o'qiydi\n🧩 Muammolarni yechadi\n🤖 AI loyihalari ustida ishlaydi\n📡 Ta'lim kontenti yaratadi"
          },
          {
            keywords: ["til biladi", "ingliz tili", "rus tili", "arab tili", "qaysi tillarda"],
            answer: "Oybek bu tillarda so'zlashadi:\n\n🇺🇿 **O'zbek** — Ona tili\n🇬🇧 **Ingliz** — C1 Advanced (EF SET orqali sertifikatlangan, 63/100)\n🇷🇺 **Rus** — Yaxshi daraja"
          },
          {
            keywords: ["gdsc", "google", "klub", "hamjamiyat"],
            answer: "Oybek 2022-yilda O'zbekiston xalqaro islom akademiyasida birinchi rasmiy Google Developer Student Club (GDSC) klubiga asos solgan. U:\n\n• 100+ faol a'zoli hamjamiyat qurgan\n• AI, veb, mobil va bulutli texnologiyalar bo'yicha seminarlar tashkil qilgan\n• Hackatonlar va networking tadbirlarini o'tkazgan\n• Iqtidorli yoshlarni IT sohasiga yo'naltirgan"
          },
          {
            keywords: ["frilanser", "yollash", "narx", "bahosi", "ishga olish"],
            answer: "Oybek frilanser ish uchun mavjud! U quyidagilarga ixtisoslashgan:\n\n🤖 AI asosidagi agentlar va Telegram botlar\n⚙️ Avtomatlashtirish tizimlari\n🌐 Backend dasturlash (Django)\n📊 Data analitika yechimlari\n\noybeksjob@gmail.com yoki @smartslave orqali bog'laning! 💼"
          },
          {
            keywords: ["salom", "hey", "assalomu"],
            answer: "Salom! 👋 Oybekning virtual yordamchisiga xush kelibsiz! Ko'nikmalari, tajribasi, loyihalari yoki ilmiy faoliyati haqida savol bering!"
          }
        ]
      },
      ru: {
        greeting: "Привет! 👋 Я AI-помощник Ойбека. Могу ответить на вопросы о его навыках, опыте, проектах, научной деятельности и многом другом. Что вас интересует?",
        suggestions: ["Кто такой Ойбек?", "Навыки", "Проекты", "Научная деятельность", "Контакты"],
        fallback: "Не уверен насчёт этого. Попробуйте спросить о навыках, опыте, проектах или научной деятельности Ойбека! 😊",
        entries: [
          {
            keywords: ["кто", "оибек", "ойбек", "расскажи", "представ"],
            answer: "Ойбек Хушвактов — AI-разработчик и преподаватель программирования из Ташкента. Создаёт AI-агентов, Telegram-ботов и системы автоматизации. Помимо разработки, активно занимается научной деятельностью (PhD) — есть опубликованные статьи и зарегистрированный патент на ПО. Более 5 лет опыта в программировании и 3+ лет преподавания. 🚀"
          },
          {
            keywords: ["навык", "технолог", "стек", "програм", "язык", "умеет"],
            answer: "Технологии Ойбека:\n\n🐍 **Python** (основной)\n🧠 **Claude Code, Codex, Antigravity** — AI-инструменты для кода\n✨ **Vibe coding и Prompt Engineering**\n🌐 **Django REST**\n🤖 **Telegram Bot API**\n🐘 **PostgreSQL**\n📊 **Data Analytics** (Excel, SQL, Power BI)\n📋 **Управление проектами**\n🔧 **Git, Docker, Linux, AWS**"
          },
          {
            keywords: ["опыт", "работ", "карьер", "должност"],
            answer: "Карьера Ойбека:\n\n🏫 **Ренессанс** — Преподаватель (2023-2025)\n🎓 **Школа Мирзо Улугбека** — Учитель (2022-2023)\n🔵 **GDSC Lead** (2022-2023)\n💼 **ZK** — Backend Dev (2021)\n🏢 **IT Park** — Веб-разработчик (2020)"
          },
          {
            keywords: ["образован", "универс", "диплом", "учёб", "магистр", "бакалавр"],
            answer: "🎓 **Магистратура** — Управление инфобезопасностью, МIAU (2021-2023)\n🎓 **Бакалавриат** — Компьютерная инженерия, ТUIT (2016-2020)"
          },
          {
            keywords: ["наук", "публикац", "статья", "orcid", "phd", "патент", "журнал"],
            answer: "Ойбек также активен в научной деятельности по направлению PhD:\n\n🆔 **ORCID:** 0009-0003-2532-8918\n📄 Соавтор статьи \"Technologies Used in the Development of AI Systems\" (2025)\n📄 Соавтор статьи \"Системное мышление в анализе объектов инженерной техники\" — журнал из перечня ВАК (2026)\n💻 Официальное авторское свидетельство на ПО (DGU 34208) для системы мониторинга занятий на базе ИИ\n\nПодробности — в разделе «Научная деятельность» на странице! 🔬"
          },
          {
            keywords: ["контакт", "связ", "email", "телефон", "написать"],
            answer: "Связаться с Ойбеком:\n\n📧 oybeksjob@gmail.com\n📱 +99895 055 88 69\n💬 Telegram: @smartslave — напишите напрямую одним нажатием в разделе «Контакты»!\n💼 LinkedIn: /in/oybekjohn\n\nИли используйте форму ниже! 📩"
          },
          {
            keywords: ["проект", "портфолио", "бот", "создал", "библиотек"],
            answer: "Ключевые проекты Ойбека:\n\n🤖 **AI-агенты и автоматизация** — Telegram-боты и backend-системы для бизнеса\n📚 **DL-Library.uz** — соразработанная цифровая библиотека для университета Ренессанс (35+ материалов)\n🌐 **Образовательная платформа Renessans** — бесплатная открытая платформа (renessans.gitbook.io)\n📡 **@data_analitiks** — первый канал по анализу данных в Узбекистане\n🏫 **muimi.uz** — сайт школы имени Мирзо Улугбека"
          },
          {
            keywords: ["достижен", "сертификат", "награда"],
            answer: "🏆 **Лучший преподаватель года** — 2024-2025\n🤖 **Сертификат ментора по ИИ** — Министерство высшего образования\n🇬🇧 **Сертификат EF SET** — C1 Advanced (63/100)\n📜 **Благодарность** — 2023-2024\n🔵 **GDSC Lead Certification** — Google 2022-2023\n📊 **Tableau (Project Management)** — Coursera\n🐍 **Сертификат Python** — HackerRank"
          },
          {
            keywords: ["преподава", "учитель", "наставник"],
            answer: "Ойбек — увлечённый педагог! 📚\n\n• Преподавал Python, C++, ИИ и анализ данных на университетском уровне\n• Основал AI Club в двух учреждениях\n• Готовил учеников к олимпиадам (2 ученика заняли 2-е и 3-е место на республиканском уровне)\n• Создал открытую образовательную платформу: renessans.gitbook.io\n• Ведёт первый в Узбекистане канал по анализу данных"
          },
          {
            keywords: ["хобби", "интерес", "свободн"],
            answer: "В свободное время Ойбек:\n\n♟️ Играет в шахматы\n📖 Читает книги\n🧩 Решает задачи\n🤖 Работает над AI-проектами\n📡 Создаёт образовательный контент"
          },
          {
            keywords: ["английск", "русск язык", "узбек язык", "арабск", "на каком языке"],
            answer: "Ойбек говорит на:\n\n🇺🇿 **Узбекский** — родной\n🇬🇧 **Английский** — C1 Advanced (сертифицировано через EF SET, 63/100)\n🇷🇺 **Русский** — хороший уровень"
          },
          {
            keywords: ["gdsc", "google", "клуб", "сообщест"],
            answer: "В 2022 году Ойбек основал первый официальный клуб Google Developer Student Club (GDSC) в Международной исламской академии Узбекистана. Он:\n\n• Построил сообщество из 100+ активных участников\n• Организовал семинары по ИИ, веб-разработке, мобильной разработке и облачным технологиям\n• Провёл хакатоны и networking-мероприятия\n• Направлял талантливую молодёжь в сферу IT"
          },
          {
            keywords: ["фриланс", "нанять", "стоимост", "цена"],
            answer: "Ойбек доступен для фриланс-работы! Специализируется на:\n\n🤖 AI-агентах и Telegram-ботах\n⚙️ Системах автоматизации\n🌐 Backend-разработке (Django)\n📊 Решениях по анализу данных\n\nСвяжитесь через oybeksjob@gmail.com или @smartslave! 💼"
          },
          {
            keywords: ["привет", "здравс", "добр"],
            answer: "Привет! 👋 Добро пожаловать! Задайте вопрос о навыках, опыте, проектах или научной деятельности Ойбека!"
          }
        ]
      },
      ar: {
        greeting: "مرحباً! 👋 أنا مساعد أويبك الذكي. يمكنني الإجابة عن مهاراته وخبراته ومشاريعه ونشاطه العلمي وأكثر. ماذا تريد أن تعرف؟",
        suggestions: ["من هو أويبك؟", "المهارات", "المشاريع", "النشاط العلمي", "التواصل"],
        fallback: "لست متأكداً من ذلك. حاول السؤال عن مهارات أويبك أو خبرته أو مشاريعه أو نشاطه العلمي! 😊",
        entries: [
          {
            keywords: ["من", "أويبك", "تعريف", "نبذة"],
            answer: "أويبك خوشفقتوف — مطور أتمتة ذكاء اصطناعي ومعلم برمجة من طشقند. يبني وكلاء ذكاء اصطناعي وبوتات تلجرام وأنظمة أتمتة. كما ينشط في البحث العلمي (مسار الدكتوراه) وله أبحاث منشورة وبراءة اختراع برمجية مسجلة. لديه 5+ سنوات خبرة في البرمجة و3+ سنوات في التدريس. 🚀"
          },
          {
            keywords: ["مهار", "تقن", "برمج", "لغ"],
            answer: "تقنيات أويبك:\n\n🐍 **Python** (الأساسية)\n🧠 **Claude Code وCodex وAntigravity** — أدوات برمجة بالذكاء الاصطناعي\n✨ **Vibe coding وهندسة الأوامر**\n🌐 **Django REST**\n🤖 **Telegram Bot API**\n🐘 **PostgreSQL**\n📊 **تحليل البيانات** (Excel وSQL وPower BI)\n📋 **إدارة المشاريع**\n🔧 **Git وDocker وLinux وAWS**"
          },
          {
            keywords: ["خبر", "عمل", "وظيف"],
            answer: "مسيرة أويبك المهنية:\n\n🏫 **جامعة رينيسانس** — محاضر (2023-2025)\n🎓 **مدرسة ميرزا أولوغبك** — معلم (2022-2023)\n🔵 **قائد GDSC** (2022-2023)\n💼 **ZK** — مطور Backend (2021)"
          },
          {
            keywords: ["تعليم", "جامعة", "شهادة دراسية", "دراسة", "أكاديمي"],
            answer: "🎓 **الماجستير** — إدارة أمن المعلومات، الأكاديمية الإسلامية الدولية في أوزبكستان (2021-2023)\n\n🎓 **البكالوريوس** — هندسة الحاسوب، جامعة طشقند لتكنولوجيا المعلومات (2016-2020)\n\nركزت رسالة الماجستير على تحليل العملية التعليمية باستخدام الذكاء الاصطناعي."
          },
          {
            keywords: ["بحث", "منشور", "مقال", "orcid", "دكتوراه", "براءة"],
            answer: "ينشط أويبك أيضاً في البحث العلمي ضمن مسار الدكتوراه:\n\n🆔 **ORCID:** 0009-0003-2532-8918\n📄 شارك في تأليف \"Technologies Used in the Development of AI Systems\" (2025)\n📄 شارك في تأليف \"التفكير المنهجي في تحليل الهندسة\" — منشور في مجلة ضمن قائمة OAK (2026)\n💻 يحمل شهادة حقوق برمجية رسمية (DGU 34208) لنظام مراقبة الدروس بالذكاء الاصطناعي\n\nالتفاصيل الكاملة في قسم «النشاط العلمي» بالصفحة! 🔬"
          },
          {
            keywords: ["تواصل", "بريد", "هاتف", "اتصال"],
            answer: "للتواصل مع أويبك:\n\n📧 oybeksjob@gmail.com\n📱 +99895 055 88 69\n💬 تلجرام: @smartslave — راسله مباشرة بضغطة واحدة في قسم التواصل!\n\nأو استخدم نموذج الاتصال أدناه! 📩"
          },
          {
            keywords: ["مشروع", "بوت", "أنشأ", "بنى", "مكتبة"],
            answer: "أهم مشاريع أويبك:\n\n🤖 **وكلاء ذكاء اصطناعي وأتمتة** — بوتات تلجرام وأنظمة خلفية للشركات\n📚 **DL-Library.uz** — مكتبة رقمية شارك في بنائها لجامعة رينيسانس (أكثر من 35 مصدراً)\n🌐 **منصة رينيسانس التعليمية** — منصة تعليمية مجانية مفتوحة (renessans.gitbook.io)\n📡 **@data_analitiks** — أول قناة لتحليل البيانات في أوزبكستان\n🏫 **muimi.uz** — موقع مدرسة ميرزا أولوغبك"
          },
          {
            keywords: ["إنجاز", "شهادة تقدير", "جائزة"],
            answer: "🏆 **أفضل معلم لهذا العام** — 2024-2025\n🤖 **شهادة موجه في الذكاء الاصطناعي** — وزارة التعليم العالي\n🇬🇧 **شهادة EF SET** — C1 Advanced (63/100)\n📜 **شهادة تقدير** — 2023-2024\n🔵 **شهادة قيادة GDSC** — Google 2022-2023\n📊 **Tableau لإدارة المشاريع** — Coursera\n🐍 **شهادة Python** — HackerRank"
          },
          {
            keywords: ["تدريس", "معلم", "مرشد"],
            answer: "أويبك معلم شغوف! 📚\n\n• درّس Python وC++ والذكاء الاصطناعي وتحليل البيانات على المستوى الجامعي\n• أسس نادي الذكاء الاصطناعي في مؤسستين\n• حضّر الطلاب للأولمبياد (فاز طالبان بالمركزين الثاني والثالث على المستوى الوطني)\n• أنشأ منصة تعليمية مفتوحة: renessans.gitbook.io\n• يدير أول قناة لتحليل البيانات في أوزبكستان"
          },
          {
            keywords: ["هواي", "اهتمام", "وقت فراغ"],
            answer: "في وقت فراغه، يستمتع أويبك بـ:\n\n♟️ الشطرنج\n📖 قراءة الكتب\n🧩 حل المشكلات\n🤖 العمل على مشاريع الذكاء الاصطناعي\n📡 إنشاء محتوى تعليمي"
          },
          {
            keywords: ["لغة يتحدث", "الإنجليزية", "الروسية", "الأوزبكية", "العربية يتقن"],
            answer: "يتحدث أويبك:\n\n🇺🇿 **الأوزبكية** — اللغة الأم\n🇬🇧 **الإنجليزية** — C1 Advanced (معتمدة عبر EF SET، 63/100)\n🇷🇺 **الروسية** — مستوى جيد"
          },
          {
            keywords: ["gdsc", "google", "نادي", "مجتمع"],
            answer: "أسس أويبك أول نادٍ رسمي لـ Google Developer Student Club (GDSC) في الأكاديمية الإسلامية الدولية في أوزبكستان عام 2022. قام بـ:\n\n• بناء مجتمع من أكثر من 100 عضو نشط\n• تنظيم ندوات في الذكاء الاصطناعي وتطوير الويب والتطبيقات والحوسبة السحابية\n• استضافة هاكاثونات وفعاليات تواصل مهني\n• توجيه الشباب الموهوب نحو مجال تكنولوجيا المعلومات"
          },
          {
            keywords: ["عمل حر", "توظيف", "سعر", "تكلفة"],
            answer: "أويبك متاح للعمل الحر! يتخصص في:\n\n🤖 وكلاء الذكاء الاصطناعي وبوتات تلجرام\n⚙️ أنظمة الأتمتة\n🌐 تطوير Backend (Django)\n📊 حلول تحليل البيانات\n\nتواصل عبر oybeksjob@gmail.com أو @smartslave! 💼"
          },
          {
            keywords: ["مرحب", "سلام", "أهلا"],
            answer: "مرحباً! 👋 مرحباً بك! اسأل عن مهارات أويبك أو خبرته أو مشاريعه أو نشاطه العلمي!"
          }
        ]
      }
    };
    return kb[lang] || kb.en;
  }

  // ---- Chat Logic ----
  function findAnswer(question, lang) {
    const kb = getKnowledge(lang);
    const q = question.toLowerCase();
    let bestMatch = null;
    let bestScore = 0;

    for (const entry of kb.entries) {
      let score = 0;
      for (const kw of entry.keywords) {
        if (q.includes(kw.toLowerCase())) {
          score += kw.length; // longer keyword matches score higher
        }
      }
      if (score > bestScore) {
        bestScore = score;
        bestMatch = entry;
      }
    }

    return bestMatch ? bestMatch.answer : kb.fallback;
  }

  function addMessage(text, type) {
    const msg = document.createElement('div');
    msg.className = `chat-msg chat-msg--${type}`;
    // Support **bold** markdown
    const formatted = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>');
    msg.innerHTML = formatted;
    messagesEl.appendChild(msg);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function showTyping() {
    const typing = document.createElement('div');
    typing.className = 'typing-indicator';
    typing.id = 'typingIndicator';
    typing.innerHTML = '<span></span><span></span><span></span>';
    messagesEl.appendChild(typing);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function hideTyping() {
    const typing = document.getElementById('typingIndicator');
    if (typing) typing.remove();
  }

  function showSuggestions(lang) {
    const kb = getKnowledge(lang);
    suggestionsEl.innerHTML = '';
    kb.suggestions.forEach(text => {
      const btn = document.createElement('button');
      btn.className = 'chat-suggestion';
      btn.textContent = text;
      btn.addEventListener('click', () => {
        handleUserMessage(text);
      });
      suggestionsEl.appendChild(btn);
    });
  }

  function handleUserMessage(text) {
    if (!text.trim()) return;
    addMessage(text, 'user');
    inputEl.value = '';
    suggestionsEl.innerHTML = '';

    // Simulate typing delay
    showTyping();
    const delay = 600 + Math.random() * 800;
    setTimeout(() => {
      hideTyping();
      const lang = document.documentElement.lang || 'en';
      const answer = findAnswer(text, lang);
      addMessage(answer, 'bot');
      // Show suggestions again after answer
      setTimeout(() => showSuggestions(lang), 300);
    }, delay);
  }

  // ---- Toggle Chat Window ----
  toggle.addEventListener('click', () => {
    isOpen = !isOpen;
    toggle.classList.toggle('active', isOpen);
    chatWindow.classList.toggle('open', isOpen);

    if (isOpen && !hasGreeted) {
      hasGreeted = true;
      const lang = document.documentElement.lang || 'en';
      const kb = getKnowledge(lang);
      setTimeout(() => {
        addMessage(kb.greeting, 'bot');
        showSuggestions(lang);
      }, 500);
    }

    if (isOpen) {
      setTimeout(() => inputEl.focus(), 400);
    }
  });

  // ---- Send Message ----
  sendBtn.addEventListener('click', () => {
    handleUserMessage(inputEl.value);
  });

  inputEl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleUserMessage(inputEl.value);
    }
  });

  // ---- Language Change Handler ----
  window.addEventListener('languageChanged', (e) => {
    if (hasGreeted) {
      messagesEl.innerHTML = '';
      hasGreeted = false;
      if (isOpen) {
        hasGreeted = true;
        const lang = e.detail.lang;
        const kb = getKnowledge(lang);
        addMessage(kb.greeting, 'bot');
        showSuggestions(lang);
      }
    }
  });

})();
