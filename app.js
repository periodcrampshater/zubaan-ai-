
"use strict";

/* ==========================================
   ZUBAAN AI
   Lightweight application logic
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
  recognition: null
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
  return new Date(value).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
}

function formatMoney(value) {
  return "Rs. " + Number(value || 0).toLocaleString("en-PK");
}

function showToast(message) {
  const toast = $("#toast");
  if (!toast) return;

  toast.textContent = message;
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
    container.innerHTML = `
      <div class="empty-history">Your conversations will appear here.</div>
    `;
    return;
  }

  const sorted = [...state.chats].sort(
    (a, b) => b.updatedAt - a.updatedAt
  );

  container.innerHTML = sorted.map(chat => `
    <div class="history-item ${chat.id === state.activeChatId ? "active" : ""}">
      <button class="history-chat-button"
        type="button"
        data-chat-id="${escapeHTML(chat.id)}"
        title="${escapeHTML(chat.title)}">
        <span class="history-chat-icon">▤</span>
        <span class="history-chat-title">${escapeHTML(chat.title)}</span>
      </button>
      <button class="history-delete"
        type="button"
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

  if (welcome) {
    welcome.hidden = !!(chat && chat.messages.length);
  }
}

function clearHistory() {
  if (!confirm("Delete all conversations from this device?")) return;

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
  if (title) title.textContent = MODE_TITLES[mode];

  closeSidebar();

  if (mode === "general") {
    renderMessages();
    updateWelcome();
  }
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
    sendButton.textContent = "Thinking...";
  }

  const temporary = addMessage("assistant", "Thinking...");

  try {
    const response = await fetch("/.netlify/functions/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
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

    replaceTemporaryMessage(temporary.id, reply);
  } catch (error) {
    replaceTemporaryMessage(
      temporary.id,
      "AI service is not connected yet. Your conversation is saved on this device. Please try again after the AI service is configured."
    );
  } finally {
    state.busy = false;

    if (sendButton) {
      sendButton.disabled = false;
      sendButton.innerHTML = '<span>Send</span><span>↑</span>';
    }

    input.focus();
  }
}

function replaceTemporaryMessage(id, content) {
  const chat = getActiveChat();
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

  title.textContent = STUDENT_TOOLS[tool];
  panel.hidden = false;

  $$(".feature-card", $("#studentWorkspace")).forEach(card => {
    card.hidden = true;
  });

  const heading = $("#studentWorkspace .dashboard-heading");
  const saved = $(".student-saved-section", $("#studentWorkspace"));

  if (heading) heading.hidden = true;
  if (saved) saved.hidden = true;

  renderStudentTool(tool, content);
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
}

function renderStudentTool(tool, content) {
  if (tool === "notes") {
    renderNotesTool(content);
    return;
  }

  if (tool === "summary") {
    renderChaptersTool(content);
    return;
  }

  if (tool === "planner") {
    renderPlannerTool(content);
    return;
  }

  if (tool === "mock" || tool === "mcq") {
    renderPracticeTool(tool, content);
    return;
  }

  if (tool === "flashcards") {
    renderFlashcardsTool(content);
  }
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
    items.unshift({
      id: makeId(),
      title,
      body,
      date: Date.now()
    });

    writeStore(STORAGE.notes, items);
    $("#noteTitle").value = "";
    $("#noteBody").value = "";

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
    STORAGE.notes
  );
}

/* Chapter summaries and saved chapters */

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
    STORAGE.chapters
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
        <strong>${escapeHTML(item.title)}</strong>
        <br>
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
        <strong>${escapeHTML(item.title)}</strong>
        <br>
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

function renderRecordList(container, items, renderItem, storageKey) {
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

      const tool = state.currentStudentTool;
      if (tool) renderStudentTool(tool, container.closest("#studentToolContent"));
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
  title.textContent = SHOP_TOOLS[tool];
  panel.hidden = false;

  $$(".feature-card", $("#shopkeeperWorkspace")).forEach(card => {
    card.hidden = true;
  });

  const heading = $("#shopkeeperWorkspace .dashboard-heading");
  if (heading) heading.hidden = true;

  renderShopTool(tool, content);
  panel.scrollIntoView({ behavior: "smooth", block: "start" });
}

function closeShopTool() {
  $("#shopToolPanel").hidden = true;

  $$(".feature-card", $("#shopkeeperWorkspace")).forEach(card => {
    card.hidden = false;
  });

  const heading = $("#shopkeeperWorkspace .dashboard-heading");
  if (heading) heading.hidden = false;
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
    STORAGE.customers
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
    STORAGE.sales
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
    STORAGE.expenses
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
    STORAGE.stock
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
   LANGUAGE
========================================== */

function setupLanguage() {
  const select = $("#language");
  if (!select) return;

  const saved = localStorage.getItem(STORAGE.language);

  if (saved && [...select.options].some(option => option.value === saved)) {
    select.value = saved;
  }

  state.language = select.value;

  select.addEventListener("change", () => {
    state.language = select.value;

    try {
      localStorage.setItem(STORAGE.language, state.language);
    } catch {}

    showToast("Language preference saved.");
  });
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
      state.currentStudentTool = button.dataset.studentTool;
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

  document.addEventListener("click", event => {
    if (
      document.body.classList.contains("sidebar-open") &&
      event.target === document.body
    ) {
      closeSidebar();
    }
  });

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

  if (!state.chats.length) {
    createChat();
  }

  setupLanguage();
  setupEvents();
  setupVoice();

  renderChatHistory();
  renderMessages();
  renderSavedChapters();
  updateWelcome();
  updateCharacterCount();

  setMode("general");

  window.addEventListener("online", () => {
    showToast("Internet connection restored.");
  });

  window.addEventListener("offline", () => {
    showToast("You are offline. Saved records remain available.");
  });
}

document.addEventListener("DOMContentLoaded", initialize);
