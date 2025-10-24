import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const api = axios.create({
    baseURL: API_URL,
    headers : {
        'Content-Type': 'application/json',
    }
});

export const authApi = {
    getGoogleAuthUrl: () => api.get('/api/auth/google'),
    handleGoogleCallback: (code: string) => api.get(`/api/auth/google/callback?code=${code}`),
}

export const emailApi = {
    fetchEmails: (accessToken: string, maxResults: number = 15) => 
        (api.post('/api/emails/fetch', { accessToken, maxResults })),

    getEmailById: (accessToken: string, emailId: string) => 
        (api.get(`/api/emails/${emailId}`, { data : {accessToken} })),
}

export const classificationApi = {
    classifyWithOpenAI: (emails: any[], apiKey: string) =>
        (api.post('/api/classify/openai', { emails, apiKey })),

    classifyWithGemini: (emails: any[], apiKey: string) =>
        (api.post('/api/classify/gemini', { emails, apiKey })),

    getStaticPaths: (classifications: any[]) => 
        (api.post('/api/classify/stats', { classifications } )),
}