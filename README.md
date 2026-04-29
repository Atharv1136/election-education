<div align="center">

# 🗳️ ElectIQ — Understand Your Vote, Shape Your Future

**Your AI-powered civic education companion for Indian elections**

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white&style=flat-square)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white&style=flat-square)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?logo=tailwind-css&logoColor=white&style=flat-square)](https://tailwindcss.com)
[![Supabase](https://img.shields.io/badge/Supabase-Backend-3ECF8E?logo=supabase&logoColor=white&style=flat-square)](https://supabase.com)
[![Gemini AI](https://img.shields.io/badge/Google_Gemini-2.0_Flash-4285F4?logo=google&logoColor=white&style=flat-square)](https://ai.google.dev)

> ElectIQ is a full-stack civic education web application that empowers Indian voters — especially first-timers, NRIs, and young citizens — with an AI-powered assistant, interactive election timelines, step-by-step voting guides, civic quizzes, a searchable election glossary, and a personal learning dashboard.

</div>

---

## 📋 Table of Contents

- [✨ Features](#-features)
- [🏗️ Architecture](#️-architecture)
- [📂 Project Structure](#-project-structure)
- [🛣️ Pages & Routes](#️-pages--routes)
- [🤖 AI Assistant — How It Works](#-ai-assistant--how-it-works)
- [🔐 Authentication](#-authentication)
- [🎨 Design System](#-design-system)
- [🚀 Getting Started](#-getting-started)
- [⚙️ Environment Variables](#️-environment-variables)
- [🧱 Tech Stack](#-tech-stack)
- [📡 Deployment](#-deployment)

---

## ✨ Features

| Feature | Description |
|---|---|
| 🤖 **AI Assistant** | Real-time streaming chat powered by **Google Gemini 2.0 Flash**. Answers questions about Indian elections, EVMs, voter rights, Model Code of Conduct, Form 6, and more. Civic-focused system prompt ensures relevant, accurate answers. |
| 📅 **Election Timeline** | Interactive visual timeline of every Indian election phase — announcement, nominations, campaigning, polling, counting, and results. |
| 🗺️ **How to Vote** | Step-by-step guides for **First-Time Voters**, **NRI Voters**, and **Re-registering Voters**, with downloadable document checklists and FAQs. |
| 🧠 **Civic Quiz** | MCQ quiz with multiple difficulty levels, countdown timers, instant answer feedback with explanations, score sharing, and emoji badge system. |
| 📖 **Election Glossary** | Searchable A–Z dictionary of Indian election terms — EVM, VVPAT, NOTA, MCC, EPIC, Form 6, and more — with one-click "Ask the assistant" deep-linking. |
| 📊 **User Dashboard** | Authenticated users see their quiz history, recent AI chat sessions, and voter readiness quick-links. |
| 🔐 **Auth** | Google OAuth via Supabase Auth. Session-aware UI — sign in to save quiz scores and chat history. |

---

## 🏗️ Architecture

```
┌──────────────────────────────────────────────────────┐
│                    Browser (Client)                   │
│                                                      │
│   React 19 + Vite 8                                  │
│   React Router DOM v7  (SPA routing)                 │
│   Tailwind CSS v4      (utility-first styling)       │
│   Lucide React         (icons)                       │
└──────────────┬───────────────────────────┬───────────┘
               │                           │
               ▼                           ▼
    ┌──────────────────┐       ┌────────────────────────┐
    │  Supabase        │       │  Google Gemini API     │
    │  ┌─────────────┐ │       │  gemini-2.0-flash      │
    │  │  Auth       │ │       │  Streaming chat        │
    │  │  (Google    │ │       │  Civic system prompt   │
    │  │   OAuth)    │ │       └────────────────────────┘
    │  ├─────────────┤ │
    │  │  Postgres   │ │
    │  │  (RLS-      │ │
    │  │  protected) │ │
    │  └─────────────┘ │
    └──────────────────┘
```

**Key decisions:**
- **Client-side AI calls** — Gemini API is called directly from the browser using the `@google/generative-ai` SDK, with streaming responses rendered in real-time.
- **Supabase for everything else** — Auth (Google OAuth), user profiles, quiz scores, and chat history — all protected by Row Level Security (RLS).
- **No separate backend** — This is a pure frontend SPA deployed on any static host (Vercel, Netlify, Cloudflare Pages).

---

## 📂 Project Structure

```
election-education/
├── public/
│   ├── favicon.svg
│   └── icons.svg
│
├── src/
│   ├── components/              # Reusable UI components
│   │   ├── Navbar.jsx           # Responsive top navigation with auth state
│   │   ├── Footer.jsx           # Site footer
│   │   ├── ChatAssistant.jsx    # AI chat UI with streaming message rendering
│   │   ├── QuizCard.jsx         # Individual quiz question card
│   │   ├── TimelineCard.jsx     # Election phase card for timeline view
│   │   ├── StepCard.jsx         # Numbered step card for voting guides
│   │   └── GlossaryItem.jsx     # Term definition card with "Ask" button
│   │
│   ├── pages/                   # Route-level page components
│   │   ├── Home.jsx             # 🏠 Landing page — hero, features, quiz teaser
│   │   ├── Assistant.jsx        # 🤖 AI chat interface
│   │   ├── ElectionTimeline.jsx # 📅 Election phase timeline
│   │   ├── HowToVote.jsx        # 🗺️ Voting guides + checklist + FAQ
│   │   ├── Quiz.jsx             # 🧠 Interactive civic quiz
│   │   ├── Glossary.jsx         # 📖 Searchable A–Z glossary
│   │   └── Dashboard.jsx        # 📊 Personal user dashboard (auth required)
│   │
│   ├── hooks/
│   │   └── useAuth.js           # Custom hook: user session, signIn, signOut
│   │
│   ├── lib/
│   │   ├── geminiClient.js      # Google Gemini AI — streamChat() & quickChat()
│   │   └── supabaseClient.js    # Supabase client instance
│   │
│   ├── assets/
│   │   ├── hero.png             # Landing page hero image
│   │   ├── react.svg
│   │   └── vite.svg
│   │
│   ├── App.jsx                  # Root component with BrowserRouter + Routes
│   ├── App.css                  # Component-level styles
│   ├── index.css                # Global styles, Tailwind directives, design tokens
│   └── main.jsx                 # React DOM entry point
│
├── .env.example                 # Template for required environment variables
├── .gitignore
├── eslint.config.js
├── index.html                   # HTML entry point
├── package.json
└── vite.config.js               # Vite build configuration
```

---

## 🛣️ Pages & Routes

### `/` — Home (Landing Page)
- Hero section with gradient background and animated CTA buttons.
- Feature highlights: AI Assistant, Election Timeline, How to Vote.
- Quiz teaser section with a live sample question.
- Testimonials from users.
- Stats banner (questions answered, users, elections covered).

### `/assistant` — AI Chat
- Full-page streaming chat interface built on **Google Gemini 2.0 Flash**.
- Shows suggested starter prompts on first load (e.g., "How does an EVM work?", "What are my rights on voting day?").
- Messages stream token-by-token for a real-time typing effect.
- Authenticated users have their full conversation history saved to Supabase.
- Voice input support via the Web Speech API (`lang: "en-IN"`).

### `/timeline` — Election Timeline
- Visual vertical timeline of every election phase with icons.
- Phase cards expand/collapse to show detailed descriptions.
- Live countdown timer to the next upcoming phase.
- Filter by election type: General, State, Local, By-Election.
- Share and print buttons.

### `/how-to-vote` — Voting Guide
- **Three voter type tabs**: First-Time Voter / NRI Voter / Re-registering Voter.
- Numbered step cards with icons, descriptions, and links to official portals.
- **Interactive document checklist** — tick off items, download as `.txt`.
- **FAQ accordion** with common voter questions.
- Deep-link to AI assistant for unanswered questions.

### `/quiz` — Civic Quiz
Three-stage flow:
1. **Intro** — select difficulty (Easy / Medium / Hard), click Start.
2. **Playing** — 10 randomized questions, 30 seconds per question. Selecting an answer reveals correct/incorrect state + explanation text.
3. **Results** — score out of 10, badge (🥇 Democracy Champion / 🥈 Informed Voter / 🥉 Beginner), answer review, share score, retake option. Authenticated users have scores saved.

### `/glossary` — Election Glossary
- Loads all election terms from Supabase.
- **A–Z alphabet filter** — only active for letters with available terms.
- **Real-time search** across term names and definitions.
- "Ask the assistant about this" button deep-links to `/assistant` with a pre-filled query.

### `/dashboard` — User Dashboard *(Auth Required)*
- Redirects to auth flow if not signed in.
- Welcome card with user display name.
- **My Quiz Scores** — last 20 quiz attempts with score and difficulty badge.
- **Recent Conversations** — last 8 AI chat sessions with preview of first message.
- **Voter Readiness** quick-links to Timeline, How to Vote, and Glossary.

---

## 🤖 AI Assistant — How It Works

The Gemini client is in `src/lib/geminiClient.js` and exports two functions:

### `streamChat(messages)` — Used in the chat interface
Builds a history array from all previous messages, starts a Gemini chat session, and sends the latest user message as a **streaming request**:

```js
const chat = model.startChat({ history: chatHistory })
const result = await chat.sendMessageStream(lastMessage)
return result.stream  // AsyncGenerator<GenerateContentStreamResult>
```

The `Assistant.jsx` component iterates over the stream and appends each text chunk to the message in real-time.

### `quickChat(prompt)` — For single one-off generations
```js
const result = await model.generateContent(prompt)
return result.response.text()
```

### System Prompt
The AI is constrained by a detailed system prompt that:
- Limits responses strictly to **elections, voting, democracy, and civic rights**.
- Defaults to **Indian elections** but is knowledgeable globally.
- Provides accurate info on ECI, EVMs, VVPAT, voter registration, and electoral law.
- Cites constitutional articles where relevant.
- **Never expresses political opinions or favors any party/candidate**.
- Redirects off-topic questions politely.

---

## 🔐 Authentication

Authentication is handled by the `useAuth` custom hook (`src/hooks/useAuth.js`):

```js
const { user, loading, signInWithGoogle, signOut } = useAuth()
```

**Flow:**
1. On mount, calls `supabase.auth.getSession()` to restore any existing session.
2. Subscribes to `supabase.auth.onAuthStateChange` for real-time session updates.
3. `signInWithGoogle()` triggers Supabase's OAuth flow with redirect back to the app origin.
4. `signOut()` clears the Supabase session.

**What auth unlocks:**
- Chat history saved to `chat_history` table (RLS: user sees only their own rows).
- Quiz scores saved to `quiz_scores` table (RLS: user sees only their own rows).
- Personal dashboard with history and progress.

---

## 🎨 Design System

Defined in `src/index.css` using Tailwind CSS v4's `@theme` directive and CSS custom properties (oklch color space).

### Color Palette
| Token | Value | Usage |
|---|---|---|
| `--primary` | `oklch(0.36 0.09 255)` — Deep Civic Blue | Buttons, links, nav active states |
| `--accent` | `oklch(0.78 0.16 70)` — Democratic Gold | Highlights, badges, hover accents |
| `--background` | Warm near-white `oklch(0.985 0.005 95)` | Page backgrounds |
| `--success` | `oklch(0.68 0.17 145)` — Green | Correct answers, success states |
| `--destructive` | `oklch(0.62 0.22 25)` — Red | Wrong answers, errors |

Full **dark mode** support with adjusted oklch values.

### Gradients
- **`bg-gradient-hero`** — 135° deep blue → blue-purple (buttons, hero, icon backgrounds)
- **`bg-gradient-accent`** — 135° gold → gold-glow (accent CTAs)
- **`bg-gradient-soft`** — 180° subtle warm-to-blue (page hero backgrounds)

### Animations
- **`animate-float-slow`** — 8-second floating effect for hero decorative elements
- **`animate-pulse-dot`** — Staggered dot animation for AI "thinking" indicator

### Typography
- **Primary font:** `Inter` (weights 400–800) via Google Fonts
- **Monospace font:** `JetBrains Mono` for countdowns and code snippets

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** v18+
- A **Supabase** project (free tier works)
- A **Google Gemini API key** (free at [ai.google.dev](https://ai.google.dev))

### 1. Clone the Repository

```bash
git clone https://github.com/Atharv1136/election-education.git
cd election-education
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

```bash
cp .env.example .env
```

Edit `.env` with your keys (see [Environment Variables](#️-environment-variables)).

### 4. Set Up Supabase

In your Supabase project, run the following SQL to create the required tables:

<details>
<summary>📋 Click to expand Supabase SQL Setup</summary>

```sql
-- Profiles (auto-created on sign-up)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users manage own profile" ON public.profiles FOR ALL USING (auth.uid() = id);

-- Trigger to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, avatar_url)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email,'@',1)), NEW.raw_user_meta_data->>'avatar_url');
  RETURN NEW;
END;
$$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Quiz scores (private per user)
CREATE TABLE public.quiz_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  score INT NOT NULL,
  total INT NOT NULL,
  difficulty TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.quiz_scores ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users own scores" ON public.quiz_scores FOR ALL USING (auth.uid() = user_id);

-- Chat history (private per user)
CREATE TABLE public.chat_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  session_id UUID NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user','assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.chat_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users own chats" ON public.chat_history FOR ALL USING (auth.uid() = user_id);
```

</details>

Enable **Google OAuth** in Supabase: `Authentication → Providers → Google → Enable`.

### 5. Start Development Server

```bash
npm run dev
```

App runs at `http://localhost:5173` (or `5174` if 5173 is in use).

---

## ⚙️ Environment Variables

Create a `.env` file in the project root (copy from `.env.example`):

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
VITE_GEMINI_API_KEY=your_google_gemini_api_key_here
```

| Variable | Where to get it |
|---|---|
| `VITE_SUPABASE_URL` | Supabase Dashboard → Project Settings → API → Project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase Dashboard → Project Settings → API → `anon` `public` key |
| `VITE_GEMINI_API_KEY` | [Google AI Studio](https://aistudio.google.com/app/apikey) |

> ⚠️ **Never commit `.env` to git.** It is listed in `.gitignore`. Use `.env.example` as a safe template.

---

## 🧱 Tech Stack

| Technology | Version | Role |
|---|---|---|
| **React** | 19 | UI framework |
| **Vite** | 8 | Build tool & dev server |
| **React Router DOM** | 7 | Client-side SPA routing |
| **Tailwind CSS** | v4 | Utility-first styling |
| **Supabase JS** | 2.x | Auth + database client |
| **Google Generative AI** | Latest | Gemini 2.0 Flash streaming |
| **Lucide React** | 1.x | Icon library |
| **ESLint** | 10 | Code linting |

---

## 📡 Deployment

This is a standard Vite SPA — deploy anywhere that serves static files.

### Build

```bash
npm run build
# Output: dist/
```

### Deploy to Vercel (Recommended)

```bash
npm i -g vercel
vercel --prod
```

Set environment variables in Vercel Dashboard → Project → Settings → Environment Variables.

### Deploy to Netlify

1. Connect your GitHub repo to Netlify.
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Add env vars in Netlify → Site Settings → Environment Variables.

### Deploy to Cloudflare Pages

1. Connect repo in Cloudflare Pages dashboard.
2. Build command: `npm run build`
3. Output directory: `dist`
4. Add env vars under Settings → Environment Variables.

> **Important:** For client-side routing (React Router), configure your host to redirect all 404s to `index.html`. On Netlify, add a `public/_redirects` file: `/* /index.html 200`.

---

<div align="center">

Built with ❤️ by **[Atharv Bhosale](https://github.com/Atharv1136)**

**ElectIQ** — Because an informed voter is an empowered voter. 🗳️

</div>
