export const EMAIL_CATEGORIES = {
    IMPORTANT: 'Important',
    PROMOTIONAL: 'Promotional',
    SOCIAL: 'Social',
    MARKETING: 'Marketing',
    SPAM: 'Spam',
    GENERAL: 'General'
} as const;

export const CATEGORY_COLORS = {
    [EMAIL_CATEGORIES.IMPORTANT]: 'bg-red-100 text-red-800 border-red-200',
    [EMAIL_CATEGORIES.PROMOTIONAL]: 'bg-orange-100 text-orange-800 border-orange-200',
    [EMAIL_CATEGORIES.SOCIAL]: 'bg-blue-100 text-blue-800 border-blue-200',
    [EMAIL_CATEGORIES.MARKETING]: 'bg-green-100 text-green-800 border-green-200',
    [EMAIL_CATEGORIES.SPAM]: 'bg-gray-100 text-gray-800 border-gray-200',
    [EMAIL_CATEGORIES.GENERAL]: 'bg-purple-100 text-purple-800 border-purple-200',
} as const;

export const AI_PROVIDERS = {
    OPENAI: 'OpenAI',
    GEMINI: 'Gemini',
} as const;
