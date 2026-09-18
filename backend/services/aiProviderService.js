import ai from "../config/gemini.js";
import groq from "../config/groq.js";

// ==========================================
// SETTINGS
// ==========================================

const GEMINI_MODEL = "gemini-3.6-flash";
const GROQ_MODEL = "openai/gpt-oss-120b";

const wait = (ms) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// ==========================================
// STATUS HELPER
// ==========================================

const getStatus = (error) => {
  return (
    error?.status ||
    error?.statusCode ||
    error?.code ||
    error?.response?.status
  );
};

// ==========================================
// SHOULD GEMINI FALL BACK TO GROQ?
// ==========================================

const shouldFallbackToGroq = (error) => {
  const status = getStatus(error);

  return (
    status === 429 ||
    status === 500 ||
    status === 502 ||
    status === 503 ||
    status === 504
  );
};

// ==========================================
// GEMINI WITH RETRY
// ==========================================

const callGemini = async (
  prompt,
  {
    jsonMode = true,
    maxAttempts = 3,
  } = {}
) => {
  let lastError;

  for (
    let attempt = 1;
    attempt <= maxAttempts;
    attempt++
  ) {
    try {
      console.log(
        `Gemini request attempt ${attempt}/${maxAttempts}`
      );

      const response =
        await ai.models.generateContent({
          model: GEMINI_MODEL,

          contents: prompt,

          ...(jsonMode && {
            config: {
              responseMimeType:
                "application/json",
            },
          }),
        });

      const text = response?.text;

      if (!text) {
        throw new Error(
          "Gemini returned an empty response"
        );
      }

      return {
        text,
        provider: "gemini",
        model: GEMINI_MODEL,
      };
    } catch (error) {
      lastError = error;

      const status = getStatus(error);

      console.error(
        `Gemini attempt ${attempt} failed:`,
        status,
        error.message
      );

      // Quota/rate limit:
      // don't waste time retrying Gemini.
      // Groq fallback will handle it.
      if (status === 429) {
        throw error;
      }

      const retryable =
        status === 500 ||
        status === 502 ||
        status === 503 ||
        status === 504;

      if (
        !retryable ||
        attempt === maxAttempts
      ) {
        throw error;
      }

      const delay =
        2000 * Math.pow(2, attempt - 1);

      console.log(
        `Gemini temporary error. Retrying in ${
          delay / 1000
        } seconds...`
      );

      await wait(delay);
    }
  }

  throw lastError;
};

// ==========================================
// GROQ FALLBACK
// ==========================================

const callGroq = async (
  prompt,
  { jsonMode = true } = {}
) => {
  console.log(
    `Using Groq fallback (${GROQ_MODEL})...`
  );

  const completion =
    await groq.chat.completions.create({
      model: GROQ_MODEL,

      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],

      temperature: 0.2,

      ...(jsonMode && {
        response_format: {
          type: "json_object",
        },
      }),
    });

  const text =
    completion?.choices?.[0]?.message?.content;

  if (!text) {
    throw new Error(
      "Groq returned an empty response"
    );
  }

  console.log(
    "Groq fallback completed successfully."
  );

  return {
    text,
    provider: "groq",
    model: GROQ_MODEL,
  };
};

// ==========================================
// MAIN AI PROVIDER
// GEMINI PRIMARY -> GROQ FALLBACK
// ==========================================

export const generateAIResponse = async (
  prompt,
  options = {}
) => {
  try {
    return await callGemini(
      prompt,
      options
    );
  } catch (geminiError) {
    if (
      !shouldFallbackToGroq(geminiError)
    ) {
      throw geminiError;
    }

    console.warn(
      "Gemini unavailable/quota reached."
    );

    console.warn(
      "Switching automatically to Groq..."
    );

    try {
      return await callGroq(
        prompt,
        options
      );
    } catch (groqError) {
      console.error(
        "Groq fallback failed:",
        groqError.message
      );

      throw new Error(
        "Both Gemini and Groq AI services are currently unavailable. Please try again later."
      );
    }
  }
};

export default generateAIResponse;