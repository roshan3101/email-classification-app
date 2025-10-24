import { google } from 'googleapis';
import { API_CONFIG, EMAIL_CATEGORIES } from '../constants';

export interface EmailDetails {
  id: string;
  subject: string;
  from: string;
  to: string;
  date: string;
  body: string;
  snippet: string;
  threadId?: string;
  labelIds?: string[];
}

export class EmailUtils {

  static extractEmailDetails(emailData: any, emailId?: string): EmailDetails {
    const headers = emailData.payload?.headers || [];
    const subject = headers.find((h: any) => h.name === 'Subject')?.value || 'No Subject';
    const from = headers.find((h: any) => h.name === 'From')?.value || 'Unknown Sender';
    const date = headers.find((h: any) => h.name === 'Date')?.value || '';
    const to = headers.find((h: any) => h.name === 'To')?.value || '';
    
    let body = '';
    if (emailData.payload?.body?.data) {
      body = Buffer.from(emailData.payload.body.data, 'base64').toString();
    } else if (emailData.payload?.parts) {
      for (const part of emailData.payload.parts) {
        if (part.mimeType === 'text/plain' && part.body?.data) {
          body = Buffer.from(part.body.data, 'base64').toString();
          break;
        } else if (part.mimeType === 'text/html' && part.body?.data) {
          body = Buffer.from(part.body.data, 'base64').toString();
        }
      }
    }

    return {
      id: emailId || emailData.id,
      subject,
      from,
      to,
      date,
      body: body.substring(0, API_CONFIG.EMAIL_BODY_LIMIT),
      snippet: emailData.snippet,
      threadId: emailData.threadId,
      labelIds: emailData.labelIds
    };
  }


  static getGmailClient(accessToken: string) {
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: accessToken });
    return google.gmail({ version: 'v1', auth: oauth2Client });
  }

  static async fetchEmailById(gmail: any, emailId: string): Promise<EmailDetails> {
    const email = await gmail.users.messages.get({
      userId: 'me',
      id: emailId,
      format: 'full'
    });

    return this.extractEmailDetails(email.data, emailId);
  }


  static async fetchEmails(gmail: any, maxResults: number = API_CONFIG.MAX_EMAILS_DEFAULT): Promise<EmailDetails[]> {
    const response = await gmail.users.messages.list({
      userId: 'me',
      maxResults: maxResults
    });

    const messages = response.data.messages || [];
    const emailDetails: EmailDetails[] = [];

    for (const message of messages) {
      try {
        const email = await gmail.users.messages.get({
          userId: 'me',
          id: message.id!,
          format: 'full'
        });

        const emailDetail = this.extractEmailDetails(email.data, message.id);
        emailDetails.push(emailDetail);
      } catch (emailError) {
        console.error(`Error fetching email ${message.id}:`, emailError);
      }
    }

    return emailDetails;
  }
}
