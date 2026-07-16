// Sidebar.jsx

import {
  Image,
  MessageCircle,
  Eye,
  CalendarDays,
} from "lucide-react";

import { NavLink } from "react-router-dom";

import WeatherCard from "./WeatherCard";

export default function Sidebar() {

  const menu = [
    {
      icon: <Image size={20} />,
      label: "Image Analysis",
      path: "/",
    },

    {
      icon: <MessageCircle size={20} />,
      label: "AI Chatbot",
      path: "/chatbot",
    },

    {
      icon: <Eye size={20} />,
      label: "Vision Analysis",
      path: "/vision",
    },

    {
      icon: <CalendarDays size={20} />,
      label: "Farmer's Almanac",
      path: "/almanac",
    },
  ];

  return (
    <div
      className="
      w-[270px]
      bg-[#031b14]
      border-r
      border-green-900/40
      flex
      flex-col
      justify-between
      min-h-screen
      "
    >

      {/* TOP */}
      <div>

        {/* LOGO */}
        <div className="p-6">

          <h1 className="text-2xl font-bold text-green-400">
            AgriSense AI
          </h1>

          <p className="text-sm text-gray-400 mt-1">
            Crop • Soil • Plant Health
          </p>
        </div>

        {/* MENU */}
        <div className="px-4 space-y-2">

          {menu.map((item, index) => (
            <NavLink
              key={index}
              to={item.path}
              className={({ isActive }) =>
                `
                flex
                items-center
                gap-3
                px-4
                py-4
                rounded-2xl
                transition-all
                duration-300
                ${
                  isActive
                    ? "bg-green-700/30 text-white"
                    : "hover:bg-[#08251c] text-gray-300"
                }
                `
              }
            >
              {item.icon}

              <span>{item.label}</span>
            </NavLink>
          ))}
        </div>
      </div>

      {/* WEATHER */}
      <WeatherCard city="Delhi" />
    </div>
  );
}