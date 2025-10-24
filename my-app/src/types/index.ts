export interface User {
    id: string;
    name: string;
    email: string;
    image: string;
}

export interface Email {
    id: string;
    subject: string;
    from: string;
    to: string;
    date: string;
    body: string;
    snippet: string;
    threadId?: string;
    labelIds?: string[];
    category?: string;
}

export interface ClassificationResult {
    id: string;
    category: string;
}

export interface ApiResponse<T = any> {
    success: boolean;
    message: string;
    data?: T;
    error?: string;
    statusCode: number;
}