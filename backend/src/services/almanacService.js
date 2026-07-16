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
    cropName
  ) {

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

      return {
        crop_data: crop,
        ai_data: response,
      };

    } catch {

      return {
        crop_data: crop,

        ai_data: {
          summary:
            "AI insights unavailable.",

          recommendations: [
            "Monitor crop regularly",
            "Maintain irrigation",
            "Check pests",
          ],
        },
      };
    }
  }
}

module.exports =
  FarmersAlmanac;