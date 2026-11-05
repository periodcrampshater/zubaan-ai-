
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-3.5-flash-lite";
const GROQ_MODEL = "openai/gpt-oss-20b";

const TIMEOUT_MS = 12000;

const languages = {
  en: "English",
  English: "English",
  ur: "Urdu script",
  Urdu: "Urdu script",
  roman: "Roman Urdu using Latin letters",
  "Roman Urdu": "Roman Urdu using Latin letters",
  pa: "Punjabi in Shahmukhi script",
  Punjabi: "Punjabi in Shahmukhi script",
  sd: "Sindhi",
  Sindhi: "Sindhi",
  ps: "Pashto",
  Pashto: "Pashto"
};

function getHistory(history) {
  if (!Array.isArray(history)) return [];

  return history.slice(-12).filter((item) =>
    item &&
    ["user", "model"].includes(item.role) &&
    typeof (item.text || item.content) === "string"
  );
}

async function requestWithTimeout(url, options) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    return await fetch(url, {
      ...options,
      signal: controller.signal
    });
  } finally {
    clearTimeout(timeout);
  }
}

async function askGemini(apiKey, systemPrompt, history, message) {
  const contents = history.map((item) => ({
    role: item.role,
    parts: [{ text: (item.text || item.content).slice(0, 4000) }]
  }));

  contents.push({
    role: "user",
    parts: [{ text: message }]
  });

  const response = await requestWithTimeout(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: systemPrompt }]
        },
        contents,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 800
        }
      })
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(`Gemini ${response.status}: ${data.error?.message || "Request failed"}`);
  }

  const reply = data.candidates?.[0]?.content?.parts
    ?.map((part) => part.text || "")
    .join("")
    .trim();

  if (!reply) throw new Error("Gemini returned an empty response.");

  return reply;
}

async function askGroq(apiKey, systemPrompt, history, message) {
  const messages = [
    { role: "system", content: systemPrompt },
    ...history.map((item) => ({
      role: item.role === "model" ? "assistant" : "user",
      content: (item.text || item.content).slice(0, 4000)
    })),
    { role: "user", content: message }
  ];

  const response = await requestWithTimeout(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages,
        temperature: 0.7,
        max_completion_tokens: 800
      })
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(`Groq ${response.status}: ${data.error?.message || "Request failed"}`);
  }

  const reply = data.choices?.[0]?.message?.content?.trim();

  if (!reply) throw new Error("Groq returned an empty response.");

  return reply;
}

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "POST") {
    return res.status(405).json({ error: "POST requests only." });
  }

  try {
    const body =
      typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};

    const { message, language, history } = body;

    if (
      typeof message !== "string" ||
      !message.trim() ||
      message.length > 4000
    ) {
      return res.status(400).json({
        error: "Enter a message of up to 4000 characters."
      });
    }

    const selectedLanguage =
      languages[language] || "the same language as the user";

    const systemPrompt = `
You are Zubaan AI, a helpful general-purpose AI assistant.

Help with education, programming, business, writing, research,
technology, science and everyday questions.

There are no separate assistant modes.

Respond in ${selectedLanguage}.

For Roman Urdu, use natural Urdu written in Latin letters.
For Urdu, use proper Urdu script.
For Punjabi, use Shahmukhi script.

Maintain the selected language throughout the conversation.
Be accurate, helpful, respectful and clear.
Explain complicated subjects step by step when useful.
Never invent facts or pretend to know something you do not know.
`;

    const cleanHistory = getHistory(history);
    const geminiKey = process.env.GEMINI_API_KEY;
    const groqKey = process.env.GROQ_API_KEY;

    if (!geminiKey && !groqKey) {
      return res.status(500).json({
        error: "AI configuration is missing."
      });
    }

    // Try Gemini first.
    if (geminiKey) {
      try {
        const reply = await askGemini(
          geminiKey,
          systemPrompt,
          cleanHistory,
          message.trim()
        );

        return res.status(200).json({
          reply,
          answer: reply,
          provider: "gemini"
        });
      } catch (error) {
        console.error("Gemini failed; trying fallback:", error.message);
      }
    }

    // Use Groq if Gemini is unavailable or fails.
    if (groqKey) {
      try {
        const reply = await askGroq(
          groqKey,
          systemPrompt,
          cleanHistory,
          message.trim()
        );

        return res.status(200).json({
          reply,
          answer: reply,
          provider: "groq"
        });
      } catch (error) {
        console.error("Groq fallback failed:", error.message);
      }
    }

    return res.status(502).json({
      error: "AI is temporarily unavailable. Please try again."
    });

  } catch (error) {
    console.error("Zubaan AI error:", error.message);

    return res.status(500).json({
      error: "Something went wrong. Please try again."
    });
  }
}
