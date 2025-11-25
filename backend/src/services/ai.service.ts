import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

// Lazy initialization of OpenAI client to allow server to start without API key
let openaiClient: OpenAI | null = null;

function getOpenAIClient(): OpenAI {
  if (!openaiClient) {
    if (!process.env.DEEPSEEK_API_KEY) {
      throw new Error('DEEPSEEK_API_KEY environment variable is not set');
    }
    openaiClient = new OpenAI({
      baseURL: 'https://api.deepseek.com',
      apiKey: process.env.DEEPSEEK_API_KEY,
    });
  }
  return openaiClient;
}

export class AIService {
  static async generateResumeSuggestions(resumeContent: string) {
    try {
      const client = getOpenAIClient();
      const completion = await client.chat.completions.create({
        model: "deepseek-reasoner",
        messages: [{
          role: "user",
          content: `Analyze this resume content and provide suggestions for improvement: ${resumeContent}`
        }],
      });
      return completion.choices[0]?.message?.content || "No suggestions generated.";
    } catch (error) {
      console.error('AI Service Error:', error);
      throw new Error('Failed to generate suggestions');
    }
  }

  static async generateMatchReasoning(jobDescription: string, resumeContent: string) {
    try {
      const client = getOpenAIClient();
      const completion = await client.chat.completions.create({
        model: "deepseek-reasoner",
        messages: [{
          role: "user",
          content: `Analyze the fit between this job description and resume. Provide reasoning. \n\nJob: ${jobDescription}\n\nResume: ${resumeContent}`
        }],
      });
      return completion.choices[0]?.message?.content || "No reasoning generated.";
    } catch (error) {
      console.error('AI Service Error:', error);
      throw new Error('Failed to generate match reasoning');
    }
  }

  static async chat(messages: any[]) {
    try {
      const client = getOpenAIClient();
      const completion = await client.chat.completions.create({
        model: "deepseek-reasoner",
        messages: messages,
      });
      return completion.choices[0]?.message?.content || "I'm sorry, I couldn't generate a response.";
    } catch (error) {
      console.error('AI Service Error:', error);
      throw new Error('Failed to chat');
    }
  }
}
