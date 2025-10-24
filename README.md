# Email Classification App

A modern web application that uses AI to automatically classify your Gmail emails into categories like Important, Promotional, Social, Marketing, Spam, and General.

## Prerequisites

Before you begin, ensure you have:

- Node.js (v18 or higher)
- npm or yarn
- Google Cloud Console account
- OpenAI API key (optional)
- Google Gemini API key (optional)

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/roshan3101/email-classification-app.git
cd email-classification-app
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:
Get the env from env.example and add all the variables.

### 3. Frontend Setup

```bash
cd ../my-app
npm install
```

### 4. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Gmail API
4. Create OAuth 2.0 credentials
5. Add `http://localhost:3001/api/auth/google/callback` to authorized redirect URIs
6. Copy Client ID and Secret to your `.env` file

### 5. API Keys (Optional)

#### OpenAI API Key
1. Visit [OpenAI Platform](https://platform.openai.com/)
2. Create an account and generate an API key
3. Enter the key in the app when prompted

#### Google Gemini API Key
1. Visit [Google AI Studio](https://aistudio.google.com/)
2. Create an API key
3. Enter the key in the app when prompted

## Running the Application

### 1. Start the Backend

```bash
cd backend
npm run dev
```

The backend will run on `http://localhost:3001`

### 2. Start the Frontend

```bash
cd my-app
npm run dev
```

The frontend will run on `http://localhost:3000`

### 3. Access the Application

Open your browser and navigate to `http://localhost:3000`

## Usage

1. **Sign In** - Click "Sign in with Google" to authenticate
2. **Configure AI Provider** - Choose between OpenAI or Gemini and enter your API key
3. **Fetch Emails** - Specify how many emails to fetch (1-50)
4. **Classify Emails** - Use "Classify All" or classify individual emails
5. **View Results** - See categorized emails with color-coded badges

## Project Structure

```
email-classification-app/
├── backend/                 # Express.js backend
│   ├── src/
│   │   ├── controllers/    # API route handlers
│   │   ├── middleware/    # Custom middleware
│   │   ├── providers/     # AI service providers
│   │   ├── routes/        # API routes
│   │   └── utils/         # Utility functions
│   └── package.json
├── my-app/                 # Next.js frontend
│   ├── src/
│   │   ├── app/           # App router pages
│   │   ├── components/    # React components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── services/      # API services
│   │   └── types/         # TypeScript types
│   └── package.json
└── README.md
```

## API Endpoints

### Authentication
- `GET /api/auth/google` - Initiate Google OAuth
- `GET /api/auth/google/callback` - OAuth callback

### Emails
- `POST /api/emails/fetch` - Fetch emails from Gmail
- `GET /api/emails/:id` - Get specific email details

### Classification
- `POST /api/classify/openai` - Classify emails with OpenAI
- `POST /api/classify/gemini` - Classify emails with Gemini
- `POST /api/classify/stats` - Get classification statistics

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/roshan3101/email-classification-app/issues) page
2. Create a new issue with detailed description
3. Contact: imroshansahu3101@gmail.com

## Acknowledgments

- OpenAI for providing the GPT-4o API
- Google for Gemini AI and Gmail API
- The open-source community for amazing tools and libraries

---

**Note**: This application requires valid API keys for AI classification. The app will work for authentication and email fetching without API keys, but classification features require either OpenAI or Gemini API keys.