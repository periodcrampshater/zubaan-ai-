/**
 * Zubaan AI — Unified AI Assistant
 * Full multilingual support: English, Urdu, Roman Urdu, Punjabi, Sindhi, Pashto.
 */
(() => {
  "use strict";

  if (window.__zubaanApp) return;
  window.__zubaanApp = true;

  /* =====================================
     CONFIG
  ===================================== */
  const CONFIG = {
    API_URL: "/.netlify/functions/chat",
    API_TIMEOUT: 30000,
    TOAST_DURATION: 3500,
    MAX_MESSAGE_LENGTH: 4000,
    MAX_FILE_SIZE: 25 * 1024 * 1024,
    MAX_PDF_PAGES: 50
  };

  const STORAGE = {
    data: "zubaan.data.v2",
    language: "zubaan.lang",
    largeText: "zubaan.largeText"
  };

  const LANGUAGES = {
    roman: { name: "Roman Urdu", speech: "ur-PK", direction: "ltr", code: "roman" },
    ur:    { name: "Urdu",       speech: "ur-PK", direction: "rtl", code: "ur" },
    en:    { name: "English",    speech: "en-US", direction: "ltr", code: "en" },
    pa:    { name: "Punjabi",    speech: "pa-Arab-PK", direction: "rtl", code: "pa" },
    sd:    { name: "Sindhi",     speech: "sd-PK", direction: "rtl", code: "sd" },
    ps:    { name: "Pashto",     speech: "ps-AF", direction: "rtl", code: "ps" }
  };

  /* =====================================
     STATE
  ===================================== */
  const state = {
    lang: "roman",
    currentId: null,
    largeText: false,
    conversations: [],
    attachment: null,
    pending: new Set()
  };

  /* =====================================
     HELPERS
  ===================================== */
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  const uid = () =>
    Date.now().toString(36) + Math.random().toString(36).slice(2, 9);

  const escapeHTML = value =>
    String(value ?? "").replace(/[&<>"']/g, character => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;",
      '"': "&quot;", "'": "&#39;"
    })[character]);

  function element(tag, attributes = {}, ...children) {
    const node = document.createElement(tag);

    Object.entries(attributes).forEach(([key, value]) => {
      if (value === null || value === undefined || value === false) return;

      if (key === "text") {
        node.textContent = value;
      } else if (key === "class") {
        node.className = value;
      } else if (key === "dataset") {
        Object.entries(value).forEach(([name, val]) => {
          node.dataset[name] = val;
        });
      } else if (key === "style") {
        node.setAttribute("style", value);
      } else if (key in node) {
        node[key] = value;
      } else {
        node.setAttribute(key, value);
      }
    });

    children.flat().forEach(child => {
      if (child === null || child === undefined || child === false) return;
      node.append(child.nodeType ? child : document.createTextNode(String(child)));
    });

    return node;
  }

  /* =====================================
     DICTIONARIES — EVERY UI STRING
  ===================================== */
  const TEXT = {
    en: {
      appName: "Zubaan AI",
      newChat: "New chat",
      recent: "RECENT CHATS",
      clear: "Clear",
      language: "LANGUAGE",
      largerText: "Larger text",
      about: "About Zubaan AI",
      aboutTitle: "About Zubaan AI",
      aboutText1: "Zubaan AI is an AI assistant designed to make learning, everyday tasks and daily life easier.",
      aboutText2: "Project of Islah Foundation.",
      welcome: "How can I help you today?",
      welcomeIntro: "Ask anything. Get clear answers in the language you understand.",
      welcomeEyebrow: "YOUR EVERYDAY ASSISTANT",
      placeholder: "Ask anything...",
      hint: "Press Enter to send",
      send: "Send",
      disclaimer: "AI can make mistakes. Please verify important information.",
      footerLeft: "Project of Islah Foundation",
      footerRight: "Pakistan Zinda Baad 💚",
      thinking: "Thinking...",
      emptyHistory: "Your conversations will appear here.",
      online: "Online",
      ready: "Ready to help",
      listening: "Listening...",
      errOffline: "You appear to be offline.",
      errRequest: "Something went wrong. Please try again.",
      errTimeout: "The request took too long. Please try again.",
      errInvalid: "The AI response could not be read.",
      errEmpty: "Please type a message first.",
      errVoice: "Voice input is not supported in this browser.",
      errVoiceFail: "Voice input failed. Please try again.",
      toastLang: "Language updated",
      toastNew: "New chat started",
      toastCleared: "History cleared",
      toastDeleted: "Deleted",
      toastStorage: "Could not save data on this device.",
      toastOnline: "Internet connection restored.",
      confirmHistory: "Delete all conversations?",
      confirmDelete: "Delete this conversation?",
      copy: "Copy",
      copied: "Copied",
      regenerate: "Regenerate",
      attach: "Attach PDF or TXT",
      removeAttachment: "Remove attachment",
      attachmentTooLarge: "File is too large. Maximum size is 25 MB.",
      attachmentType: "Only PDF and TXT files are supported.",
      attachmentEmpty: "No readable text found in this file.",
      attachmentScanned: "This PDF appears to be scanned. Text extraction is not available.",
      attachmentReady: "File attached",
      attachmentProcessing: "Reading file...",
      attachmentFailed: "Could not read this file.",
      delete: "Delete",
      openMenu: "Open menu",
      closeSidebar: "Close sidebar",
      aiLabel: "Zubaan AI",
      youLabel: "You",
      rateLimit: "AI usage limit reached. Please try again later."
    },

    roman: {
      appName: "Zubaan AI",
      newChat: "Nayi guftagu",
      recent: "HALIYA GUFTAGU",
      clear: "Saaf karein",
      language: "ZUBAAN",
      largerText: "Bara text",
      about: "Zubaan AI ke bare mein",
      aboutTitle: "Zubaan AI ke bare mein",
      aboutText1: "Zubaan AI ek AI madadgar hai jo seekhne, rozmarra ke kaam aur zindagi ko asaan banata hai.",
      aboutText2: "Islah Foundation ka project.",
      welcome: "Aaj main aap ki kya madad karoon?",
      welcomeIntro: "Kuch bhi poochein. Apni samajh ki zubaan mein wazeh jawab payein.",
      welcomeEyebrow: "AAP KA ROZMARRA MADADGAR",
      placeholder: "Kuch bhi poochein...",
      hint: "Enter dabayein bhejne ke liye",
      send: "Bhejein",
      disclaimer: "Zubaan AI se ghalti ho sakti hai. Aham maloomat ki tasdeeq karein.",
      footerLeft: "Islah Foundation ka project",
      footerRight: "Pakistan Zinda Baad 💚",
      thinking: "Soch raha hoon...",
      emptyHistory: "Aap ki guftagu yahan nazar aayegi.",
      online: "Online",
      ready: "Madad ke liye tayyar",
      listening: "Sun raha hoon...",
      errOffline: "Aap offline lagte hain.",
      errRequest: "Kuch ghalat ho gaya. Dobara koshish karein.",
      errTimeout: "Request mein bohat waqt lag gaya.",
      errInvalid: "AI ka jawab parha nahi ja saka.",
      errEmpty: "Pehle paigham likhein.",
      errVoice: "Is browser mein voice input available nahi.",
      errVoiceFail: "Voice input nakaam hua.",
      toastLang: "Zubaan tabdeel ho gayi",
      toastNew: "Nayi guftagu shuru",
      toastCleared: "History saaf ho gayi",
      toastDeleted: "Delete ho gaya",
      toastStorage: "Data device par save nahi ho saka.",
      toastOnline: "Internet connection wapas aa gaya.",
      confirmHistory: "Kya tamam guftagu delete karein?",
      confirmDelete: "Kya is guftagu ko delete karein?",
      copy: "Copy",
      copied: "Copy ho gaya",
      regenerate: "Dobara banayein",
      attach: "PDF ya TXT attach karein",
      removeAttachment: "Attachment hataayein",
      attachmentTooLarge: "File bohat bari hai. Maximum 25 MB.",
      attachmentType: "Sirf PDF aur TXT files support hain.",
      attachmentEmpty: "Is file mein parhne ke qabil text nahi mila.",
      attachmentScanned: "Yeh PDF scanned lagti hai. Text extraction available nahi.",
      attachmentReady: "File attach ho gayi",
      attachmentProcessing: "File parh raha hoon...",
      attachmentFailed: "Yeh file parhi nahi ja saki.",
      delete: "Delete",
      openMenu: "Menu kholein",
      closeSidebar: "Sidebar band karein",
      aiLabel: "Zubaan AI",
      youLabel: "Aap",
      rateLimit: "AI usage limit khatam ho gayi. Baad mein koshish karein."
    },

    ur: {
      appName: "زبان اے آئی",
      newChat: "نئی گفتگو",
      recent: "حالیہ گفتگو",
      clear: "صاف کریں",
      language: "زبان",
      largerText: "بڑا متن",
      about: "زبان اے آئی کے بارے میں",
      aboutTitle: "زبان اے آئی کے بارے میں",
      aboutText1: "زبان اے آئی ایک مددگار ہے جو سیکھنے، روزمرہ کاموں اور زندگی کو آسان بناتا ہے۔",
      aboutText2: "اصلاح فاؤنڈیشن کا منصوبہ۔",
      welcome: "آج میں آپ کی کیا مدد کروں؟",
      welcomeIntro: "کچھ بھی پوچھیں۔ اپنی سمجھ کی زبان میں واضح جواب پائیں۔",
      welcomeEyebrow: "آپ کا روزمرہ مددگار",
      placeholder: "کچھ بھی پوچھیں...",
      hint: "بھیجنے کے لیے Enter دبائیں",
      send: "بھیجیں",
      disclaimer: "زبان اے آئی سے غلطی ہو سکتی ہے۔ اہم معلومات کی تصدیق کریں۔",
      footerLeft: "اصلاح فاؤنڈیشن کا منصوبہ",
      footerRight: "پاکستان زندہ باد 💚",
      thinking: "سوچ رہا ہوں...",
      emptyHistory: "آپ کی گفتگو یہاں نظر آئے گی۔",
      online: "آن لائن",
      ready: "مدد کے لیے تیار",
      listening: "سن رہا ہوں...",
      errOffline: "آپ آف لائن لگتے ہیں۔",
      errRequest: "کچھ غلط ہو گیا۔ دوبارہ کوشش کریں۔",
      errTimeout: "درخواست میں بہت وقت لگ گیا۔",
      errInvalid: "اے آئی کا جواب پڑھا نہیں جا سکا۔",
      errEmpty: "پہلے پیغام لکھیں۔",
      errVoice: "اس براؤزر میں آواز سے ان پٹ دستیاب نہیں۔",
      errVoiceFail: "آواز کا ان پٹ ناکام ہوا۔",
      toastLang: "زبان تبدیل ہو گئی",
      toastNew: "نئی گفتگو شروع",
      toastCleared: "تاریخ صاف ہو گئی",
      toastDeleted: "حذف ہو گیا",
      toastStorage: "ڈیٹا محفوظ نہیں ہو سکا۔",
      toastOnline: "انٹرنیٹ کنکشن واپس آ گیا۔",
      confirmHistory: "کیا تمام گفتگو حذف کریں؟",
      confirmDelete: "کیا اس گفتگو کو حذف کریں؟",
      copy: "نقل کریں",
      copied: "نقل ہو گیا",
      regenerate: "دوبارہ بنائیں",
      attach: "PDF یا TXT منسلک کریں",
      removeAttachment: "منسلکہ ہٹائیں",
      attachmentTooLarge: "فائل بہت بڑی ہے۔ زیادہ سے زیادہ 25 MB۔",
      attachmentType: "صرف PDF اور TXT فائلیں معاون ہیں۔",
      attachmentEmpty: "اس فائل میں پڑھنے کے قابل متن نہیں ملا۔",
      attachmentScanned: "یہ PDF اسکین شدہ لگتی ہے۔ متن نکالنا دستیاب نہیں۔",
      attachmentReady: "فائل منسلک ہو گئی",
      attachmentProcessing: "فائل پڑھ رہا ہوں...",
      attachmentFailed: "یہ فائل پڑھی نہیں جا سکی۔",
      delete: "حذف کریں",
      openMenu: "مینو کھولیں",
      closeSidebar: "سائیڈبار بند کریں",
      aiLabel: "زبان اے آئی",
      youLabel: "آپ",
      rateLimit: "اے آئی کی حد ختم ہو گئی۔ بعد میں کوشش کریں۔"
    },

    pa: {
      appName: "زبان اے آئی",
      newChat: "نئی گفتگو",
      recent: "حالیہ گفتگو",
      clear: "صاف کرو",
      language: "زبان",
      largerText: "وڈا متن",
      about: "زبان اے آئی بارے",
      aboutTitle: "زبان اے آئی بارے",
      aboutText1: "زبان اے آئی اک مددگار اے جیہڑا سکھن، روزمرہ کم تے زندگی نوں آسان بناندا اے۔",
      aboutText2: "اصلاح فاؤنڈیشن دا منصوبہ۔",
      welcome: "اج میں تہاڈی کی مدد کراں؟",
      welcomeIntro: "کجھ وی پچھو۔ اپنی سمجھ دی زبان وچ واضح جواب لؤ۔",
      welcomeEyebrow: "تہاڈا روزمرہ مددگار",
      placeholder: "کجھ وی پچھو...",
      hint: "بھیجن لئی Enter دبو",
      send: "بھیجو",
      disclaimer: "زبان اے آئی توں غلطی ہو سکدی اے۔ اہم معلومات دی تصدیق کرو۔",
      footerLeft: "اصلاح فاؤنڈیشن دا منصوبہ",
      footerRight: "پاکستان زندہ باد 💚",
      thinking: "سوچ ریا واں...",
      emptyHistory: "تہاڈی گفتگو ایتھے نظر آئے گی۔",
      online: "آن لائن",
      ready: "مدد لئی تیار",
      listening: "سن ریا واں...",
      errOffline: "تسی آف لائن لگدے او۔",
      errRequest: "کجھ غلط ہو گیا۔ دوبارہ کوشش کرو۔",
      errTimeout: "درخواست وچ بہت ویلہ لگ گیا۔",
      errInvalid: "اے آئی دا جواب پڑھیا نہیں جا سکیا۔",
      errEmpty: "پہلے پیغام لکھو۔",
      errVoice: "اس براؤزر وچ آواز نال ان پٹ دستیاب نہیں۔",
      errVoiceFail: "آواز دا ان پٹ ناکام ہو گیا۔",
      toastLang: "زبان بدل گئی",
      toastNew: "نئی گفتگو شروع",
      toastCleared: "تاریخ صاف ہو گئی",
      toastDeleted: "حذف ہو گیا",
      toastStorage: "ڈیٹا محفوظ نہیں ہو سکیا۔",
      toastOnline: "انٹرنیٹ کنکشن واپس آ گیا۔",
      confirmHistory: "کیا ساری گفتگو حذف کراں؟",
      confirmDelete: "کیا ایہہ گفتگو حذف کراں؟",
      copy: "نقل کرو",
      copied: "نقل ہو گیا",
      regenerate: "دوبارہ بناؤ",
      attach: "PDF یا TXT منسلک کرو",
      removeAttachment: "منسلکہ ہٹاؤ",
      attachmentTooLarge: "فائل بہت وڈی اے۔ زیادہ توں زیادہ 25 MB۔",
      attachmentType: "صرف PDF تے TXT فائلاں معاون نیں۔",
      attachmentEmpty: "اس فائل وچ پڑھن دے قابل متن نہیں ملیا۔",
      attachmentScanned: "ایہہ PDF اسکین شدہ لگدی اے۔ متن کڈھنا دستیاب نہیں۔",
      attachmentReady: "فائل منسلک ہو گئی",
      attachmentProcessing: "فائل پڑھ ریا واں...",
      attachmentFailed: "ایہہ فائل پڑھی نہیں جا سکی۔",
      delete: "حذف کرو",
      openMenu: "مینو کھولو",
      closeSidebar: "سائیڈبار بند کرو",
      aiLabel: "زبان اے آئی",
      youLabel: "تسی",
      rateLimit: "اے آئی دی حد ختم ہو گئی۔ بعد وچ کوشش کرو۔"
    },

    sd: {
      appName: "زبان اي آئي",
      newChat: "نئين گفتگو",
      recent: "تازيون ڳالهيون",
      clear: "صاف ڪريو",
      language: "ٻولي",
      largerText: "وڏو متن",
      about: "زبان اي آئي بابت",
      aboutTitle: "زبان اي آئي بابت",
      aboutText1: "زبان اي آئي هڪ مددگار آهي جيڪو سکڻ، روزمره ڪمن ۽ زندگي کي آسان بڻائي ٿو.",
      aboutText2: "اصلاح فائونڊيشن جو منصوبو.",
      welcome: "اڄ مان توهان جي ڪهڙي مدد ڪري سگهان ٿو؟",
      welcomeIntro: "ڪجهه به پڇو. پنهنجي سمجھ جي ٻولي ۾ واضح جواب حاصل ڪريو.",
      welcomeEyebrow: "توهان جو روزمره مددگار",
      placeholder: "ڪجهه به پڇو...",
      hint: "موڪلڻ لاءِ Enter دٻايو",
      send: "موڪليو",
      disclaimer: "زبان اي آئي کان غلطي ٿي سگهي ٿي. اهم معلومات جي تصديق ڪريو.",
      footerLeft: "اصلاح فائونڊيشن جو منصوبو",
      footerRight: "پاڪستان زنده باد 💚",
      thinking: "سوچي رهيو آهيان...",
      emptyHistory: "توهان جي گفتگو هتي نظر ايندي.",
      online: "آن لائن",
      ready: "مدد لاءِ تيار",
      listening: "ٻڌي رهيو آهيان...",
      errOffline: "توهان آف لائن لڳو ٿا.",
      errRequest: "ڪجهه غلط ٿي ويو. ٻيهر ڪوشش ڪريو.",
      errTimeout: "درخواست ۾ گهڻو وقت لڳو.",
      errInvalid: "اي آئي جو جواب پڙهي نہ سگهيو.",
      errEmpty: "پهريان پيغام لکو.",
      errVoice: "هن برائوزر ۾ آواز سان ان پٽ دستياب ناهي.",
      errVoiceFail: "آواز جو ان پٽ ناڪام ٿيو.",
      toastLang: "ٻولي تبديل ٿي وئي",
      toastNew: "نئين گفتگو شروع",
      toastCleared: "تاريخ صاف ٿي وئي",
      toastDeleted: "ختم ٿي ويو",
      toastStorage: "ڊيٽا محفوظ نہ ٿي سگهيو.",
      toastOnline: "انٽرنيٽ ڪنيڪشن واپس اچي ويو.",
      confirmHistory: "ڇا سڀ گفتگو ختم ڪجن؟",
      confirmDelete: "ڇا هي گفتگو ختم ڪجي؟",
      copy: "نقل ڪريو",
      copied: "نقل ٿي ويو",
      regenerate: "ٻيهر ٺاهيو",
      attach: "PDF يا TXT منسلڪ ڪريو",
      removeAttachment: "منسلڪ هٽايو",
      attachmentTooLarge: "فائل تمام وڏي آهي. وڌ ۾ وڌ 25 MB.",
      attachmentType: "صرف PDF ۽ TXT فائلون معاون آهن.",
      attachmentEmpty: "هن فائل ۾ پڙهڻ لائق متن نہ مليو.",
      attachmentScanned: "هي PDF اسڪين ٿيل لڳي ٿي. متن ڪڍڻ دستياب ناهي.",
      attachmentReady: "فائل منسلڪ ٿي وئي",
      attachmentProcessing: "فائل پڙهي رهيو آهيان...",
      attachmentFailed: "هي فائل پڙهي نہ سگهي.",
      delete: "ختم ڪريو",
      openMenu: "مينيو کوليو",
      closeSidebar: "سائيڊبار بند ڪريو",
      aiLabel: "زبان اي آئي",
      youLabel: "توهان",
      rateLimit: "اي آئي جي حد ختم ٿي وئي. بعد ۾ ڪوشش ڪريو."
    },

    ps: {
      appName: "زبان AI",
      newChat: "نوې خبرې اترې",
      recent: "وروستۍ خبرې اترې",
      clear: "پاکول",
      language: "ژبه",
      largerText: "لوی متن",
      about: "د زبان AI په اړه",
      aboutTitle: "د زبان AI په اړه",
      aboutText1: "زبان AI یو مرستندویه دی چې زده کړه، ورځني کارونه او ژوند اسانه کوي.",
      aboutText2: "د اصلاح فاونډیشن پروژه.",
      welcome: "نن څنګه مرسته درسره وکړم؟",
      welcomeIntro: "هر څه وپوښتئ. په خپله پوهه ژبه کې روښانه ځوابونه ترلاسه کړئ.",
      welcomeEyebrow: "ستاسو ورځنی مرستندوی",
      placeholder: "هر څه وپوښتئ...",
      hint: "د لېږلو لپاره Enter کېکاږئ",
      send: "لېږل",
      disclaimer: "زبان AI ممکن تېروتنه وکړي. مهم معلومات تایید کړئ.",
      footerLeft: "د اصلاح فاونډیشن پروژه",
      footerRight: "پاکستان ژوندی وي 💚",
      thinking: "فکر کوم...",
      emptyHistory: "ستاسو خبرې اترې به دلته ښکاره شي.",
      online: "آنلاین",
      ready: "مرستې ته چمتو",
      listening: "اورم...",
      errOffline: "تاسو آفلاین ښکاري.",
      errRequest: "یو څه غلط شو. بیا هڅه وکړئ.",
      errTimeout: "غوښتنې ډېر وخت ونیول.",
      errInvalid: "د AI ځواب ونه لوستل شو.",
      errEmpty: "لومړی پیغام ولیکئ.",
      errVoice: "په دې براوزر کې غږیز ان پټ نشته.",
      errVoiceFail: "غږیز ان پټ ناکام شو.",
      toastLang: "ژبه بدله شوه",
      toastNew: "نوې خبرې اترې پیل شوې",
      toastCleared: "تاریخ پاک شو",
      toastDeleted: "ړنګ شو",
      toastStorage: "ډیټا خوندي نشوه.",
      toastOnline: "انټرنیټ اړیکه بیرته راغله.",
      confirmHistory: "ایا ټولې خبرې اترې ړنګې کړم؟",
      confirmDelete: "ایا دا خبرې اترې ړنګې کړم؟",
      copy: "کاپي",
      copied: "کاپي شو",
      regenerate: "بیا جوړول",
      attach: "PDF یا TXT ضمیمه کړئ",
      removeAttachment: "ضمیمه لرې کړئ",
      attachmentTooLarge: "فایل ډېر لوی دی. اعظمي 25 MB.",
      attachmentType: "یوازې PDF او TXT فایلونه ملاتړ کیږي.",
      attachmentEmpty: "په دې فایل کې لوستل کیدونکی متن ونه موندل شو.",
      attachmentScanned: "دا PDF سکن شوې ښکاري. متن ایستل نشته.",
      attachmentReady: "فایل ضمیمه شو",
      attachmentProcessing: "فایل لولم...",
      attachmentFailed: "دا فایل ونه لوستل شو.",
      delete: "ړنګول",
      openMenu: "مینو پرانیستل",
      closeSidebar: "سایډبار بندول",
      aiLabel: "زبان AI",
      youLabel: "تاسو",
      rateLimit: "د AI حد ختم شو. وروسته هڅه وکړئ."
    }
  };

  function t(key) {
    const dictionary = TEXT[state.lang] || TEXT.en;
    return dictionary[key] || TEXT.en[key] || key;
  }

  /* =====================================
     STORAGE
  ===================================== */
  function safeStoreGet(key, fallback) {
    try {
      const value = localStorage.getItem(key);
      return value === null ? fallback : JSON.parse(value);
    } catch (error) {
      console.warn("Storage read failed:", error);
      return fallback;
    }
  }

  function safeStoreSet(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.warn("Storage write failed:", error);
      return false;
    }
  }

  let storageWarningShown = false;

  function persist() {
    const existing = safeStoreGet(STORAGE.data, {});
    const success = safeStoreSet(STORAGE.data, {
      currentId: state.currentId,
      conversations: state.conversations,
      student: existing.student || {},
      shop: existing.shop || {}
    });

    if (!success && !storageWarningShown) {
      storageWarningShown = true;
      showToast(t("toastStorage"), "warning");
    }
  }

  function loadSavedData() {
    const saved = safeStoreGet(STORAGE.data, {});
    if (!saved || typeof saved !== "object") return;

    state.currentId = saved.currentId || null;
    state.conversations = Array.isArray(saved.conversations) ? saved.conversations : [];

    const language = safeStoreGet(STORAGE.language, "roman");
    state.lang = LANGUAGES[language] ? language : "roman";
    state.largeText = Boolean(safeStoreGet(STORAGE.largeText, false));
  }

  /* =====================================
     TOAST
  ===================================== */
  let toastTimer = null;

  function showToast(message, type = "info") {
    const toast = $("#toast");
    if (!toast) return;

    clearTimeout(toastTimer);
    toast.textContent = String(message || "");
    toast.dataset.type = type;
    toast.classList.remove("visible");
    void toast.offsetWidth;
    toast.classList.add("visible");

    toastTimer = setTimeout(() => {
      toast.classList.remove("visible");
    }, CONFIG.TOAST_DURATION);
  }

  /* =====================================
     LANGUAGE — APPLY EVERYWHERE
  ===================================== */
  function applyLanguage(language) {
    if (!LANGUAGES[language]) return;

    state.lang = language;
    safeStoreSet(STORAGE.language, language);

    const langMeta = LANGUAGES[language];

    // Root direction + lang
    document.documentElement.lang = langMeta.code === "roman" ? "en" : langMeta.code;
    document.documentElement.dir = langMeta.direction;

    // Selector
    const selector = $("#language");
    if (selector) selector.value = language;

    // Sidebar
    const newChatBtn = $("#newChat");
    if (newChatBtn) {
      const label = newChatBtn.querySelector("span:last-child");
      if (label) label.textContent = t("newChat");
    }

    const recentLabel = $(".history-heading .sidebar-label");
    if (recentLabel) recentLabel.textContent = t("recent");

    const clearBtn = $("#clearHistory");
    if (clearBtn) clearBtn.textContent = t("clear");

    const langLabel = $(".sidebar-tools .sidebar-label");
    if (langLabel) langLabel.textContent = t("language");

    const largeTextBtn = $("#largeText");
    if (largeTextBtn) {
      const label = largeTextBtn.querySelector("span:last-child");
      if (label) label.textContent = t("largerText");
    }

    const helpBtn = $("#helpButton");
    if (helpBtn) {
      const label = helpBtn.querySelector("span:last-child");
      if (label) label.textContent = t("about");
    }

    const connectionText = $("#connectionText");
    if (connectionText) connectionText.textContent = t("ready");

    // Header
    const desktopTitle = $(".desktop-page-title span");
    if (desktopTitle) desktopTitle.textContent = t("appName");

    const mobileBrand = $(".mobile-brand strong");
    if (mobileBrand) mobileBrand.textContent = t("appName");

    const connectionLabel = $("#connection span:last-child");
    if (connectionLabel) connectionLabel.textContent = t("online");

    const headerNewChat = $("#headerNewChat");
    if (headerNewChat) headerNewChat.textContent = "＋ " + t("newChat");

    const openSidebar = $("#openSidebar");
    if (openSidebar) openSidebar.setAttribute("aria-label", t("openMenu"));

    const closeSidebarBtn = $("#closeSidebar");
    if (closeSidebarBtn) closeSidebarBtn.setAttribute("aria-label", t("closeSidebar"));

    // Welcome
    const eyebrow = $(".welcome-eyebrow");
    if (eyebrow) eyebrow.textContent = t("welcomeEyebrow");

    const welcomeTitle = $("#welcomeTitle");
    if (welcomeTitle) welcomeTitle.textContent = t("welcome");

    const welcomeIntro = $("#welcomeIntro");
    if (welcomeIntro) welcomeIntro.textContent = t("welcomeIntro");

    // Composer
    const input = $("#question");
    if (input) {
      input.placeholder = t("placeholder");
      input.setAttribute("aria-label", t("placeholder"));
    }

    const hint = $("#composerHint");
    if (hint) hint.textContent = t("hint");

    const sendBtn = $("#askButton");
    if (sendBtn) sendBtn.textContent = t("send");

    const attachBtn = $("#attachButton");
    if (attachBtn) {
      attachBtn.setAttribute("title", t("attach"));
      attachBtn.setAttribute("aria-label", t("attach"));
    }

    const voiceBtn = $("#voiceButton");
    if (voiceBtn) voiceBtn.setAttribute("aria-label", t("listening"));

    const disclaimer = $(".disclaimer");
    if (disclaimer) disclaimer.textContent = t("disclaimer");

    const removeAttachment = $("#removeAttachment");
    if (removeAttachment) removeAttachment.setAttribute("aria-label", t("removeAttachment"));

    // Footer
    const footerLeft = $(".footer-left");
    if (footerLeft) footerLeft.textContent = t("footerLeft");

    const footerRight = $(".footer-right");
    if (footerRight) footerRight.textContent = t("footerRight");

    // About dialog
    const aboutTitle = $("#aboutDialog h2");
    if (aboutTitle) aboutTitle.textContent = t("aboutTitle");

    const aboutParagraphs = $$("#aboutDialog .dialog-content p");
    if (aboutParagraphs[0]) aboutParagraphs[0].textContent = t("aboutText1");
    if (aboutParagraphs[1]) aboutParagraphs[1].textContent = t("aboutText2");

    // Re-render dynamic content
    renderHistory();
    renderMessages();
  }

  function updateLanguage(language) {
    applyLanguage(language);
    showToast(t("toastLang"));
  }

  /* =====================================
     CONVERSATIONS
  ===================================== */
  function getCurrentConversation() {
    return state.conversations.find(c => c.id === state.currentId) || null;
  }

  function createConversation() {
    const conversation = {
      id: uid(),
      title: t("newChat"),
      messages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    state.conversations.unshift(conversation);
    state.currentId = conversation.id;
    persist();
    renderHistory();
    renderMessages();
    return conversation;
  }

  function ensureConversation() {
    let conversation = getCurrentConversation();
    if (!conversation) conversation = createConversation();
    return conversation;
  }

  function updateConversationTitle(conversation) {
    if (!conversation || !conversation.messages.length) return;
    const firstUser = conversation.messages.find(m => m.role === "user");
    if (!firstUser) return;
    conversation.title = firstUser.content.trim().slice(0, 42);
    if (firstUser.content.length > 42) conversation.title += "...";
  }

  function addMessage(role, content, extra = {}) {
    const conversation = ensureConversation();
    const message = {
      id: uid(),
      role,
      content: String(content || ""),
      timestamp: new Date().toISOString(),
      ...extra
    };

    conversation.messages.push(message);
    conversation.updatedAt = message.timestamp;
    updateConversationTitle(conversation);
    persist();
    renderMessages();
    renderHistory();
    return message;
  }

  /* =====================================
     PART 1 ENDS — PART 2 CONTINUES
  ===================================== */
   /* =====================================
     RENDERING
  ===================================== */
  function formatMessageText(value) {
    let escaped = escapeHTML(value);

    const codeBlocks = [];
    escaped = escaped.replace(/```([\s\S]*?)```/g, (match, code) => {
      const id = `__CODEBLOCK_${codeBlocks.length}__`;
      codeBlocks.push(`<pre><code>${code.trim()}</code></pre>`);
      return id;
    });

    escaped = escaped.replace(/`([^`]+)`/g, "<code>$1</code>");
    escaped = escaped.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
    escaped = escaped.replace(/\*(.+?)\*/g, "<em>$1</em>");
    escaped = escaped.replace(/^### (.+)$/gm, "<h3>$1</h3>");
    escaped = escaped.replace(/^## (.+)$/gm, "<h2>$1</h2>");
    escaped = escaped.replace(/^# (.+)$/gm, "<h1>$1</h1>");
    escaped = escaped.replace(/^[-*] (.+)$/gm, "<li>$1</li>");
    escaped = escaped.replace(/(<li>.*<\/li>)/s, "<ul>$1</ul>");
    escaped = escaped.replace(/^\d+\. (.+)$/gm, "<li>$1</li>");

    escaped = escaped
      .split(/\n{2,}/)
      .map(block => {
        const trimmed = block.trim();
        if (!trimmed) return "";
        if (/^<(h[1-4]|ul|ol|pre|table)/.test(trimmed)) return trimmed;
        return `<p>${trimmed.replace(/\n/g, "<br>")}</p>`;
      })
      .join("");

    codeBlocks.forEach((block, i) => {
      escaped = escaped.replace(`__CODEBLOCK_${i}__`, block);
    });

    return escaped;
  }

  function createMessageElement(message) {
    const wrapper = element("article", {
      class: `chat-message ${message.role}`,
      dataset: { messageId: message.id }
    });

    const body = element("div", { class: "message-content" });
    body.innerHTML = formatMessageText(message.content);
    wrapper.append(body);

    if (message.role === "assistant") {
      const actions = element("div", { class: "message-actions" });

      const copyBtn = element("button", {
        type: "button",
        class: "message-action-button",
        text: t("copy")
      });

      copyBtn.addEventListener("click", async () => {
        try {
          await navigator.clipboard.writeText(message.content);
          copyBtn.textContent = t("copied");
          setTimeout(() => { copyBtn.textContent = t("copy"); }, 1500);
        } catch {
          showToast(t("errRequest"));
        }
      });

      const regenBtn = element("button", {
        type: "button",
        class: "message-action-button",
        text: t("regenerate")
      });

      regenBtn.addEventListener("click", () => {
        const conversation = getCurrentConversation();
        if (!conversation) return;

        const index = conversation.messages.findIndex(m => m.id === message.id);
        if (index < 0) return;

        for (let i = index - 1; i >= 0; i--) {
          if (conversation.messages[i].role === "user") {
            const userText = conversation.messages[i].content;
            conversation.messages.splice(i);
            persist();
            renderMessages();
            renderHistory();
            sendMessage(userText);
            return;
          }
        }
      });

      actions.append(copyBtn, regenBtn);
      wrapper.append(actions);
    }

    return wrapper;
  }

  function renderMessages() {
    const container = $("#generalMessages");
    const welcome = $("#welcomeContainer");

    if (!container) return;

    container.replaceChildren();

    const conversation = getCurrentConversation();
    const messages = conversation?.messages || [];

    if (welcome) welcome.hidden = messages.length > 0;

    messages.forEach(message => {
      container.append(createMessageElement(message));
    });

    container.scrollTop = container.scrollHeight;
  }

  function renderHistory() {
    const list = $("#recentList");
    const empty = $("#emptyHistoryText");
    if (!list) return;

    list.querySelectorAll(".history-item").forEach(item => item.remove());

    const conversations = [...state.conversations].sort((a, b) =>
      new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0)
    );

    if (empty) {
      empty.hidden = conversations.length > 0;
      empty.textContent = t("emptyHistory");
    }

    conversations.forEach(conversation => {
      const item = element("div", {
        class: "history-item" + (conversation.id === state.currentId ? " active" : "")
      });

      const button = element("button", {
        type: "button",
        class: "history-chat-button",
        dataset: { conversationId: conversation.id }
      });

      button.append(
        element("span", { class: "history-chat-icon", text: "◈" }),
        element("span", { class: "history-chat-title", text: conversation.title || t("newChat") })
      );

      button.addEventListener("click", () => openConversation(conversation.id));

      const del = element("button", {
        type: "button",
        class: "history-delete",
        text: "×",
        ariaLabel: t("delete")
      });

      del.addEventListener("click", (e) => {
        e.stopPropagation();
        if (!confirm(t("confirmDelete"))) return;

        state.conversations = state.conversations.filter(c => c.id !== conversation.id);
        if (state.currentId === conversation.id) state.currentId = null;
        persist();
        renderHistory();
        renderMessages();
        showToast(t("toastDeleted"));
      });

      item.append(button, del);
      list.append(item);
    });
  }

  function openConversation(id) {
    const conversation = state.conversations.find(item => item.id === id);
    if (!conversation) return;

    state.currentId = id;
    persist();
    renderHistory();
    renderMessages();
    closeSidebar();
  }

  function startNewChat() {
    state.currentId = null;
    createConversation();

    const input = $("#question");
    if (input) {
      input.value = "";
      updateCharacterCount();
      input.focus();
    }

    closeSidebar();
    showToast(t("toastNew"));
  }

  function clearChatHistory() {
    if (!confirm(t("confirmHistory"))) return;

    state.conversations = [];
    state.currentId = null;
    persist();
    renderHistory();
    renderMessages();
    showToast(t("toastCleared"));
  }

  /* =====================================
     AI REQUEST
  ===================================== */
  async function requestAI(payload) {
    if (!navigator.onLine) throw new Error("OFFLINE");

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), CONFIG.API_TIMEOUT);

    try {
      const response = await fetch(CONFIG.API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: controller.signal
      });

      if (!response.ok) {
        let detail = "";
        try {
          const errData = await response.json();
          detail = errData.error || "";
        } catch { /* ignore */ }

        if (response.status === 429) throw new Error("RATE_LIMIT");
        throw new Error(detail || `HTTP_${response.status}`);
      }

      const data = await response.json();
      const answer = data.reply || data.answer || "";

      if (typeof answer !== "string" || !answer.trim()) {
        throw new Error("INVALID_RESPONSE");
      }

      return answer.trim();
    } catch (error) {
      if (error.name === "AbortError") throw new Error("TIMEOUT");
      throw error;
    } finally {
      clearTimeout(timeout);
    }
  }

  function getAIErrorMessage(error) {
    const messages = {
      OFFLINE: t("errOffline"),
      TIMEOUT: t("errTimeout"),
      INVALID_RESPONSE: t("errInvalid"),
      RATE_LIMIT: t("rateLimit")
    };

    if (messages[error.message]) return messages[error.message];
    if (error.message && error.message.length < 200) return error.message;
    return t("errRequest");
  }

  /* =====================================
     SEND MESSAGE
  ===================================== */
  async function sendMessage(rawMessage) {
    const message = String(rawMessage || "").trim();
    if (!message) {
      showToast(t("errEmpty"), "warning");
      return;
    }

    if (message.length > CONFIG.MAX_MESSAGE_LENGTH) {
      showToast(`Maximum ${CONFIG.MAX_MESSAGE_LENGTH} characters allowed.`, "warning");
      return;
    }

    if (state.pending.has("chat")) return;

    const input = $("#question");
    const sendButton = $("#askButton");
    const attachment = state.attachment;

    state.pending.add("chat");
    if (input) { input.value = ""; input.disabled = true; updateCharacterCount(); }
    if (sendButton) sendButton.disabled = true;

    try {
      const conversation = ensureConversation();
      const history = conversation.messages
        .slice(-12)
        .map(m => ({
          role: m.role === "assistant" ? "model" : "user",
          text: m.content
        }));

      addMessage("user", message, attachment ? { attachment: { name: attachment.name } } : {});

      const loading = element("div", {
        class: "chat-message assistant message-loading",
        text: t("thinking")
      });
      $("#generalMessages")?.append(loading);

      const messagesEl = $("#generalMessages");
      if (messagesEl) messagesEl.scrollTop = messagesEl.scrollHeight;

      const payload = {
        message,
        language: state.lang,   // <-- AI response language
        history
      };

      if (attachment) {
        payload.attachment = {
          name: attachment.name,
          text: attachment.text
        };
      }

      const answer = await requestAI(payload);
      loading.remove();
      addMessage("assistant", answer);
      clearAttachment();

    } catch (error) {
      $$(".message-loading").forEach(el => el.remove());
      addMessage("assistant", getAIErrorMessage(error));

    } finally {
      state.pending.delete("chat");
      if (input) { input.disabled = false; input.focus(); }
      if (sendButton) sendButton.disabled = false;
      renderMessages();
    }
  }

  /* =====================================
     CHARACTER COUNT
  ===================================== */
  function updateCharacterCount() {
    const input = $("#question");
    const counter = $("#charCount");
    if (!input || !counter) return;
    counter.textContent = `${input.value.length}/${CONFIG.MAX_MESSAGE_LENGTH}`;
  }

   /* =====================================
     SIDEBAR
  ===================================== */
  function openSidebar() {
    document.body.classList.add("sidebar-open");
  }

  function closeSidebar() {
    document.body.classList.remove("sidebar-open");
  }

  function isSidebarOpen() {
    return document.body.classList.contains("sidebar-open");
  }

  function handleOutsideClick(event) {
    if (!isSidebarOpen()) return;

    const sidebar = $("#sidebar");
    if (!sidebar) return;

    // Click inside sidebar → do nothing
    if (sidebar.contains(event.target)) return;

    // Click on the menu (hamburger) button → let its own handler toggle
    if (event.target.closest("#openSidebar")) return;

    closeSidebar();
  }

  /* =====================================
     PDF / TXT
  ===================================== */
  let pdfLibraryPromise = null;

  function loadPDFLibrary() {
    if (window.pdfjsLib) return Promise.resolve(window.pdfjsLib);
    if (pdfLibraryPromise) return pdfLibraryPromise;

    pdfLibraryPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";

      script.onload = () => {
        if (!window.pdfjsLib) { reject(new Error("PDF_LIBRARY_UNAVAILABLE")); return; }
        window.pdfjsLib.GlobalWorkerOptions.workerSrc =
          "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
        resolve(window.pdfjsLib);
      };

      script.onerror = () => reject(new Error("PDF_LIBRARY_LOAD_FAILED"));
      document.head.append(script);
    });

    return pdfLibraryPromise;
  }

  async function extractPDFText(file) {
    const pdfjs = await loadPDFLibrary();
    const buffer = await file.arrayBuffer();
    const pdf = await pdfjs.getDocument({ data: new Uint8Array(buffer) }).promise;

    const pages = [];
    const maxPages = Math.min(pdf.numPages, CONFIG.MAX_PDF_PAGES);

    for (let i = 1; i <= maxPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const pageText = content.items.map(item => item.str || "").join(" ");
      pages.push(pageText);
    }

    return { text: pages.join("\n\n"), pageCount: pdf.numPages };
  }

  async function handleFileSelect(file) {
    if (!file) return;

    if (file.size > CONFIG.MAX_FILE_SIZE) {
      showToast(t("attachmentTooLarge"), "warning");
      return;
    }

    const isPDF = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
    const isTXT = file.type === "text/plain" || file.name.toLowerCase().endsWith(".txt");

    if (!isPDF && !isTXT) {
      showToast(t("attachmentType"), "warning");
      return;
    }

    showToast(t("attachmentProcessing"));

    try {
      let text = "";
      let pageCount = 0;

      if (isPDF) {
        const result = await extractPDFText(file);
        text = result.text;
        pageCount = result.pageCount;
      } else {
        text = await file.text();
      }

      if (!text.trim()) {
        showToast(isPDF ? t("attachmentScanned") : t("attachmentEmpty"), "warning");
        return;
      }

      const maxTextLength = 60000;
      if (text.length > maxTextLength) {
        text = text.slice(0, maxTextLength) + "\n\n[Document truncated due to length]";
      }

      state.attachment = {
        name: file.name,
        text,
        pageCount,
        size: file.size
      };

      renderAttachmentPreview();
      showToast(t("attachmentReady"));

    } catch (error) {
      console.error(error);
      showToast(t("attachmentFailed"), "warning");
    }
  }

  function renderAttachmentPreview() {
    const preview = $("#attachmentPreview");
    const name = $("#attachmentName");
    const size = $("#attachmentSize");

    if (!preview) return;

    if (!state.attachment) {
      preview.hidden = true;
      return;
    }

    preview.hidden = false;
    if (name) name.textContent = state.attachment.name;
    if (size) {
      const kb = Math.round(state.attachment.size / 1024);
      size.textContent = kb > 1024 ? `${(kb / 1024).toFixed(1)} MB` : `${kb} KB`;
    }
  }

  function clearAttachment() {
    state.attachment = null;
    renderAttachmentPreview();
    const fileInput = $("#fileInput");
    if (fileInput) fileInput.value = "";
  }

  /* =====================================
     VOICE
  ===================================== */
  let recognition = null;
  let voiceActive = false;

  function setupVoiceInput() {
    const voiceButton = $("#voiceButton");
    if (!voiceButton) return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      voiceButton.addEventListener("click", () => showToast(t("errVoice"), "warning"));
      return;
    }

    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      voiceActive = true;
      voiceButton.classList.add("recording");
      const hint = $("#composerHint");
      if (hint) hint.textContent = t("listening");
    };

    recognition.onresult = event => {
      let finalText = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalText += event.results[i][0].transcript;
        }
      }

      if (finalText) {
        const input = $("#question");
        if (input) {
          input.value = (input.value + " " + finalText).trim();
          updateCharacterCount();
        }
      }
    };

    recognition.onerror = () => showToast(t("errVoiceFail"), "warning");

    recognition.onend = () => {
      voiceActive = false;
      voiceButton.classList.remove("recording");
      const hint = $("#composerHint");
      if (hint) hint.textContent = t("hint");

      const input = $("#question");
      if (input && input.value.trim()) {
        sendMessage(input.value.trim());
      }
    };

    voiceButton.addEventListener("click", () => {
      if (voiceActive) { recognition.stop(); return; }
      try {
        recognition.lang = LANGUAGES[state.lang]?.speech || "ur-PK";
        recognition.start();
      } catch {
        showToast(t("errVoiceFail"), "warning");
      }
    });
  }

  /* =====================================
     TEXT SIZE
  ===================================== */
  function toggleLargeText() {
    state.largeText = !state.largeText;
    document.body.classList.toggle("large-text", state.largeText);
    safeStoreSet(STORAGE.largeText, state.largeText);
  }

  /* =====================================
     ABOUT
  ===================================== */
  function openAbout() {
    const dialog = $("#aboutDialog");
    if (!dialog) return;
    if (typeof dialog.showModal === "function") dialog.showModal();
    else dialog.hidden = false;
  }

  function closeAbout() {
    const dialog = $("#aboutDialog");
    if (!dialog) return;
    if (typeof dialog.close === "function") dialog.close();
    else dialog.hidden = true;
  }

  /* =====================================
     EVENTS
  ===================================== */
  function bindEvents() {
    $("#newChat")?.addEventListener("click", startNewChat);
    $("#headerNewChat")?.addEventListener("click", startNewChat);
    $("#clearHistory")?.addEventListener("click", clearChatHistory);

    $("#openSidebar")?.addEventListener("click", openSidebar);
    $("#closeSidebar")?.addEventListener("click", closeSidebar);

    $("#helpButton")?.addEventListener("click", openAbout);
    $("#closeAbout")?.addEventListener("click", closeAbout);
    $("#largeText")?.addEventListener("click", toggleLargeText);

    $("#language")?.addEventListener("change", e => updateLanguage(e.target.value));

    $("#attachButton")?.addEventListener("click", () => $("#fileInput")?.click());
    $("#fileInput")?.addEventListener("change", e => {
      const file = e.target.files?.[0];
      if (file) handleFileSelect(file);
    });
    $("#removeAttachment")?.addEventListener("click", clearAttachment);

    $("#questionForm")?.addEventListener("submit", event => {
      event.preventDefault();
      const input = $("#question");
      if (input) sendMessage(input.value);
    });

    $("#question")?.addEventListener("input", updateCharacterCount);

    $("#question")?.addEventListener("keydown", event => {
      if (event.key === "Enter" && !event.shiftKey && !event.isComposing) {
        event.preventDefault();
        $("#questionForm")?.requestSubmit();
      }
    });

       document.addEventListener("click", handleOutsideClick);

    document.addEventListener("keydown", event => {
      if (event.key === "Escape") closeSidebar();
    });
  }

  /* =====================================
     INIT
  ===================================== */
  function initializeApp() {
    loadSavedData();
    applyLanguage(state.lang);   // applies every UI string + dir

    document.body.classList.toggle("large-text", state.largeText);

    bindEvents();
    setupVoiceInput();

    updateCharacterCount();

    window.addEventListener("online", () => showToast(t("toastOnline")));
    window.addEventListener("offline", () => showToast(t("errOffline"), "warning"));
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeApp, { once: true });
  } else {
    initializeApp();
  }

})();
