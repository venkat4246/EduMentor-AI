import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  Sparkles,
  Copy,
  Check,
  RefreshCw,
  Trash2,
  Paperclip,
  Code2,
  GraduationCap,
  BookOpen,
  Terminal,
  Calculator,
  Cpu,
  Layers,
  FileCode,
  AlertCircle,
} from "lucide-react";
import { ChatMessage } from "../../types";
import { api } from "../../services/api";
import { storage } from "../../services/storage";

interface AIAssistantProps {
  onNotify: (type: "success" | "error" | "info" | "warning", title: string, desc?: string) => void;
}

const SUGGESTED_PROMPTS = [
  {
    category: "Algorithms",
    icon: Code2,
    prompt: "Explain how Dijkstra's Algorithm works with a Min-Heap priority queue. Include Python code and time complexity analysis.",
  },
  {
    category: "Python & Systems",
    icon: Terminal,
    prompt: "How does Python's Global Interpreter Lock (GIL) affect multithreading vs. multiprocessing? Give a concrete code comparison.",
  },
  {
    category: "SQL & Databases",
    icon: Layers,
    prompt: "Write a SQL query demonstrating window functions (ROW_NUMBER, RANK, DENSE_RANK) with an example table and visual explanation.",
  },
  {
    category: "Mathematics",
    icon: Calculator,
    prompt: "Explain the geometric intuition behind Eigenvalues and Eigenvectors in Linear Algebra and why they matter in PCA.",
  },
  {
    category: "Operating Systems",
    icon: Cpu,
    prompt: "How does the OS handle page faults in virtual memory? Detail the step-by-step trap handler sequence.",
  },
  {
    category: "Exam Prep",
    icon: GraduationCap,
    prompt: "I have an exam on Object-Oriented Design in Java. Give me 3 classic polymorphic design pattern problems to solve.",
  },
];

const SUBJECTS = [
  "General",
  "Computer Science",
  "Python",
  "Java & C++",
  "SQL & Databases",
  "Mathematics",
  "Operating Systems",
  "Exam Preparation",
];

export const AIAssistant: React.FC<AIAssistantProps> = ({ onNotify }) => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => storage.getChatMessages());
  const [input, setInput] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("General");
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
    storage.saveChatMessages(messages);
  }, [messages]);

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: "msg-" + Date.now(),
      role: "user",
      content: query.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      subject: selectedSubject,
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await api.sendMessage(
        newMessages.map((m) => ({ role: m.role, content: m.content })),
        selectedSubject
      );

      const assistantMsg: ChatMessage = {
        id: "msg-" + Date.now() + "-ai",
        role: "assistant",
        content: response.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        subject: selectedSubject,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      console.error(err);
      onNotify("error", "Failed to get AI response", err.message || "Network error");
      const errorMsg: ChatMessage = {
        id: "msg-err-" + Date.now(),
        role: "assistant",
        content: `⚠️ **Error:** Unable to reach Gemini API. ${err.message || "Please check your network connection or server status."}`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerate = async () => {
    if (messages.length < 2 || loading) return;
    const lastUserIndex = [...messages].reverse().findIndex((m) => m.role === "user");
    if (lastUserIndex === -1) return;

    const actualIndex = messages.length - 1 - lastUserIndex;
    const previousMessages = messages.slice(0, actualIndex + 1);

    setMessages(previousMessages);
    setLoading(true);

    try {
      const response = await api.sendMessage(
        previousMessages.map((m) => ({ role: m.role, content: m.content })),
        selectedSubject
      );

      const assistantMsg: ChatMessage = {
        id: "msg-" + Date.now() + "-ai",
        role: "assistant",
        content: response.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        subject: selectedSubject,
      };

      setMessages((prev) => [...prev, assistantMsg]);
      onNotify("success", "Response regenerated");
    } catch (err: any) {
      onNotify("error", "Failed to regenerate", err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    storage.clearChatMessages();
    setMessages([
      {
        id: "msg-welcome-reset",
        role: "assistant",
        content: "Conversation cleared. Ready for your next collegiate question!",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
    onNotify("info", "Chat history cleared");
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    onNotify("success", "Copied to clipboard");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const text = reader.result as string;
      setInput(
        (prev) =>
          prev +
          `\n\n[Attached File Content: ${file.name}]\n\`\`\`\n${text.slice(0, 3000)}\n\`\`\`\n`
      );
      onNotify("info", `File ${file.name} attached`, "Ready to query");
    };
    reader.readAsText(file);
  };

  const renderContent = (content: string, msgId: string) => {
    // Parse markdown code blocks and paragraphs nicely
    const safeContent = content || "";
    const parts = safeContent.split(/(```[\s\S]*?```)/g);

    return (
      <div className="space-y-2 text-sm leading-relaxed">
        {parts.map((part, index) => {
          if (part.startsWith("```") && part.endsWith("```")) {
            const firstLineBreak = part.indexOf("\n");
            const lang =
              firstLineBreak !== -1 ? part.substring(3, firstLineBreak).trim() : "";
            const code =
              firstLineBreak !== -1
                ? part.substring(firstLineBreak + 1, part.length - 3)
                : part.substring(3, part.length - 3);

            return (
              <div
                key={index}
                className="my-3 rounded-xl overflow-hidden border border-slate-700 bg-slate-950/90 font-mono text-xs shadow-md"
              >
                <div className="flex items-center justify-between px-4 py-2 bg-slate-800/80 border-b border-slate-700/80 text-slate-300">
                  <div className="flex items-center gap-2">
                    <Code2 className="w-3.5 h-3.5 text-indigo-400" />
                    <span className="font-semibold text-[11px] uppercase tracking-wider">
                      {lang || "code"}
                    </span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(code, `${msgId}-code-${index}`)}
                    className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-100 hover:bg-slate-700/60 px-2 py-1 rounded transition-colors"
                  >
                    {copiedId === `${msgId}-code-${index}` ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy Code</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className="p-4 overflow-x-auto text-slate-200">
                  <code>{code}</code>
                </pre>
              </div>
            );
          }

          // Format basic markdown headers and bullet points
          const lines = part.split("\n");
          return (
            <div key={index} className="space-y-1">
              {lines.map((line, lIdx) => {
                if (line.startsWith("### ")) {
                  return (
                    <h4 key={lIdx} className="text-base font-bold text-slate-900 mt-3 mb-1">
                      {line.replace("### ", "")}
                    </h4>
                  );
                }
                if (line.startsWith("## ")) {
                  return (
                    <h3 key={lIdx} className="text-lg font-bold text-slate-900 mt-4 mb-2">
                      {line.replace("## ", "")}
                    </h3>
                  );
                }
                if (line.startsWith("- ") || line.startsWith("* ")) {
                  return (
                    <div key={lIdx} className="flex items-start gap-2 pl-2">
                      <span className="text-blue-600 font-bold">•</span>
                      <span>{line.replace(/^[-*]\s+/, "")}</span>
                    </div>
                  );
                }
                if (!line.trim()) return <div key={lIdx} className="h-1.5" />;
                return <p key={lIdx}>{line}</p>;
              })}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between px-4 sm:px-6 py-3 border-b border-slate-200 bg-white gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-slate-100 text-blue-600 border border-slate-200 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 font-['Outfit'] flex items-center gap-2">
              <span>Collegiate AI Tutor</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                Gemini 3.8 Flash
              </span>
            </h2>
            <p className="text-[11px] text-slate-500">
              Tailored for computer science, engineering & STEM collegiate courses
            </p>
          </div>
        </div>

        {/* Subject Filter & Actions */}
        <div className="flex items-center gap-2">
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="px-2.5 py-1.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-slate-900 shadow-xs"
          >
            {SUBJECTS.map((sub) => (
              <option key={sub} value={sub}>
                Focus: {sub}
              </option>
            ))}
          </select>

          <button
            onClick={handleRegenerate}
            disabled={loading || messages.length < 2}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-40 transition-colors"
            title="Regenerate Last Response"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            onClick={handleClear}
            className="p-2 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
            title="Clear Chat History"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-slate-50/50">
        {(messages || []).map((msg) => {
          const isUser = msg.role === "user";
          return (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-3xl ${isUser ? "ml-auto flex-row-reverse" : "mr-auto"}`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center text-xs font-bold ${
                  isUser
                    ? "bg-slate-900 text-white shadow-sm"
                    : "bg-slate-100 text-blue-600 border border-slate-200 shadow-sm"
                }`}
              >
                {isUser ? "You" : <Sparkles className="w-4 h-4" />}
              </div>

              {/* Message Bubble */}
              <div
                className={`group relative rounded-2xl px-5 py-3.5 shadow-sm max-w-[85%] ${
                  isUser
                    ? "bg-slate-900 text-white rounded-tr-sm"
                    : "bg-white border border-slate-200 text-slate-800 rounded-tl-sm"
                }`}
              >
                {/* Message Header info */}
                <div className={`flex items-center justify-between gap-4 mb-1.5 text-[10px] ${isUser ? "text-slate-300" : "text-slate-400"}`}>
                  <span className="font-semibold">{isUser ? "You" : "EduMentor AI"}</span>
                  <span>{msg.timestamp}</span>
                </div>

                {/* Content */}
                {renderContent(msg.content, msg.id)}

                {/* Bubble footer actions */}
                {!isUser && (
                  <div className="flex items-center gap-2 mt-3 pt-2 border-t border-slate-100 text-xs text-slate-500">
                    <button
                      onClick={() => copyToClipboard(msg.content, msg.id)}
                      className="flex items-center gap-1 hover:text-slate-900 transition-colors"
                    >
                      {copiedId === msg.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-600 font-medium">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Loading Indicator */}
        {loading && (
          <div className="flex gap-3 max-w-2xl mr-auto animate-pulse">
            <div className="w-8 h-8 rounded-xl bg-slate-100 text-blue-600 border border-slate-200 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 animate-spin" />
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200 text-xs text-slate-600 flex items-center gap-2 shadow-sm">
              <div className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
              <span>Analyzing theoretical concepts & synthesizing code explanation...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompts (visible if few messages) */}
      {messages.length <= 2 && (
        <div className="px-4 sm:px-6 py-2.5 border-t border-slate-200 bg-white">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Suggested Prompts for College Scholars:
          </p>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
            {SUGGESTED_PROMPTS.map((sp, idx) => {
              const Icon = sp.icon;
              return (
                <button
                  key={idx}
                  onClick={() => handleSend(sp.prompt)}
                  className="shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs text-slate-700 hover:text-slate-900 transition-all text-left max-w-xs truncate shadow-xs"
                >
                  <Icon className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span className="truncate">{sp.category}: {sp.prompt}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Input Form Bar */}
      <div className="p-3 sm:p-4 bg-white border-t border-slate-200">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="relative flex items-end gap-2 bg-slate-50 border border-slate-200 focus-within:border-slate-400 focus-within:bg-white rounded-2xl p-2 transition-all shadow-xs"
        >
          {/* File upload hidden input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
            accept=".txt,.py,.java,.cpp,.c,.js,.ts,.sql,.json,.md"
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-2.5 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors shrink-0"
            title="Attach code snippet or text file"
          >
            <Paperclip className="w-4 h-4" />
          </button>

          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder={`Ask a question in ${selectedSubject} (e.g., 'Derive runtime for Merge Sort', 'Debug my Python function')...`}
            rows={1}
            className="flex-1 max-h-32 min-h-[38px] py-2 bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none resize-none leading-relaxed"
          />

          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="p-2.5 rounded-xl bg-slate-900 hover:bg-black disabled:opacity-30 text-white shadow-sm transition-all shrink-0 active:scale-95"
            aria-label="Send Message"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
        <p className="text-[11px] text-slate-500 mt-2 text-center">
          Press <kbd className="px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 text-[10px] text-slate-700">Enter</kbd> to send, <kbd className="px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 text-[10px] text-slate-700">Shift + Enter</kbd> for new line.
        </p>
      </div>
    </div>
  );
};
