import { Request, Response } from 'express';
import { google } from 'googleapis';
import { ResponseHandler } from '../utils/response';

export class AuthController {
  private getOAuth2Client() {
    return new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );
  }

  public getGoogleAuthUrl = async (req: Request, res: Response): Promise<void> => {
    try {
      const oauth2Client = this.getOAuth2Client();
      
      const scopes = [
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/gmail.readonly',
      ];

      const authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes,
        prompt: 'consent',
      });

      ResponseHandler.success(res, { authUrl }, 'Google OAuth URL generated successfully');
    } catch (error) {
      console.error('Error generating Google OAuth URL:', error);
      ResponseHandler.internalError(res, 'Failed to generate OAuth URL', error);
    }
  };

  public handleGoogleCallback = async (req: Request, res: Response): Promise<void> => {
    try {
      const { code } = req.query;

      if (!code) {
        return res.redirect(`${process.env.FRONTEND_URL}?error=no_code`);
      }

      const oauth2Client = this.getOAuth2Client();
      const { tokens } = await oauth2Client.getToken(code as string);
      oauth2Client.setCredentials(tokens);

      const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
      const userInfo = await oauth2.userinfo.get();

      // Redirect to frontend with success data
      const successData = {
        tokens,
        user: userInfo.data
      };

      // Encode the data as URL parameters
      const encodedData = encodeURIComponent(JSON.stringify(successData));
      res.redirect(`${process.env.FRONTEND_URL}/callback?success=true&data=${encodedData}`);
    } catch (error) {
      console.error('Error during Google OAuth callback:', error);
      res.redirect(`${process.env.FRONTEND_URL}?error=auth_failed`);
    }
  };


  public refreshToken = async (req: Request, res: Response): Promise<void> => {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        ResponseHandler.badRequest(res, 'Refresh token is required');
        return;
      }

      const oauth2Client = this.getOAuth2Client();
      oauth2Client.setCredentials({
        refresh_token: refreshToken
      });

      const { credentials } = await oauth2Client.refreshAccessToken();

      ResponseHandler.success(res, { tokens: credentials }, 'Token refreshed successfully');
    } catch (error) {
      console.error('Error refreshing token:', error);
      ResponseHandler.internalError(res, 'Failed to refresh token', error);
    }
  };

  
  public revokeToken = async (req: Request, res: Response): Promise<void> => {
    try {
      const { accessToken } = req.body;

      if (!accessToken) {
        ResponseHandler.badRequest(res, 'Access token is required');
        return;
      }

      const oauth2Client = this.getOAuth2Client();
      await oauth2Client.revokeToken(accessToken);

      ResponseHandler.success(res, null, 'Token revoked successfully');
    } catch (error) {
      console.error('Error revoking token:', error);
      ResponseHandler.internalError(res, 'Failed to revoke token', error);
    }
  };
}
