
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
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: "AI configuration is missing.",
      }),
    };
  }

  try {
    const { message, language, mode } = JSON.parse(
      event.body || "{}"
    );

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
      "Roman Urdu": "Roman Urdu",
      Punjabi: "Punjabi in Shahmukhi script",
      Sindhi: "Sindhi",
      Pashto: "Pashto",
    };

    const modes = {
      general: "helpful general assistant",
      student: "patient educational tutor",
      shopkeeper: "practical retail and small-business assistant",
      farmer: "practical farming assistant",
      debate: "nonpartisan, evidence-focused political discussion assistant",
    };

    const selectedLanguage =
      languages[language] || "the same language as the user";

    const selectedMode =
      modes[mode] || modes.general;

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{
              text:
                "You are Zubaan AI, an inclusive assistant for people in Pakistan. " +
                "Be accurate, respectful, clear, and useful. " +
                "Act as a " + selectedMode + ". " +
                "Reply in " + selectedLanguage + ". " +
                "For Roman Urdu, use natural Urdu written in Latin letters. " +
                "Never claim certainty when you are unsure. " +
                "For medical, legal, farming, and political matters, " +
                "be careful about uncertainty and distinguish facts from opinions."
            }]
          },
          contents: [{
            role: "user",
            parts: [{ text: message.trim() }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 800
          }
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Gemini API error:", response.status, data.error?.message);

      return {
        statusCode: 502,
        headers,
        body: JSON.stringify({
          error: "AI request failed. Please try again."
        })
      };
    }

    const reply = data.candidates?.[0]?.content?.parts
      ?.map((part) => part.text || "")
      .join("")
      .trim();

    if (!reply) {
      return {
        statusCode: 502,
        headers,
        body: JSON.stringify({
          error: "The AI returned no text. Please try again."
        })
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ reply })
    };
  } catch (error) {
    console.error("Chat function error:", error.message);

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: "Something went wrong. Please try again."
      })
    };
  }
};
