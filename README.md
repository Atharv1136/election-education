# ElectIQ – Your Election Guide Assistant

**"Understand Your Vote. Shape Your Future."**

ElectIQ is an AI-powered, full-stack civic education web application designed to help users understand the election process, timelines, voting steps, candidate information, and civic participation — in an interactive, accessible, and easy-to-follow way.

## 🌟 Chosen Vertical: Civic Education / Election Guide

In a thriving democracy, informed voters are the foundation of good governance. ElectIQ bridges the information gap by providing a modern, interactive, and intelligent platform for civic education. It caters to first-time voters, NRIs, and returning voters by simplifying complex electoral processes.

## 🧠 Approach and Logic

ElectIQ is built with a modern, scalable, and AI-first architecture:

1. **AI-Powered Guidance**: Integrated **Google Gemini API (gemini-2.0-flash)** as a core feature. The AI assistant acts as a personalized civic tutor, capable of answering specific questions about electoral laws, processes, and voting rights, using a strict system prompt to ensure neutrality and factual accuracy.
2. **Serverless Backend & Realtime Data**: Powered by **Supabase** (PostgreSQL). The database stores all civic data (timelines, steps, FAQs, glossary) and user-specific data (quiz scores, chat history). 
3. **Secure Authentication**: Uses **Supabase Auth with Google OAuth** to provide a seamless login experience. Row Level Security (RLS) ensures users can only access their own chat histories and quiz scores.
4. **Premium UI/UX**: Built with **React** and **Tailwind CSS v4**. The design system features a deep civic blue (`#1A3C6E`) and democratic gold (`#F5A623`) palette, glassmorphism elements, subtle micro-animations, and full mobile responsiveness.

## 🚀 How the Solution Works

1. **Landing & Discovery**: Users arrive at the Home page, greeted by an animated civic-themed hero section. Quick links guide them to specific features.
2. **Election Timeline**: Users can track the complete lifecycle of General, State, or Local elections, complete with interactive accordion cards and a live countdown to the next major phase.
3. **How to Vote Guide**: A role-based step-by-step guide (First-Time, NRI, Re-registering) featuring an interactive document checklist to prepare users for polling day.
4. **AI Assistant**: Users interact with the Gemini-powered chat interface via text or voice (Web Speech API). Logged-in users have their chat sessions automatically saved and accessible from the sidebar.
5. **Civic Quiz**: A gamified multiple-choice quiz with a 30-second timer per question. Users receive immediate feedback and a final score badge (e.g., "Democracy Champion").
6. **Glossary**: A searchable dictionary of complex electoral terms, deeply linked to the AI assistant for further explanation.
7. **Personal Dashboard**: Authenticated users can track their quiz scores, resume past AI conversations, and monitor their voting readiness.

## 📌 Assumptions Made

- **India-Centric Data**: The pre-seeded database content (timelines, steps, FAQs, quiz, glossary) defaults to the Indian electoral system (Lok Sabha, ECI, EVM/VVPAT rules). However, the schema is generic enough to be adapted for other democratic systems.
- **Environment Context**: The app assumes modern browser support for features like the Web Speech API (for voice input) and Web Share API.
- **Stateless AI Chat**: The Gemini API implementation currently passes the full conversation history back and forth to maintain context during a session.

## 💻 Tech Stack

| Component | Technology | Description |
|-----------|------------|-------------|
| **Frontend** | React (Vite) | Fast, modern UI library |
| **Styling** | Tailwind CSS v4 | Utility-first CSS framework with custom design tokens |
| **Backend/DB** | Supabase | Managed PostgreSQL with Row Level Security (RLS) |
| **Authentication**| Supabase Auth | Google OAuth provider |
| **AI Integration** | Google Gemini API | `@google/generative-ai` SDK (`gemini-2.0-flash`) |
| **Icons** | Lucide React | Clean, consistent SVG icon set |

## 🛠️ Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/electiq.git
cd electiq
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
Create a `.env` file in the root directory and add your credentials (see `.env.example`):
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_GEMINI_API_KEY=your_gemini_api_key
```

*Note: You must configure Google OAuth in your Supabase project dashboard (Authentication -> Providers) for the login feature to work.*

### 4. Run the Development Server
```bash
npm run dev
```
The app will be available at `http://localhost:5173`.

### 5. Build for Production
```bash
npm run build
```

## 📁 Folder Structure

```text
electiq/
├── public/
│   └── favicon.ico
├── src/
│   ├── components/       # Reusable UI components (Navbar, Cards, Chat)
│   ├── hooks/            # Custom React hooks (useAuth)
│   ├── lib/              # Client initializers (Supabase, Gemini)
│   ├── pages/            # Main route components (Home, Quiz, Assistant...)
│   ├── App.jsx           # App wrapper & React Router config
│   ├── index.css         # Tailwind v4 theme & global animations
│   └── main.jsx          # Entry point
├── .env                  # Environment variables
├── package.json          # Project dependencies
├── vite.config.js        # Vite & Tailwind configuration
└── README.md             # Project documentation
```

## 📸 Screenshots

*(To be added after deployment: Add screenshots of the Home Page, AI Assistant, Timeline, and Quiz interfaces here)*

---
*Built with ❤️ for civic education.*
