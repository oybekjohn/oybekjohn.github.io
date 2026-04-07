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
        greeting: "Hi! 👋 I'm Oybek's AI assistant. I can answer questions about his skills, experience, projects, and more. What would you like to know?",
        suggestions: ["What does Oybek do?", "Skills & tech stack", "Experience", "How to contact?", "Education"],
        fallback: "I'm not sure about that. Try asking about Oybek's skills, experience, education, or projects! 😊",
        entries: [
          {
            keywords: ["who", "about", "introduction", "oybek", "what does", "tell me"],
            answer: "Oybek Xushvaqtov is an AI Automation Developer and Programming Teacher based in Tashkent, Uzbekistan. He builds AI-powered Telegram bots and automation systems that save time and increase efficiency. He has 5+ years of programming experience and 3+ years of teaching experience. 🚀"
          },
          {
            keywords: ["skill", "tech", "stack", "programming", "language", "tools", "technology"],
            answer: "Oybek's tech stack includes:\n\n🐍 **Python** (main language)\n⚡ **C++** (algorithms)\n🤖 **Telegram Bot API**\n🌐 **Django REST Framework**\n📊 **Data Analytics** (Pandas, SQL)\n🐘 **PostgreSQL**\n🐳 **Docker**\n☁️ **AWS**\n🔧 **Git, Linux, Nginx**\n📈 **Power BI, Excel**"
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
            keywords: ["contact", "email", "phone", "reach", "hire", "message"],
            answer: "You can reach Oybek through:\n\n📧 **Email:** oybeksjob@gmail.com\n📱 **Phone:** +99895 055 88 69\n💬 **Telegram:** @smartslave\n💼 **LinkedIn:** linkedin.com/in/oybekjohn\n🐙 **GitHub:** github.com/oybekjohn\n\nOr use the contact form on this page! 📩"
          },
          {
            keywords: ["project", "portfolio", "bot", "telegram bot", "automation", "built", "created"],
            answer: "Oybek specializes in:\n\n🤖 **AI-powered Telegram Bots** — Custom bots for businesses\n⚙️ **Automation Systems** — Workflow automation\n🌐 **Web Development** — Full-stack Django projects\n📊 **Data Analytics** — Dashboards and reporting\n📚 **Education Platform** — renessans.gitbook.io\n📡 **@data_analitiks** — First data analytics Telegram channel in Uzbekistan"
          },
          {
            keywords: ["award", "achievement", "certificate", "certification", "honor"],
            answer: "🏆 **Teacher of the Year** — 2024-2025 academic year\n📜 **Letter of Appreciation** — University contribution 2023-2024\n🔵 **GDSC Lead Certification** — Google 2022-2023\n📊 **Tableau for Project Management** — Coursera\n🐍 **Python Certification** — HackerRank"
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
            answer: "Oybek speaks:\n\n🇺🇿 **Uzbek** — Native\n🇬🇧 **English** — B2 (Upper-Intermediate)\n🇷🇺 **Russian** — Good level"
          },
          {
            keywords: ["gdsc", "google", "club", "community", "developer student"],
            answer: "Oybek founded the first official Google Developer Student Club (GDSC) at the International Islamic Academy of Uzbekistan in 2022. He:\n\n• Built a community of 100+ active members\n• Organized seminars on AI, web dev, mobile dev, and cloud\n• Hosted hackathons and networking events\n• Directed talented youth toward IT careers"
          },
          {
            keywords: ["freelance", "hire", "available", "cost", "price", "rate"],
            answer: "Oybek is available for freelance work! He specializes in:\n\n🤖 AI-powered Telegram bots\n⚙️ Automation systems\n🌐 Backend development (Django)\n📊 Data analytics solutions\n\nContact him at oybeksjob@gmail.com or via the contact form below! 💼"
          },
          {
            keywords: ["hello", "hi", "hey", "good morning", "good evening", "salom", "privet"],
            answer: "Hello! 👋 Great to see you here! I'm Oybek's virtual assistant. Ask me anything about his skills, experience, projects, or how to get in touch!"
          }
        ]
      },
      uz: {
        greeting: "Salom! 👋 Men Oybekning AI yordamchisiman. Uning ko'nikmalari, tajribasi, loyihalari haqida savol berishingiz mumkin. Nima bilmoqchisiz?",
        suggestions: ["Oybek kim?", "Texnologiyalari", "Ish tajribasi", "Bog'lanish", "Ta'lim"],
        fallback: "Bu haqda aniq javob bera olmayman. Oybekning ko'nikmalari, tajribasi yoki loyihalari haqida so'rang! 😊",
        entries: [
          {
            keywords: ["kim", "haqida", "oybek", "nima", "tanishtir"],
            answer: "Oybek Xushvaqtov — AI Automation Developer va Dasturlash O'qituvchisi, Toshkentda istiqomat qiladi. U AI asosidagi Telegram botlar va avtomatlashtirish tizimlarini yaratadi. 5+ yillik dasturlash va 3+ yillik o'qituvchilik tajribasiga ega. 🚀"
          },
          {
            keywords: ["skill", "texnologiya", "dasturlash", "til", "bilim", "stack"],
            answer: "Oybekning texnologiyalari:\n\n🐍 **Python** (asosiy)\n⚡ **C++** (algoritmlar)\n🤖 **Telegram Bot API**\n🌐 **Django REST Framework**\n📊 **Data Analytics**\n🐘 **PostgreSQL**\n🐳 **Docker**\n☁️ **AWS**\n🔧 **Git, Linux, Nginx**"
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
            keywords: ["aloqa", "email", "telefon", "boglanish", "yollash"],
            answer: "Oybek bilan bog'lanish:\n\n📧 oybeksjob@gmail.com\n📱 +99895 055 88 69\n💬 Telegram: @smartslave\n💼 LinkedIn: /in/oybekjohn\n\nYoki sahifadagi kontakt formasidan foydalaning! 📩"
          },
          {
            keywords: ["salom", "hey", "assalomu"],
            answer: "Salom! 👋 Oybekning virtual yordamchisiga xush kelibsiz! Ko'nikmalari, tajribasi yoki loyihalari haqida savol bering!"
          }
        ]
      },
      ru: {
        greeting: "Привет! 👋 Я AI-помощник Ойбека. Могу ответить на вопросы о его навыках, опыте и проектах. Что вас интересует?",
        suggestions: ["Кто такой Ойбек?", "Навыки", "Опыт работы", "Контакты", "Образование"],
        fallback: "Не уверен насчёт этого. Попробуйте спросить о навыках, опыте или проектах Ойбека! 😊",
        entries: [
          {
            keywords: ["кто", "оибек", "ойбек", "расскажи", "представ"],
            answer: "Ойбек Хушвактов — AI-разработчик и преподаватель программирования из Ташкента. Создаёт AI-ботов в Telegram и системы автоматизации. Более 5 лет опыта в программировании и 3+ лет преподавания. 🚀"
          },
          {
            keywords: ["навык", "технолог", "стек", "програм", "язык", "умеет"],
            answer: "Технологии Ойбека:\n\n🐍 **Python** (основной)\n⚡ **C++**\n🤖 **Telegram Bot API**\n🌐 **Django REST**\n📊 **Data Analytics**\n🐘 **PostgreSQL**\n🐳 **Docker**\n☁️ **AWS**"
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
            keywords: ["контакт", "связ", "email", "телефон", "написать"],
            answer: "Связаться с Ойбеком:\n\n📧 oybeksjob@gmail.com\n📱 +99895 055 88 69\n💬 Telegram: @smartslave\n💼 LinkedIn: /in/oybekjohn\n\nИли используйте форму ниже! 📩"
          },
          {
            keywords: ["привет", "здравс", "добр"],
            answer: "Привет! 👋 Добро пожаловать! Задайте вопрос о навыках, опыте или проектах Ойбека!"
          }
        ]
      },
      ar: {
        greeting: "مرحباً! 👋 أنا مساعد أويبك الذكي. يمكنني الإجابة عن مهاراته وخبراته ومشاريعه. ماذا تريد أن تعرف؟",
        suggestions: ["من هو أويبك؟", "المهارات", "الخبرة", "التواصل", "التعليم"],
        fallback: "لست متأكداً من ذلك. حاول السؤال عن مهارات أويبك أو خبرته أو مشاريعه! 😊",
        entries: [
          {
            keywords: ["من", "أويبك", "تعريف", "نبذة"],
            answer: "أويبك خوشفقتوف — مطور أتمتة ذكاء اصطناعي ومعلم برمجة من طشقند. يبني بوتات تلجرام ذكية وأنظمة أتمتة. لديه 5+ سنوات خبرة في البرمجة و3+ سنوات في التدريس. 🚀"
          },
          {
            keywords: ["مهار", "تقن", "برمج", "لغ"],
            answer: "تقنيات أويبك:\n\n🐍 **Python**\n⚡ **C++**\n🤖 **Telegram Bot API**\n🌐 **Django REST**\n📊 **Data Analytics**\n🐘 **PostgreSQL**\n🐳 **Docker**\n☁️ **AWS**"
          },
          {
            keywords: ["خبر", "عمل", "وظيف"],
            answer: "مسيرة أويبك المهنية:\n\n🏫 **جامعة رينيسانس** — محاضر (2023-2025)\n🎓 **مدرسة ميرزا أولوغبك** — معلم (2022-2023)\n🔵 **قائد GDSC** (2022-2023)\n💼 **ZK** — مطور Backend (2021)"
          },
          {
            keywords: ["تواصل", "بريد", "هاتف", "اتصال"],
            answer: "للتواصل مع أويبك:\n\n📧 oybeksjob@gmail.com\n📱 +99895 055 88 69\n💬 تلجرام: @smartslave\n\nأو استخدم نموذج الاتصال أدناه! 📩"
          },
          {
            keywords: ["مرحب", "سلام", "أهلا"],
            answer: "مرحباً! 👋 مرحباً بك! اسأل عن مهارات أويبك أو خبرته أو مشاريعه!"
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
