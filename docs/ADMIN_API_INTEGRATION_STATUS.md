# Admin Dashboard API Integration Status

Last updated: 2026-02-26

## Scope
Track API integration progress for **Admin dashboard** features only.

Base API URL: `https://api.rengy.in/api/v1`
Reference collection: `Rengy.postman_collection 10.json`

## Current Status Summary
- Live API integration in Admin UI: **Not implemented yet**
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

## Not Started (API Integration)
1. Central API client/service layer (fetch wrapper, base URL, common headers).
2. Auth token storage + bearer token injection strategy for API calls.
3. Typed request/response models for Admin modules.
4. Replacing mock data with live API calls in Admin dashboard widgets.
5. Replacing mock data with live API calls in Admin section pages.
6. Error/loading/empty states tied to real API responses.
7. API pagination/filter/sort mapping for tables.
8. Mutation flows (create/update/delete) wired to backend.

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
Start Phase 1 + Phase 2 immediately:
1. create API client
2. wire `/admin/dashboard` to live APIs
3. keep fallback UI for missing fields
