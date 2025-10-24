'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export const ApiKeyForm = () => {
  const [apiKey, setApiKey] = useState('');
  const [provider, setProvider] = useState<'openai' | 'gemini'>('openai');

  useEffect(() => {
    const storedKey = localStorage.getItem('apiKey');
    const storedProvider = localStorage.getItem('aiProvider');
    if (storedKey) setApiKey(storedKey);
    if (storedProvider) setProvider(storedProvider as 'openai' | 'gemini');
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      localStorage.setItem('apiKey', apiKey.trim());
      localStorage.setItem('aiProvider', provider);
      toast.success('API Key saved successfully!');
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">AI Provider Configuration</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <Label htmlFor="provider">AI Provider</Label>
            <Select value={provider} onValueChange={(value: 'openai' | 'gemini') => setProvider(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="openai">OpenAI GPT-4o</SelectItem>
                <SelectItem value="gemini">Google Gemini</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="apiKey">API Key</Label>
            <Input
              id="apiKey"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder={`Enter your ${provider === 'openai' ? 'OpenAI' : 'Gemini'} API key`}
              required
            />
          </div>

          <Button type="submit" className="w-full">
            Save API Key
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
