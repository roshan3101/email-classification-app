'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Email } from '@/types';
import { CATEGORY_COLORS } from '@/utils/constants';

interface EmailDetailsModalProps {
  email: Email;
  category?: string;
  children: React.ReactNode;
}

export const EmailDetailsModal = ({ email, category, children }: EmailDetailsModalProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl sm:max-w-6xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <span className="truncate">{email.subject}</span>
            {category && (
              <Badge className={CATEGORY_COLORS[category as keyof typeof CATEGORY_COLORS]}>
                {category}
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Email Metadata */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <strong>From:</strong> {email.from}
            </div>
            <div>
              <strong>To:</strong> {email.to}
            </div>
            <div>
              <strong>Date:</strong> {new Date(email.date).toLocaleString()}
            </div>
            <div>
              <strong>ID:</strong> {email.id}
            </div>
          </div>

          {/* Email Body */}
          <div className="space-y-2">
            <h4 className="font-semibold text-lg">Email Content:</h4>
            <div className="p-4 bg-white border rounded-lg">
              <div className="whitespace-pre-wrap text-sm leading-relaxed">
                {email.body || email.snippet}
              </div>
            </div>
          </div>

          {/* Email Snippet (if different from body) */}
          {email.snippet && email.snippet !== email.body && (
            <div className="space-y-2">
              <h4 className="font-semibold text-lg">Preview:</h4>
              <div className="p-3 bg-gray-50 border rounded-lg">
                <p className="text-sm text-gray-600">{email.snippet}</p>
              </div>
            </div>
          )}

          {/* Thread and Label Info */}
          {(email.threadId || email.labelIds) && (
            <div className="space-y-2">
              <h4 className="font-semibold text-lg">Additional Info:</h4>
              <div className="p-3 bg-gray-50 border rounded-lg space-y-2">
                {email.threadId && (
                  <div>
                    <strong>Thread ID:</strong> {email.threadId}
                  </div>
                )}
                {email.labelIds && email.labelIds.length > 0 && (
                  <div>
                    <strong>Labels:</strong> {email.labelIds.join(', ')}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Close
            </Button>
            <Button 
              onClick={() => {
                // Copy email content to clipboard
                navigator.clipboard.writeText(email.body || email.snippet);
                toast.success('Email content copied to clipboard!');
              }}
              variant="outline"
            >
              Copy Content
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
