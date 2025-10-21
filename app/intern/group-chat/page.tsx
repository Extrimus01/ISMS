"use client";

import { useEffect, useState, useRef } from "react";
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
  projectId: string;
}

export default function GroupChat({ projectId }: IProps) {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [toast, setToast] = useState<{ message: string; type?: "success" | "error" } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const user = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("user") || "{}") : null;
  const myId = user?._id;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchMessages = async () => {
    if (!projectId) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/intern/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ projectId }),
      });
      const data = await res.json();
      setMessages(Array.isArray(data) ? data : []);
      scrollToBottom();
    } catch (err) {
      console.error(err);
      setToast({ message: "Failed to load messages", type: "error" });
    }
  };

  const sendMessage = async () => {
    if (!message.trim() || !projectId) return;
    setSending(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/intern/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ projectId, message: message.trim() }),
      });
      const data = await res.json();
      setMessages(Array.isArray(data) ? data : []);
      setMessage("");
      scrollToBottom();
    } catch (err) {
      console.error(err);
      setToast({ message: "Failed to send message", type: "error" });
    } finally {
      setSending(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [projectId]);

  return (
    <div className="p-6 flex flex-col h-full max-h-[80vh]">
      <h2 className="text-xl font-semibold mb-4">Project Group Chat</h2>

      <div className="flex-1 overflow-y-auto border rounded p-4 space-y-2 bg-gray-50">
        {messages.length === 0 ? (
          <p className="text-gray-500 text-sm text-center mt-2">No messages yet.</p>
        ) : (
          messages.map((msg) => {
            const isMine = msg.sender._id === myId;
            return (
              <div
                key={msg._id}
                className={`flex ${isMine ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[70%] px-4 py-2 rounded-lg break-words ${
                    isMine ? "bg-blue-600 text-white rounded-br-none" : "bg-gray-200 text-black rounded-bl-none"
                  }`}
                >
                  {!isMine && <span className="font-semibold">{msg.sender.fullName}: </span>}
                  <span>{msg.message}</span>
                  <div className="text-xs text-gray-400 text-right mt-1">
                    {new Date(msg.createdAt).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="mt-4 flex gap-2 flex-wrap">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 border rounded px-3 py-2"
          onKeyDown={(e) => {
            if (e.key === "Enter") sendMessage();
          }}
        />
        <button
          onClick={sendMessage}
          disabled={sending || !message.trim()}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {sending ? "Sending..." : "Send"}
        </button>
      </div>

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </div>
  );
}
