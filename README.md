Cosmog

AI-powered workflow diagnosis tool. Answer 5 structured questions about how you work, and Cosmog identifies your real bottlenecks, the root cause connecting them, and three concrete actions to fix them — instead of generic productivity advice.

Live demo: cosmog-theta.vercel.app

How it works


Structured interview — User answers 5 questions about their role and friction points. Questions adapt based on role (engineer vs. designer vs. sales).
AI analysis — Responses are sent to Google's Gemini API, which is prompted to act as a workflow consultant and identify patterns across the answers.
Diagnosis output — The model returns the top issues, the root cause linking them, and 3 specific actions tailored to the user's context.


Tech stack


Framework: Next.js 16 (App Router), React 19, TypeScript
Styling: Tailwind CSS 4
AI: Google Gemini (@google/generative-ai)
Deployment: Vercel


Getting started

bashgit clone https://github.com/suprith41/cosmog.git
cd cosmog
npm install

Create a .env.local file in the project root:

GEMINI_API_KEY=your_key_here


Get a free key from Google AI Studio.



Run the dev server:

bashnpm run dev

Open http://localhost:3000.

Roadmap


 Save/share diagnosis results
 Add more role-specific question sets
 Track diagnosis history over time
