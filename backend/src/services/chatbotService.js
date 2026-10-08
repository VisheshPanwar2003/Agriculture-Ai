const {
  generateResponse,
} = require(
  "./geminiService"
);

async function chat(message, history = [], language = "English") {
  const conversation = history
    .slice(-6)
    .map(({ role, content }) => `${role === "assistant" ? "AI" : "User"}: ${content}`)
    .join("\n");

  const prompt = `
You are AgriSense AI.
Write the entire answer in ${language}, using its normal script. Do not switch to English or mix languages unless the farmer asks for translation or an English technical term is necessary. Keep crop and product names clear, and use simple language a farmer can follow. Treat this language instruction as higher priority than language used in the conversation history.

You help farmers with:

- crop diseases
- fertilizers
- irrigation
- pesticides
- organic farming
- weather impact
- soil health
- crop recommendations

Previous Conversation:

${conversation}

Current User Message:

${message}
`;

  return generateResponse(prompt);
}

module.exports = { chat };
