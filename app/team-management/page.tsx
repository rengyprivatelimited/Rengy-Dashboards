"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import {
  ArrowUpDown,
  Bell,
  CalendarDays,
  ChevronDown,
  Mail,
  MessageSquare,
  MoreVertical,
  Pencil,
  Phone,
  Search,
  UserRound,
  Users,
  X,
} from "lucide-react";
import { RootSidebar } from "@/components/RootSidebar";
import { mockData } from "@/lib/mock-data";
import {
  createTeamUser,
  deleteTeamUser,
  getTeamUsers,
  updateTeamUser,
} from "@/features/admin/api/team-management";

type TeamTab =
  | "Sales Team"
  | "Finance"
  | "Design"
  | "Loan Team"
  | "Operation Team"
  | "AMC Team"
  | "Net Metering Team"
  | "Supply Chain Team";

type UserRow = {
  employeeId: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  dateCreated: string;
  team: TeamTab;
};

type DrawerMode = "view" | "edit" | "add" | "target" | null;

type UserForm = {
  name: string;
  email: string;
  phone: string;
  team: string;
  role: any;
  joiningDate: string;
};

const teamTabs: TeamTab[] = (() => {
  const base = mockData.teamManagement.teamTabs as TeamTab[];
  if (base.includes("Supply Chain Team")) return base;
  return [...base, "Supply Chain Team"];
})();

function emptyForm(): UserForm {
  return { name: "", email: "", phone: "", team: "Sales Team", role: {name: "Manager"}, joiningDate: "" };
}

function filledFormFromUser(user: UserRow): UserForm {
  return { name: user.name, email: user.email, phone: user.phone, team: user.team, role: {name: "Manager"}, joiningDate: user.dateCreated ?? "" };
}

function SkeletonBlock({ className }: { className: string }) {
  return <div className={`animate-pulse rounded bg-[#e6eaf2] ${className}`} />;
}

function TeamManagementPageComponent() {
  const [activeTeamTab, setActiveTeamTab] = useState<TeamTab>("Sales Team");
  const [actionRowIndex, setActionRowIndex] = useState<number | null>(null);
  const [drawerMode, setDrawerMode] = useState<DrawerMode>(null);
  const [selectedUser, setSelectedUser] = useState<UserRow | null>(null);
  const [form, setForm] = useState<UserForm>(emptyForm());
  const [targetRevenue, setTargetRevenue] = useState("100000");
  const [targetDuration, setTargetDuration] = useState("Custom");
  const [targetCustomDate, setTargetCustomDate] = useState("12-12-2025");
  const [usersByTeam, setUsersByTeam] = useState<Record<string, UserRow[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [perPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [actionError, setActionError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const actionMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const close = (event: MouseEvent) => {
      if (!actionMenuRef.current) return;
      if (!actionMenuRef.current.contains(event.target as Node)) setActionRowIndex(null);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(searchText.trim());
      setPage(1);
    }, 400);
    return () => window.clearTimeout(timer);
  }, [searchText]);

  useEffect(() => {
    const teamTypeMap: Partial<Record<TeamTab, number>> = {
      "Sales Team": 4,
      "Loan Team": 5,
      Finance: 6,
      Design: 7,
      "Operation Team": 8,
      "Supply Chain Team": 9,
      "Net Metering Team": 10,
      "AMC Team": 11,
    };

    const type = teamTypeMap[activeTeamTab];
    if (!type) return;

    let isMounted = true;

    setIsLoading(true);
    getTeamUsers({ type, search: debouncedSearch, page, perPage })
      .then((result) => {
        if (!isMounted) return;
        setUsersByTeam((prev) => ({
          ...prev,
          [activeTeamTab]: result.users.map((row) => ({
            ...row,
            team: activeTeamTab,
          })),
        }));
        setTotalPages(result.pagination.totalPages);
      })
      .catch((error) => {
        console.error("Team users API failed. Using fallback data.", error);
      })
      .finally(() => {
        if (!isMounted) return;
        setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [activeTeamTab, debouncedSearch, page, perPage]);

  const rows = useMemo(() => {
    const apiRows = usersByTeam[activeTeamTab];
    if (apiRows && apiRows.length > 0) return apiRows;
    if (isLoading) return [];
    return [];
  }, [activeTeamTab, usersByTeam, isLoading]);

  const openView = (row: UserRow) => {
    setSelectedUser(row);
    setDrawerMode("view");
  };

  const openEdit = (row: UserRow) => {
    setSelectedUser(row);
    setForm(filledFormFromUser(row));
    setDrawerMode("edit");
    setActionRowIndex(null);
  };

  const openAdd = () => {
    setSelectedUser(null);
    setForm(emptyForm());
    setDrawerMode("add");
  };

  const handleSaveUser = async () => {
    if (!form.name || !form.email || !form.phone) return;
    setIsSaving(true);
    setActionError(null);
    const teamTypeMap: Partial<Record<TeamTab, number>> = {
      "Sales Team": 4,
      "Loan Team": 5,
      Finance: 6,
      Design: 7,
      "Operation Team": 8,
      "Supply Chain Team": 9,
      "Net Metering Team": 10,
      "AMC Team": 11,
    };
    const userType = teamTypeMap[form.team as TeamTab] ?? 4;

    try {
      if (drawerMode === "add") {
        await createTeamUser({
          name: form.name,
          email: form.email,
          mobileNumber: form.phone,
          userType,
          joiningDate: form.joiningDate || undefined,
        });
      }
      if (drawerMode === "edit" && selectedUser) {
        await updateTeamUser(selectedUser.employeeId, {
          name: form.name,
          email: form.email,
          mobileNumber: form.phone,
          userType,
          joiningDate: form.joiningDate || undefined,
        });
      }
      setDrawerMode(null);
      setPage(1);
    } catch (error) {
      setActionError("Failed to save user. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!window.confirm("Delete this user?")) return;
    try {
      await deleteTeamUser(id);
      setUsersByTeam((prev) => ({
        ...prev,
        [activeTeamTab]: (prev[activeTeamTab] ?? []).filter((row) => row.employeeId !== id),
      }));
    } catch (error) {
      setActionError("Failed to delete user.");
    }
  };

  const showOverlay = drawerMode === "edit" || drawerMode === "add" || drawerMode === "target";

  return (
    <div className="min-h-screen bg-[#eceef2] text-[#171b24]">
      <div className="flex">
        <RootSidebar activeLabel="Team Management" />

        <main className="min-w-0 flex-1">
          <header className="flex h-[54px] items-center justify-between border-b border-[#d5d9e2] bg-[#f8f9fb] px-5">
            <div className="text-[21px] font-semibold text-[#1f2937]">Admin</div>
            <div className="flex items-center gap-2">
              <div className="hidden h-9 w-[210px] items-center gap-2 rounded border border-[#d8dee8] bg-white px-2.5 text-[12px] text-[#8f97a6] md:flex"><Search className="h-4 w-4" />Search</div>
              <Bell className="h-4 w-4 text-[#4a5160]" />
              <div className="flex items-center gap-1"><div className="h-6 w-6 rounded-full bg-[#d89d77]" /><span className="text-[13px] text-[#4c5564]">Rajesh B</span><ChevronDown className="h-3.5 w-3.5 text-[#7f8898]" /></div>
            </div>
          </header>

          <div className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-[32px] font-semibold leading-[1] tracking-[-0.02em] text-[#111827]">Users List</h1>
                <p className="mt-1 text-[13px] text-[#7a8494]">Manage Users</p>
              </div>
              <button type="button" onClick={openAdd} className="h-10 rounded bg-[#131740] px-4 text-[13px] font-semibold text-white">Add New User +</button>
            </div>

            <section className="mt-4 rounded-md border border-[#d8dde5] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.05)]">
              <div className="flex items-center justify-between gap-2 border-b border-[#e4e7ec] p-3">
                <div className="flex h-9 w-[220px] items-center gap-2 rounded border border-[#d8dde5] px-3 text-[12px] text-[#9aa2b1]">
                  <Search className="h-4 w-4" />
                  <input
                    value={searchText}
                    onChange={(event) => setSearchText(event.target.value)}
                    placeholder="Search"
                    className="w-full bg-transparent text-[12px] text-[#1f2533] outline-none placeholder:text-[#9aa2b1]"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <button className="inline-flex h-9 w-9 items-center justify-center rounded border border-[#d8dde5] text-[#98a2b3]"><CalendarDays className="h-4 w-4" /></button>
                  <button className="inline-flex h-9 items-center gap-1 rounded border border-[#d8dde5] px-3 text-[13px] text-[#7a8494]">Customise<ChevronDown className="h-3.5 w-3.5" /></button>
                  <button className="inline-flex h-9 items-center gap-1 rounded border border-[#d8dde5] px-3 text-[13px] text-[#7a8494]">Team<ChevronDown className="h-3.5 w-3.5" /></button>
                </div>
              </div>

              <div className="flex overflow-x-auto border-b border-[#e4e7ec] px-2 pt-1">
                {teamTabs.map((team) => (
                  <button key={team} type="button" onClick={() => setActiveTeamTab(team)} className={`inline-flex h-9 shrink-0 items-center gap-1.5 border px-3 text-[12px] ${activeTeamTab === team ? "border-[#7cc9c1] bg-[#eef9f7] font-semibold text-[#1f2b46]" : "border-[#dfe5ee] bg-white text-[#6f7786]"}`}>
                    <Users className="h-3.5 w-3.5" />
                    {team}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-3 border-b border-[#e4e7ec] bg-[#fbfcfe] px-3 py-2 text-xs">
                <div className="flex items-center gap-2"><UserRound className="h-4 w-4 text-[#e5a700]" /><div><div className="text-[12px] text-[#7a8494]">Team Count</div><div className="text-[13px] font-semibold">20</div></div></div>
                <div className="flex items-center gap-2"><CalendarDays className="h-4 w-4 text-[#3ca860]" /><div><div className="text-[12px] text-[#7a8494]">Onboarding Date</div><div className="text-[13px] font-semibold">12-10-2025</div></div></div>
                <div className="flex items-center gap-2"><ChevronDown className="h-4 w-4 text-[#64748b]" /><div><div className="text-[12px] text-[#7a8494]">All</div><div className="text-[13px] font-semibold">All</div></div></div>
                <div className="flex items-center gap-2"><Mail className="h-4 w-4 text-[#3297a8]" /><div><div className="text-[12px] text-[#7a8494]">Email</div><div className="text-[13px] font-semibold">manager@gmail.com</div></div></div>
                <div className="flex items-center gap-2"><Phone className="h-4 w-4 text-[#d47a31]" /><div><div className="text-[12px] text-[#7a8494]">Phone</div><div className="text-[13px] font-semibold">+912631723123</div></div></div>
                <div className="flex items-center gap-2"><CalendarDays className="h-4 w-4 text-[#17b9b8]" /><div><div className="text-[12px] text-[#7a8494]">Set Target Revenue</div><div className="inline-flex items-center gap-2 text-[13px] font-semibold">{targetRevenue}<button type="button" onClick={() => setDrawerMode("target")}><Pencil className="h-3.5 w-3.5 text-[#566074]" /></button></div></div></div>
                <div className="flex items-center justify-end gap-2"><button className="h-8 rounded border border-[#d4dae4] px-2.5 text-[12px]">Message</button><button className="inline-flex h-8 w-8 items-center justify-center rounded border border-[#d4dae4]"><Pencil className="h-3 w-3" /></button></div>
              </div>

              <div className="p-3">
                <div className="overflow-x-auto rounded-md border border-[#e4e7ec]">
                  <table className="w-full min-w-[950px] table-fixed border-separate border-spacing-0 text-left">
                    <colgroup><col className="w-[42px]" /><col className="w-[110px]" /><col className="w-[120px]" /><col className="w-[170px]" /><col className="w-[140px]" /><col className="w-[110px]" /><col className="w-[130px]" /><col className="w-[90px]" /></colgroup>
                    <thead>
                      <tr className="sticky top-0 z-10 h-[44px] bg-[#d4dfdd] text-[12px] font-semibold text-[#1f2937]">
                        <th className="rounded-l-md border border-[#e4e7ec] border-r-0 px-2"><input type="checkbox" className="h-4 w-4 rounded border-[#c5ccd8]" /></th>
                        <th className="border border-[#e4e7ec] border-r-0 px-2">Employee ID</th>
                        <th className="border border-[#e4e7ec] border-r-0 px-2"><span className="inline-flex items-center gap-1">Name <ArrowUpDown className="h-3 w-3 text-[#8b96a7]" /></span></th>
                        <th className="border border-[#e4e7ec] border-r-0 px-2">Email</th>
                        <th className="border border-[#e4e7ec] border-r-0 px-2">Phone</th>
                        <th className="border border-[#e4e7ec] border-r-0 px-2">Role</th>
                        <th className="border border-[#e4e7ec] border-r-0 px-2">Date Created</th>
                        <th className="rounded-r-md border border-[#e4e7ec] px-2" />
                      </tr>
                    </thead>
                    <tbody>
                      {isLoading
                        ? Array.from({ length: 6 }).map((_, index) => (
                            <tr key={`skeleton-${index}`} className="h-[52px] text-[12px]">
                              {Array.from({ length: 8 }).map((__, cellIndex) => (
                                <td key={cellIndex} className="border border-t-0 border-[#e4e7ec] px-2">
                                  <SkeletonBlock className="h-4 w-full" />
                                </td>
                              ))}
                            </tr>
                          ))
                        : rows.map((row, index) => (
                            <tr key={`${row.employeeId}-${index}`} onClick={() => openView(row)} className="h-[52px] cursor-pointer text-[12px] text-[#111827] odd:bg-[#f9fbfc] hover:bg-[#f8fbff]">
                              <td className="border border-t-0 border-[#e4e7ec] px-2"><input type="checkbox" onClick={(event) => event.stopPropagation()} className="h-4 w-4 rounded border-[#c5ccd8]" /></td>
                              <td className="border border-t-0 border-[#e4e7ec] px-2">{row.employeeId}</td>
                              <td className="border border-t-0 border-[#e4e7ec] px-2">{row.name}</td>
                              <td className="border border-t-0 border-[#e4e7ec] px-2">{row.email}</td>
                              <td className="border border-t-0 border-[#e4e7ec] px-2">{row.phone}</td>
                              <td className="border border-t-0 border-[#e4e7ec] px-2 font-medium">{ row.role.name}</td>
                              <td className="border border-t-0 border-[#e4e7ec] px-2 font-semibold">{row.dateCreated}</td>
                              <td className="border border-t-0 border-[#e4e7ec] px-2">
                                <div className="relative flex items-center justify-end gap-1.5" ref={actionMenuRef}>
                                  <button type="button" onClick={(event) => event.stopPropagation()} className="inline-flex h-6 w-6 items-center justify-center text-[#9aa2b1]">
                                    <MessageSquare className="h-3.5 w-3.5" />
                                  </button>
                                  <button type="button" onClick={(event) => { event.stopPropagation(); setActionRowIndex((prev) => (prev === index ? null : index)); }} className="inline-flex h-6 w-6 items-center justify-center">
                                    <MoreVertical className="h-4 w-4" />
                                  </button>
                                  {actionRowIndex === index && (
                                    <div className="absolute right-0 top-7 z-30 w-[124px] overflow-hidden rounded-lg border border-[#d9dce3] bg-white shadow-md">
                                      <button type="button" onClick={(event) => { event.stopPropagation(); openEdit(row); }} className="flex h-8 w-full items-center px-3 text-left text-xs text-[#4b5563] hover:bg-[#f8fafc]">Edit</button>
                                      <button type="button" onClick={(event) => { event.stopPropagation(); openView(row); setActionRowIndex(null); }} className="flex h-8 w-full items-center px-3 text-left text-xs text-[#4b5563] hover:bg-[#f8fafc]">View</button>
                                      <button type="button" onClick={(event) => { event.stopPropagation(); handleDeleteUser(row.employeeId); }} className="flex h-8 w-full items-center px-3 text-left text-xs text-[#ef4444] hover:bg-[#fff5f5]">Delete</button>
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
                  <div>Page {page} of {totalPages}</div>
                  <button className="inline-flex h-8 items-center rounded border border-[#d1d5db] px-3 text-[13px] text-[#6b7280]">Show 10 rows<ChevronDown className="ml-2 h-3.5 w-3.5" /></button>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>

      {showOverlay && <div className="fixed inset-0 z-40 bg-black/45" />}

      {drawerMode && (
        <aside className="fixed right-0 top-0 z-50 h-full w-[520px] overflow-y-auto border-l border-[#d9dee7] bg-white p-4">
          <div className="flex items-start justify-between border-b border-[#e6eaf0] pb-3">
            {drawerMode === "target" ? (
              <div>
                <h2 className="text-[24px] font-semibold text-[#111827]">Set Target Revenue</h2>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded bg-[#e6f0ff]" />
                <div>
                  <h2 className="text-[24px] font-semibold leading-none text-[#111827]">{drawerMode === "add" ? "Add User" : selectedUser?.name ?? "Murugan"}</h2>
                  <p className="mt-1 text-[11px] text-[#4b5563]">#121212</p>
                </div>
              </div>
            )}
            <button type="button" onClick={() => setDrawerMode(null)} className="rounded border border-[#d1d5db] p-1 text-[#6b7280]"><X className="h-4 w-4" /></button>
          </div>

          {drawerMode === "view" && selectedUser && (
            <>
              <div className="mt-4 grid grid-cols-2 gap-5 text-sm">
                <div><div className="inline-flex items-center gap-1 text-[#64748b]"><Phone className="h-4 w-4" />Phone</div><div className="mt-1 font-medium">{selectedUser.phone}</div></div>
                <div><div className="inline-flex items-center gap-1 text-[#64748b]"><Mail className="h-4 w-4" />Email</div><div className="mt-1 font-medium">{selectedUser.email}</div></div>
                <div><div className="inline-flex items-center gap-1 text-[#64748b]"><Users className="h-4 w-4" />Role</div><div className="mt-1 font-medium">Sales Manager</div></div>
                <div><div className="inline-flex items-center gap-1 text-[#64748b]"><CalendarDays className="h-4 w-4" />Date Joined</div><div className="mt-1 font-medium">12-03-2025</div></div>
              </div>
              <div className="mt-8 grid grid-cols-2 gap-3">
                <button type="button" className="h-10 rounded border border-[#f2a8a8] text-sm font-semibold text-[#ef4444]">Delete User</button>
                <button type="button" onClick={() => openEdit(selectedUser)} className="h-10 rounded bg-[#131740] text-sm font-semibold text-white">Edit</button>
              </div>
            </>
          )}

          {(drawerMode === "edit" || drawerMode === "add") && (
            <>
              <div className="mt-4">
                <h3 className="text-[20px] font-semibold text-[#111827]">Basic Details</h3>
                {actionError ? <div className="mt-2 text-xs text-[#b91c1c]">{actionError}</div> : null}
                <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                  {[
                    { key: "email", label: "Email*" },
                    { key: "phone", label: "Phone*" },
                    { key: "team", label: "Team *" },
                    { key: "role", label: "Role *" },
                    { key: "joiningDate", label: "Joining Date" },
                    { key: "name", label: "Name*" },
                  ].map((field) => (
                    <div key={field.key}>
                      <div className="text-xs font-semibold text-[#374151]">{field.label}</div>
                      <input value={(form as Record<string, string>)[field.key]} onChange={(e) => setForm((prev) => ({ ...prev, [field.key]: e.target.value }))} className="mt-1 h-9 w-full rounded border border-[#d4dae4] bg-[#f7f8fa] px-2 text-sm" />
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-8 grid grid-cols-3 gap-2">
                <button type="button" className="h-10 rounded border border-[#f2a8a8] text-sm font-semibold text-[#ef4444]">Deactivate User</button>
                <button type="button" onClick={() => selectedUser && handleDeleteUser(selectedUser.employeeId)} className="h-10 rounded border border-[#f2a8a8] text-sm font-semibold text-[#ef4444]">Delete User</button>
                <button type="button" onClick={handleSaveUser} className="h-10 rounded bg-[#131740] text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-[#9ca3b1]">{isSaving ? "Saving..." : "Save"}</button>
              </div>
            </>
          )}

          {drawerMode === "target" && (
            <>
              <div className="mt-4">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <div className="text-xs font-semibold text-[#374151]">Target Revenue*</div>
                    <input value={targetRevenue} onChange={(e) => setTargetRevenue(e.target.value)} className="mt-1 h-9 w-full rounded border border-[#d4dae4] bg-[#f7f8fa] px-2 text-sm" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-[#374151]">Select Duration*</div>
                    <div className="mt-1 relative">
                      <select
                        value={targetDuration}
                        onChange={(e) => setTargetDuration(e.target.value)}
                        className="h-9 w-full appearance-none rounded border border-[#d4dae4] bg-[#f7f8fa] px-2 pr-8 text-sm text-[#374151]"
                      >
                        <option>Custom</option>
                        <option>Monthly</option>
                        <option>Quarterly</option>
                        <option>Yearly</option>
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6b7280]" />
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-[#374151]">Custom Date *</div>
                    <input value={targetCustomDate} onChange={(e) => setTargetCustomDate(e.target.value)} className="mt-1 h-9 w-full rounded border border-[#d4dae4] bg-[#f7f8fa] px-2 text-sm" />
                  </div>
                </div>
              </div>
              <div className="mt-8 grid grid-cols-2 gap-2">
                <button type="button" onClick={() => setDrawerMode(null)} className="h-10 rounded border border-[#d1d5db] text-sm font-semibold text-[#4b5563]">Cancel</button>
                <button type="button" onClick={() => setDrawerMode(null)} className="h-10 rounded bg-[#131740] text-sm font-semibold text-white">Save</button>
              </div>
            </>
          )}
        </aside>
      )}
    </div>
  );
}

export default dynamic(() => Promise.resolve(TeamManagementPageComponent), { ssr: false });
