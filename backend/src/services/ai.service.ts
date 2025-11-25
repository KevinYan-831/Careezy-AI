import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey: process.env.DEEPSEEK_API_KEY,
});

export class AIService {
  static async generateResumeSuggestions(resumeContent: string) {
    try {
      const completion = await openai.chat.completions.create({
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
      const completion = await openai.chat.completions.create({
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

  static async chat(message: string) {
    try {
      const completion = await openai.chat.completions.create({
        model: "deepseek-reasoner",
        messages: [{
          role: "user",
          content: message
        }],
      });
      return completion.choices[0]?.message?.content || "I'm sorry, I couldn't generate a response.";
    } catch (error) {
      console.error('AI Service Error:', error);
      throw new Error('Failed to chat');
    }
  }
}
