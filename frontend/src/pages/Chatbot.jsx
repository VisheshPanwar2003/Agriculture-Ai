import { useState, useRef, useEffect, useCallback, useMemo } from "react";

import api from "../services/api";
import { getPreferences } from "../services/preferences";
import { useTranslation } from "../services/i18n";

import ReactMarkdown from "react-markdown";

import {
  Send,
  Bot,
  User,
  Plus,
  MessageSquare,
} from "lucide-react";

export default function Chatbot() {
  const { t } = useTranslation();

  const [message, setMessage] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [messages, setMessages] =
    useState([]);

  const [chatHistory, setChatHistory] =
    useState([]);

  const [historyOffset, setHistoryOffset] = useState(0);
  const [historyHasMore, setHistoryHasMore] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);

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

  const authHeaders = useMemo(() => ({

    headers: {

      Authorization:
        `Bearer ${token}`
    }
  }), [token]);

  // AUTO SCROLL

  useEffect(() => {

    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });

  }, [messages]);

  // CREATE CHAT + LOAD HISTORY

  const initializeChat = useCallback(async () => {
    const historyRes = await api.get(
      "/chatbot/history?offset=0&limit=25",
      authHeaders
    );
    return historyRes.data;
  }, [authHeaders]);

  // INITIALIZE CHAT
  useEffect(() => {
    let active = true;
    initializeChat()
      .then((history) => {
        if (!active) return;
        setChatHistory(history.chats || []);
        setHistoryOffset(history.offset || 0);
        setHistoryHasMore(Boolean(history.hasMore));
        setChatId(null);
        setMessages([
          {
            role: "assistant",
            content:
              t("# Hello 👋\nI am **AgriSense AI**. Ask me anything about crops, diseases, fertilizers, irrigation, or farming."),
          },
        ]);
      })
      .catch((error) => console.error(error));

    return () => {
      active = false;
    };
  }, [initializeChat, t]);

  // SEND MESSAGE

  const sendMessage = async () => {

    if (
      !message.trim() ||
      loading
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

      let activeChatId = chatId;
      if (!activeChatId) {
        const newChatRes = await api.post(
          "/chatbot/new",
          {},
          authHeaders
        );
        activeChatId = newChatRes.data.chat_id;
        setChatId(activeChatId);
      }

      const response =
        await api.post(

          "/chatbot/chat",

          {

            chat_id: activeChatId,

            message:
              currentMessage,
            language: getPreferences().language,
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

          "/chatbot/history?offset=0&limit=25",

          authHeaders
        );

      setChatHistory(historyRes.data.chats || []);
      setHistoryOffset(historyRes.data.offset || 0);
      setHistoryHasMore(Boolean(historyRes.data.hasMore));

    } catch (error) {

      console.error(error);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",

          content:
            t("Something went wrong. Please try again."),
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
              t("# Hello 👋\nI am **AgriSense AI**. Ask me anything about crops, diseases, fertilizers, irrigation, or farming."),
          },
        ]);

        const historyRes =
          await api.get(

            "/chatbot/history?offset=0&limit=25",

            authHeaders
          );

        setChatHistory(historyRes.data.chats || []);
        setHistoryOffset(historyRes.data.offset || 0);
        setHistoryHasMore(Boolean(historyRes.data.hasMore));

      } catch (error) {

        console.error(error);
      }
    };

  // ENTER TO SEND

  const loadMoreHistory = async () => {
    if (historyLoading || !historyHasMore) return;
    const nextOffset = historyOffset + 25;
    setHistoryLoading(true);
    try {
      const response = await api.get(
        `/chatbot/history?offset=${nextOffset}&limit=25`,
        authHeaders
      );
      setChatHistory((current) => [...current, ...(response.data.chats || [])]);
      setHistoryOffset(response.data.offset || nextOffset);
      setHistoryHasMore(Boolean(response.data.hasMore));
    } catch (error) {
      console.error(error);
    } finally {
      setHistoryLoading(false);
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

    <div className="flex min-h-[calc(100dvh-150px)] flex-col gap-4 lg:h-full lg:min-h-0 lg:flex-row lg:gap-6">

      {/* CHAT SECTION */}

      <div
        className="
        order-1
        min-h-[460px]
        lg:min-h-0
        flex-1
        bg-[#051a14]
        border
        rounded-2xl
        border-white/[0.07]
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

                          code({ className, children, ...props }) {
                            return (
                              <code
                                className={`${className || ""} bg-black/40 px-2 py-1 rounded text-green-300`}
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

                  {t("Thinking...")}

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
              placeholder={t("Ask anything about farming...")}
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
        order-2
        w-full
        lg:w-[320px]
        bg-[#051a14]
        border
        border-green-900
        rounded-2xl
        p-5
        flex
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

          {t("New Chat")}

        </button>

        <h2 className="text-xl font-semibold mb-5">
          {t("Chat History")}
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

                        {chat.messageCount || 0}{" "}
                        messages

                      </p>

                    </div>

                  </div>

                </div>
              )
          )
          }

          {historyHasMore && (
            <button
              type="button"
              onClick={loadMoreHistory}
              disabled={historyLoading}
              className="w-full rounded-xl border border-green-900 px-4 py-3 text-sm text-green-200 hover:bg-green-950 disabled:opacity-50"
            >
              {historyLoading ? t("Loading…") : t("Load older chats")}
            </button>
          )}

        </div>

      </div>

    </div>
  );
}
