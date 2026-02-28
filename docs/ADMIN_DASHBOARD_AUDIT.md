# Admin Dashboard Audit (Admin Role Only)

Date: 2026-02-28  
Scope: Admin dashboard pages only (routes under `/admin/*`)

Legend
- `[x]` Completed
- `[ ]` Pending / Not integrated

**Page: `/admin/dashboard`**
- [x] Admin route guard (`requireRole("admin")`)
- [x] KPI stat cards wired to `getAdminDashboardDataWithToken`
- [ ] Teams cards mapped to API
- [ ] Top performers mapped to API
- [ ] Funnel widgets mapped to API
- [ ] Installation/dispatch charts mapped to API
- [ ] Alerts/quick actions mapped to API
- [ ] Search field wired to API
- [ ] Time range filters wired to API
- [ ] Download actions wired to API
- [ ] Loading/skeleton states

**Page: `/admin/approval-management`**
- [x] Admin route guard
- [x] Table data wired to `getApprovalManagementData` with search input
- [ ] Filters (Date/Vendor/Category/Source) wired to API
- [ ] Pagination wired to API
- [ ] Approve/Reject actions wired to API
- [ ] Download/Resubmission actions wired to API
- [ ] Edit drawer “Save” wired to API
- [ ] Loading/skeleton states
- [ ] Remove fallback mock data usage

**Page: `/admin/leads-projects`**
- [x] Admin route guard
- [x] API helper exists (`getLeadsProjectsData`)
- [ ] Replace mock data with API response across all sections
- [ ] Search/filter/pagination wired to API
- [ ] Action buttons (edit/status/notes) wired to API
- [ ] Loading/skeleton states

**Page: `/admin/vendor-management`**
- [x] Admin route guard
- [x] API helper exists (`getVendorManagementData`)
- [ ] Replace fallback mock cards/requests with API data
- [ ] Search/filter/pagination wired to API
- [ ] Approve/Reject/Chat/Export actions wired to API
- [ ] Loading/skeleton states

**Page: `/admin/vendor-management/[vendorId]`**
- [x] Admin route guard
- [x] API helpers exist (`getVendorDetailData`, history helpers)
- [ ] Map all tabs/sections to API response fields
- [ ] Actions (edit/save/status updates) wired to API
- [ ] Loading/skeleton states

**Page: `/admin/team-management`**
- [x] Admin route guard
- [x] API helper exists (`getTeamUsers`)
- [ ] Replace mock data with API response
- [ ] Search/filter/pagination wired to API
- [ ] Create/Edit/Delete actions wired to API
- [ ] Loading/skeleton states

**Page: `/admin/team-management/team-permissions`**
- [x] Admin route guard
- [x] API helpers exist (`getMenuMap`, `getTeamPermissionsForTeam`, `createRoleWithPermissions`, `updateRoleWithPermissions`)
- [ ] Confirm create/update flows use live API responses (success/error handling)
- [ ] Loading/skeleton states

**Page: `/admin/loan-management`**
- [x] Admin route guard
- [x] Loan Requests list wired to `/loans?loanApprove=0`
- [x] Loan Status list wired to `/loans?loanApprove=1`
- [x] Detail/Update sidebars map API fields
- [ ] Search input wired to API
- [ ] Filters wired to API
- [ ] Pagination wired to API
- [ ] Update status “Save” wired to PUT API
- [ ] Attachments download/upload wired to API
- [ ] Delete actions wired to API
- [ ] Loading/skeleton states

**Page: `/admin/fin-tech-partners`**
- [x] Admin route guard
- [x] Grid/list data wired to `/loan-providers`
- [x] Skeletons for grid/list
- [x] Edit sidebar fetches partner detail
- [ ] Search input wired to API
- [ ] Filters (Type/Location) wired to API
- [ ] Pagination wired to API
- [ ] Create form wired to API
- [ ] Edit “Save” wired to PUT API
- [ ] Delete/Deactivate actions wired to API

**Page: `/admin/fin-tech-partners/[partnerId]`**
- [x] Admin route guard
- [x] Detail API wired to `/loan-providers/:id`
- [x] Skeleton while loading
- [ ] Export action wired to API
- [ ] Edit actions wired to API
- [ ] Account tab content wired to API
- [ ] Chat tab content wired to API

**Page: `/admin/inventory-management`**
- [x] Admin route guard
- [x] Inventory list wired to `/inventory`
- [x] Category filter options wired to `/common/category`
- [x] Skeleton rows while loading
- [ ] Search input wired to API
- [ ] Category filter wired to API query
- [ ] Pagination wired to API
- [ ] Detail drawer fields mapped to API (remove static values)
- [ ] Create/Edit drawers wired to API
- [ ] Delete action wired to API

**Page: `/admin/reports`**
- [x] Admin route guard
- [ ] KPI cards wired to API
- [ ] Tables wired to API
- [ ] Filters/date ranges wired to API
- [ ] Export actions wired to API
- [ ] Loading/skeleton states

**Page: `/admin/ticket-alerts`**
- [x] Admin route guard
- [ ] Ticket list wired to API
- [ ] Alerts list wired to API
- [ ] Filters wired to API
- [ ] Actions (resolve/assign/etc.) wired to API
- [ ] Loading/skeleton states

**Page: `/admin/support`**
- [x] Admin route guard
- [ ] Support list wired to API
- [ ] Filters wired to API
- [ ] Actions (close/assign/etc.) wired to API
- [ ] Loading/skeleton states

**Page: `/admin/settings`**
- [x] Admin route guard
- [ ] Preferences wired to API
- [ ] Notifications wired to API
- [ ] Save actions wired to API
- [ ] Loading/skeleton states

**Page: `/admin/settings/dropdown/[item]`**
- [x] Admin route guard
- [ ] Dropdown list items wired to API
- [ ] Create/Edit/Delete wired to API
- [ ] Loading/skeleton states
