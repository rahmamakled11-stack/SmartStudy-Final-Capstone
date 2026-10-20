import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import logger from './logger';

interface ScheduleInput {
  subjects: Array<{ id: string; name: string; difficulty: string; progress: number }>;
  weakSubjects: string[];
  availableHours: number;
}

interface ScheduleResult {
  schedule: Array<{
    day: string;
    sessions: Array<{
      subjectId: string;
      subjectName: string;
      startTime: string;
      endTime: string;
      duration: number;
      type: 'study' | 'break' | 'review';
    }>;
  }>;
  recommendations: string[];
}

class AIServiceClass {
  private openai: OpenAI | null = null;
  private gemini: GoogleGenerativeAI | null = null;

  constructor() {
    if (process.env.OPENAI_API_KEY) {
      this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    }
    if (process.env.GEMINI_API_KEY) {
      this.gemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    }
  }

  async generateStudySchedule(input: ScheduleInput): Promise<ScheduleResult> {
    try {
      if (this.openai) {
        return await this.generateWithOpenAI(input);
      } else if (this.gemini) {
        return await this.generateWithGemini(input);
      } else {
        return this.generateFallbackSchedule(input);
      }
    } catch (error) {
      logger.error('AI schedule generation failed:', error);
      return this.generateFallbackSchedule(input);
    }
  }

  async generateChatResponse(message: string, context: string): Promise<string> {
    const prompt = `You are a helpful AI study assistant. Context from previous messages:
${context}

User: ${message}

Assistant:`;

    try {
      if (this.openai) {
        const response = await this.openai.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: 'You are a helpful AI study assistant for students.' },
            { role: 'user', content: prompt },
          ],
          max_tokens: 500,
        });
        return response.choices[0]?.message?.content || 'I apologize, I could not generate a response.';
      } else if (this.gemini) {
        const model = this.gemini.getGenerativeModel({ model: 'gemini-pro' });
        const result = await model.generateContent(prompt);
        return result.response.text();
      } else {
        return this.generateFallbackResponse(message);
      }
    } catch (error) {
      logger.error('AI chat generation failed:', error);
      return this.generateFallbackResponse(message);
    }
  }

  private async generateWithOpenAI(input: ScheduleInput): Promise<ScheduleResult> {
    return this.generateFallbackSchedule(input);
  }

  private async generateWithGemini(input: ScheduleInput): Promise<ScheduleResult> {
    return this.generateFallbackSchedule(input);
  }

  private generateFallbackSchedule(input: ScheduleInput): ScheduleResult {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const hoursPerSubject = Math.floor(input.availableHours / input.subjects.length);

    const schedule = days.slice(0, 5).map((day, dayIndex) => {
      const sessions = [];
      let currentHour = 9;

      input.subjects.forEach((subject, idx) => {
        if (sessions.length < 3 && currentHour < 17) {
          const isWeak = input.weakSubjects.includes(subject.id);
          const duration = isWeak ? 2 : 1.5;
          const type = dayIndex % 2 === 0 ? 'study' : (isWeak ? 'review' : 'study');

          sessions.push({
            subjectId: subject.id,
            subjectName: subject.name,
            startTime: `${String(currentHour).padStart(2, '0')}:00`,
            endTime: `${String(Math.floor(currentHour + duration)).padStart(2, '0')}:${String(Math.floor((currentHour + duration) % 1 * 60)).padStart(2, '0')}`,
            duration: Math.round(duration * 60),
            type: type as 'study' | 'break' | 'review',
          });

          currentHour += duration;

          if (sessions.length < 3 && currentHour < 17) {
            sessions.push({
              subjectId: 'break',
              subjectName: 'Break',
              startTime: `${String(Math.floor(currentHour)).padStart(2, '0')}:00`,
              endTime: `${String(Math.floor(currentHour + 0.5)).padStart(2, '0')}:30`,
              duration: 30,
              type: 'break' as const,
            });
            currentHour += 0.5;
          }
        }
      });

      return { day, sessions };
    });

    return {
      schedule,
      recommendations: [
        `Focus extra time on ${input.weakSubjects.length > 0 ? input.subjects.find(s => s.id === input.weakSubjects[0])?.name || 'your weakest subject' : 'your weakest subject'}`,
        'Take regular breaks to maintain peak concentration',
        'Review concepts within 24 hours for better retention',
        'Use active recall techniques during study sessions',
      ],
    };
  }

  private generateFallbackResponse(message: string): string {
    return `I understand you're asking about "${message.slice(0, 50)}...". I'm currently running in fallback mode without AI access. Please configure your OpenAI or Gemini API key for full functionality.`;
  }
}

export const AIService = new AIServiceClass();
