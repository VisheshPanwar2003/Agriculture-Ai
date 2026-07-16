const {
  generateResponse,
} = require(
  "./geminiService"
);

class AgricultureAssistant {

  constructor() {
    this.history = [];
  }

  async chat(message) {

    this.history.push(
      `User: ${message}`
    );

    this.history =
      this.history.slice(-6);

    const conversation =
      this.history.join("\n");

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

    const response =
      await generateResponse(
        prompt
      );

    this.history.push(
      `AI: ${response}`
    );

    return response;
  }
}

module.exports =
  new AgricultureAssistant();