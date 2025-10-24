'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { emailApi } from '@/services/api';
import { Email } from '@/types';

interface EmailFetchFormProps {
  onEmailsFetched: (emails: Email[]) => void;
  fetchEmails: (maxResults: number) => Promise<void>;
}

export const EmailFetchForm = ({ onEmailsFetched, fetchEmails }: EmailFetchFormProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [maxResults, setMaxResults] = useState(15);

  const handleFetchEmails = async () => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      toast.error('Please login first');
      return;
    }

    setLoading(true);
    try {
      await fetchEmails(maxResults);
      toast.success(`Successfully fetched ${maxResults} emails! Redirecting...`);
      setTimeout(() => {
        router.push('/emails');
      }, 1500);
    } catch (error) {
      console.error('Error fetching emails:', error);
      toast.error('Failed to fetch emails');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Fetch Your Emails</CardTitle>
      </CardHeader>
      <CardContent className="pt-0 space-y-3">
        <div>
          <Label htmlFor="maxResults">Number of Emails</Label>
          <Input
            id="maxResults"
            type="number"
            value={maxResults}
            onChange={(e) => setMaxResults(Number(e.target.value))}
            min="1"
            max="50"
          />
        </div>
        <Button onClick={handleFetchEmails} disabled={loading} className="w-full">
          {loading ? 'Fetching...' : 'Fetch My Emails'}
        </Button>
      </CardContent>
    </Card>
  );
};
