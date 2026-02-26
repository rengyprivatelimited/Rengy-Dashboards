"use client"
import { useState } from "react";
import frame1984082870 from "./frame-1984082870.svg";
import frame1984082877 from "./frame-1984082877.svg";
import frame19840828782 from "./frame-1984082878-2.svg";
import frame1984082878 from "./frame-1984082878.svg";
import frame1984082879 from "./frame-1984082879.svg";
import frame1984082880 from "./frame-1984082880.svg";
import group237 from "./group-237.svg";
import vector47 from "./vector-47.svg";
import vector48 from "./vector-48.svg";
import vector49 from "./vector-49.svg";
import vector50 from "./vector-50.svg";
import vector51 from "./vector-51.svg";
import vector83 from "./vector-83.svg";
import vector84 from "./vector-84.svg";
import vector85 from "./vector-85.svg";
import vector86 from "./vector-86.svg";
import vector87 from "./vector-87.svg";
import vector88 from "./vector-88.svg";
import vector89 from "./vector-89.svg";
import vector90 from "./vector-90.svg";
import vector91 from "./vector-91.svg";
import vector92 from "./vector-92.svg";
import vector93 from "./vector-93.svg";
import vector94 from "./vector-94.svg";
import vector95 from "./vector-95.svg";
import vector96 from "./vector-96.svg";
import vector97 from "./vector-97.svg";

interface NavigationItem {
  id: string;
  label: string;
  icon: string | { type: "custom"; vectors: string[] };
  isActive?: boolean;
  hasSubmenu?: boolean;
  isExpanded?: boolean;
}

export const SidebarNavigationSection = () => {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const navigationItems: NavigationItem[] = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: frame1984082870,
      isActive: true,
    },
    {
      id: "approval",
      label: "Approval Management",
      icon: frame1984082880,
    },
    {
      id: "leads",
      label: "Leads & Projects",
      icon: { type: "custom", vectors: [vector83, vector84] },
    },
    {
      id: "vendor",
      label: "Vendor Management",
      icon: frame1984082879,
    },
    {
      id: "team",
      label: "Team Management",
      icon: frame1984082878,
      hasSubmenu: true,
    },
    {
      id: "loan",
      label: "Loan Management",
      icon: { type: "custom", vectors: [vector86, vector87, vector88] },
    },
    {
      id: "partners",
      label: "Partners",
      icon: frame19840828782,
      hasSubmenu: true,
    },
    {
      id: "inventory",
      label: "Inventory Management",
      icon: { type: "custom", vectors: [vector90, vector91, vector92] },
    },
    {
      id: "reports",
      label: "Reports",
      icon: frame1984082877,
    },
    {
      id: "tickets",
      label: "Ticket & Alerts",
      icon: { type: "custom", vectors: [vector93, vector94, vector95] },
    },
    {
      id: "support",
      label: "Support",
      icon: { type: "custom", vectors: [vector96, vector97] },
    },
    {
      id: "settings",
      label: "Settings",
      icon: { type: "custom", vectors: [vector50, vector51] },
    },
  ];

  const toggleSubmenu = (itemId: string) => {
    setExpandedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const renderIcon = (icon: string | { type: "custom"; vectors: string[] }) => {
    if (typeof icon === "string") {
      return (
        <img
          className="relative w-6 h-6 mt-[-4.00px] mb-[-4.00px] aspect-[1]"
          alt="Icon"
          src={icon}
        />
      );
    }

    if (icon.id === "leads") {
      return (
        <div className="w-6 h-6 items-center justify-center gap-2 mt-[-4.00px] mb-[-4.00px] rounded aspect-[1] flex relative">
          <div className="relative w-4 h-4 aspect-[1]">
            <img
              className="absolute w-[58.33%] h-[25.00%] top-[59.38%] left-[17.71%]"
              alt="Vector"
              src={vector83}
            />
            <img
              className="absolute w-[33.33%] h-[33.33%] top-[9.38%] left-[30.21%]"
              alt="Vector"
              src={vector84}
            />
          </div>
        </div>
      );
    }

    if (icon.id === "loan") {
      return (
        <div className="w-6 h-6 items-center justify-center gap-2 mt-[-4.00px] mb-[-4.00px] rounded aspect-[1] flex relative">
          <div className="relative w-4 h-4 aspect-[1]">
            <img
              className="absolute w-[70.83%] h-[70.83%] top-[9.38%] left-[17.71%]"
              alt="Vector"
              src={vector86}
            />
            <img
              className="absolute w-0 h-0 top-[38.54%] left-[63.54%] object-cover"
              alt="Vector"
              src={vector87}
            />
            <img
              className="absolute w-[12.50%] h-[12.50%] top-[30.21%] left-[5.21%]"
              alt="Vector"
              src={vector88}
            />
          </div>
        </div>
      );
    }

    if (icon.id === "inventory") {
      return (
        <div className="w-6 h-6 items-center justify-center gap-2 mt-[-4.00px] mb-[-4.00px] rounded aspect-[1] flex relative">
          <div className="relative w-4 h-4">
            <img
              className="absolute w-[75.00%] h-[83.32%] top-[5.22%] left-[9.38%]"
              alt="Vector"
              src={vector90}
            />
            <img
              className="absolute w-[72.50%] h-[20.83%] top-[26.04%] left-[10.63%]"
              alt="Vector"
              src={vector91}
            />
            <img
              className="absolute w-0 h-[41.67%] top-[46.88%] left-[46.88%]"
              alt="Vector"
              src={vector92}
            />
          </div>
        </div>
      );
    }

    if (icon.id === "tickets") {
      return (
        <div className="w-6 h-6 items-center justify-center gap-2 mt-[-4.00px] mb-[-4.00px] rounded aspect-[1] flex relative">
          <div className="relative w-4 h-4 aspect-[1]">
            <img
              className="absolute w-[83.33%] h-[83.33%] top-[5.21%] left-[5.21%]"
              alt="Vector"
              src={vector93}
            />
            <img
              className="absolute w-0 h-[16.67%] top-[30.21%] left-[46.88%]"
              alt="Vector"
              src={vector94}
            />
            <img
              className="absolute w-0 h-0 top-[63.54%] left-[46.88%] object-cover"
              alt="Vector"
              src={vector95}
            />
          </div>
        </div>
      );
    }

    if (icon.id === "support") {
      return (
        <div className="w-6 h-6 items-center justify-center gap-2 mt-[-4.00px] mb-[-4.00px] rounded aspect-[1] flex relative">
          <div className="relative w-4 h-4 aspect-[1]">
            <img
              className="absolute w-[75.00%] h-[66.67%] top-[5.21%] left-[9.38%]"
              alt="Vector"
              src={vector96}
            />
            <img
              className="absolute w-[37.50%] h-[25.00%] top-[63.54%] left-[46.88%]"
              alt="Vector"
              src={vector97}
            />
          </div>
        </div>
      );
    }

    if (icon.id === "settings") {
      return (
        <div className="w-6 h-6 items-center justify-center gap-2 mt-[-4.00px] mb-[-4.00px] rounded aspect-[1] flex relative">
          <div className="relative w-4 h-4 aspect-[1]">
            <img
              className="absolute w-[74.64%] h-[83.18%] top-[5.28%] left-[9.56%]"
              alt="Vector"
              src={vector50}
            />
            <img
              className="absolute w-[25.00%] h-[25.00%] top-[34.38%] left-[34.38%]"
              alt="Vector"
              src={vector51}
            />
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <nav
      className="flex flex-col w-60 h-[1117px] items-center absolute top-0 left-0 bg-white"
      role="navigation"
      aria-label="Main navigation"
    >
      <header className="flex h-[60px] items-center justify-between px-5 py-3 relative self-stretch w-full z-[1] bg-white border-r [border-right-style:solid] border-[#ececec99] shadow-[0px_4px_6px_#636b740a]">
        <img
          className="relative w-[89.12px] h-[21.02px]"
          alt="Company Logo"
          src={group237}
        />

        <button
          className="relative w-5 h-5 aspect-[1]"
          aria-label="Menu toggle"
          type="button"
        >
          <img
            className="absolute w-[75.00%] h-[75.00%] top-[10.00%] left-[10.00%]"
            alt=""
            src={vector47}
          />
          <img
            className="absolute w-0 h-[75.00%] top-[10.00%] left-[35.00%]"
            alt=""
            src={vector48}
          />
          <img
            className="absolute w-[12.50%] h-[25.00%] top-[35.00%] left-[51.67%]"
            alt=""
            src={vector49}
          />
        </button>
      </header>

      <div className="flex flex-col w-60 items-start gap-3 p-5 relative flex-1 grow z-0">
        {navigationItems.map((item) => {
          const isExpanded = expandedItems.has(item.id);
          const itemClasses = item.isActive
            ? "w-[200px] h-10 items-center gap-2.5 px-2 py-3 bg-white rounded flex relative"
            : item.hasSubmenu
              ? "h-10 items-center justify-between px-2 py-3 self-stretch w-full rounded flex relative"
              : "flex w-[200px] h-10 items-center gap-2.5 px-2 py-3 relative rounded";

          const textClasses = item.isActive
            ? "relative flex items-center justify-center w-[63px] h-[18px] mt-[-2.00px] [font-family:'Inter_Tight-SemiBold',Helvetica] font-semibold text-[#131337] text-xs tracking-[0] leading-[18.0px] whitespace-nowrap"
            : "relative flex items-center justify-center w-[150px] h-[18px] mt-[-2.00px] [font-family:'Inter_Tight-SemiBold',Helvetica] font-semibold text-[#13133799] text-xs tracking-[0] leading-[18.0px] whitespace-nowrap";

          if (item.hasSubmenu) {
            return (
              <div
                key={item.id}
                className="flex-col items-end gap-3 self-stretch w-full flex-[0_0_auto] flex relative"
              >
                <button
                  className={itemClasses}
                  onClick={() => toggleSubmenu(item.id)}
                  aria-expanded={isExpanded}
                  aria-label={`${item.label} menu`}
                  type="button"
                >
                  <div className="inline-flex items-center gap-2.5 relative flex-[0_0_auto] mt-[-4.00px] mb-[-4.00px]">
                    {typeof item.icon === "string" ? (
                      <img
                        className="relative w-6 h-6 aspect-[1]"
                        alt=""
                        src={item.icon}
                      />
                    ) : (
                      renderIcon({ ...item.icon, id: item.id })
                    )}
                    <span className="relative flex items-center justify-center w-fit [font-family:'Inter_Tight-SemiBold',Helvetica] font-semibold text-[#13133799] text-xs tracking-[0] leading-[18.0px] whitespace-nowrap">
                      {item.label}
                    </span>
                  </div>
                  <div
                    className="relative w-6 h-6 mt-[-4.00px] mb-[-4.00px] rotate-90"
                    aria-hidden="true"
                  >
                    <img
                      className="absolute w-[30.83%] h-[50.00%] top-[33.87%] left-[23.75%] -rotate-90"
                      alt=""
                      src={item.id === "team" ? vector85 : vector89}
                    />
                  </div>
                </button>
              </div>
            );
          }

          if (
            item.id === "loan" ||
            item.id === "inventory" ||
            item.id === "support"
          ) {
            return (
              <button
                key={item.id}
                className="h-10 items-center gap-2.5 px-2 py-3 self-stretch w-full rounded flex relative"
                aria-current={item.isActive ? "page" : undefined}
                type="button"
              >
                {renderIcon({ type: "custom", vectors: [], id: item.id })}
                <span className={textClasses}>{item.label}</span>
              </button>
            );
          }

          return (
            <button
              key={item.id}
              className={itemClasses}
              aria-current={item.isActive ? "page" : undefined}
              type="button"
            >
              {typeof item.icon === "string" ? (
                <img
                  className="relative w-6 h-6 mt-[-4.00px] mb-[-4.00px] aspect-[1]"
                  alt=""
                  src={item.icon}
                />
              ) : (
                renderIcon({ ...item.icon, id: item.id })
              )}
              <span className={textClasses}>{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

