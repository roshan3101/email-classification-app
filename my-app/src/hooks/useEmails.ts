import { useState } from 'react';
import { Email } from '@/types';
import { emailApi } from '@/services/api';

export const useEmails = () => {
  const [emails, setEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEmails = async (maxResults = 15) => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      setError('Please login first');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const response = await emailApi.fetchEmails(accessToken, maxResults);
      const fetchedEmails = response.data.data.emails;
      setEmails(fetchedEmails);
      
      localStorage.setItem('emails', JSON.stringify(fetchedEmails));
      console.log(`Fetched ${fetchedEmails.length} emails`);
    } catch (err) {
      setError('Failed to fetch emails');
      console.error('Error fetching emails:', err);
    } finally {
      setLoading(false);
    }
  };

  const clearEmails = () => {
    setEmails([]);
    setError(null);
  };

  return {
    emails,
    loading,
    error,
    fetchEmails,
    clearEmails
  };
};
