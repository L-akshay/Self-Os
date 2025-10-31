import { GoogleGenerativeAI } from "@google/generative-ai";


const ai = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
export async function getQuote() {
  const model = ai.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `
  Give me only one short motivational quote in a single sentence. 
  ⚠️ Do NOT explain anything, no markdown, no list, no headings.
  Just give the quote only, raw text. No other response.
`;


  const result = await model.generateContent(prompt);
  const response = result.response;

  return response.text().split('.')[0] + '.';
 
}

export async function getDailyvibe(){
  const model=ai.getGenerativeModel({model:"gemini-2.5-flash"});
  const prompt = `Give me a short, uplifting one-line message to set a positive tone for the day. 
  Make it encouraging and suitable for a productivity app. Respond with only the line — no explanation, no quotes, no markdown.`;
  const result = await model.generateContent(prompt);
  const response = result.response;
  return response.text().split('.')[0] + '.';
}

export async function generateInsightsJSON({ facts, annotated, model = "gemini-2.5-flash" }) {
  if (!GEMINI_API_KEY) throw new Error("Missing VITE_GEMINI_API_KEY");
  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  const m = genAI.getGenerativeModel({
    model,
    generationConfig: { responseMimeType: "application/json" },
  });

  const prompt = `
You are a performance coach. Using ONLY the facts and signals below, output EXACTLY the JSON shape.

Facts:
${facts}

Annotated notes:
${JSON.stringify(annotated).slice(0, 5500)}

JSON:
{
 "weeklyRecap": {
   "summary": "string",
   "focusSessions": 0,
   "tasksCompleted": 0,
   "peakProductivity": { "window": "string", "basis": "string" }
 },
 "patterns": [ {"metric":"Mood","delta":"+0.4","driver":"gym before work"} ],
 "bottlenecks": [ {"severity":"Frequent","label":"Context switching","detail":"between tasks"} ],
 "recommendations": [ {"title":"Block 2h for Project A","rationale":"reduces switching","cta":"Create calendar block"} ],
 "coachNote": "string"
}`;

  const res = await m.generateContent(prompt);
  return JSON.parse(res.response.text());
}