# Smart Study Planner - Final Capstone

A full-stack AI-powered study management SaaS application.

## Architecture

- **Frontend**: React 18 + TypeScript + Vite + TailwindCSS + Zustand
- **Backend**: Node.js + Express + TypeScript + MongoDB
- **AI**: OpenAI GPT / Google Gemini integration
- **Payments**: Stripe subscription management
- **Auth**: JWT with refresh tokens

## Quick Start

### Prerequisites
- Node.js 20+
- MongoDB Atlas account (or local MongoDB)
- OpenAI API key (or Gemini)

### Development

```bash
# 1. Clone and enter project
cd SmartStudy-Final-Capstone

# 2. Setup backend
cd backend
cp .env.example .env
# Edit .env with your secrets
npm install
npm run dev

# 3. Setup frontend (new terminal)
cd ../frontend
npm install
npm run dev
```

### Production Build

```bash
# Build frontend
cd frontend
npm run build

# Build backend
cd ../backend
npm run build

# Start production server
npm start
```

### Docker Deployment

```bash
docker-compose up --build
```

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGODB_URI` | MongoDB connection string | Yes |
| `JWT_SECRET` | JWT signing secret (min 32 chars) | Yes |
| `JWT_REFRESH_SECRET` | JWT refresh secret (min 32 chars) | Yes |
| `OPENAI_API_KEY` | OpenAI API key | No* |
| `GEMINI_API_KEY` | Google Gemini API key | No* |
| `STRIPE_SECRET_KEY` | Stripe secret key | No |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook secret | No |

*At least one AI provider required for planner/chat features

## API Documentation

Available at `/api-docs` when backend is running.

## License

MIT
