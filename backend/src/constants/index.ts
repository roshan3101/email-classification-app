export const EMAIL_CATEGORIES = {
  IMPORTANT: 'Important',
  PROMOTIONAL: 'Promotional',
  SOCIAL: 'Social',
  MARKETING: 'Marketing',
  SPAM: 'Spam',
  GENERAL: 'General'
};

export const AI_MODELS = {
  OPENAI: {
    GPT_4O: 'gpt-4o',
    GPT_4O_MINI: 'gpt-4o-mini',
    GPT_4_TURBO: 'gpt-4-turbo',
    GPT_3_5_TURBO: 'gpt-3.5-turbo'
  },
  GEMINI: {
    GEMINI_PRO: 'gemini-2.5-flash',
    GEMINI_PRO_VISION: 'gemini-2.5-flash'
  }
};

export const API_CONFIG = {
  DEFAULT_PORT: 3001,
  DEFAULT_FRONTEND_URL: 'http://localhost:3000',
  MAX_EMAILS_DEFAULT: 15,
  OPENAI_MAX_TOKENS: 10,
  OPENAI_TEMPERATURE: 0.1,
  EMAIL_BODY_LIMIT: 2000
};

export const FILE_PATHS = {
  PROMPT_FILE: '../prompts/email-classification.md'
};

