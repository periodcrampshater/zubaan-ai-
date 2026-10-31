/**
 * Zubaan AI — Updated app.js
 * Vanilla JavaScript
 */
(() => {
  "use strict";

  if (window.__zubaanApp) return;
  window.__zubaanApp = true;

  /* =====================================
     1. CONFIGURATION
  ===================================== */

  const CONFIG = {
    API_URL: "",
    API_TIMEOUT: 30000,
    TOAST_DURATION: 3500,
    MAX_MESSAGE_LENGTH: 4000
  };

  const STORAGE = {
    data: "zubaan.data.v2",
    language: "zubaan.lang",
    largeText: "zubaan.largeText"
  };

  const LANGUAGES = {
    roman: {
      name: "Roman Urdu",
      speech: "ur-PK",
      direction: "ltr"
    },
    ur: {
      name: "Urdu",
      speech: "ur-PK",
      direction: "rtl"
    },
    en: {
      name: "English",
      speech: "en-US",
      direction: "ltr"
    },
    pa: {
      name: "Punjabi",
      speech: "pa-Arab-PK",
      direction: "rtl"
    },
    sd: {
      name: "Sindhi",
      speech: "sd-PK",
      direction: "rtl"
    },
    ps: {
      name: "Pashto",
      speech: "ps-AF",
      direction: "rtl"
    }
  };

  const MODES = [
    "general",
    "student",
    "shopkeeper"
  ];

  /* =====================================
     2. APPLICATION STATE
  ===================================== */

  const state = {
    lang: "roman",
    mode: "general",
    currentId: null,
    largeText: false,

    conversations: [],

    student: {
      chapters: [],
      notes: [],
      cards: [],
      plans: []
    },

    shop: {
      customers: [],
      ledger: [],
      sales: [],
      expenses: [],
      stock: []
    },

    ui: {
      sidebar: false,
      studentTool: null,
      shopTool: null,
      editing: null,
      output: {},
      flipped: {}
    },

    pending: new Set()
  };

  /* =====================================
     3. DOM HELPERS
  ===================================== */

  const $ = (selector, root = document) =>
    root.querySelector(selector);

  const $$ = (selector, root = document) =>
    [...root.querySelectorAll(selector)];

  const uid = () =>
    Date.now().toString(36) +
    Math.random().toString(36).slice(2, 9);

  const today = () =>
    new Date().toISOString().slice(0, 10);

  const money = value =>
    "Rs " + (Number(value) || 0).toLocaleString();

  const escapeHTML = value =>
    String(value ?? "").replace(/[&<>"']/g, character => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    })[character]);

  function element(tag, attributes = {}, ...children) {
    const node = document.createElement(tag);

    Object.entries(attributes).forEach(([key, value]) => {
      if (value === null || value === undefined || value === false) {
        return;
      }

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
      if (child === null || child === undefined || child === false) {
        return;
      }

      node.append(
        child.nodeType
          ? child
          : document.createTextNode(String(child))
      );
    });

    return node;
  }

  function textLines(value) {
    return String(value || "")
      .split("\n")
      .map(line => element("p", { text: line }));
  }

  /* =====================================
     4. LANGUAGE HELPER
  ===================================== */

  function t(key) {
    const dictionaries = {
      en: TEXT.en,
      roman: TEXT.roman,
      ur: UR,
      pa: TEXT.pa,
      sd: TEXT.sd,
      ps: TEXT.ps
    };

    const dictionary = dictionaries[state.lang] || TEXT.en;

    return dictionary[key] || TEXT.en[key] || key;
  }

  /* =====================================
     5. LOCAL STORAGE
  ===================================== */

  function safeStoreGet(key, fallback) {
    try {
      const value = localStorage.getItem(key);

      return value === null
        ? fallback
        : JSON.parse(value);
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
    const success = safeStoreSet(STORAGE.data, {
      mode: state.mode,
      currentId: state.currentId,
      conversations: state.conversations,
      student: state.student,
      shop: state.shop
    });

    if (!success && !storageWarningShown) {
      storageWarningShown = true;
      showToast(t("toastStorage"), "warning");
    }
  }

  function loadSavedData() {
    const saved = safeStoreGet(STORAGE.data, {});

    if (!saved || typeof saved !== "object") return;

    if (MODES.includes(saved.mode)) {
      state.mode = saved.mode;
    }

    state.currentId = saved.currentId || null;

    state.conversations = Array.isArray(saved.conversations)
      ? saved.conversations
      : [];

    if (saved.student && typeof saved.student === "object") {
      state.student = {
        ...state.student,
        ...saved.student
      };
    }

    if (saved.shop && typeof saved.shop === "object") {
      state.shop = {
        ...state.shop,
        ...saved.shop
      };
    }

    const language = safeStoreGet(STORAGE.language, "roman");

    state.lang = LANGUAGES[language] ? language : "roman";

    state.largeText = Boolean(
      safeStoreGet(STORAGE.largeText, false)
    );
  }

  /* =====================================
     6. NOTIFICATIONS
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
     PART 1 COMPLETE
     PART 2 CONTINUES BELOW
  ===================================== */
   /* =====================================
     7. LANGUAGE DICTIONARIES
  ===================================== */

  const TEXT = {
    en: {
      newChat: "New chat",
      general: "General assistant",
      student: "Student",
      shopkeeper: "Shopkeeper",
      recent: "RECENT CHATS",
      clear: "Clear",
      language: "LANGUAGE",
      largerText: "Larger text",
      about: "About Zubaan AI",
      welcome: "How can I help you today?",
      welcomeIntro: "Ask anything. Get clear answers in the language you understand.",
      placeholder: "Message Zubaan AI...",
      hint: "Your language, your way.",
      send: "Send",
      disclaimer: "Zubaan AI can make mistakes. Verify important information.",
      thinking: "Thinking...",
      emptyHistory: "Your conversations will appear here.",
      noRecords: "No records yet.",
      savedEmpty: "Your saved chapters will appear here.",
      back: "← Back",
      add: "Add",
      update: "Update",
      edit: "Edit",
      delete: "Delete",
      cancel: "Cancel",
      save: "Save",
      gotIt: "Got it",
      online: "Online",
      offline: "Offline",
      ready: "Ready to help",
      notConnected: "AI service not connected",
      listening: "Listening...",
      errNoApi: "AI service is not connected. Configure API_URL in app.js.",
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
      toastSaved: "Saved",
      toastUpdated: "Updated",
      toastDeleted: "Deleted",
      toastStorage: "Could not save data on this device.",
      confirmHistory: "Delete all conversations?",
      confirmDelete: "Delete this item?",
      errRequired: "Please fill in the required fields.",
      errName: "Please enter a name.",
      errAmount: "Enter an amount greater than zero.",
      errNumber: "Enter a valid number.",
      errCustomer: "Please select a customer.",
      errOverpay: "Payment is more than the outstanding balance.",
      errStock: "Not enough stock for this sale.",
      errItem: "Enter an item or choose a product.",
      errDuplicate: "A product with this name already exists.",
      balance: "Balance",
      customer: "Customer",
      amount: "Amount (Rs)",
      name: "Name",
      phone: "Phone",
      address: "Address",
      note: "Note",
      date: "Date",
      subject: "Subject",
      chapter: "Chapter / topic",
      count: "Number of questions",
      difficulty: "Difficulty",
      material: "Paste material (optional)",
      generate: "Generate",
      summarize: "Summarize with AI",
      title: "Title",
      content: "Text",
      task: "Task",
      due: "Due date",
      front: "Front (question)",
      backSide: "Back (answer)",
      addCard: "Add card",
      flashcards: "Flashcards",
      mock: "Make a mock test",
      mcq: "Generate MCQs",
      summary: "Chapter summaries",
      notes: "My notes",
      planner: "Study planner",
      credit: "Udhar ledger",
      customers: "Customers",
      sales: "Daily sales",
      expenses: "Expenses",
      payments: "Payment history",
      stock: "Stock notes",
      quantity: "Quantity",
      price: "Unit price (Rs)",
      product: "Product from stock",
      item: "Item",
      paymentType: "Payment type",
      cash: "Cash",
      creditType: "Credit (udhar)",
      category: "Category",
      low: "Low-stock alert at",
      selectCustomer: "— Select customer —",
      otherItem: "— Other item —",
      noCustomer: "Add a customer first.",
      lowStock: "Low stock",
      tasksDone: "Tasks done",
      savedChapters: "Saved chapters",
      showAnswer: "Show answer",
      hideAnswer: "Hide answer",
      markDone: "Mark done",
      reopen: "Reopen",
      confirmCustomer: "Delete this customer and related records?",
      sCustomers: "Customers",
      sOutstanding: "Outstanding",
      sOwing: "Customers owing",
      sSalesToday: "Sales today",
      sSalesAll: "Total sales",
      sExpenses: "Total expenses",
      sProfit: "Sales − expenses",
      sReceived: "Total received",
      sProducts: "Products",
      sLow: "Low stock",
      sValue: "Stock value",
      saveChapter: "Save chapter",
      saveOut: "Save to chapters",
      saveCards: "Save these cards",
      addCardAI: "Generate cards with AI",
      easy: "Easy",
      medium: "Medium",
      hard: "Hard"
    },

    roman: {
      newChat: "Nayi guftagu",
      general: "General madadgar",
      student: "Talib-e-ilm",
      shopkeeper: "Dukaandaar",
      recent: "HALIYA GUFTAGU",
      clear: "Saaf karein",
      language: "ZUBAAN",
      largerText: "Bara text",
      about: "Zubaan AI ke bare mein",
      welcome: "Aaj main aap ki kya madad karoon?",
      welcomeIntro: "Kuch bhi poochein. Apni samajh ki zubaan mein wazeh jawab payein.",
      placeholder: "Zubaan AI ko likhein...",
      hint: "Aap ki zubaan, aap ka andaaz.",
      send: "Bhejein",
      disclaimer: "Zubaan AI se ghalti ho sakti hai. Aham maloomat ki tasdeeq karein.",
      thinking: "Soch raha hoon...",
      emptyHistory: "Aap ki guftagu yahan nazar aayegi.",
      noRecords: "Abhi koi record nahi.",
      savedEmpty: "Aap ke mehfooz baab yahan nazar aayenge.",
      back: "← Wapas",
      add: "Shamil karein",
      update: "Update karein",
      edit: "Tarmeem",
      delete: "Delete",
      cancel: "Cancel",
      save: "Mehfooz karein",
      gotIt: "Samajh gaya",
      online: "Online",
      offline: "Offline",
      ready: "Madad ke liye tayyar",
      notConnected: "AI service connect nahi hai",
      listening: "Sun raha hoon...",
      errNoApi: "AI service connect nahi hai. app.js mein API_URL set karein.",
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
      toastSaved: "Mehfooz ho gaya",
      toastUpdated: "Update ho gaya",
      toastDeleted: "Delete ho gaya",
      toastStorage: "Data device par save nahi ho saka.",
      confirmHistory: "Kya tamam guftagu delete karein?",
      confirmDelete: "Kya isay delete karein?",
      errRequired: "Zaroori khaane pur karein.",
      errName: "Naam likhein.",
      errAmount: "Zero se zyada raqam likhein.",
      errNumber: "Durust number likhein.",
      errCustomer: "Customer chunein.",
      errOverpay: "Adaigi baqaya se zyada hai.",
      errStock: "Is sale ke liye stock kaafi nahi.",
      errItem: "Cheez likhein ya product chunein.",
      errDuplicate: "Is naam ka product pehle se maujood hai.",
      balance: "Baqaya",
      customer: "Customer",
      amount: "Raqam (Rs)",
      name: "Naam",
      phone: "Phone",
      address: "Pata",
      note: "Note",
      date: "Tareekh",
      subject: "Mazmoon",
      chapter: "Baab / mauzu",
      count: "Sawalaat ki tadaad",
      difficulty: "Mushkil ki satah",
      material: "Material paste karein (ikhtiyari)",
      generate: "Tayyar karein",
      summarize: "AI se khulasa",
      title: "Unwaan",
      content: "Text",
      task: "Kaam",
      due: "Aakhri tareekh",
      front: "Samne (sawal)",
      backSide: "Peechay (jawab)",
      addCard: "Card shamil karein",
      flashcards: "Flashcards",
      mock: "Mock test banayein",
      mcq: "MCQs banayein",
      summary: "Baab ke khulaase",
      notes: "Mere notes",
      planner: "Study planner",
      credit: "Udhar khaata",
      customers: "Customers",
      sales: "Rozana farokht",
      expenses: "Akhrajaat",
      payments: "Adaigiyon ki history",
      stock: "Stock notes",
      quantity: "Miqdaar",
      price: "Qeemat per unit (Rs)",
      product: "Stock se product",
      item: "Cheez",
      paymentType: "Adaigi ki qism",
      cash: "Naqad",
      creditType: "Udhar",
      category: "Category",
      low: "Kam stock alert",
      selectCustomer: "— Customer chunein —",
      otherItem: "— Doosri cheez —",
      noCustomer: "Pehle customer shamil karein.",
      lowStock: "Stock kam hai",
      tasksDone: "Mukammal kaam",
      savedChapters: "Mehfooz baab",
      showAnswer: "Jawab dikhayein",
      hideAnswer: "Jawab chhupayein",
      markDone: "Mukammal karein",
      reopen: "Dobara kholein",
      confirmCustomer: "Customer aur us ke related records delete karein?",
      sCustomers: "Customers",
      sOutstanding: "Baqaya raqam",
      sOwing: "Baqaya wale customers",
      sSalesToday: "Aaj ki farokht",
      sSalesAll: "Kul farokht",
      sExpenses: "Kul akhrajaat",
      sProfit: "Farokht minus akhrajaat",
      sReceived: "Kul wusooli",
      sProducts: "Products",
      sLow: "Kam stock",
      sValue: "Stock ki maalyat",
      saveChapter: "Baab mehfooz karein",
      saveOut: "Baab mein mehfooz karein",
      saveCards: "Cards mehfooz karein",
      addCardAI: "AI se cards banayein",
      easy: "Aasaan",
      medium: "Darmiyana",
      hard: "Mushkil"
    },

    pa: {
      newChat: "نئی گفتگو",
      general: "عام معاون",
      student: "طالب علم",
      shopkeeper: "دکاندار",
      recent: "حالیہ گفتگو",
      clear: "صاف کریں",
      language: "زبان",
      largerText: "وڈا متن",
      about: "زبان اے آئی بارے",
      welcome: "اج میں تہاڈی کی مدد کراں؟",
      welcomeIntro: "کجھ وی پچھو، اپنی زبان وچ جواب حاصل کرو۔",
      placeholder: "زبان اے آئی نوں لکھو...",
      hint: "تہاڈی زبان، تہاڈا انداز۔",
      send: "بھیجو",
      thinking: "سوچ ریا ہاں...",
      back: "واپس",
      add: "شامل کرو",
      update: "اپڈیٹ کرو",
      edit: "ترمیم کرو",
      delete: "مٹاؤ",
      cancel: "منسوخ",
      save: "محفوظ کرو",
      gotIt: "سمجھ آ گئی",
      online: "آن لائن",
      offline: "آف لائن",
      ready: "مدد لئی تیار",
      listening: "سن ریا ہاں...",
      customer: "گاہک",
      amount: "رقم (روپے)",
      name: "ناں",
      phone: "فون",
      address: "پتہ",
      note: "نوٹ",
      date: "تاریخ",
      subject: "مضمون",
      chapter: "باب / موضوع",
      difficulty: "مشکل دا درجہ",
      generate: "تیار کرو",
      summarize: "خلاصہ بناؤ",
      title: "عنوان",
      content: "متن",
      task: "کم",
      due: "آخری تاریخ",
      flashcards: "فلیش کارڈز",
      summary: "باباں دے خلاصے",
      notes: "میرے نوٹس",
      planner: "پڑھائی دا منصوبہ",
      customers: "گاہک",
      sales: "روزانہ دی فروخت",
      expenses: "اخراجات",
      stock: "سٹاک",
      quantity: "تعداد",
      price: "قیمت (روپے)",
      product: "سٹاک وچوں پروڈکٹ",
      item: "چیز",
      cash: "نقد",
      category: "قسم",
      lowStock: "سٹاک گھٹ اے",
      showAnswer: "جواب وکھاؤ",
      hideAnswer: "جواب لُکاؤ",
      markDone: "مکمل کرو",
      reopen: "دوبارہ کھولو",
      easy: "آسان",
      medium: "درمیانہ",
      hard: "اوکھا"
    }
  };

  /* =====================================
     8. URDU DICTIONARY
  ===================================== */

  const UR = {
    ...TEXT.en,

    newChat: "نئی گفتگو",
    general: "عمومی معاون",
    student: "طالب علم",
    shopkeeper: "دکاندار",
    recent: "حالیہ گفتگو",
    clear: "صاف کریں",
    language: "زبان",
    largerText: "بڑا متن",
    about: "زبان اے آئی کے بارے میں",
    welcome: "آج میں آپ کی کیا مدد کروں؟",
    welcomeIntro: "کچھ بھی پوچھیں۔ اپنی سمجھ کی زبان میں واضح جواب پائیں۔",
    placeholder: "زبان اے آئی کو لکھیں...",
    hint: "آپ کی زبان، آپ کا انداز۔",
    send: "بھیجیں",
    disclaimer: "زبان اے آئی سے غلطی ہو سکتی ہے۔ اہم معلومات کی تصدیق کریں۔",
    thinking: "سوچ رہا ہوں...",
    emptyHistory: "آپ کی گفتگو یہاں نظر آئے گی۔",
    noRecords: "ابھی کوئی ریکارڈ نہیں۔",
    savedEmpty: "آپ کے محفوظ ابواب یہاں نظر آئیں گے۔",
    back: "← واپس",
    add: "شامل کریں",
    update: "اپ ڈیٹ کریں",
    edit: "ترمیم",
    delete: "حذف کریں",
    cancel: "منسوخ",
    save: "محفوظ کریں",
    gotIt: "سمجھ گیا",
    online: "آن لائن",
    offline: "آف لائن",
    ready: "مدد کے لیے تیار",
    notConnected: "اے آئی سروس منسلک نہیں",
    listening: "سن رہا ہوں...",
    errNoApi: "اے آئی سروس منسلک نہیں۔ app.js میں API_URL ترتیب دیں۔",
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
    toastSaved: "محفوظ ہو گیا",
    toastUpdated: "اپ ڈیٹ ہو گیا",
    toastDeleted: "حذف ہو گیا",
    toastStorage: "ڈیٹا محفوظ نہیں ہو سکا۔",
    confirmHistory: "کیا تمام گفتگو حذف کریں؟",
    confirmDelete: "کیا اسے حذف کریں؟",
    errRequired: "براہِ کرم ضروری خانے پُر کریں۔",
    errName: "نام درج کریں۔",
    errAmount: "صفر سے زیادہ رقم درج کریں۔",
    errNumber: "درست عدد درج کریں۔",
    errCustomer: "گاہک منتخب کریں۔",
    errOverpay: "ادائیگی بقایا رقم سے زیادہ ہے۔",
    errStock: "اس فروخت کے لیے اسٹاک کافی نہیں۔",
    errItem: "چیز لکھیں یا پروڈکٹ منتخب کریں۔",
    errDuplicate: "اس نام کا پروڈکٹ پہلے سے موجود ہے۔",
    balance: "بقایا",
    customer: "گاہک",
    amount: "رقم (روپے)",
    name: "نام",
    phone: "فون",
    address: "پتہ",
    note: "نوٹ",
    date: "تاریخ",
    subject: "مضمون",
    chapter: "باب / موضوع",
    count: "سوالات کی تعداد",
    difficulty: "مشکل کی سطح",
    material: "مواد چسپاں کریں (اختیاری)",
    generate: "تیار کریں",
    summarize: "اے آئی سے خلاصہ",
    title: "عنوان",
    content: "متن",
    task: "کام",
    due: "آخری تاریخ",
    front: "سامنے (سوال)",
    backSide: "پیچھے (جواب)",
    addCard: "کارڈ شامل کریں",
    flashcards: "فلیش کارڈز",
    mock: "ماک ٹیسٹ بنائیں",
    mcq: "MCQs بنائیں",
    summary: "ابواب کے خلاصے",
    notes: "میرے نوٹس",
    planner: "مطالعے کا منصوبہ",
    credit: "ادھار کھاتہ",
    customers: "گاہک",
    sales: "روزانہ فروخت",
    expenses: "اخراجات",
    payments: "ادائیگیوں کی تاریخ",
    stock: "اسٹاک نوٹس",
    quantity: "مقدار",
    price: "فی یونٹ قیمت (روپے)",
    product: "اسٹاک سے پروڈکٹ",
    item: "چیز",
    paymentType: "ادائیگی کی قسم",
    cash: "نقد",
    creditType: "ادھار",
    category: "زمرہ",
    low: "کم اسٹاک الرٹ",
    selectCustomer: "— گاہک منتخب کریں —",
    otherItem: "— دوسری چیز —",
    noCustomer: "پہلے گاہک شامل کریں۔",
    lowStock: "اسٹاک کم ہے",
    tasksDone: "مکمل کام",
    savedChapters: "محفوظ ابواب",
    showAnswer: "جواب دکھائیں",
    hideAnswer: "جواب چھپائیں",
    markDone: "مکمل کریں",
    reopen: "دوبارہ کھولیں",
    confirmCustomer: "گاہک اور متعلقہ ریکارڈ حذف کریں؟",
    sCustomers: "گاہک",
    sOutstanding: "بقایا رقم",
    sOwing: "بقایا والے گاہک",
    sSalesToday: "آج کی فروخت",
    sSalesAll: "کل فروخت",
    sExpenses: "کل اخراجات",
    sProfit: "فروخت − اخراجات",
    sReceived: "کل وصولی",
    sProducts: "پروڈکٹس",
    sLow: "کم اسٹاک",
    sValue: "اسٹاک کی مالیت",
    saveChapter: "باب محفوظ کریں",
    saveOut: "ابواب میں محفوظ کریں",
    saveCards: "یہ کارڈ محفوظ کریں",
    addCardAI: "اے آئی سے کارڈ بنائیں",
    easy: "آسان",
    medium: "درمیانہ",
    hard: "مشکل"
  };

  /* =====================================
     9. SINDHI DICTIONARY
  ===================================== */

  TEXT.sd = {
    ...TEXT.en,
    newChat: "نئين گفتگو",
    general: "عام مددگار",
    student: "شاگرد",
    shopkeeper: "دڪاندار",
    recent: "تازيون ڳالهيون",
    clear: "صاف ڪريو",
    language: "ٻولي",
    largerText: "وڏو متن",
    about: "زبان AI بابت",
    welcome: "اڄ مان توهان جي ڪهڙي مدد ڪري سگهان ٿو؟",
    welcomeIntro: "ڪجهه به پڇو.",
    placeholder: "پنهنجو سوال هتي لکو...",
    hint: "پنهنجو سوال لکو",
    send: "موڪليو",
    thinking: "سوچي رهيو آهي...",
    back: "واپس",
    add: "شامل ڪريو",
    update: "اپڊيٽ ڪريو",
    edit: "تبديل ڪريو",
    delete: "ختم ڪريو",
    cancel: "رد ڪريو",
    save: "محفوظ ڪريو",
    gotIt: "سمجهي ويس",
    online: "آن لائن",
    offline: "آف لائن",
    ready: "تيار",
    listening: "ٻڌي رهيو آهي...",
    customer: "گراهڪ",
    amount: "رقم",
    name: "نالو",
    phone: "فون",
    address: "پتو",
    note: "نوٽ",
    date: "تاريخ",
    subject: "مضمون",
    chapter: "باب",
    difficulty: "ڏکيائي",
    generate: "تيار ڪريو",
    summarize: "خلاصو",
    title: "عنوان",
    content: "مواد",
    task: "ڪم",
    due: "آخري تاريخ",
    flashcards: "فليش ڪارڊ",
    summary: "خلاصو",
    notes: "نوٽس",
    planner: "منصوبه بندي",
    customers: "گراهڪ",
    sales: "وڪرو",
    expenses: "خرچ",
    stock: "اسٽاڪ",
    quantity: "مقدار",
    price: "قيمت",
    product: "پراڊڪٽ",
    item: "شيءِ",
    cash: "نقد",
    category: "قسم",
    lowStock: "گهٽ اسٽاڪ",
    showAnswer: "جواب ڏيکاريو",
    hideAnswer: "جواب لڪايو",
    markDone: "مڪمل ڪريو",
    reopen: "ٻيهر کوليو",
    easy: "آسان",
    medium: "وچولو",
    hard: "مشڪل"
  };

  /* =====================================
     10. PASHTO DICTIONARY
  ===================================== */

  TEXT.ps = {
    ...TEXT.en,
    newChat: "نوې خبرې اترې",
    general: "عمومي مرستیال",
    student: "زده کوونکی",
    shopkeeper: "دوکاندار",
    recent: "وروستۍ خبرې اترې",
    clear: "پاکول",
    language: "ژبه",
    largerText: "لوی متن",
    about: "د زبان AI په اړه",
    welcome: "نن څنګه مرسته درسره وکړم؟",
    welcomeIntro: "هر څه وپوښتئ. په خپله خوښه ژبه روښانه ځوابونه ترلاسه کړئ.",
    placeholder: "Zubaan AI ته پیغام ولیکئ...",
    hint: "ستاسو ژبه، ستاسو طریقه.",
    send: "لېږل",
    thinking: "فکر کوم...",
    back: "← شاته",
    add: "زیاتول",
    update: "تازه کول",
    edit: "سمول",
    delete: "ړنګول",
    cancel: "لغوه کول",
    save: "ساتل",
    gotIt: "سمه ده",
    online: "آنلاین",
    offline: "آفلاین",
    ready: "مرستې ته چمتو",
    listening: "اورم...",
    customer: "پېرودونکی",
    amount: "اندازه (روپۍ)",
    name: "نوم",
    phone: "ټیلیفون",
    address: "پته",
    note: "یادښت",
    date: "نېټه",
    subject: "مضمون",
    chapter: "څپرکی / موضوع",
    difficulty: "د ستونزمنوالي کچه",
    generate: "جوړول",
    summarize: "د AI له لارې لنډیز",
    title: "سرلیک",
    content: "متن",
    task: "دنده",
    due: "وروستۍ نېټه",
    flashcards: "فلش کارتونه",
    summary: "د څپرکو لنډیزونه",
    notes: "زما یادښتونه",
    planner: "د زده کړې پلان",
    customers: "پېرودونکي",
    sales: "ورځنی پلور",
    expenses: "لګښتونه",
    stock: "د زېرمو یادښتونه",
    quantity: "اندازه",
    price: "د واحد بیه (روپۍ)",
    product: "له زېرمو څخه محصول",
    item: "توکی",
    cash: "نغدې پیسې",
    category: "کټګوري",
    showAnswer: "ځواب ښکاره کړئ",
    hideAnswer: "ځواب پټ کړئ",
    markDone: "بشپړ شوی وټاکئ",
    reopen: "بیا پرانیستل",
    easy: "اسانه",
    medium: "منځنۍ",
    hard: "ستونزمن"
  };

  /* =====================================
     11. TRANSLATION LOOKUP
  ===================================== */

  function t(key) {
    const dictionaries = {
      en: TEXT.en,
      roman: TEXT.roman,
      ur: UR,
      pa: TEXT.pa,
      sd: TEXT.sd,
      ps: TEXT.ps
    };

    const dictionary = dictionaries[state.lang] || TEXT.en;

    return dictionary[key] || TEXT.en[key] || key;
  }

  /* =====================================
     PART 2 COMPLETE
     PART 3 CONTINUES BELOW
  ===================================== */
   /* =====================================
     12. CHAT UTILITIES
  ===================================== */

  function getCurrentConversation() {
    return state.conversations.find(
      conversation => conversation.id === state.currentId
    ) || null;
  }

  function createConversation() {
    const conversation = {
      id: uid(),
      title: "New chat",
      mode: state.mode,
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

    if (!conversation) {
      conversation = createConversation();
    }

    return conversation;
  }

  function updateConversationTitle(conversation) {
    if (!conversation || !conversation.messages.length) return;

    const firstUserMessage = conversation.messages.find(
      message => message.role === "user"
    );

    if (!firstUserMessage) return;

    conversation.title = firstUserMessage.content
      .trim()
      .slice(0, 42);

    if (firstUserMessage.content.length > 42) {
      conversation.title += "...";
    }
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
     13. MESSAGE RENDERING
  ===================================== */

  function formatMessageText(value) {
    const escaped = escapeHTML(value);

    return escaped
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/`([^`]+)`/g, "<code>$1</code>")
      .replace(/\n/g, "<br>");
  }

  function createMessageElement(message) {
    const wrapper = element("article", {
      class: `message message-${message.role}`,
      dataset: {
        messageId: message.id
      }
    });

    const label = element("div", {
      class: "message-label",
      text: message.role === "user"
        ? "You"
        : "Zubaan AI"
    });

    const body = element("div", {
      class: "message-content"
    });

    body.innerHTML = formatMessageText(message.content);

    wrapper.append(label, body);

    return wrapper;
  }

  function renderMessages() {
    const container = $("#generalMessages");
    const conversationArea = $("#generalConversation");
    const welcome = $("#welcomeContainer");

    if (!container) return;

    container.replaceChildren();

    const conversation = getCurrentConversation();
    const messages = conversation?.messages || [];

    if (welcome) {
      welcome.hidden = messages.length > 0;
    }

    if (conversationArea) {
      conversationArea.hidden = messages.length === 0;
    }

    messages.forEach(message => {
      container.append(createMessageElement(message));
    });

    container.scrollTop = container.scrollHeight;
  }

  /* =====================================
     14. CHAT HISTORY
  ===================================== */

  function renderHistory() {
    const list = $("#recentList");
    const empty = $("#emptyHistoryText");

    if (!list) return;

    list.querySelectorAll(".history-item").forEach(item => item.remove());

    const conversations = [...state.conversations]
      .sort((a, b) =>
        new Date(b.updatedAt || 0) -
        new Date(a.updatedAt || 0)
      );

    if (empty) {
      empty.hidden = conversations.length > 0;
      empty.textContent = t("emptyHistory");
    }

    conversations.forEach(conversation => {
      const button = element("button", {
        class: "history-item" +
          (conversation.id === state.currentId ? " active" : ""),
        type: "button",
        dataset: {
          conversationId: conversation.id
        }
      });

      const title = element("span", {
        class: "history-item-title",
        text: conversation.title || "New chat"
      });

      button.append(title);

      button.addEventListener("click", () => {
        openConversation(conversation.id);
      });

      list.append(button);
    });
  }

  function openConversation(id) {
    const conversation = state.conversations.find(
      item => item.id === id
    );

    if (!conversation) return;

    state.currentId = id;

    if (MODES.includes(conversation.mode)) {
      setMode(conversation.mode, false);
    }

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
     15. MODE SWITCHING
  ===================================== */

  function setMode(mode, save = true) {
    if (!MODES.includes(mode)) return;

    state.mode = mode;

    $$("[data-mode]").forEach(button => {
      const active = button.dataset.mode === mode;

      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    });

    $$("[data-workspace]").forEach(workspace => {
      const active = workspace.dataset.workspace === mode;

      workspace.classList.toggle("active", active);
      workspace.hidden = !active;
    });

    const title = $("#currentModeTitle");

    if (title) {
      title.textContent = t(mode);
    }

    const chatArea = $("#sharedChatArea");

    if (chatArea) {
      chatArea.hidden = false;
    }

    if (save) {
      const conversation = getCurrentConversation();

      if (conversation) {
        conversation.mode = mode;
      }

      persist();
    }

    if (mode === "student") {
      renderChapters();
    }

    if (mode === "shopkeeper") {
      renderShopDashboard();
    }

    closeSidebar();
  }

  /* =====================================
     16. AI REQUEST HANDLER
  ===================================== */

  async function requestAI(payload) {
    if (!CONFIG.API_URL) {
      throw new Error("AI_NOT_CONNECTED");
    }

    if (!navigator.onLine) {
      throw new Error("OFFLINE");
    }

    const controller = new AbortController();

    const timeout = setTimeout(
      () => controller.abort(),
      CONFIG.API_TIMEOUT
    );

    try {
      const response = await fetch(CONFIG.API_URL, {
        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify(payload),

        signal: controller.signal
      });

      if (!response.ok) {
        throw new Error(`HTTP_${response.status}`);
      }

      const data = await response.json();

      const answer =
        data.answer ||
        data.response ||
        data.message ||
        data.content ||
        data.result;

      if (typeof answer !== "string" || !answer.trim()) {
        throw new Error("INVALID_RESPONSE");
      }

      return answer.trim();

    } catch (error) {
      if (error.name === "AbortError") {
        throw new Error("TIMEOUT");
      }

      throw error;

    } finally {
      clearTimeout(timeout);
    }
  }

  function getAIErrorMessage(error) {
    if (error.message === "AI_NOT_CONNECTED") {
      return t("errNoApi");
    }

    if (error.message === "OFFLINE") {
      return t("errOffline");
    }

    if (error.message === "TIMEOUT") {
      return t("errTimeout");
    }

    if (error.message === "INVALID_RESPONSE") {
      return t("errInvalid");
    }

    return t("errRequest");
  }

  /* =====================================
     17. SEND CHAT MESSAGE
  ===================================== */

  async function sendMessage(rawMessage) {
    const message = String(rawMessage || "").trim();

    if (!message) {
      showToast(t("errEmpty"), "warning");
      return;
    }

    if (message.length > CONFIG.MAX_MESSAGE_LENGTH) {
      showToast(
        `Maximum ${CONFIG.MAX_MESSAGE_LENGTH} characters allowed.`,
        "warning"
      );
      return;
    }

    if (state.pending.has("chat")) return;

    const input = $("#question");
    const sendButton = $("#askButton");

    state.pending.add("chat");

    if (input) {
      input.value = "";
      input.disabled = true;
      updateCharacterCount();
    }

    if (sendButton) {
      sendButton.disabled = true;
    }

    const conversation = ensureConversation();

    addMessage("user", message);

    const loading = element("div", {
      class: "message message-assistant message-loading",
      text: t("thinking")
    });

    const messagesContainer = $("#generalMessages");

    if (messagesContainer) {
      messagesContainer.append(loading);
    }

    try {
      const history = conversation.messages
        .slice(-12)
        .map(item => ({
          role: item.role,
          content: item.content
        }));

      const answer = await requestAI({
        message,
        mode: state.mode,
        language: state.lang,
        history
      });

      loading.remove();

      addMessage("assistant", answer);

    } catch (error) {
      loading.remove();

      addMessage(
        "assistant",
        getAIErrorMessage(error)
      );

    } finally {
      state.pending.delete("chat");

      if (input) {
        input.disabled = false;
        input.focus();
      }

      if (sendButton) {
        sendButton.disabled = false;
      }

      renderMessages();
    }
  }

  /* =====================================
     18. CHARACTER COUNTER
  ===================================== */

  function updateCharacterCount() {
    const input = $("#question");
    const counter = $("#charCount");

    if (!input || !counter) return;

    counter.textContent =
      `${input.value.length}/${CONFIG.MAX_MESSAGE_LENGTH}`;
  }

  /* =====================================
     19. SIDEBAR
  ===================================== */

  function openSidebar() {
    const sidebar = $("#sidebar");

    if (!sidebar) return;

    sidebar.classList.add("open");
    state.ui.sidebar = true;
  }

  function closeSidebar() {
    const sidebar = $("#sidebar");

    if (!sidebar) return;

    sidebar.classList.remove("open");
    state.ui.sidebar = false;
  }

  /* =====================================
     PART 3 COMPLETE
     PART 4 CONTINUES BELOW
  ===================================== */
   /* =====================================
     20. STUDENT: SAVED CHAPTERS
  ===================================== */

  function renderChapters() {
    const container = $("#savedChapters");
    if (!container) return;

    container.replaceChildren();

    if (!state.student.chapters.length) {
      container.append(
        element("p", {
          text: t("savedEmpty")
        })
      );
      return;
    }

    state.student.chapters.forEach(chapter => {
      const card = element("article", {
        class: "saved-chapter-card"
      });

      const heading = element("h3", {
        text: chapter.title || "Untitled chapter"
      });

      const description = element("p", {
        text: chapter.content || ""
      });

      const date = element("small", {
        text: chapter.createdAt
          ? new Date(chapter.createdAt).toLocaleDateString()
          : ""
      });

      const deleteButton = element("button", {
        type: "button",
        class: "text-button",
        text: t("delete")
      });

      deleteButton.addEventListener("click", () => {
        if (!confirm(t("confirmDelete"))) return;

        state.student.chapters =
          state.student.chapters.filter(item => item.id !== chapter.id);

        persist();
        renderChapters();
        showToast(t("toastDeleted"));
      });

      card.append(heading, description, date, deleteButton);
      container.append(card);
    });
  }

  function saveChapter(title, content) {
    if (!String(title || "").trim() ||
        !String(content || "").trim()) {
      showToast(t("errRequired"), "warning");
      return;
    }

    state.student.chapters.unshift({
      id: uid(),
      title: String(title).trim(),
      content: String(content).trim(),
      createdAt: new Date().toISOString()
    });

    persist();
    renderChapters();
    showToast(t("toastSaved"));
  }

  /* =====================================
     21. STUDENT: TOOL PANEL
  ===================================== */

  const STUDENT_TOOLS = {
    mock: {
      title: "Make a mock test",
      description: "Create a practice test from your saved chapters."
    },
    mcq: {
      title: "Generate MCQs",
      description: "Generate multiple-choice questions for revision."
    },
    summary: {
      title: "Chapter summaries",
      description: "Create a summary from your saved study material."
    },
    flashcards: {
      title: "Flashcards",
      description: "Create question and answer cards."
    },
    notes: {
      title: "My notes",
      description: "Write and save your personal notes."
    },
    planner: {
      title: "Study planner",
      description: "Organise your study tasks and deadlines."
    }
  };

  function studentField(label, name, type = "text", options = {}) {
    const wrapper = element("label", {
      class: "form-field"
    });

    wrapper.append(
      element("span", { text: label })
    );

    let input;

    if (type === "textarea") {
      input = element("textarea", {
        name,
        rows: options.rows || 4,
        placeholder: options.placeholder || ""
      });
    } else if (type === "select") {
      input = element("select", { name });

      (options.choices || []).forEach(choice => {
        input.append(
          element("option", {
            value: choice.value,
            text: choice.label
          })
        );
      });
    } else {
      input = element("input", {
        name,
        type,
        placeholder: options.placeholder || "",
        ...(options.required ? { required: true } : {})
      });
    }

    wrapper.append(input);
    return wrapper;
  }

  function studentForm(fields, submitLabel, callback) {
    const form = element("form", {
      class: "tool-form"
    });

    fields.forEach(field => form.append(field));

    const submit = element("button", {
      class: "primary-action",
      type: "submit",
      text: submitLabel
    });

    form.append(submit);

    form.addEventListener("submit", event => {
      event.preventDefault();

      const values = Object.fromEntries(
        new FormData(form).entries()
      );

      callback(values, form);
    });

    return form;
  }

  function openStudentTool(tool) {
    const config = STUDENT_TOOLS[tool];
    const panel = $("#studentToolPanel");
    const content = $("#studentToolContent");
    const title = $("#studentToolTitle");

    if (!config || !panel || !content) return;

    state.ui.studentTool = tool;

    if (title) title.textContent = config.title;

    content.replaceChildren();

    const description = element("p", {
      class: "tool-description",
      text: config.description
    });

    content.append(description);

    if (tool === "notes") {
      renderNotesTool(content);
    } else if (tool === "planner") {
      renderPlannerTool(content);
    } else if (tool === "flashcards") {
      renderFlashcardsTool(content);
    } else {
      renderAIStudentTool(tool, content);
    }

    panel.hidden = false;
    panel.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }

  function renderAIStudentTool(tool, container) {
    const chapters = state.student.chapters;

    const chapterChoices = [
      {
        value: "",
        label: "Select a saved chapter"
      },
      ...chapters.map(chapter => ({
        value: chapter.id,
        label: chapter.title
      }))
    ];

    const form = studentForm([
      studentField("Subject", "subject", "text", {
        required: true,
        placeholder: "e.g. General Science"
      }),
      studentField("Chapter / topic", "chapter", "text", {
        required: true
      }),
      studentField("Saved chapter", "savedChapter", "select", {
        choices: chapterChoices
      }),
      studentField("Number of questions", "count", "number", {
        placeholder: "10"
      }),
      studentField("Difficulty", "difficulty", "select", {
        choices: [
          { value: "easy", label: "Easy" },
          { value: "medium", label: "Medium" },
          { value: "hard", label: "Hard" }
        ]
      }),
      studentField("Additional material", "material", "textarea", {
        placeholder: "Paste study material here (optional)"
      })
    ], "Generate", async values => {
      const saved = chapters.find(
        chapter => chapter.id === values.savedChapter
      );

      const material = [
        saved ? saved.content : "",
        values.material || ""
      ].filter(Boolean).join("\n\n");

      const prompt = tool === "summary"
        ? `Create a clear, structured study summary for ${values.subject}, chapter ${values.chapter}. Use this material:\n${material}`
        : `Create ${Math.min(50, Math.max(1, Number(values.count) || 10))} ${values.difficulty || "medium"} difficulty ${tool === "mock" ? "mock test questions with answers" : "multiple choice questions with four options and correct answers"} for ${values.subject}, chapter ${values.chapter}. Use this material:\n${material}`;

      await generateStudentOutput(tool, prompt, container);
    });

    container.append(form);
  }

  async function generateStudentOutput(tool, prompt, container) {
    if (!CONFIG.API_URL) {
      showToast(t("errNoApi"), "warning");

      const notice = element("p", {
        class: "tool-notice",
        text: "Connect the AI backend to generate this content. Your saved chapters and notes remain available locally."
      });

      container.append(notice);
      return;
    }

    const result = element("div", {
      class: "student-generated-output"
    });

    result.textContent = t("thinking");
    container.append(result);

    try {
      const answer = await requestAI({
        task: tool,
        mode: "student",
        language: state.lang,
        message: prompt
      });

      result.textContent = answer;

      const saveButton = element("button", {
        type: "button",
        class: "secondary-action",
        text: t("saveOut")
      });

      saveButton.addEventListener("click", () => {
        saveChapter(
          STUDENT_TOOLS[tool]?.title || tool,
          answer
        );
      });

      result.append(saveButton);

    } catch (error) {
      result.textContent = getAIErrorMessage(error);
    }
  }

  /* =====================================
     22. STUDENT: NOTES
  ===================================== */

  function renderNotesTool(container) {
    const form = studentForm([
      studentField("Note title", "title", "text", {
        required: true
      }),
      studentField("Note content", "content", "textarea", {
        required: true,
        rows: 6
      })
    ], "Save note", values => {
      state.student.notes.unshift({
        id: uid(),
        title: values.title.trim(),
        content: values.content.trim(),
        createdAt: new Date().toISOString()
      });

      persist();
      showToast(t("toastSaved"));
      openStudentTool("notes");
    });

    container.append(form);

    const list = element("div", {
      class: "student-notes-list"
    });

    state.student.notes.forEach(note => {
      const card = element("article", {
        class: "saved-note-card"
      });

      card.append(
        element("h3", { text: note.title }),
        element("p", { text: note.content })
      );

      const remove = element("button", {
        type: "button",
        class: "text-button",
        text: t("delete")
      });

      remove.addEventListener("click", () => {
        state.student.notes =
          state.student.notes.filter(item => item.id !== note.id);

        persist();
        openStudentTool("notes");
        showToast(t("toastDeleted"));
      });

      card.append(remove);
      list.append(card);
    });

    container.append(list);
  }

  /* =====================================
     23. STUDENT: STUDY PLANNER
  ===================================== */

  function renderPlannerTool(container) {
    const form = studentForm([
      studentField("Subject", "subject", "text", {
        required: true
      }),
      studentField("Study task", "task", "text", {
        required: true
      }),
      studentField("Due date", "due", "date")
    ], "Add study task", values => {
      if (!values.subject.trim() || !values.task.trim()) {
        showToast(t("errRequired"), "warning");
        return;
      }

      state.student.plans.unshift({
        id: uid(),
        subject: values.subject.trim(),
        task: values.task.trim(),
        due: values.due || "",
        done: false,
        createdAt: new Date().toISOString()
      });

      persist();
      showToast(t("toastSaved"));
      openStudentTool("planner");
    });

    container.append(form);

    const list = element("div", {
      class: "planner-list"
    });

    state.student.plans.forEach(plan => {
      const card = element("article", {
        class: "planner-item"
      });

      const details = element("div");

      details.append(
        element("strong", { text: plan.subject }),
        element("p", { text: plan.task }),
        element("small", {
          text: plan.due ? `Due: ${plan.due}` : "No due date"
        })
      );

      if (plan.done) {
        card.classList.add("completed");
      }

      const toggle = element("button", {
        type: "button",
        class: "secondary-action",
        text: plan.done ? "Reopen" : "Mark done"
      });

      toggle.addEventListener("click", () => {
        plan.done = !plan.done;
        persist();
        openStudentTool("planner");
      });

      const remove = element("button", {
        type: "button",
        class: "text-button",
        text: t("delete")
      });

      remove.addEventListener("click", () => {
        state.student.plans =
          state.student.plans.filter(item => item.id !== plan.id);

        persist();
        openStudentTool("planner");
      });

      card.append(details, toggle, remove);
      list.append(card);
    });

    container.append(list);
  }

  /* =====================================
     24. STUDENT: FLASHCARDS
  ===================================== */

  function renderFlashcardsTool(container) {
    const form = studentForm([
      studentField("Question", "front", "text", {
        required: true
      }),
      studentField("Answer", "back", "textarea", {
        required: true
      })
    ], "Add flashcard", values => {
      state.student.cards.unshift({
        id: uid(),
        front: values.front.trim(),
        back: values.back.trim(),
        createdAt: new Date().toISOString()
      });

      persist();
      openStudentTool("flashcards");
      showToast(t("toastSaved"));
    });

    container.append(form);

    const list = element("div", {
      class: "flashcard-list"
    });

    state.student.cards.forEach(card => {
      const item = element("article", {
        class: "saved-flashcard"
      });

      item.append(
        element("strong", { text: card.front }),
        element("p", { text: card.back })
      );

      const remove = element("button", {
        type: "button",
        class: "text-button",
        text: t("delete")
      });

      remove.addEventListener("click", () => {
        state.student.cards =
          state.student.cards.filter(item => item.id !== card.id);

        persist();
        openStudentTool("flashcards");
      });

      item.append(remove);
      list.append(item);
    });

    container.append(list);
  }

  /* =====================================
     25. PDF UPLOAD
  ===================================== */

  let pdfLibraryPromise = null;

  function loadPDFLibrary() {
    if (window.pdfjsLib) {
      return Promise.resolve(window.pdfjsLib);
    }

    if (pdfLibraryPromise) return pdfLibraryPromise;

    pdfLibraryPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");

      script.src =
        "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";

      script.onload = () => {
        if (!window.pdfjsLib) {
          reject(new Error("PDF_LIBRARY_UNAVAILABLE"));
          return;
        }

        window.pdfjsLib.GlobalWorkerOptions.workerSrc =
          "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

        resolve(window.pdfjsLib);
      };

      script.onerror = () => {
        reject(new Error("PDF_LIBRARY_LOAD_FAILED"));
      };

      document.head.append(script);
    });

    return pdfLibraryPromise;
  }

  async function extractPDFText(file) {
    const pdfjs = await loadPDFLibrary();

    const buffer = await file.arrayBuffer();

    const pdf = await pdfjs.getDocument({
      data: new Uint8Array(buffer)
    }).promise;

    const pages = [];

    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
      const page = await pdf.getPage(pageNumber);
      const content = await page.getTextContent();

      const pageText = content.items
        .map(item => item.str || "")
        .join(" ");

      pages.push(pageText);
    }

    return {
      text: pages.join("\n\n"),
      pageCount: pdf.numPages
    };
  }

  async function handlePDFUpload(event) {
    event.preventDefault();

    const form = event.currentTarget;
    const fileInput = $("#bookPdfInput");
    const titleInput = $("#pdfBookTitle");
    const instructions = $("#pdfChapterInstructions");
    const status = $("#pdfUploadStatus");
    const button = $("#pdfUploadButton");

    const file = fileInput?.files?.[0];

    if (!file) {
      showToast("Please choose a PDF file.", "warning");
      return;
    }

    if (
      file.type !== "application/pdf" &&
      !file.name.toLowerCase().endsWith(".pdf")
    ) {
      showToast("Only PDF files are supported.", "warning");
      return;
    }

    if (file.size > 25 * 1024 * 1024) {
      showToast("PDF must be smaller than 25 MB.", "warning");
      return;
    }

    if (button) button.disabled = true;
    if (status) status.textContent = "Reading your PDF...";

    try {
      const extracted = await extractPDFText(file);

      if (!extracted.text.trim()) {
        throw new Error("PDF_NO_TEXT");
      }

      const bookTitle =
        titleInput?.value.trim() ||
        file.name.replace(/\.pdf$/i, "");

      const chapterInstructions =
        instructions?.value.trim() || "All chapters";

      const chapter = {
        id: uid(),
        title: bookTitle,
        content: extracted.text,
        instructions: chapterInstructions,
        pageCount: extracted.pageCount,
        fileName: file.name,
        createdAt: new Date().toISOString()
      };

      state.student.chapters.unshift(chapter);

      persist();
      renderChapters();

      if (status) {
        status.textContent =
          `PDF text extracted from ${extracted.pageCount} pages and saved.`;
      }

      form.reset();
      showToast("PDF content saved successfully.");

    } catch (error) {
      console.error(error);

      const message = error.message === "PDF_NO_TEXT"
        ? "No readable text found. This may be a scanned PDF."
        : "Could not process this PDF. Please try another file.";

      if (status) status.textContent = message;
      showToast(message, "warning");

    } finally {
      if (button) button.disabled = false;
    }
  }

  /* =====================================
     26. SHOPKEEPER DASHBOARD
  ===================================== */

  function renderShopDashboard() {
    const container = $("#shopkeeperWorkspace");
    if (!container) return;

    const totalSales = state.shop.sales.reduce(
      (sum, sale) => sum + (Number(sale.amount) || 0),
      0
    );

    const totalExpenses = state.shop.expenses.reduce(
      (sum, expense) => sum + (Number(expense.amount) || 0),
      0
    );

    const totalOutstanding = state.shop.ledger.reduce(
      (sum, entry) => sum + (Number(entry.amount) || 0),
      0
    );

    const metrics = {
      customers: state.shop.customers.length,
      sales: money(totalSales),
      expenses: money(totalExpenses),
      outstanding: money(totalOutstanding)
    };

    let dashboard = $("#shopDashboardMetrics");

    if (!dashboard) {
      dashboard = element("div", {
        id: "shopDashboardMetrics",
        class: "shop-dashboard-metrics"
      });

      const heading = container.querySelector(".dashboard-heading");

      if (heading) {
        heading.insertAdjacentElement("afterend", dashboard);
      } else {
        container.prepend(dashboard);
      }
    }

    dashboard.replaceChildren();

    Object.entries(metrics).forEach(([label, value]) => {
      const card = element("div", {
        class: "shop-metric-card"
      });

      card.append(
        element("span", { text: label }),
        element("strong", { text: String(value) })
      );

      dashboard.append(card);
    });
  }

  /* =====================================
     27. SHOPKEEPER TOOL PANEL
  ===================================== */

  const SHOP_TOOLS = {
    customers: "Customers",
    credit: "Udhar ledger",
    sales: "Daily sales",
    expenses: "Expenses",
    payments: "Payment history",
    stock: "Stock notes"
  };

  function openShopTool(tool) {
    if (!SHOP_TOOLS[tool]) return;

    state.ui.shopTool = tool;

    const panel = $("#shopToolPanel");
    const title = $("#shopToolTitle");
    const content = $("#shopToolContent");

    if (!panel || !content) return;

    if (title) title.textContent = SHOP_TOOLS[tool];

    content.replaceChildren();

    if (tool === "customers") {
      renderShopCollection(content, "customers", [
        ["name", "Customer name"],
        ["phone", "Phone"],
        ["address", "Address"]
      ]);
    } else if (tool === "credit") {
      renderShopCollection(content, "ledger", [
        ["customer", "Customer"],
        ["amount", "Amount"],
        ["note", "Note"]
      ], true);
    } else if (tool === "sales") {
      renderShopCollection(content, "sales", [
        ["item", "Item"],
        ["amount", "Amount"],
        ["quantity", "Quantity"]
      ]);
    } else if (tool === "expenses") {
      renderShopCollection(content, "expenses", [
        ["title", "Expense"],
        ["amount", "Amount"],
        ["note", "Note"]
      ]);
    } else if (tool === "payments") {
      renderShopCollection(content, "ledger", [
        ["customer", "Customer"],
        ["amount", "Amount"],
        ["note", "Payment note"]
      ]);
    } else if (tool === "stock") {
      renderShopCollection(content, "stock", [
        ["item", "Product"],
        ["quantity", "Quantity"],
        ["price", "Unit price"]
      ]);
    }

    panel.hidden = false;
    panel.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }

  function renderShopCollection(container, collection, fields, isCredit = false) {
    const records = state.shop[collection];

    const form = element("form", {
      class: "tool-form"
    });

    fields.forEach(([name, label]) => {
      const wrapper = element("label", {
        class: "form-field"
      });

      wrapper.append(
        element("span", { text: label })
      );

      const input = element("input", {
        name,
        type: name === "amount" || name === "quantity" ||
          name === "price" ? "number" : "text",
        required: true,
        ...(name === "amount" || name === "quantity" ||
          name === "price" ? { min: "0", step: "0.01" } : {})
      });

      wrapper.append(input);
      form.append(wrapper);
    });

    const submit = element("button", {
      type: "submit",
      class: "primary-action",
      text: "Save record"
    });

    form.append(submit);

    form.addEventListener("submit", event => {
      event.preventDefault();

      const values = Object.fromEntries(
        new FormData(form).entries()
      );

      const record = {
        id: uid(),
        ...values,
        amount: values.amount ? Number(values.amount) : 0,
        quantity: values.quantity ? Number(values.quantity) : 0,
        price: values.price ? Number(values.price) : 0,
        createdAt: new Date().toISOString()
      };

      records.unshift(record);

      if (isCredit) {
        record.type = "credit";
      }

      persist();
      renderShopDashboard();
      openShopTool(state.ui.shopTool);
      showToast(t("toastSaved"));
    });

    container.append(form);

    const list = element("div", {
      class: "shop-record-list"
    });

    records.forEach(record => {
      const card = element("article", {
        class: "shop-record-card"
      });

      fields.forEach(([name, label]) => {
        if (record[name] !== undefined && record[name] !== "") {
          card.append(
            element("p", {
              text: `${label}: ${record[name]}`
            })
          );
        }
      });

      const remove = element("button", {
        type: "button",
        class: "text-button",
        text: t("delete")
      });

      remove.addEventListener("click", () => {
        if (!confirm(t("confirmDelete"))) return;

        state.shop[collection] =
          state.shop[collection].filter(item => item.id !== record.id);

        persist();
        renderShopDashboard();
        openShopTool(state.ui.shopTool);
        showToast(t("toastDeleted"));
      });

      card.append(remove);
      list.append(card);
    });

    container.append(list);
  }

  /* =====================================
     28. VOICE INPUT
  ===================================== */

  let recognition = null;
  let voiceActive = false;
  let voiceTranscript = "";

  function setupVoiceInput() {
    const voiceButton = $("#voiceButton");

    if (!voiceButton) return;

    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      voiceButton.addEventListener("click", () => {
        showToast(t("errVoice"), "warning");
      });
      return;
    }

    recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      voiceActive = true;
      voiceTranscript = "";

      voiceButton.classList.add("recording");
      voiceButton.setAttribute("aria-pressed", "true");

      const hint = $("#composerHint");

      if (hint) hint.textContent = t("listening");
    };

    recognition.onresult = event => {
      let finalText = "";
      let interimText = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;

        if (event.results[i].isFinal) {
          finalText += transcript;
        } else {
          interimText += transcript;
        }
      }

      if (finalText) {
        voiceTranscript += finalText;
      }

      const input = $("#question");

      if (input) {
        input.value = [
          input.value,
          voiceTranscript,
          interimText
        ].filter(Boolean).join(" ").trim();

        updateCharacterCount();
      }
    };

    recognition.onerror = () => {
      showToast(t("errVoiceFail"), "warning");
    };

    recognition.onend = () => {
      voiceActive = false;

      voiceButton.classList.remove("recording");
      voiceButton.setAttribute("aria-pressed", "false");

      const hint = $("#composerHint");

      if (hint) hint.textContent = t("hint");

      const input = $("#question");

      if (input && input.value.trim()) {
        sendMessage(input.value.trim());
      }
    };

    voiceButton.addEventListener("click", () => {
      if (voiceActive) {
        recognition.stop();
        return;
      }

      try {
        recognition.lang =
          LANGUAGES[state.lang]?.speech || "ur-PK";

        recognition.start();
      } catch (error) {
        showToast(t("errVoiceFail"), "warning");
      }
    });
  }

  /* =====================================
     29. LANGUAGE AND TEXT SETTINGS
  ===================================== */

  function updateLanguage(language) {
    if (!LANGUAGES[language]) return;

    state.lang = language;

    safeStoreSet(STORAGE.language, language);

    document.documentElement.lang =
      language === "roman" ? "en" : language;

    document.documentElement.dir =
      LANGUAGES[language].direction;

    const welcomeTitle = $("#welcomeTitle");
    const welcomeIntro = $("#welcomeIntro");
    const input = $("#question");

    if (welcomeTitle) {
      welcomeTitle.textContent = t("welcome");
    }

    if (welcomeIntro) {
      welcomeIntro.textContent = t("welcomeIntro");
    }

    if (input) {
      input.placeholder = t("placeholder");
    }

    const currentTitle = $("#currentModeTitle");

    if (currentTitle) {
      currentTitle.textContent = t(state.mode);
    }

    renderHistory();
    renderMessages();

    showToast(t("toastLang"));
  }

  function toggleLargeText() {
    state.largeText = !state.largeText;

    document.body.classList.toggle(
      "large-text",
      state.largeText
    );

    safeStoreSet(STORAGE.largeText, state.largeText);
  }

  /* =====================================
     30. ABOUT DIALOG
  ===================================== */

  function openAbout() {
    const dialog = $("#aboutDialog");

    if (!dialog) return;

    if (typeof dialog.showModal === "function") {
      dialog.showModal();
    } else {
      dialog.hidden = false;
    }
  }

  function closeAbout() {
    const dialog = $("#aboutDialog");

    if (!dialog) return;

    if (typeof dialog.close === "function") {
      dialog.close();
    } else {
      dialog.hidden = true;
    }
  }

  /* =====================================
     31. EVENT LISTENERS
  ===================================== */

  function bindEvents() {
    $("#newChat")?.addEventListener("click", startNewChat);
    $("#headerNewChat")?.addEventListener("click", startNewChat);

    $("#clearHistory")?.addEventListener(
      "click",
      clearChatHistory
    );

    $("#openSidebar")?.addEventListener("click", openSidebar);
    $("#closeSidebar")?.addEventListener("click", closeSidebar);

    $("#helpButton")?.addEventListener("click", openAbout);
    $("#aboutButton")?.addEventListener("click", openAbout);
    $("#closeAbout")?.addEventListener("click", closeAbout);

    $("#largeText")?.addEventListener("click", toggleLargeText);

    $("#language")?.addEventListener("change", event => {
      updateLanguage(event.target.value);
    });

    $$("[data-mode]").forEach(button => {
      button.addEventListener("click", () => {
        setMode(button.dataset.mode);
      });
    });

    $$("[data-student-tool]").forEach(button => {
      button.addEventListener("click", () => {
        openStudentTool(button.dataset.studentTool);
      });
    });

    $$("[data-shop-tool]").forEach(button => {
      button.addEventListener("click", () => {
        openShopTool(button.dataset.shopTool);
      });
    });

    $("#backToStudent")?.addEventListener("click", () => {
      state.ui.studentTool = null;

      const panel = $("#studentToolPanel");
      if (panel) panel.hidden = true;
    });

    $("#backToShop")?.addEventListener("click", () => {
      state.ui.shopTool = null;

      const panel = $("#shopToolPanel");
      if (panel) panel.hidden = true;
    });

    $("#pdfUploadForm")?.addEventListener(
      "submit",
      handlePDFUpload
    );

    $("#questionForm")?.addEventListener("submit", event => {
      event.preventDefault();

      const input = $("#question");

      if (input) {
        sendMessage(input.value);
      }
    });

    $("#question")?.addEventListener(
      "input",
      updateCharacterCount
    );

    $("#question")?.addEventListener("keydown", event => {
      if (
        event.key === "Enter" &&
        !event.shiftKey &&
        !event.isComposing
      ) {
        event.preventDefault();
        $("#questionForm")?.requestSubmit();
      }
    });

    document.addEventListener("keydown", event => {
      if (event.key === "Escape") {
        closeSidebar();
      }
    });
  }

  /* =====================================
     32. INITIALIZE APPLICATION
  ===================================== */

  function initializeApp() {
    loadSavedData();

    const languageSelect = $("#language");

    if (languageSelect) {
      languageSelect.value = state.lang;
    }

    document.body.classList.toggle(
      "large-text",
      state.largeText
    );

    document.documentElement.dir =
      LANGUAGES[state.lang].direction;

    document.documentElement.lang =
      state.lang === "roman" ? "en" : state.lang;

    const welcomeTitle = $("#welcomeTitle");
    const welcomeIntro = $("#welcomeIntro");
    const input = $("#question");

    if (welcomeTitle) {
      welcomeTitle.textContent = t("welcome");
    }

    if (welcomeIntro) {
      welcomeIntro.textContent = t("welcomeIntro");
    }

    if (input) {
      input.placeholder = t("placeholder");
    }

    bindEvents();
    setupVoiceInput();

    renderHistory();
    renderMessages();
    renderChapters();
    renderShopDashboard();

    setMode(state.mode, false);

    const connection = $("#connection");
    const connectionText = $("#connectionText");

    if (!CONFIG.API_URL) {
      if (connection) {
        connection.classList.add("disconnected");

        const label = connection.querySelector("span:last-child");
        if (label) label.textContent = t("notConnected");
      }

      if (connectionText) {
        connectionText.textContent = t("ready");
      }
    }

    updateCharacterCount();

    window.addEventListener("online", () => {
      showToast("Internet connection restored.");
    });

    window.addEventListener("offline", () => {
      showToast(t("errOffline"), "warning");
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeApp, {
      once: true
    });
  } else {
    initializeApp();
  }

})();
