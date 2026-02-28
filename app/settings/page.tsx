"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Bell, Building2, ChevronDown, Search, X } from "lucide-react";
import { RootSidebar } from "@/components/RootSidebar";
import { mockData } from "@/lib/mock-data";
import { getAccountSettings, saveAccountSettings } from "@/features/admin/api/account-settings";

type SettingsTab = "dashboard" | "notifications" | "documents" | "dropdown";

const dashboardPrefs = mockData.settings.dashboardPrefs;
const notificationPrefs = mockData.settings.notificationPrefs;
const dropdownCards = mockData.settings.dropdownCards;

function TabButton({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      className={`h-8 min-w-[145px] border-r border-[#d8dde5] px-4 text-[12px] ${
        active ? "bg-[#ddf5ef] font-semibold text-[#1c232f] shadow-[inset_0_-3px_0_#3ad2be]" : "text-[#80889a]"
      }`}
      onClick={onClick}
    >
      {label}
    </button>
  );
}

function DocumentModal({
  title,
  children,
  onClose,
  showUpload = true,
  primaryLabel = "Save",
}: {
  title: string;
  children: ReactNode;
  onClose: () => void;
  showUpload?: boolean;
  primaryLabel?: string;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45">
      <div className="h-[88vh] w-full max-w-[500px] rounded border border-[#2d2d2d] bg-white p-3 shadow-[0_20px_30px_rgba(15,23,42,0.25)]">
        <div className="flex items-center justify-between">
          <h3 className="text-[34px] font-medium leading-none text-[#1d2432]">{title}</h3>
          <button className="rounded border border-[#b8bfcb] p-1 text-[#60687a]" onClick={onClose}>
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="mt-3 border-t border-[#e0e5ee] pt-3">{children}</div>
        <div className="mt-auto pt-4">
          {showUpload ? (
            <button className="h-9 w-full rounded bg-[#11163f] text-[14px] font-semibold text-white">Upload PDF</button>
          ) : null}
          <div className="mt-2 grid grid-cols-2 gap-2">
            <button className="h-9 rounded border border-[#20274a] text-[14px] font-semibold text-[#20274a]" onClick={onClose}>
              Cancel
            </button>
            <button className="h-9 rounded bg-[#11163f] text-[14px] font-semibold text-white">{primaryLabel}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const activeTab: SettingsTab =
    tabParam === "dashboard" || tabParam === "notifications" || tabParam === "documents" || tabParam === "dropdown"
      ? tabParam
      : "notifications";
  const [termsOpen, setTermsOpen] = useState(false);
  const [slaDocOpen, setSlaDocOpen] = useState(false);
  const [slaDaysOpen, setSlaDaysOpen] = useState(false);
  const [settings, setSettings] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const userId = 11;

  const dashboardKeys = useMemo(() => dashboardPrefs.map((label) => `dashboard:${label}`), []);
  const notificationKeys = useMemo(() => notificationPrefs.map((label) => `notification:${label}`), []);

  useEffect(() => {
    let isActive = true;
    setIsLoading(true);
    getAccountSettings(userId)
      .then((result) => {
        if (!isActive) return;
        setSettings(result.settings);
      })
      .catch((error) => {
        console.warn("Failed to load account settings", error);
        if (isActive) setActionError("Unable to load settings.");
      })
      .finally(() => {
        if (isActive) setIsLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, [userId]);

  const toggleSetting = (key: string) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setActionError(null);
    try {
      await saveAccountSettings({ userId, settings });
    } catch (error) {
      console.warn("Failed to save account settings", error);
      setActionError("Unable to save settings right now.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#eceef2] text-[#171b24]">
      <div className="flex">
        <RootSidebar activeLabel="Settings" />

        <main className="min-w-0 flex-1">
          <header className="flex h-[52px] items-center justify-between border-b border-[#d5d9e2] bg-[#f8f9fb] px-5">
            <div className="text-[20px] font-semibold text-[#202736]">Admin</div>
            <div className="flex items-center gap-3">
              <div className="hidden h-9 w-[240px] items-center gap-2 rounded border border-[#d8dee8] bg-white px-2.5 text-[12px] text-[#8f97a6] md:flex">
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

          <section className="p-4">
            <h1 className="text-[32px] font-semibold leading-none text-[#1d2028]">Settings</h1>

            <div className="mt-4 overflow-hidden rounded border border-[#d8dde5] bg-white">
              <div className="flex">
                <TabButton active={activeTab === "dashboard"} label="Dashboard Preference" onClick={() => router.push("/settings?tab=dashboard")} />
                <TabButton active={activeTab === "notifications"} label="Notifications" onClick={() => router.push("/settings?tab=notifications")} />
                <TabButton active={activeTab === "documents"} label="Document Settings" onClick={() => router.push("/settings?tab=documents")} />
                <TabButton active={activeTab === "dropdown"} label="Dropdown Settings" onClick={() => router.push("/settings?tab=dropdown")} />
              </div>
            </div>

            <div className="mt-3 flex h-9 w-[240px] items-center gap-2 rounded border border-[#d8dde5] bg-white px-3 text-[12px] text-[#9aa2b1]">
              <Search className="h-4 w-4" />
              Search
            </div>

            {activeTab === "dashboard" ? (
              <div className="mt-3 overflow-hidden rounded-lg border border-[#dce1e8] bg-white">
                <div className="grid grid-cols-[1fr_120px] bg-[#d4dfdd] px-3 py-3 text-[14px] font-semibold text-[#2f3a53]">
                  <span>Preference</span>
                  <span>View</span>
                </div>
                <div className="space-y-3 px-3 py-4">
                  {isLoading
                    ? Array.from({ length: 4 }).map((_, idx) => (
                        <div key={`dash-skel-${idx}`} className="grid grid-cols-[1fr_120px] items-center">
                          <div className="h-3 w-40 rounded bg-[#e3e7ee]" />
                          <div className="h-5 w-5 rounded bg-[#e3e7ee]" />
                        </div>
                      ))
                    : dashboardPrefs.map((row, idx) => (
                        <div key={row} className="grid grid-cols-[1fr_120px] items-center text-[14px] text-[#25314a]">
                          <span>{row}</span>
                          <input
                            type="checkbox"
                            className="h-5 w-5 rounded border-[#b7c1d2]"
                            checked={settings[dashboardKeys[idx]] ?? false}
                            onChange={() => toggleSetting(dashboardKeys[idx])}
                          />
                        </div>
                      ))}
                </div>
                <div className="border-t border-[#e4e7ee] px-3 py-3">
                  {actionError ? <div className="mb-2 text-[12px] text-[#b91c1c]">{actionError}</div> : null}
                  <button
                    className="h-9 rounded bg-[#11163f] px-4 text-[14px] font-semibold text-white disabled:cursor-not-allowed disabled:bg-[#9ca3b1]"
                    onClick={handleSave}
                    disabled={isSaving}
                  >
                    {isSaving ? "Saving..." : "Save"}
                  </button>
                </div>
              </div>
            ) : null}

            {activeTab === "notifications" ? (
              <div className="mt-3 overflow-hidden rounded-lg border border-[#dce1e8] bg-white">
                <div className="grid grid-cols-[1fr_120px] bg-[#d4dfdd] px-3 py-3 text-[14px] font-semibold text-[#2f3a53]">
                  <span>System Alerts You Want to Receive</span>
                  <span>On</span>
                </div>
                <div className="space-y-3 px-3 py-4">
                  {isLoading
                    ? Array.from({ length: 4 }).map((_, idx) => (
                        <div key={`notif-skel-${idx}`} className="grid grid-cols-[1fr_120px] items-center">
                          <div className="h-3 w-48 rounded bg-[#e3e7ee]" />
                          <div className="h-5 w-5 rounded bg-[#e3e7ee]" />
                        </div>
                      ))
                    : notificationPrefs.map((row, idx) => (
                        <div key={row} className="grid grid-cols-[1fr_120px] items-center text-[14px] text-[#25314a]">
                          <span>{row}</span>
                          <input
                            type="checkbox"
                            className="h-5 w-5 rounded border-[#b7c1d2]"
                            checked={settings[notificationKeys[idx]] ?? false}
                            onChange={() => toggleSetting(notificationKeys[idx])}
                          />
                        </div>
                      ))}
                </div>
                <div className="border-t border-[#e4e7ee] px-3 py-3">
                  {actionError ? <div className="mb-2 text-[12px] text-[#b91c1c]">{actionError}</div> : null}
                  <button
                    className="h-9 rounded bg-[#11163f] px-4 text-[14px] font-semibold text-white disabled:cursor-not-allowed disabled:bg-[#9ca3b1]"
                    onClick={handleSave}
                    disabled={isSaving}
                  >
                    {isSaving ? "Saving..." : "Save"}
                  </button>
                </div>
              </div>
            ) : null}

            {activeTab === "documents" ? (
              <div className="mt-3 rounded-lg border border-[#dce1e8] bg-white p-3">
                <div className="flex flex-col gap-3">
                  <button className="h-10 w-[260px] rounded bg-[#11163f] text-[14px] font-semibold text-white" onClick={() => setTermsOpen(true)}>
                    Edit Terms and Conditions
                  </button>
                  <button className="h-10 w-[260px] rounded bg-[#11163f] text-[14px] font-semibold text-white" onClick={() => setSlaDocOpen(true)}>
                    Edit SLA Documents
                  </button>
                  <button className="h-10 w-[260px] rounded bg-[#11163f] text-[14px] font-semibold text-white" onClick={() => setSlaDaysOpen(true)}>
                    Edit SLA Days
                  </button>
                </div>
              </div>
            ) : null}

            {activeTab === "dropdown" ? (
              <div className="mt-3 grid grid-cols-1 gap-3 lg:grid-cols-2 2xl:grid-cols-3">
                {dropdownCards.map((card) => (
                  <Link
                    key={card.slug}
                    href={`/settings/dropdown/${card.slug}`}
                    className="rounded-xl border border-[#dde3ec] bg-white p-3 shadow-[0_1px_2px_rgba(15,23,42,0.06)]"
                  >
                    <h3 className="text-[16px] font-semibold text-[#1d2433]">{card.title}</h3>
                    <p className="mt-1 text-[13px] text-[#596273]">{card.subtitle}</p>
                    <div className="mt-3 border-t border-[#dce1ea] pt-3">
                      <div className="grid grid-cols-2 text-[13px] text-[#6c7585]">
                        <span className="text-[#1fa35b]">12</span>
                        <span>15</span>
                        <span className="mt-1 font-semibold text-[#18a04e]">Active</span>
                        <span className="mt-1 font-semibold text-[#444d5e]">Total values</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : null}
          </section>
        </main>
      </div>

      {termsOpen ? (
        <DocumentModal title="Edit Terms and Conditions" onClose={() => setTermsOpen(false)}>
          <div className="flex items-center gap-2 text-[14px] text-[#2f3a53]">
            <Building2 className="h-4 w-4 text-[#1f4b84]" />
            Terms and Conditions
          </div>
          <div className="mt-3 rounded border border-[#d1d7e1] bg-[#f8f9fb] p-2 text-[13px] leading-6 text-[#333d4f]">
            <p>1. Purpose</p>
            <p className="mt-1">These Terms &amp; Conditions govern the use of the RENGY platform by internal teams, partners, vendors, and authorized users.</p>
            <p className="mt-2">2. User Roles &amp; Access</p>
            <p className="mt-1">Access to the platform is strictly role-based.</p>
            <ul className="list-disc pl-5">
              <li>Super Admin: Full access to system configuration, approvals, SLA settings, and documents.</li>
              <li>Admin: Access to operational approvals and reports as assigned.</li>
              <li>Operations &amp; Installation Teams: Can raise installation-related requests and track their status.</li>
            </ul>
            <p className="mt-2">3. Approval Workflow</p>
            <p>All requests raised on the platform are subject to defined approval workflows.</p>
          </div>
        </DocumentModal>
      ) : null}

      {slaDocOpen ? (
        <DocumentModal title="Edit SLA Document" onClose={() => setSlaDocOpen(false)}>
          <div className="flex items-center gap-2 text-[14px] text-[#2f3a53]">
            <Building2 className="h-4 w-4 text-[#1f4b84]" />
            SLA Document
          </div>
          <div className="mt-3 rounded border border-[#d1d7e1] bg-[#f8f9fb] p-2 text-[13px] leading-6 text-[#333d4f]">
            <p>1. Purpose</p>
            <p className="mt-1">These Terms &amp; Conditions govern the use of the RENGY platform by internal teams, partners, vendors, and authorized users.</p>
            <p className="mt-2">2. User Roles &amp; Access</p>
            <p className="mt-1">Access to the platform is strictly role-based.</p>
            <ul className="list-disc pl-5">
              <li>Super Admin: Full access to system configuration, approvals, SLA settings, and documents.</li>
              <li>Admin: Access to operational approvals and reports as assigned.</li>
              <li>Operations &amp; Installation Teams: Can raise installation-related requests and track their status.</li>
            </ul>
            <p className="mt-2">3. Approval Workflow</p>
            <p>All requests raised on the platform are subject to defined approval workflows.</p>
          </div>
        </DocumentModal>
      ) : null}

      {slaDaysOpen ? (
        <DocumentModal title="Edit SLA Days" onClose={() => setSlaDaysOpen(false)} showUpload={false}>
          <div className="text-[14px] font-semibold text-[#1f2532]">Select Milestone</div>
          <button className="mt-2 flex h-10 w-full items-center justify-between rounded border border-[#d6dbe6] bg-[#f6f7fa] px-3 text-[14px] text-[#2b3344]">
            DPR Approval
            <ChevronDown className="h-4 w-4" />
          </button>
        </DocumentModal>
      ) : null}
    </div>
  );
}

