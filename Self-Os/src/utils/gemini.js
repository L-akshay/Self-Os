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