import { useState } from 'react';
import { Email } from '@/types';
import { classificationApi } from '@/services/api';

export const useClassification = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const classifyEmails = async (emails: Email[]) => {
    const apiKey = localStorage.getItem('apiKey');
    const provider = localStorage.getItem('aiProvider');
    
    if (!apiKey) {
      setError('Please enter your API key first');
      return emails;
    }

    setLoading(true);
    setError(null);
    
    try {
      const response = provider === 'gemini' 
        ? await classificationApi.classifyWithGemini(emails, apiKey)
        : await classificationApi.classifyWithOpenAI(emails, apiKey);
      
      const classifiedEmails = emails.map(email => {
        const result = response.data.data.classifications.find((c: any) => c.id === email.id);
        return { ...email, category: result?.category || 'General' };
      });
      
      return classifiedEmails;
    } catch (err) {
      setError('Failed to classify emails');
      console.error('Classification error:', err);
      return emails;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    classifyEmails
  };
};
