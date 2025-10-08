## Relevant Files

- `careerpilot/.env.example` - Example environment variables for local setup.
- `careerpilot/src/lib/env.ts` - Typed environment loader and validation.
- `careerpilot/app/api/auth/[...nextauth]/route.ts` - NextAuth App Router endpoint.
- `careerpilot/src/types/next-auth.d.ts` - NextAuth session/JWT typings.
- `prisma/schema.prisma` - Data model for Application, Company, Contact, Interview, Task, Offer.
- `src/lib/db/prisma.ts` - Prisma client instantiation and connection utilities.
- `src/lib/auth/options.ts` - Authentication configuration (email/password + Google provider).
- `src/app/(auth)/signin/page.tsx` - Sign-in screen.
- `src/app/(auth)/signup/page.tsx` - Sign-up screen.
- `src/app/(dashboard)/pipeline/page.tsx` - Kanban pipeline view for stages.
- `src/app/(dashboard)/table/page.tsx` - Table view with filters and saved views.
- `src/app/(dashboard)/calendar/page.tsx` - Calendar view for interviews and deadlines.
- `src/app/(dashboard)/dashboard/page.tsx` - Analytics dashboard (KPIs and charts).
- `src/app/(dashboard)/imports/page.tsx` - Import flows (CSV, resume, Gmail label selection).
- `src/app/(dashboard)/settings/page.tsx` - Settings (email connections, notifications, retention, timezone).
- `src/app/api/applications/route.ts` - CRUD and list endpoints for applications.
- `src/app/api/companies/route.ts` - CRUD endpoints for companies.
- `src/app/api/contacts/route.ts` - CRUD endpoints for contacts.
- `src/app/api/interviews/route.ts` - CRUD endpoints for interviews.
- `src/app/api/tasks/route.ts` - CRUD endpoints for tasks/reminders.
- `src/app/api/offers/route.ts` - CRUD endpoints for offers.
- `src/app/api/imports/csv/route.ts` - CSV import.
- `src/app/api/imports/resume/route.ts` - Resume parsing import.
- `src/app/api/email/connect/route.ts` - Connect Gmail/Outlook via OAuth.
- `src/app/api/email/disconnect/route.ts` - Disconnect email providers.
- `src/app/api/analytics/summary/route.ts` - KPI summary API.
- `src/app/api/analytics/funnel/route.ts` - Stage conversion funnel API.
- `src/app/api/analytics/time/route.ts` - Time-based metrics API.
- `src/app/api/reports/pdf/route.ts` - PDF report generation API.
- `src/app/api/exports/csv/route.ts` - CSV export API.
- `src/app/api/shares/[id]/route.ts` - Shareable read-only views.
- `src/server/email/gmail.ts` - Gmail API client and label selection.
- `src/server/email/outlook.ts` - Outlook (Microsoft Graph) client.
- `src/server/parsers/jobEmailParser.ts` - Email parsing for interviews/offers/rejections/replies.
- `src/server/queues/worker.ts` - Background jobs for parsing and reports.
- `src/server/analytics/aggregations.ts` - Analytics aggregation jobs and helpers.
- `src/components/kanban/*` - Kanban board components.
- `src/components/tables/*` - Table/grid components with filters.
- `src/components/forms/*` - Reusable forms for CRUD and imports.
- `src/components/charts/*` - Charts for KPIs/funnel/time metrics.
- `src/middleware.ts` - Auth/session and route protection.
- `src/app/api/*/*.test.ts` - API route tests.
- `src/server/parsers/jobEmailParser.test.ts` - Parser unit tests.
- `src/server/analytics/aggregations.test.ts` - Analytics unit tests.

### Notes

- Unit tests should typically be placed alongside the code files they test.
- Use `npx jest` (or your configured test runner) to run tests. Running without a path executes all tests found by the Jest configuration.

## Tasks

- [ ] 1.0 Project setup, authentication, and user settings
  - [x] 1.1 Initialize Next.js + TypeScript project, ESLint/Prettier, env config
  - [x] 1.2 Configure auth (next-auth): email/password provider and Google provider
  - [x] 1.3 Implement sign-in/sign-up pages and session handling
  - [x] 1.4 Add route protection and middleware; secure API routes
  - [x] 1.5 Create Profile/Settings: timezone, notifications, email connections, data retention
  - [x] 1.6 Seed script and basic dev data for local testing

- [ ] 2.0 Data model and database migrations (Prisma + PostgreSQL)
  - [ ] 2.1 Define Prisma schema: User, Application, Company, Contact, ApplicationContact, Interview, Task, Offer, Activity, Attachment, ShareLink, EmailConnection, AuditLog
  - [ ] 2.2 Add enums (Stage, TaskStatus, Channel, NotificationType) and constraints/indexes
  - [ ] 2.3 Run initial migrations and verify relations and cascading rules
  - [ ] 2.4 Seed lookup data (default stages), verify referential integrity

- [ ] 3.0 Core APIs for CRUD and listing (applications, companies, contacts, interviews, tasks, offers)
  - [ ] 3.1 Applications API: create, get, list (filters/pagination), update (stage/fields), delete
  - [ ] 3.2 Companies and Contacts APIs: CRUD, dedupe by email for contacts
  - [ ] 3.3 Interviews API: CRUD; link to applications; outcome logging
  - [ ] 3.4 Tasks/Reminders API: CRUD; complete/snooze/reschedule; recurrence support
  - [ ] 3.5 Offers API: CRUD with compensation breakdown
  - [ ] 3.6 Activity logging middleware for write operations
  - [ ] 3.7 Validation (zod) and consistent error handling; pagination and sorting
  - [ ] 3.8 Unit tests for critical endpoints

- [x] 4.0 UI: Pipeline, Table, Application Details, Calendar, Dashboard shell
  - [x] 4.1 App shell, navigation (Pipeline, Table, Calendar, Dashboard, Imports, Settings)
  - [x] 4.2 Pipeline Kanban: columns = stages; drag-drop; optimistic stage updates
  - [x] 4.3 Table view: filters, column chooser, saved views; inline edits for stage/source/tags
  - [x] 4.4 Application Details: tabs (Overview, Activity, Interviews, Tasks, Files); attachments
  - [x] 4.5 Global Quick-Add: paste job URL → autofill; manual entry fallback
  - [x] 4.6 Calendar view: interviews + due tasks; .ics export and subscribe link
  - [x] 4.7 Dashboard shell: KPIs placeholders and chart scaffolding

- [ ] 5.0 Email integrations (Gmail/Outlook OAuth) and read-only parsing pipeline with workers
  - [ ] 5.1 Connect flows: Gmail and Outlook OAuth with read-only scopes; token storage/refresh/revoke
  - [ ] 5.2 Label/folder selection UI (optional); default to scanning inbox
  - [ ] 5.3 Ingestion mechanism: webhook/push or polling jobs for new messages
  - [ ] 5.4 Parser: detect interview invites, offers, rejections, recruiter replies; structured extraction
  - [ ] 5.5 Auto-enrich or create Application/Interview/Task; guarded stage auto-advance
  - [ ] 5.6 Audit logging for email access and parsing events
  - [ ] 5.7 Parser unit tests with fixtures for common ATS templates

- [ ] 6.0 Tasks/reminders engine with smart suggestions and notifications (in-app, email, Slack/Discord)
  - [ ] 6.1 Implement task scheduler and recurrence rules
  - [ ] 6.2 Smart suggestions: 3 days post-apply, 7 days post-interview, weekly until response
  - [ ] 6.3 Notification channels: in-app center, email; optional Slack/Discord via webhook
  - [ ] 6.4 Preferences UI for channels and digest frequency; per-user timezone handling
  - [ ] 6.5 Snooze/reschedule/complete interactions; activity logging
  - [ ] 6.6 Integration tests for reminder generation and delivery

- [ ] 7.0 Imports and quick-add: URL autofill, CSV import, resume parsing
  - [ ] 7.1 URL metadata scraping for job details (title/company/location) with graceful fallback
  - [ ] 7.2 CSV import flow: upload, map fields, validate, import; error reporting
  - [ ] 7.3 Resume parsing (PDF/DOCX) for autofill of role/company/source where possible
  - [ ] 7.4 Gmail label import option; preview and confirm

- [ ] 8.0 Analytics and reporting: KPIs, funnel, time metrics; CSV export, PDF; shareable links
  - [ ] 8.1 Aggregations: response rate by company/source; stage funnel; time metrics
  - [ ] 8.2 APIs for analytics summary/funnel/time; caching strategy
  - [ ] 8.3 Dashboard charts and KPIs; export chart images
  - [ ] 8.4 CSV export endpoint (applications, interviews); column selection
  - [ ] 8.5 PDF summary report generation and styling
  - [ ] 8.6 Shareable read-only links with scope and expiry
  - [ ] 8.7 Tests for aggregations and export/report endpoints

- [ ] 9.0 Privacy, security, retention, and audit logging
  - [ ] 9.1 Consent flows for email scopes; clear copy and granular scopes
  - [ ] 9.2 Encrypt at rest/in transit; secure secrets; least-privilege policies
  - [ ] 9.3 Data retention jobs (90 days/1 year/custom); redaction on expiry
  - [ ] 9.4 Comprehensive audit log (who/what/when) for data and email access
  - [ ] 9.5 Rate limits and abuse protections for APIs and background jobs
  - [ ] 9.6 Create read-only analytics DB role and connect BI (Metabase/Superset)

- [ ] 10.0 Observability, performance, and deployment (Vercel), rate limiting and error handling
  - [ ] 10.1 Configure logging, tracing, error reporting (Sentry)
  - [ ] 10.2 Define performance budgets (p95 API < 300ms); add indexes to meet SLAs
  - [ ] 10.3 Backoff/retry for external APIs; centralized error handling
  - [ ] 10.4 Vercel configuration (env vars, build, edge/server regions); staging environment
  - [ ] 10.5 Smoke tests and basic load checks pre-release

- [ ] 11.0 Admin console and safe operations
  - [ ] 11.1 Add `role` to User (admin/user) and protect `/admin/**`
  - [ ] 11.2 Admin UI: search users; view profiles, connections, retention, status
  - [ ] 11.3 Impersonation flow (time-limited) with explicit logging and notice banner
  - [ ] 11.4 Admin edits: reset flags, soft-delete/restore accounts with confirmations
  - [ ] 11.5 Audit trail: record before/after snapshots for all admin actions
  - [ ] 11.6 Admin dashboard: high-level KPIs (users, active, email connections, parsing)
  - [ ] 11.7 Runbooks and scripts for common ops; guardrails and dry-run mode
