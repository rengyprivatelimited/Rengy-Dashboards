# Admin Dashboard Audit (Admin Role Only)

Date: 2026-02-28  
Scope: Admin dashboard pages only (routes under `/admin/*`)

Legend
- `[x]` Completed
- `[ ]` Pending / Not integrated

**Page: `/admin/dashboard`**
- [x] Admin route guard (`requireRole("admin")`)
- [x] KPI stat cards wired to `GET /api/v1/dashboard/:id`
- [ ] Teams cards mapped to API (API: `GET /api/v1/dashboard/:id` or add endpoint in docs)
- [ ] Top performers mapped to API (API: `GET /api/v1/vendors/leaderboard/:id`)
- [ ] Funnel widgets mapped to API (API: `POST /api/v1/loans/funnel`)
- [ ] Installation/dispatch charts mapped to API (API: `GET /api/v1/dashboard/:id` or add endpoint in docs)
- [ ] Alerts/quick actions mapped to API (API: not found in `docs/api-reference.md`)
- [ ] Search field wired to API (API: `GET /api/v1/dashboard/:id` with query filters, not documented)
- [ ] Time range filters wired to API (API: `GET /api/v1/dashboard/:id` with query filters, not documented)
- [ ] Download actions wired to API (API: not found in `docs/api-reference.md`)
- [ ] Loading/skeleton states (UI only)

**Page: `/admin/approval-management`**
- [x] Admin route guard
- [x] Table data wired to `GET /api/v1/common/admin/approval?` (via `getApprovalManagementData`)
- [ ] Filters (Date/Vendor/Category/Source) wired to API (API: `GET /api/v1/common/admin/approval?` with filter params)
- [ ] Pagination wired to API (API: `GET /api/v1/common/admin/approval?` with `page`, `per_page`)
- [ ] Approve/Reject actions wired to API (API: not found in `docs/api-reference.md`)
- [ ] Download/Resubmission actions wired to API (API: `GET /api/v1/common/files/download?module=loans&ids=...`)
- [ ] Edit drawer “Save” wired to API (API: not found in `docs/api-reference.md`)
- [ ] Loading/skeleton states (UI only)
- [ ] Remove fallback mock data usage (UI only)

**Page: `/admin/leads-projects`**
- [x] Admin route guard
- [x] API helper exists (`getLeadsProjectsData`)
- [ ] Replace mock data with API response across all sections (API: `GET /api/v1/leads`)
- [ ] Search/filter/pagination wired to API (API: `GET /api/v1/leads?vendorId=&isArchived=` + query params)
- [ ] Action buttons (edit/status/notes) wired to API (API: `PUT /api/v1/leads/:id`, `POST /api/v1/leads/assign-vendor`, `POST /api/v1/leads/toggle-favorites`)
- [ ] DPR/download buttons wired to API (API: `GET /api/v1/projects/dpr-report/:id`)
- [ ] Loading/skeleton states (UI only)

**Page: `/admin/vendor-management`**
- [x] Admin route guard
- [x] API helper exists (`getVendorManagementData`)
- [ ] Replace fallback mock cards/requests with API data (API: `GET /api/v1/vendors/combined/list`)
- [ ] Search/filter/pagination wired to API (API: `GET /api/v1/vendors` with query params)
- [ ] Approve/Reject/Chat/Export actions wired to API (API: `GET /api/v1/users?approval=0&type=`, chat: `POST /api/v1/chats/create-lead-message`)
- [ ] Loading/skeleton states (UI only)

**Page: `/admin/vendor-management/[vendorId]`**
- [x] Admin route guard
- [x] API helpers exist (`GET /api/v1/vendors/:id/detail`, `/project`, `/ticket`, `/dashboard`)
- [ ] Map all tabs/sections to API response fields (API: `GET /api/v1/vendors/:id/detail`)
- [ ] Actions (edit/save/status updates) wired to API (API: not found in `docs/api-reference.md`)
- [ ] Loading/skeleton states (UI only)

**Page: `/admin/team-management`**
- [x] Admin route guard
- [x] API helper exists (`getTeamUsers`)
- [ ] Replace mock data with API response (API: `GET /api/v1/users?approval=0&type=`)
- [ ] Search/filter/pagination wired to API (API: `GET /api/v1/users?approval=0&type=`)
- [ ] Create/Edit/Delete actions wired to API (API: `POST /api/v1/users` / `PUT /api/v1/users/:id` / `DELETE /api/v1/users/:id` not in docs)
- [ ] Loading/skeleton states (UI only)

**Page: `/admin/team-management/team-permissions`**
- [x] Admin route guard
- [x] API helpers exist (`GET /api/v1/permissions`, `POST /api/v1/permissions`)
- [ ] Confirm create/update flows use live API responses (API: `POST /api/v1/permissions`)
- [ ] Loading/skeleton states (UI only)

**Page: `/admin/loan-management`**
- [x] Admin route guard
- [x] Loan Requests list wired to `GET /api/v1/loans?loanApprove=0`
- [x] Loan Status list wired to `GET /api/v1/loans?loanApprove=1`
- [x] Detail/Update sidebars map API fields
- [ ] Search input wired to API (API: `GET /api/v1/loans?search=...`)
- [ ] Filters wired to API (API: `GET /api/v1/loans?paymentType=&status=...`)
- [ ] Pagination wired to API (API: `GET /api/v1/loans?page=&per_page=`)
- [ ] Update status “Save” wired to API (API: `PUT /api/v1/loans/:id`)
- [ ] Attachments download/upload wired to API (API: `GET /api/v1/common/files/download?module=loans&ids=...`)
- [ ] Delete actions wired to API (API: `DELETE /api/v1/loans/:id`)
- [ ] Loading/skeleton states (UI only)

**Page: `/admin/fin-tech-partners`**
- [x] Admin route guard
- [x] Grid/list data wired to `GET /api/v1/loan-providers`
- [x] Skeletons for grid/list
- [x] Edit sidebar fetches partner detail (`GET /api/v1/loan-providers/:id`)
- [ ] Search input wired to API (API: `GET /api/v1/loan-providers?search=...`)
- [ ] Filters (Type/Location) wired to API (API: `GET /api/v1/loan-providers?providerType=...`)
- [ ] Pagination wired to API (API: `GET /api/v1/loan-providers?page=&per_page=`)
- [ ] Create form wired to API (API: `POST /api/v1/loan-providers`)
- [ ] Edit “Save” wired to API (API: `PUT /api/v1/loan-providers/:id`)
- [ ] Delete/Deactivate actions wired to API (API: `DELETE /api/v1/loan-providers/:id`)

**Page: `/admin/fin-tech-partners/[partnerId]`**
- [x] Admin route guard
- [x] Detail API wired to `GET /api/v1/loan-providers/:id`
- [x] Skeleton while loading
- [ ] Export action wired to API (API: not found in `docs/api-reference.md`)
- [ ] Edit actions wired to API (API: `PUT /api/v1/loan-providers/:id`)
- [ ] Account tab content wired to API (API: not found in `docs/api-reference.md`)
- [ ] Chat tab content wired to API (API: `POST /api/v1/chats/create-lead-message`)

**Page: `/admin/inventory-management`**
- [x] Admin route guard
- [x] Inventory list wired to `GET /api/v1/inventory`
- [x] Category filter options wired to `GET /api/v1/common/category`
- [x] Skeleton rows while loading
- [ ] Search input wired to API (API: `GET /api/v1/inventory?search=...`)
- [ ] Category filter wired to API query (API: `GET /api/v1/inventory?categoryId=...` not shown in docs)
- [ ] Pagination wired to API (API: `GET /api/v1/inventory?page=&per_page=`)
- [ ] Detail drawer fields mapped to API (remove static values) (API: `GET /api/v1/inventory/:id`)
- [ ] Create/Edit drawers wired to API (API: `POST /api/v1/inventory`, `PUT /api/v1/inventory/:id`)
- [ ] Delete action wired to API (API: `DELETE /api/v1/inventory/:id`)

**Page: `/admin/reports`**
- [x] Admin route guard
- [ ] KPI cards wired to API (API: not found in `docs/api-reference.md`)
- [ ] Tables wired to API (API: not found in `docs/api-reference.md`)
- [ ] Filters/date ranges wired to API (API: not found in `docs/api-reference.md`)
- [ ] Export actions wired to API (API: not found in `docs/api-reference.md`)
- [ ] Loading/skeleton states (UI only)

**Page: `/admin/ticket-alerts`**
- [x] Admin route guard
- [ ] Ticket list wired to API (API: `GET /api/v1/tickets?search=...`)
- [ ] Alerts list wired to API (API: not found in `docs/api-reference.md`)
- [ ] Filters wired to API (API: `GET /api/v1/tickets?search=...`)
- [ ] Actions (resolve/assign/etc.) wired to API (API: `PUT /api/v1/tickets/:id`)
- [ ] Loading/skeleton states (UI only)

**Page: `/admin/support`**
- [x] Admin route guard
- [ ] Support list wired to API (API: not found in `docs/api-reference.md`)
- [ ] Filters wired to API (API: not found in `docs/api-reference.md`)
- [ ] Actions (close/assign/etc.) wired to API (API: not found in `docs/api-reference.md`)
- [ ] Loading/skeleton states (UI only)

**Page: `/admin/settings`**
- [x] Admin route guard
- [ ] Preferences wired to API (API: `GET /api/v1/common/account-settings/:id`, `POST /api/v1/common/account-settings`)
- [ ] Notifications wired to API (API: same as account-settings)
- [ ] Save actions wired to API (API: `POST /api/v1/common/account-settings`)
- [ ] Loading/skeleton states (UI only)

**Page: `/admin/settings/dropdown/[item]`**
- [x] Admin route guard
- [ ] Dropdown list items wired to API (API: not found in `docs/api-reference.md`)
- [ ] Create/Edit/Delete wired to API (API: not found in `docs/api-reference.md`)
- [ ] Loading/skeleton states (UI only)
