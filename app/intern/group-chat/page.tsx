"use client";

import { useState, useEffect, useRef } from "react";
import { FiSend } from "react-icons/fi";
import { useTheme } from "next-themes";
import Toast from "@/components/global/Toast";

interface IMessage {
  _id: string;
  message: string;
  createdAt: string;
  sender: {
    _id: string;
    fullName: string;
    email: string;
  };
}

interface IProps {
  projectId: string | null;
}

export default function GroupChat({ projectId }: IProps) {
  const { theme } = useTheme();
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type?: "success" | "error";
  } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  const user =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user") || "{}")
      : null;
  const userId = user?._id;
  const isDark = theme === "dark";

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchMessages = async () => {
    if (!projectId) return;
    try {
      const res = await fetch(`/api/project/${projectId}/messages`);
      if (!res.ok) throw new Error("Failed to load messages");
      const data = await res.json();
      setMessages(data.messages || []);
    } catch (err) {
      console.error(err);
      setToast({ message: "Failed to load messages", type: "error" });
    }
  };

  useEffect(() => {
    if (!projectId) return;
    fetchMessages();

    // const ws = new WebSocket(`wss://yourserver.com/ws/projects/${projectId}`);
    // wsRef.current = ws;
    // ws.onopen = () => console.log("WebSocket connected");
    // ws.onmessage = (event) => {
    //   const msg: IMessage = JSON.parse(event.data);
    //   setMessages((prev) => [...prev, msg]);
    // };
    // ws.onerror = (err) => console.error("WebSocket error:", err);
    // ws.onclose = () => console.log("WebSocket closed");
    // return () => ws.close();
  }, [projectId]);

  const sendMessage = async () => {
    if (!input.trim() || !projectId) return;
    setLoading(true);

    const newMessage = {
      message: input,
      sender: user,
      createdAt: new Date().toISOString(),
    };

    try {
      wsRef.current?.send(JSON.stringify(newMessage));

      await fetch(`/api/project/${projectId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMessage),
      });

      setInput("");
      setMessages((prev) => [...prev, newMessage as IMessage]);
    } catch (err) {
      console.error(err);
      setToast({ message: "Failed to send message", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") sendMessage();
  };

  if (!projectId) {
    return (
      <div
        className={`flex flex-col h-full max-h-[90vh] w-full mx-auto rounded-xl shadow-lg border overflow-hidden transition-colors ${
          isDark
            ? "bg-gray-900 border-gray-700 text-gray-200"
            : "bg-white border-gray-200 text-gray-800"
        }`}
      >
        <div
          className={`p-4 border-b ${
            isDark
              ? "border-gray-700 bg-gray-800"
              : "border-gray-200 bg-gray-50"
          }`}
        >
          <h2
            className={`${
              isDark ? "text-gray-100" : "text-gray-800"
            } text-lg font-semibold`}
          >
            Group Chat
          </h2>
        </div>

        <div className="flex-1 p-4 flex items-center justify-center">
          <p className="text-center text-lg">
            No Group Available
          </p>
        </div>

        <div
          className={`flex p-4 border-t ${
            isDark
              ? "border-gray-700 bg-gray-800"
              : "border-gray-200 bg-gray-50"
          }`}
        >
          <input
            type="text"
            placeholder="Type your message..."
            disabled
            className={`flex-1 border rounded-l-lg px-4 py-2 cursor-not-allowed ${
              isDark
                ? "dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                : "bg-white border-gray-300 text-gray-900"
            }`}
          />
          <button
            disabled
            className="bg-blue-600 opacity-50 text-white px-4 py-2 rounded-r-lg flex items-center justify-center cursor-not-allowed"
          >
            <FiSend />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col h-full max-h-[90vh] w-full mx-auto rounded-xl shadow-lg border overflow-hidden transition-colors ${
        isDark ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"
      }`}
    >
      <div
        className={`p-4 border-b ${
          isDark ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-gray-50"
        }`}
      >
        <h2
          className={`${
            isDark ? "text-gray-100" : "text-gray-800"
          } text-lg font-semibold`}
        >
          Group Chat
        </h2>
      </div>

      <div className="flex-1 p-4 overflow-y-auto space-y-3">
        {messages.length === 0 && (
          <p className={`${isDark ? "text-gray-400" : "text-gray-500"}`}>
            No messages yet
          </p>
        )}
        {messages.map((msg, idx) => {
          const isCurrentUser = msg.sender._id === userId;
          return (
            <div
              key={idx}
              className={`flex ${
                isCurrentUser ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`px-4 py-2 rounded-lg max-w-[80%] break-words ${
                  isCurrentUser
                    ? "bg-blue-600 text-white rounded-br-none"
                    : `${
                        isDark
                          ? "bg-gray-700 text-gray-100 rounded-bl-none"
                          : "bg-gray-200 text-gray-900 rounded-bl-none"
                      }`
                }`}
              >
                <p className="text-sm font-semibold mb-1">
                  {isCurrentUser ? "You" : msg.sender.fullName}
                </p>
                <p>{msg.message}</p>
                <span className="text-xs text-gray-400 block mt-1">
                  {new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef}></div>
      </div>

      <div
        className={`flex p-4 border-t ${
          isDark ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-gray-50"
        }`}
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          className={`flex-1 border rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            isDark
              ? "dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
              : "bg-white border-gray-300 text-gray-900"
          }`}
          disabled={loading}
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r-lg flex items-center justify-center"
        >
          {loading ? "..." : <FiSend />}
        </button>
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
