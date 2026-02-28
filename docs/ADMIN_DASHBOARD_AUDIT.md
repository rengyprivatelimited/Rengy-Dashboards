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
- [x] Filters (Date/Vendor/Category/Source) wired to API (API: `GET /api/v1/common/admin/approval?` with filter params)
- [x] Pagination wired to API (API: `GET /api/v1/common/admin/approval?` with `page`, `per_page`)
- [x] Approve/Reject actions wired to API (API: best-guess `POST /api/v1/common/admin/approval` since not in docs)
- [x] Download/Resubmission actions wired to API (API: `GET /api/v1/common/files/download?module=loans&ids=...`)
- [x] Edit drawer "Save" wired to API (API: best-guess `POST /api/v1/common/admin/approval` since not in docs)
- [x] Loading/skeleton states (UI only)
- [x] Remove fallback mock data usage (UI only)

**Page: `/admin/leads-projects`**
- [x] Admin route guard
- [x] API helper exists (`getLeadsProjectsData`)
- [x] Replace mock data with API response across all sections (API: `GET /api/v1/leads`)
- [x] Search/filter/pagination wired to API (API: `GET /api/v1/leads?vendorId=&isArchived=` + query params)
- [x] Action buttons (edit/status/notes) wired to API (API: `PUT /api/v1/leads/:id`, `POST /api/v1/leads/assign-vendor`, `POST /api/v1/leads/toggle-favorites`)
- [x] DPR/download buttons wired to API (API: `GET /api/v1/projects/dpr-report/:id`)
- [x] Loading/skeleton states (UI only)

**Page: `/admin/vendor-management`**
- [x] Admin route guard
- [x] API helper exists (`getVendorManagementData`)
- [x] Replace fallback mock cards/requests with API data (API: `GET /api/v1/vendors` + optional includes)
- [x] Search/filter/pagination wired to API (API: `GET /api/v1/vendors` with query params)
- [x] Approve/Reject/Chat/Export actions wired to API (API: `PUT /api/v1/users`, chat: `POST /api/v1/chats/create-lead-message`)
- [x] Loading/skeleton states (UI only)

**Page: `/admin/vendor-management/[vendorId]`**
- [x] Admin route guard
- [x] API helpers exist (`GET /api/v1/vendors/:id/detail`, `/project`, `/ticket`, `/dashboard`)
- [x] Map all tabs/sections to API response fields (API: `GET /api/v1/vendors/:id/detail`)
- [x] Actions (edit/save/status updates) wired to API (API: `PUT /api/v1/users/:id/profile`, `PUT/DELETE /api/v1/users/:id`)
- [x] Loading/skeleton states (UI only)

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
- [x] Confirm create/update flows use live API responses (API: `POST /api/v1/permissions`)
- [x] Loading/skeleton states (UI only)

**Page: `/admin/loan-management`**
- [x] Admin route guard
- [x] Loan Requests list wired to `GET /api/v1/loans?loanApprove=0`
- [x] Loan Status list wired to `GET /api/v1/loans?loanApprove=1`
- [x] Detail/Update sidebars map API fields
- [x] Search input wired to API (API: `GET /api/v1/loans?search=...`)
- [x] Filters wired to API (API: `GET /api/v1/loans?paymentType=&status=...`)
- [x] Pagination wired to API (API: `GET /api/v1/loans?page=&per_page=`)
- [x] Update status "Save" wired to API (API: `PUT /api/v1/loans/:id`)
- [x] Attachments download/upload wired to API (API: `GET /api/v1/common/files/download?module=loans&ids=...`, upload via `PUT /api/v1/loans/:id`)
- [x] Delete actions wired to API (API: `DELETE /api/v1/loans/:id`)
- [x] Loading/skeleton states (UI only)

**Page: `/admin/fin-tech-partners`**
- [x] Admin route guard
- [x] Grid/list data wired to `GET /api/v1/loan-providers`
- [x] Skeletons for grid/list
- [x] Edit sidebar fetches partner detail (`GET /api/v1/loan-providers/:id`)
- [x] Search input wired to API (API: `GET /api/v1/loan-providers?search=...`)
- [x] Filters (Type/Location) wired to API (API: `GET /api/v1/loan-providers?providerType=...`)
- [x] Pagination wired to API (API: `GET /api/v1/loan-providers?page=&per_page=`)
- [x] Create form wired to API (API: `POST /api/v1/loan-providers`)
- [x] Edit "Save" wired to API (API: `PUT /api/v1/loan-providers/:id`)
- [x] Delete/Deactivate actions wired to API (API: `DELETE /api/v1/loan-providers/:id`)

**Page: `/admin/fin-tech-partners/[partnerId]`**
- [x] Admin route guard
- [x] Detail API wired to `GET /api/v1/loan-providers/:id`
- [x] Skeleton while loading
- [x] Export action wired to API (API: best-guess `GET /api/v1/loan-providers?export=1`)
- [x] Edit actions wired to API (API: `PUT /api/v1/loan-providers/:id`)
- [x] Account tab content wired to API (API: `GET /api/v1/loan-providers/:id`)
- [x] Chat tab content wired to API (API: `POST /api/v1/chats/create-lead-message`)

**Page: `/admin/inventory-management`**
- [x] Admin route guard
- [x] Inventory list wired to `GET /api/v1/inventory`
- [x] Category filter options wired to `GET /api/v1/common/category`
- [x] Skeleton rows while loading
- [x] Search input wired to API (API: `GET /api/v1/inventory?search=...`)
- [x] Category filter wired to API query (API: `GET /api/v1/inventory?categoryId=...` not shown in docs)
- [x] Pagination wired to API (API: `GET /api/v1/inventory?page=&per_page=`)
- [x] Detail drawer fields mapped to API (API: `GET /api/v1/inventory/:id`)
- [x] Create/Edit drawers wired to API (API: `POST /api/v1/inventory`, `PUT /api/v1/inventory/:id`)
- [x] Delete action wired to API (API: `DELETE /api/v1/inventory/:id`)

**Page: `/admin/reports`**
- [x] Admin route guard
- [ ] KPI cards wired to API (API: not found in `docs/api-reference.md`)
- [ ] Tables wired to API (API: not found in `docs/api-reference.md`)
- [ ] Filters/date ranges wired to API (API: not found in `docs/api-reference.md`)
- [ ] Export actions wired to API (API: not found in `docs/api-reference.md`)
- [ ] Loading/skeleton states (UI only)

**Page: `/admin/ticket-alerts`**
- [x] Admin route guard
- [x] Ticket list wired to API (API: `GET /api/v1/tickets?search=...`)
- [x] Alerts list wired to API (API: `GET /api/v1/alerts?search=...`)
- [x] Filters wired to API (API: `GET /api/v1/tickets?search=...` with filter tokens)
- [x] Actions (resolve/assign/etc.) wired to API (API: `PUT /api/v1/tickets/:id`)
- [x] Loading/skeleton states (UI only)

**Page: `/admin/support`**
- [x] Admin route guard
- [ ] Support list wired to API (API: not found in `docs/api-reference.md`)
- [ ] Filters wired to API (API: not found in `docs/api-reference.md`)
- [ ] Actions (close/assign/etc.) wired to API (API: not found in `docs/api-reference.md`)
- [ ] Loading/skeleton states (UI only)

**Page: `/admin/settings`**
- [x] Admin route guard
- [x] Preferences wired to API (API: `GET /api/v1/common/account-settings/:id`, `POST /api/v1/common/account-settings`)
- [x] Notifications wired to API (API: same as account-settings)
- [x] Save actions wired to API (API: `POST /api/v1/common/account-settings`)
- [x] Loading/skeleton states (UI only)

**Page: `/admin/settings/dropdown/[item]`**
- [x] Admin route guard
- [ ] Dropdown list items wired to API (API: not found in `docs/api-reference.md`)
- [ ] Create/Edit/Delete wired to API (API: not found in `docs/api-reference.md`)
- [ ] Loading/skeleton states (UI only)
