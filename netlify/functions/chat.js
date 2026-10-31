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

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.error("GEMINI_API_KEY is missing.");

    return respond(500, {
      error: "AI configuration is missing. Check server settings.",
    });
  }

  try {
    let requestData;

    try {
      requestData = JSON.parse(event.body || "{}");
    } catch {
      return respond(400, {
        error: "Invalid request format.",
      });
    }

    const { message, language, mode, history } = requestData;

    if (
      typeof message !== "string" ||
      !message.trim() ||
      message.length > 4000
    ) {
      return respond(400, {
        error: "Enter a message of up to 4000 characters.",
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
      Pashto: "Pashto",
    };

    const modes = {
      general: "a helpful general assistant",
      student: "a patient educational tutor who explains concepts step by step",
      shopkeeper: "a practical retail and small-business assistant",
      farmer: "a practical farming assistant",
      debate: "a nonpartisan, evidence-focused political discussion assistant",
    };

    const selectedLanguage =
      languages[language] || "the same language as the user";

    const selectedMode = modes[mode] || modes.general;

    const systemPrompt =
      "You are Zubaan AI, an inclusive AI assistant for people in Pakistan. " +
      "Be accurate, respectful, clear, and useful. " +
      "Act as " + selectedMode + ". " +
      "Reply in " + selectedLanguage + ". " +
      "For Roman Urdu, use natural Urdu written in Latin letters. " +
      "For educational questions, explain step by step. " +
      "Never invent facts or claim certainty when unsure. " +
      "For medical, legal, farming and political matters, " +
      "clearly communicate uncertainty.";

    const contents = [];

    if (Array.isArray(history)) {
      history.slice(-12).forEach((item) => {
        if (
          item &&
          ["user", "model"].includes(item.role) &&
          typeof item.text === "string" &&
          item.text.trim()
        ) {
          contents.push({
            role: item.role,
            parts: [{ text: item.text.slice(0, 4000) }],
          });
        }
      });
    }

    contents.push({
      role: "user",
      parts: [{ text: message.trim() }],
    });

    // Keep the existing model until its availability is verified.
    const model = "gemini-3.8-flash";

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: systemPrompt }],
          },
          contents,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1200,
          },
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error(
        "Gemini API error:",
        response.status,
        data.error?.message || "Unknown provider error"
      );

      if (response.status === 404) {
        return respond(502, {
          error: "Configured Gemini model is unavailable. Check the model name.",
        });
      }

      if (response.status === 429) {
        return respond(429, {
          error: "AI usage limit reached. Please try again later.",
        });
      }

      return respond(502, {
        error: "AI request failed. Please try again.",
      });
    }

    const reply = data.candidates?.[0]?.content?.parts
      ?.map((part) => part.text || "")
      .join("")
      .trim();

    if (!reply) {
      console.error(
        "Gemini returned no text:",
        data.candidates?.[0]?.finishReason || "Unknown reason"
      );

      return respond(502, {
        error: "The AI returned no text. Please try again.",
      });
    }

    return respond(200, { reply });

  } catch (error) {
    console.error("Chat function error:", error.message);

    return respond(500, {
      error: "Something went wrong. Please try again.",
    });
  }
};
