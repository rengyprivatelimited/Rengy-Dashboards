# RENGY Admin: Project Architecture and Data Flow

## 1. Executive Summary

This project is a **Next.js App Router frontend** for an internal/admin-style operations dashboard.  
It is currently a **UI-first implementation** with local state and static mock datasets in page files.

Core characteristics:
- Tech stack: `Next.js 16`, `React 19`, `TypeScript`, `Tailwind CSS v4`, `lucide-react`
- Rendering: mostly **client components** (`"use client"`) for interactive dashboard behavior
- Data source: **in-file constants** (arrays/objects), no API integration yet
- Persistence: minimal (`localStorage` used only for sidebar collapse state)
- Navigation: route-based pages + in-page tabs + drawer/modal overlays


## 2. Project Structure

Top-level structure:
- `app/` -> route pages (App Router)
- `components/` -> shared/legacy UI components
- `public/` -> static assets

Main routes under `app/`:
- `/` -> Dashboard
- `/approval-management`
- `/leads-projects`
- `/vendor-management`
- `/vendor-management/[vendorId]`
- `/team-management`
- `/team-management/team-permissions`
- `/loan-management`
- `/fin-tech-partners`
- `/fin-tech-partners/[partnerId]`
- `/inventory-management`
- `/reports`
- `/ticket-alerts`
- `/support`
- `/settings`
- `/settings/dropdown/[item]`


## 3. Shared Layout and Navigation Flow

### 3.1 Root layout
File: `app/layout.tsx`
- Applies global fonts (`Geist`, `Geist Mono`) and global CSS
- Wraps all pages with standard HTML body shell

### 3.2 Sidebar
File: `components/RootSidebar.tsx`
- Central navigation for all major modules
- Uses `usePathname()` to detect active menu item
- Supports collapse/expand behavior
- Collapse state is persisted in `localStorage` key:
  - `rengy-sidebar-collapsed`

### 3.3 Page header pattern
Most pages include a repeated top header:
- left: section/team title (`Admin`, `Loan Team`, `Overview`, etc.)
- right: search, bell icon, avatar/user text

This header is duplicated per-page, not centralized yet.


## 4. Data Flow Model (Current State)

Current data flow is **local UI state only**:

1. Static datasets are declared in each route file.
2. UI interactions mutate local state via `useState`.
3. Derived views are computed with `useMemo` where needed.
4. Dropdown/popup/drawer open-close behavior uses:
   - local booleans/IDs
   - `useRef` + document `mousedown` handlers to close on outside click
5. No server fetch, no global state manager, no form library, no API layer.

Implication:
- Fast iteration for UI
- No persistent business data lifecycle yet
- Repeated logic across pages


## 5. Route-by-Route Behavior and State

## 5.1 Dashboard (`app/page.tsx`)
- Uses `RootSidebar`
- Local stat cards and team cards from constants
- No advanced state/data; mostly static presentation

## 5.2 Approval Management (`app/approval-management/page.tsx`)
State:
- `activeTab`, `isFilterOpen`, selected rows for drawers, `drawerMode`
- Uses `useEffect` for outside-click closing of filter
Data:
- `installationRows`, `onboardingRows`, `amcRows`
Flow:
- Tab selection switches data table
- Action buttons open view/edit drawers

## 5.3 Leads & Projects (`app/leads-projects/page.tsx`)
Most state-heavy route.
State includes:
- top tab (`Projects`/`Leads`)
- mutable row arrays (`projects`, `leads`)
- multi-mode drawer state
- project detail tabing (`Milestone`, `Payments History`, `Remarks`)
- floating filters/positioning state for nested popup menus
- form models for create/edit flows
Flow:
- table row selection -> detailed drawer
- separate edit/create/view/detailed edit modes
- nested floating filter menus driven by computed panel coordinates

## 5.4 Vendor Management (`app/vendor-management/page.tsx`)
State:
- `activeTab` (`vendors` vs `requests`)
- selected request drawer
Flow:
- vendor cards navigate to `/vendor-management/[vendorId]`
- vendor request cards open right sidebar detail

## 5.5 Vendor Detail (`app/vendor-management/[vendorId]/page.tsx`)
State:
- main tab (`overview`, `project`, `ticket`, `account`, `chat`)
- edit drawer toggle
- sort dropdown toggles with outside-click close
Flow:
- back action routes to `/vendor-management`
- per-tab UI switches
- edit opens sidebar form

## 5.6 Team Management (`app/team-management/page.tsx`)
State:
- active team tab
- row action menu
- drawer mode (`view`, `edit`, `add`, `target`)
- editable form fields
Flow:
- rows filtered by team (`useMemo`)
- action menu opens per row
- multiple drawer variants for user and target settings

## 5.7 Team Permissions (`app/team-management/team-permissions/page.tsx`)
State:
- active team tab
- roles array (mutable)
- role editor drawer state
- module CRUD permissions matrix
Flow:
- supports create/edit role in local state
- CRUD matrix toggles per module and globally

## 5.8 Loan Management (`app/loan-management/page.tsx`)
State:
- active tab (`requests`/`status`)
- mutable status rows
- filter/menu/status dropdown controls
- selected rows for view/update drawers
Flow:
- per-row actions open 3-dot menu
- update drawer can change loan status in-memory

## 5.9 Fin-tech Partners (`app/fin-tech-partners/page.tsx`)
State:
- `viewMode` (`grid`/`list`)
- edit and create drawer toggles
Flow:
- cards/rows navigate to detail route `/fin-tech-partners/[partnerId]`
- list has edit drawer

## 5.10 Fin-tech Partner Detail (`app/fin-tech-partners/[partnerId]/page.tsx`)
State:
- tab state (`overview`, `account`, `chat`)
Flow:
- currently detailed UI sections with tabbed content
- mostly static fields and sample values

## 5.11 Inventory Management (`app/inventory-management/page.tsx`)
State:
- row action menu, selected detail row, edit row, create drawer
- category select has nested add-new category flow
Flow:
- row click opens detail drawer
- edit/create drawers share common form structure
- custom category dropdown supports inline extension

## 5.12 Reports (`app/reports/page.tsx`)
- UI-centric analytics dashboard with static KPIs/charts/tables
- reusable section + pagination helper components inside file
- no dynamic filtering backend yet

## 5.13 Ticket & Alerts (`app/ticket-alerts/page.tsx`)
State:
- top tab (`alerts`/`tickets`)
- alerts list with read/unread mutation
- filter dropdown toggle
- selected ticket drawer, create ticket drawer
Flow:
- alerts can be marked read/unread
- tickets table opens detail sidebar

## 5.14 Support (`app/support/page.tsx`)
State:
- filter and nested vendor filter
- row-level action menu
- separate view/edit side drawers
Flow:
- 3-dot menu supports edit/view/delete actions
- side drawers provide ticket details and reassignment form

## 5.15 Settings (`app/settings/page.tsx`)
State:
- tab derived from URL query: `?tab=dashboard|notifications|documents|dropdown`
- modal toggles for terms/SLA documents/SLA days
Flow:
- query-param controlled tabbing (router push)
- dropdown cards link to detail route

## 5.16 Settings Dropdown Detail (`app/settings/dropdown/[item]/page.tsx`)
State:
- uses dynamic route param `item`
Flow:
- maps param to metadata object
- table + pagination UI for dropdown values
- back button routes to `/settings?tab=dropdown`


## 6. Shared Interaction Patterns

Common patterns repeated across many pages:
- Right-side drawer overlays for view/edit/create flows
- In-page tabs with local state switching
- 3-dot row action menus
- Filter popovers with nested options
- Pagination controls (mostly static)
- Search inputs as presentational controls


## 7. Technical Observations and Current Gaps

## 7.1 Strengths
- Strong UI coverage across many modules
- Clear modular route separation
- Consistent design language and interaction behavior

## 7.2 Gaps / Risks
- No backend/API integration yet
- Data duplicated and hardcoded across pages
- Repeated topbar and table/pagination UI code
- Large page files with mixed concerns (types + data + handlers + markup)
- Some text encoding artifacts (`â‡µ`, `â€œ`) indicate charset cleanup needed
- Several presentational/legacy components in `components/` appear unused


## 8. Architecture Recommendation (Next Phase)

Recommended incremental refactor path:

1. **Introduce shared data contracts**
- Move types to `types/` (e.g., `types/loan.ts`, `types/vendor.ts`)

2. **Extract reusable UI primitives**
- `PageHeader`, `DataTable`, `Pagination`, `DrawerShell`, `FilterPopover`

3. **Add data layer**
- Start with API abstraction in `services/` (or `lib/api/`)
- Replace local constants with async fetch + loading/error states

4. **Centralize route metadata**
- sidebar menu + tab configs from one source

5. **Stabilize interaction state**
- Use reusable hooks for outside-click, anchored popovers, drawer modes

6. **Quality pass**
- Normalize encoding artifacts and typography tokens
- Add lint/type checks to CI and basic component tests


## 9. Quick Dependency and Config Snapshot

- Runtime deps:
  - `next@16.1.6`
  - `react@19.2.3`
  - `react-dom@19.2.3`
  - `lucide-react`
- Dev:
  - `typescript`, `eslint`, `eslint-config-next`, `tailwindcss@4`
- TS path alias:
  - `@/*` -> project root (`tsconfig.json`)


## 10. Practical Definition of “Data Flow” in This Repo Today

Today:
- User interaction -> `useState` update -> immediate re-render
- Route transition -> Next.js client navigation (`Link`/router)
- No persisted domain data lifecycle

Target (recommended):
- User interaction -> action handler -> API/service -> cache/state store -> UI render
- Shared schemas and validation for form-heavy drawers


## 11. Suggested Immediate Next Actions

If we continue from this baseline, the highest-value next tasks are:

1. Extract shared top header + drawer shell components.
2. Create a `mockApi` layer and move in-file arrays there first.
3. Refactor one vertical end-to-end (recommended: `loan-management`) as the reference architecture.
4. Apply the same pattern to support/ticket/leads pages.

