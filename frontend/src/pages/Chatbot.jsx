import { useState, useRef, useEffect } from "react";

import api from "../services/api";

import ReactMarkdown from "react-markdown";

import {
  Prism as SyntaxHighlighter
} from "react-syntax-highlighter";

import {
  oneDark
} from "react-syntax-highlighter/dist/esm/styles/prism";

import {
  Send,
  Bot,
  User,
  Plus,
  MessageSquare,
} from "lucide-react";

export default function Chatbot() {

  const [message, setMessage] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [messages, setMessages] =
    useState([]);

  const [chatHistory, setChatHistory] =
    useState([]);

  const [chatId, setChatId] =
    useState(null);

  const messagesEndRef =
    useRef(null);

  // TOKEN

  const token =
    localStorage.getItem(
      "token"
    );

  // AUTH HEADERS

  const authHeaders = {

    headers: {

      Authorization:
        `Bearer ${token}`
    }
  };

  // AUTO SCROLL

  useEffect(() => {

    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });

  }, [messages]);

  // INITIALIZE CHAT

  useEffect(() => {

    initializeChat();

  }, []);

  // CREATE CHAT + LOAD HISTORY

  const initializeChat = async () => {

    try {

      // LOAD HISTORY

      const historyRes =
        await api.get(

          "/chatbot/history",

          authHeaders
        );

      setChatHistory(
        historyRes.data
      );

      // CREATE NEW CHAT

      const newChatRes =
        await api.post(

          "/chatbot/new",

          {},

          authHeaders
        );

      setChatId(
        newChatRes.data.chat_id
      );

      setMessages([
        {
          role: "assistant",

          content:
            "# Hello 👋\nI am **AgriSense AI**. Ask me anything about crops, diseases, fertilizers, irrigation, or farming.",
        },
      ]);

    } catch (error) {

      console.error(error);
    }
  };

  // SEND MESSAGE

  const sendMessage = async () => {

    if (
      !message.trim() ||
      !chatId
    ) return;

    const userMessage = {

      role: "user",

      content: message,
    };

    // ADD USER MESSAGE

    setMessages((prev) => [
      ...prev,
      userMessage,
    ]);

    const currentMessage =
      message;

    setMessage("");

    try {

      setLoading(true);

      const response =
        await api.post(

          "/chatbot/chat",

          {

            chat_id: chatId,

            message:
              currentMessage,
          },

          authHeaders
        );

      // ADD AI RESPONSE

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",

          content:
            response.data.response,
        },
      ]);

      // REFRESH SIDEBAR

      const historyRes =
        await api.get(

          "/chatbot/history",

          authHeaders
        );

      setChatHistory(
        historyRes.data
      );

    } catch (error) {

      console.error(error);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",

          content:
            "Something went wrong. Please try again.",
        },
      ]);

    } finally {

      setLoading(false);
    }
  };

  // LOAD OLD CHAT

  const loadChat = async (
    selectedChatId
  ) => {

    try {

      const response =
        await api.get(

          `/chatbot/${selectedChatId}`,

          authHeaders
        );

      setChatId(
        selectedChatId
      );

      setMessages(
        response.data.messages
      );

    } catch (error) {

      console.error(error);
    }
  };

  // CREATE NEW CHAT

  const createNewChat =
    async () => {

      try {

        const response =
          await api.post(

            "/chatbot/new",

            {},

            authHeaders
          );

        setChatId(
          response.data.chat_id
        );

        setMessages([
          {
            role: "assistant",

            content:
              "# Hello 👋\nI am **AgriSense AI**. Ask me anything about crops, diseases, fertilizers, irrigation, or farming.",
          },
        ]);

        const historyRes =
          await api.get(

            "/chatbot/history",

            authHeaders
          );

        setChatHistory(
          historyRes.data
        );

      } catch (error) {

        console.error(error);
      }
    };

  // ENTER TO SEND

  const handleKeyDown = (
    e
  ) => {

    if (
      e.key === "Enter" &&
      !e.shiftKey
    ) {

      e.preventDefault();

      sendMessage();
    }
  };

  return (

    <div className="h-full flex gap-6">

      {/* CHAT SECTION */}

      <div
        className="
        flex-1
        bg-[#051a14]
        border
        border-green-900
        rounded-2xl
        flex
        flex-col
        overflow-hidden
        "
      >

        {/* MESSAGES */}

        <div
          className="
          flex-1
          overflow-y-auto
          px-6
          py-6
          space-y-6
          "
        >

          {
            messages.map(
              (msg, index) => (

                <div
                  key={index}
                  className={`
                  flex
                  ${
                    msg.role === "user"
                      ? "justify-end"
                      : "justify-start"
                  }
                  `}
                >

                  <div
                    className={`
                    max-w-[75%]
                    rounded-2xl
                    px-5
                    py-4
                    overflow-hidden
                    ${
                      msg.role === "user"
                        ? "bg-green-700 text-white"
                        : "bg-[#08251c] border border-green-900 text-gray-200"
                    }
                    `}
                  >

                    {/* TOP */}

                    <div className="flex items-center gap-2 mb-3">

                      {
                        msg.role === "assistant" ? (
                          <Bot
                            size={18}
                            className="text-green-400"
                          />
                        ) : (
                          <User size={18} />
                        )
                      }

                      <p className="text-sm font-medium">

                        {
                          msg.role === "assistant"
                            ? "AgriSense AI"
                            : "You"
                        }

                      </p>

                    </div>

                    {/* MARKDOWN MESSAGE */}

                    <div className="leading-relaxed overflow-hidden">

                      <ReactMarkdown

                        components={{

                          code({
                            inline,
                            className,
                            children,
                            ...props
                          }) {

                            const match =
                              /language-(\w+)/.exec(
                                className || ""
                              );

                            return !inline && match ? (

                              <SyntaxHighlighter
                                style={oneDark}
                                language={match[1]}
                                PreTag="div"
                                {...props}
                              >

                                {
                                  String(children)
                                  .replace(/\n$/, "")
                                }

                              </SyntaxHighlighter>

                            ) : (

                              <code
                                className="
                                bg-black/40
                                px-2
                                py-1
                                rounded
                                text-green-300
                                "
                                {...props}
                              >

                                {children}

                              </code>

                            );
                          },

                          h1: ({ children }) => (

                            <h1
                              className="
                              text-3xl
                              font-bold
                              mb-4
                              mt-5
                              text-green-400
                              "
                            >

                              {children}

                            </h1>

                          ),

                          h2: ({ children }) => (

                            <h2
                              className="
                              text-2xl
                              font-bold
                              mb-3
                              mt-5
                              text-green-300
                              "
                            >

                              {children}

                            </h2>

                          ),

                          h3: ({ children }) => (

                            <h3
                              className="
                              text-xl
                              font-bold
                              mb-3
                              mt-4
                              text-green-200
                              "
                            >

                              {children}

                            </h3>

                          ),

                          p: ({ children }) => (

                            <p
                              className="
                              mb-4
                              text-gray-200
                              leading-8
                              "
                            >

                              {children}

                            </p>

                          ),

                          li: ({ children }) => (

                            <li
                              className="
                              ml-5
                              mb-2
                              list-disc
                              text-gray-200
                              "
                            >

                              {children}

                            </li>

                          ),

                          strong: ({ children }) => (

                            <strong
                              className="
                              text-green-400
                              font-bold
                              "
                            >

                              {children}

                            </strong>

                          ),

                          blockquote: ({ children }) => (

                            <blockquote
                              className="
                              border-l-4
                              border-green-500
                              pl-4
                              italic
                              my-4
                              text-gray-300
                              "
                            >

                              {children}

                            </blockquote>

                          ),

                        }}

                      >

                        {msg.content}

                      </ReactMarkdown>

                    </div>

                  </div>

                </div>
              )
            )
          }

          {/* LOADING */}

          {
            loading && (

              <div className="flex justify-start">

                <div
                  className="
                  bg-[#08251c]
                  border
                  border-green-900
                  rounded-2xl
                  px-5
                  py-4
                  "
                >

                  Thinking...

                </div>

              </div>
            )
          }

          <div ref={messagesEndRef} />

        </div>

        {/* INPUT */}

        <div
          className="
          p-5
          border-t
          border-green-900
          shrink-0
          "
        >

          <div
            className="
            bg-[#08251c]
            border
            border-green-900
            rounded-2xl
            flex
            items-end
            gap-3
            px-4
            py-3
            "
          >

            <textarea
              value={message}
              onChange={(e) =>
                setMessage(e.target.value)
              }
              onKeyDown={handleKeyDown}
              placeholder="Ask anything about farming..."
              rows={1}
              className="
              flex-1
              bg-transparent
              outline-none
              resize-none
              text-white
              placeholder:text-gray-500
              max-h-40
              "
            />

            <button
              onClick={sendMessage}
              disabled={loading}
              className="
              w-11
              h-11
              rounded-xl
              bg-green-700
              hover:bg-green-600
              disabled:opacity-50
              flex
              items-center
              justify-center
              transition-all
              duration-300
              shrink-0
              "
            >

              <Send size={18} />

            </button>

          </div>

        </div>

      </div>

      {/* RIGHT SIDEBAR */}

      <div
        className="
        w-[320px]
        bg-[#051a14]
        border
        border-green-900
        rounded-2xl
        p-5
        hidden
        lg:flex
        flex-col
        "
      >

        {/* NEW CHAT */}

        <button
          onClick={createNewChat}
          className="
          mb-5
          bg-green-700
          hover:bg-green-600
          transition-all
          rounded-xl
          py-3
          flex
          items-center
          justify-center
          gap-2
          font-medium
          "
        >

          <Plus size={18} />

          New Chat

        </button>

        <h2 className="text-xl font-semibold mb-5">
          Chat History
        </h2>

        <div className="space-y-3 overflow-y-auto">

          {
            chatHistory.map(
              (chat) => (

                <div
                  key={chat._id}
                  onClick={() =>
                    loadChat(chat._id)
                  }
                  className="
                  bg-[#08251c]
                  border
                  border-green-900
                  rounded-xl
                  p-4
                  cursor-pointer
                  hover:bg-[#0d2d23]
                  transition-all
                  "
                >

                  <div className="flex gap-3">

                    <MessageSquare
                      size={18}
                      className="text-green-400 mt-1"
                    />

                    <div>

                      <p className="text-sm font-medium">

                        {
                          chat.messages?.[0]
                            ?.content ||
                          "New Chat"
                        }

                      </p>

                      <p className="text-xs text-gray-500 mt-1">

                        {
                          chat.messages
                            ?.length || 0
                        }{" "}
                        messages

                      </p>

                    </div>

                  </div>

                </div>
              )
            )
          }

        </div>

      </div>

    </div>
  );
}