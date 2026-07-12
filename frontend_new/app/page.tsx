"use client";
import Link from "next/dist/client/link";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { SendIcon } from "./components/HomeIcons";
import {
  page,
  chatArea,
  botBubble,
  userBubble,
  inputBar,
  inputEl,
  sendBtn,
  emptyText,
  emptySubText,
  messageText,
} from "./styles/styleclass";
import { useTheme } from "@/context/context";

interface Message {
  id: number;
  role: "bot" | "user";
  text: string;
  source?: string;
  page_nos?: (number | string)[];
}
interface Chat {
  id: number;
  name: string;
}

export default function Home() {
  const { dark, setDark } = useTheme();
  const [IsThinking, setIsThinking] = useState(false);
  const [chats, setChats] = useState<Chat[]>([
    { id: 1, name: "Introduction to ML" },
    { id: 2, name: "Chapter 3 Notes" },
    { id: 3, name: "Exam Prep" },
  ]);
  const [message, setMessage] = useState("");
  const initialMessage = `# Hey, I'm BioMate

Your AI study buddy for the A/L Biology syllabus. Ask me anything and I'll pull answers straight from your syllabus content.

### Try asking about:

* **Cell Biology & Biochemistry**
* **Plant Form & Function**
* **Animal Form & Function**
* **Genetics, Molecular Biology & Biotechnology**
* **Ecology & Environmental Biology**

*Type a question below to get started.*`;

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: "bot",
      text: initialMessage,
    },
  ]);
  const chatListEndRef = useRef<HTMLDivElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    chatListEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });
  }, [chats.length]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });
  }, [messages.length]);

  const handleSend = async () => {
    if (!message.trim()) return;
    setIsThinking(true);
    const currentMessage = message;
    setMessage("");
    setMessages((p) => [
      ...p,
      { id: Date.now(), role: "user", text: currentMessage },
    ]);
    console.log("Sending message:", currentMessage);

    try {
      const response = await fetch("http://localhost:8000/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: currentMessage,
        }),
      });
      const data = await response.json();

      setMessages((p) => [
        ...p,
        {
          id: Date.now(),
          role: "bot",
          text: data.answer,
          source: data.source,
          page_nos: data.pages,
        },
      ]);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((p) => [
        ...p,
        {
          id: Date.now(),
          role: "bot",
          text: "Sorry, something went wrong. Please try again.",
        },
      ]);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className={`${page(dark)} flex flex-col min-h-0 flex-1`}>
      {/* ── BODY ──────────────────────────────────────────────────── */}
      <div className="flex flex-1 min-h-0 flex-col overflow-y-auto md:flex-row md:overflow-hidden">
        {/* CHAT AREA */}
        <main
          className={`${chatArea(dark)} order-1 md:order-2 flex flex-col min-h-0 flex-1`}
        >
          <div className="flex-1 overflow-y-auto px-4 sm:px-6 md:px-8 py-4 md:py-7 flex flex-col gap-5">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full gap-3">
                <span className="text-5xl">💬</span>
                <p className={`text-base font-semibold ${emptyText}`}>
                  Start a conversation!
                </p>
                <p className={`text-sm ${emptySubText}`}>
                  Ask anything about your PDF
                </p>
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex items-end gap-2.5 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                >
                  <div
                    className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-xs font-bold text-white ${msg.role === "bot" ? "bg-emerald-500" : "bg-gray-400"}`}
                  >
                    {msg.role === "bot" ? "B" : "U"}
                  </div>
                  <div
                    className={
                      msg.role === "bot" ? botBubble(dark) : userBubble(dark)
                    }
                  >
                    <div className={messageText(dark)}>
                      <ReactMarkdown>{msg.text}</ReactMarkdown>
                    </div>

                    {msg.source != "unknown" && msg.page_nos && (
                      <div className="text-xs text-gray-500 mt-1">
                        <br />
                        Source : {msg.source} , Pages :{" "}
                        {msg.page_nos.join(", ")}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
            {IsThinking && (
              <div className="flex items-end gap-2.5">
                <div className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-xs font-bold text-white bg-emerald-500">
                  B
                </div>
                <div className={botBubble(dark)}>
                  <ReactMarkdown>Searching...</ReactMarkdown>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className={`${inputBar(dark)} sticky bottom-0 shrink-0`}>
            <div className="flex gap-2 sm:gap-3 items-center max-w-3xl mx-auto">
              <input
                className={inputEl(dark)}
                placeholder="Ask something about your PDF..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
              />
              <button className={sendBtn(dark)} onClick={handleSend}>
                <SendIcon />
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
