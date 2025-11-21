import Anthropic from '@anthropic-ai/sdk';
import dotenv from 'dotenv';

dotenv.config();

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export class AIService {
  static async generateResumeSuggestions(resumeContent: string) {
    try {
      const message = await anthropic.messages.create({
        model: "claude-3-sonnet-20240229",
        max_tokens: 1024,
        messages: [{
          role: "user",
          content: `Analyze this resume content and provide suggestions for improvement: ${resumeContent}`
        }]
      });
      return message.content;
    } catch (error) {
      console.error('AI Service Error:', error);
      throw new Error('Failed to generate suggestions');
    }
  }

  static async generateMatchReasoning(jobDescription: string, resumeContent: string) {
    try {
        const message = await anthropic.messages.create({
            model: "claude-3-sonnet-20240229",
            max_tokens: 1024,
            messages: [{
                role: "user",
                content: `Analyze the fit between this job description and resume. Provide reasoning. \n\nJob: ${jobDescription}\n\nResume: ${resumeContent}`
            }]
        });
        return message.content;
    } catch (error) {
        console.error('AI Service Error:', error);
        throw new Error('Failed to generate match reasoning');
    }
  }
}
