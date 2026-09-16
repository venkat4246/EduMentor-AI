import { Request, Response } from "express";
import { generateContentWithFallback, cleanErrorMessage } from "../gemini.js";

export async function handleGenerateStudyPlan(req: Request, res: Response) {
  try {
    const {
      subjects = ["Data Structures & Algorithms", "Operating Systems"],
      examDate = "in 3 weeks",
      dailyHours = 4,
      difficulty = "Intermediate",
      learningGoals = "Score an A and master practical implementations",
      availability = "Evenings from 6 PM to 10 PM",
    } = req.body;

    const apiKey = process.env.GEMINI_API_KEY;

    const getFallbackStudyPlan = () => {
      const sampleTasks = [
        {
          id: "task-1",
          day: "Monday",
          subject: subjects[0] || "Data Structures",
          topic: "Binary Search Trees & Balancing (AVL)",
          durationMinutes: 90,
          priority: "High",
          completed: false,
          tips: "Implement left-rotate and right-rotate functions on paper first.",
        },
        {
          id: "task-2",
          day: "Monday",
          subject: subjects[1] || "Operating Systems",
          topic: "Process Synchronization & Semaphores",
          durationMinutes: 90,
          priority: "High",
          completed: false,
          tips: "Solve the Producer-Consumer problem using POSIX semaphores.",
        },
        {
          id: "task-3",
          day: "Tuesday",
          subject: subjects[0] || "Data Structures",
          topic: "Graph Traversals (BFS, DFS, Dijkstra)",
          durationMinutes: 120,
          priority: "High",
          completed: false,
          tips: "Trace priority queue states during shortest path computation.",
        },
        {
          id: "task-4",
          day: "Wednesday",
          subject: subjects[1] || "Operating Systems",
          topic: "Virtual Memory & Page Replacement Algorithms",
          durationMinutes: 90,
          priority: "Medium",
          completed: false,
          tips: "Compare LRU, FIFO, and Optimal page replacement.",
        },
        {
          id: "task-5",
          day: "Thursday",
          subject: subjects[0] || "Data Structures",
          topic: "Dynamic Programming Memoization vs Tabulation",
          durationMinutes: 120,
          priority: "High",
          completed: false,
          tips: "Draw the sub-problem state DAG before coding the recurrence.",
        },
        {
          id: "task-6",
          day: "Friday",
          subject: subjects[1] || "Operating Systems",
          topic: "File Systems, Inodes & Journaling",
          durationMinutes: 90,
          priority: "Medium",
          completed: false,
          tips: "Understand crash consistency and write-ahead logging.",
        },
        {
          id: "task-7",
          day: "Saturday",
          subject: "Comprehensive Review",
          topic: "Full-Length Timed Practice Exam & Code Review",
          durationMinutes: 180,
          priority: "High",
          completed: false,
          tips: "Simulate exact exam constraints without external IDE assistance.",
        },
      ];

      return {
        planTitle: `Personalized Collegiate Mastery Plan: ${subjects.join(" & ")}`,
        overview: `A focused, balanced curriculum designed to maximize retention for exams ${examDate}. Budgeting ${dailyHours} hours/day ensures complete conceptual coverage and hands-on coding drills without burnout.`,
        weeklyHours: Number(dailyHours) * 6,
        priorityTasks: sampleTasks,
        dailyBreakdown: [
          { day: "Monday", focus: "Data Structures & Process Concurrency", plannedHours: Number(dailyHours) },
          { day: "Tuesday", focus: "Graph Algorithms & Shortest Path", plannedHours: Number(dailyHours) },
          { day: "Wednesday", focus: "Virtual Memory & Operating System Invariants", plannedHours: Number(dailyHours) },
          { day: "Thursday", focus: "Dynamic Programming State Transitions", plannedHours: Number(dailyHours) },
          { day: "Friday", focus: "File Systems & I/O Subsystems", plannedHours: Number(dailyHours) },
          { day: "Saturday", focus: "Synthesis Mock Exam & Timed Practice", plannedHours: Number(dailyHours) },
          { day: "Sunday", focus: "Light Active Recall & Weekly Reset", plannedHours: Math.max(1, Number(dailyHours) - 2) },
        ],
        revisionSchedule: [
          "Day 3: Active recall on Monday's AVL and Semaphore concepts (Spaced repetition interval 1).",
          "Day 7: Cumulative weekly quiz covering graph algorithms and memory management.",
          "Final 72 Hours: Review flashcards, canonical code templates, and high-frequency exam questions.",
        ],
        breakRecommendations: [
          "Use the 50/10 Pomodoro rule: 50 minutes high-focus, 10 minutes screen-free physical break.",
          "Stay hydrated: keep a water bottle at your study station.",
          "Avoid social media during quick breaks; take a light stretch or walk.",
        ],
      };
    };

    if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
      return res.json(getFallbackStudyPlan());
    }

    const prompt = `You are EduMentor AI's master academic schedule optimizer.
Create a structured, realistic, high-yield study plan based on:
- Subjects: ${JSON.stringify(subjects)}
- Exam Date/Timeline: ${examDate}
- Daily Study Budget: ${dailyHours} hours/day
- Difficulty Level: ${difficulty}
- Learning Goals: ${learningGoals}
- Availability Window: ${availability}

Return strict JSON with the following structure:
{
  "planTitle": "string",
  "overview": "string",
  "weeklyHours": number,
  "priorityTasks": [
    {
      "id": "task-1",
      "day": "Monday | Tuesday | ...",
      "subject": "string",
      "topic": "string",
      "durationMinutes": number,
      "priority": "High" | "Medium" | "Low",
      "completed": false,
      "tips": "string"
    }
  ],
  "dailyBreakdown": [
    { "day": "Monday", "focus": "string", "plannedHours": number }
  ],
  "revisionSchedule": [
    "string"
  ],
  "breakRecommendations": [
    "string"
  ]
}`;

    try {
      const response = await generateContentWithFallback({
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.5,
        },
      });

      let rawText = response.text || "{}";
      rawText = rawText.trim();
      if (rawText.startsWith("```json")) {
        rawText = rawText.replace(/^```json\n?/, "").replace(/\n?```$/, "");
      } else if (rawText.startsWith("```")) {
        rawText = rawText.replace(/^```\n?/, "").replace(/\n?```$/, "");
      }

      const parsed = JSON.parse(rawText);
      return res.json(parsed);
    } catch (fallbackError: any) {
      console.log("Study plan using high-availability pattern:", cleanErrorMessage(fallbackError));
      return res.json(getFallbackStudyPlan());
    }
  } catch (error: any) {
    const cleanMsg = cleanErrorMessage(error);
    console.error("Study Plan error:", cleanMsg);
    return res.status(500).json({
      error: cleanMsg,
    });
  }
}
