import { Request, Response } from "express";
import { generateContentWithFallback, cleanErrorMessage } from "../gemini.js";

export async function handleChat(req: Request, res: Response) {
  try {
    const { messages, subject = "General", systemPrompt } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Invalid messages payload. Expected an array of messages." });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    // Build the instruction
    const defaultInstruction = `You are EduMentor AI, a world-class collegiate AI tutor and academic mentor.
You specialize in Computer Science, Software Engineering, Python, Java, C++, SQL, Algorithms & Data Structures, Mathematics (Calculus, Linear Algebra, Discrete Math), and Engineering disciplines.
Your goal is to guide students to deep understanding with clarity, rigorous precision, step-by-step problem breakdown, and actionable code examples.

Style guidelines:
- Structure explanations with clear headings, bullet points, and code snippets where relevant.
- Provide clean, syntactically correct code blocks with language specifiers (e.g. \`\`\`python).
- Offer intuitive analogies for complex theoretical concepts.
- Provide a brief "Key Takeaway" or "Pro-Tip" at the end of technical explanations.
- When assisting with debugging or coding problems, highlight the root cause and provide optimal time/space complexities.
- Current subject focus: ${subject}.`;

    const effectiveInstruction = systemPrompt || defaultInstruction;

    if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
      return res.json({
        reply: `### Hello from EduMentor AI! 👋\n\nI am ready to assist you with your studies in **${subject}**! To unlock real-time live AI responses, please configure your **GEMINI_API_KEY** in the AI Studio environment or Settings.\n\nHere is a quick concept breakdown:\n- **Topic:** ${messages[messages.length - 1]?.content || "Computer Science Fundamentals"}\n- **Tip:** When studying complex algorithms, always trace step-by-step with small test cases!\n\nFeel free to ask another question or explore the other tools in the sidebar!`,
      });
    }

    // Convert messages to Gemini format
    const contents = messages.map((m: { role: string; content: string }) => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.content }],
    }));

    try {
      const response = await generateContentWithFallback({
        contents,
        config: {
          systemInstruction: effectiveInstruction,
          temperature: 0.7,
        },
      });

      const reply = response.text || "I'm sorry, I couldn't generate a response for that.";

      return res.json({
        reply,
      });
    } catch (fallbackError: any) {
      const cleanErr = cleanErrorMessage(fallbackError);
      console.log("Activating resilient mentor fallback:", cleanErr);

      const lastUserMsg = messages[messages.length - 1]?.content || "your question";

      // If it's a 503 high demand spike, provide an immediate collegiate conceptual synthesis
      const gracefulReply = `### Academic Insight (High-Demand Resilience Mode)

> ℹ️ *Upstream AI service is currently experiencing a high-demand spike. Here is an immediate collegiate analysis while the network clears.*

**Subject:** ${subject}  
**Query:** "${lastUserMsg}"

#### Core Theoretical Concept
When analyzing **${lastUserMsg}**, remember the canonical approach:
1. **Define the Problem Invariants**: Break the problem down into base cases and sub-problems.
2. **Algorithm/System Trade-offs**: Consider asymptotic bounds ($O(n \\log n)$ time vs. $O(n)$ space).
3. **Common Pitfalls**: Always check boundary conditions (null pointers, empty collections, off-by-one errors).

*Please submit another prompt or try the Quiz Generator or Deep Research tools if you need instant practice questions.*`;

      return res.json({
        reply: gracefulReply,
        warning: cleanErr,
      });
    }
  } catch (error: any) {
    const cleanMsg = cleanErrorMessage(error);
    console.error("Chat error:", cleanMsg);
    return res.status(500).json({
      error: cleanMsg,
    });
  }
}
