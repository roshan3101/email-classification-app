import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';
import { AI_MODELS, API_CONFIG, FILE_PATHS, EMAIL_CATEGORIES } from '../constants';

function getPrompt(): string {
  const promptPath = path.join(__dirname, FILE_PATHS.PROMPT_FILE);
  const promptContent = fs.readFileSync(promptPath, 'utf8');
  
  return promptContent;
}

function normalizeCategory(category: string): string {
  const normalized = category.toLowerCase().trim();
  
  const categoryMap: { [key: string]: string } = {
    'important': EMAIL_CATEGORIES.IMPORTANT,
    'promotional': EMAIL_CATEGORIES.PROMOTIONAL,
    'social': EMAIL_CATEGORIES.SOCIAL,
    'marketing': EMAIL_CATEGORIES.MARKETING,
    'spam': EMAIL_CATEGORIES.SPAM,
    'general': EMAIL_CATEGORIES.GENERAL
  };

  return categoryMap[normalized] || EMAIL_CATEGORIES.GENERAL;
}

export async function classifyWithOpenAI(
  emails: Array<{ id: string; subject: string; from: string; body: string }>,
  apiKey: string
): Promise<Array<{ id: string; category: string }>> {
    
  const openai = new OpenAI({ apiKey });
  const results: Array<{ id: string; category: string }> = [];

  for (const email of emails) {
    try {
      const prompt = getPrompt()
        .replace('{subject}', email.subject)
        .replace('{from}', email.from)
        .replace('{body}', email.body);

        const completion = await openai.chat.completions.create({
          model: AI_MODELS.OPENAI.GPT_4O,
          messages: [{ role: 'user', content: prompt }],
          max_tokens: API_CONFIG.OPENAI_MAX_TOKENS,
          temperature: API_CONFIG.OPENAI_TEMPERATURE
        });

      const category = completion.choices[0].message.content?.trim() || EMAIL_CATEGORIES.GENERAL;
      results.push({
        id: email.id,
        category: normalizeCategory(category)
      });
    } catch (error) {
      console.error(`Error classifying email ${email.id} with OpenAI:`, error);
        results.push({
          id: email.id,
          category: EMAIL_CATEGORIES.GENERAL
        });
    }
  }

  return results;
}

export async function classifyWithGemini(
  emails: Array<{ id: string; subject: string; from: string; body: string }>,
  apiKey: string
): Promise<Array<{ id: string; category: string }>> {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: AI_MODELS.GEMINI.GEMINI_PRO });
  const results: Array<{ id: string; category: string }> = [];

  for (const email of emails) {
    try {
      const prompt = getPrompt()
        .replace('{subject}', email.subject)
        .replace('{from}', email.from)
        .replace('{body}', email.body);

      const result = await model.generateContent(prompt);
      const category = result.response.text().trim() || EMAIL_CATEGORIES.GENERAL;
      
      results.push({
        id: email.id,
        category: normalizeCategory(category)
      });
    } catch (error) {
      console.error(`Error classifying email ${email.id} with Gemini:`, error);
        results.push({
          id: email.id,
          category: EMAIL_CATEGORIES.GENERAL
        });
    }
  }

  return results;
}
