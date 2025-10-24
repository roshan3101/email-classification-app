'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Email } from '@/types';
import { CATEGORY_COLORS } from '@/utils/constants';

interface EmailListProps {
  emails: Email[];
}

export const EmailList = ({ emails }: EmailListProps) => {
  if (emails.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Emails ({emails.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {emails.map((email) => (
            <div key={email.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-medium text-lg">{email.subject}</h4>
                  <p className="text-sm text-gray-600 mt-1">From: {email.from}</p>
                  <p className="text-sm text-gray-500 mt-1">Date: {new Date(email.date).toLocaleDateString()}</p>
                  <p className="text-sm text-gray-700 mt-2">{email.snippet}</p>
                </div>
                {email.category && (
                  <Badge className={CATEGORY_COLORS[email.category as keyof typeof CATEGORY_COLORS]}>
                    {email.category}
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
