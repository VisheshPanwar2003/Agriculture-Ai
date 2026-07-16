import { useState } from "react";
import api from "../services/api";

import {
  Upload,
  Sparkles,
  Leaf,
  Info,
  ChevronDown,
} from "lucide-react";

export default function ImageAnalysis() {

  const [image, setImage] = useState(null);

  const [imageFile, setImageFile] = useState(null);

  const [loading, setLoading] = useState(false);

  const [result, setResult] = useState(null);

  const [analysisType, setAnalysisType] =
    useState("crop");

  // IMAGE UPLOAD
  const handleImageUpload = (e) => {

    const file = e.target.files[0];

    if (file) {

      setImage(URL.createObjectURL(file));

      setImageFile(file);
    }
  };

  // ANALYZE IMAGE
  const handleAnalyze = async () => {

    if (!imageFile) return;

    try {

      setLoading(true);

      const formData = new FormData();

      formData.append("file", imageFile);

      const response = await api.post(
          "/analysis/predict",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setResult(response.data);

      console.log(response.data);

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-12 gap-6 h-full min-h-0">

      {/* LEFT PANEL */}
      <div
        className="
        col-span-4
        bg-[#051a14]
        border
        border-green-900
        rounded-2xl
        p-5
        flex
        flex-col
        "
      >

        {/* ANALYSIS TYPE */}
        <div>

          <h2 className="text-green-400 font-semibold mb-3">
            1. Select Analysis Type
          </h2>

          <div className="relative">

            <select
              value={analysisType}
              onChange={(e) =>
                setAnalysisType(e.target.value)
              }
              className="
              w-full
              bg-[#071f18]
              border
              border-green-900
              rounded-xl
              px-4
              py-3
              appearance-none
              outline-none
              text-white
              "
            >
              <option value="crop">
                Crop / Fruit
              </option>

              <option value="leaf">
                Leaf Disease
              </option>

              <option value="plant">
                Plant Health
              </option>
            </select>

            <ChevronDown
              className="
              absolute
              right-4
              top-1/2
              -translate-y-1/2
              text-gray-400
              pointer-events-none
              "
              size={18}
            />
          </div>

          {/* INFO CARD */}
          <div
            className="
            mt-4
            bg-[#07261d]
            border
            border-green-900
            rounded-xl
            p-4
            flex
            gap-3
            "
          >
            <Info
              className="text-green-400 shrink-0"
              size={18}
            />

            <p className="text-sm text-gray-300 leading-relaxed">
              Analyze crop or fruit images to detect
              disease and get AI recommendations.
            </p>
          </div>
        </div>

        {/* UPLOAD SECTION */}
        <div className="mt-6 flex-1 flex flex-col">

          <h2 className="text-green-400 font-semibold mb-3">
            2. Upload Image
          </h2>

          <label
            className="
            relative
            border
            border-dashed
            border-green-700
            rounded-2xl
            flex-1
            min-h-[220px]
            flex
            items-center
            justify-center
            overflow-hidden
            cursor-pointer
            hover:bg-green-900/10
            transition-all
            duration-300
            "
          >

            {/* IMAGE */}
            {image ? (
              <>
                <img
                  src={image}
                  alt="preview"
                  className="
                  absolute
                  inset-0
                  w-full
                  h-full
                  object-cover
                  "
                />

                {/* OVERLAY */}
                <div
                  className="
                  absolute
                  inset-0
                  bg-black/30
                  opacity-0
                  hover:opacity-100
                  transition-all
                  duration-300
                  flex
                  items-center
                  justify-center
                  "
                >
                  <div
                    className="
                    bg-black/60
                    px-4
                    py-2
                    rounded-xl
                    text-white
                    "
                  >
                    Replace Image
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center text-center px-6">

                <Upload
                  size={42}
                  className="text-green-400 mb-4"
                />

                <p className="font-medium">
                  Upload Crop Image
                </p>

                <p className="text-sm text-gray-400 mt-2">
                  Drag & drop image here
                </p>

                <p className="text-sm text-gray-400">
                  or click to browse
                </p>

                <p className="text-xs text-gray-500 mt-4">
                  JPG, PNG, WEBP up to 10MB
                </p>
              </div>
            )}

            <input
              type="file"
              className="hidden"
              onChange={handleImageUpload}
            />
          </label>
        </div>

        {/* BUTTON */}
        <button
          onClick={handleAnalyze}
          disabled={loading}
          className="
          mt-6
          bg-green-700
          hover:bg-green-600
          disabled:opacity-60
          disabled:cursor-not-allowed
          transition-all
          duration-300
          rounded-xl
          py-4
          flex
          items-center
          justify-center
          gap-2
          font-semibold
          shrink-0
          "
        >
          <Sparkles size={18} />

          {
            loading
              ? "Analyzing..."
              : "Analyze Image"
          }
        </button>
      </div>

      {/* RIGHT PANEL */}
      <div
        className="
        col-span-8
        bg-[#051a14]
        border
        border-green-900
        rounded-2xl
        p-5
        flex
        flex-col
        h-full
        overflow-hidden
        "
      >

        {/* HEADER */}
        <div
          className="
          flex
          items-center
          gap-2
          border-b
          border-green-900
          pb-4
          shrink-0
          "
        >
          <Leaf
            className="text-green-400"
            size={18}
          />

          <h2 className="text-green-400 font-semibold">
            Analysis Results
          </h2>
        </div>

        {/* CONTENT */}
        <div
          className="
          flex-1
          overflow-y-auto
          py-6
          pr-2
          min-h-0
          "
        >

          {
            result ? (

              <div className="space-y-6">

                {/* MAIN RESULT CARD */}
                <div
                  className="
                  bg-[#08251c]
                  border
                  border-green-900
                  rounded-3xl
                  p-8
                  "
                >

                  {/* TOP SECTION */}
                  <div className="flex items-start justify-between">

                    {/* LEFT */}
                    <div>

                      <p className="text-gray-400 text-sm mb-3">
                        AI Detection Result
                      </p>

                      <h1 className="text-6xl font-bold text-green-400 leading-none">
                        {result.status}
                      </h1>

                      <div className="flex gap-4 mt-6">

                        {/* TYPE */}
                        <div
                          className="
                          bg-[#061d16]
                          border
                          border-green-900
                          rounded-2xl
                          px-5
                          py-3
                          "
                        >
                          <p className="text-xs text-gray-400">
                            Crop Type
                          </p>

                          <p className="mt-1 font-medium text-xl">
                            {result.type}
                          </p>
                        </div>

                        {/* ISSUES */}
                        <div
                          className="
                          bg-[#061d16]
                          border
                          border-green-900
                          rounded-2xl
                          px-5
                          py-3
                          "
                        >
                          <p className="text-xs text-gray-400">
                            Issues Found
                          </p>

                          <p className="mt-1 font-medium text-xl">
                            {result.issues}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* CONFIDENCE */}
                    <div
                      className="
                      w-[160px]
                      h-[160px]
                      rounded-full
                      border-[5px]
                      border-green-500
                      bg-[#061d16]
                      flex
                      flex-col
                      items-center
                      justify-center
                      shrink-0
                      shadow-[0_0_30px_rgba(0,255,120,0.15)]
                      "
                    >

                      <h2 className="text-5xl font-bold text-green-400">
                        {
                          Math.round(
                            result.confidence * 100
                          )
                        }%
                      </h2>

                      <p className="text-gray-400 text-sm mt-2">
                        Confidence
                      </p>
                    </div>
                  </div>

                  {/* DIVIDER */}
                  <div className="h-px bg-green-900 my-8" />

                  {/* AI RECOMMENDATION */}
                  <div
                    className="
                    bg-[#061d16]
                    border
                    border-green-900
                    rounded-3xl
                    p-7
                    "
                  >

                    <h2 className="text-4xl font-bold mb-6">
                      AI Recommendations
                    </h2>

                    {/* RECOMMENDATION LIST */}
                    <div className="space-y-4">

                      {
                        result.recommendations?.map(
                          (item, index) => (
                            <div
                              key={index}
                              className="
                              bg-[#08251c]
                              border
                              border-green-900
                              rounded-2xl
                              p-5
                              flex
                              items-start
                              gap-4
                              "
                            >

                              {/* BULLET */}
                              <div
                                className="
                                w-3
                                h-3
                                rounded-full
                                bg-green-400
                                mt-2
                                shrink-0
                                "
                              />

                              {/* TEXT */}
                              <p className="text-gray-300 leading-relaxed text-lg">
                                {item}
                              </p>
                            </div>
                          )
                        )
                      }

                    </div>

                    {/* HEALTH STATUS */}
                    <div className="mt-8">

                      <h3 className="text-2xl font-semibold mb-4">
                        Health Status
                      </h3>

                      <div
                        className={`
                        inline-flex
                        items-center
                        px-5
                        py-3
                        rounded-2xl
                        text-lg
                        font-medium
                        ${
                          result.status === "Healthy"
                            ? "bg-green-700/20 text-green-400 border border-green-700"
                            : result.status === "Early Blight"
                            ? "bg-yellow-700/20 text-yellow-400 border border-yellow-700"
                            : "bg-red-700/20 text-red-400 border border-red-700"
                        }
                        `}
                      >
                        {result.status}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            ) : (

              /* EMPTY STATE */
              <div className="h-full flex items-center justify-center">

                <div className="text-center">

                  <div
                    className="
                    w-28
                    h-28
                    rounded-full
                    border
                    border-green-900
                    bg-[#08251c]
                    flex
                    items-center
                    justify-center
                    mx-auto
                    "
                  >
                    <Leaf
                      size={48}
                      className="text-green-400"
                    />
                  </div>

                  <h2 className="mt-6 text-2xl font-semibold">
                    No analysis yet
                  </h2>

                  <p className="text-gray-400 mt-3 leading-relaxed">
                    Upload an image and click
                    <span className="text-green-400">
                      {" "}“Analyze Image”
                    </span>

                    <br />

                    to see results here.
                  </p>
                </div>
              </div>
            )
          }
        </div>
      </div>
    </div>
  );
}