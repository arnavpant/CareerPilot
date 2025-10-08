## PRD — Job Application Tracker CRM (v1)

### Introduction/Overview
The Job Application Tracker CRM is a student- and early‑career‑focused tool that centralizes application tracking, automates email parsing from Gmail/Outlook, provides actionable analytics, and delivers smart reminders for follow‑ups and deadlines. Unlike enterprise ATS/CRMs, this product is designed for individual job seekers to manage every stage of the search lifecycle from discovery to offer.

- Primary platform: Web app (responsive)
- Target users: Undergrads, Masters/PhD, Bootcamp grads, Early‑career professionals (0–3 yrs)
- Timeline: MVP in 4–6 weeks
- Pricing: Free for now; cloud‑hosted and scalable

### Goals
- Centralize all applications with a clear pipeline and canonical record per application
- Automate ingestion via email parsing (Gmail + Outlook) with high signal extraction
- Provide analytics on response rate, stage conversion, and time‑to‑response/offer
- Deliver smart reminders (fixed + intelligent) across in‑app/email/optional Slack/Discord
- Enable reporting and exports (CSV, PDF, shareable read‑only link)
- Ensure privacy, consent, and security with encryption, least privilege, scopes, and audit log
- Remain free to users while built on scalable cloud infrastructure

### User Stories
- As a student, I want to add a job by pasting a posting URL so that core details auto‑fill and I can track it quickly.
- As a job seeker, I want emails about interviews to automatically create interview events and update my pipeline so I don’t miss deadlines.
- As a candidate, I want reminders to follow up if I haven’t heard back so I maintain momentum.
- As a user, I want to visualize my funnel and time‑to‑offer so I can improve my strategy.
- As a user, I want to export/share my progress with an advisor so I can get feedback.

### Functional Requirements
1. Authentication and Account
   1.1 The system must support Email/Password authentication.
   1.2 The system must support Google OAuth for sign‑in.
   1.3 Users must manage timezone, notification preferences, email connections, and retention settings in Profile.

2. Email Connections and Permissions
   2.1 Users must be able to connect Gmail and Outlook via OAuth with read‑only scopes.
   2.2 By default, the parser must scan the inbox for job‑related messages (read‑only).
   2.3 Users may optionally restrict scanning to specific labels/folders.
   2.4 The system must store only necessary parsed artifacts/metadata per retention policy.
   2.5 All access and parsing actions must be auditable (who/what/when).

3. Core Data Objects
   3.1 Application
       - Fields: company, role title, location, employment type, source, posting URL, stage, stage dates, status, resume version, cover letter, external ATS URL, external application ID, salary range, offer deadline (if any), notes, attachments, tags
   3.2 Company
       - Fields: name, website, industry, size, locations, notes
   3.3 Contact
       - Fields: name, email, role/title, company, relationship, notes; dedupe by email
   3.4 Interview
       - Fields: application, round name, date/time, duration, location/virtual link, panel, instructions, attachments, outcome
   3.5 Task/Reminder
       - Fields: title, related entity (application/interview/contact), due date, priority, recurrence, channel(s), status
   3.6 Offer
       - Fields: application, total compensation breakdown (base/bonus/equity), benefits, location, deadline, decision, notes

4. Pipeline and Stages
   4.1 Default stages: Discovered → Applied → Phone Screen → Tech → Onsite → Offer → Accepted/Rejected.
   4.2 Users can drag‑and‑drop applications across stages in a Kanban view.
   4.3 The system must timestamp stage transitions and compute durations.
   4.4 Email parsing must auto‑advance stages when signals are detected (e.g., rejection, interview, offer).

5. Application Creation and Import
   5.1 Quick‑Add by URL: Paste any job application URL (LinkedIn, Lever, Greenhouse, Workday, Indeed, career sites); system must attempt metadata scraping (title, company, location).
   5.2 Manual entry form with minimal required fields and progressive disclosure of advanced fields.
   5.3 Import sources: CSV upload with field mapping, resume parsing (PDF/DOCX) to extract experience/skills for autofill, Gmail label import.
   5.4 Email parser must create or enrich applications based on detected signals.

6. Interviews and Calendar
   6.1 Interview invites parsed from email must create interview records with date/time and conferencing links.
   6.2 Calendar view must show interviews and deadlines; support .ics export and subscribe URL.
   6.3 Users can log outcomes and next steps per interview round.

7. Tasks and Smart Reminders
   7.1 Fixed reminders: user‑set due dates (apply, follow‑up, prepare, thank‑you).
   7.2 Smart suggestions: based on stage and inactivity (e.g., 3 days post‑apply, 7 days post‑interview, weekly until response).
   7.3 Channels: in‑app, email; optional Slack/Discord via webhook.
   7.4 Users can snooze, reschedule, or complete tasks; completion logs activity.

8. Email Parsing Scope
   8.1 Interview invites: extract date/time, platform/link, interviewer(s), instructions.
   8.2 Offers: extract compensation components, deadlines, attachments.
   8.3 Rejections: detect and auto‑update stage to Rejected; log reason if present.
   8.4 Recruiter replies: extract contact details and next steps.
   8.5 Parsing must be resilient to templates and common ATS formats; allow manual correction.

9. Analytics and Dashboard
   9.1 Response rate by company and by source.
   9.2 Stage conversion funnel with drop‑off points.
   9.3 Time‑to‑first‑response, time‑in‑stage, and time‑to‑offer.
   9.4 Filters by date range, company, source, tag; export charts as images.

10. Reporting and Sharing
   10.1 CSV export of applications and interviews.
   10.2 PDF summary report (weekly/monthly) for advisors or personal review.
   10.3 Shareable read‑only link for advisors (scoped, expiring).

11. Views and Navigation
   11.1 Kanban pipeline for stages.
   11.2 Table with filters, column chooser, saved views.
   11.3 Calendar for interviews/deadlines.
   11.4 Dashboard with KPIs and charts.

12. Notifications
   12.1 In‑app notifications center with digest settings.
   12.2 Email notifications for reminders and key state changes; rate‑limited.
   12.3 Optional Slack/Discord webhooks for reminders and updates.

13. Privacy, Security, and Retention
   13.1 Encrypt data at rest and in transit; follow least‑privilege access.
   13.2 Explicit user consent for email scopes; granular scope description.
   13.3 Full audit log of access and parsing events.
   13.4 User‑selectable retention: e.g., 90 days, 1 year, custom; redaction on expiry.

14. Performance and Scalability
   14.1 Cloud database with multi‑tenant isolation.
   14.2 Background jobs for parsing, analytics aggregation, PDF generation.
   14.3 Targets: 10k emails/user/month parsing; 5k applications/user; p95 < 300ms for UI API.

15. Accessibility and Internationalization
   15.1 Adhere to WCAG 2.1 AA for color contrast and keyboard nav.
   15.2 Support multiple timezones and locale‑aware dates.

### Non‑Goals (Out of Scope for v1)
- Browser extension for one‑click capture (future)
- Microsoft OAuth for sign‑in (email integration still supported via OAuth)
- Advanced LinkedIn API integration beyond saving any job URL
- Mobile app (native); responsive web only
- Two‑way email sending or composing within app (read‑only parsing only)
- Enterprise SSO (SAML/SCIM)

### Design Considerations (UI/UX)
- Design principles: clarity over density, progressive disclosure, reduce manual input, strong empty states, helpful defaults.
- Information architecture
  - Primary nav: Pipeline, Table, Calendar, Dashboard, Imports, Settings
  - Secondary: Application details (tabs: Overview, Activity, Interviews, Tasks, Files)
- Key screens (essential elements)
  - Pipeline: Kanban columns = stages; cards show company, role, last activity, next task; drag‑drop moves stage
  - Table: sortable columns (Company, Role, Stage, Source, Applied On, Last Activity, Tags); filter bar; saved views
  - Application Details: header (Company, Role, Stage actions); tabs; right rail for tasks; activity timeline; attachments section
  - Calendar: month/week agenda; interviews and due tasks; click to view details
  - Dashboard: KPIs (response rate, offers, average time‑to‑first‑response); charts for funnel and time metrics
  - Imports: CSV mapper; resume upload; Gmail label selection and preview
  - Settings: Email connections (Gmail/Outlook), notifications, retention, timezone
- Interaction patterns
  - Quick‑Add: global “Add Application” with URL paste → autofill
  - Inline edit for fields (stage, source, tags) in table and details
  - Global search by company/role/contact
  - Autosave forms; optimistic updates; undo for destructive actions
  - Empty states with guided setup (connect email, import CSV, quick‑add URL)
- Wireframe notes (for design → code handoff)
  - Use consistent spacing scale (4/8px), 8‑pt grid
  - Card components for Kanban with status chips; color tokens per stage
  - Table with sticky header, row selection, toolbar for bulk actions
  - Forms with logical grouping and helper text; date/time pickers for interviews
  - Charts: funnel, bar/line for time metrics; export button

### Technical Considerations
- Suggested stack (reference; can adapt during implementation)
  - Frontend: Next.js/React, TypeScript, Tailwind or CSS‑in‑JS; Deployed on Vercel
  - Backend: Node.js (Next API routes or Express/Fastify), TypeScript
  - Database: PostgreSQL (e.g., Neon/PlanetScale alternative with PG compatibility); ORM: Prisma
  - Email APIs: Gmail API, Microsoft Graph API (read‑only)
  - Auth: next‑auth (email/password + Google provider); session‑based or JWT
  - Queue/Workers: BullMQ/Celery‑equivalent on Redis for parsing and reports
  - Storage: S3‑compatible for attachments; PDF generation (e.g., Playwright)
  - Notifications: transactional email (e.g., Resend/SendGrid); Slack/Discord webhooks
  - Observability: logging, tracing, metrics; error reporting (Sentry)
  - Rate limiting and backoff for API and parsing jobs
- Data model (high‑level)
  - User (1‑many) Application
  - Application (many‑1) Company; (many‑many) Contact
  - Application (1‑many) Interview, Task, Activity, Attachment
  - Application (0‑1) Offer
- API surface (representative)
  - POST /applications (manual or URL quick‑add)
  - GET /applications?filters
  - PATCH /applications/:id (stage, fields)
  - POST /imports/csv, POST /imports/resume
  - POST /email/connect (Gmail/Outlook), POST /email/disconnect
  - Webhooks for parsing events, Slack/Discord
  - GET /analytics/summary, /analytics/funnel, /analytics/time
  - GET /reports/pdf, GET /exports/csv

### Success Metrics
- ≥ 80% of interview invites and rejections correctly parsed end‑to‑end
- ≥ 60% of users connect at least one email provider in first session
- ≥ 70% of active users create at least one reminder in week 1
- Median time to add an application (manual or URL) ≤ 20 seconds
- ≥ 50% month‑1 retention among onboarded users

### Open Questions
- Resume parsing scope: extract skills/experience only or education/projects too?
- Advisor sharing: should advisors have comments/feedback or read‑only only?
- Calendar: support write‑back to Google/Microsoft Calendar (future) or export‑only in v1?
- Import mappings: maintain per‑user templates for repeated CSVs?
- Email parsing safeguards: confidence threshold for auto stage changes vs. requiring confirmation?
