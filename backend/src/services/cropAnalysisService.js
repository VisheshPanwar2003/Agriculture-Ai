const {
  ai,
  MODEL_NAME,
} = require("./geminiService");

async function analyzeCropImage(
  file
) {
  try {

    const imageBase64 =
      file.buffer.toString(
        "base64"
      );

    const prompt = `
You are an advanced agriculture AI assistant.

Analyze the uploaded crop or plant image carefully.

Your task:
- Identify crop type
- Detect plant disease if present
- Estimate severity
- Identify visible issues
- Provide actionable recommendations

Return ONLY valid JSON.

{
  "type":"Crop Type",
  "status":"Disease Name or Healthy",
  "severity":"Low | Medium | High",
  "confidence":0.95,
  "issues":"Short issue summary",

  "recommendations":[
    "recommendation 1",
    "recommendation 2",
    "recommendation 3",
    "recommendation 4"
  ]
}
`;

    const response =
      await ai.models.generateContent({
        model: MODEL_NAME,

        contents: [
          {
            inlineData: {
              mimeType:
                file.mimetype,
              data:
                imageBase64,
            },
          },

          prompt,
        ],
      });

    let text =
      response.text.trim();

    text = text
      .replace(
        /```json/g,
        ""
      )
      .replace(
        /```/g,
        ""
      );

    const match =
      text.match(
        /\{[\s\S]*\}/
      );

    if (match)
      text = match[0];

    const result =
      JSON.parse(text);

    return {
      type:
        result.type ||
        "Unknown Crop",

      status:
        result.status ||
        "Unknown",

      severity:
        result.severity ||
        "Medium",

      confidence:
        result.confidence ||
        0.75,

      issues:
        result.issues ||
        "No issues detected",

      recommendations:
        result.recommendations ||
        [
          "Monitor crop condition regularly",
        ],
    };

  } catch (error) {

    return {
      type: "Unknown",

      status:
        "Analysis Failed",

      severity:
        "Unknown",

      confidence: 0,

      issues:
        error.message,

      recommendations: [
        "Upload a clearer image",
        "Ensure crop is visible",
        "Check Gemini API key",
      ],
    };
  }
}

module.exports = {
  analyzeCropImage,
};