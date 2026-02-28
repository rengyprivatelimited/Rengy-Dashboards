# Admin Dashboard Audit (Admin Role Only)

Date: 2026-02-28
Scope: Admin dashboard pages only (routes under `/admin/*`)

Legend
- Completed: UI + API integration working end‑to‑end
- Partial: UI done, some API wired, but missing full mapping/actions/filters
- Pending: UI only (mock/static) or missing key API wiring

**Page: `/admin/dashboard`**
- Status: Partial
- UI: Implemented in `features/dashboard/components/AdminDashboardLegacy.tsx`
- API: KPI stats use `getAdminDashboardDataWithToken` in `features/dashboard/api/admin-dashboard.ts`
- Pending:
- Teams cards are static
- Top performers list is static
- Funnel/Trend/Alerts/Tasks widgets are static
- Search, filters, time ranges, downloads not wired
- No loading/skeleton states

**Page: `/admin/approval-management`**
- Status: Partial
- UI: Implemented in `app/approval-management/page.tsx`
- API: `getApprovalManagementData` wired with fallback rows
- Completed:
- Search triggers API query
- Pending:
- Filters and pagination are static
- Approve/Reject/Download/Resubmit actions are not wired to API
- Drawer edits are read-only (no save API)
- No loading/skeleton states

**Page: `/admin/leads-projects`**
- Status: Partial
- UI: Implemented in `app/leads-projects/page.tsx`
- API: `getLeadsProjectsData` used, but mock data still present
- Pending:
- Verify full data mapping (many sections still rely on mock data)
- Filters, search, pagination not wired to API
- Actions (edit/status changes/notes) not wired
- No loading/skeleton states

**Page: `/admin/vendor-management`**
- Status: Partial
- UI: Implemented in `app/vendor-management/page.tsx`
- API: `getVendorManagementData` used with mock fallbacks
- Pending:
- Replace fallback cards/requests with live data only
- Filters/search/pagination not wired
- Actions (approve/reject/chat/export) not wired
- No loading/skeleton states

**Page: `/admin/vendor-management/[vendorId]`**
- Status: Partial
- UI: Implemented in `app/vendor-management/[vendorId]/page.tsx`
- API: `getVendorDetailData` and related types in `features/admin/api/vendor-detail.ts`
- Pending:
- Ensure all tabs/sections map to API fields (history, tickets, documents)
- Actions (edit/save/status updates) not wired
- No loading/skeleton states

**Page: `/admin/team-management`**
- Status: Partial
- UI: Implemented in `app/team-management/page.tsx`
- API: `getTeamUsers` used with mock fallbacks
- Pending:
- Replace mock rows with live data only
- Filters/search/pagination not wired
- Actions (add/edit/delete) not wired
- No loading/skeleton states

**Page: `/admin/team-management/team-permissions`**
- Status: Partial
- UI: Implemented in `app/team-management/team-permissions/page.tsx`
- API: Uses `getMenuMap`, `getTeamPermissionsForTeam`, `createRoleWithPermissions`, `updateRoleWithPermissions`
- Pending:
- Confirm all create/update flows are wired end‑to‑end (payloads + success handling)
- No loading/skeleton states

**Page: `/admin/loan-management`**
- Status: Partial
- UI: Implemented in `app/loan-management/page.tsx`
- API: Lists wired via `getLoanRequests` and `getLoanStatuses` (`/loans?loanApprove=0/1`)
- Completed:
- Loan Requests and Loan Status tables pull live data
- Side drawers use API‑mapped fields
- Pending:
- Filters/search/pagination not wired to API
- Update status is local only (no PUT)
- File download/upload actions not wired
- No loading/skeleton states

**Page: `/admin/fin-tech-partners`**
- Status: Partial
- UI: Implemented in `app/fin-tech-partners/page.tsx`
- API: List and edit sidebar load from `getFinTechPartners` and `getFinTechPartner`
- Completed:
- Grid/list views pull live data
- Edit sidebar fetches detail data
- Skeletons implemented for grid/list
- Pending:
- Filters/search/pagination not wired
- Save/Update/Delete actions not wired
- Create form not wired

**Page: `/admin/fin-tech-partners/[partnerId]`**
- Status: Partial
- UI: Implemented in `app/fin-tech-partners/[partnerId]/page.tsx`
- API: Detail loaded via `getFinTechPartner`
- Completed:
- Skeleton while loading
- Overview/Business/Performance/Remarks map to API fields
- Pending:
- Actions (edit/save/export) not wired
- Account/Chat tabs are static

**Page: `/admin/inventory-management`**
- Status: Partial
- UI: Implemented in `app/inventory-management/page.tsx`
- API: Items and categories wired via `getInventoryItems` and `getInventoryCategories`
- Completed:
- Table loads live inventory items
- Category list loads from API
- Skeleton rows while loading
- Pending:
- Filters/search/pagination not wired
- Detail drawer fields still include hard-coded values
- Create/Edit drawers are read-only and not wired to API

**Page: `/admin/reports`**
- Status: Pending
- UI: Implemented in `app/reports/page.tsx`
- API: None (mock data only)
- Pending:
- Map KPIs and tables to API responses
- Filters/date ranges/pagination/actions not wired
- No loading/skeleton states

**Page: `/admin/ticket-alerts`**
- Status: Pending
- UI: Implemented in `app/ticket-alerts/page.tsx`
- API: None (mock data only)
- Pending:
- Ticket list, alerts, filters, and actions need API wiring
- No loading/skeleton states

**Page: `/admin/support`**
- Status: Pending
- UI: Implemented in `app/support/page.tsx`
- API: None (mock data only)
- Pending:
- Support requests, filters, and actions need API wiring
- No loading/skeleton states

**Page: `/admin/settings`**
- Status: Pending
- UI: Implemented in `app/settings/page.tsx`
- API: None (mock data only)
- Pending:
- Preferences + notifications need API wiring
- No loading/skeleton states

**Page: `/admin/settings/dropdown/[item]`**
- Status: Pending
- UI: Implemented in `app/settings/dropdown/[item]/page.tsx`
- API: None (mock data only)
- Pending:
- Dropdown list items CRUD APIs
- No loading/skeleton states
