/**
 * Zubaan AI — Unified AI Assistant
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
    roman: { name: "Roman Urdu", speech: "ur-PK", direction: "ltr" },
    ur:    { name: "Urdu",       speech: "ur-PK", direction: "rtl" },
    en:    { name: "English",    speech: "en-US", direction: "ltr" },
    pa:    { name: "Punjabi",    speech: "pa-Arab-PK", direction: "rtl" },
    sd:    { name: "Sindhi",     speech: "sd-PK", direction: "rtl" },
    ps:    { name: "Pashto",     speech: "ps-AF", direction: "rtl" }
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
     DICTIONARY
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
      attachmentTooLarge: "File bohat bari hai. Maximum 25 MB.",
      attachmentType: "Sirf PDF aur TXT files support hain.",
      attachmentEmpty: "Is file mein parhne ke qabil text nahi mila.",
      attachmentScanned: "Yeh PDF scanned lagti hai. Text extraction available nahi.",
      attachmentReady: "File attach ho gayi",
      attachmentProcessing: "File parh raha hoon...",
      attachmentFailed: "Yeh file parhi nahi ja saki."
    }
  };

  TEXT.ur = { ...TEXT.en, welcome: "آج میں آپ کی کیا مدد کروں؟", welcomeIntro: "کچھ بھی پوچھیں۔" };
  TEXT.pa = { ...TEXT.en };
  TEXT.sd = { ...TEXT.en };
  TEXT.ps = { ...TEXT.en };

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
     CONVERSATIONS
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

    // Only toggle welcome screen. Never hide the chat area (that was the bug).
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
     PART 1 ENDS HERE
  ===================================== */
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
      RATE_LIMIT: "AI usage limit reached. Please try again later."
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
        language: state.lang,
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
     LANGUAGE / TEXT
  ===================================== */
  function updateLanguage(language) {
    if (!LANGUAGES[language]) return;

    state.lang = language;
    safeStoreSet(STORAGE.language, language);

    document.documentElement.lang = language === "roman" ? "en" : language;
    document.documentElement.dir = LANGUAGES[language].direction;

    const welcomeTitle = $("#welcomeTitle");
    const welcomeIntro = $("#welcomeIntro");
    const input = $("#question");
    const hint = $("#composerHint");

    if (welcomeTitle) welcomeTitle.textContent = t("welcome");
    if (welcomeIntro) welcomeIntro.textContent = t("welcomeIntro");
    if (input) input.placeholder = t("placeholder");
    if (hint) hint.textContent = t("hint");

    renderHistory();
    renderMessages();
    showToast(t("toastLang"));
  }

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

    document.addEventListener("keydown", event => {
      if (event.key === "Escape") closeSidebar();
    });
  }

  /* =====================================
     INIT
  ===================================== */
  function initializeApp() {
    loadSavedData();

    const languageSelect = $("#language");
    if (languageSelect) languageSelect.value = state.lang;

    document.body.classList.toggle("large-text", state.largeText);
    document.documentElement.dir = LANGUAGES[state.lang].direction;
    document.documentElement.lang = state.lang === "roman" ? "en" : state.lang;

    const welcomeTitle = $("#welcomeTitle");
    const welcomeIntro = $("#welcomeIntro");
    const input = $("#question");
    const hint = $("#composerHint");

    if (welcomeTitle) welcomeTitle.textContent = t("welcome");
    if (welcomeIntro) welcomeIntro.textContent = t("welcomeIntro");
    if (input) input.placeholder = t("placeholder");
    if (hint) hint.textContent = t("hint");

    bindEvents();
    setupVoiceInput();

    renderHistory();
    renderMessages();
    updateCharacterCount();

    window.addEventListener("online", () => showToast("Internet connection restored."));
    window.addEventListener("offline", () => showToast(t("errOffline"), "warning"));
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeApp, { once: true });
  } else {
    initializeApp();
  }

})();
