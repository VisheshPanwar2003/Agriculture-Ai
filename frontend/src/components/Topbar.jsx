import { useState } from "react";

import {
  Bell,
  ChevronDown,
  LogOut,
  User,
} from "lucide-react";

import { useLocation } from "react-router-dom";

export default function Topbar() {

  const [open, setOpen] =
    useState(false);

  const location =
    useLocation();

  // GET USER
  const user = JSON.parse(
    localStorage.getItem("user")
  );

  // PAGE CONFIG
  const pageConfig = {

    "/": {

      title:
        "Crop Analysis",

      subtitle:
        "Upload image or ask AI"
    },

    "/chatbot": {

      title:
        "AI Chatbot",

      subtitle:
        "Talk with AgriSense AI assistant"
    },

    "/vision": {

      title:
        "Vision AI",

      subtitle:
        "Analyze crops using AI vision"
    },

    "/almanac": {

      title:
        "Farmer Almanac",

      subtitle:
        "Smart seasonal farming insights"
    }
  };

  const currentPage =
    pageConfig[
      location.pathname
    ] || {

      title:
        "AgriSense AI",

      subtitle:
        "Smart Agriculture Platform"
    };

  // LOGOUT
  const logout = () => {

    localStorage.removeItem(
      "token"
    );

    localStorage.removeItem(
      "user"
    );

    window.location.href =
      "/login";
  };

  return (
    <div
      className="
      h-[80px]
      bg-[#041a14]
      px-8
      flex
      items-center
      justify-between
      border-b
      border-green-900
      "
    >

      {/* LEFT */}
      <div>

        <h1 className="text-3xl font-bold">
          {
            currentPage.title
          }
        </h1>

        <p className="text-gray-400 text-sm mt-1">
          {
            currentPage.subtitle
          }
        </p>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-6">

        {/* NOTIFICATION */}
        <div
          className="
          w-11
          h-11
          rounded-xl
          bg-[#0a241c]
          border
          border-green-900
          flex
          items-center
          justify-center
          cursor-pointer
          hover:bg-[#103126]
          transition-all
          "
        >

          <Bell size={18} />
        </div>

        {/* PROFILE */}
        <div className="relative">

          <div
            onClick={() =>
              setOpen(!open)
            }
            className="
            flex
            items-center
            gap-3
            bg-[#0a241c]
            border
            border-green-900
            px-4
            py-2
            rounded-2xl
            cursor-pointer
            hover:bg-[#103126]
            transition-all
            "
          >

            {/* INITIALS */}
            <div
              className="
              w-11
              h-11
              rounded-full
              bg-green-700
              flex
              items-center
              justify-center
              text-white
              font-semibold
              text-sm
              uppercase
              "
            >

              {
                user?.name
                  ?.split(" ")
                  ?.map(
                    (word) => word[0]
                  )
                  ?.join("")
                  ?.slice(0, 2)
                || "U"
              }

            </div>

            {/* USER INFO */}
            <div>

              <p className="font-medium">
                {
                  user?.name ||
                  "User"
                }
              </p>

              <p
                className="
                text-xs
                text-gray-400
                "
              >
                {
                  user?.email ||
                  "user@email.com"
                }
              </p>
            </div>

            <ChevronDown
              size={18}
              className={`
                transition-all
                ${
                  open
                    ? "rotate-180"
                    : ""
                }
              `}
            />
          </div>

          {/* DROPDOWN */}
          {
            open && (

              <div
                className="
                absolute
                right-0
                mt-3
                w-[240px]
                bg-[#071f18]
                border
                border-green-900
                rounded-2xl
                overflow-hidden
                shadow-2xl
                z-50
                "
              >

                {/* USER HEADER */}
                <div
                  className="
                  p-4
                  border-b
                  border-green-900
                  "
                >

                  <div className="flex items-center gap-3">

                    <div
                      className="
                      w-12
                      h-12
                      rounded-full
                      bg-green-700/20
                      flex
                      items-center
                      justify-center
                      "
                    >

                      <User
                        size={22}
                        className="text-green-400"
                      />
                    </div>

                    <div>

                      <p className="font-medium">
                        {
                          user?.name
                        }
                      </p>

                      <p
                        className="
                        text-xs
                        text-gray-400
                        mt-1
                        "
                      >
                        {
                          user?.email
                        }
                      </p>
                    </div>
                  </div>
                </div>

                {/* LOGOUT */}
                <button
                  onClick={logout}
                  className="
                  w-full
                  flex
                  items-center
                  gap-3
                  px-5
                  py-4
                  hover:bg-[#103126]
                  transition-all
                  text-left
                  "
                >

                  <LogOut
                    size={18}
                    className="text-red-400"
                  />

                  <span className="text-red-400">
                    Logout
                  </span>
                </button>
              </div>
            )
          }
        </div>
      </div>
    </div>
  );
}