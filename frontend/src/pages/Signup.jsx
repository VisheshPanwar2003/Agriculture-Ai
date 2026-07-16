import { useState } from "react";

import api from "../services/api";

import {
  Leaf,
  Mail,
  Lock,
  User,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

export default function Signup() {

  const navigate = useNavigate();

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const signup = async () => {

    try {

      setLoading(true);

      setError("");

      const response =
        await api.post(
          "/auth/signup",
          {
            name,
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
        "Signup failed"
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

          <h1 className="text-4xl font-bold mt-6">
            Create Account
          </h1>

          <p className="text-gray-400 mt-3">
            Join AgriSense AI Platform
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

          {/* NAME */}
          <div>

            <p className="text-sm text-gray-400 mb-2">
              Full Name
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
              "
            >

              <User
                size={18}
                className="text-green-400"
              />

              <input
                type="text"
                value={name}
                onChange={(e) =>
                  setName(
                    e.target.value
                  )
                }
                placeholder="Enter your name"
                className="
                bg-transparent
                outline-none
                flex-1
                "
              />
            </div>
          </div>

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
                "
              />
            </div>
          </div>

          {/* BUTTON */}
          <button
            onClick={signup}
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
            "
          >

            {
              loading
                ? "Creating Account..."
                : "Create Account"
            }
          </button>

          {/* LOGIN */}
          <div className="text-center pt-3">

            <p className="text-gray-400">

              Already have an account?

              <span
                onClick={() =>
                  navigate("/login")
                }
                className="
                text-green-400
                cursor-pointer
                ml-2
                hover:underline
                "
              >
                Login
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
