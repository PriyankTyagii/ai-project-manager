# AI Project Manager

> An intelligent, event-driven project management system powered by AI agents that automatically plans work, detects blockers, motivates teams, and generates daily insights — all without human intervention.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Firebase](https://img.shields.io/badge/Firebase-Auth-orange)
![Prisma](https://img.shields.io/badge/Prisma-5.22-brightgreen)

---

## Overview

AI Project Manager is an intelligent task management system that uses AI agents to automatically break down projects, detect blockers, and generate daily insights. Built with Next.js, TypeScript, and powered by OpenAI's GPT-4.

### Key Features

### Core Functionality
- 🧠 **AI-Powered Task Generation** - Breaks down projects into professional, sprint-ready tasks
- 📊 **Kanban Board** - Visual task management with 4 columns (Backlog → In Progress → Blocked → Done)
- 🔐 **Multi-User Authentication** - Firebase auth with email/password and Google OAuth
- 👥 **User Isolation** - Each user only sees their own projects and tasks
- 🎯 **Smart Prioritization** - AI assigns realistic priorities and effort estimates

### Autonomous AI Agents
- **Planner Agent** - Automatically generates 8-15 professional tasks per project
- **Risk Agent** - Monitors for blockers, delays, and dependency issues
- **Motivation Agent** - Sends encouraging nudges when tasks stall
- **Report Agent** - Generates daily progress summaries at 8 PM

### Additional Features
- ⚡ Real-time agent activity feed
- 📈 Progress tracking with velocity metrics
- 💬 AI-generated comments on tasks
- 🎨 Modern, gradient-based UI
- 📱 Fully responsive design
- 🔄 Event-driven architecture for scalability

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** (App Router) - React framework with server-side rendering
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling with custom gradients
- **Lucide React** - Beautiful icon library

### Backend
- **Next.js Server Actions** - Server-side mutations
- **Inngest** - Event-driven workflow orchestration
- **OpenAI API** (GPT-4o-mini) - AI task generation
- **Firebase Auth** - User authentication

### Database
- **PostgreSQL** - Primary database (via Neon)
- **Prisma ORM** - Type-safe database client

### Infrastructure
- **Vercel** - Hosting platform (ready to deploy)
- **Firebase** - Authentication services
- **Neon** - Serverless PostgreSQL

---

## 🏗️ Architecture

```
┌─────────────┐
│   User      │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────┐
│  Next.js Frontend (React)   │
│  - Pages & Components       │
│  - Client-side Firebase     │
└──────────┬──────────────────┘
           │
           ▼
┌─────────────────────────────┐
│  Next.js Server Actions     │
│  - Authentication           │
│  - Project CRUD             │
│  - Session Management       │
└──────────┬──────────────────┘
           │
           ├──────────┬──────────────────┐
           ▼          ▼                  ▼
    ┌──────────┐  ┌──────────┐   ┌──────────────┐
    │ Prisma   │  │ Inngest  │   │  OpenAI API  │
    │   ORM    │  │  Events  │   │   (GPT-4)    │
    └────┬─────┘  └────┬─────┘   └──────────────┘
         │             │
         ▼             ▼
    ┌──────────┐  ┌────────────────────┐
    │PostgreSQL│  │   AI Agents        │
    │ Database │  │  - Planner         │
    │          │  │  - Risk            │
    │          │  │  - Motivation      │
    │          │  │  - Report          │
    └──────────┘  └────────────────────┘
```
## 📁 Folder Structure

```
ai-project-manager/
│
├── prisma/
│   └── schema.prisma              # Database schema (User, Project, Task, Event models)
│
├── src/
│   ├── app/
│   │   ├── (auth)/                # Auth route group (login/signup)
│   │   │   ├── login/
│   │   │   │   └── page.tsx      # Login page with email + Google auth
│   │   │   └── signup/
│   │   │       └── page.tsx      # Signup page with email + Google auth
│   │   │
│   │   ├── actions/
│   │   │   ├── auth.ts           # Server actions: user sync, sign out
│   │   │   └── project.ts        # Server actions: CRUD with user filtering
│   │   │
│   │   ├── api/
│   │   │   ├── inngest/
│   │   │   │   └── route.ts      # Inngest webhook endpoint for agent events
│   │   │   └── auth/
│   │   │       └── session/
│   │   │           └── route.ts  # Session management API
│   │   │
│   │   ├── dashboard/
│   │   │   └── page.tsx          # User dashboard with project list
│   │   │
│   │   ├── project/
│   │   │   └── [id]/
│   │   │       └── page.tsx      # Project detail with Kanban board
│   │   │
│   │   ├── globals.css           # Global styles + Tailwind directives
│   │   ├── layout.tsx            # Root layout component
│   │   └── page.tsx              # Landing/home page
│   │
│   ├── components/
│   │   ├── AgentActivity.tsx     # Displays agent event feed
│   │   ├── AuthButton.tsx        # User avatar + sign out button
│   │   ├── CreateProjectForm.tsx # Project creation form with AI prompt
│   │   ├── DailySummary.tsx      # Daily metrics and AI insights widget
│   │   ├── KanbanBoard.tsx       # 4-column Kanban with task cards
│   │   ├── ProjectList.tsx       # Grid of project cards with stats
│   │   └── TaskCard.tsx          # Individual task card with status icon
│   │
│   ├── inngest/
│   │   └── functions/
│   │       ├── index.ts          # Exports all agent functions
│   │       ├── planner-agent.ts  # Generates tasks from project goal
│   │       ├── risk-agent.ts     # Monitors tasks for blockers/delays
│   │       ├── motivation-agent.ts # Sends encouraging nudges
│   │       └── report-agent.ts   # Daily summary generation (8 PM cron)
│   │
│   ├── lib/
│   │   ├── auth/
│   │   │   └── session.ts        # JWT session management (create/get/delete)
│   │   │
│   │   ├── firebase/
│   │   │   ├── config.ts         # Firebase client initialization
│   │   │   └── auth.ts           # Auth helpers (signIn, signUp, signOut)
│   │   │
│   │   ├── inngest/
│   │   │   └── client.ts         # Inngest client configuration
│   │   │
│   │   ├── prisma.ts             # Prisma client singleton
│   │   └── utils.ts              # Utility functions (date formatting, etc.)
│   │
│   └── middleware.ts             # Route protection + auth redirects
│
├── .env                           # Environment variables (not in git)
├── .env.example                   # Example env file with all required keys
├── .gitignore                     # Git ignore rules
├── next.config.js                 # Next.js configuration
├── package.json                   # Dependencies and scripts
├── postcss.config.mjs             # PostCSS + Tailwind configuration
├── tailwind.config.ts             # Tailwind CSS customization
├── tsconfig.json                  # TypeScript configuration
└── README.md                      # This file
```

---

## Demo
<img width="1573" height="730" alt="image" src="https://github.com/user-attachments/assets/f2a84299-a33a-454f-8256-18e10432a3d6" />

<img width="898" height="797" alt="image" src="https://github.com/user-attachments/assets/cf202c64-b4b3-476d-a2ef-dd53e5b613a5" />

---

## Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL database (or [Neon](https://neon.tech) account)
- Firebase project
- OpenAI API key

### Installation

```bash
# Clone repository
git clone https://github.com/yourusername/ai-project-manager.git
cd ai-project-manager

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Edit .env with your credentials

# Setup database
npx prisma generate
npx prisma db push

# Start development servers
# Terminal 1 - Inngest
npx inngest-cli@latest dev

# Terminal 2 - Next.js
npm run dev
```

Visit `http://localhost:3000` to see the app.

---

## AI Agents

### Planner Agent
Triggers on project creation. Breaks down goals into 8-15 actionable tasks with priorities, effort estimates, and dependencies.

### Risk Agent
Monitors task updates. Detects stalled tasks, blockers, and overdue high-priority items.

### Motivation Agent
Responds to risk events with encouraging, human-like messages to keep teams motivated.

### Report Agent
Runs daily at 8 PM. Generates progress summaries, velocity metrics, and actionable insights.

---

## Environment Variables

Create a `.env` file with the following:

```env
# Database
DATABASE_URL="postgresql://user:pass@host/db"

# OpenAI
OPENAI_API_KEY="sk-proj-xxxxx"

# Firebase (Public)
NEXT_PUBLIC_FIREBASE_API_KEY="AIzaSyXXX"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="app.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="project-id"

# Firebase Admin (Secret)
FIREBASE_ADMIN_PROJECT_ID="project-id"
FIREBASE_ADMIN_CLIENT_EMAIL="firebase-adminsdk@xxx.iam.gserviceaccount.com"
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nXXX\n-----END PRIVATE KEY-----\n"

# Inngest (use "test" for local dev)
INNGEST_EVENT_KEY="test"
INNGEST_SIGNING_KEY="test"

# Session
SESSION_SECRET="your-random-32-char-string"
```

See `.env.example` for complete configuration.


---

## Usage

1. **Sign up** with email or Google
2. **Create a project** with a clear goal (e.g., "Build a SaaS dashboard with analytics")
3. **Wait 10-15 seconds** for AI to generate tasks
4. **Manage tasks** on the Kanban board
5. **Review daily reports** at 8 PM automatically

---

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -m 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Open a Pull Request

---

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

---

## Support

- **Issues**: [GitHub Issues](https://github.com/PriyankTyagii/ai-project-manager/issues)
- **Documentation**: [Wiki](https://github.com/PriyankTyagii/ai-project-manager/wiki)

---
## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

### Code Style

- Use TypeScript for all new files
- Follow existing naming conventions
- Add comments for complex logic
- Update README if adding features
---

## Acknowledgments

Built with:
- [OpenAI](https://openai.com) - GPT-4 API
- [Inngest](https://www.inngest.com) - Event orchestration
- [Firebase](https://firebase.google.com) - Authentication
- [Vercel](https://vercel.com) - Hosting
- [Prisma](https://www.prisma.io) - Database ORM

---

**⭐ Star this repo if you find it useful!**
