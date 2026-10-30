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
    "Sale amount (Rs.)": "Sale ki raqam",
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
    "General assistant": "عمومی مرستیال",
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

/* Keep original text so switching languages works both ways. */
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
  const isUrdu = state.language === "ur";

  document.documentElement.lang = state.language;
  document.documentElement.dir = isUrdu ? "rtl" : "ltr";
  document.body.classList.toggle("rtl-language", isUrdu);

  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT
  );

  let node;

  while ((node = walker.nextNode())) {
    const parent = node.parentElement;

    if (!parent) continue;
    if (["SCRIPT", "STYLE", "TEXTAREA"].includes(parent.tagName)) continue;
    if (parent.closest("#question")) continue;
    if (parent.closest(".chat-message")) continue;
    if (parent.closest(".history-chat-title")) continue;

    if (!originalText.has(node)) {
      originalText.set(node, node.nodeValue);
    }

    const original = originalText.get(node);
    const trimmed = original.trim();

    if (!trimmed) continue;

    const translated = translate(trimmed);
    const leading = original.match(/^\s*/)?.[0] || "";
    const trailing = original.match(/\s*$/)?.[0] || "";

    const nextValue = leading + translated + trailing;

    if (node.nodeValue !== nextValue) {
      node.nodeValue = nextValue;
    }
  }

  $$("input, button, select, textarea, [title], [aria-label]").forEach(
    translateElement
  );

  const modeTitle = $("#currentModeTitle");
  const translatedMode = translate(MODE_TITLES[state.mode]);

  if (modeTitle && modeTitle.textContent !== translatedMode) {
    modeTitle.textContent = translatedMode;
  }

  const studentTitle = $("#studentToolTitle");
  const translatedStudent = state.currentStudentTool
    ? translate(STUDENT_TOOLS[state.currentStudentTool])
    : "";

  if (
    studentTitle &&
    state.currentStudentTool &&
    studentTitle.textContent !== translatedStudent
  ) {
    studentTitle.textContent = translatedStudent;
  }

  const shopTitle = $("#shopToolTitle");
  const translatedShop = state.currentShopTool
    ? translate(SHOP_TOOLS[state.currentShopTool])
    : "";

  if (
    shopTitle &&
    state.currentShopTool &&
    shopTitle.textContent !== translatedShop
  ) {
    shopTitle.textContent = translatedShop;
  }
}

/* ==========================================
   STORAGE HELPERS
========================================== */

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
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[char]);
}

function formatDate(value) {
  return new Date(value).toLocaleDateString(
    state.language === "ur" ? "ur-PK" : "en-PK",
    { day: "numeric", month: "short", year: "numeric" }
  );
}

function formatMoney(value) {
  return "Rs. " + Number(value || 0).toLocaleString("en-PK");
}

function showToast(message) {
  const toast = $("#toast");
  if (!toast) return;

  toast.textContent = translate(message);
  toast.classList.add("visible");

  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => {
    toast.classList.remove("visible");
  }, 2600);
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
  renderChatHistory();
  renderMessages();
  updateWelcome();

  return chat;
}

function getActiveChat() {
  return state.chats.find(chat => chat.id === state.activeChatId);
}

function saveChats() {
  writeStore(STORAGE.chats, state.chats);
  writeStore(STORAGE.activeChat, state.activeChatId);
}

function selectChat(id) {
  const chat = state.chats.find(item => item.id === id);
  if (!chat) return;

  state.activeChatId = id;
  saveChats();
  renderChatHistory();
  renderMessages();
  updateWelcome();
  closeSidebar();
}

function deleteChat(id) {
  state.chats = state.chats.filter(chat => chat.id !== id);

  if (state.activeChatId === id) {
    state.activeChatId = state.chats[0]?.id || null;
  }

  if (!state.activeChatId) createChat();

  saveChats();
  renderChatHistory();
  renderMessages();
  updateWelcome();
}

function newChat() {
  createChat();
  setMode("general");
  closeSidebar();

  const input = $("#question");
  if (input) input.focus();
}

function addMessage(role, content) {
  let chat = getActiveChat();

  if (!chat) chat = createChat();

  const message = {
    id: makeId(),
    role,
    content,
    createdAt: Date.now()
  };

  chat.messages.push(message);
  chat.updatedAt = Date.now();

  if (chat.title === "New chat" && role === "user") {
    chat.title = content.slice(0, 42) || "New chat";
  }

  saveChats();
  renderMessages();
  renderChatHistory();

  return message;
}

function renderChatHistory() {
  const container = $("#recentList");
  if (!container) return;

  if (!state.chats.length) {
    container.innerHTML = `<div class="empty-history">Your conversations will appear here.</div>`;
    return;
  }

  const sorted = [...state.chats].sort(
    (a, b) => b.updatedAt - a.updatedAt
  );

  container.innerHTML = sorted.map(chat => `
    <div class="history-item ${chat.id === state.activeChatId ? "active" : ""}">
      <button class="history-chat-button" type="button"
        data-chat-id="${escapeHTML(chat.id)}"
        title="${escapeHTML(chat.title)}">
        <span class="history-chat-icon">▤</span>
        <span class="history-chat-title">${escapeHTML(chat.title)}</span>
      </button>
      <button class="history-delete" type="button"
        data-delete-chat="${escapeHTML(chat.id)}"
        aria-label="Delete conversation">×</button>
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

  if (welcome) welcome.hidden = !!(chat && chat.messages.length);
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

/* ==========================================
   MODE MANAGEMENT
========================================== */

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

/* Practice tools */

function renderPracticeTool(tool, container) {
  const isMock = tool === "mock";

  container.innerHTML = `
    <form class="local-form" id="practiceForm">
      <label for="practiceSubject">Subject</label>
      <input id="practiceSubject" placeholder="Enter subject name" required>
      <label for="practiceChapter">Chapter or topic</label>
      <input id="practiceChapter" placeholder="Enter chapter or topic" required>
      <label for="practiceCount">Number of questions</label>
      <select id="practiceCount">
        <option value="5">5 questions</option>
        <option value="10">10 questions</option>
        <option value="15">15 questions</option>
        <option value="20">20 questions</option>
      </select>
      <button type="submit">Prepare ${isMock ? "mock test" : "MCQ practice"}</button>
    </form>
    <div id="practiceResult"></div>
  `;

  $("#practiceForm").addEventListener("submit", event => {
    event.preventDefault();

    const subject = $("#practiceSubject").value.trim();
    const chapter = $("#practiceChapter").value.trim();
    const count = $("#practiceCount").value;

    const prompt = isMock
      ? `Create a ${count}-question mock test for ${subject}, ${chapter}. Include questions, multiple choice options and an answer key at the end.`
      : `Create ${count} multiple-choice questions for ${subject}, ${chapter}. Include four options and correct answers.`;

    const input = $("#question");

    if (input) {
      input.value = prompt;
      setMode("general");
      input.focus();
      showToast("Your study prompt is ready. Send it to the AI when connected.");
    }
  });
}

/* Flashcards */

function renderFlashcardsTool(container) {
  const cards = readStore("zubaan_flashcards_v1");

  container.innerHTML = `
    <form class="local-form" id="flashcardForm">
      <label for="flashQuestion">Question / Term</label>
      <input id="flashQuestion" placeholder="Example: What is photosynthesis?" required>
      <label for="flashAnswer">Answer</label>
      <textarea id="flashAnswer" placeholder="Write the answer..." required></textarea>
      <button type="submit">Save flashcard</button>
    </form>
    <div id="flashcardRecords"></div>
  `;

  $("#flashcardForm").addEventListener("submit", event => {
    event.preventDefault();

    const items = readStore("zubaan_flashcards_v1");
    items.unshift({
      id: makeId(),
      question: $("#flashQuestion").value.trim(),
      answer: $("#flashAnswer").value.trim()
    });

    writeStore("zubaan_flashcards_v1", items);
    renderFlashcardsTool(container);
    showToast("Flashcard saved.");
  });

  const records = $("#flashcardRecords");

  records.innerHTML = cards.length ? cards.map(item => `
    <details class="local-record">
      <summary>${escapeHTML(item.question)}</summary>
      <p>${escapeHTML(item.answer)}</p>
    </details>
  `).join("") : "<p>No flashcards saved yet.</p>";
}

/* Shared record rendering */

function renderRecordList(container, items, renderItem, storageKey, rerender) {
  if (!container) return;

  if (!items.length) {
    container.innerHTML = "<p>No saved records yet.</p>";
    return;
  }

  container.innerHTML = items.map(item => `
    <div class="local-record">
      ${renderItem(item)}
      <button class="local-delete" data-record-delete="${escapeHTML(item.id)}" type="button">
        Delete
      </button>
    </div>
  `).join("");

  $$("[data-record-delete]", container).forEach(button => {
    button.addEventListener("click", () => {
      const records = readStore(storageKey).filter(
        item => item.id !== button.dataset.recordDelete
      );

      writeStore(storageKey, records);
      renderSavedChapters();

      if (rerender) rerender();
      else renderRecordList(container, records, renderItem, storageKey);
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
  if (tool === "credit") return renderCredits(container);
  if (tool === "customers") return renderCustomers(container);
  if (tool === "sales") return renderSales(container);
  if (tool === "expenses") return renderExpenses(container);
  if (tool === "payments") return renderPayments(container);
  if (tool === "stock") return renderStock(container);
}

/* Customer records */

function renderCustomers(container) {
  const customers = readStore(STORAGE.customers);

  container.innerHTML = `
    <form class="local-form" id="customerForm">
      <label for="customerName">Customer name</label>
      <input id="customerName" placeholder="Customer name" required>
      <label for="customerPhone">Phone number</label>
      <input id="customerPhone" type="tel" placeholder="Phone number">
      <label for="customerAddress">Address / Details</label>
      <input id="customerAddress" placeholder="Optional details">
      <button type="submit">Save customer</button>
    </form>
    <div id="customerRecords"></div>
  `;

  $("#customerForm").addEventListener("submit", event => {
    event.preventDefault();

    const items = readStore(STORAGE.customers);
    items.unshift({
      id: makeId(),
      name: $("#customerName").value.trim(),
      phone: $("#customerPhone").value.trim(),
      address: $("#customerAddress").value.trim(),
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
        <small>${escapeHTML(item.phone || "No phone number")}</small>
        <p>${escapeHTML(item.address || "")}</p>
      </div>
    `,
    STORAGE.customers,
    () => renderCustomers(container)
  );
}

/* Udhar ledger */

function renderCredits(container) {
  const credits = readStore(STORAGE.credits);
  const total = credits.reduce((sum, item) => sum + Number(item.remaining || 0), 0);

  container.innerHTML = `
    <div class="credit-summary">
      <span>Total outstanding udhar</span>
      <strong>${formatMoney(total)}</strong>
    </div>
    <form class="local-form" id="creditForm">
      <label for="creditName">Customer name</label>
      <input id="creditName" placeholder="Customer name" required>
      <label for="creditAmount">Amount (Rs.)</label>
      <input id="creditAmount" type="number" min="1" step="0.01" placeholder="Amount" required>
      <label for="creditDetails">Details</label>
      <input id="creditDetails" placeholder="Items or transaction details">
      <button type="submit">Add udhar</button>
    </form>
    <div id="creditRecords"></div>
  `;

  $("#creditForm").addEventListener("submit", event => {
    event.preventDefault();

    const amount = Number($("#creditAmount").value);
    if (amount <= 0) return;

    const items = readStore(STORAGE.credits);
    items.unshift({
      id: makeId(),
      name: $("#creditName").value.trim(),
      amount,
      paid: 0,
      remaining: amount,
      details: $("#creditDetails").value.trim(),
      date: Date.now()
    });

    writeStore(STORAGE.credits, items);
    renderCredits(container);
    showToast("Udhar entry saved offline.");
  });

  const records = $("#creditRecords");

  records.innerHTML = credits.length ? credits.map(item => `
    <div class="local-record credit-record">
      <div>
        <strong>${escapeHTML(item.name)}</strong>
        <small>${formatDate(item.date)} · ${escapeHTML(item.details)}</small>
        <p>Original: ${formatMoney(item.amount)} | Paid: ${formatMoney(item.paid)}</p>
        <strong>Remaining: ${formatMoney(item.remaining)}</strong>
      </div>
      <div class="credit-actions">
        <button class="local-action" data-credit-pay="${escapeHTML(item.id)}" type="button">
          Receive payment
        </button>
      </div>
    </div>
  `).join("") : "<p>No udhar entries yet.</p>";

  $$("[data-credit-pay]", records).forEach(button => {
    button.addEventListener("click", () => {
      const items = readStore(STORAGE.credits);
      const item = items.find(entry => entry.id === button.dataset.creditPay);

      if (!item || item.remaining <= 0) return;

      const value = Number(prompt(
        `Remaining balance: ${formatMoney(item.remaining)}\nEnter payment received:`
      ));

      if (!Number.isFinite(value) || value <= 0) return;

      if (value > item.remaining) {
        showToast("Payment cannot exceed the remaining balance.");
        return;
      }

      item.paid += value;
      item.remaining -= value;

      writeStore(STORAGE.credits, items);
      renderCredits(container);
      showToast("Payment recorded.");
    });
  });
}

/* Daily sales */

function renderSales(container) {
  const sales = readStore(STORAGE.sales);
  const total = sales.reduce((sum, item) => sum + Number(item.amount), 0);

  container.innerHTML = `
    <div class="credit-summary">
      <span>Total recorded sales</span>
      <strong>${formatMoney(total)}</strong>
    </div>
    <form class="local-form" id="saleForm">
      <label for="saleAmount">Sale amount (Rs.)</label>
      <input id="saleAmount" type="number" min="1" step="0.01" required>
      <label for="saleDetails">Sale details</label>
      <input id="saleDetails" placeholder="Optional details">
      <button type="submit">Record sale</button>
    </form>
    <div id="saleRecords"></div>
  `;

  $("#saleForm").addEventListener("submit", event => {
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
    $("#saleRecords"),
    sales,
    item => `
      <div>
        <strong>${formatMoney(item.amount)}</strong>
        <small>${formatDate(item.date)}</small>
        <p>${escapeHTML(item.details)}</p>
      </div>
    `,
    STORAGE.sales,
    () => renderSales(container)
  );
}

/* Expenses */

function renderExpenses(container) {
  const expenses = readStore(STORAGE.expenses);
  const total = expenses.reduce((sum, item) => sum + Number(item.amount), 0);

  container.innerHTML = `
    <div class="credit-summary">
      <span>Total recorded expenses</span>
      <strong>${formatMoney(total)}</strong>
    </div>
    <form class="local-form" id="expenseForm">
      <label for="expenseName">Expense description</label>
      <input id="expenseName" placeholder="Example: Electricity bill" required>
      <label for="expenseAmount">Amount (Rs.)</label>
      <input id="expenseAmount" type="number" min="1" step="0.01" required>
      <button type="submit">Save expense</button>
    </form>
    <div id="expenseRecords"></div>
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
        <small>${formatDate(item.date)}</small>
        <p>${formatMoney(item.amount)}</p>
      </div>
    `,
    STORAGE.expenses,
    () => renderExpenses(container)
  );
}

/* Payment history */

function renderPayments(container) {
  const credits = readStore(STORAGE.credits);
  const payments = credits.filter(item => Number(item.paid) > 0);

  container.innerHTML = `
    <div class="credit-summary">
      <span>Total payments received against udhar</span>
      <strong>${formatMoney(
        payments.reduce((sum, item) => sum + Number(item.paid), 0)
      )}</strong>
    </div>
    <div id="paymentRecords"></div>
  `;

  $("#paymentRecords").innerHTML = payments.length
    ? payments.map(item => `
      <div class="local-record">
        <div>
          <strong>${escapeHTML(item.name)}</strong>
          <small>${formatDate(item.date)}</small>
        </div>
        <strong>${formatMoney(item.paid)}</strong>
      </div>
    `).join("")
    : "<p>No payments recorded yet.</p>";
}

/* Stock notes */

function renderStock(container) {
  const records = readStore(STORAGE.stock);

  container.innerHTML = `
    <form class="local-form" id="stockForm">
      <label for="stockName">Item / Product</label>
      <input id="stockName" placeholder="Product name" required>
      <label for="stockQuantity">Quantity</label>
      <input id="stockQuantity" type="number" min="0" placeholder="Quantity" required>
      <label for="stockDetails">Notes</label>
      <input id="stockDetails" placeholder="Restocking or other notes">
      <button type="submit">Save stock note</button>
    </form>
    <div id="stockRecords"></div>
  `;

  $("#stockForm").addEventListener("submit", event => {
    event.preventDefault();

    const items = readStore(STORAGE.stock);
    items.unshift({
      id: makeId(),
      name: $("#stockName").value.trim(),
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
    records,
    item => `
      <div>
        <strong>${escapeHTML(item.name)}</strong>
        <small>Quantity: ${item.quantity} · ${formatDate(item.date)}</small>
        <p>${escapeHTML(item.details)}</p>
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

  const saved = localStorage.getItem(STORAGE.language);

  if (saved && [...select.options].some(option => option.value === saved)) {
    select.value = saved;
  }

  state.language = select.value || "roman";

  select.addEventListener("change", () => {
    state.language = select.value;

    try {
      localStorage.setItem(STORAGE.language, state.language);
    } catch {}

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
    showToast(enabled ? "Larger text enabled." : "Normal text enabled.");
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
