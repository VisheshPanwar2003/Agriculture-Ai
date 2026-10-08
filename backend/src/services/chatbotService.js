const {
  generateResponse,
} = require(
  "./geminiService"
);

async function chat(message, history = []) {
  const conversation = history
    .slice(-6)
    .map(({ role, content }) => `${role === "assistant" ? "AI" : "User"}: ${content}`)
    .join("\n");

  const prompt = `
You are AgriSense AI.

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
