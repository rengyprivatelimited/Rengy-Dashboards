# Modular App Structure

This codebase stays in a single Next.js app, organized by feature modules for scale.

## Current Modules

- `features/auth`
  - `auth-config.ts`: role model, demo credentials, auth helpers
- `features/dashboard/components`
  - `AdminDashboardLegacy.tsx`: restored admin dashboard UI
  - `RoleDashboard.tsx`: role-based dashboards for non-admin teams
  - `shared/DashboardTopHeader.tsx`: reusable dashboard header chrome
  - `shared/RoleNavigationMenu.tsx`: reusable role sidebar navigation menu
- `features/dashboard/config`
  - `role-dashboard-config.ts`: centralized role nav/stat config and role UI helpers

## Compatibility Shims

- `lib/auth.ts` re-exports from `features/auth/auth-config`.
- `components/role-dashboards/*` re-export dashboard components from `features/dashboard/components`.

These shims let us migrate incrementally without breaking existing imports.

## Recommended Next Steps

1. Move role-specific dashboard sections from `RoleDashboard.tsx` into one file per role.
2. Add `features/dashboard/data` for mock/API mappers per role.
3. Add `features/dashboard/types` for shared dashboard view models.
4. Replace shims once all imports point to `features/*`.
