'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { useEmails } from '@/hooks/useEmails';
import { useClassification } from '@/hooks/useClassification';
import { LoginButton } from '@/components/auth/LoginButton';
import { UserProfile } from '@/components/auth/UserProfile';
import { ApiKeyForm } from '@/components/forms/ApiKeyForm';
import { EmailFetchForm } from '@/components/forms/EmailFetchForm';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function Home() {
  const { user, loading: authLoading } = useAuth();
  const { emails, loading: emailsLoading, error: emailsError, fetchEmails } = useEmails();
  const { loading: classificationLoading, error: classificationError, classifyEmails } = useClassification();
  const [classifiedEmails, setClassifiedEmails] = useState<any[]>([]);

  const handleEmailsFetched = (fetchedEmails: any[]) => {
    setClassifiedEmails([]);
    toast.success(`Fetched ${fetchedEmails.length} emails successfully!`);
    setTimeout(() => {
      window.location.href = '/emails';
    }, 1000);
  };

  const handleEmailsClassified = (emails: any[]) => {
    setClassifiedEmails(emails);
  };

  const handleClassify = async () => {
    const result = await classifyEmails(emails);
    setClassifiedEmails(result);
    toast.success(`Successfully classified ${result.length} emails!`);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
          Email Classification App
        </h1>

        {!user ? (
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-3 text-center">Welcome</h2>
              <p className="text-sm text-gray-600 mb-4 text-center">
                Sign in with Google to classify your emails using AI
              </p>
              <LoginButton />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <UserProfile user={user} />
            <ApiKeyForm />
            
            <EmailFetchForm onEmailsFetched={handleEmailsFetched} fetchEmails={fetchEmails} />
            
            {emailsError && (
              <Alert variant="destructive">
                <AlertDescription>{emailsError}</AlertDescription>
              </Alert>
            )}
            
            {classificationError && (
              <Alert variant="destructive">
                <AlertDescription>{classificationError}</AlertDescription>
              </Alert>
            )}

            {emails.length > 0 && (
              <Card>
                <CardContent className="p-4 text-center">
                  <h3 className="text-lg font-semibold mb-2">Emails Ready!</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    You have {emails.length} emails ready for classification.
                  </p>
                  <Button onClick={() => window.location.href = '/emails'} className="bg-blue-600 hover:bg-blue-700">
                    Go to Emails Page
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
