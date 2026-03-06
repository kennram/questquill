# QuestQuill 🖋️✨

QuestQuill is a GenAI-powered reading application for kids, designed with a modern Pixar-inspired aesthetic. It creates personalized, interactive stories that turn reading into a magical adventure while providing deep pedagogical insights for teachers and parents.

## 🚀 Key Functionality & Mechanics

### 🌍 Marketing & Conversion
- **Pixar-Inspired High-Fidelity UX**: A cinematic landing page (`/`) featuring floating visual assets, tactile chunky buttons, and role-specific "Guide" entry paths.
- **📱 Mobile-First Excellence**: Fully responsive design optimized for small screens (e.g., iPhone 11). Includes adaptive navigation, vertically-stacked hero sections, and full-screen modals for a seamless touch experience.
- **Stripe Legendary Upgrades**: 
    - **Tiered Plans**: Support for Family and Classroom subscription tiers.
    - **Instant Magic Activation**: Robust webhook-powered backend that instantly promotes users to "Legendary" status upon successful payment.
    - **Self-Service Billing**: Integrated customer billing portal for subscription management.

### 🎓 Classroom Infrastructure & Auth
- **Human-Readable Class Codes**: Teachers generate production-grade, high-entropy codes (e.g., `SILVER-FOX-205`) for frictionless classroom entry.
- **Cookie-Based Student Sessions**: Students login via Class Code without email/password. Sessions are maintained via secure, persistent `student_session` cookies.
- **Dual-Auth API Layer**: Backend endpoints detect both standard Supabase User auth and Student Session cookies, utilizing `supabaseAdmin` to ensure data persistence across all roles.

### 🧠 Parent & Teacher Directed AI
- **Family Quest Hub (Parents Only)**: A dedicated mission control center where parents can set personalized goals for each explorer. Missions set here are exclusive to the family environment.
- **Class Missions (Teachers)**: Teachers manage shared curriculum goals for the entire classroom through the **Insights Hub**.
- **Smart Mission Injection**: Selected missions are directly "injected" into the AI's core instructions, ensuring the story revolves around the chosen theme while using the child's interests as creative "flavor."

### 📜 Magical Quest Log
- **Unified Mission Tracking**: A central scroll that tracks active Family Quests and Class Missions in one place.
- **Deep-Linked Adventures**: Clicking any active quest in the log instantly opens the **Quest Wizard** with that mission pre-selected and highlighted.
- **Mastery History**: A persistent record of every completed mission. Real-time **Local State Masking** ensures quests move from "Active" to "Mastered" the moment they are finished, providing instant gratification.

### 📖 High-Fidelity Storytelling
- **Two Story Modes**: 
    - **Classic**: A guided 5-page narrative journey.
    - **Interactive**: A branching "Choose Your Own Adventure" shaped by student choices.
- **Intelligent Quest Wizard**: A smart creation modal that dynamically filters out already mastered missions, preventing repetitive content and "gaming" of the system. **Optimized for mobile** with full-screen layouts and large touch targets.
- **Gemini 2.0 Flash Engine**: High-performance generation with **Validated JSON structures** to prevent "empty magic book" errors.
- **Reading Gates**: Comprehension-gated progression—students must solve challenges (Vocabulary, Inference, etc.) to unlock the next chapter.

### 🗺️ Interactive World Map
- **Spatial Progress**: A persistent map where students unlock stickers and discover landmarks through reading.
- **The Trophy Room & Word Bank**: Permanent vaults tracking every adventure written and every word mastered.

### 📊 Pedagogical Analytics
- **Real-Time Performance Tracking**: Monitors success rates across different comprehension types (Vocabulary, Inference, Literal, Creative).
- **Struggle Alerts**: Automatically flags students needing support and provides research-backed classroom strategy suggestions.

### 📱 Mobile & Cross-Device Optimization
- **Responsive Layout Architecture**: Optimized for all screen sizes, from desktop monitors to small-form devices like the iPhone 11.
- **Adaptive Navigation**: Compact, thumb-friendly navigation bar that prevents overflow and keeps primary actions accessible.
- **Full-Screen Touch Interface**: Modals and reading views utilize full-screen layouts on mobile to maximize readability and interaction surface area.
- **Fluid Typography & Padding**: Dynamic scaling of text and spacing to preserve the "toy-like" Pixar aesthetic without compromising legibility on small screens.

---

## 🎨 Design System ("Pixar-Inspired")
*   **Tactile Depth**: UI elements feature `border-b-[8px]` depth that "presses" on interaction.
*   **The Soft Corner**: Consistent `rounded-[48px]` radius for a toy-like, safe aesthetic.
*   **Responsive Fluidity**: Adaptive padding and typography that preserves the "toy-like" feel on both massive monitors and small mobile devices.
*   **The Magic Hour Palette**: Sky Blue (#0EA5E9), Magic Purple (#9333EA), and Sunset Orange (#F97316).

---

## 🛠️ Tech Stack
- **Framework**: Next.js 16 (App Router)
- **Runtime**: React 19
- **Styling**: Tailwind CSS v4
- **Database**: Supabase (PostgreSQL)
- **AI Integration**: Google Gemini 2.0 SDK, Pollinations AI (Fallback & Image Generation)
- **Payments**: Stripe API

---

## ⚙️ Getting Started

### 1. Environment Variables (`.env.local`)
Create a `.env.local` file with the following keys:
```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
GEMINI_API_KEY=...
ELEVENLABS_API_KEY=...
STRIPE_SECRET_KEY=...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=...
STRIPE_WEBHOOK_SECRET=...
```

### 2. Database Schema Patch
Execute the following SQL in your Supabase Editor to ensure all pedagogical columns are present:
```sql
ALTER TABLE children ADD COLUMN IF NOT EXISTS reading_level INTEGER DEFAULT 1;
ALTER TABLE children ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE children ADD COLUMN IF NOT EXISTS last_completed_mission TEXT;
ALTER TABLE children ADD COLUMN IF NOT EXISTS assigned_missions TEXT[];
```

### 3. Installation
```bash
npm install
npm run dev
```

---

## 🚀 Roadmap & Future Quests
- [x] **🏠 Family Quest Hub**: Individualized mission management for parents.
- [x] **📜 Magical Quest Log**: Unified tracking for classroom and home goals.
- [x] **🎓 Student Auth Model**: Class code login and cookie sessions.
- [x] **🎙️ Cinematic Narration**: Integration with ElevenLabs for high-fidelity storytelling voices.
- [ ] **🧠 Live LLM Pedagogical Advisor**: Upgrade struggle alerts to analyze *why* a student is struggling.
- [ ] **🎨 Student Experience Polish**: Add tactile "toy-like" sound effects and enhanced animation.
- [ ] **🎙️ Voice-to-Adventure**: Implement Speech-to-Text for story answers.

---

## 📜 License
MIT License. © 2026 QuestQuill Adventure Studios.
