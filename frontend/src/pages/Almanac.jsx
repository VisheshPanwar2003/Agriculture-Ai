import { useEffect, useState } from "react";

import api from "../services/api";

import {
  Sprout,
  Moon,
  CalendarDays,
  CloudSun,
  Wheat,
  Droplets,
  Bug,
  Calculator,
  Sparkles,
} from "lucide-react";

export default function FarmerAlmanac() {

  const [daily, setDaily] =
    useState(null);

  const [seasonal, setSeasonal] =
    useState(null);

  const [cropData, setCropData] =
    useState(null);

  const [selectedCrop, setSelectedCrop] =
    useState("Tomato");

  const [region, setRegion] =
    useState("North India");

  const [plantingDate, setPlantingDate] =
    useState("");

  const [harvestDate, setHarvestDate] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  // FETCH DATA
  useEffect(() => {

    fetchData();

  }, [region, selectedCrop]);

  const fetchData = async () => {

    try {

      setLoading(true);

      const dailyRes = await api.get(
        "/almanac/daily"
      );

      const seasonalRes = await api.get(
        `/almanac/seasonal/${region}`
      );

      const cropRes = await api.get(
        `/almanac/crop-ai/${selectedCrop}`
      );

      setDaily(dailyRes.data);

      setSeasonal(seasonalRes.data);

      setCropData(cropRes.data);

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);
    }
  };

  // HARVEST CALCULATOR
  const calculateHarvest = () => {

    if (!plantingDate) return;

    const harvestDays =
      cropData?.crop_data
        ?.harvest_days || 75;

    const date = new Date(
      plantingDate
    );

    date.setDate(
      date.getDate() + harvestDays
    );

    setHarvestDate(
      date.toDateString()
    );
  };

  return (
    <div className="h-full overflow-y-auto pr-2">

      <div className="space-y-6">

        {/* LOADING */}
        {
          loading && (

            <div
              className="
              fixed
              inset-0
              bg-black/40
              backdrop-blur-sm
              z-50
              flex
              items-center
              justify-center
              "
            >

              <div
                className="
                bg-[#041b14]
                border
                border-green-900
                rounded-3xl
                px-10
                py-8
                text-center
                "
              >

                <div
                  className="
                  w-14
                  h-14
                  border-4
                  border-green-700
                  border-t-transparent
                  rounded-full
                  animate-spin
                  mx-auto
                  "
                />

                <h2 className="text-2xl font-semibold mt-6">
                  Loading Almanac...
                </h2>
              </div>
            </div>
          )
        }

        {/* TOP CARDS */}
        <div className="grid grid-cols-3 gap-5">

          {/* TODAY ACTIVITY */}
          <div
            className="
            bg-[#041b14]
            border
            border-green-900
            rounded-3xl
            p-5
            "
          >

            <div className="flex gap-4">

              <div
                className="
                w-14
                h-14
                rounded-2xl
                bg-green-700/20
                flex
                items-center
                justify-center
                shrink-0
                "
              >
                <Sprout
                  size={28}
                  className="text-green-400"
                />
              </div>

              <div>

                <p className="text-gray-400 text-sm">
                  Today's Activity
                </p>

                <h2 className="text-xl font-semibold mt-2">
                  {daily?.activity}
                </h2>
              </div>
            </div>
          </div>

          {/* BEST FOR */}
          <div
            className="
            bg-[#041b14]
            border
            border-green-900
            rounded-3xl
            p-5
            "
          >

            <div className="flex gap-4">

              <div
                className="
                w-14
                h-14
                rounded-2xl
                bg-green-700/20
                flex
                items-center
                justify-center
                shrink-0
                "
              >
                <CloudSun
                  size={28}
                  className="text-green-400"
                />
              </div>

              <div>

                <p className="text-gray-400 text-sm">
                  Best For
                </p>

                <div className="mt-2 space-y-1">

                  {
                    daily?.best_for?.map(
                      (item, index) => (

                        <p
                          key={index}
                          className="text-sm"
                        >
                          {item}
                        </p>
                      )
                    )
                  }
                </div>
              </div>
            </div>
          </div>

          {/* MOON PHASE */}
          <div
            className="
            bg-[#041b14]
            border
            border-green-900
            rounded-3xl
            p-5
            "
          >

            <div className="flex gap-4">

              <div
                className="
                w-14
                h-14
                rounded-2xl
                bg-green-700/20
                flex
                items-center
                justify-center
                shrink-0
                "
              >
                <Moon
                  size={28}
                  className="text-green-400"
                />
              </div>

              <div>

                <p className="text-gray-400 text-sm">
                  Moon Phase
                </p>

                <h2 className="text-xl font-semibold mt-2">
                  {daily?.moon_phase}
                </h2>

                <p className="text-sm text-gray-400 mt-1">
                  Good time for planting leafy crops
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* DATE STRIP */}
        <div
          className="
          bg-[#041b14]
          border
          border-green-900
          rounded-2xl
          px-6
          py-4
          flex
          items-center
          gap-3
          "
        >

          <CalendarDays
            size={20}
            className="text-green-400"
          />

          <p className="text-green-400 font-medium">
            {daily?.date}
          </p>
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-12 gap-6">

          {/* CROP DATABASE */}
          <div className="col-span-6">

            <div
              className="
              bg-[#041b14]
              border
              border-green-900
              rounded-3xl
              p-6
              h-full
              "
            >

              <h2 className="text-2xl font-semibold mb-6">
                Crop Intelligence
              </h2>

              <p className="text-gray-400 text-sm mb-3">
                Select Crop
              </p>

              <select
                value={selectedCrop}
                onChange={(e) =>
                  setSelectedCrop(
                    e.target.value
                  )
                }
                className="
                w-full
                bg-[#08251c]
                border
                border-green-900
                rounded-2xl
                px-4
                py-4
                outline-none
                "
              >
                <option>Tomato</option>
                <option>Potato</option>
                <option>Rice</option>
              </select>

              {/* INFO GRID */}
              <div className="grid grid-cols-2 gap-5 mt-8">

                <div className="space-y-5">

                  <div className="flex gap-3">

                    <Wheat
                      size={18}
                      className="text-green-400 mt-1"
                    />

                    <div>

                      <p className="text-sm text-gray-400">
                        Days to Maturity
                      </p>

                      <p className="mt-1">
                        {
                          cropData?.crop_data
                            ?.days_to_maturity
                        }
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">

                    <CloudSun
                      size={18}
                      className="text-blue-400 mt-1"
                    />

                    <div>

                      <p className="text-sm text-gray-400">
                        Watering Needs
                      </p>

                      <p className="mt-1">
                        {
                          cropData?.crop_data
                            ?.watering
                        }
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">

                    <Bug
                      size={18}
                      className="text-purple-400 mt-1"
                    />

                    <div>

                      <p className="text-sm text-gray-400">
                        Pests
                      </p>

                      <p className="mt-1">
                        {
                          cropData?.crop_data
                            ?.pests?.join(", ")
                        }
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-5">

                  <div className="flex gap-3">

                    <Sprout
                      size={18}
                      className="text-yellow-400 mt-1"
                    />

                    <div>

                      <p className="text-sm text-gray-400">
                        Companion Plants
                      </p>

                      <p className="mt-1">
                        {
                          cropData?.crop_data
                            ?.companion_plants?.join(", ")
                        }
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">

                    <Droplets
                      size={18}
                      className="text-red-400 mt-1"
                    />

                    <div>

                      <p className="text-sm text-gray-400">
                        Harvest Time
                      </p>

                      <p className="mt-1">
                        {
                          cropData?.crop_data
                            ?.harvest_time
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* AI INSIGHTS */}
              {
                cropData?.ai_data && (

                  <div
                    className="
                    mt-8
                    bg-[#08251c]
                    border
                    border-green-900
                    rounded-3xl
                    p-6
                    "
                  >

                    <div className="flex items-center gap-3 mb-5">

                      <Sparkles
                        size={22}
                        className="text-green-400"
                      />

                      <h2 className="text-2xl font-semibold">
                        AI Farming Insights
                      </h2>
                    </div>

                    <p className="text-gray-300 leading-relaxed">
                      {
                        cropData.ai_data
                          .summary
                      }
                    </p>

                    {/* RECOMMENDATIONS */}
                    <div className="mt-6">

                      <h3 className="text-green-400 font-medium mb-3">
                        Recommendations
                      </h3>

                      <div className="space-y-3">

                        {
                          cropData.ai_data.recommendations?.map(
                            (
                              item,
                              index
                            ) => (

                              <div
                                key={index}
                                className="
                                bg-[#0d2b22]
                                rounded-2xl
                                p-4
                                "
                              >
                                {item}
                              </div>
                            )
                          )
                        }
                      </div>
                    </div>
                  </div>
                )
              }
            </div>
          </div>

          {/* SEASONAL GUIDE */}
          <div className="col-span-6">

            <div
              className="
              bg-[#041b14]
              border
              border-green-900
              rounded-3xl
              p-6
              h-full
              "
            >

              <h2 className="text-2xl font-semibold mb-6">
                Seasonal Guide by Region
              </h2>

              <p className="text-gray-400 text-sm mb-3">
                Select Region
              </p>

              <select
                value={region}
                onChange={(e) =>
                  setRegion(
                    e.target.value
                  )
                }
                className="
                w-full
                bg-[#08251c]
                border
                border-green-900
                rounded-2xl
                px-4
                py-4
                outline-none
                "
              >
                <option>North India</option>
                <option>South India</option>
                <option>West India</option>
                <option>East India</option>
              </select>

              {/* SEASONS */}
              <div className="space-y-4 mt-8">

                {
                  [
                    {
                      title: "🌱 Kharif",
                      data: seasonal?.Kharif,
                      color: "text-green-400",
                    },

                    {
                      title: "🌾 Rabi",
                      data: seasonal?.Rabi,
                      color: "text-yellow-400",
                    },

                    {
                      title: "☀️ Summer",
                      data: seasonal?.Summer,
                      color: "text-red-400",
                    },
                  ].map(
                    (
                      season,
                      index
                    ) => (

                      <div
                        key={index}
                        className="
                        bg-[#08251c]
                        rounded-2xl
                        p-5
                        border
                        border-green-900
                        "
                      >

                        <h3
                          className={`${season.color} font-medium`}
                        >
                          {season.title}
                        </h3>

                        <div className="mt-3 flex flex-wrap gap-2">

                          {
                            season.data?.map(
                              (
                                crop,
                                idx
                              ) => (

                                <div
                                  key={idx}
                                  className="
                                  px-3
                                  py-2
                                  rounded-xl
                                  bg-[#0d2b22]
                                  text-sm
                                  "
                                >
                                  {crop}
                                </div>
                              )
                            )
                          }
                        </div>
                      </div>
                    )
                  )
                }
              </div>
            </div>
          </div>
        </div>

        {/* PLANTING CALCULATOR */}
        <div
          className="
          bg-[#041b14]
          border
          border-green-900
          rounded-3xl
          p-6
          "
        >

          <div className="flex items-center gap-3 mb-8">

            <Calculator
              size={24}
              className="text-green-400"
            />

            <h2 className="text-3xl font-semibold">
              Planting Date Calculator
            </h2>
          </div>

          <div className="grid grid-cols-12 gap-5">

            {/* SELECT CROP */}
            <div className="col-span-4">

              <p className="text-gray-400 text-sm mb-3">
                Select Crop
              </p>

              <select
                value={selectedCrop}
                onChange={(e) =>
                  setSelectedCrop(
                    e.target.value
                  )
                }
                className="
                w-full
                bg-[#08251c]
                border
                border-green-900
                rounded-2xl
                px-4
                py-4
                outline-none
                "
              >
                <option>Tomato</option>
                <option>Potato</option>
                <option>Rice</option>
              </select>
            </div>

            {/* DATE */}
            <div className="col-span-4">

              <p className="text-gray-400 text-sm mb-3">
                Planting Date
              </p>

              <input
                type="date"
                value={plantingDate}
                onChange={(e) =>
                  setPlantingDate(
                    e.target.value
                  )
                }
                className="
                w-full
                bg-[#08251c]
                border
                border-green-900
                rounded-2xl
                px-4
                py-4
                outline-none
                "
              />
            </div>

            {/* BUTTON */}
            <div className="col-span-4 flex items-end">

              <button
                onClick={calculateHarvest}
                className="
                w-full
                py-4
                rounded-2xl
                bg-green-700
                hover:bg-green-600
                transition-all
                duration-300
                font-medium
                "
              >
                Calculate Harvest Date
              </button>
            </div>
          </div>

          {/* RESULT */}
          {
            harvestDate && (

              <div
                className="
                mt-6
                bg-[#08251c]
                border
                border-green-900
                rounded-2xl
                p-5
                "
              >

                <p className="text-gray-400">
                  Estimated Harvest Date
                </p>

                <h2 className="text-3xl font-bold text-green-400 mt-2">
                  {harvestDate}
                </h2>
              </div>
            )
          }
        </div>
      </div>
    </div>
  );
}