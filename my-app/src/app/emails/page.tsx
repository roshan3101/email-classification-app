'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { useEmails } from '@/hooks/useEmails';
import { useClassification } from '@/hooks/useClassification';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { EmailDetailsModal } from '@/components/email/EmailDetailsModal';
import { CATEGORY_COLORS } from '@/utils/constants';
import { Email } from '@/types';

export default function EmailsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { emails, loading: emailsLoading, error: emailsError, fetchEmails } = useEmails();
  const { loading: classificationLoading, error: classificationError, classifyEmails } = useClassification();
  const [classifications, setClassifications] = useState<Record<string, string>>({});
  const [isClassifying, setIsClassifying] = useState(false);
  const [localEmails, setLocalEmails] = useState<Email[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<string>('openai');

  // Load emails and provider from localStorage on component mount
  useEffect(() => {
    const storedEmails = localStorage.getItem('emails');
    if (storedEmails) {
      setLocalEmails(JSON.parse(storedEmails));
    }
    
    const storedProvider = localStorage.getItem('aiProvider');
    if (storedProvider) {
      setSelectedProvider(storedProvider);
    }
  }, []);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/');
    }
  }, [user, authLoading, router]);

  const handleClassifyAll = async () => {
    const emailsToClassify = localEmails.length > 0 ? localEmails : emails;
    if (emailsToClassify.length === 0) return;

    const apiKey = localStorage.getItem('apiKey');
    if (!apiKey) {
      toast.error('Please enter your API key first');
      return;
    }

    setIsClassifying(true);
    toast.info(`Starting classification with ${selectedProvider === 'openai' ? 'OpenAI' : 'Gemini'}...`);
    try {
      // Store the selected provider in localStorage for the hook to use
      localStorage.setItem('aiProvider', selectedProvider);
      const classifiedEmails = await classifyEmails(emailsToClassify);
      
      // Create classifications map
      const newClassifications: Record<string, string> = {};
      classifiedEmails.forEach(email => {
        newClassifications[email.id] = email.category || 'General';
      });
      
      setClassifications(newClassifications);
      toast.success(`Successfully classified ${classifiedEmails.length} emails!`);
    } catch (error) {
      console.error('Classification error:', error);
      toast.error('Failed to classify emails');
    } finally {
      setIsClassifying(false);
    }
  };

  const handleClassifySingle = async (email: Email) => {
    const apiKey = localStorage.getItem('apiKey');
    if (!apiKey) {
      toast.error('Please enter your API key first');
      return;
    }

    try {
      // Store the selected provider in localStorage for the hook to use
      localStorage.setItem('aiProvider', selectedProvider);
      const classifiedEmails = await classifyEmails([email]);
      if (classifiedEmails.length > 0) {
        setClassifications(prev => ({
          ...prev,
          [email.id]: classifiedEmails[0].category || 'General'
        }));
        toast.success(`Email classified as: ${classifiedEmails[0].category || 'General'}`);
      }
    } catch (error) {
      console.error('Classification error:', error);
      toast.error('Failed to classify email');
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Your Emails</h1>
          <Button onClick={() => router.push('/')} variant="outline">
            Back to Home
          </Button>
        </div>

        {emailsError && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{emailsError}</AlertDescription>
          </Alert>
        )}

        {classificationError && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{classificationError}</AlertDescription>
          </Alert>
        )}

        {(localEmails.length > 0 ? localEmails : emails).length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <h3 className="text-xl font-semibold mb-4">No Emails Found</h3>
              <p className="text-gray-600 mb-6">Fetch your emails from the home page to get started.</p>
              <Button onClick={() => router.push('/')}>
                Go to Home
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Classification Controls */}
            <Card className="mb-4">
              <CardContent className="p-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <p className="text-sm text-gray-600">
                        Classify {(localEmails.length > 0 ? localEmails : emails).length} emails
                      </p>
                      <div className="flex items-center gap-2">
                        <Label htmlFor="provider" className="text-sm">Provider:</Label>
                        <Select value={selectedProvider} onValueChange={setSelectedProvider}>
                          <SelectTrigger className="w-32 h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="openai">OpenAI</SelectItem>
                            <SelectItem value="gemini">Gemini</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <Button 
                      onClick={handleClassifyAll} 
                      disabled={isClassifying || classificationLoading}
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {isClassifying ? 'Classifying...' : 'Classify All'}
                    </Button>
                  </div>
                  
                  {/* Classification Summary */}
                  {Object.keys(classifications).length > 0 && (
                    <div className="pt-3 border-t">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium text-gray-700">Classification Summary:</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(
                          Object.values(classifications).reduce((acc, category) => {
                            acc[category] = (acc[category] || 0) + 1;
                            return acc;
                          }, {} as Record<string, number>)
                        ).map(([category, count]) => (
                          <Badge key={category} variant="secondary" className="text-xs">
                            {category}: {count}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Emails List */}
            <div className="space-y-3">
              {emailsLoading ? (
                <div className="space-y-2">
                  {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-20 w-full" />
                  ))}
                </div>
              ) : (
                (localEmails.length > 0 ? localEmails : emails).map((email) => (
                  <Card key={email.id} className="hover:shadow-sm transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-sm font-semibold truncate">{email.subject}</h3>
                            {classifications[email.id] && (
                              <Badge className={`text-xs ${CATEGORY_COLORS[classifications[email.id] as keyof typeof CATEGORY_COLORS]}`}>
                                {classifications[email.id]}
                              </Badge>
                            )}
                          </div>
                          
                          <div className="text-xs text-gray-500 mb-2">
                            <span className="font-medium">{email.from}</span> • {new Date(email.date).toLocaleDateString()}
                          </div>
                          
                          <p className="text-xs text-gray-600 line-clamp-2 mb-3">{email.snippet}</p>
                          
                          <div className="flex items-center gap-2">
                            {!classifications[email.id] && (
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleClassifySingle(email)}
                                disabled={classificationLoading}
                                className="h-7 text-xs"
                              >
                                Classify
                              </Button>
                            )}
                            <EmailDetailsModal 
                              email={email} 
                              category={classifications[email.id]}
                            >
                              <Button size="sm" variant="outline" className="h-7 text-xs">
                                View Details
                              </Button>
                            </EmailDetailsModal>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
