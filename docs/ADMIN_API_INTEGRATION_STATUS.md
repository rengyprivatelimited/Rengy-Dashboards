# Admin Dashboard API Integration Status

Last updated: 2026-02-26

## Scope
Track API integration progress for **Admin dashboard** features only.

Base API URL: `https://api.rengy.in/api/v1`
Reference collection: `Rengy.postman_collection 10.json`

## Current Status Summary
- Live API integration in Admin UI: **Partially implemented (Admin Dashboard KPI cards)**
- Mock/static data usage in Admin pages: **Still active**
- Backend endpoint documentation: **Completed**

## Completed
1. Generated Postman-based API docs:
   - `docs/api-reference.md`
2. Documented production host:
   - `https://api.rengy.in/api/v1`
3. Refactored routing/app structure toward role-based URLs.
4. Added role guards and route compatibility redirects.
5. Stabilized Admin UI navigation/dropdown/logout behavior.
6. Added reusable API client:
   - `lib/api/client.ts`
   - Supports base URL config, query params, JSON handling, and normalized API errors.
7. Added Admin dashboard API service:
   - `features/dashboard/api/admin-dashboard.ts`
   - Calls `GET /dashboard/:id` (currently `32`)
   - Includes safe fallback to existing UI data if API shape differs/fails.
8. Wired `/admin/dashboard` to live API service:
   - `app/admin/dashboard/page.tsx`
   - Passes fetched KPI data into `AdminDashboardLegacy`.

## Not Started (API Integration)
1. Auth token storage + bearer token injection strategy for API calls.
2. Typed request/response models for Admin modules (contract-accurate, endpoint-specific).
3. Replacing remaining mock data with live API calls in Admin dashboard widgets.
4. Replacing mock data with live API calls in Admin section pages.
5. Error/loading/empty states tied to real API responses.
6. API pagination/filter/sort mapping for tables.
7. Mutation flows (create/update/delete) wired to backend.

## Admin Modules To Integrate
- Dashboard
- Approval Management
- Leads & Projects
- Vendor Management
- Team Management
- Loan Management
- Fin-Tech Partners
- Inventory Management
- Reports
- Ticket & Alerts
- Support
- Settings

## Proposed Execution Plan
### Phase 1: Foundation
- Build `lib/api-client.ts` with:
  - `baseURL = https://api.rengy.in/api/v1`
  - shared `request()` helper
  - auth header support
  - normalized error handling
- Add lightweight module-wise API files under `features/admin/api/*`

### Phase 2: Admin Dashboard First
- Integrate KPI + summary widgets on `/admin/dashboard`
- Remove mock dependency for dashboard-only data

### Phase 3: High-value Data Tables
- Approval Management
- Leads & Projects
- Vendor Management
- Ticket & Alerts

### Phase 4: Remaining Admin Sections
- Loan Management
- Fin-Tech Partners
- Inventory Management
- Reports
- Support / Settings / Team Management

### Phase 5: Hardening
- Add retry policy (where needed)
- Better error banners/toasts
- Response schema validation (optional)

## Risks / Dependencies
1. Need clear token source from backend auth flow (login response contract).
2. Some Postman endpoints use `{{local}}` and sample payloads; production-ready contracts must be confirmed endpoint-by-endpoint.
3. A few APIs may differ from current UI field names and table schemas; mapping layer will be required.

## Next Action (Recommended)
Continue Phase 2 dashboard completion + start first table page:
1. map full `/dashboard/:id` response fields to all admin widgets (beyond top KPI cards)
2. integrate `/admin/approval-management` table and filters with live APIs
3. finalize token handling strategy for protected endpoints
