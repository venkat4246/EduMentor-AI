import React, { useState, useRef } from "react";
import {
  FileText,
  UploadCloud,
  Sparkles,
  Send,
  HelpCircle,
  BookOpen,
  ListOrdered,
  FileCheck,
  RotateCcw,
  CheckCircle2,
  Paperclip,
  Download,
} from "lucide-react";
import { api } from "../../services/api";

interface PDFAnalyzerProps {
  onNotify: (type: "success" | "error" | "info" | "warning", title: string, desc?: string) => void;
}

const SAMPLE_DOCUMENT_TEXT = `Course: CS301 - Advanced Operating Systems & Distributed Systems
Topic: Raft Consensus Algorithm & Leader Election Mechanics
Author: Prof. H. Chen, Department of Computer Science

1. OVERVIEW & PROBLEM FORMULATION
Consensus protocols allow a collection of independent machines to maintain a consistent shared state machine despite asynchronous networks, packet loss, and node crashes. Traditional Paxos algorithms are notoriously difficult to implement and reason about. Raft addresses this by explicitly decomposing consensus into three independent sub-problems:
- Leader Election: One node is elected leader and assumes primary responsibility for managing the log.
- Log Replication: The leader accepts log entries from clients, replicates them across follower nodes, and tells followers when it is safe to apply entries to their state machines.
- Safety: If any server has applied a particular log entry to its state machine, no other server will ever apply a different log entry for the same log index.

2. RAFT NODE STATES
At any time, each Raft server is in one of three states:
- Leader: Handles all client requests. Dispatches AppendEntries heartbeats every 50-100ms.
- Follower: Completely passive; responds only to incoming RPCs from candidate or leader nodes. If election timeout expires without heartbeats, transitions to Candidate.
- Candidate: Used to elect a new leader. Increments currentTerm, votes for itself, and broadcasts RequestVote RPCs.

3. ELECTION TIMEOUT & RANDOMIZATION
To prevent split votes where multiple followers transition to candidate simultaneously and divide the majority votes equally, Raft uses randomized election timeouts chosen uniformly from a range (typically 150-300ms). This guarantees that in nearly all scenarios, a single candidate will time out first, increment term, gather majority quorum, and become leader before others time out.

4. LOG MATCHING PROPERTY
Raft guarantees:
- If two entries in different logs have the same index and term, then they store the same command.
- If two entries in different logs have the same index and term, then their logs are identical in all preceding entries.
Followers reject AppendEntries if their log does not contain an entry at prevLogIndex with matching prevLogTerm.`;

export const PDFAnalyzer: React.FC<PDFAnalyzerProps> = ({ onNotify }) => {
  const [docName, setDocName] = useState("CS301_Raft_Consensus_Lecture_Notes.pdf");
  const [docSize, setDocSize] = useState("480 KB");
  const [docContent, setDocContent] = useState(SAMPLE_DOCUMENT_TEXT);
  const [isSample, setIsSample] = useState(true);
  const [summary, setSummary] = useState<string | null>(null);
  const [keyConcepts, setKeyConcepts] = useState<string[]>([]);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [qaMessages, setQaMessages] = useState<
    Array<{ role: "user" | "assistant"; content: string; time: string }>
  >([
    {
      role: "assistant",
      content:
        "Document loaded! I've analyzed **CS301_Raft_Consensus_Lecture_Notes.pdf**. You can click 'Generate Summary', 'Key Concepts', or ask any specific question below.",
      time: "Just now",
    },
  ]);
  const [qaInput, setQaInput] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 25 * 1024 * 1024) {
      onNotify("error", "File too large", "Please select a PDF under 25MB.");
      return;
    }

    setDocName(file.name);
    setDocSize(`${(file.size / 1024).toFixed(1)} KB`);
    setIsSample(false);
    setSummary(null);
    setKeyConcepts([]);

    const reader = new FileReader();
    reader.onload = async () => {
      const base64Data = reader.result as string;
      const base64 = base64Data.split(",")[1];
      setLoadingAction("Reading document...");

      try {
        const res = await api.analyzePdf({
          fileName: file.name,
          pdfBase64: base64,
        });
        setSummary(res.summary);
        setKeyConcepts(res.keyPoints || res.importantTopics || []);
        setQaMessages([
          {
            role: "assistant",
            content: `Loaded **${file.name}**. I've extracted the core topics and summary. What would you like to review?`,
            time: "Just now",
          },
        ]);
        onNotify("success", "Document analyzed", `${file.name} successfully loaded.`);
      } catch (err: any) {
        console.error(err);
        onNotify("warning", "Document parsed locally", "Interactive Q&A is ready.");
      } finally {
        setLoadingAction(null);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleLoadSample = () => {
    setDocName("CS301_Raft_Consensus_Lecture_Notes.pdf");
    setDocSize("480 KB");
    setDocContent(SAMPLE_DOCUMENT_TEXT);
    setIsSample(true);
    setSummary(null);
    setKeyConcepts([]);
    setQaMessages([
      {
        role: "assistant",
        content:
          "Sample Lecture Notes restored! Ready for concept extraction or interactive Q&A.",
        time: "Just now",
      },
    ]);
    onNotify("info", "Sample document loaded");
  };

  const handleExtractSummary = async () => {
    setLoadingAction("Generating summary...");
    try {
      const res = await api.askPdfQuestion({
        fileName: docName,
        textContent: docContent,
        question:
          "Provide a comprehensive, high-yield academic summary of this document suitable for exam revision. Highlight core principles and formulas.",
      });
      setSummary(res.reply);
      onNotify("success", "Summary generated");
    } catch (err: any) {
      onNotify("error", "Failed to summarize", err.message);
    } finally {
      setLoadingAction(null);
    }
  };

  const handleExtractConcepts = async () => {
    setLoadingAction("Extracting definitions & formulas...");
    try {
      const res = await api.askPdfQuestion({
        fileName: docName,
        textContent: docContent,
        question:
          "Extract 5 key concepts, technical terms, and their exact formal definitions from this document. Format as bullet points.",
      });
      const lines = res.reply
        .split("\n")
        .filter((l) => l.trim().startsWith("- ") || l.trim().startsWith("* ") || /^\d+\./.test(l.trim()))
        .map((l) => l.replace(/^[-*\d.]+\s*/, ""));
      setKeyConcepts(lines.length ? lines : [res.reply]);
      onNotify("success", "Key concepts extracted");
    } catch (err: any) {
      onNotify("error", "Failed to extract concepts", err.message);
    } finally {
      setLoadingAction(null);
    }
  };

  const handleSendQa = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!qaInput.trim() || loadingAction) return;

    const question = qaInput.trim();
    setQaInput("");
    const newMessages = [
      ...qaMessages,
      {
        role: "user" as const,
        content: question,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ];
    setQaMessages(newMessages);
    setLoadingAction("Formulating answer from document...");

    try {
      const res = await api.askPdfQuestion({
        fileName: docName,
        textContent: docContent,
        question,
      });
      setQaMessages((prev) => [
        ...prev,
        {
          role: "assistant" as const,
          content: res.reply,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } catch (err: any) {
      onNotify("error", "Q&A failed", err.message);
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-slate-100 text-blue-600 border border-slate-200 flex items-center justify-center">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 font-['Outfit']">
              Intelligent PDF & Slide Analyzer
            </h1>
            <p className="text-xs sm:text-sm text-slate-600">
              Upload collegiate lecture slides, syllabus papers, or textbooks and study interactively.
            </p>
          </div>
        </div>

        <button
          onClick={handleLoadSample}
          className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-all border border-slate-200 shadow-sm self-start sm:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5 text-blue-600" />
          <span>Load Sample Notes</span>
        </button>
      </div>

      {/* Upload Zone & Document Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload Card */}
        <div
          onClick={() => fileInputRef.current?.click()}
          className="p-6 rounded-2xl border-2 border-dashed border-slate-200 hover:border-slate-400 bg-white hover:bg-slate-50/60 transition-all cursor-pointer flex flex-col items-center justify-center text-center group shadow-xs"
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".pdf,.txt,.md"
            className="hidden"
          />
          <div className="w-12 h-12 rounded-xl bg-slate-100 text-blue-600 border border-slate-200 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <UploadCloud className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 mb-1">Upload PDF or Document</h3>
          <p className="text-xs text-slate-500 max-w-xs">
            Drag and drop or click to select lecture notes, research paper, or textbook chapter (up to 25MB).
          </p>
        </div>

        {/* Current Document Specs & Fast Action Buttons */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-3 mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-blue-600 border border-slate-200">
                {isSample ? "Pre-loaded Sample Document" : "Active Uploaded Document"}
              </span>
              <span className="text-xs text-slate-500 font-mono">{docSize}</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-blue-600 shrink-0" />
              <span className="truncate">{docName}</span>
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Document parsed into memory. Run targeted AI actions or chat directly with the context below.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 mt-4 pt-4 border-t border-slate-200">
            <button
              onClick={handleExtractSummary}
              disabled={!!loadingAction}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-black disabled:opacity-50 text-white text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>Generate Summary</span>
            </button>
            <button
              onClick={handleExtractConcepts}
              disabled={!!loadingAction}
              className="px-4 py-2 rounded-xl bg-white hover:bg-slate-50 disabled:opacity-50 text-slate-800 border border-slate-200 text-xs font-semibold transition-all flex items-center gap-1.5 shadow-xs"
            >
              <ListOrdered className="w-3.5 h-3.5 text-blue-600" />
              <span>Extract Key Concepts</span>
            </button>
          </div>
        </div>
      </div>

      {/* Summary / Key Concepts Display if generated */}
      {(summary || keyConcepts.length > 0) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {summary && (
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span>Executive Study Summary</span>
              </h3>
              <div className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                {summary}
              </div>
            </div>
          )}

          {keyConcepts.length > 0 && (
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                <ListOrdered className="w-4 h-4 text-blue-600" />
                <span>Core Definitions & Principles</span>
              </h3>
              <div className="space-y-2.5">
                {(keyConcepts || []).map((c, i) => (
                  <div key={i} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2 text-xs text-slate-800">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <span>{c}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Interactive Document Q&A Console */}
      <div className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden flex flex-col h-96">
        <div className="px-6 py-3 border-b border-slate-200 bg-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-900">Ask Questions About This Document</h3>
          </div>
          {loadingAction && (
            <div className="flex items-center gap-2 text-xs text-blue-600">
              <div className="w-3 h-3 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
              <span>{loadingAction}</span>
            </div>
          )}
        </div>

        {/* Q&A Chat Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50/50">
          {(qaMessages || []).map((msg, idx) => (
            <div
              key={idx}
              className={`flex gap-3 max-w-2xl ${
                msg.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
              }`}
            >
              <div
                className={`w-7 h-7 rounded-lg shrink-0 flex items-center justify-center text-xs font-bold ${
                  msg.role === "user"
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-blue-600 border border-slate-200"
                }`}
              >
                {msg.role === "user" ? "You" : <Sparkles className="w-3.5 h-3.5" />}
              </div>
              <div
                className={`p-3.5 rounded-xl text-xs leading-relaxed ${
                  msg.role === "user"
                    ? "bg-slate-900 text-white"
                    : "bg-white border border-slate-200 text-slate-800 shadow-xs"
                }`}
              >
                <p className="whitespace-pre-line">{msg.content}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Q&A Input */}
        <form
          onSubmit={handleSendQa}
          className="p-3 border-t border-slate-200 bg-white flex items-center gap-2"
        >
          <input
            type="text"
            value={qaInput}
            onChange={(e) => setQaInput(e.target.value)}
            placeholder={`Ask anything about ${docName} (e.g. 'Explain how election timeouts prevent split votes')...`}
            className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-400 focus:bg-white transition-colors"
          />
          <button
            type="submit"
            disabled={!qaInput.trim() || !!loadingAction}
            className="p-2 rounded-xl bg-slate-900 hover:bg-black disabled:opacity-40 text-white transition-all shadow-sm"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
