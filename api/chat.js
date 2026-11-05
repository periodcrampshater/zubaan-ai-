export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "POST") {
    return res.status(405).json({
      error: "POST requests only."
    });
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.error("GEMINI_API_KEY is missing.");

    return res.status(500).json({
      error: "AI configuration is missing."
    });
  }

  try {
    const body =
      typeof req.body === "string"
        ? JSON.parse(req.body)
        : req.body || {};

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

    const selectedLanguage =
      languages[language] || "the same language as the user";

    const systemPrompt = `
You are Zubaan AI, a helpful general-purpose AI assistant.

You can help with education, programming, business,
writing, research, technology, science and everyday questions.

There are no separate assistant modes.

Respond in ${selectedLanguage}.

For Roman Urdu, use natural Urdu written in Latin letters.
For Urdu, use proper Urdu script.
For Punjabi, use Shahmukhi script.

Maintain the user's selected language throughout the conversation.

Be accurate, helpful, respectful and clear.
Explain complicated subjects step by step when useful.
Never invent facts or pretend to know something you do not know.
`;

    const contents = [];

    if (Array.isArray(history)) {
      history.slice(-12).forEach((item) => {
        if (
          item &&
          ["user", "model"].includes(item.role) &&
          typeof (item.text || item.content) === "string"
        ) {
          contents.push({
            role: item.role,
            parts: [
              {
                text: (item.text || item.content).slice(0, 4000)
              }
            ]
          });
        }
      });
    }

    contents.push({
      role: "user",
      parts: [{ text: message.trim() }]
    });

    const model =
      process.env.GEMINI_MODEL || "gemini-2.5-flash";

    const controller = new AbortController();

    const timeout = setTimeout(() => {
      controller.abort();
    }, 30000);

    let response;

    try {
      response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
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
              maxOutputTokens: 1200
            }
          }),
          signal: controller.signal
        }
      );
    } finally {
      clearTimeout(timeout);
    }

    const data = await response.json();

    if (!response.ok) {
      console.error(
        "Gemini API error:",
        response.status,
        data.error?.message || "Unknown error"
      );

      if (response.status === 429) {
        return res.status(429).json({
          error: "AI usage limit reached. Please try again later."
        });
      }

      if (response.status === 404) {
        return res.status(502).json({
          error: "Gemini model unavailable. Check GEMINI_MODEL."
        });
      }

      return res.status(502).json({
        error: "AI request failed. Please try again."
      });
    }

    const reply = data.candidates?.[0]?.content?.parts
      ?.map((part) => part.text || "")
      .join("")
      .trim();

    if (!reply) {
      return res.status(502).json({
        error: "AI returned an empty response."
      });
    }

    return res.status(200).json({
      reply,
      answer: reply
    });

  } catch (error) {
    console.error("Zubaan AI error:", error.message);

    if (error.name === "AbortError") {
      return res.status(504).json({
        error: "AI request timed out. Please try again."
      });
    }

    return res.status(500).json({
      error: "Something went wrong. Please try again."
    });
  }
}
