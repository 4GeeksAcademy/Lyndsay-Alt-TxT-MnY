# About the Product  AI Usage Guide

This document defines the product vision, audience, purpose, and evolving direction of the application.  
It provides **contextual memory** for the AI to ensure all code and features align with the products goals and identity.

---

## AI Interaction Rules

1. **Always review this document before implementing, refactoring, or suggesting new features.**  
   Use this file to align development choices with the products intent, tone, and audience.

2. **When updating or refining product details:**
   - Edit only the relevant sections (Purpose, Target Audience, etc.).  
   - Maintain the existing Markdown heading structure.  
   - Avoid removing historical context unless its outdated or replaced with updated data.  
   - When a major change occurs (like a new direction or rebrand), summarize it in the Product Evolution Log.

3. **When adding new information:**
   - Place it under the correct section heading.  
   - Use clear, concise, human-readable language.  
   - Maintain professional tone and formatting consistency.

4. **Do not change section titles or structure.**
   - Keep this format intact so the AI can reliably read and update fields.

5. **Use dates for all updates.**
   - Include timestamps in Product Evolution Log whenever meaningful updates occur.

---

## Product Information Schema

Use the following structure to describe the product.  
Each section contains reserved comment blocks (`<!-- -->`) that signal where to write or edit content.

---

## Product Name
<!--
    Insert the official name of the product here.
-->

**BillTrack**



---

## Purpose / Mission
<!--
    Describe what the product is designed to accomplish and the core problem it solves.
-->

BillTrack is an interactive bill tracker that simplifies financial literacy by helping users visualize their bills, understand what they owe, and receive timely reminders so they never miss a payment.

**Problem Solved:**
- Users struggle to understand how bills work (due dates, payments, types)
- Difficulty tracking and managing budgets effectively
- Forgetting when bills are due, leading to missed payments and stress



---

## Target Audience
<!--
    Describe the intended users or market segments this product serves.
-->

Individuals who lack financial literacy or organizational tools for managing recurring bills. This includes:
- Young adults starting to manage their own finances
- People overwhelmed by multiple bill payment schedules
- Anyone seeking to reduce payment-related stress and improve financial awareness



---

## Core Value Proposition
<!--
    Summarize what makes the product valuable or unique compared to alternatives.
-->

BillTrack provides a simple, visual approach to bill management with integrated SMS reminders. Unlike complex budgeting apps, BillTrack focuses specifically on bill tracking clarity:
- Clear status indicators (Paid, Due Soon, Overdue, Upcoming)
- Category-based organization for easy mental mapping
- Proactive SMS notifications to prevent missed payments
- At-a-glance budget summary showing total obligations and progress



---

## MVP Objective
<!--
    Define the minimal feature set required for a viable launch.
    This should correspond to the MVP features in implementation-plan.md.
-->

Deliver a functional bill tracking system with three core features:

1. **Visual Bill Tracker** - Users can add and manage bills with clear status indicators organized by category
2. **Budget Summary Dashboard** - Real-time view of total monthly bills, paid amounts, remaining balance, and overall progress
3. **SMS Reminder System** - Users can save their phone number and enable/disable text reminders per bill

**Success Metric:** Users can accurately track and categorize at least 3+ bills with reminders enabled, reducing missed payment stress and increasing financial awareness.



---

## Long-Term Vision
<!--
    Describe future expansion goals, potential features, integrations, or business directions.
-->

**Post-MVP Enhancements:**
- Recurring bill automation (auto-populate monthly bills)
- Bank account integration for automatic payment detection
- Spending analytics and trend visualization
- Bill splitting for shared households
- Multi-currency support
- Educational content about bill types, late fees, and credit impact
- Mobile app versions (iOS/Android)



---

## Design & Experience Principles
<!--
    Define key design guidelines and user experience philosophies.
    Examples: simplicity, clarity, accessibility, modern UI, responsive layout, etc.
-->

- **Simplicity First:** Minimal cognitive load with clear, intuitive interfaces
- **Visual Clarity:** Color-coded status indicators and category organization for quick scanning
- **Accessibility:** Responsive design that works on all devices, readable typography, high contrast
- **Proactive Guidance:** SMS reminders and dashboard alerts to prevent user mistakes
- **Trust & Security:** Transparent data handling, especially for sensitive financial and phone information
- **Progressive Disclosure:** Show essential information first, details on demand



---

## Technical Overview
<!--
    List core technologies, frameworks, and platforms used (frontend, backend, database, hosting, etc.).
    Example: "Frontend: React + Vite | Backend: Flask | Database: Supabase | Deployment: Vercel MCP"
-->

**Confirmed Tech Stack:**

**Frontend:**
- React 19.2.0 (UI framework)
- Vite 7.2.4 (build tool and dev server)
- TypeScript 5.9.3 (type safety)
- Tailwind CSS 4.1.17 (styling)
- date-fns 4.1.0 (date manipulation)

**Backend & Database:**
- Supabase (PostgreSQL database, Authentication, Real-time, Edge Functions)
- @supabase/supabase-js 2.84.0 (JavaScript client)

**Code Quality:**
- ESLint 9.39.1 (linting)
- TypeScript ESLint (type checking)

**To Be Added:**
- **SMS Service:** Twilio (for bill reminders)
- **Form Handling:** React Hook Form (form validation)
- **State Management:** React Context API (built-in) or Zustand (if needed)
- **Deployment:** Vercel or Netlify (frontend hosting)
- **Cron Jobs:** Supabase pg_cron or external service for SMS reminders



---

## Product Structure Overview
<!--
    Optionally, summarize major app sections or components at a high level (e.g., Dashboard, Profile, Reports).
    This helps the AI understand the architecture contextually.
-->

**Main App Sections:**

1. **Dashboard (Home)** - Budget summary with key metrics (total bills, paid, remaining, progress)
2. **Bill List View** - Organized list of all bills with status indicators and category filters
3. **Add/Edit Bill Form** - Interface to create or modify bill details (name, amount, due date, category, SMS toggle)
4. **Settings/Profile** - Phone number configuration and notification preferences
5. **Bill Detail View** - Individual bill information with payment history and reminder settings



---

## Product Evolution Log
> _Chronological updates describing how the product concept, goals, or positioning have changed over time._

<!--
    Example:
    - 2025-10-08  Initial concept defined.
    - 2025-10-20  Added analytics and trend visualization to MVP scope.
-->

- **2025-11-20** - Initial product definition created based on MVP Product Planner. Core features identified: Visual Bill Tracker, Budget Dashboard, and SMS Reminder System.
- **2025-11-21** - Tech stack finalized: React 19 + Vite 7 + TypeScript + Tailwind CSS + Supabase. Ready for implementation.



---

## File Integrity Notes
- Preserve Markdown headings and section order.  
- Keep whitespace between sections.  
- Avoid embedding raw code here  this file is conceptual, not technical.  
- AI should write clear, concise, descriptive English.  
- Always timestamp meaningful updates.
