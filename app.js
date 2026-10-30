
/**
 * Zubaan AI — app.js (vanilla JavaScript, no dependencies)
 *
 * HTML hooks expected (all adjustable in SELECTORS below):
 *  #sidebar, #sidebarToggle, #topbar, #chatMessages, #chatForm, #chatInput, #sendBtn,
 *  #newChatBtn, #clearHistoryBtn, #historyList, #languageSelect (values: en | ur | roman),
 *  [data-mode="general|student|shopkeeper"], #studentPanel, #studentTools,
 *  #shopkeeperPanel, #customerForm (inputs: name, phone, balance), #customerList.
 *  Translatable text: data-i18n, data-i18n-placeholder, data-i18n-title, data-i18n-aria-label.
 */
(function () {
  'use strict';
  if (window.__zubaanInitialized) return; // prevent duplicate listeners on re-inclusion
  window.__zubaanInitialized = true;

  /* ============================ 1. CONFIG ============================ */
  const CONFIG = {
    // >>> CONFIGURABLE PLACEHOLDER: set to your own backend endpoint. Never put secret keys here;
    // keep API keys on the server side. <<<
    API_URL: '',
    API_HEADERS: { 'Content-Type': 'application/json' }, // add non-secret headers only
    REQUEST_TIMEOUT_MS: 30000,
    HISTORY_CONTEXT_LIMIT: 20, // messages of context sent with each request
    TOAST_DURATION_MS: 3500,
    TITLE_MAX: 40,
    STORAGE: {
      STATE: 'zubaan.v1.state',
      LANG: 'zubaan.v1.lang',
      CUSTOMERS: 'zubaan.v1.customers',
    },
  };

  const MODES = ['general', 'student', 'shopkeeper'];
  const LANGUAGES = ['en', 'ur', 'roman'];
  const DEFAULT_LANG = 'en';

  const SELECTORS = {
    sidebar: '#sidebar',
    sidebarToggle: '#sidebarToggle',
    header: '#topbar, header',
    messages: '#chatMessages',
    chatForm: '#chatForm',
    chatInput: '#chatInput',
    sendBtn: '#sendBtn',
    newChatBtn: '#newChatBtn',
    clearHistoryBtn: '#clearHistoryBtn',
    historyList: '#historyList',
    languageSelect: '#languageSelect',
    modeButton: '[data-mode]',
    studentPanel: '#studentPanel',
    studentTools: '#studentTools',
    shopPanel: '#shopkeeperPanel',
    customerForm: '#customerForm',
    customerList: '#customerList',
  };

  /* ====================== 2. TRANSLATIONS (central) ====================== */
  const I18N = {
    en: {
      appName: 'Zubaan AI', newChat: 'New chat', history: 'History', noHistory: 'No conversations yet',
      clearHistory: 'Clear history', clearConfirm: 'Delete all conversations in this mode?',
      send: 'Send', placeholder: 'Type your message…', language: 'Language', delete: 'Delete',
      modeGeneral: 'General', modeStudent: 'Student', modeShopkeeper: 'Shopkeeper',
      welcomeGeneral: 'Hello! I am Zubaan AI. Ask me anything.',
      welcomeStudent: 'Welcome, student! Pick a tool or ask me about your studies.',
      welcomeShopkeeper: 'Welcome! I can help with your shop, customers and business questions.',
      thinking: 'Thinking…', untitled: 'New chat', toggleSidebar: 'Toggle sidebar',
      errEmpty: 'Please type a message first.', errNotConfigured: 'AI backend is not configured (set CONFIG.API_URL).',
      errRequest: 'Request failed. Please try again.', errInvalid: 'The AI returned an invalid response.',
      errTimeout: 'The request timed out.', errStorage: 'Could not save data on this device.',
      toastLang: 'Language changed to English', toastNewChat: 'New chat started',
      toastCleared: 'History cleared', toastDeleted: 'Conversation deleted',
      toastReplyElsewhere: 'A reply arrived in another conversation',
      studentTools: 'Student tools', toolExplain: 'Explain a topic', toolSummarize: 'Summarize text',
      toolQuiz: 'Practice quiz', toolStudyPlan: 'Study plan', toolSelected: 'Tool selected: {tool}', toolCleared: 'Tool cleared',
      customers: 'Customers', addCustomer: 'Add customer', customerName: 'Name', customerPhone: 'Phone',
      customerBalance: 'Balance owed', noCustomers: 'No customers yet', markPaid: 'Mark paid', balance: 'Balance',
      customerAdded: 'Customer added', customerRemoved: 'Customer removed', customerPaid: 'Marked as paid',
      customerNameRequired: 'Customer name is required',
    },
    ur: {
      appName: 'زبان اے آئی', newChat: 'نئی گفتگو', history: 'تاریخ', noHistory: 'ابھی کوئی گفتگو نہیں',
      clearHistory: 'تاریخ صاف کریں', clearConfirm: 'کیا اس موڈ کی تمام گفتگو حذف کریں؟',
      send: 'بھیجیں', placeholder: 'اپنا پیغام لکھیں…', language: 'زبان', delete: 'حذف کریں',
      modeGeneral: 'عمومی', modeStudent: 'طالب علم', modeShopkeeper: 'دکاندار',
      welcomeGeneral: 'سلام! میں زبان اے آئی ہوں۔ مجھ سے کچھ بھی پوچھیں۔',
      welcomeStudent: 'خوش آمدید! کوئی ٹول منتخب کریں یا اپنی پڑھائی کے بارے میں پوچھیں۔',
      welcomeShopkeeper: 'خوش آمدید! میں آپ کی دکان، گاہکوں اور کاروبار کے سوالات میں مدد کر سکتا ہوں۔',
      thinking: 'سوچ رہا ہوں…', untitled: 'نئی گفتگو', toggleSidebar: 'سائیڈ بار کھولیں/بند کریں',
      errEmpty: 'براہِ کرم پہلے پیغام لکھیں۔', errNotConfigured: 'اے آئی بیک اینڈ ترتیب نہیں دیا گیا (CONFIG.API_URL سیٹ کریں)۔',
      errRequest: 'درخواست ناکام ہوئی۔ دوبارہ کوشش کریں۔', errInvalid: 'اے آئی کا جواب درست نہیں تھا۔',
      errTimeout: 'درخواست کا وقت ختم ہو گیا۔', errStorage: 'اس ڈیوائس پر ڈیٹا محفوظ نہیں ہو سکا۔',
      toastLang: 'زبان اردو میں تبدیل ہو گئی', toastNewChat: 'نئی گفتگو شروع ہو گئی',
      toastCleared: 'تاریخ صاف ہو گئی', toastDeleted: 'گفتگو حذف ہو گئی',
      toastReplyElsewhere: 'دوسری گفتگو میں جواب آ گیا ہے',
      studentTools: 'طالب علم کے ٹولز', toolExplain: 'موضوع سمجھائیں', toolSummarize: 'متن کا خلاصہ',
      toolQuiz: 'مشقی کوئز', toolStudyPlan: 'مطالعے کا منصوبہ', toolSelected: 'ٹول منتخب: {tool}', toolCleared: 'ٹول ہٹا دیا گیا',
      customers: 'گاہک', addCustomer: 'گاہک شامل کریں', customerName: 'نام', customerPhone: 'فون',
      customerBalance: 'واجب الادا رقم', noCustomers: 'ابھی کوئی گاہک نہیں', markPaid: 'ادا شدہ', balance: 'بقایا',
      customerAdded: 'گاہک شامل ہو گیا', customerRemoved: 'گاہک ہٹا دیا گیا', customerPaid: 'ادا شدہ نشان زد',
      customerNameRequired: 'گاہک کا نام ضروری ہے',
    },
    roman: {
      appName: 'Zubaan AI', newChat: 'Nayi guftagu', history: 'History', noHistory: 'Abhi koi guftagu nahi',
      clearHistory: 'History saaf karein', clearConfirm: 'Is mode ki tamam guftagu delete karein?',
      send: 'Bhejein', placeholder: 'Apna paigham likhein…', language: 'Zubaan', delete: 'Delete',
      modeGeneral: 'General', modeStudent: 'Student', modeShopkeeper: 'Dukaandaar',
      welcomeGeneral: 'Salam! Main Zubaan AI hoon. Mujh se kuch bhi poochein.',
      welcomeStudent: 'Khush aamdeed! Koi tool chunein ya apni parhai ke bare mein poochein.',
      welcomeShopkeeper: 'Khush aamdeed! Main aap ki dukaan, customers aur karobar ke sawalaat mein madad kar sakta hoon.',
      thinking: 'Soch raha hoon…', untitled: 'Nayi guftagu', toggleSidebar: 'Sidebar kholein/band karein',
      errEmpty: 'Pehle paigham likhein.', errNotConfigured: 'AI backend set nahi hai (CONFIG.API_URL set karein).',
      errRequest: 'Request nakaam hui. Dobara koshish karein.', errInvalid: 'AI ka jawab durust nahi tha.',
      errTimeout: 'Request ka waqt khatam ho gaya.', errStorage: 'Is device par data save nahi ho saka.',
      toastLang: 'Zubaan Roman Urdu mein tabdeel ho gayi', toastNewChat: 'Nayi guftagu shuru ho gayi',
      toastCleared: 'History saaf ho gayi', toastDeleted: 'Guftagu delete ho gayi',
      toastReplyElsewhere: 'Doosri guftagu mein jawab aa gaya hai',
      studentTools: 'Student tools', toolExplain: 'Topic samjhayein', toolSummarize: 'Text ka khulasa',
      toolQuiz: 'Practice quiz', toolStudyPlan: 'Study plan', toolSelected: 'Tool muntakhab: {tool}', toolCleared: 'Tool hata diya gaya',
      customers: 'Customers', addCustomer: 'Customer shamil karein', customerName: 'Naam', customerPhone: 'Phone',
      customerBalance: 'Baqaya raqam', noCustomers: 'Abhi koi customer nahi', markPaid: 'Ada shuda', balance: 'Baqaya',
      customerAdded: 'Customer shamil ho gaya', customerRemoved: 'Customer hata diya gaya', customerPaid: 'Ada shuda nishan zad',
      customerNameRequired: 'Customer ka naam zaroori hai',
    },
  };

  /** Translate a key with {placeholders}; falls back to English, then to the key itself. */
  function t(key, vars) {
    const dict = I18N[state.language] || I18N[DEFAULT_LANG];
    let str = dict[key];
    if (typeof str !== 'string') str = I18N[DEFAULT_LANG][key];
    if (typeof str !== 'string') str = key;
    if (vars) str = str.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? String(vars[k]) : m));
    return str;
  }
  const MODE_LABEL_KEY = { general: 'modeGeneral', student: 'modeStudent', shopkeeper: 'modeShopkeeper' };
  const WELCOME_KEY = { general: 'welcomeGeneral', student: 'welcomeStudent', shopkeeper: 'welcomeShopkeeper' };

  /* ====================== 3. STUDENT TOOLS (modular) ====================== */
  // Add a new tool by appending an entry; the UI and API payload pick it up automatically.
  const STUDENT_TOOLS = [
    { id: 'explain', labelKey: 'toolExplain' },
    { id: 'summarize', labelKey: 'toolSummarize' },
    { id: 'quiz', labelKey: 'toolQuiz' },
    { id: 'study_plan', labelKey: 'toolStudyPlan' },
  ];

  /* ============================ 4. STATE ============================ */
  const state = {
    mode: 'general',
    language: DEFAULT_LANG,
    currentId: null,
    conversations: [], // {id, mode, title, createdAt, updatedAt, messages:[{id, role, content, ts}]}
    sidebarOpen: false,
    pending: new Set(), // conversation IDs with an in-flight AI request
    student: { activeTool: null },
    shopkeeper: { customers: [] }, // {id, name, phone, balance}
  };

  /* ============================ 5. HELPERS ============================ */
  const $ = (sel, root) => { try { return (root || document).querySelector(sel); } catch (e) { return null; } };
  const uid = (p) => p + '_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  const currentConv = () => state.conversations.find((c) => c.id === state.currentId) || null;
  const isValidMode = (m) => MODES.includes(m);

  function loadJSON(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) { return fallback; } // invalid JSON or storage blocked
  }
  let storageWarned = false;
  function saveJSON(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); }
    catch (e) { if (!storageWarned) { storageWarned = true; showToast(t('errStorage'), 'warning'); } }
  }
  const saveState = () => saveJSON(CONFIG.STORAGE.STATE, {
    mode: state.mode, currentId: state.currentId, conversations: state.conversations,
  });
  const saveCustomers = () => saveJSON(CONFIG.STORAGE.CUSTOMERS, state.shopkeeper.customers);

  /** Create an element safely; text is always set via textContent (XSS-safe). */
  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }

  /* ========================= 6. TOAST SYSTEM ========================= */
  let toastTimer = null;
  function ensureToastEl() {
    let node = document.getElementById('zubaan-toast');
    if (!node) {
      node = el('div', 'toast');
      node.id = 'zubaan-toast';
      node.setAttribute('role', 'status');
      node.setAttribute('aria-live', 'polite');
      // Minimal inline fallback so it is visible even without CSS; override via CSS if desired.
      Object.assign(node.style, {
        position: 'fixed', left: '50%', bottom: '24px', transform: 'translateX(-50%)', zIndex: '2147483647',
        padding: '10px 18px', borderRadius: '8px', color: '#fff', font: '14px/1.4 system-ui, sans-serif',
        maxWidth: '90vw', boxShadow: '0 4px 14px rgba(0,0,0,.3)', display: 'none', textAlign: 'center',
      });
      document.body.appendChild(node);
    }
    return node;
  }
  /** showToast(message, type): type = success | error | warning | info. Replaces any visible toast (no overlap). */
  function showToast(message, type) {
    try {
      const kind = ['success', 'error', 'warning', 'info'].includes(type) ? type : 'info';
      const colors = { success: '#2e7d32', error: '#c62828', warning: '#ef6c00', info: '#1565c0' };
      const node = ensureToastEl();
      clearTimeout(toastTimer);
      node.className = 'toast toast-' + kind;
      node.style.background = colors[kind];
      node.textContent = String(message || '');
      node.style.display = 'block';
      toastTimer = setTimeout(() => { node.style.display = 'none'; }, CONFIG.TOAST_DURATION_MS);
    } catch (e) { console.error('Toast failed', e); }
  }

  /* ======================= 7. CONVERSATION MANAGEMENT ======================= */
  function createConversation(mode) {
    const now = Date.now();
    const conv = { id: uid('c'), mode: isValidMode(mode) ? mode : state.mode, title: '', createdAt: now, updatedAt: now, messages: [] };
    state.conversations.unshift(conv);
    state.currentId = conv.id;
    return conv;
  }

  function latestConversationFor(mode) {
    return state.conversations
      .filter((c) => c.mode === mode)
      .sort((a, b) => b.updatedAt - a.updatedAt)[0] || null;
  }

  function openConversation(id) {
    const conv = state.conversations.find((c) => c.id === id);
    if (!conv) return;
    state.currentId = conv.id;
    state.mode = conv.mode;
    saveState();
    renderAll();
  }

  function newChat(silent) {
    const cur = currentConv();
    // Reuse an empty chat of the same mode instead of piling up blanks.
    if (!(cur && cur.mode === state.mode && cur.messages.length === 0)) createConversation(state.mode);
    saveState();
    renderAll();
    if (!silent) showToast(t('toastNewChat'), 'success');
    const input = $(SELECTORS.chatInput); if (input) input.focus();
  }

  function deleteConversation(id) {
    const idx = state.conversations.findIndex((c) => c.id === id);
    if (idx === -1) return;
    state.conversations.splice(idx, 1);
    state.pending.delete(id);
    if (state.currentId === id) {
      const next = latestConversationFor(state.mode);
      if (next) state.currentId = next.id; else createConversation(state.mode);
    }
    saveState(); renderAll();
    showToast(t('toastDeleted'), 'success');
  }

  function clearHistory() {
    if (!window.confirm(t('clearConfirm'))) return;
    const mode = state.mode;
    state.conversations = state.conversations.filter((c) => c.mode !== mode);
    state.conversations.forEach(() => {});
    [...state.pending].forEach((id) => { if (!state.conversations.some((c) => c.id === id)) state.pending.delete(id); });
    createConversation(mode);
    saveState(); renderAll();
    showToast(t('toastCleared'), 'success');
  }

  function setMode(mode) {
    if (!isValidMode(mode) || mode === state.mode) return;
    state.mode = mode;
    // Conversations are never deleted on mode switch; open the latest one of that mode (or start one).
    const conv = latestConversationFor(mode) || createConversation(mode);
    state.currentId = conv.id;
    saveState(); renderAll();
  }

  /* ========================= 8. AI API INTEGRATION ========================= */
  /** Single centralized request function. Throws Error with a translation key in .message. */
  async function requestAI(conv, userText) {
    if (!CONFIG.API_URL) throw new Error('errNotConfigured');
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), CONFIG.REQUEST_TIMEOUT_MS);
    try {
      const payload = {
        message: userText,
        mode: conv.mode,
        language: state.language, // always the latest selection at request time
        tool: conv.mode === 'student' ? state.student.activeTool : null,
        conversationId: conv.id,
        history: conv.messages.slice(-CONFIG.HISTORY_CONTEXT_LIMIT - 1, -1).map((m) => ({ role: m.role, content: m.content })),
      };
      const res = await fetch(CONFIG.API_URL, {
        method: 'POST', headers: CONFIG.API_HEADERS, body: JSON.stringify(payload), signal: controller.signal,
      });
      if (!res.ok) throw new Error('errRequest');
      let data;
      try { data = await res.json(); } catch (e) { throw new Error('errInvalid'); }
      // Adjust to your backend's response shape if needed.
      const reply = data && (data.reply || data.message || data.response || data.text);
      if (typeof reply !== 'string' || !reply.trim()) throw new Error('errInvalid');
      return reply.trim();
    } catch (err) {
      if (err && err.name === 'AbortError') throw new Error('errTimeout');
      if (err && typeof err.message === 'string' && err.message.startsWith('err')) throw err;
      throw new Error('errRequest');
    } finally { clearTimeout(timer); }
  }

  async function sendMessage(rawText) {
    const text = String(rawText || '').trim();
    if (!text) { showToast(t('errEmpty'), 'warning'); return; }
    let conv = currentConv() || createConversation(state.mode);
    if (state.pending.has(conv.id)) return; // block duplicate submits for this conversation

    const now = Date.now();
    conv.messages.push({ id: uid('m'), role: 'user', content: text, ts: now });
    if (!conv.title) conv.title = text.length > CONFIG.TITLE_MAX ? text.slice(0, CONFIG.TITLE_MAX) + '…' : text;
    conv.updatedAt = now;
    state.pending.add(conv.id);
    saveState(); renderAll();

    const convId = conv.id; // keep ID: user may switch chats while waiting
    try {
      const reply = await requestAI(conv, text);
      const target = state.conversations.find((c) => c.id === convId);
      if (target) { // conversation might have been deleted meanwhile
        target.messages.push({ id: uid('m'), role: 'assistant', content: reply, ts: Date.now() });
        target.updatedAt = Date.now();
        if (state.currentId !== convId) showToast(t('toastReplyElsewhere'), 'info');
      }
    } catch (err) {
      showToast(t(err && err.message ? err.message : 'errRequest'), 'error');
    } finally {
      state.pending.delete(convId);
      saveState(); renderAll();
    }
  }

  /* ============================ 9. RENDERING ============================ */
  function renderMessages() {
    const box = $(SELECTORS.messages); if (!box) return;
    const conv = currentConv();
    box.textContent = '';
    if (!conv || conv.messages.length === 0) {
      box.appendChild(el('div', 'message assistant welcome', t(WELCOME_KEY[state.mode])));
    } else {
      conv.messages.forEach((m) => {
        const row = el('div', 'message ' + (m.role === 'user' ? 'user' : 'assistant'));
        row.dataset.messageId = m.id;
        String(m.content).split('\n').forEach((line) => row.appendChild(el('p', null, line)));
        box.appendChild(row);
      });
    }
    if (conv && state.pending.has(conv.id)) {
      const loader = el('div', 'message assistant loading', t('thinking'));
      loader.setAttribute('aria-live', 'polite');
      box.appendChild(loader);
    }
    box.scrollTop = box.scrollHeight;
  }

  function renderHistory() {
    const list = $(SELECTORS.historyList); if (!list) return;
    list.textContent = '';
    const items = state.conversations.filter((c) => c.mode === state.mode).sort((a, b) => b.updatedAt - a.updatedAt);
    const visible = items.filter((c) => c.messages.length > 0 || c.id === state.currentId);
    if (!visible.length) { list.appendChild(el('li', 'history-empty', t('noHistory'))); return; }
    visible.forEach((c) => {
      const li = el('li', 'history-item' + (c.id === state.currentId ? ' active' : ''));
      const open = el('button', 'history-open', c.title || t('untitled'));
      open.type = 'button'; open.dataset.convId = c.id;
      const del = el('button', 'history-delete', '✕');
      del.type = 'button'; del.dataset.deleteConv = c.id;
      del.setAttribute('aria-label', t('delete')); del.title = t('delete');
      li.append(open, del);
      list.appendChild(li);
    });
  }

  function renderModeUI() {
    document.querySelectorAll(SELECTORS.modeButton).forEach((b) => {
      const active = b.dataset.mode === state.mode;
      b.classList.toggle('active', active);
      b.setAttribute('aria-pressed', String(active));
    });
    document.body.dataset.mode = state.mode;
    const sp = $(SELECTORS.studentPanel), kp = $(SELECTORS.shopPanel);
    if (sp) sp.hidden = state.mode !== 'student';
    if (kp) kp.hidden = state.mode !== 'shopkeeper';
  }

  function renderStudentTools() {
    const box = $(SELECTORS.studentTools); if (!box) return;
    box.textContent = '';
    STUDENT_TOOLS.forEach((tool) => {
      const btn = el('button', 'student-tool' + (state.student.activeTool === tool.id ? ' active' : ''), t(tool.labelKey));
      btn.type = 'button'; btn.dataset.tool = tool.id;
      btn.setAttribute('aria-pressed', String(state.student.activeTool === tool.id));
      box.appendChild(btn);
    });
  }

  function renderCustomers() {
    const list = $(SELECTORS.customerList); if (!list) return;
    list.textContent = '';
    const customers = state.shopkeeper.customers;
    if (!customers.length) { list.appendChild(el('li', 'customer-empty', t('noCustomers'))); return; }
    customers.forEach((c) => {
      const li = el('li', 'customer-item');
      li.appendChild(el('strong', 'customer-name', c.name));
      if (c.phone) li.appendChild(el('span', 'customer-phone', c.phone));
      li.appendChild(el('span', 'customer-balance', t('balance') + ': ' + c.balance));
      if (c.balance > 0) {
        const paid = el('button', 'customer-paid', t('markPaid'));
        paid.type = 'button'; paid.dataset.customerAction = 'paid'; paid.dataset.customerId = c.id;
        li.appendChild(paid);
      }
      const del = el('button', 'customer-delete', t('delete'));
      del.type = 'button'; del.dataset.customerAction = 'delete'; del.dataset.customerId = c.id;
      li.appendChild(del);
      list.appendChild(li);
    });
  }

  function renderSidebar() {
    const sb = $(SELECTORS.sidebar), tg = $(SELECTORS.sidebarToggle);
    if (sb) { sb.classList.toggle('open', state.sidebarOpen); sb.setAttribute('aria-hidden', String(!state.sidebarOpen)); }
    if (tg) tg.setAttribute('aria-expanded', String(state.sidebarOpen));
    document.body.classList.toggle('sidebar-open', state.sidebarOpen);
  }

  function renderSendState() {
    const conv = currentConv();
    const busy = !!(conv && state.pending.has(conv.id));
    const btn = $(SELECTORS.sendBtn); if (btn) btn.disabled = busy;
    const form = $(SELECTORS.chatForm); if (form) form.setAttribute('aria-busy', String(busy));
  }

  /** Apply translations to every data-i18n* element. Never touches conversations. */
  function applyTranslations() {
    const dir = state.language === 'ur' ? 'rtl' : 'ltr';
    document.documentElement.lang = state.language === 'roman' ? 'ur-Latn' : state.language;
    document.documentElement.dir = dir;
    document.querySelectorAll('[data-i18n]').forEach((n) => { n.textContent = t(n.dataset.i18n); });
    [['i18nPlaceholder', 'placeholder'], ['i18nTitle', 'title'], ['i18nAriaLabel', 'aria-label']].forEach(([ds, attr]) => {
      document.querySelectorAll('[data-' + ds.replace(/[A-Z]/g, (m) => '-' + m.toLowerCase()) + ']').forEach((n) => {
        n.setAttribute(attr, t(n.dataset[ds]));
      });
    });
    const input = $(SELECTORS.chatInput); if (input) input.placeholder = t('placeholder');
    const sel = $(SELECTORS.languageSelect); if (sel && sel.value !== state.language) sel.value = state.language;
  }

  function renderAll() {
    try {
      applyTranslations(); renderModeUI(); renderSidebar(); renderHistory();
      renderMessages(); renderStudentTools(); renderCustomers(); renderSendState();
    } catch (e) { console.error('Render error', e); }
  }

  /* ===================== 10. LANGUAGE / STUDENT / SHOP ACTIONS ===================== */
  function setLanguage(lang) {
    if (!LANGUAGES.includes(lang)) return;
    state.language = lang;
    try { localStorage.setItem(CONFIG.STORAGE.LANG, lang); } catch (e) { /* ignore */ }
    renderAll(); // re-render only; conversation and messages stay untouched
    showToast(t('toastLang'), 'success');
  }

  function selectStudentTool(id) {
    const tool = STUDENT_TOOLS.find((x) => x.id === id);
    if (!tool) return;
    if (state.student.activeTool === id) { state.student.activeTool = null; showToast(t('toastCleared' in I18N.en ? 'toolCleared' : 'toolCleared'), 'info'); }
    else { state.student.activeTool = id; showToast(t('toolSelected', { tool: t(tool.labelKey) }), 'info'); }
    renderStudentTools();
    const input = $(SELECTORS.chatInput); if (input) input.focus();
  }

  function addCustomer(form) {
    const data = new FormData(form);
    const name = String(data.get('name') || '').trim();
    const phone = String(data.get('phone') || '').trim();
    const balance = Math.max(0, Number(data.get('balance')) || 0);
    if (!name) { showToast(t('customerNameRequired'), 'warning'); return; }
    state.shopkeeper.customers.unshift({ id: uid('u'), name, phone, balance });
    saveCustomers(); renderCustomers(); form.reset();
    showToast(t('customerAdded'), 'success');
  }

  function handleCustomerAction(action, id) {
    const list = state.shopkeeper.customers;
    const customer = list.find((c) => c.id === id);
    if (!customer) return;
    if (action === 'delete') { state.shopkeeper.customers = list.filter((c) => c.id !== id); showToast(t('customerRemoved'), 'success'); }
    else if (action === 'paid') { customer.balance = 0; showToast(t('customerPaid'), 'success'); }
    saveCustomers(); renderCustomers();
  }

  /* ============================ 11. SIDEBAR ============================ */
  function setSidebar(open) { state.sidebarOpen = !!open; renderSidebar(); }

  /* ======================= 12. EVENT HANDLING (delegated) ======================= */
  function onDocumentClick(e) {
    const target = e.target instanceof Element ? e.target : null;
    if (!target) return;

    // Sidebar toggle
    if (target.closest(SELECTORS.sidebarToggle)) { setSidebar(!state.sidebarOpen); return; }

    // Outside click closes the sidebar (not for clicks inside it or on the top header)
    if (state.sidebarOpen && !target.closest(SELECTORS.sidebar) && !target.closest(SELECTORS.header)) setSidebar(false);

    const modeBtn = target.closest(SELECTORS.modeButton);
    if (modeBtn) { setMode(modeBtn.dataset.mode); return; }

    const del = target.closest('[data-delete-conv]');
    if (del) { deleteConversation(del.dataset.deleteConv); return; }

    const open = target.closest('[data-conv-id]');
    if (open) { openConversation(open.dataset.convId); return; }

    const tool = target.closest('[data-tool]');
    if (tool) { selectStudentTool(tool.dataset.tool); return; }

    const cust = target.closest('[data-customer-action]');
    if (cust) { handleCustomerAction(cust.dataset.customerAction, cust.dataset.customerId); return; }

    if (target.closest(SELECTORS.newChatBtn)) { newChat(); return; }
    if (target.closest(SELECTORS.clearHistoryBtn)) { clearHistory(); return; }
  }

  function onDocumentSubmit(e) {
    const form = e.target;
    if (!(form instanceof Element)) return;
    if (form.matches(SELECTORS.chatForm)) {
      e.preventDefault();
      const input = $(SELECTORS.chatInput); if (!input) return;
      const text = input.value;
      if (!text.trim()) { showToast(t('errEmpty'), 'warning'); return; }
      const conv = currentConv();
      if (conv && state.pending.has(conv.id)) return;
      input.value = '';
      sendMessage(text);
    } else if (form.matches(SELECTORS.customerForm)) {
      e.preventDefault();
      addCustomer(form);
    }
  }

  function onDocumentChange(e) {
    if (e.target instanceof Element && e.target.matches(SELECTORS.languageSelect)) setLanguage(e.target.value);
  }

  function onDocumentKeydown(e) {
    if (e.key === 'Escape' && state.sidebarOpen) { setSidebar(false); return; }
    // Enter sends, Shift+Enter inserts a newline (ignore IME composition)
    if (e.key === 'Enter' && !e.shiftKey && !e.isComposing && e.target instanceof Element && e.target.matches(SELECTORS.chatInput)) {
      e.preventDefault();
      const form = $(SELECTORS.chatForm);
      if (form && typeof form.requestSubmit === 'function') form.requestSubmit();
      else form && form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
    }
  }

  /* ============================ 13. INITIALIZATION ============================ */
  function loadPersistedData() {
    const lang = (() => { try { return localStorage.getItem(CONFIG.STORAGE.LANG); } catch (e) { return null; } })();
    state.language = LANGUAGES.includes(lang) ? lang : DEFAULT_LANG;

    const saved = loadJSON(CONFIG.STORAGE.STATE, null);
    if (saved && typeof saved === 'object' && Array.isArray(saved.conversations)) {
      state.conversations = saved.conversations
        .filter((c) => c && typeof c.id === 'string' && isValidMode(c.mode) && Array.isArray(c.messages))
        .map((c) => ({
          id: c.id, mode: c.mode, title: typeof c.title === 'string' ? c.title : '',
          createdAt: Number(c.createdAt) || Date.now(), updatedAt: Number(c.updatedAt) || Date.now(),
          messages: c.messages
            .filter((m) => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
            .map((m) => ({ id: typeof m.id === 'string' ? m.id : uid('m'), role: m.role, content: m.content, ts: Number(m.ts) || Date.now() })),
        }));
      state.mode = isValidMode(saved.mode) ? saved.mode : 'general';
      state.currentId = state.conversations.some((c) => c.id === saved.currentId) ? saved.currentId : null;
    }
    const customers = loadJSON(CONFIG.STORAGE.CUSTOMERS, []);
    state.shopkeeper.customers = Array.isArray(customers)
      ? customers.filter((c) => c && typeof c.id === 'string' && typeof c.name === 'string')
          .map((c) => ({ id: c.id, name: c.name, phone: String(c.phone || ''), balance: Math.max(0, Number(c.balance) || 0) }))
      : [];

    // Make sure the current conversation exists and matches the current mode.
    let conv = currentConv();
    if (!conv || conv.mode !== state.mode) conv = latestConversationFor(state.mode) || createConversation(state.mode);
    state.currentId = conv.id;
  }

  function init() {
    try { loadPersistedData(); } catch (e) { console.error('Load failed', e); }
    document.addEventListener('click', onDocumentClick);
    document.addEventListener('submit', onDocumentSubmit);
    document.addEventListener('change', onDocumentChange);
    document.addEventListener('keydown', onDocumentKeydown);
    ensureToastEl();
    saveState();
    renderAll();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
