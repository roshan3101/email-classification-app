import { Request, Response } from 'express';
import { ResponseHandler } from '../utils/response';
import { classifyWithOpenAI, classifyWithGemini } from '../providers/ai.providers';

export class ClassificationController {

  public classifyWithOpenAI = async (req: Request, res: Response): Promise<void> => {
    try {
      const { emails, apiKey } = req.body;

      if (!apiKey) {
        ResponseHandler.badRequest(res, 'OpenAI API key is required');
        return;
      }

      if (!emails || !Array.isArray(emails) || emails.length === 0) {
        ResponseHandler.badRequest(res, 'Emails array is required');
        return;
      }

      const results = await classifyWithOpenAI(emails, apiKey);
      const classifications = emails.map(email => {
        const result = results.find(r => r.id === email.id);
        return { ...email, category: result?.category || 'General' };
      });

      ResponseHandler.success(res, { classifications }, 'Emails classified successfully using OpenAI');
    } catch (error) {
      console.error('OpenAI classification error:', error);
      ResponseHandler.internalError(res, 'Failed to classify emails with OpenAI', error);
    }
  };

  public classifyWithGemini = async (req: Request, res: Response): Promise<void> => {
    try {
      const { emails, apiKey } = req.body;

      if (!apiKey) {
        ResponseHandler.badRequest(res, 'Gemini API key is required');
        return;
      }

      if (!emails || !Array.isArray(emails) || emails.length === 0) {
        ResponseHandler.badRequest(res, 'Emails array is required');
        return;
      }

      const results = await classifyWithGemini(emails, apiKey);
      const classifications = emails.map(email => {
        const result = results.find(r => r.id === email.id);
        return { ...email, category: result?.category || 'General' };
      });

      ResponseHandler.success(res, { classifications }, 'Emails classified successfully using Gemini');
    } catch (error) {
      console.error('Gemini classification error:', error);
      ResponseHandler.internalError(res, 'Failed to classify emails with Gemini', error);
    }
  };

  public getClassificationStats = async (req: Request, res: Response): Promise<void> => {
    try {
      const { classifications } = req.body;

      if (!classifications || !Array.isArray(classifications)) {
        ResponseHandler.badRequest(res, 'Classifications array is required');
        return;
      }

      const stats = classifications.reduce((acc: any, email: any) => {
        const category = email.category || 'General';
        acc[category] = (acc[category] || 0) + 1;
        return acc;
      }, {});

      const total = classifications.length;
      const percentages = Object.keys(stats).reduce((acc: any, category: string) => {
        acc[category] = {
          count: stats[category],
          percentage: ((stats[category] / total) * 100).toFixed(2)
        };
        return acc;
      }, {});

      ResponseHandler.success(res, { 
        total, 
        stats, 
        percentages 
      }, 'Classification statistics generated successfully');
    } catch (error) {
      console.error('Error generating classification stats:', error);
      ResponseHandler.internalError(res, 'Failed to generate classification statistics', error);
    }
  };
}
