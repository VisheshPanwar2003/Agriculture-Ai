const { generateResponse } =
  require("./geminiService");

// Temporary crop data
const CROP_DATA = {
  wheat: {
    days_to_maturity: 120,
    watering: "Moderate",
    pests: ["Aphids", "Rust"],
    companion_plants: ["Mustard"],
    harvest_time: "March-April",
  },

  rice: {
    days_to_maturity: 150,
    watering: "High",
    pests: ["Stem Borer"],
    companion_plants: ["Azolla"],
    harvest_time: "October-November",
  },
};

const FALLBACK_INSIGHTS = {
  English: { unavailable: "AI insights unavailable.", monitor: "Monitor the crop regularly.", irrigation: "Maintain irrigation based on soil moisture.", pests: "Check regularly for pests." },
  Hindi: { unavailable: "AI की जानकारी उपलब्ध नहीं है।", monitor: "फसल की नियमित निगरानी करें।", irrigation: "मिट्टी की नमी के अनुसार सिंचाई करें।", pests: "कीटों की नियमित जाँच करें।" },
  Bengali: { unavailable: "AI-র পরামর্শ পাওয়া যাচ্ছে না।", monitor: "নিয়মিত ফসল পর্যবেক্ষণ করুন।", irrigation: "মাটির আর্দ্রতা অনুযায়ী সেচ দিন।", pests: "নিয়মিত পোকামাকড় পরীক্ষা করুন।" },
  Marathi: { unavailable: "AI माहिती उपलब्ध नाही.", monitor: "पिकाचे नियमित निरीक्षण करा.", irrigation: "मातीतील ओलाव्यानुसार सिंचन करा.", pests: "किडींची नियमित तपासणी करा." },
  Punjabi: { unavailable: "AI ਜਾਣਕਾਰੀ ਉਪਲਬਧ ਨਹੀਂ ਹੈ।", monitor: "ਫਸਲ ਦੀ ਨਿਯਮਿਤ ਨਿਗਰਾਨੀ ਕਰੋ।", irrigation: "ਮਿੱਟੀ ਦੀ ਨਮੀ ਅਨੁਸਾਰ ਸਿੰਚਾਈ ਕਰੋ।", pests: "ਕੀੜਿਆਂ ਦੀ ਨਿਯਮਿਤ ਜਾਂਚ ਕਰੋ।" },
  Tamil: { unavailable: "AI தகவல் கிடைக்கவில்லை.", monitor: "பயிரைத் தொடர்ந்து கண்காணிக்கவும்.", irrigation: "மண் ஈரப்பதத்திற்கு ஏற்ப பாசனம் செய்யவும்.", pests: "பூச்சிகளைத் தொடர்ந்து பரிசோதிக்கவும்." },
  Telugu: { unavailable: "AI సూచనలు అందుబాటులో లేవు.", monitor: "పంటను క్రమం తప్పకుండా పరిశీలించండి.", irrigation: "నేల తేమను బట్టి నీరు పెట్టండి.", pests: "తెగుళ్లను క్రమం తప్పకుండా పరిశీలించండి." },
};

class FarmersAlmanac {

  getDailyAlmanac() {

    return {
      date: new Date()
        .toLocaleDateString(),

      moon_phase:
        "Waxing Crescent",

      activity:
        "Plant leafy vegetables",

      best_for: [
        "Spinach",
        "Lettuce",
        "Cabbage",
      ],
    };
  }

  getSeasonalGuide(region) {

    return {
      region,

      Kharif: [
        "Rice",
        "Maize",
        "Cotton",
      ],

      Rabi: [
        "Wheat",
        "Mustard",
        "Potato",
      ],

      Summer: [
        "Watermelon",
        "Cucumber",
        "Tomato",
      ],
    };
  }

  async getCropAIData(
    cropName,
    language = "English"
  ) {

    const fallback = FALLBACK_INSIGHTS[language] || FALLBACK_INSIGHTS.English;

    const crop =
      CROP_DATA[
        cropName.toLowerCase()
      ];

    if (!crop) {

      return {
        error:
          "Crop not found",
      };
    }

    const prompt = `
You are an agriculture expert AI.
Write every user-facing string value in ${language}, using its normal script. Do not switch to English or mix languages. Keep the JSON property names exactly as specified, and use simple wording a farmer can follow.

Crop: ${cropName}

Generate farming insights.

Return JSON:

{
 "summary":"...",
 "recommendations":[
   "...",
   "...",
   "..."
 ]
}
`;

    try {

      const response =
        await generateResponse(
          prompt
        );

      const jsonText = response
        .replace(/```json\s*/gi, "")
        .replace(/```/g, "")
        .trim();
      const match = jsonText.match(/\{[\s\S]*\}/);
      const aiData = JSON.parse(match ? match[0] : jsonText);

      return {
        crop_data: crop,
        ai_data: {
          summary: aiData.summary || "Farming insights are ready.",
          recommendations: Array.isArray(aiData.recommendations)
            ? aiData.recommendations
            : [],
        },
      };

    } catch {

      return {
        crop_data: crop,

        ai_data: {
          summary: fallback.unavailable,

          recommendations: [
            fallback.monitor,
            fallback.irrigation,
            fallback.pests,
          ],
        },
      };
    }
  }
}

module.exports =
  FarmersAlmanac;
