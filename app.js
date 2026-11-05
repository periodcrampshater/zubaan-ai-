/**
 * Zubaan AI — Unified AI Assistant
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
    roman: { name: "Roman Urdu", speech: "ur-PK", direction: "ltr" },
    ur:    { name: "Urdu",       speech: "ur-PK", direction: "rtl" },
    en:    { name: "English",    speech: "en-US", direction: "ltr" },
    pa:    { name: "Punjabi",    speech: "pa-Arab-PK", direction: "rtl" },
    sd:    { name: "Sindhi",     speech: "sd-PK", direction: "rtl" },
    ps:    { name: "Pashto",     speech: "ps-AF", direction: "rtl" }
  };

  /* =====================================
     2. APPLICATION STATE
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
     3. DOM HELPERS
  ===================================== */

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  const uid = () =>
    Date.now().toString(36) + Math.random().toString(36).slice(2, 9);

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
      node.append(
        child.nodeType ? child : document.createTextNode(String(child))
      );
    });

    return node;
  }

  /* =====================================
     4. LANGUAGE DICTIONARY
  ===================================== */

  const TEXT = {
    en: {
      newChat: "New chat",
      recent: "RECENT CHATS",
      clear: "Clear",
      language: "LANGUAGE",
      largerText: "Larger text",
      about: "About Zubaan AI",
      welcome: "How can I help you today?",
      welcomeIntro: "Ask anything. Get clear answers in the language you understand.",
      placeholder: "Ask anything...",
      hint: "Press Enter to send",
      send: "Send",
      disclaimer: "AI can make mistakes. Please verify important information.",
      thinking: "Thinking...",
      emptyHistory: "Your conversations will appear here.",
      online: "Online",
      ready: "Ready to help",
      notConnected: "AI service not connected",
      listening: "Listening...",
      errNoApi: "AI service is not connected.",
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
      toastStorage: "Could not save data on this device.",
      confirmHistory: "Delete all conversations?",
      confirmDelete: "Delete this conversation?",
      copy: "Copy",
      copied: "Copied",
      regenerate: "Regenerate",
      attach: "Attach PDF or TXT",
      attachmentTooLarge: "File is too large. Maximum size is 25 MB.",
      attachmentType: "Only PDF and TXT files are supported.",
      attachmentEmpty: "No readable text found in this file.",
      attachmentScanned: "This PDF appears to be scanned. Text extraction is not available.",
      attachmentReady: "File attached",
      attachmentProcessing: "Reading file...",
      attachmentFailed: "Could not read this file."
    },
    roman: {
      newChat: "Nayi guftagu",
      recent: "HALIYA GUFTAGU",
      clear: "Saaf karein",
      language: "ZUBAAN",
      largerText: "Bara text",
      about: "Zubaan AI ke bare mein",
      welcome: "Aaj main aap ki kya madad karoon?",
      welcomeIntro: "Kuch bhi poochein. Apni samajh ki zubaan mein wazeh jawab payein.",
      placeholder: "Kuch bhi poochein...",
      hint: "Enter dabayein bhejne ke liye",
      send: "Bhejein",
      disclaimer: "Zubaan AI se ghalti ho sakti hai. Aham maloomat ki tasdeeq karein.",
      thinking: "Soch raha hoon...",
      emptyHistory: "Aap ki guftagu yahan nazar aayegi.",
      online: "Online",
      ready: "Madad ke liye tayyar",
      notConnected: "AI service connect nahi hai",
      listening: "Sun raha hoon...",
      errNoApi: "AI service connect nahi hai.",
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
      toastStorage: "Data device par save nahi ho saka.",
      confirmHistory: "Kya tamam guftagu delete karein?",
      confirmDelete: "Kya is guftagu ko delete karein?",
      copy: "Copy",
      copied: "Copy ho gaya",
      regenerate: "Dobara banayein",
      attach: "PDF ya TXT attach karein",
      attachmentTooLarge: "File bohat bari hai. Maximum 25 MB.",
      attachmentType: "Sirf PDF aur TXT files support hain.",
      attachmentEmpty: "Is file mein parhne ke qabil text nahi mila.",
      attachmentScanned: "Yeh PDF scanned lagti hai. Text extraction available nahi.",
      attachmentReady: "File attach ho gayi",
      attachmentProcessing: "File parh raha hoon...",
      attachmentFailed: "Yeh file parhi nahi ja saki."
    }
  };

  // Fill missing languages with English fallback
  TEXT.ur = { ...TEXT.en, welcome: "آج میں آپ کی کیا مدد کروں؟", welcomeIntro: "کچھ بھی پوچھیں۔" };
  TEXT.pa = { ...TEXT.en };
  TEXT.sd = { ...TEXT.en };
  TEXT.ps = { ...TEXT.en };

  function t(key) {
    const dictionary = TEXT[state.lang] || TEXT.en;
    return dictionary[key] || TEXT.en[key] || key;
  }

  /* =====================================
     5. LOCAL STORAGE
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
    // Preserve legacy student/shop data if it exists
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
     7. CHAT UTILITIES
  ===================================== */

  function getCurrentConversation() {
    return state.conversations.find(c => c.id === state.currentId) || null;
  }

  function createConversation() {
    const conversation = {
      id: uid(),
      title: "New chat",
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
     8. MESSAGE RENDERING (Safe Markdown)
  ===================================== */

  function formatMessageText(value) {
    let escaped = escapeHTML(value);

    // Code blocks first (protect their content)
    const codeBlocks = [];
    escaped = escaped.replace(/```([\s\S]*?)```/g, (match, code) => {
      const id = `__CODEBLOCK_${codeBlocks.length}__`;
      codeBlocks.push(`<pre><code>${code.trim()}</code></pre>`);
      return id;
    });

    // Inline code
    escaped = escaped.replace(/`([^`]+)`/g, "<code>$1</code>");

    // Bold and italic
    escaped = escaped.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
    escaped = escaped.replace(/\*(.+?)\*/g, "<em>$1</em>");

    // Headings
    escaped = escaped.replace(/^### (.+)$/gm, "<h3>$1</h3>");
    escaped = escaped.replace(/^## (.+)$/gm, "<h2>$1</h2>");
    escaped = escaped.replace(/^# (.+)$/gm, "<h1>$1</h1>");

    // Unordered lists
    escaped = escaped.replace(/^[-*] (.+)$/gm, "<li>$1</li>");
    escaped = escaped.replace(/(<li>.*<\/li>)/s, "<ul>$1</ul>");

    // Ordered lists
    escaped = escaped.replace(/^\d+\. (.+)$/gm, "<li>$1</li>");

    // Paragraphs
    escaped = escaped
      .split(/\n{2,}/)
      .map(block => {
        const trimmed = block.trim();
        if (!trimmed) return "";
        if (/^<(h[1-4]|ul|ol|pre|table)/.test(trimmed)) return trimmed;
        return `<p>${trimmed.replace(/\n/g, "<br>")}</p>`;
      })
      .join("");

    // Restore code blocks
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
          showToast("Could not copy.");
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

        // Find the user message before this assistant message
        for (let i = index - 1; i >= 0; i--) {
          if (conversation.messages[i].role === "user") {
            const userText = conversation.messages[i].content;
            // Remove everything from that user message onwards
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
    const conversationArea = $("#generalConversation");
    const welcome = $("#welcomeContainer");

    if (!container) return;

    container.replaceChildren();

    const conversation = getCurrentConversation();
    const messages = conversation?.messages || [];

    if (welcome) welcome.hidden = messages.length > 0;
    if (conversationArea) conversationArea.hidden = messages.length === 0;

    messages.forEach(message => {
      container.append(createMessageElement(message));
    });

    container.scrollTop = container.scrollHeight;
  }

  /* =====================================
     9. CHAT HISTORY
  ===================================== */

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
        element("span", { class: "history-chat-title", text: conversation.title || "New chat" })
      );

      button.addEventListener("click", () => openConversation(conversation.id));

      const del = element("button", {
        type: "button",
        class: "history-delete",
        text: "×",
        ariaLabel: "Delete conversation"
      });

      del.addEventListener("click", (e) => {
        e.stopPropagation();
        if (!confirm(t("confirmDelete"))) return;

        state.conversations = state.conversations.filter(c => c.id !== conversation.id);
        if (state.currentId === conversation.id) state.currentId = null;
        persist();
        renderHistory();
        renderMessages();
        showToast("Deleted");
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
     PART 1 COMPLETE — PART 2 CONTINUES
  ===================================== */
 /**
 * Zubaan AI — Chat backend with multi-provider fallback.
 * Providers tried in order: Gemini → Groq → OpenRouter.
 *
 * Environment variables:
 *   GEMINI_API_KEY       (required for Gemini)
 *   GROQ_API_KEY         (optional, for fallback)
 *   OPENROUTER_API_KEY   (optional, for fallback)
 */

const PROVIDER_TIMEOUT_MS = 3500;
const MAX_MESSAGE_LENGTH = 4000;
const MAX_ATTACHMENT_LENGTH = 60000;
const MAX_HISTORY_TURNS = 12;

exports.handler = async (event) => {
  const headers = {
    "Content-Type": "application/json",
    "Cache-Control": "no-store",
  };

  const respond = (statusCode, data) => ({
    statusCode,
    headers,
    body: JSON.stringify(data),
  });

  if (event.httpMethod !== "POST") {
    return respond(405, { error: "POST requests only." });
  }

  let requestData;
  try {
    requestData = JSON.parse(event.body || "{}");
  } catch {
    return respond(400, { error: "Invalid request format." });
  }

  const { message, language, history, attachment } = requestData;

  // Validate message
  if (
    typeof message !== "string" ||
    !message.trim() ||
    message.length > MAX_MESSAGE_LENGTH
  ) {
    return respond(400, {
      error: `Enter a message of up to ${MAX_MESSAGE_LENGTH} characters.`,
    });
  }

  // Build system prompt (no modes)
  const languageNames = {
    en: "English",
    roman: "Roman Urdu using Latin letters",
    ur: "Urdu script",
    pa: "Punjabi in Shahmukhi script",
    sd: "Sindhi",
    ps: "Pashto",
  };

  const selectedLanguage =
    languageNames[language] || "the same language as the user";

  const systemPrompt =
    "You are Zubaan AI, a helpful AI assistant for people in Pakistan. " +
    "Be accurate, respectful, clear, and useful. " +
    "Reply in " + selectedLanguage + ". " +
    "For Roman Urdu, use natural Urdu written in Latin letters. " +
    "For educational questions, explain step by step. " +
    "Never invent facts or claim certainty when unsure. " +
    "For medical, legal, or political matters, clearly communicate uncertainty. " +
    "If the user attaches a document, use it as context but do not claim to have read anything beyond the provided text.";

  // Build conversation contents
  const contents = [];

  if (Array.isArray(history)) {
    history.slice(-MAX_HISTORY_TURNS).forEach((item) => {
      if (
        item &&
        ["user", "model"].includes(item.role) &&
        typeof item.text === "string" &&
        item.text.trim()
      ) {
        contents.push({
          role: item.role,
          parts: [{ text: item.text.slice(0, MAX_MESSAGE_LENGTH) }],
        });
      }
    });
  }

  // Build the final user turn (with optional attachment)
  let userText = message.trim();

  if (attachment && typeof attachment === "object" && typeof attachment.text === "string") {
    const attachmentText = attachment.text.slice(0, MAX_ATTACHMENT_LENGTH);
    const attachmentName = String(attachment.name || "document").slice(0, 200);

    userText =
      `[Attached document: ${attachmentName}]\n\n` +
      `--- DOCUMENT START ---\n` +
      attachmentText +
      `\n--- DOCUMENT END ---\n\n` +
      `User question: ${userText}`;
  }

  contents.push({
    role: "user",
    parts: [{ text: userText }],
  });

  // ----- Provider 1: Gemini -----
  const geminiKey = process.env.GEMINI_API_KEY;
  if (geminiKey) {
    try {
      const reply = await callGemini(geminiKey, systemPrompt, contents);
      return respond(200, { reply, provider: "gemini" });
    } catch (err) {
      console.error("Gemini failed:", err.message);
    }
  }

  // ----- Provider 2: Groq -----
  const groqKey = process.env.GROQ_API_KEY;
  if (groqKey) {
    try {
      const reply = await callGroq(groqKey, systemPrompt, contents);
      return respond(200, { reply, provider: "groq" });
    } catch (err) {
      console.error("Groq failed:", err.message);
    }
  }

  // ----- Provider 3: OpenRouter -----
  const openrouterKey = process.env.OPENROUTER_API_KEY;
  if (openrouterKey) {
    try {
      const reply = await callOpenRouter(openrouterKey, systemPrompt, contents);
      return respond(200, { reply, provider: "openrouter" });
    } catch (err) {
      console.error("OpenRouter failed:", err.message);
    }
  }

  return respond(502, {
    error: "All AI providers are currently unavailable. Please try again later.",
  });
};

/* =========================================
   PROVIDER IMPLEMENTATIONS
========================================= */

async function callGemini(apiKey, systemPrompt, contents) {
  // gemini-1.5-flash has 1,500 free requests/day
  const model = "gemini-1.5-flash";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), PROVIDER_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemPrompt }] },
        contents,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1200,
        },
      }),
      signal: controller.signal,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || `Gemini HTTP ${response.status}`);
    }

    const reply = data.candidates?.[0]?.content?.parts
      ?.map((part) => part.text || "")
      .join("")
      .trim();

    if (!reply) {
      throw new Error("Gemini returned no text.");
    }

    return reply;
  } finally {
    clearTimeout(timer);
  }
}

async function callGroq(apiKey, systemPrompt, contents) {
  const model = "llama-3.1-8b-instant";
  const url = "https://api.groq.com/openai/v1/chat/completions";

  // Convert Gemini-style contents to OpenAI-style messages
  const messages = [
    { role: "system", content: systemPrompt },
    ...contents.map((item) => ({
      role: item.role === "model" ? "assistant" : "user",
      content: item.parts.map((p) => p.text).join(""),
    })),
  ];

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), PROVIDER_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.7,
        max_tokens: 1200,
      }),
      signal: controller.signal,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || `Groq HTTP ${response.status}`);
    }

    const reply = data.choices?.[0]?.message?.content?.trim();

    if (!reply) {
      throw new Error("Groq returned no text.");
    }

    return reply;
  } finally {
    clearTimeout(timer);
  }
}

async function callOpenRouter(apiKey, systemPrompt, contents) {
  // A reliable free model on OpenRouter
  const model = "meta-llama/llama-3.3-70b-instruct:free";
  const url = "https://openrouter.ai/api/v1/chat/completions";

  const messages = [
    { role: "system", content: systemPrompt },
    ...contents.map((item) => ({
      role: item.role === "model" ? "assistant" : "user",
      content: item.parts.map((p) => p.text).join(""),
    })),
  ];

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), PROVIDER_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        "HTTP-Referer": "https://zubaan-ai.netlify.app",
        "X-Title": "Zubaan AI",
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.7,
        max_tokens: 1200,
      }),
      signal: controller.signal,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || `OpenRouter HTTP ${response.status}`);
    }

    const reply = data.choices?.[0]?.message?.content?.trim();

    if (!reply) {
      throw new Error("OpenRouter returned no text.");
    }

    return reply;
  } finally {
    clearTimeout(timer);
  }
}
