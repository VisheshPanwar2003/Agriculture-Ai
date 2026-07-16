const { GoogleGenAI } =
  require("@google/genai");

const MODEL_NAME =
  "gemini-2.5-flash";

const ai =
  new GoogleGenAI({
    apiKey:
      process.env.GEMINI_API_KEY,
  });

async function generateResponse(
  prompt
) {
  try {

    const response =
      await ai.models.generateContent({
        model: MODEL_NAME,
        contents: prompt,
      });

    return response.text;

  } catch (error) {

    return `Gemini Error: ${error.message}`;
  }
}

module.exports = {
  ai,
  MODEL_NAME,
  generateResponse,
};