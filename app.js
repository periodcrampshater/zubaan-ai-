
"use strict";

/* ==========================================
   ZUBAAN AI - MULTILINGUAL APP
========================================== */

const STORAGE = {
  chats: "zubaan_chats_v2",
  activeChat: "zubaan_active_chat_v2",
  notes: "zubaan_student_notes_v1",
  chapters: "zubaan_student_chapters_v1",
  planner: "zubaan_student_planner_v1",
  credits: "zubaan_shop_credits_v1",
  customers: "zubaan_shop_customers_v1",
  sales: "zubaan_shop_sales_v1",
  expenses: "zubaan_shop_expenses_v1",
  stock: "zubaan_shop_stock_v1",
  language: "zubaan_language_v1"
};

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

const state = {
  mode: "general",
  chats: [],
  activeChatId: null,
  language: "roman",
  busy: false,
  recognition: null,
  currentStudentTool: null,
  currentShopTool: null
};

const MODE_TITLES = {
  general: "General assistant",
  student: "Student",
  shopkeeper: "Shopkeeper"
};

const STUDENT_TOOLS = {
  mock: "Make a mock test",
  mcq: "Generate MCQs",
  summary: "Chapter summaries",
  flashcards: "Flashcards",
  notes: "My notes",
  planner: "Study planner"
};

const SHOP_TOOLS = {
  credit: "Udhar ledger",
  customers: "Customers",
  sales: "Daily sales",
  expenses: "Expenses",
  payments: "Payment history",
  stock: "Stock notes"
};

/* ==========================================
   TRANSLATIONS
========================================== */

const TRANSLATIONS = {
  en: {},
  roman: {
    "How can I help you today?": "Aaj main aapki kis tarah madad kar sakta hoon?",
    "Ask anything...": "Yahan apna sawal likhein...",
    "Message Zubaan AI...": "Zubaan AI ko apna paigham likhein...",
    "General assistant": "Aam madadgar",
    "Student": "Talib-e-ilm",
    "Shopkeeper": "Dukandar",
    "New chat": "Nayi chat",
    "New Chat": "Nayi chat",
    "General": "Aam",
    "Student Mode": "Talib-e-ilm mode",
    "Shopkeeper Mode": "Dukandar mode",
    "Recent conversations": "Pichli guftagu",
    "Your conversations will appear here.": "Aapki guftagu yahan nazar aayegi.",
    "Clear history": "History saaf karein",
    "Language": "Zabaan",
    "Help": "Madad",
    "Send": "Bhejein",
    "Thinking...": "Soch raha hoon...",
    "Ask anything...": "Kuch bhi poochein...",
    "Type your message...": "Apna paigham likhein...",
    "Make a mock test": "Mock test banayein",
    "Generate MCQs": "MCQs banayein",
    "Chapter summaries": "Chapters ka khulasa",
    "Flashcards": "Flashcards",
    "My notes": "Mere notes",
    "Study planner": "Parhai ka planner",
    "Udhar ledger": "Udhar ka record",
    "Customers": "Customers",
    "Daily sales": "Rozana sales",
    "Expenses": "Kharchay",
    "Payment history": "Payment history",
    "Stock notes": "Stock notes",
    "Back": "Wapas",
    "Note title": "Note ka title",
    "Your note": "Aapka note",
    "Save note": "Note save karein",
    "Subject": "Mazmoon",
    "Chapter name": "Chapter ka naam",
    "Summary or important points": "Khulasa ya zaroori points",
    "Save chapter": "Chapter save karein",
    "Study task": "Parhai ka kaam",
    "Due date": "Aakhri tareekh",
    "Add task": "Task add karein",
    "Completed": "Mukammal",
    "Mark done": "Mukammal karein",
    "Number of questions": "Sawalon ki tadaad",
    "Question / Term": "Sawal / Lafz",
    "Answer": "Jawab",
    "Save flashcard": "Flashcard save karein",
    "Customer name": "Customer ka naam",
    "Phone number": "Phone number",
    "Address / Details": "Pata / Tafseel",
    "Save customer": "Customer save karein",
    "Total outstanding udhar": "Kul baqi udhar",
    "Amount (Rs.)": "Raqam (Rs.)",
    "Details": "Tafseel",
    "Add udhar": "Udhar add karein",
    "Receive payment": "Payment wasool karein",
    "Total recorded sales": "Kul darj sales",
    "Sale amount (Rs.)": "Sale ki raqam (Rs.)",
    "Sale details": "Sale ki tafseel",
    "Record sale": "Sale darj karein",
    "Total recorded expenses": "Kul darj kharchay",
    "Expense description": "Kharchay ki tafseel",
    "Save expense": "Kharcha save karein",
    "Item / Product": "Item / Product",
    "Quantity": "Tadaad",
    "Save stock note": "Stock note save karein",
    "Delete": "Delete",
    "No saved records yet.": "Abhi koi record save nahi hua.",
    "No study tasks yet.": "Abhi koi study task nahi.",
    "No flashcards saved yet.": "Abhi koi flashcard save nahi hua.",
    "No udhar entries yet.": "Abhi koi udhar entry nahi.",
    "No payments recorded yet.": "Abhi koi payment record nahi hui.",
    "Storage full. Please remove some old records.": "Storage bhar gayi hai. Kuch purane records delete karein.",
    "Language preference saved.": "Zabaan save ho gayi.",
    "Conversation history cleared.": "Chat history saaf ho gayi.",
    "Note saved on this device.": "Note is device par save ho gaya.",
    "Chapter saved.": "Chapter save ho gaya.",
    "Study task added.": "Study task add ho gaya.",
    "Flashcard saved.": "Flashcard save ho gaya.",
    "Customer saved on this device.": "Customer is device par save ho gaya.",
    "Udhar entry saved offline.": "Udhar entry offline save ho gayi.",
    "Payment recorded.": "Payment record ho gayi.",
    "Sale recorded.": "Sale record ho gayi.",
    "Expense saved.": "Kharcha save ho gaya.",
    "Stock note saved.": "Stock note save ho gaya.",
    "AI chat needs an internet connection.": "AI chat ke liye internet zaroori hai.",
    "AI service is not connected yet. Your conversation is saved on this device. Please try again after the AI service is configured.": "AI service abhi connect nahi hai. Aapki chat is device par save hai.",
    "You are offline. Saved records remain available.": "Aap offline hain. Aapke saved records available hain.",
    "Internet connection restored.": "Internet connection wapas aa gaya.",
    "Larger text enabled.": "Bara text on ho gaya.",
    "Normal text enabled.": "Normal text on ho gaya.",
    "Listening...": "Sun raha hoon..."
  },
  ur: {
    "How can I help you today?": "آج میں آپ کی کس طرح مدد کر سکتا ہوں؟",
    "Ask anything...": "اپنا سوال یہاں لکھیں...",
    "Message Zubaan AI...": "زبان اے آئی کو اپنا پیغام لکھیں...",
    "General assistant": "عام معاون",
    "Student": "طالب علم",
    "Shopkeeper": "دکاندار",
    "New chat": "نئی گفتگو",
    "New Chat": "نئی گفتگو",
    "Recent conversations": "حالیہ گفتگو",
    "Your conversations will appear here.": "آپ کی گفتگو یہاں نظر آئے گی۔",
    "Clear history": "سرگزشت صاف کریں",
    "Language": "زبان",
    "Help": "مدد",
    "Send": "بھیجیں",
    "Thinking...": "سوچ رہا ہوں...",
    "Make a mock test": "ماک ٹیسٹ بنائیں",
    "Generate MCQs": "ایم سی کیوز بنائیں",
    "Chapter summaries": "ابواب کا خلاصہ",
    "Flashcards": "فلیش کارڈز",
    "My notes": "میرے نوٹس",
    "Study planner": "مطالعے کا منصوبہ",
    "Udhar ledger": "ادھار کا کھاتہ",
    "Customers": "گاہک",
    "Daily sales": "روزانہ کی فروخت",
    "Expenses": "اخراجات",
    "Payment history": "ادائیگیوں کی تاریخ",
    "Stock notes": "اسٹاک کے نوٹس",
    "Back": "واپس",
    "Note title": "نوٹ کا عنوان",
    "Your note": "آپ کا نوٹ",
    "Save note": "نوٹ محفوظ کریں",
    "Subject": "مضمون",
    "Chapter name": "باب کا نام",
    "Summary or important points": "خلاصہ یا اہم نکات",
    "Save chapter": "باب محفوظ کریں",
    "Study task": "مطالعے کا کام",
    "Due date": "آخری تاریخ",
    "Add task": "کام شامل کریں",
    "Completed": "مکمل",
    "Mark done": "مکمل کریں",
    "Number of questions": "سوالات کی تعداد",
    "Question / Term": "سوال / اصطلاح",
    "Answer": "جواب",
    "Save flashcard": "فلیش کارڈ محفوظ کریں",
    "Customer name": "گاہک کا نام",
    "Phone number": "فون نمبر",
    "Address / Details": "پتہ / تفصیلات",
    "Save customer": "گاہک محفوظ کریں",
    "Total outstanding udhar": "کل باقی ادھار",
    "Amount (Rs.)": "رقم (روپے)",
    "Details": "تفصیلات",
    "Add udhar": "ادھار شامل کریں",
    "Receive payment": "ادائیگی وصول کریں",
    "Total recorded sales": "کل درج شدہ فروخت",
    "Sale amount (Rs.)": "فروخت کی رقم",
    "Sale details": "فروخت کی تفصیلات",
    "Record sale": "فروخت درج کریں",
    "Total recorded expenses": "کل درج شدہ اخراجات",
    "Expense description": "اخراجات کی تفصیل",
    "Save expense": "اخراجات محفوظ کریں",
    "Item / Product": "چیز / پروڈکٹ",
    "Quantity": "تعداد",
    "Save stock note": "اسٹاک نوٹ محفوظ کریں",
    "Delete": "حذف کریں",
    "No saved records yet.": "ابھی کوئی ریکارڈ محفوظ نہیں۔",
    "No study tasks yet.": "ابھی کوئی مطالعے کا کام نہیں۔",
    "No flashcards saved yet.": "ابھی کوئی فلیش کارڈ محفوظ نہیں۔",
    "No udhar entries yet.": "ابھی کوئی ادھار درج نہیں۔",
    "No payments recorded yet.": "ابھی کوئی ادائیگی درج نہیں۔",
    "Language preference saved.": "زبان محفوظ ہو گئی۔",
    "Conversation history cleared.": "گفتگو کی سرگزشت صاف ہو گئی۔",
    "Note saved on this device.": "نوٹ اس ڈیوائس پر محفوظ ہو گیا۔",
    "Chapter saved.": "باب محفوظ ہو گیا۔",
    "Study task added.": "مطالعے کا کام شامل ہو گیا۔",
    "Flashcard saved.": "فلیش کارڈ محفوظ ہو گیا۔",
    "Customer saved on this device.": "گاہک اس ڈیوائس پر محفوظ ہو گیا۔",
    "Payment recorded.": "ادائیگی درج ہو گئی۔",
    "Sale recorded.": "فروخت درج ہو گئی۔",
    "Expense saved.": "اخراجات محفوظ ہو گئے۔",
    "Stock note saved.": "اسٹاک نوٹ محفوظ ہو گیا۔",
    "Back": "واپس"
  },
  pa: {
    "How can I help you today?": "اج میں تہاڈی کس طرح مدد کر سکدا ہاں؟",
    "Ask anything...": "ایتھے اپنا سوال لکھو...",
    "Message Zubaan AI...": "زبان اے آئی نوں اپنا پیغام لکھو...",
    "General assistant": "عام مددگار",
    "Student": "طالب علم",
    "Shopkeeper": "دکاندار",
    "New chat": "نئی گل بات",
    "Recent conversations": "پچھلیاں گلاں",
    "Clear history": "پرانیاں گلاں صاف کرو",
    "Language": "زبان",
    "Help": "مدد",
    "Send": "بھیجو",
    "Thinking...": "سوچ رہیا واں...",
    "Make a mock test": "موک ٹیسٹ بناؤ",
    "Generate MCQs": "MCQs بناؤ",
    "Chapter summaries": "باباں دا خلاصہ",
    "My notes": "میرے نوٹس",
    "Study planner": "پڑھائی دا منصوبہ",
    "Customers": "گاہک",
    "Daily sales": "روز دی وکری",
    "Expenses": "خرچے",
    "Payment history": "ادائیگی دا ریکارڈ",
    "Back": "واپس",
    "Save note": "نوٹ محفوظ کرو",
    "Save chapter": "باب محفوظ کرو",
    "Add task": "کم شامل کرو",
    "Completed": "مکمل",
    "Delete": "مٹاؤ"
  },
  sd: {
    "How can I help you today?": "اڄ مان توهان جي ڪهڙي طرح مدد ڪري سگهان ٿو؟",
    "Ask anything...": "پنهنجو سوال هتي لکو...",
    "Message Zubaan AI...": "زبان اي آءِ کي پنهنجو پيغام لکو...",
    "General assistant": "عام مددگار",
    "Student": "شاگرد",
    "Shopkeeper": "دڪاندار",
    "New chat": "نئين ڳالهه ٻولهه",
    "Recent conversations": "تازيون ڳالهيون",
    "Clear history": "تاريخ صاف ڪريو",
    "Language": "ٻولي",
    "Help": "مدد",
    "Send": "موڪليو",
    "Thinking...": "سوچي رهيو آهي...",
    "My notes": "منهنجا نوٽس",
    "Customers": "گراهڪ",
    "Daily sales": "روزاني وڪرو",
    "Expenses": "خرچ",
    "Back": "واپس",
    "Delete": "ختم ڪريو"
  },
  ps: {
    "How can I help you today?": "نن زه نن ستاسو سره څنګه مرسته کولی شم؟",
    "Ask anything...": "خپله پوښتنه دلته ولیکئ...",
    "Message Zubaan AI...": "Zubaan AI ته خپل پیغام ولیکئ...",
    "General assistant": "عمومي مرستیال",
    "Student": "زده کوونکی",
    "Shopkeeper": "دوکاندار",
    "New chat": "نوې خبرې اترې",
    "Recent conversations": "وروستۍ خبرې",
    "Clear history": "تاریخ پاک کړئ",
    "Language": "ژبه",
    "Help": "مرسته",
    "Send": "ولېږئ",
    "Thinking...": "فکر کوم...",
    "My notes": "زما یادښتونه",
    "Customers": "پېرودونکي",
    "Daily sales": "ورځنی پلور",
    "Expenses": "لګښتونه",
    "Back": "شاته",
    "Delete": "ړنګول"
  }
};

/* Keep original text so switching languages works both ways.
   Translation is triggered explicitly; no MutationObserver is used here.
   This prevents translation from observing and re-triggering its own DOM edits.
*/
const originalText = new WeakMap();
const originalAttributes = new WeakMap();

function translate(value) {
  const dictionary = TRANSLATIONS[state.language] || {};
  return dictionary[value] || value;
}

function translateElement(element) {
  if (!element || element.nodeType !== Node.ELEMENT_NODE) return;

  const attributes = ["placeholder", "title", "aria-label"];

  attributes.forEach(attribute => {
    if (element.hasAttribute(attribute)) {
      let originals = originalAttributes.get(element);

      if (!originals) {
        originals = {};
        originalAttributes.set(element, originals);
      }

      if (!(attribute in originals)) {
        originals[attribute] = element.getAttribute(attribute);
      }

      const translated = translate(originals[attribute]);
      if (element.getAttribute(attribute) !== translated) {
        element.setAttribute(attribute, translated);
      }
    }
  });

  if (element.tagName === "INPUT" && element.type === "submit") {
    if (!element.dataset.originalValue) {
      element.dataset.originalValue = element.value;
    }
    element.value = translate(element.dataset.originalValue);
  }
}

function translatePage() {
  const dictionary = TRANSLATIONS[state.language] || {};

  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode(node) {
        const parent = node.parentElement;

        if (!parent) return NodeFilter.FILTER_REJECT;

        if (
          ["SCRIPT", "STYLE", "TEXTAREA", "NOSCRIPT"].includes(parent.tagName) ||
          parent.closest(".chat-message") ||
          parent.closest(".history-chat-title") ||
          parent.closest("#toast")
        ) {
          return NodeFilter.FILTER_REJECT;
        }

        return NodeFilter.FILTER_ACCEPT;
      }
    }
  );

  let node;

  while ((node = walker.nextNode())) {
    if (!originalText.has(node)) {
      originalText.set(node, node.nodeValue);
    }

    const original = originalText.get(node);
    const translated = dictionary[original] || original;

    if (node.nodeValue !== translated) {
      node.nodeValue = translated;
    }
  }

  $$("#question, input, textarea, button, select").forEach(element => {
    translateElement(element);
  });

  const modeTitle = $("#currentModeTitle");
  if (modeTitle && MODE_TITLES[state.mode]) {
    modeTitle.textContent = translate(MODE_TITLES[state.mode]);
  }

  const studentTitle = $("#studentToolTitle");
  if (studentTitle && state.currentStudentTool) {
    studentTitle.textContent = translate(
      STUDENT_TOOLS[state.currentStudentTool]
    );
  }

  const shopTitle = $("#shopToolTitle");
  if (shopTitle && state.currentShopTool) {
    shopTitle.textContent = translate(
      SHOP_TOOLS[state.currentShopTool]
    );
  }

  const welcomeTitle = $("#welcomeTitle");
  if (welcomeTitle) {
    welcomeTitle.textContent = translate("How can I help you today?");
  }

  const question = $("#question");
  if (question) {
    question.placeholder = translate("Message Zubaan AI...");
  }

  const direction = ["ur", "pa", "sd", "ps"].includes(state.language)
    ? "rtl"
    : "ltr";

  document.documentElement.dir = direction;
  document.documentElement.lang = state.language;
  document.body.dir = direction;
}

function readStore(key, fallback = []) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function writeStore(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    showToast("Storage full. Please remove some old records.");
    return false;
  }
}

function makeId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[character]);
}

function formatDate(value) {
  try {
    return new Intl.DateTimeFormat(
      state.language === "ur" ? "ur-PK" :
      state.language === "pa" ? "pa-PK" :
      state.language === "sd" ? "sd-PK" :
      state.language === "ps" ? "ps-AF" :
      state.language === "en" ? "en-PK" : "en-PK",
      { day: "numeric", month: "short", year: "numeric" }
    ).format(new Date(value));
  } catch {
    return new Date(value).toLocaleDateString();
  }
}

function formatMoney(value) {
  return `Rs. ${Number(value || 0).toLocaleString("en-PK")}`;
}

/* ==========================================
   NOTIFICATIONS
========================================== */

function showToast(message) {
  const toast = $("#toast");
  if (!toast) return;

  toast.textContent = translate(message);
  toast.classList.add("visible");

  clearTimeout(showToast.timer);

  showToast.timer = setTimeout(() => {
    toast.classList.remove("visible");
  }, 1800);
}

/* ==========================================
   CHAT MANAGEMENT
========================================== */

function createChat() {
  const chat = {
    id: makeId(),
    title: "New chat",
    messages: [],
    createdAt: Date.now(),
    updatedAt: Date.now()
  };

  state.chats.unshift(chat);
  state.activeChatId = chat.id;

  saveChats();
  return chat;
}

function getActiveChat() {
  return state.chats.find(chat => chat.id === state.activeChatId) || null;
}

function saveChats() {
  writeStore(STORAGE.chats, state.chats);

  try {
    localStorage.setItem(STORAGE.activeChat, state.activeChatId || "");
  } catch {
    // Local storage may be unavailable.
  }
}

function selectChat(id) {
  const chat = state.chats.find(item => item.id === id);
  if (!chat) return;

  state.activeChatId = id;

  try {
    localStorage.setItem(STORAGE.activeChat, id);
  } catch {
    // Continue without persistence.
  }

  renderChatHistory();
  renderMessages();
  updateWelcome();
  closeSidebar();
}

function deleteChat(id) {
  state.chats = state.chats.filter(chat => chat.id !== id);

  if (state.activeChatId === id) {
    state.activeChatId = null;

    if (state.chats.length) {
      state.activeChatId = state.chats[0].id;
    } else {
      createChat();
    }
  }

  saveChats();
  renderChatHistory();
  renderMessages();
  updateWelcome();

  showToast("Conversation history cleared.");
}

function newChat() {
  createChat();
  renderChatHistory();
  renderMessages();
  updateWelcome();

  const input = $("#question");
  if (input) input.focus();

  closeSidebar();
}

function addMessage(role, content) {
  let chat = getActiveChat();

  if (!chat) {
    chat = createChat();
  }

  const message = {
    id: makeId(),
    role,
    content,
    createdAt: Date.now()
  };

  chat.messages.push(message);
  chat.updatedAt = Date.now();

  if (role === "user" && chat.messages.length === 1) {
    chat.title = content.slice(0, 38) || "New chat";
  }

  saveChats();
  renderChatHistory();
  renderMessages();
  updateWelcome();

  return message;
}

function renderChatHistory() {
  const container = $("#recentList");
  if (!container) return;

  const sorted = [...state.chats].sort(
    (a, b) => b.updatedAt - a.updatedAt
  );

  if (!sorted.length) {
    container.innerHTML = `
      <div class="empty-history">
        <span class="empty-history-icon">◷</span>
        <span>Your conversations will appear here.</span>
      </div>
    `;
    return;
  }

  container.innerHTML = sorted.map(chat => `
    <div class="history-item ${chat.id === state.activeChatId ? "active" : ""}">
      <button
        class="history-chat-button"
        type="button"
        data-chat-id="${escapeHTML(chat.id)}"
        title="${escapeHTML(chat.title)}"
      >
        <span class="history-chat-icon">▤</span>
        <span class="history-chat-title">${escapeHTML(chat.title)}</span>
      </button>

      <button
        class="history-delete"
        type="button"
        data-delete-chat="${escapeHTML(chat.id)}"
        aria-label="Delete conversation"
      >×</button>
    </div>
  `).join("");
}

function renderMessages() {
  const container = $("#generalMessages");
  if (!container) return;

  const chat = getActiveChat();

  if (!chat || !chat.messages.length) {
    container.innerHTML = "";
    return;
  }

  container.innerHTML = chat.messages.map(message => `
    <article class="chat-message ${message.role === "user" ? "user" : "assistant"}">
      ${escapeHTML(message.content).replace(/\n/g, "<br>")}
    </article>
  `).join("");

  container.scrollTop = container.scrollHeight;
}

function updateWelcome() {
  const chat = getActiveChat();
  const welcome = $("#welcomeContainer");

  if (welcome) {
    welcome.hidden = !!(chat && chat.messages.length);
  }
}

function clearHistory() {
  if (!confirm(
    state.language === "ur"
      ? "کیا آپ اس ڈیوائس سے تمام گفتگو حذف کرنا چاہتے ہیں؟"
      : "Delete all conversations from this device?"
  )) return;

  state.chats = [];
  state.activeChatId = null;

  createChat();
  saveChats();
  renderChatHistory();
  renderMessages();

  showToast("Conversation history cleared.");
}

function setMode(mode) {
  if (!["general", "student", "shopkeeper"].includes(mode)) return;

  state.mode = mode;

  $$("[data-mode]").forEach(button => {
    const active = button.dataset.mode === mode;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });

  $$("[data-workspace]").forEach(section => {
    const active = section.dataset.workspace === mode;
    section.classList.toggle("active", active);
    section.hidden = !active;
  });

  const title = $("#currentModeTitle");
  if (title) title.textContent = translate(MODE_TITLES[mode]);

  closeSidebar();

  if (mode === "general") {
    renderMessages();
    updateWelcome();
  }

  translatePage();
}

/* ==========================================
   GENERAL CHAT
========================================== */

async function sendMessage(event) {
  event?.preventDefault();

  if (state.busy) return;

  const input = $("#question");
  if (!input) return;

  const message = input.value.trim();
  if (!message) return;

  if (!navigator.onLine) {
    showToast("AI chat needs an internet connection.");
    return;
  }

  input.value = "";
  updateCharacterCount();

  addMessage("user", message);

  state.busy = true;
  const sendButton = $("#askButton");

  if (sendButton) {
    sendButton.disabled = true;
    sendButton.textContent = translate("Thinking...");
  }

  const chatId = state.activeChatId;
  const temporary = addMessage("assistant", "Thinking...");

  try {
    const response = await fetch("/.netlify/functions/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message,
        language: state.language,
        mode: state.mode
      })
    });

    if (!response.ok) {
      throw new Error("The AI service is currently unavailable.");
    }

    const data = await response.json();

    const reply =
      data.reply ||
      data.answer ||
      data.message ||
      "I could not generate a response. Please try again.";

    replaceTemporaryMessage(chatId, temporary.id, reply);
  } catch {
    replaceTemporaryMessage(
      chatId,
      temporary.id,
      "AI service is not connected yet. Your conversation is saved on this device. Please try again after the AI service is configured."
    );
  } finally {
    state.busy = false;

    if (sendButton) {
      sendButton.disabled = false;
      sendButton.innerHTML = `<span>${escapeHTML(translate("Send"))}</span><span>↑</span>`;
    }

    input.focus();
  }
}

function replaceTemporaryMessage(chatId, id, content) {
  const chat = state.chats.find(item => item.id === chatId);
  if (!chat) return;

  const message = chat.messages.find(item => item.id === id);

  if (message) {
    message.content = content;
    message.createdAt = Date.now();
  }

  chat.updatedAt = Date.now();
  saveChats();
  renderMessages();
  renderChatHistory();
}

/* ==========================================
   STUDENT TOOLS
========================================== */

function openStudentTool(tool) {
  const panel = $("#studentToolPanel");
  const title = $("#studentToolTitle");
  const content = $("#studentToolContent");

  if (!panel || !title || !content || !STUDENT_TOOLS[tool]) return;

  state.currentStudentTool = tool;
  title.textContent = translate(STUDENT_TOOLS[tool]);
  panel.hidden = false;

  $$(".feature-card", $("#studentWorkspace")).forEach(card => {
    card.hidden = true;
  });

  const heading = $("#studentWorkspace .dashboard-heading");
  const saved = $(".student-saved-section", $("#studentWorkspace"));

  if (heading) heading.hidden = true;
  if (saved) saved.hidden = true;

  renderStudentTool(tool, content);
  translatePage();
  panel.scrollIntoView({ behavior: "smooth", block: "start" });
}

function closeStudentTool() {
  $("#studentToolPanel").hidden = true;

  $$(".feature-card", $("#studentWorkspace")).forEach(card => {
    card.hidden = false;
  });

  const heading = $("#studentWorkspace .dashboard-heading");
  const saved = $(".student-saved-section", $("#studentWorkspace"));

  if (heading) heading.hidden = false;
  if (saved) saved.hidden = false;

  state.currentStudentTool = null;
}

function renderStudentTool(tool, content) {
  if (tool === "notes") return renderNotesTool(content);
  if (tool === "summary") return renderChaptersTool(content);
  if (tool === "planner") return renderPlannerTool(content);
  if (tool === "mock" || tool === "mcq") return renderPracticeTool(tool, content);
  if (tool === "flashcards") return renderFlashcardsTool(content);
}

/* Student notes */

function renderNotesTool(container) {
  const notes = readStore(STORAGE.notes);

  container.innerHTML = `
    <form class="local-form" id="noteForm">
      <label for="noteTitle">Note title</label>
      <input id="noteTitle" maxlength="100" placeholder="Example: Mathematics - Chapter 1" required>
      <label for="noteBody">Your note</label>
      <textarea id="noteBody" maxlength="10000" placeholder="Write your notes here..." required></textarea>
      <button type="submit">Save note</button>
    </form>
    <div class="local-record-list" id="noteRecords"></div>
  `;

  $("#noteForm").addEventListener("submit", event => {
    event.preventDefault();

    const title = $("#noteTitle").value.trim();
    const body = $("#noteBody").value.trim();

    if (!title || !body) return;

    const items = readStore(STORAGE.notes);
    items.unshift({ id: makeId(), title, body, date: Date.now() });

    writeStore(STORAGE.notes, items);
    renderNotesTool(container);
    showToast("Note saved on this device.");
  });

  renderRecordList(
    $("#noteRecords"),
    notes,
    item => `
      <div>
        <strong>${escapeHTML(item.title)}</strong>
        <small>${formatDate(item.date)}</small>
        <p>${escapeHTML(item.body)}</p>
      </div>
    `,
    STORAGE.notes,
    () => renderNotesTool(container)
  );
}

/* Chapter summaries */

function renderChaptersTool(container) {
  const chapters = readStore(STORAGE.chapters);

  container.innerHTML = `
    <form class="local-form" id="chapterForm">
      <label for="chapterSubject">Subject</label>
      <input id="chapterSubject" placeholder="Example: General Science" required>
      <label for="chapterName">Chapter name</label>
      <input id="chapterName" placeholder="Example: Chapter 1 - Introduction" required>
      <label for="chapterContent">Summary or important points</label>
      <textarea id="chapterContent" placeholder="Write or paste your chapter summary..." required></textarea>
      <button type="submit">Save chapter</button>
    </form>
    <div class="local-record-list" id="chapterRecords"></div>
  `;

  $("#chapterForm").addEventListener("submit", event => {
    event.preventDefault();

    const items = readStore(STORAGE.chapters);
    items.unshift({
      id: makeId(),
      subject: $("#chapterSubject").value.trim(),
      title: $("#chapterName").value.trim(),
      content: $("#chapterContent").value.trim(),
      date: Date.now()
    });

    writeStore(STORAGE.chapters, items);
    renderChaptersTool(container);
    renderSavedChapters();
    showToast("Chapter saved.");
  });

  renderRecordList(
    $("#chapterRecords"),
    chapters,
    item => `
      <div>
        <strong>${escapeHTML(item.title)}</strong>
        <small>${escapeHTML(item.subject)} · ${formatDate(item.date)}</small>
        <p>${escapeHTML(item.content)}</p>
      </div>
    `,
    STORAGE.chapters,
    () => renderChaptersTool(container)
  );
}

function renderSavedChapters() {
  const container = $("#savedChapters");
  if (!container) return;

  const chapters = readStore(STORAGE.chapters);

  if (!chapters.length) {
    container.innerHTML = "<p>Your saved chapters will appear here.</p>";
    return;
  }

  container.innerHTML = chapters.slice(0, 5).map(item => `
    <div class="local-record">
      <div>
        <strong>${escapeHTML(item.title)}</strong><br>
        <small>${escapeHTML(item.subject)}</small>
      </div>
      <small>${formatDate(item.date)}</small>
    </div>
  `).join("");
}

/* Study planner */

function renderPlannerTool(container) {
  const tasks = readStore(STORAGE.planner);

  container.innerHTML = `
    <form class="local-form" id="plannerForm">
      <label for="taskName">Study task</label>
      <input id="taskName" placeholder="Example: Revise Chapter 2" required>
      <label for="taskDate">Due date</label>
      <input id="taskDate" type="date">
      <button type="submit">Add task</button>
    </form>
    <div class="local-record-list" id="plannerRecords"></div>
  `;

  $("#plannerForm").addEventListener("submit", event => {
    event.preventDefault();

    const items = readStore(STORAGE.planner);
    items.unshift({
      id: makeId(),
      title: $("#taskName").value.trim(),
      date: $("#taskDate").value,
      done: false
    });

    writeStore(STORAGE.planner, items);
    renderPlannerTool(container);
    showToast("Study task added.");
  });

  const records = $("#plannerRecords");

  records.innerHTML = tasks.length ? tasks.map(item => `
    <div class="local-record">
      <div>
        <strong>${escapeHTML(item.title)}</strong><br>
        <small>${item.date ? escapeHTML(item.date) : "No due date"}</small>
      </div>
      <button class="local-action" data-task-done="${escapeHTML(item.id)}" type="button">
        ${item.done ? "Completed" : "Mark done"}
      </button>
    </div>
  `).join("") : "<p>No study tasks yet.</p>";

  $$("[data-task-done]", records).forEach(button => {
    button.addEventListener("click", () => {
      const items = readStore(STORAGE.planner);
      const task = items.find(item => item.id === button.dataset.taskDone);

      if (task) {
        task.done = !task.done;
        writeStore(STORAGE.planner, items);
        renderPlannerTool(container);
      }
    });
  });
}

/* ==========================================
   PRACTICE TESTS AND MCQs
========================================== */

function renderPracticeTool(tool, container) {
  const isMock = tool === "mock";

  container.innerHTML = `
    <div class="local-form">
      <label for="practiceSubject">Subject</label>
      <input id="practiceSubject" placeholder="Example: Mathematics">

      <label for="practiceChapter">Chapter / Topic</label>
      <input id="practiceChapter" placeholder="Example: Chapter 1">

      <label for="practiceCount">Number of questions</label>
      <input id="practiceCount" type="number" min="1" max="30" value="10">

      <button type="button" id="generatePractice">
        ${isMock ? "Make a mock test" : "Generate MCQs"}
      </button>

      <p class="tool-hint">
        Your request will be sent to Zubaan AI to generate practice questions.
      </p>
    </div>

    <div id="practiceResult"></div>
  `;

  $("#generatePractice").addEventListener("click", async () => {
    const subject = $("#practiceSubject").value.trim();
    const chapter = $("#practiceChapter").value.trim();
    const count = Math.min(
      30,
      Math.max(1, Number($("#practiceCount").value) || 10)
    );

    if (!subject || !chapter) {
      showToast("Please enter a subject and chapter.");
      return;
    }

    const result = $("#practiceResult");
    const button = $("#generatePractice");

    button.disabled = true;
    button.textContent = translate("Thinking...");
    result.innerHTML = `<p>${escapeHTML(translate("Thinking..."))}</p>`;

    try {
      if (!navigator.onLine) {
        throw new Error("AI chat needs an internet connection.");
      }

      const prompt = isMock
        ? `Create a ${count}-question mock test for ${subject}, ${chapter}. Include questions, options where appropriate, and an answer key at the end.`
        : `Generate ${count} multiple choice questions (MCQs) for ${subject}, ${chapter}. Include four options and the correct answer for each question.`;

      const response = await fetch("/.netlify/functions/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: prompt,
          language: state.language,
          mode: "student"
        })
      });

      if (!response.ok) {
        throw new Error("The AI service is currently unavailable.");
      }

      const data = await response.json();
      const answer = data.reply || data.answer || data.message || "";

      result.innerHTML = `
        <div class="practice-result">
          <h3>${escapeHTML(isMock ? "Mock test" : "MCQs")}</h3>
          <div class="practice-answer">${escapeHTML(answer).replace(/\n/g, "<br>")}</div>
          <button type="button" class="local-action" id="copyPractice">Copy questions</button>
        </div>
      `;

      $("#copyPractice")?.addEventListener("click", () => {
        GenCopyText(answer);
      });
    } catch (error) {
      result.textContent = error.message || "Something went wrong. Please try again.";
    } finally {
      button.disabled = false;
      button.textContent = translate(isMock ? "Make a mock test" : "Generate MCQs");
    }
  });
}

/* ==========================================
   FLASHCARDS
========================================== */

function renderFlashcardsTool(container) {
  const cards = readStore(STORAGE.notes + "_flashcards");

  container.innerHTML = `
    <form class="local-form" id="flashcardForm">
      <label for="flashQuestion">Question / Term</label>
      <input id="flashQuestion" maxlength="300" required>

      <label for="flashAnswer">Answer</label>
      <textarea id="flashAnswer" maxlength="2000" required></textarea>

      <button type="submit">Save flashcard</button>
    </form>

    <div class="local-record-list" id="flashcardRecords"></div>
  `;

  $("#flashcardForm").addEventListener("submit", event => {
    event.preventDefault();

    const items = readStore(STORAGE.notes + "_flashcards");

    items.unshift({
      id: makeId(),
      question: $("#flashQuestion").value.trim(),
      answer: $("#flashAnswer").value.trim(),
      date: Date.now()
    });

    writeStore(STORAGE.notes + "_flashcards", items);
    renderFlashcardsTool(container);
    showToast("Flashcard saved.");
  });

  renderRecordList(
    $("#flashcardRecords"),
    cards,
    item => `
      <div>
        <strong>${escapeHTML(item.question)}</strong>
        <p>${escapeHTML(item.answer)}</p>
        <small>${formatDate(item.date)}</small>
      </div>
    `,
    STORAGE.notes + "_flashcards",
    () => renderFlashcardsTool(container)
  );
}

/* ==========================================
   SHARED RECORD LIST
========================================== */

function renderRecordList(container, items, renderItem, storageKey, rerender) {
  if (!container) return;

  if (!items.length) {
    container.innerHTML = `<p>${escapeHTML(translate("No saved records yet."))}</p>`;
    return;
  }

  container.innerHTML = items.map(item => `
    <article class="local-record">
      ${renderItem(item)}
      <button
        type="button"
        class="local-delete"
        data-record-delete="${escapeHTML(item.id)}"
      >${escapeHTML(translate("Delete"))}</button>
    </article>
  `).join("");

  $$("[data-record-delete]", container).forEach(button => {
    button.addEventListener("click", () => {
      const updated = readStore(storageKey).filter(
        item => item.id !== button.dataset.recordDelete
      );

      writeStore(storageKey, updated);
      rerender();
    });
  });
}

/* ==========================================
   SHOPKEEPER TOOLS
========================================== */

function openShopTool(tool) {
  const panel = $("#shopToolPanel");
  const title = $("#shopToolTitle");
  const content = $("#shopToolContent");

  if (!panel || !title || !content || !SHOP_TOOLS[tool]) return;

  state.currentShopTool = tool;
  title.textContent = translate(SHOP_TOOLS[tool]);
  panel.hidden = false;

  $$(".feature-card", $("#shopkeeperWorkspace")).forEach(card => {
    card.hidden = true;
  });

  const heading = $("#shopkeeperWorkspace .dashboard-heading");
  if (heading) heading.hidden = true;

  renderShopTool(tool, content);
  translatePage();
  panel.scrollIntoView({ behavior: "smooth", block: "start" });
}

function closeShopTool() {
  $("#shopToolPanel").hidden = true;

  $$(".feature-card", $("#shopkeeperWorkspace")).forEach(card => {
    card.hidden = false;
  });

  const heading = $("#shopkeeperWorkspace .dashboard-heading");
  if (heading) heading.hidden = false;

  state.currentShopTool = null;
}

function renderShopTool(tool, container) {
  if (tool === "customers") return renderCustomers(container);
  if (tool === "credit") return renderCredits(container);
  if (tool === "sales") return renderSales(container);
  if (tool === "expenses") return renderExpenses(container);
  if (tool === "payments") return renderPayments(container);
  if (tool === "stock") return renderStock(container);
}

/* Customers */

function renderCustomers(container) {
  const customers = readStore(STORAGE.customers);

  container.innerHTML = `
    <form class="local-form" id="customerForm">
      <label for="customerName">Customer name</label>
      <input id="customerName" maxlength="100" required>

      <label for="customerPhone">Phone number</label>
      <input id="customerPhone" maxlength="30">

      <label for="customerDetails">Address / Details</label>
      <textarea id="customerDetails" maxlength="1000"></textarea>

      <button type="submit">Save customer</button>
    </form>

    <div class="local-record-list" id="customerRecords"></div>
  `;

  $("#customerForm").addEventListener("submit", event => {
    event.preventDefault();

    const items = readStore(STORAGE.customers);

    items.unshift({
      id: makeId(),
      name: $("#customerName").value.trim(),
      phone: $("#customerPhone").value.trim(),
      details: $("#customerDetails").value.trim(),
      date: Date.now()
    });

    writeStore(STORAGE.customers, items);
    renderCustomers(container);
    showToast("Customer saved on this device.");
  });

  renderRecordList(
    $("#customerRecords"),
    customers,
    item => `
      <div>
        <strong>${escapeHTML(item.name)}</strong>
        <small>${escapeHTML(item.phone || "")}</small>
        <p>${escapeHTML(item.details || "")}</p>
      </div>
    `,
    STORAGE.customers,
    () => renderCustomers(container)
  );
}

/* Udhar ledger */

function renderCredits(container) {
  const credits = readStore(STORAGE.credits);
  const total = credits.reduce(
    (sum, item) => sum + Number(item.amount || 0) - Number(item.paid || 0),
    0
  );

  container.innerHTML = `
    <div class="tool-stat">
      <span>Total outstanding udhar</span>
      <strong>${formatMoney(total)}</strong>
    </div>

    <form class="local-form" id="creditForm">
      <label for="creditCustomer">Customer name</label>
      <input id="creditCustomer" required>

      <label for="creditAmount">Amount (Rs.)</label>
      <input id="creditAmount" type="number" min="1" step="0.01" required>

      <label for="creditDetails">Details</label>
      <textarea id="creditDetails"></textarea>

      <button type="submit">Add udhar</button>
    </form>

    <div class="local-record-list" id="creditRecords"></div>
  `;

  $("#creditForm").addEventListener("submit", event => {
    event.preventDefault();

    const items = readStore(STORAGE.credits);

    items.unshift({
      id: makeId(),
      customer: $("#creditCustomer").value.trim(),
      amount: Number($("#creditAmount").value),
      paid: 0,
      details: $("#creditDetails").value.trim(),
      date: Date.now()
    });

    writeStore(STORAGE.credits, items);
    renderCredits(container);
    showToast("Udhar entry saved offline.");
  });

  renderRecordList(
    $("#creditRecords"),
    credits,
    item => `
      <div>
        <strong>${escapeHTML(item.customer)}</strong>
        <p>${escapeHTML(item.details || "")}</p>
        <small>
          Total: ${formatMoney(item.amount)} ·
          Paid: ${formatMoney(item.paid)} ·
          Due: ${formatMoney(item.amount - item.paid)}
        </small>
      </div>
    `,
    STORAGE.credits,
    () => renderCredits(container)
  );
}

/* Daily sales */

function renderSales(container) {
  const sales = readStore(STORAGE.sales);
  const total = sales.reduce((sum, item) => sum + Number(item.amount || 0), 0);

  container.innerHTML = `
    <div class="tool-stat">
      <span>Total recorded sales</span>
      <strong>${formatMoney(total)}</strong>
    </div>

    <form class="local-form" id="salesForm">
      <label for="saleAmount">Sale amount (Rs.)</label>
      <input id="saleAmount" type="number" min="1" step="0.01" required>

      <label for="saleDetails">Sale details</label>
      <textarea id="saleDetails"></textarea>

      <button type="submit">Record sale</button>
    </form>

    <div class="local-record-list" id="salesRecords"></div>
  `;

  $("#salesForm").addEventListener("submit", event => {
    event.preventDefault();

    const items = readStore(STORAGE.sales);

    items.unshift({
      id: makeId(),
      amount: Number($("#saleAmount").value),
      details: $("#saleDetails").value.trim(),
      date: Date.now()
    });

    writeStore(STORAGE.sales, items);
    renderSales(container);
    showToast("Sale recorded.");
  });

  renderRecordList(
    $("#salesRecords"),
    sales,
    item => `
      <div>
        <strong>${formatMoney(item.amount)}</strong>
        <p>${escapeHTML(item.details || "")}</p>
        <small>${formatDate(item.date)}</small>
      </div>
    `,
    STORAGE.sales,
    () => renderSales(container)
  );
}

/* Expenses */

function renderExpenses(container) {
  const expenses = readStore(STORAGE.expenses);
  const total = expenses.reduce(
    (sum, item) => sum + Number(item.amount || 0),
    0
  );

  container.innerHTML = `
    <div class="tool-stat">
      <span>Total recorded expenses</span>
      <strong>${formatMoney(total)}</strong>
    </div>

    <form class="local-form" id="expenseForm">
      <label for="expenseName">Expense description</label>
      <input id="expenseName" required>

      <label for="expenseAmount">Amount (Rs.)</label>
      <input id="expenseAmount" type="number" min="1" step="0.01" required>

      <button type="submit">Save expense</button>
    </form>

    <div class="local-record-list" id="expenseRecords"></div>
  `;

  $("#expenseForm").addEventListener("submit", event => {
    event.preventDefault();

    const items = readStore(STORAGE.expenses);

    items.unshift({
      id: makeId(),
      name: $("#expenseName").value.trim(),
      amount: Number($("#expenseAmount").value),
      date: Date.now()
    });

    writeStore(STORAGE.expenses, items);
    renderExpenses(container);
    showToast("Expense saved.");
  });

  renderRecordList(
    $("#expenseRecords"),
    expenses,
    item => `
      <div>
        <strong>${escapeHTML(item.name)}</strong>
        <small>${formatMoney(item.amount)} · ${formatDate(item.date)}</small>
      </div>
    `,
    STORAGE.expenses,
    () => renderExpenses(container)
  );
}

/* Payment history */

function renderPayments(container) {
  const credits = readStore(STORAGE.credits);
  const payments = credits.filter(item => Number(item.paid || 0) > 0);

  container.innerHTML = `
    <div class="local-record-list" id="paymentRecords"></div>
  `;

  const records = $("#paymentRecords");

  if (!payments.length) {
    records.innerHTML = `<p>${escapeHTML(translate("No payments recorded yet."))}</p>`;
    return;
  }

  records.innerHTML = payments.map(item => `
    <article class="local-record">
      <div>
        <strong>${escapeHTML(item.customer)}</strong>
        <p>Paid: ${formatMoney(item.paid)}</p>
        <small>Remaining: ${formatMoney(item.amount - item.paid)}</small>
      </div>
    </article>
  `).join("");
}

/* Stock notes */

function renderStock(container) {
  const stock = readStore(STORAGE.stock);

  container.innerHTML = `
    <form class="local-form" id="stockForm">
      <label for="stockItem">Item / Product</label>
      <input id="stockItem" required>

      <label for="stockQuantity">Quantity</label>
      <input id="stockQuantity" type="number" min="0" step="1" required>

      <label for="stockDetails">Details</label>
      <textarea id="stockDetails"></textarea>

      <button type="submit">Save stock note</button>
    </form>

    <div class="local-record-list" id="stockRecords"></div>
  `;

  $("#stockForm").addEventListener("submit", event => {
    event.preventDefault();

    const items = readStore(STORAGE.stock);

    items.unshift({
      id: makeId(),
      item: $("#stockItem").value.trim(),
      quantity: Number($("#stockQuantity").value),
      details: $("#stockDetails").value.trim(),
      date: Date.now()
    });

    writeStore(STORAGE.stock, items);
    renderStock(container);
    showToast("Stock note saved.");
  });

  renderRecordList(
    $("#stockRecords"),
    stock,
    item => `
      <div>
        <strong>${escapeHTML(item.item)}</strong>
        <p>Quantity: ${Number(item.quantity)}</p>
        <small>${escapeHTML(item.details || "")}</small>
      </div>
    `,
    STORAGE.stock,
    () => renderStock(container)
  );
}

/* ==========================================
   SIDEBAR
========================================== */

function openSidebar() {
  document.body.classList.add("sidebar-open");
}

function closeSidebar() {
  document.body.classList.remove("sidebar-open");
}

/* ==========================================
   COPY HELPER
========================================== */

async function GenCopyText(value) {
  try {
    await navigator.clipboard.writeText(String(value));
    showToast("Copied successfully.");
  } catch {
    showToast("Could not copy. Please try again.");
  }
}

/* ==========================================
   VOICE INPUT
========================================== */

function setupVoice() {
  const button = $("#voiceButton");
  if (!button) return;

  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    button.title = "Voice input is not supported in this browser.";
    button.addEventListener("click", () => {
      showToast("Voice input is not supported in this browser.");
    });
    return;
  }

  state.recognition = new SpeechRecognition();
  state.recognition.continuous = false;
  state.recognition.interimResults = false;

  const languageMap = {
    roman: "ur-PK",
    ur: "ur-PK",
    en: "en-US",
    pa: "pa-IN",
    sd: "ur-PK",
    ps: "ps-AF"
  };

  state.recognition.onstart = () => {
    button.classList.add("recording");
    showToast("Listening...");
  };

  state.recognition.onresult = event => {
    const transcript = event.results[0][0].transcript;
    const input = $("#question");

    if (input) {
      input.value = (input.value + " " + transcript).trim();
      updateCharacterCount();
      input.focus();
    }
  };

  state.recognition.onerror = () => {
    showToast("Voice input could not start. Please try again.");
  };

  state.recognition.onend = () => {
    button.classList.remove("recording");
  };

  button.addEventListener("click", () => {
    try {
      state.recognition.lang = languageMap[state.language] || "ur-PK";
      state.recognition.start();
    } catch {
      showToast("Voice input is already active.");
    }
  });
}

/* ==========================================
   LANGUAGE SELECTOR
========================================== */

function setupLanguage() {
  const select = $("#language");
  if (!select) return;

  let saved = null;

  try {
    saved = localStorage.getItem(STORAGE.language);
  } catch {
    // Continue with the default language.
  }

  if (saved && [...select.options].some(option => option.value === saved)) {
    select.value = saved;
  }

  state.language = select.value || "roman";

  select.addEventListener("change", () => {
    state.language = select.value;

    try {
      localStorage.setItem(STORAGE.language, state.language);
    } catch {
      // Language still changes for this session.
    }

    translatePage();

    if (state.currentStudentTool) {
      openStudentTool(state.currentStudentTool);
    }

    if (state.currentShopTool) {
      openShopTool(state.currentShopTool);
    }

    showToast("Language preference saved.");
  });

  translatePage();
}

/* ==========================================
   CHARACTER COUNT
========================================== */

function updateCharacterCount() {
  const input = $("#question");
  const counter = $("#charCount");

  if (input && counter) {
    counter.textContent = `${input.value.length} / 4000`;
  }
}

/* ==========================================
   ABOUT DIALOG
========================================== */

function setupAbout() {
  const dialog = $("#aboutDialog");

  $("#helpButton")?.addEventListener("click", () => {
    if (dialog?.showModal) dialog.showModal();
  });

  $("#closeAbout")?.addEventListener("click", () => dialog?.close());
  $("#aboutDone")?.addEventListener("click", () => dialog?.close());
}

/* ==========================================
   EVENTS
========================================== */

function setupEvents() {
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

  $("#questionForm")?.addEventListener("submit", sendMessage);
  $("#question")?.addEventListener("input", updateCharacterCount);

  $("#question")?.addEventListener("keydown", event => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      $("#questionForm")?.requestSubmit();
    }
  });

  $("#newChat")?.addEventListener("click", newChat);
  $("#headerNewChat")?.addEventListener("click", newChat);
  $("#clearHistory")?.addEventListener("click", clearHistory);

  $("#recentList")?.addEventListener("click", event => {
    const deleteButton = event.target.closest("[data-delete-chat]");

    if (deleteButton) {
      event.stopPropagation();
      deleteChat(deleteButton.dataset.deleteChat);
      return;
    }

    const chatButton = event.target.closest("[data-chat-id]");
    if (chatButton) selectChat(chatButton.dataset.chatId);
  });

  $("#openSidebar")?.addEventListener("click", openSidebar);
  $("#closeSidebar")?.addEventListener("click", closeSidebar);

  $("#backToStudent")?.addEventListener("click", closeStudentTool);
  $("#backToShop")?.addEventListener("click", closeShopTool);

  $("#largeText")?.addEventListener("click", () => {
    const enabled = document.body.classList.toggle("large-text");

    $("#largeText").setAttribute("aria-pressed", String(enabled));

    showToast(
      enabled ? "Larger text enabled." : "Normal text enabled."
    );
  });

  setupAbout();
}

/* ==========================================
   INITIALIZATION
========================================== */

function initialize() {
  state.chats = readStore(STORAGE.chats);
  state.activeChatId = readStore(STORAGE.activeChat, null);

  if (
    !state.activeChatId ||
    !state.chats.some(chat => chat.id === state.activeChatId)
  ) {
    state.activeChatId = state.chats[0]?.id || null;
  }

  if (!state.chats.length) createChat();

  setupEvents();
  setupLanguage();
  setupVoice();

  renderChatHistory();
  renderMessages();
  renderSavedChapters();
  updateWelcome();
  updateCharacterCount();

  setMode("general");
  translatePage();

  window.addEventListener("online", () => {
    showToast("Internet connection restored.");
  });

  window.addEventListener("offline", () => {
    showToast("You are offline. Saved records remain available.");
  });
}

document.addEventListener("DOMContentLoaded", initialize);
