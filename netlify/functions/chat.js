
exports.handler = async (event) => {
  const headers = {
    "Content-Type": "application/json",
    "Cache-Control": "no-store",
  };

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: "POST requests only." }),
    };
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.error("GEMINI_API_KEY environment variable is missing.");

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: "AI configuration is missing. Please check the server settings.",
      }),
    };
  }

  try {
    let requestData;

    try {
      requestData = JSON.parse(event.body || "{}");
    } catch {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Invalid request format." }),
      };
    }

    const { message, language, mode } = requestData;

    if (
      typeof message !== "string" ||
      !message.trim() ||
      message.length > 4000
    ) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: "Enter a message of up to 4000 characters.",
        }),
      };
    }

    const languages = {
      English: "English",
      Urdu: "Urdu script",
      "Roman Urdu": "Roman Urdu using Latin letters",
      Punjabi: "Punjabi in Shahmukhi script",
      Sindhi: "Sindhi",
      Pashto: "Pashto",
    };

    const modes = {
      general: "a helpful general assistant",
      student: "a patient educational tutor who explains concepts step by step",
      shopkeeper: "a practical retail and small-business assistant",
      farmer: "a practical farming assistant who considers local conditions and uncertainty",
      debate: "a nonpartisan, evidence-focused political discussion assistant",
    };

    const selectedLanguage =
      languages[language] || "the same language as the user";

    const selectedMode = modes[mode] || modes.general;

    const prompt =
      "You are Zubaan AI, an inclusive AI assistant for people in Pakistan. " +
      "Be accurate, respectful, clear, and useful. " +
      "Act as " + selectedMode + ". " +
      "Reply in " + selectedLanguage + ". " +
      "For Roman Urdu, write natural Urdu using Latin letters. " +
      "For educational questions, explain step by step when useful. " +
      "Never claim certainty when you are unsure. " +
      "For medical, legal, farming, and political matters, " +
      "be careful about uncertainty and distinguish facts from opinions.";

    // Use the model name recommended by the current Netlify error.
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
            parts: [{ text: prompt }],
          },
          contents: [
            {
              role: "user",
              parts: [{ text: message.trim() }],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 800,
          },
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      // Log diagnostic details, but never expose the API key.
      console.error(
        "Gemini API error:",
        response.status,
        data.error?.message || "Unknown provider error"
      );

      return {
        statusCode: 502,
        headers,
        body: JSON.stringify({
          error:
            response.status === 404
              ? "The configured AI model is unavailable. Please check the model name and API access."
              : response.status === 429
              ? "AI usage limit reached. Please try again later."
              : "AI request failed. Please try again.",
        }),
      };
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

      return {
        statusCode: 502,
        headers,
        body: JSON.stringify({
          error: "The AI returned no text. Please try again.",
        }),
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ reply }),
    };
  } catch (error) {
    console.error("Chat function error:", error.message);

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: "Something went wrong. Please try again.",
      }),
    };
  }
};
