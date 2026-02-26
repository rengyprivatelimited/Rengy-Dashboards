"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowUpDown,
  Bell,
  ChevronDown,
  MoreVertical,
  Pencil,
  Search,
  Trash2,
  Users,
  X,
} from "lucide-react";
import { RootSidebar } from "@/components/RootSidebar";
import { mockData } from "@/lib/mock-data";

type TeamTab =
  | "Sales Team"
  | "Finance"
  | "Design"
  | "Loan Team"
  | "Operation Team"
  | "AMC Team"
  | "Net Metering Team";

type CrudKey = "create" | "read" | "update" | "delete";
type RoleDrawerMode = "create" | "edit" | null;

type ModulePermission = {
  module: string;
  create: boolean;
  read: boolean;
  update: boolean;
  delete: boolean;
};

type PermissionRow = {
  role: string;
  modulePermissions: ModulePermission[];
  users: string;
  name: string;
  dateCreated: string;
  team: TeamTab;
};

const teamTabs: TeamTab[] = [
  "Sales Team",
  "Finance",
  "Design",
  "Loan Team",
  "Operation Team",
  "AMC Team",
  "Net Metering Team",
];

const permissionModules = ["Dashboard", "Teams & Leads", "Tickets and Alerts"] as const;

const createEmptyModulePermissions = (): ModulePermission[] =>
  permissionModules.map((module) => ({
    module,
    create: false,
    read: false,
    update: false,
    delete: false,
  }));

const createSeedModulePermissions = (): ModulePermission[] =>
  permissionModules.map((module) => ({
    module,
    create: true,
    read: true,
    update: true,
    delete: true,
  }));

const initialPermissionRows: PermissionRow[] = (mockData.teamPermissions.rows as Array<Omit<PermissionRow, "modulePermissions">>).map(
  (row) => ({ ...row, modulePermissions: createSeedModulePermissions() }),
);

export default function TeamPermissionsPage() {
  const [activeTeamTab, setActiveTeamTab] = useState<TeamTab>("Sales Team");
  const [roles, setRoles] = useState<PermissionRow[]>(initialPermissionRows);
  const [actionRowIndex, setActionRowIndex] = useState<number | null>(null);
  const [drawerMode, setDrawerMode] = useState<RoleDrawerMode>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [roleName, setRoleName] = useState("");
  const [modulePermissions, setModulePermissions] = useState<ModulePermission[]>(
    createEmptyModulePermissions(),
  );
  const actionMenuRef = useRef<HTMLDivElement | null>(null);

  const rows = useMemo(
    () => roles.filter((row) => row.team === activeTeamTab),
    [activeTeamTab, roles],
  );

  useEffect(() => {
    const closeMenu = (event: MouseEvent) => {
      if (!actionMenuRef.current) return;
      if (!actionMenuRef.current.contains(event.target as Node)) setActionRowIndex(null);
    };
    document.addEventListener("mousedown", closeMenu);
    return () => document.removeEventListener("mousedown", closeMenu);
  }, []);

  const openEdit = (row: PermissionRow, index: number) => {
    setEditingIndex(index);
    setRoleName(row.role);
    setModulePermissions(row.modulePermissions.map((modulePermission) => ({ ...modulePermission })));
    setDrawerMode("edit");
    setActionRowIndex(null);
  };

  const openCreate = () => {
    setEditingIndex(null);
    setRoleName("");
    setModulePermissions(createEmptyModulePermissions());
    setDrawerMode("create");
  };

  const updateAllCrudForModule = (module: string, value: boolean) => {
    setModulePermissions((prev) =>
      prev.map((permission) =>
        permission.module === module
          ? { ...permission, create: value, read: value, update: value, delete: value }
          : permission,
      ),
    );
  };

  const updateCrudValue = (module: string, key: CrudKey, value: boolean) => {
    setModulePermissions((prev) =>
      prev.map((permission) =>
        permission.module === module ? { ...permission, [key]: value } : permission,
      ),
    );
  };

  const setAllModulesCrud = (value: boolean) => {
    setModulePermissions((prev) =>
      prev.map((permission) => ({
        ...permission,
        create: value,
        read: value,
        update: value,
        delete: value,
      })),
    );
  };

  const saveRole = () => {
    if (!roleName.trim()) return;
    if (drawerMode === "edit" && editingIndex !== null) {
      setRoles((prev) =>
        prev.map((row, index) =>
          index === editingIndex
            ? {
                ...row,
                role: roleName.trim(),
                modulePermissions: modulePermissions.map((permission) => ({ ...permission })),
              }
            : row,
        ),
      );
    }

    if (drawerMode === "create") {
      setRoles((prev) => [
        {
          role: roleName.trim(),
          modulePermissions: modulePermissions.map((permission) => ({ ...permission })),
          users: "sample@gmail.com",
          name: "Atul",
          dateCreated: "12-04-2025",
          team: activeTeamTab,
        },
        ...prev,
      ]);
    }

    setDrawerMode(null);
  };

  const activeModuleTags = (permissions: ModulePermission[]) =>
    permissions
      .filter((permission) => permission.create || permission.read || permission.update || permission.delete)
      .map((permission) => permission.module);

  return (
    <div className="min-h-screen bg-[#eceef2] text-[#171b24]">
      <div className="flex">
        <RootSidebar activeLabel="Team Management" />

        <main className="min-w-0 flex-1">
          <header className="flex h-[54px] items-center justify-between border-b border-[#d5d9e2] bg-[#f8f9fb] px-5">
            <div className="text-[21px] font-semibold text-[#1f2937]">Admin</div>
            <div className="flex items-center gap-2">
              <div className="hidden h-9 w-[210px] items-center gap-2 rounded border border-[#d8dee8] bg-white px-2.5 text-[12px] text-[#8f97a6] md:flex">
                <Search className="h-4 w-4" />
                Search
              </div>
              <Bell className="h-4 w-4 text-[#4a5160]" />
              <div className="flex items-center gap-1">
                <div className="h-6 w-6 rounded-full bg-[#d89d77]" />
                <span className="text-[13px] text-[#4c5564]">Rajesh B</span>
                <ChevronDown className="h-3.5 w-3.5 text-[#7f8898]" />
              </div>
            </div>
          </header>

          <div className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-[32px] font-semibold leading-none text-[#111827]">Permissions</h1>
                <p className="mt-1 text-[13px] text-[#7a8494]">Manage Permissions</p>
              </div>
              <button
                type="button"
                onClick={openCreate}
                className="h-10 rounded bg-[#131740] px-4 text-[13px] font-semibold text-white"
              >
                Create Role +
              </button>
            </div>

            <section className="mt-4 rounded-md border border-[#d8dde5] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.05)]">
              <div className="flex overflow-x-auto border-b border-[#e4e7ec] px-2 pt-1">
                {teamTabs.map((team) => (
                  <button
                    key={team}
                    type="button"
                    onClick={() => setActiveTeamTab(team)}
                    className={`inline-flex h-9 shrink-0 items-center gap-1.5 border px-3 text-[12px] ${
                      activeTeamTab === team
                        ? "border-[#7cc9c1] bg-[#eef9f7] font-semibold text-[#1f2b46]"
                        : "border-[#dfe5ee] bg-white text-[#6f7786]"
                    }`}
                  >
                    <Users className="h-3.5 w-3.5" />
                    {team}
                  </button>
                ))}
              </div>

              <div className="p-3" ref={actionMenuRef}>
                <div className="overflow-x-auto rounded-md border border-[#e4e7ec]">
                  <table className="w-full min-w-[1120px] table-fixed border-separate border-spacing-0 text-left">
                    <colgroup>
                      <col className="w-[42px]" />
                      <col className="w-[180px]" />
                      <col className="w-[280px]" />
                      <col className="w-[140px]" />
                      <col className="w-[120px]" />
                      <col className="w-[140px]" />
                      <col className="w-[80px]" />
                    </colgroup>
                    <thead>
                      <tr className="sticky top-0 z-10 h-[44px] bg-[#d4dfdd] text-[12px] font-semibold text-[#1f2937]">
                        <th className="rounded-l-md border border-[#e4e7ec] border-r-0 px-2">
                          <input type="checkbox" className="h-4 w-4 rounded border-[#c5ccd8]" />
                        </th>
                        <th className="border border-[#e4e7ec] border-r-0 px-2">
                          <span className="inline-flex items-center gap-1">
                            Role <ArrowUpDown className="h-3 w-3 text-[#8b96a7]" />
                          </span>
                        </th>
                        <th className="border border-[#e4e7ec] border-r-0 px-2">Module Assigned</th>
                        <th className="border border-[#e4e7ec] border-r-0 px-2">No: Users</th>
                        <th className="border border-[#e4e7ec] border-r-0 px-2">Name</th>
                        <th className="border border-[#e4e7ec] border-r-0 px-2">Date Created</th>
                        <th className="rounded-r-md border border-[#e4e7ec] px-2" />
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((row, index) => (
                        <tr key={`${row.role}-${index}`} className="h-[80px] text-[12px] text-[#111827] odd:bg-[#f9fbfc]">
                          <td className="border border-t-0 border-[#e4e7ec] px-2">
                            <input type="checkbox" className="h-4 w-4 rounded border-[#c5ccd8]" />
                          </td>
                          <td className="border border-t-0 border-[#e4e7ec] px-2">{row.role}</td>
                          <td className="border border-t-0 border-[#e4e7ec] px-2">
                            <div className="flex flex-wrap gap-1">
                              {activeModuleTags(row.modulePermissions).map((moduleName, moduleIndex) => (
                                <span
                                  key={`${moduleName}-${moduleIndex}`}
                                  className="rounded border border-[#c9d7ea] bg-[#edf4ff] px-1.5 py-0.5 text-[11px] text-[#2d4f79]"
                                >
                                  {moduleName}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="border border-t-0 border-[#e4e7ec] px-2">{row.users}</td>
                          <td className="border border-t-0 border-[#e4e7ec] px-2">{row.name}</td>
                          <td className="border border-t-0 border-[#e4e7ec] px-2 font-semibold">{row.dateCreated}</td>
                          <td className="border border-t-0 border-[#e4e7ec] px-2">
                            <div className="relative flex items-center justify-center">
                              <button
                                type="button"
                                onClick={(event) => {
                                  event.stopPropagation();
                                  setActionRowIndex((prev) => (prev === index ? null : index));
                                }}
                                className="inline-flex h-6 w-6 items-center justify-center"
                              >
                                <MoreVertical className="h-4 w-4" />
                              </button>
                              {actionRowIndex === index && (
                                <div className="absolute right-0 top-7 z-30 w-[124px] overflow-hidden rounded-lg border border-[#d9dce3] bg-white shadow-md">
                                  <button
                                    type="button"
                                    onClick={(event) => {
                                      event.stopPropagation();
                                      openEdit(row, index);
                                    }}
                                    className="flex h-8 w-full items-center gap-2 px-3 text-left text-xs text-[#4b5563] hover:bg-[#f8fafc]"
                                  >
                                    <Pencil className="h-3.5 w-3.5" />
                                    Edit
                                  </button>
                                  <button
                                    type="button"
                                    onClick={(event) => event.stopPropagation()}
                                    className="flex h-8 w-full items-center gap-2 px-3 text-left text-xs text-[#ef4444] hover:bg-[#fff5f5]"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                    Delete
                                  </button>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-3 flex items-center justify-between px-1 text-[13px] text-[#111827]">
                  <div className="flex items-center gap-3">
                    <span>Page 1 of 10</span>
                    <button className="inline-flex h-8 items-center rounded border border-[#d1d5db] px-3 text-[13px] text-[#6b7280]">
                      Show 10 rows
                      <ChevronDown className="ml-2 h-3.5 w-3.5" />
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="h-8 rounded border border-[#d1d5db] px-3 text-[12px] text-[#4b5563]">Previous</button>
                    <button className="h-8 w-7 rounded bg-[#0f1136] text-[12px] font-semibold text-white">1</button>
                    {["2", "4", "5", "6", "7"].map((page) => (
                      <button key={page} className="h-8 w-7 rounded border border-[#d1d5db] text-[12px] text-[#6b7280]">
                        {page}
                      </button>
                    ))}
                    <button className="h-8 rounded border border-[#d1d5db] px-3 text-[12px] text-[#4b5563]">Next</button>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>

      {drawerMode && <div className="fixed inset-0 z-40 bg-black/45" />}

      {drawerMode && (
        <aside className="fixed right-0 top-0 z-50 flex h-full w-[520px] flex-col border-l border-[#d9dee7] bg-white p-4">
          <div className="flex items-start justify-between border-b border-[#e6eaf0] pb-3">
            <div>
              <h2 className="text-[24px] font-semibold text-[#111827]">
                {drawerMode === "create" ? "Create New Role" : `Edit ${roleName || "Role"}`}
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setDrawerMode(null)}
              className="rounded border border-[#d1d5db] p-1 text-[#6b7280]"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-4">
            <div>
              <div className="text-xs font-semibold text-[#374151]">Role Name*</div>
              <input
                value={roleName}
                onChange={(e) => setRoleName(e.target.value)}
                placeholder="Enter role name"
                className="mt-1 h-9 w-full rounded border border-[#d4dae4] bg-[#f7f8fa] px-2 text-sm text-[#374151]"
              />
            </div>

            <div className="mt-4 border-t border-[#e6eaf0] pt-4">
              <div className="flex items-center justify-between">
                <div className="text-xs font-semibold text-[#374151]">Modules & CRUD Permissions</div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setAllModulesCrud(true)}
                    className="rounded border border-[#c9d7ea] px-2 py-1 text-[11px] text-[#2d4f79]"
                  >
                    Select All
                  </button>
                  <button
                    type="button"
                    onClick={() => setAllModulesCrud(false)}
                    className="rounded border border-[#c9d7ea] px-2 py-1 text-[11px] text-[#2d4f79]"
                  >
                    Deselect All
                  </button>
                </div>
              </div>

              <div className="mt-3 space-y-2">
                {modulePermissions.map((permission) => {
                  const allChecked =
                    permission.create && permission.read && permission.update && permission.delete;
                  return (
                    <div key={permission.module} className="rounded border border-[#e4e7ec] bg-[#fafbfd] p-2">
                      <div className="flex items-center justify-between">
                        <div className="text-[13px] font-semibold text-[#1f2937]">{permission.module}</div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => updateAllCrudForModule(permission.module, true)}
                            className="rounded border border-[#d6dde8] px-2 py-0.5 text-[11px] text-[#4b5563]"
                          >
                            All
                          </button>
                          <button
                            type="button"
                            onClick={() => updateAllCrudForModule(permission.module, false)}
                            className="rounded border border-[#d6dde8] px-2 py-0.5 text-[11px] text-[#4b5563]"
                          >
                            None
                          </button>
                          <input
                            type="checkbox"
                            checked={allChecked}
                            onChange={(e) => updateAllCrudForModule(permission.module, e.target.checked)}
                            className="h-4 w-4 rounded border-[#bfc7d4]"
                          />
                        </div>
                      </div>

                      <div className="mt-2 grid grid-cols-4 gap-2">
                        {(
                          [
                            { key: "create", label: "Create" },
                            { key: "read", label: "Read" },
                            { key: "update", label: "Update" },
                            { key: "delete", label: "Delete" },
                          ] as { key: CrudKey; label: string }[]
                        ).map((crud) => (
                          <label
                            key={crud.key}
                            className="flex items-center gap-1 rounded border border-[#e4e7ec] bg-white px-2 py-1 text-[11px] text-[#4b5563]"
                          >
                            <input
                              type="checkbox"
                              checked={permission[crud.key]}
                              onChange={(e) => updateCrudValue(permission.module, crud.key, e.target.checked)}
                              className="h-3.5 w-3.5 rounded border-[#bfc7d4]"
                            />
                            {crud.label}
                          </label>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="mt-auto grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setDrawerMode(null)}
              className="h-10 rounded border border-[#d1d5db] text-sm font-semibold text-[#4b5563]"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={saveRole}
              className="h-10 rounded bg-[#131740] text-sm font-semibold text-white"
            >
              Save
            </button>
          </div>
        </aside>
      )}
    </div>
  );
}

