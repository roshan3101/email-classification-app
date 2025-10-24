import { Request, Response } from 'express';
import { ResponseHandler } from '../utils/response';
import { EmailUtils } from '../utils/email.utils';
import { API_CONFIG } from '../constants';

export class EmailController {

  public fetchEmails = async (req: Request, res: Response): Promise<void> => {
    try {
      const { accessToken, maxResults = API_CONFIG.MAX_EMAILS_DEFAULT } = req.body;

      if (!accessToken) {
        ResponseHandler.badRequest(res, 'Access token is required');
        return;
      }

      const gmail = EmailUtils.getGmailClient(accessToken);
      const emailDetails = await EmailUtils.fetchEmails(gmail, maxResults);

      ResponseHandler.success(res, { emails: emailDetails }, `Successfully fetched ${emailDetails.length} emails`);
    } catch (error) {
      console.error('Error fetching emails:', error);
      ResponseHandler.internalError(res, 'Failed to fetch emails', error);
    }
  };

  public getEmailById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { accessToken } = req.body;
      const { emailId } = req.params;

      if (!accessToken) {
        ResponseHandler.badRequest(res, 'Access token is required');
        return;
      }

      if (!emailId) {
        ResponseHandler.badRequest(res, 'Email ID is required');
        return;
      }

      const gmail = EmailUtils.getGmailClient(accessToken);
      const emailDetails = await EmailUtils.fetchEmailById(gmail, emailId);

      ResponseHandler.success(res, { email: emailDetails }, 'Email fetched successfully');
    } catch (error) {
      console.error('Error fetching email:', error);
      ResponseHandler.internalError(res, 'Failed to fetch email', error);
    }
  };
}
