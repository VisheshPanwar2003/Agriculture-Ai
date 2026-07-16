import { useState } from "react";

import api from "../services/api";

import {
  Leaf,
  Mail,
  Lock,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

export default function Login() {

  const navigate = useNavigate();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const login = async () => {

    try {

      setLoading(true);

      setError("");

      const response =
        await api.post(
          "/auth/login",
          {
            email,
            password,
          }
        );

      // SAVE TOKEN
      localStorage.setItem(
        "token",
        response.data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(
          response.data.user
        )
      );

      navigate("/");

    } catch (error) {

      console.error(error);

      setError(
        error.response?.data?.detail ||
        "Login failed"
      );

    } finally {

      setLoading(false);
    }
  };

  return (
    <div
      className="
      min-h-screen
      bg-[#03120d]
      flex
      items-center
      justify-center
      px-6
      "
    >

      <div
        className="
        w-full
        max-w-md
        bg-[#051a14]
        border
        border-green-900
        rounded-3xl
        p-8
        shadow-2xl
        "
      >

        {/* LOGO */}
        <div className="text-center">

          <div
            className="
            w-20
            h-20
            rounded-3xl
            bg-green-700/20
            flex
            items-center
            justify-center
            mx-auto
            "
          >

            <Leaf
              size={40}
              className="text-green-400"
            />
          </div>

          <h1 className="text-4xl font-bold mt-6 text-white">
            Welcome Back
          </h1>

          <p className="text-gray-400 mt-3">
            Login to AgriSense AI
          </p>
        </div>

        {/* ERROR */}
        {
          error && (

            <div
              className="
              mt-6
              bg-red-500/10
              border
              border-red-500/30
              rounded-2xl
              p-4
              text-red-400
              text-sm
              "
            >
              {error}
            </div>
          )
        }

        {/* FORM */}
        <div className="mt-8 space-y-5">

          {/* EMAIL */}
          <div>

            <p className="text-sm text-gray-400 mb-2">
              Email Address
            </p>

            <div
              className="
              bg-[#08251c]
              border
              border-green-900
              rounded-2xl
              flex
              items-center
              gap-3
              px-4
              py-4
              transition-all
              focus-within:border-green-500
              "
            >

              <Mail
                size={18}
                className="text-green-400"
              />

              <input
                type="email"
                value={email}
                onChange={(e) =>
                  setEmail(
                    e.target.value
                  )
                }
                placeholder="Enter your email"
                className="
                bg-transparent
                outline-none
                flex-1
                text-white
                placeholder:text-gray-500
                "
              />
            </div>
          </div>

          {/* PASSWORD */}
          <div>

            <p className="text-sm text-gray-400 mb-2">
              Password
            </p>

            <div
              className="
              bg-[#08251c]
              border
              border-green-900
              rounded-2xl
              flex
              items-center
              gap-3
              px-4
              py-4
              transition-all
              focus-within:border-green-500
              "
            >

              <Lock
                size={18}
                className="text-green-400"
              />

              <input
                type="password"
                value={password}
                onChange={(e) =>
                  setPassword(
                    e.target.value
                  )
                }
                placeholder="Enter your password"
                className="
                bg-transparent
                outline-none
                flex-1
                text-white
                placeholder:text-gray-500
                "
              />
            </div>
          </div>

          {/* BUTTON */}
          <button
            onClick={login}
            disabled={loading}
            className="
            w-full
            bg-green-700
            hover:bg-green-600
            transition-all
            rounded-2xl
            py-4
            font-semibold
            mt-4
            disabled:opacity-50
            text-white
            "
          >

            {
              loading
                ? "Logging in..."
                : "Login"
            }
          </button>

          {/* SIGNUP */}
          <div className="text-center pt-3">

            <p className="text-gray-400">

              Don’t have an account?

              <span
                onClick={() =>
                  navigate("/signup")
                }
                className="
                text-green-400
                cursor-pointer
                ml-2
                hover:underline
                "
              >
                Sign Up
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
