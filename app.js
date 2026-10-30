/**
 * Zubaan AI — app.js
 * Existing HTML and CSS ke saath compatible vanilla JavaScript.
 */
(() => {
  "use strict";

  if (window.__zubaanApp) return;
  window.__zubaanApp = true;

  /* CONFIG */
  const API_URL = "";
  const API_TIMEOUT = 30000;
  const TOAST_DURATION = 3500;

  const LANGUAGES = ["roman", "ur", "en", "pa", "sd", "ps"];
  const LANGUAGE_NAMES = {
    roman: "Roman Urdu",
    ur: "Urdu",
    en: "English",
    pa: "Punjabi",
    sd: "Sindhi",
    ps: "Pashto"
  };

  const SPEECH_LANGUAGES = {
    roman: "ur-PK",
    ur: "ur-PK",
    en: "en-US",
    pa: "pa-Arab-PK",
    sd: "sd-PK",
    ps: "ps-AF"
  };

  const MODES = ["general", "student", "shopkeeper"];

  const STORAGE = {
    data: "zubaan.data.v2",
    language: "zubaan.lang",
    largeText: "zubaan.largeText"
  };

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
      errNoApi: "AI service is not connected. Please configure API_URL in app.js.",
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
      noCustomer: "Add a customer first (Customers tool).",
      lowStock: "Low stock",
      tasksDone: "Tasks done",
      savedChapters: "Saved chapters",
      showAnswer: "Show answer",
      hideAnswer: "Hide answer",
      markDone: "Mark done",
      reopen: "Reopen",
      confirmCustomer: "Delete this customer and their related records?",
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
      sProfit: "Farokht − akhrajaat",
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
    }
  };

  const UR = {
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
    errNoApi: "اے آئی سروس ابھی منسلک نہیں۔ app.js میں API_URL ترتیب دیں۔",
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

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 9);
  const today = () => new Date().toISOString().slice(0, 10);
  const money = value => "Rs " + (Number(value) || 0).toLocaleString();

  function t(key) {
    if (state.lang === "ur") return UR[key] || TEXT.en[key] || key;
    if (state.lang === "roman") return TEXT.roman[key] || TEXT.en[key] || key;
    return TEXT.en[key] || key;
  }

  function safeStoreGet(key, fallback) {
    try {
      const value = localStorage.getItem(key);
      return value === null ? fallback : JSON.parse(value);
    } catch {
      return fallback;
    }
  }

  function safeStoreSet(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch {
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
          if (val !== undefined && val !== null) node.dataset[name] = val;
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

  function textLines(value) {
    return String(value || "").split("\n").map(line =>
      element("p", { text: line })
    );
  }

  /* NOTIFICATIONS */

  let toastTimer;

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
    }, TOAST_DURATION);
  }

  /* AI REQUEST */

  async function requestAI({ task = "chat", message, context = {}, history = [] }) {
    if (!API_URL) {
      throw new Error("errNoApi");
    }

    if (!navigator.onLine) {
      throw new Error("errOffline");
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), API_TIMEOUT);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          message,
          mode: state.mode,
          language: state.lang,
          languageName: LANGUAGE_NAMES[state.lang],
          task,
          context,
          history
        })
      });

      if (!response.ok) throw new Error("errRequest");

      const data = await response.json();

      const answer = data && typeof data === "object"
        ? [data.reply, data.message, data.response, data.text]
            .find(value => typeof value === "string" && value.trim())
        : null;

      if (!answer) throw new Error("errInvalid");

      return answer.trim();
    } catch (error) {
      if (error.name === "AbortError") throw new Error("errTimeout");
      if (error.message.startsWith("err")) throw error;
      throw new Error("errRequest");
    } finally {
      clearTimeout(timeout);
    }
  }

  function errorMessage(error) {
    return t(error && error.message && error.message.startsWith("err")
      ? error.message
      : "errRequest");
  }

  /* GENERAL CHAT */

  function currentConversation() {
    return state.conversations.find(item => item.id === state.currentId) || null;
  }

  function createConversation() {
    const now = Date.now();

    const conversation = {
      id: uid(),
      title: "",
      createdAt: now,
      updatedAt: now,
      messages: []
    };

    state.conversations.unshift(conversation);
    state.currentId = conversation.id;

    return conversation;
  }

  function newChat() {
    setMode("general");

    const conversation = currentConversation();

    if (!conversation || conversation.messages.length) {
      createConversation();
    }

    persist();
    renderChat();
    renderHistory();
    showToast(t("toastNew"), "success");

    $("#question")?.focus();
  }

  function openConversation(id) {
    if (!state.conversations.some(item => item.id === id)) return;

    state.currentId = id;
    setMode("general");
    persist();
    renderChat();
    renderHistory();
  }

  function deleteConversation(id) {
    if (!confirm(t("confirmDelete"))) return;

    state.conversations = state.conversations.filter(item => item.id !== id);
    state.pending.delete(id);

    if (state.currentId === id) {
      if (state.conversations.length) {
        state.currentId = state.conversations[0].id;
      } else {
        createConversation();
      }
    }

    persist();
    renderChat();
    renderHistory();
    showToast(t("toastDeleted"), "success");
  }

  function clearHistory() {
    if (!confirm(t("confirmHistory"))) return;

    state.conversations = [];
    state.pending.clear();
    createConversation();

    persist();
    renderChat();
    renderHistory();
    showToast(t("toastCleared"), "success");
  }

  async function sendMessage(message) {
    const conversation = currentConversation() || createConversation();

    if (state.pending.has(conversation.id)) return;

    const conversationId = conversation.id;
    const now = Date.now();

    conversation.messages.push({
      id: uid(),
      role: "user",
      content: message,
      ts: now
    });

    if (!conversation.title) {
      conversation.title = message.length > 40
        ? message.slice(0, 40) + "..."
        : message;
    }

    conversation.updatedAt = now;
    state.pending.add(conversationId);

    persist();
    renderChat();
    renderHistory();

    try {
      const history = conversation.messages.slice(-21, -1).map(item => ({
        role: item.role,
        content: item.content
      }));

      const reply = await requestAI({
        task: "chat",
        message,
        history
      });

      const target = state.conversations.find(item => item.id === conversationId);

      if (target) {
        target.messages.push({
          id: uid(),
          role: "assistant",
          content: reply,
          ts: Date.now()
        });

        target.updatedAt = Date.now();
      }
    } catch (error) {
      showToast(errorMessage(error), "error");
    } finally {
      state.pending.delete(conversationId);
      persist();
      renderChat();
      renderHistory();
    }
  }

  function renderChat() {
    const list = $("#generalMessages");
    if (!list) return;

    const conversation = currentConversation();

    list.replaceChildren();

    (conversation?.messages || []).forEach(message => {
      const messageElement = element(
        "div",
        {
          class: "chat-message " + (message.role === "user" ? "user" : "assistant"),
          dir: "auto"
        },
        ...textLines(message.content)
      );

      list.append(messageElement);
    });

    const loading = !!(
      conversation && state.pending.has(conversation.id)
    );

    if (loading) {
      list.append(
        element(
          "div",
          { class: "chat-message assistant loading", "aria-live": "polite" },
          element("p", { text: t("thinking") })
        )
      );
    }

    const welcome = $("#welcomeContainer");
    if (welcome) {
      welcome.style.display =
        conversation && (conversation.messages.length || loading)
          ? "none"
          : "";
    }

    const sendButton = $("#askButton");
    if (sendButton) sendButton.disabled = loading;

    list.lastElementChild?.scrollIntoView({ block: "end" });
  }

  function renderHistory() {
    const list = $("#recentList");
    if (!list) return;

    const empty = $("#emptyHistoryText");
    if (empty) empty.textContent = t("emptyHistory");

    list.replaceChildren();

    const conversations = state.conversations
      .filter(item => item.messages.length)
      .sort((a, b) => b.updatedAt - a.updatedAt);

    if (!conversations.length) {
      if (empty) list.append(empty);
      return;
    }

    conversations.forEach(conversation => {
      const row = element(
        "div",
        {
          class: "history-item" +
            (conversation.id === state.currentId ? " active" : "")
        },
        element(
          "button",
          {
            type: "button",
            class: "history-chat-button",
            dataset: { conv: conversation.id }
          },
          element("span", { class: "history-chat-icon", text: "◦" }),
          element("span", {
            class: "history-chat-title",
            text: conversation.title || t("newChat")
          })
        ),
        element("button", {
          type: "button",
          class: "history-delete",
          dataset: { delConv: conversation.id },
          "aria-label": t("delete"),
          title: t("delete"),
          text: "×"
        })
      );

      list.append(row);
    });
  }

  function updateCounter() {
    const input = $("#question");
    const counter = $("#charCount");

    if (!input) return;

    if (counter) {
      counter.textContent =
        input.value.length + " / " + (input.maxLength || 4000);
    }

    input.style.height = "auto";
    input.style.height = Math.min(input.scrollHeight, 180) + "px";
  }

  function submitChat() {
    const input = $("#question");
    if (!input) return;

    const message = input.value.trim();

    if (!message) {
      showToast(t("errEmpty"), "warning");
      return;
    }

    const conversation = currentConversation();

    if (conversation && state.pending.has(conversation.id)) return;

    input.value = "";
    updateCounter();

    sendMessage(message);
  }

  /* VOICE INPUT */

  let recognition = null;

  function toggleVoice() {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      showToast(t("errVoice"), "warning");
      return;
    }

    if (recognition) {
      recognition.stop();
      return;
    }

    const button = $("#voiceButton");

    try {
      recognition = new SpeechRecognition();
      recognition.lang = SPEECH_LANGUAGES[state.lang] || "en-US";
      recognition.interimResults = false;
      recognition.continuous = false;

      recognition.onstart = () => {
        button?.classList.add("recording");
        showToast(t("listening"), "info");
      };

      recognition.onresult = event => {
        const result = [...event.results]
          .map(item => item[0].transcript)
          .join(" ")
          .trim();

        const input = $("#question");

        if (input && result) {
          input.value = (
            input.value ? input.value + " " : ""
          ) + result;

          input.value = input.value.slice(0, input.maxLength || 4000);
          updateCounter();
          input.focus();
        }
      };

      recognition.onerror = () => {
        showToast(t("errVoiceFail"), "error");
      };

      recognition.onend = () => {
        button?.classList.remove("recording");
        recognition = null;
      };

      recognition.start();
    } catch {
      recognition = null;
      showToast(t("errVoiceFail"), "error");
    }
  }

  /* FORMS */

  function field(name, label, type = "text", required = false, extra = {}) {
    return { name, label, type, required, ...extra };
  }

  function buildForm(formKey, fields, values = {}, buttons = [], editing = false) {
    const form = element("form", {
      class: "local-form",
      dataset: { form: formKey },
      noValidate: true
    });

    fields.forEach(item => {
      const id = "f_" + formKey.replace(":", "_") + "_" + item.name;
      const value = values[item.name] ?? "";
      let input;

      if (item.type === "select") {
        input = element(
          "select",
          { id, name: item.name },
          ...(item.options || []).map(option =>
            element("option", {
              value: option.value,
              text: option.label,
              selected: String(option.value) === String(value)
            })
          )
        );
      } else if (item.type === "textarea") {
        input = element("textarea", {
          id,
          name: item.name,
          value,
          maxLength: 8000
        });
      } else {
        input = element("input", {
          id,
          name: item.name,
          type: item.type,
          value,
          min: item.min,
          step: item.step,
          maxLength: item.type === "number" || item.type === "date" ? null : 200
        });
      }

      form.append(
        element("label", {
          htmlFor: id,
          text: t(item.label) + (item.required ? " *" : "")
        }),
        input
      );
    });

    buttons.forEach(button => {
      form.append(
        element("button", {
          type: "submit",
          dataset: { action: button.action || "" },
          text: t(button.label)
        })
      );
    });

    if (editing) {
      form.append(
        element("button", {
          type: "button",
          dataset: { act: "cancel-edit" },
          text: t("cancel")
        })
      );
    }

    return form;
  }

  function recordRow(title, meta, body, actions = []) {
    return element(
      "div",
      { class: "local-record" },
      element(
        "div",
        {},
        element("strong", { text: title }),
        meta ? element("small", { text: meta }) : null,
        body ? element("p", {
          text: body,
          style: "white-space:pre-wrap"
        }) : null
      ),
      element(
        "div",
        {
          class: "local-actions",
          style: "display:flex;gap:6px;flex-wrap:wrap"
        },
        ...actions
      )
    );
  }

  function actionButton(label, action, data = {}, className = "local-action") {
    return element("button", {
      type: "button",
      class: className,
      dataset: { act: action, ...data },
      text: t(label)
    });
  }

  function statsBar(items) {
    return element(
      "div",
      { class: "shop-stats" },
      ...items.map(([label, value]) =>
        element(
          "div",
          { class: "tool-stat" },
          element("span", { text: t(label) }),
          element("strong", { text: String(value) })
        )
      )
    );
  }

  function cleanForm(form) {
    const data = {};

    new FormData(form).forEach((value, key) => {
      data[key] = String(value).trim();
    });

    return data;
  }

  function numberValue(value) {
    const text = String(value ?? "").replace(/,/g, "").trim();
    if (!text) return NaN;

    const number = Number(text);

    return Number.isFinite(number) && Math.abs(number) < 1e10
      ? number
      : NaN;
  }

  /* SHOPKEEPER */

  const shop = state.shop;

  function customerById(id) {
    return shop.customers.find(item => item.id === id);
  }

  function customerName(id) {
    return customerById(id)?.name || "Deleted customer";
  }

  function balance(customerId, excludedId) {
    return shop.ledger
      .filter(item =>
        item.customerId === customerId && item.id !== excludedId
      )
      .reduce(
        (total, item) =>
          total + (item.type === "credit"
            ? Number(item.amount)
            : -Number(item.amount)),
        0
      );
  }

  function totalOutstanding() {
    return shop.customers.reduce(
      (total, customer) =>
        total + Math.max(0, balance(customer.id)),
      0
    );
  }

  function sum(items, property) {
    return items.reduce(
      (total, item) => total + (Number(item[property]) || 0),
      0
    );
  }

  function customerOptions() {
    return [
      { value: "", label: t("selectCustomer") },
      ...shop.customers.map(customer => ({
        value: customer.id,
        label: customer.name
      }))
    ];
  }

  function productOptions() {
    return [
      { value: "", label: t("otherItem") },
      ...shop.stock.map(product => ({
        value: product.id,
        label: product.name
      }))
    ];
  }

  function paymentOptions() {
    return [
      { value: "cash", label: t("cash") },
      { value: "credit", label: t("creditType") }
    ];
  }

  const amountOptions = { min: "0", step: "any" };

  const SHOP_TOOLS = {
    customers: {
      title: "customers",
      store: "customers",
      editable: true,

      fields: [
        field("name", "name", "text", true),
        field("phone", "phone", "tel"),
        field("address", "address")
      ],

      stats: () => [
        ["sCustomers", shop.customers.length],
        ["sOutstanding", money(totalOutstanding())]
      ],

      items: () => shop.customers,

      view: customer => ({
        title: customer.name,
        meta: [customer.phone, customer.address].filter(Boolean).join(" · "),
        body: t("balance") + ": " + money(balance(customer.id))
      }),

      save(data, editing) {
        if (!data.name) return "errName";

        const record = editing || { id: uid() };

        Object.assign(record, {
          name: data.name.slice(0, 80),
          phone: data.phone,
          address: data.address
        });

        if (!editing) shop.customers.push(record);

        return null;
      },

      confirm: () => t("confirmCustomer"),

      remove(customer) {
        shop.ledger = shop.ledger.filter(
          item => item.customerId !== customer.id
        );

        shop.sales.forEach(sale => {
          if (sale.customerId === customer.id) {
            sale.customerId = "";
          }
        });

        shop.customers = shop.customers.filter(
          item => item !== customer
        );

        return null;
      }
    },

    credit: {
      title: "credit",
      store: "ledger",
      editable: true,
      type: "credit",

      fields: [
        field("customerId", "customer", "select", true, {
          options: customerOptions
        }),
        field("amount", "amount", "number", true, amountOptions),
        field("note", "note"),
        field("date", "date", "date")
      ],

      stats: () => [
        ["sOutstanding", money(totalOutstanding())],
        ["sOwing", shop.customers.filter(c => balance(c.id) > 0).length]
      ],

      items: () => shop.ledger.filter(item => item.type === "credit"),

      view: item => ({
        title: customerName(item.customerId) + " — " + money(item.amount),
        meta: item.date,
        body: item.note
      }),

      canEdit: item => !item.saleId,
      canDelete: item => !item.saleId,

      save(data, editing) {
        const amount = numberValue(data.amount);

        if (!customerById(data.customerId)) return "errCustomer";
        if (!(amount > 0)) return "errAmount";

        if (balance(data.customerId, editing?.id) + amount < 0) {
          return "errNumber";
        }

        const record = editing || {
          id: uid(),
          type: "credit"
        };

        Object.assign(record, {
          customerId: data.customerId,
          amount,
          note: data.note.slice(0, 200),
          date: validDate(data.date)
        });

        if (!editing) shop.ledger.push(record);

        return null;
      },

      remove(item) {
        if (balance(item.customerId, item.id) < 0) {
          return "errNumber";
        }

        shop.ledger = shop.ledger.filter(record => record !== item);
        return null;
      }
    },

    payments: {
      title: "payments",
      store: "ledger",
      editable: true,
      type: "payment",

      fields: [
        field("customerId", "customer", "select", true, {
          options: customerOptions
        }),
        field("amount", "amount", "number", true, amountOptions),
        field("note", "note"),
        field("date", "date", "date")
      ],

      stats: () => [
        ["sReceived", money(sum(
          shop.ledger.filter(item => item.type === "payment"),
          "amount"
        ))],
        ["sOutstanding", money(totalOutstanding())]
      ],

      items: () => shop.ledger.filter(item => item.type === "payment"),

      view: item => ({
        title: customerName(item.customerId) + " — " + money(item.amount),
        meta: item.date,
        body: item.note
      }),

      canEdit: item => !item.saleId,
      canDelete: item => !item.saleId,

      save(data, editing) {
        const amount = numberValue(data.amount);

        if (!customerById(data.customerId)) return "errCustomer";
        if (!(amount > 0)) return "errAmount";

        if (amount > balance(data.customerId, editing?.id)) {
          return "errOverpay";
        }

        const record = editing || {
          id: uid(),
          type: "payment"
        };

        Object.assign(record, {
          customerId: data.customerId,
          amount,
          note: data.note.slice(0, 200),
          date: validDate(data.date)
        });

        if (!editing) shop.ledger.push(record);

        return null;
      },

      remove(item) {
        shop.ledger = shop.ledger.filter(record => record !== item);
        return null;
      }
    },

    sales: {
      title: "sales",
      store: "sales",
      editable: false,

      fields: [
        field("productId", "product", "select", false, {
          options: productOptions
        }),
        field("item", "item"),
        field("qty", "quantity", "number", true, {
          min: "0",
          step: "any"
        }),
        field("amount", "amount", "number", true, amountOptions),
        field("payType", "paymentType", "select", false, {
          options: paymentOptions
        }),
        field("customerId", "customer", "select", false, {
          options: customerOptions
        }),
        field("date", "date", "date")
      ],

      defaults: () => ({ qty: 1, payType: "cash" }),

      stats: () => [
        ["sSalesToday", money(sum(
          shop.sales.filter(item => item.date === today()),
          "amount"
        ))],
        ["sSalesAll", money(sum(shop.sales, "amount"))]
      ],

      items: () => shop.sales,

      view: sale => ({
        title: sale.item + " × " + sale.qty + " — " + money(sale.amount),
        meta: sale.date + " · " + t(
          sale.payType === "credit" ? "creditType" : "cash"
        )
      }),

      save(data) {
        const quantity = numberValue(data.qty);
        const amount = numberValue(data.amount);

        if (!(quantity > 0)) return "errNumber";
        if (!(amount > 0)) return "errAmount";

        const product = data.productId
          ? shop.stock.find(item => item.id === data.productId)
          : null;

        if (data.productId && !product) return "errItem";
        if (!product && !data.item) return "errItem";
        if (product && quantity > product.qty) return "errStock";

        if (data.payType === "credit" && !customerById(data.customerId)) {
          return "errCustomer";
        }

        const sale = {
          id: uid(),
          item: (product ? product.name : data.item).slice(0, 80),
          productId: product?.id || "",
          qty: quantity,
          amount,
          payType: data.payType === "credit" ? "credit" : "cash",
          customerId: customerById(data.customerId) ? data.customerId : "",
          date: validDate(data.date)
        };

        if (product) product.qty -= quantity;

        shop.sales.push(sale);

        if (sale.payType === "credit") {
          shop.ledger.push({
            id: uid(),
            type: "credit",
            customerId: sale.customerId,
            amount,
            note: sale.item,
            date: sale.date,
            saleId: sale.id
          });
        }

        return null;
      },

      remove(sale) {
        const linked = shop.ledger.find(item => item.saleId === sale.id);

        if (linked && balance(linked.customerId, linked.id) < 0) {
          return "errNumber";
        }

        const product = shop.stock.find(
          item => item.id === sale.productId
        );

        if (product) product.qty += sale.qty;

        if (linked) {
          shop.ledger = shop.ledger.filter(item => item !== linked);
        }

        shop.sales = shop.sales.filter(item => item !== sale);

        return null;
      }
    },

    expenses: {
      title: "expenses",
      store: "expenses",
      editable: true,

      fields: [
        field("title", "title", "text", true),
        field("amount", "amount", "number", true, amountOptions),
        field("category", "category"),
        field("date", "date", "date")
      ],

      stats: () => [
        ["sExpenses", money(sum(shop.expenses, "amount"))],
        ["sSalesAll", money(sum(shop.sales, "amount"))],
        ["sProfit", money(
          sum(shop.sales, "amount") - sum(shop.expenses, "amount")
        )]
      ],

      items: () => shop.expenses,

      view: item => ({
        title: item.title + " — " + money(item.amount),
        meta: item.date + (item.category ? " · " + item.category : "")
      }),

      save(data, editing) {
        const amount = numberValue(data.amount);

        if (!data.title) return "errRequired";
        if (!(amount > 0)) return "errAmount";

        const record = editing || { id: uid() };

        Object.assign(record, {
          title: data.title.slice(0, 80),
          amount,
          category: data.category,
          date: validDate(data.date)
        });

        if (!editing) shop.expenses.push(record);

        return null;
      }
    },

    stock: {
      title: "stock",
      store: "stock",
      editable: true,

      fields: [
        field("name", "name", "text", true),
        field("qty", "quantity", "number", true, {
          min: "0",
          step: "any"
        }),
        field("price", "price", "number", false, amountOptions),
        field("low", "low", "number", false, {
          min: "0",
          step: "any"
        })
      ],

      defaults: () => ({ qty: 0, low: 5 }),

      stats: () => [
        ["sProducts", shop.stock.length],
        ["sLow", shop.stock.filter(
          item => item.qty <= item.low
        ).length],
        ["sValue", money(shop.stock.reduce(
          (total, item) => total + item.qty * item.price,
          0
        ))]
      ],

      items: () => shop.stock,

      view: item => ({
        title: item.name,
        meta: t("quantity") + ": " + item.qty + " · " + money(item.price),
        body: item.qty <= item.low ? "⚠ " + t("lowStock") : ""
      }),

      extra: item => [
        actionButton("minus", "adjust", {
          scope: "shop",
          tool: "stock",
          id: item.id,
          dir: "-1"
        }),
        actionButton("plus", "adjust", {
          scope: "shop",
          tool: "stock",
          id: item.id,
          dir: "1"
        })
      ],

      save(data, editing) {
        const quantity = numberValue(data.qty);
        const price = data.price === "" ? 0 : numberValue(data.price);
        const low = data.low === "" ? 5 : numberValue(data.low);

        if (!data.name) return "errName";
        if (!(quantity >= 0) || !(price >= 0) || !(low >= 0)) {
          return "errNumber";
        }

        const duplicate = shop.stock.some(item =>
          item !== editing &&
          item.name.toLowerCase() === data.name.toLowerCase()
        );

        if (duplicate) return "errDuplicate";

        const record = editing || { id: uid() };

        Object.assign(record, {
          name: data.name.slice(0, 80),
          qty: quantity,
          price,
          low
        });

        if (!editing) shop.stock.push(record);

        return null;
      }
    }
  };

  function validDate(value) {
    return /^\d{4}-\d{2}-\d{2}$/.test(value || "")
      ? value
      : today();
  }

  function getEditingRecord(scope, tool) {
    const editing = state.ui.editing;

    if (!editing || editing.scope !== scope || editing.tool !== tool) {
      return null;
    }

    const collection = scope === "shop"
      ? shop[SHOP_TOOLS[tool].store]
      : state.student[tool === "planner" ? "plans" : tool];

    return collection?.find(item => item.id === editing.id) || null;
  }

  function renderShopPanel() {
    const panel = $("#shopToolPanel");
    const content = $("#shopToolContent");
    const title = $("#shopToolTitle");
    const id = state.ui.shopTool;

    if (!panel || !content) return;

    panel.hidden = !id;

    $$("[data-shop-tool]").forEach(button => {
      button.classList.toggle("active", button.dataset.shopTool === id);
    });

    if (!id || !SHOP_TOOLS[id]) {
      content.replaceChildren();
      return;
    }

    const config = SHOP_TOOLS[id];

    if (title) title.textContent = t(config.title);

    const editing = getEditingRecord("shop", id);
    const wrapper = element("div");

    wrapper.append(statsBar(config.stats()));

    if (
      (id === "credit" || id === "payments") &&
      !shop.customers.length
    ) {
      wrapper.append(element("p", {
        text: t("noCustomer")
      }));
    } else {
      const values = editing
        ? { ...editing }
        : {
            date: today(),
            ...(config.defaults ? config.defaults() : {})
          };

      wrapper.append(buildForm(
        "shop:" + id,
        config.fields,
        values,
        [{ label: editing ? "update" : "add" }],
        !!editing
      ));
    }

    const records = config.items().slice().reverse();

    if (!records.length) {
      wrapper.append(element("p", { text: t("noRecords") }));
    } else {
      wrapper.append(
        element(
          "div",
          { class: "local-record-list" },
          ...records.map(record => {
            const view = config.view(record);
            const data = {
              scope: "shop",
              tool: id,
              id: record.id
            };

            const actions = [];

            if (config.extra) {
              actions.push(...config.extra(record));
            }

            if (
              config.editable &&
              (!config.canEdit || config.canEdit(record))
            ) {
              actions.push(actionButton("edit", "edit", data));
            }

            if (!config.canDelete || config.canDelete(record)) {
              actions.push(actionButton(
                "delete",
                "delete",
                data,
                "local-delete"
              ));
            }

            return recordRow(
              view.title,
              view.meta,
              view.body,
              actions
            );
          })
        )
      );
    }

    content.replaceChildren(wrapper);
  }

  /* STUDENT */

  const STUDENT_TOOLS = {
    mock: "mock",
    mcq: "mcq",
    summary: "summary",
    flashcards: "flashcards",
    notes: "notes",
    planner: "planner"
  };

  function parseFlashcards(text) {
    const cards = [];
    let current = null;
    let currentField = null;

    String(text).split("\n").forEach(line => {
      let match;

      if (match = line.match(/^\s*(?:Q\d*|Front)\s*[:.)]\s*(.*)$/i)) {
        current = { front: match[1], back: "" };
        cards.push(current);
        currentField = "front";
      } else if (
        current &&
        (match = line.match(/^\s*(?:A\d*|Back)\s*[:.)]\s*(.*)$/i))
      ) {
        current.back = match[1];
        currentField = "back";
      } else if (current && currentField && line.trim()) {
        current[currentField] += " " + line.trim();
      }
    });

    return cards.filter(card =>
      card.front.trim() && card.back.trim()
    ).slice(0, 50);
  }

  async function runStudentAI(tool, data) {
    if (state.ui.output[tool]?.loading) return;

    let task;
    let message;
    let title;

    const languageInstruction =
      " Respond in " + LANGUAGE_NAMES[state.lang] + ".";

    const material = data.material
      ? "\n\nUse this material:\n" + data.material.slice(0, 8000)
      : "";

    if (tool === "mock") {
      task = "mock_test";
      title = data.subject + " · Mock test";

      message =
        "Create a mock test with " + (data.count || 10) +
        " questions (" + (data.level || "medium") +
        " difficulty) for subject \"" + data.subject + "\"" +
        (data.chapter ? ", chapter/topic \"" + data.chapter + "\"" : "") +
        ". Include an answer key at the end." +
        languageInstruction + material;
    } else if (tool === "mcq") {
      task = "mcq";
      title = data.subject + " · MCQs";

      message =
        "Generate " + (data.count || 10) +
        " multiple-choice questions (options A-D, " +
        (data.level || "medium") +
        " difficulty) for subject \"" + data.subject + "\"" +
        (data.chapter ? ", chapter/topic \"" + data.chapter + "\"" : "") +
        ". Include an answer key." +
        languageInstruction + material;
    } else if (tool === "summary") {
      task = "summary";
      title = data.title;

      message =
        "Summarize the chapter titled \"" + data.title +
        "\" into clear revision notes with key points." +
        languageInstruction + "\n\n" + data.text.slice(0, 8000);
    } else {
      task = "flashcards";
      title = data.topic + " · Flashcards";

      message =
        "Create 10 flashcards about \"" + data.topic +
        "\". Use this exact format:\nQ: question\nA: answer" +
        languageInstruction + material;
    }

    state.ui.output[tool] = { loading: true };
    refreshStudentOutput(tool);

    try {
      const response = await requestAI({
        task,
        message,
        context: {
          tool,
          subject: data.subject,
          chapter: data.chapter,
          topic: data.topic
        }
      });

      state.ui.output[tool] = {
        text: response,
        title,
        saved: false
      };
    } catch (error) {
      state.ui.output[tool] = {
        error: errorMessage(error)
      };

      showToast(errorMessage(error), "error");
    }

    refreshStudentOutput(tool);
  }

  function studentOutput(tool) {
    const output = state.ui.output[tool];

    if (!output) return [];

    if (output.loading) {
      return [element("p", { text: t("thinking") })];
    }

    if (output.error) {
      return [element("p", { text: output.error })];
    }

    const actions = [];

    if (tool === "flashcards") {
      if (!output.saved && parseFlashcards(output.text).length) {
        actions.push(actionButton("saveCards", "save-cards", { tool }));
      }
    } else if (!output.saved) {
      actions.push(actionButton("saveOut", "save-out", { tool }));
    }

    return [
      element(
        "div",
        { class: "local-record" },
        element("div", { dir: "auto" }, ...textLines(output.text)),
        element("div", {}, ...actions)
      )
    ];
  }

  function refreshStudentOutput(tool) {
    const output = $('[data-out="' + tool + '"]');

    if (output) {
      output.replaceChildren(...studentOutput(tool));
    }
  }

  function renderStudentPanel() {
    const id = state.ui.studentTool;
    const panel = $("#studentToolPanel");
    const content = $("#studentToolContent");
    const title = $("#studentToolTitle");

    if (!panel || !content) return;

    panel.hidden = !id;

    $$("[data-student-tool]").forEach(button => {
      button.classList.toggle("active", button.dataset.studentTool === id);
    });

    if (!id || !STUDENT_TOOLS[id]) {
      content.replaceChildren();
      return;
    }

    if (title) title.textContent = t(id);

    const wrapper = element("div");
    const editing = getEditingRecord("student", id);

    if (id === "mock" || id === "mcq") {
      wrapper.append(
        buildForm(
          "stu:" + id,
          [
            field("subject", "subject", "text", true),
            field("chapter", "chapter"),
            field("count", "count", "select", false, {
              options: () => [5, 10, 15, 20].map(value => ({
                value,
                label: String(value)
              }))
            }),
            field("level", "difficulty", "select", false, {
              options: () => ["easy", "medium", "hard"].map(value => ({
                value,
                label: t(value)
              }))
            }),
            field("material", "material", "textarea")
          ],
          { count: 10, level: "medium" },
          [{ label: "generate" }]
        ),
        element("div", { dataset: { out: id } }, ...studentOutput(id))
      );
    }

    if (id === "summary") {
      wrapper.append(
        buildForm(
          "stu:summary",
          [
            field("title", "title", "text", true),
            field("text", "content", "textarea", true)
          ],
          {},
          [
            { label: "summarize", action: "ai" },
            { label: "saveChapter", action: "save" }
          ]
        ),
        element("div", {
          dataset: { out: "summary" }
        }, ...studentOutput("summary"))
      );
    }

    if (id === "flashcards") {
      wrapper.append(
        buildForm(
          "stu:cardsai",
          [
            field("topic", "chapter", "text", true),
            field("material", "material", "textarea")
          ],
          {},
          [{ label: "addCardAI" }]
        ),
        element("div", {
          dataset: { out: "flashcards" }
        }, ...studentOutput("flashcards")),
        buildForm(
          "stu:card",
          [
            field("front", "front", "text", true),
            field("back", "backSide", "text", true)
          ],
          {},
          [{ label: "addCard" }]
        )
      );

      if (state.student.cards.length) {
        wrapper.append(
          element(
            "div",
            { class: "local-record-list" },
            ...state.student.cards.slice().reverse().map(card => {
              const open = !!state.ui.flipped[card.id];

              return recordRow(
                card.front,
                null,
                open ? card.back : "",
                [
                  actionButton(
                    open ? "hideAnswer" : "showAnswer",
                    "flip",
                    { id: card.id }
                  ),
                  actionButton(
                    "delete",
                    "delete",
                    {
                      scope: "student",
                      tool: "flashcards",
                      id: card.id
                    },
                    "local-delete"
                  )
                ]
              );
            })
          )
        );
      } else {
        wrapper.append(element("p", { text: t("noRecords") }));
      }
    }

    if (id === "notes") {
      wrapper.append(
        buildForm(
          "stu:notes",
          [
            field("title", "title", "text", true),
            field("text", "content", "textarea")
          ],
          editing || {},
          [{ label: editing ? "update" : "add" }],
          !!editing
        )
      );

      wrapper.append(
        state.student.notes.length
          ? element(
              "div",
              { class: "local-record-list" },
              ...state.student.notes.slice().reverse().map(note =>
                recordRow(
                  note.title,
                  note.date,
                  note.text,
                  [
                    actionButton("edit", "edit", {
                      scope: "student",
                      tool: "notes",
                      id: note.id
                    }),
                    actionButton("delete", "delete", {
                      scope: "student",
                      tool: "notes",
                      id: note.id
                    }, "local-delete")
                  ]
                )
              )
            )
          : element("p", { text: t("noRecords") })
      );
    }

    if (id === "planner") {
      wrapper.append(
        statsBar([
          [
            "tasksDone",
            state.student.plans.filter(item => item.done).length +
            " / " + state.student.plans.length
          ]
        ]),
        buildForm(
          "stu:plan",
          [
            field("subject", "subject", "text", true),
            field("task", "task", "text", true),
            field("due", "due", "date")
          ],
          {},
          [{ label: "add" }]
        )
      );

      wrapper.append(
        state.student.plans.length
          ? element(
              "div",
              { class: "local-record-list" },
              ...state.student.plans.map(plan =>
                recordRow(
                  (plan.done ? "✓ " : "") + plan.task,
                  plan.subject + (plan.due ? " · " + plan.due : ""),
                  "",
                  [
                    actionButton(
                      plan.done ? "reopen" : "markDone",
                      "toggle",
                      { id: plan.id }
                    ),
                    actionButton("delete", "delete", {
                      scope: "student",
                      tool: "planner",
                      id: plan.id
                    }, "local-delete")
                  ]
                )
              )
            )
          : element("p", { text: t("noRecords") })
      );
    }

    content.replaceChildren(wrapper);
  }

  function renderChapters() {
    const container = $("#savedChapters");
    if (!container) return;

    if (!state.student.chapters.length) {
      container.replaceChildren(
        element("p", { text: t("savedEmpty") })
      );
      return;
    }

    container.replaceChildren(
      element(
        "div",
        { class: "local-record-list" },
        ...state.student.chapters.map(chapter =>
          element(
            "div",
            { class: "local-record" },
            element(
              "details",
              { dir: "auto" },
              element("summary", { text: chapter.title }),
              ...textLines(chapter.content)
            ),
            actionButton("delete", "delete", {
              scope: "student",
              tool: "chapters",
              id: chapter.id
            }, "local-delete")
          )
        )
      )
    );
  }

  /* FORM SUBMISSION */

  function submitToolForm(form, submitter) {
    const [scope, tool] = String(form.dataset.form).split(":");
    const data = cleanForm(form);

    if (scope === "shop") {
      const config = SHOP_TOOLS[tool];
      if (!config) return;

      const editing = getEditingRecord("shop", tool);
      const error = config.save(data, editing);

      if (error) {
        showToast(t(error), "warning");
        return;
      }

      state.ui.editing = null;
      persist();
      showToast(t(editing ? "toastUpdated" : "toastSaved"), "success");
      renderShopPanel();
      return;
    }

    const required = (...keys) => {
      if (keys.some(key => !data[key])) {
        showToast(t("errRequired"), "warning");
        return false;
      }

      return true;
    };

    if (tool === "mock" || tool === "mcq") {
      if (required("subject")) runStudentAI(tool, data);
      return;
    }

    if (tool === "summary") {
      if (!required("title", "text")) return;

      if (submitter?.dataset.action === "save") {
        state.student.chapters.unshift({
          id: uid(),
          title: data.title.slice(0, 120),
          content: data.text,
          createdAt: Date.now()
        });

        persist();
        renderChapters();
        showToast(t("toastSaved"), "success");
      } else {
        runStudentAI("summary", data);
      }

      return;
    }

    if (tool === "cardsai") {
      if (required("topic")) runStudentAI("flashcards", data);
      return;
    }

    if (tool === "card") {
      if (!required("front", "back")) return;

      state.student.cards.push({
        id: uid(),
        front: data.front.slice(0, 200),
        back: data.back.slice(0, 400)
      });

      persist();
      renderStudentPanel();
      showToast(t("toastSaved"), "success");
      return;
    }

    if (tool === "notes") {
      if (!required("title")) return;

      const editing = getEditingRecord("student", "notes");

      if (editing) {
        Object.assign(editing, {
          title: data.title.slice(0, 120),
          text: data.text
        });
      } else {
        state.student.notes.push({
          id: uid(),
          title: data.title.slice(0, 120),
          text: data.text,
          date: today()
        });
      }

      state.ui.editing = null;
      persist();
      renderStudentPanel();
      showToast(t(editing ? "toastUpdated" : "toastSaved"), "success");
      return;
    }

    if (tool === "plan") {
      if (!required("subject", "task")) return;

      state.student.plans.push({
        id: uid(),
        subject: data.subject.slice(0, 80),
        task: data.task.slice(0, 160),
        due: validDate(data.due),
        done: false
      });

      persist();
      renderStudentPanel();
      showToast(t("toastSaved"), "success");
    }
  }

  /* RECORD ACTIONS */

  function rerender(scope) {
    if (scope === "shop") {
      renderShopPanel();
    } else {
      renderStudentPanel();
      renderChapters();
    }
  }

  function handleAction(button) {
    const data = { ...button.dataset };
    const action = data.act;

    if (action === "cancel-edit") {
      const scope = state.ui.editing?.scope;
      state.ui.editing = null;
      rerender(scope);
      return;
    }

    if (action === "edit") {
      state.ui.editing = {
        scope: data.scope,
        tool: data.tool,
        id: data.id
      };

      rerender(data.scope);

      const selector = data.scope === "shop"
        ? "#shopToolContent form input"
        : "#studentToolContent form input";

      $(selector)?.focus();
      return;
    }

    if (action === "delete") {
      const collection = data.scope === "shop"
        ? shop[SHOP_TOOLS[data.tool]?.store]
        : data.tool === "chapters"
          ? state.student.chapters
          : data.tool === "flashcards"
            ? state.student.cards
            : data.tool === "notes"
              ? state.student.notes
              : state.student.plans;

      const record = collection?.find(item => item.id === data.id);
      if (!record) return;

      const config = data.scope === "shop"
        ? SHOP_TOOLS[data.tool]
        : null;

      const message = config?.confirm
        ? config.confirm(record)
        : t("confirmDelete");

      if (!confirm(message)) return;

      if (config?.remove) {
        const error = config.remove(record);

        if (error) {
          showToast(t(error), "warning");
          return;
        }
      } else if (config) {
        shop[config.store] = collection.filter(item => item !== record);
      } else {
        const key = data.tool === "chapters"
          ? "chapters"
          : data.tool === "flashcards"
            ? "cards"
            : data.tool === "notes"
              ? "notes"
              : "plans";

        state.student[key] = collection.filter(item => item !== record);
      }

      if (state.ui.editing?.id === data.id) {
        state.ui.editing = null;
      }

      persist();
      showToast(t("toastDeleted"), "success");
      rerender(data.scope);
      return;
    }

    if (action === "toggle") {
      const plan = state.student.plans.find(item => item.id === data.id);

      if (plan) {
        plan.done = !plan.done;
        persist();
        renderStudentPanel();
      }

      return;
    }

    if (action === "flip") {
      state.ui.flipped[data.id] = !state.ui.flipped[data.id];
      renderStudentPanel();
      return;
    }

    if (action === "adjust") {
      const product = shop.stock.find(item => item.id === data.id);

      if (product) {
        product.qty = Math.max(0, product.qty + Number(data.dir));
        persist();
        renderShopPanel();
      }

      return;
    }

    if (action === "save-out") {
      const output = state.ui.output[data.tool];

      if (!output?.text || output.saved) return;

      state.student.chapters.unshift({
        id: uid(),
        title: (output.title || t("savedChapters")).slice(0, 120),
        content: output.text,
        createdAt: Date.now()
      });

      output.saved = true;
      persist();
      renderChapters();
      refreshStudentOutput(data.tool);
      showToast(t("toastSaved"), "success");
      return;
    }

    if (action === "save-cards") {
      const output = state.ui.output[data.tool];

      if (!output?.text || output.saved) return;

      parseFlashcards(output.text).forEach(card => {
        state.student.cards.push({
          id: uid(),
          front: card.front.slice(0, 200),
          back: card.back.slice(0, 400)
        });
      });

      output.saved = true;
      persist();
      renderStudentPanel();
      showToast(t("toastSaved"), "success");
    }
  }

  /* MODE AND SIDEBAR */

  function setMode(mode) {
    if (!MODES.includes(mode)) return;

    state.mode = mode;

    MODES.forEach(name => {
      const workspace = $('[data-workspace="' + name + '"]');

      if (workspace) {
        workspace.classList.toggle("active", name === mode);
        workspace.hidden = name !== mode;
      }
    });

    $$("[data-mode]").forEach(button => {
      const active = button.dataset.mode === mode;

      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    });

    const title = $("#currentModeTitle");
    if (title) title.textContent = t(mode);

    persist();
  }

  function setSidebar(open) {
    state.ui.sidebar = !!open;

    document.body.classList.toggle(
      "sidebar-open",
      state.ui.sidebar
    );

    $("#openSidebar")?.setAttribute(
      "aria-expanded",
      String(state.ui.sidebar)
    );
  }

  function setLargeText(enabled) {
    state.largeText = !!enabled;

    document.body.classList.toggle(
      "large-text",
      state.largeText
    );

    $("#largeText")?.setAttribute(
      "aria-pressed",
      String(state.largeText)
    );

    safeStoreSet(STORAGE.largeText, state.largeText);
  }

  function setAboutDialog(open) {
    const dialog = $("#aboutDialog");
    if (!dialog) return;

    if (open) {
      if (typeof dialog.showModal === "function") {
        if (!dialog.open) dialog.showModal();
      } else {
        dialog.setAttribute("open", "");
      }
    } else if (typeof dialog.close === "function") {
      dialog.close();
    } else {
      dialog.removeAttribute("open");
    }
  }

  /* LANGUAGE */

  function languageText(key) {
    if (state.lang === "ur") return UR[key] || TEXT.en[key] || key;
    if (state.lang === "roman") return TEXT.roman[key] || TEXT.en[key] || key;
    return TEXT.en[key] || key;
  }

  function applyLanguage() {
    const staticTexts = [
      ["#newChat span:last-child", "newChat"],
      ["#headerNewChat", "newChat"],
      [".sidebar-section .sidebar-label", "workspace"],
      ['[data-mode="general"] span:last-child', "general"],
      ['[data-mode="student"] span:last-child', "student"],
      ['[data-mode="shopkeeper"] span:last-child', "shopkeeper"],
      [".history-heading .sidebar-label", "recent"],
      ["#clearHistory", "clear"],
      ['label[for="language"]', "language"],
      ["#largeText span:last-child", "largerText"],
      ["#helpButton span:last-child", "about"],
      ["#welcomeTitle", "welcome"],
      ["#welcomeIntro", "welcomeIntro"],
      ["#question", "placeholder", "placeholder"],
      ["#composerHint", "hint"],
      ["#askButtonText", "send"],
      [".composer-disclaimer", "disclaimer"],
      ["#backToStudent", "back"],
      ["#backToShop", "back"],
      ["#aboutTitle", "about"],
      ["#aboutDone", "gotIt"]
    ];

    staticTexts.forEach(([selector, key, type]) => {
      $$(selector).forEach(node => {
        if (type === "placeholder") {
          node.placeholder = t(key);
        } else {
          node.textContent = t(key);
        }
      });
    });

    const languageSelect = $("#language");
    if (languageSelect) languageSelect.value = state.lang;

    document.documentElement.lang =
      state.lang === "roman" ? "ur-Latn" : state.lang;

    const rtl = ["ur", "sd", "ps"].includes(state.lang);

    $$(".workspace, .sidebar, .about-dialog").forEach(node => {
      node.setAttribute("dir", rtl ? "rtl" : "ltr");
    });

    $$("[data-student-tool]").forEach(button => {
      const key = button.dataset.studentTool;
      const title = button.querySelector(".feature-title");

      if (title) title.textContent = t(key);
    });

    $$("[data-shop-tool]").forEach(button => {
      const key = button.dataset.shopTool;
      const title = button.querySelector(".feature-title");

      if (title) title.textContent = t(key);
    });
  }

  function setLanguage(language) {
    if (!LANGUAGES.includes(language)) return;

    state.lang = language;
    safeStoreSet(STORAGE.language, language);

    applyLanguage();
    renderAll();

    showToast(t("toastLang"), "success");
  }

  /* RENDER */

  function renderConnection() {
    const online = navigator.onLine !== false;
    const connection = $("#connection span:last-child");
    const status = $("#connectionText");

    if (connection) connection.textContent = t(online ? "online" : "offline");

    if (status) {
      status.textContent = !online
        ? t("offline")
        : API_URL
          ? t("ready")
          : t("notConnected");
    }
  }

  function renderAll() {
    applyLanguage();
    setMode(state.mode);
    setSidebar(state.ui.sidebar);
    renderChat();
    renderHistory();
    renderStudentPanel();
    renderShopPanel();
    renderChapters();
    renderConnection();
    updateCounter();
  }

  /* EVENT HANDLERS */

  function handleClick(event) {
    const target = event.target instanceof Element
      ? event.target
      : null;

    if (!target) return;

    if (target.closest("#openSidebar")) {
      setSidebar(!state.ui.sidebar);
      return;
    }

    if (target.closest("#closeSidebar")) {
      setSidebar(false);
      return;
    }

    if (state.ui.sidebar && !target.closest("#sidebar")) {
      setSidebar(false);
    }

    if (target.closest("#aboutDialog") && target.id === "aboutDialog") {
      setAboutDialog(false);
      return;
    }

    const action = target.closest("[data-act]");

    if (action) {
      handleAction(action);
      return;
    }

    const deleteConversationButton = target.closest("[data-del-conv]");

    if (deleteConversationButton) {
      deleteConversation(deleteConversationButton.dataset.delConv);
      return;
    }

    const conversationButton = target.closest("[data-conv]");

    if (conversationButton) {
      openConversation(conversationButton.dataset.conv);
      return;
    }

    const modeButton = target.closest("[data-mode]");

    if (modeButton) {
      setMode(modeButton.dataset.mode);
      return;
    }

    if (target.closest("#newChat, #headerNewChat")) {
      newChat();
      return;
    }

    if (target.closest("#clearHistory")) {
      clearHistory();
      return;
    }

    if (target.closest("#largeText")) {
      setLargeText(!state.largeText);
      return;
    }

    if (target.closest("#helpButton")) {
      setAboutDialog(true);
      return;
    }

    if (target.closest("#closeAbout, #aboutDone")) {
      setAboutDialog(false);
      return;
    }

    if (target.closest("#voiceButton")) {
      toggleVoice();
      return;
    }

    const studentButton = target.closest("[data-student-tool]");

    if (studentButton) {
      state.ui.studentTool = studentButton.dataset.studentTool;
      state.ui.editing = null;
      renderStudentPanel();

      $("#studentToolPanel")?.scrollIntoView({ block: "start" });
      return;
    }

    const shopButton = target.closest("[data-shop-tool]");

    if (shopButton) {
      state.ui.shopTool = shopButton.dataset.shopTool;
      state.ui.editing = null;
      renderShopPanel();

      $("#shopToolPanel")?.scrollIntoView({ block: "start" });
      return;
    }

    if (target.closest("#backToStudent")) {
      state.ui.studentTool = null;
      state.ui.editing = null;
      renderStudentPanel();
      return;
    }

    if (target.closest("#backToShop")) {
      state.ui.shopTool = null;
      state.ui.editing = null;
      renderShopPanel();
    }
  }

  function handleSubmit(event) {
    const form = event.target;

    if (!(form instanceof HTMLFormElement)) return;

    if (form.id === "questionForm") {
      event.preventDefault();
      submitChat();
      return;
    }

    if (form.dataset.form) {
      event.preventDefault();
      submitToolForm(form, event.submitter);
    }
  }

  function handleKeydown(event) {
    if (event.key === "Escape" && state.ui.sidebar) {
      setSidebar(false);
      return;
    }

    if (
      event.key === "Enter" &&
      !event.shiftKey &&
      !event.isComposing &&
      event.target?.id === "question"
    ) {
      event.preventDefault();
      submitChat();
    }
  }

  /* STORAGE LOAD */

  function loadData() {
    const language = safeStoreGet(STORAGE.language, "roman");

    state.lang = LANGUAGES.includes(language)
      ? language
      : "roman";

    state.largeText = safeStoreGet(STORAGE.largeText, false) === true;

    const saved = safeStoreGet(STORAGE.data, null);

    if (saved && typeof saved === "object") {
      state.mode = MODES.includes(saved.mode)
        ? saved.mode
        : "general";

      state.conversations = Array.isArray(saved.conversations)
        ? saved.conversations
        : [];

      state.student = {
        chapters: saved.student?.chapters || [],
        notes: saved.student?.notes || [],
        cards: saved.student?.cards || [],
        plans: saved.student?.plans || []
      };

      state.shop = {
        customers: saved.shop?.customers || [],
        ledger: saved.shop?.ledger || [],
        sales: saved.shop?.sales || [],
        expenses: saved.shop?.expenses || [],
        stock: saved.shop?.stock || []
      };

      state.currentId = state.conversations.some(
        item => item.id === saved.currentId
      )
        ? saved.currentId
        : null;
    }

    if (!currentConversation()) {
      const latest = state.conversations
        .slice()
        .sort((a, b) => b.updatedAt - a.updatedAt)[0];

      if (latest) {
        state.currentId = latest.id;
      } else {
        createConversation();
      }
    }
  }

  /* INITIALIZATION */

  function initialize() {
    try {
      loadData();
    } catch (error) {
      console.error("Zubaan AI storage error:", error);

      if (!currentConversation()) {
        createConversation();
      }
    }

    document.addEventListener("click", event => {
      try {
        handleClick(event);
      } catch (error) {
        console.error(error);
      }
    });

    document.addEventListener("submit", event => {
      try {
        handleSubmit(event);
      } catch (error) {
        console.error(error);
      }
    });

    document.addEventListener("keydown", event => {
      try {
        handleKeydown(event);
      } catch (error) {
        console.error(error);
      }
    });

    document.addEventListener("input", event => {
      if (event.target?.id === "question") {
        updateCounter();
      }
    });

    document.addEventListener("change", event => {
      if (event.target?.id === "language") {
        setLanguage(event.target.value);
      }
    });

    window.addEventListener("online", renderConnection);
    window.addEventListener("offline", renderConnection);

    const dialog = $("#aboutDialog");

    dialog?.addEventListener("click", event => {
      if (event.target === dialog) {
        setAboutDialog(false);
      }
    });

    document.body.classList.toggle("large-text", state.largeText);

    $("#largeText")?.setAttribute(
      "aria-pressed",
      String(state.largeText)
    );

    const languageSelect = $("#language");

    if (languageSelect) {
      languageSelect.value = state.lang;
    }

    persist();
    renderAll();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialize, {
      once: true
    });
  } else {
    initialize();
  }
})();
