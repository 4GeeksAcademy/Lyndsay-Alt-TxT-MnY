# Implementation Plan  AI Usage Guide

This document serves as a **living implementation record** for the project.  
It defines all planned and completed features, milestones, and technical steps required to reach and evolve the MVP.

---

## AI Interaction Rules

1. **Always read this file before beginning any new feature or code change.**  
   Use it to understand what features exist, their current status, and dependencies.

2. **When adding a new feature:**
   - Duplicate the Feature Implementation Plan Model shown below.  
   - Replace all placeholder fields (`[Feature Name]`, etc.) with real details.  
   - Insert the new feature under the appropriate section (MVP, Post-MVP, or Other).  
   - Maintain consistent formatting.

3. **When updating progress:**
   - Update the **Status** field.  
   - Check off relevant items in **Implementation Steps** and **Acceptance Criteria**.  
   - Update the **Last Updated** date.  
   - If implementation details evolve, expand the Technical Breakdown or Testing Notes.

4. **When completing a major milestone (e.g., MVP deployment):**
   - Add a short summary entry at the bottom under Development Notes describing what changed or was achieved.

5. **Do not delete or overwrite past feature sections.**
   - Instead, mark them as Complete and update the timestamp.
   - This document should reflect a chronological record of development history.

---

## Feature Implementation Plan Model

Use this exact structure when creating or updating feature entries.

### Example Template

## Feature: [Feature Name]

**Purpose:**  
_Describe the intent and reason for this feature._

**User Story / Use Case:**  
_As a [user type], I want to [perform an action] so that I can [achieve benefit]._

**Dependencies / Prerequisites:**  
_List related systems, APIs, libraries, or other features required before this one can function._

**Technical Breakdown:**  
- _Frontend components/pages to build_  
- _Backend endpoints or database tables needed_  
- _Key logic or architectural notes_  

**Implementation Steps:**  
- [ ] Step 1: _Define or set up structure_  
- [ ] Step 2: _Build primary functionality_  
- [ ] Step 3: _Integrate with data sources or APIs_  
- [ ] Step 4: _Add validations/tests_  
- [ ] Step 5: _UI/UX refinements_

**Acceptance Criteria:**  
- [ ] _Feature works as intended_  
- [ ] _No errors in console/build_  
- [ ] _Responsive layout verified_  
- [ ] _Feature integrated with related systems_

**Testing & Validation Notes:**  
_Specify how to test functionality and what tools to use._

**Post-Implementation Actions:**  
_Follow-ups such as documentation, styling, or refactoring._

**Status:** Not Started / In Progress / Blocked / Complete  
**Last Updated:** YYYY-MM-DD

---

# Implementation Sections

Below are the main phases of implementation.  
Each section contains **reserved space** where the AI (or a developer) should insert detailed feature entries using the model above.

---

## Recommended Tech Stack

**Required Technology:**
- **Database & Backend Services:** Supabase (PostgreSQL database, Authentication, Real-time subscriptions, Storage)

**Recommended Frontend Stack:**
- **Framework:** React with Vite (fast build tool, modern development experience)
- **Language:** JavaScript or TypeScript (TypeScript recommended for type safety)
- **Styling:** Tailwind CSS (utility-first, responsive design, fast development)
- **State Management:** React Context API or Zustand (lightweight state management)
- **Form Handling:** React Hook Form (efficient form validation)
- **Date Management:** date-fns or Day.js (lightweight date utilities)
- **HTTP Client:** Supabase Client SDK (built-in for database operations)

**Recommended Backend/API Stack:**
- **API Layer:** Supabase Edge Functions (serverless TypeScript/JavaScript functions)
- **Authentication:** Supabase Auth (built-in email/password, OAuth providers)
- **Database:** Supabase PostgreSQL (with Row Level Security policies)
- **Real-time:** Supabase Realtime (for live dashboard updates)

**SMS Integration:**
- **SMS Service:** Twilio (reliable, well-documented, free trial available)
- **Alternative:** AWS SNS, MessageBird, or Vonage

**Scheduled Jobs:**
- **Cron Service:** Supabase Edge Functions with pg_cron extension, or external service like Cron-job.org, EasyCron
- **Alternative:** GitHub Actions scheduled workflows, or Vercel Cron Jobs

**Deployment:**
- **Frontend Hosting:** Vercel (seamless GitHub integration, auto-deploys) or Netlify
- **Backend:** Supabase (fully managed, includes hosting for Edge Functions)
- **Environment Variables:** Managed through hosting platform (.env files locally)

**Development Tools:**
- **Version Control:** Git + GitHub
- **Package Manager:** npm or pnpm
- **Code Quality:** ESLint, Prettier
- **Testing:** Vitest (unit tests), React Testing Library (component tests)

**Architecture Pattern:**
- **Frontend:** Component-based architecture with React
- **Backend:** Serverless functions + Direct Supabase client calls
- **Database:** PostgreSQL with Supabase (Row Level Security for multi-user support)
- **Authentication:** Supabase Auth (if multi-user) or localStorage (single-user MVP)

**Rationale:**
- Supabase provides database, auth, real-time, and serverless functions in one platform
- React + Vite offers fast development with modern tooling
- Tailwind CSS accelerates UI development with responsive design
- Twilio is industry-standard for SMS with excellent documentation
- Vercel provides seamless deployment with zero configuration

---

## MVP Features
> _Core functionalities required to achieve a Minimum Viable Product._

---

## Feature: User Phone Number Registration

**Purpose:**  
Enable users to register their phone number for SMS reminder functionality. This is the foundational requirement for the notification system.

**User Story / Use Case:**  
As a new user, I want to enter and save my phone number so that I can receive SMS reminders for my bills.

**Dependencies / Prerequisites:**  
- Database schema design
- Phone number validation library
- Basic user storage mechanism (localStorage or database user table)

**Technical Breakdown:**  
- **Frontend:** Phone input component with country code selector and validation
- **Backend:** User settings endpoint (POST/PUT `/api/user/phone`)
- **Database:** `users` table with fields: `id`, `phone_number`, `country_code`, `phone_verified`, `created_at`
- **Validation:** E.164 phone format validation, duplicate phone check

**Implementation Steps:**  
- [ ] Step 1: Design database schema for user/phone storage
- [ ] Step 2: Create phone input UI component with validation
- [ ] Step 3: Build backend endpoint to save/update phone number
- [ ] Step 4: Add client-side validation (format, required field)
- [ ] Step 5: Implement error handling for invalid/duplicate numbers
- [ ] Step 6: Add success confirmation message

**Acceptance Criteria:**  
- [ ] User can enter phone number with country code
- [ ] Phone number is validated before submission
- [ ] Phone number persists across sessions
- [ ] User sees confirmation after successful save
- [ ] Invalid phone formats show appropriate error messages
- [ ] Duplicate phone numbers are handled gracefully

**Testing & Validation Notes:**  
- Test with valid/invalid phone formats (US, international)
- Test empty submission
- Test duplicate phone number scenarios
- Verify phone persists after page refresh

**Post-Implementation Actions:**  
- Add phone number edit/update functionality
- Consider phone verification via SMS code (Post-MVP)
- Add privacy notice about SMS usage

**Status:** Not Started  
**Last Updated:** 2025-11-20

---

## Feature: Bill Creation and Management

**Purpose:**  
Allow users to add, edit, and delete bills with essential details needed for tracking and reminders.

**User Story / Use Case:**  
As a user, I want to add bills with details like name, amount, due date, and category so that I can track all my financial obligations in one place.

**Dependencies / Prerequisites:**  
- Database schema for bills
- User phone registration (for associating bills to users)
- Date picker component
- Category dropdown/selector

**Technical Breakdown:**  
- **Frontend:** 
  - Bill form component (Add/Edit modes)
  - Bill list view component
  - Bill detail view component
- **Backend:** 
  - CRUD endpoints: POST `/api/bills`, GET `/api/bills`, PUT `/api/bills/:id`, DELETE `/api/bills/:id`
- **Database:** 
  - `bills` table: `id`, `user_id`, `name`, `amount`, `due_date`, `category`, `status`, `sms_enabled`, `payment_date`, `created_at`, `updated_at`
- **Categories:** Utilities, Rent/Mortgage, Insurance, Subscriptions, Credit Cards, Loans, Other

**Implementation Steps:**  
- [ ] Step 1: Design bills database schema with all required fields
- [ ] Step 2: Create bill form UI with validation (name, amount, date, category)
- [ ] Step 3: Build backend CRUD endpoints for bills
- [ ] Step 4: Implement bill list view with filtering by category
- [ ] Step 5: Add edit functionality (pre-populate form with existing data)
- [ ] Step 6: Add delete functionality with confirmation dialog
- [ ] Step 7: Implement status calculation logic (Paid, Due Soon, Overdue, Upcoming)
- [ ] Step 8: Add SMS toggle per bill in form

**Acceptance Criteria:**  
- [ ] User can create new bills with all required fields
- [ ] Bills appear in list view after creation
- [ ] User can edit existing bills and changes persist
- [ ] User can delete bills with confirmation prompt
- [ ] Bill status automatically updates based on due date and payment status
- [ ] Categories display correctly and can be filtered
- [ ] SMS reminder toggle is saved per bill
- [ ] Form validation prevents invalid submissions
- [ ] Responsive layout on mobile and desktop

**Testing & Validation Notes:**  
- Test adding bills with past, current, and future due dates
- Verify status calculation for all 4 states (Paid, Due Soon, Overdue, Upcoming)
- Test edit/delete operations
- Test category filtering
- Verify SMS toggle persistence
- Test with multiple bills per user

**Post-Implementation Actions:**  
- Add recurring bill functionality
- Implement bill search/sort options
- Add bulk actions (mark multiple as paid)
- Consider bill templates for common utilities

**Status:** Not Started  
**Last Updated:** 2025-11-20

---

## Feature: Budget Summary Dashboard

**Purpose:**  
Provide users with a real-time visual overview of their monthly bill obligations, payment progress, and financial status.

**User Story / Use Case:**  
As a user, I want to see a summary of my total bills, how much I've paid, and what's remaining so that I can understand my financial obligations at a glance.

**Dependencies / Prerequisites:**  
- Bill creation feature must be functional
- Bills must have status calculation logic
- Responsive charting/visualization library (optional)

**Technical Breakdown:**  
- **Frontend:** 
  - Dashboard component with metric cards
  - Progress bar or circular progress indicator
  - Status breakdown (Paid, Due Soon, Overdue, Upcoming counts)
  - Optional: Visual chart showing category breakdown
- **Backend:** 
  - GET `/api/dashboard/summary` endpoint returning aggregated data
- **Calculations:**
  - Total monthly bills: Sum of all bills for current month
  - Total paid: Sum of bills marked as paid
  - Remaining balance: Total - Paid
  - Progress percentage: (Paid / Total) × 100
  - Bills by status count

**Implementation Steps:**  
- [ ] Step 1: Design dashboard layout and metric card components
- [ ] Step 2: Build backend endpoint to calculate summary statistics
- [ ] Step 3: Implement total bills calculation for current month
- [ ] Step 4: Implement paid amount calculation
- [ ] Step 5: Calculate remaining balance and progress percentage
- [ ] Step 6: Add status breakdown counts (Paid, Due Soon, Overdue, Upcoming)
- [ ] Step 7: Create visual progress indicator
- [ ] Step 8: Add category breakdown visualization (optional)
- [ ] Step 9: Implement real-time updates when bills change

**Acceptance Criteria:**  
- [ ] Dashboard displays total monthly bill amount
- [ ] Dashboard shows total paid amount
- [ ] Dashboard shows remaining balance
- [ ] Progress percentage calculates correctly
- [ ] Status counts match actual bill statuses
- [ ] Dashboard updates automatically when bills are added/edited/paid
- [ ] Layout is responsive on all screen sizes
- [ ] Key metrics are visually distinct and easy to read
- [ ] Dashboard loads quickly with minimal data fetching

**Testing & Validation Notes:**  
- Test with 0 bills (empty state)
- Test with all bills paid (100% progress)
- Test with mixed bill statuses
- Verify calculations with manual math
- Test dashboard refresh after bill operations
- Test with large number of bills (performance)

**Post-Implementation Actions:**  
- Add month-to-month comparison
- Add spending trends over time
- Add export functionality (PDF report)
- Add customizable date ranges

**Status:** Not Started  
**Last Updated:** 2025-11-20

---

## Feature: SMS Reminder System

**Purpose:**  
Send automated text message reminders to users when bills are approaching their due dates to prevent missed payments.

**User Story / Use Case:**  
As a user, I want to receive text message reminders for bills I've enabled notifications on so that I never miss a payment deadline.

**Dependencies / Prerequisites:**  
- User phone registration feature complete
- Bill management with SMS toggle per bill
- SMS service provider integration (Twilio, AWS SNS, etc.)
- Scheduled job/cron system for sending reminders
- Environment variables for SMS API credentials

**Technical Breakdown:**  
- **Frontend:** SMS toggle already included in bill form (from Feature 2)
- **Backend:** 
  - SMS service integration module
  - POST `/api/sms/send` endpoint (for testing)
  - Scheduled job to check due bills daily
  - GET `/api/bills/due-soon` query to fetch bills needing reminders
- **SMS Logic:**
  - Send reminder 3 days before due date
  - Send reminder 1 day before due date
  - Send reminder on due date
  - Track last reminder sent to avoid duplicates
- **Database Updates:**
  - Add `last_reminder_sent` field to `bills` table
  - Add `sms_notifications` table to log all sent messages

**Implementation Steps:**  
- [ ] Step 1: Set up SMS service provider account (Twilio recommended)
- [ ] Step 2: Install SMS SDK and configure credentials
- [ ] Step 3: Create SMS service module with send function
- [ ] Step 4: Build endpoint to manually trigger SMS (for testing)
- [ ] Step 5: Implement scheduled job/cron to run daily reminder check
- [ ] Step 6: Create query to find bills due in 1, 3 days with SMS enabled
- [ ] Step 7: Implement reminder send logic with duplicate prevention
- [ ] Step 8: Add SMS notification logging table
- [ ] Step 9: Create SMS message templates (clear, actionable)
- [ ] Step 10: Add error handling for failed SMS sends
- [ ] Step 11: Implement retry logic for failed messages

**Acceptance Criteria:**  
- [ ] SMS is sent 3 days before bill due date
- [ ] SMS is sent 1 day before bill due date
- [ ] SMS is sent on bill due date
- [ ] Only bills with SMS enabled receive notifications
- [ ] Users with valid phone numbers receive messages
- [ ] Duplicate messages are prevented via tracking
- [ ] Failed SMS sends are logged and retried
- [ ] SMS content is clear with bill name and due date
- [ ] System handles timezone correctly
- [ ] SMS sending does not block main application

**Testing & Validation Notes:**  
- Test with bills due in 1, 3, 7 days
- Verify only SMS-enabled bills trigger notifications
- Test with invalid phone numbers (error handling)
- Verify duplicate prevention works
- Test scheduled job execution
- Monitor SMS delivery rates
- Test with multiple users and bills simultaneously
- Verify SMS cost optimization (consolidate messages if possible)

**Post-Implementation Actions:**  
- Add user preference for reminder timing (customize 1, 3 days)
- Add SMS opt-out/unsubscribe functionality
- Implement SMS delivery status tracking
- Add custom message templates per user
- Consider email reminders as alternative
- Add reminder history view in UI

**Status:** Not Started  
**Last Updated:** 2025-11-20

---

## Feature: Bill Status Calculation Engine

**Purpose:**  
Automatically determine and update the status of each bill based on due date, payment status, and current date.

**User Story / Use Case:**  
As a user, I want bills to automatically show their current status (Paid, Due Soon, Overdue, Upcoming) so that I can quickly identify which bills need attention.

**Dependencies / Prerequisites:**  
- Bill management system with due dates
- Mark-as-paid functionality
- Date/time utility functions

**Technical Breakdown:**  
- **Status Logic:**
  - **Paid:** Bill marked as paid (regardless of due date)
  - **Overdue:** Bill not paid and due date has passed
  - **Due Soon:** Bill not paid and due within next 7 days
  - **Upcoming:** Bill not paid and due date is >7 days away
- **Implementation:** 
  - Backend utility function `calculateBillStatus(bill)`
  - Called whenever bill is fetched or updated
  - Frontend displays status with color coding
- **Database:** 
  - Add `status` field to `bills` table (computed or stored)
  - Add `payment_date` field to track when marked paid

**Implementation Steps:**  
- [ ] Step 1: Define status calculation rules clearly
- [ ] Step 2: Create utility function for status calculation
- [ ] Step 3: Integrate status calculation into bill fetch queries
- [ ] Step 4: Add "Mark as Paid" button to bill UI
- [ ] Step 5: Create endpoint to update payment status
- [ ] Step 6: Implement status color coding in frontend
- [ ] Step 7: Add status filter dropdown in bill list
- [ ] Step 8: Ensure status updates in real-time

**Acceptance Criteria:**  
- [ ] Bill status calculates correctly for all scenarios
- [ ] Status updates immediately when bill is marked paid
- [ ] Status updates automatically when due date passes
- [ ] Color coding is consistent (e.g., red=overdue, yellow=due soon, green=paid, blue=upcoming)
- [ ] Status filter works correctly in bill list
- [ ] Payment date is recorded when marked as paid
- [ ] Status persists across sessions

**Testing & Validation Notes:**  
- Test with bills due today, tomorrow, in 3 days, in 10 days, past due
- Verify marking as paid changes status immediately
- Test edge cases (due at midnight, timezone changes)
- Verify status updates automatically without page refresh

**Post-Implementation Actions:**  
- Add undo functionality for marking as paid
- Add partial payment tracking
- Add payment method tracking (cash, card, auto-pay)

**Status:** Not Started  
**Last Updated:** 2025-11-20

---

## Post-MVP Enhancements
> _Additional features, polish, and quality-of-life improvements planned after MVP deployment._

<!--
    Insert Post-MVP feature implementation plans here.
-->



---

## Experimental / Optional Features
> _Experimental or stretch features for exploration or testing._

<!--
    Insert optional or experimental features here.
-->



---

## Deployment & Integration Tasks
> _Steps for hosting, MCP setup, and production pipeline configuration._

<!--
    Insert deployment or infrastructure-related feature entries here.
-->



---

## Development Notes
> _Chronological updates, milestones, or reflection logs (AI or developer-written)._

<!--
    Use this section to summarize development sessions, bug fixes, or major updates.
    Example: "2025-10-10  Completed MVP login flow; integrated Supabase + Clerk."
-->
