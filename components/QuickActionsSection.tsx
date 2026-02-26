"use client"
import vector41 from "./vector-41.svg";
import vector42 from "./vector-42.svg";
import vector43 from "./vector-43.svg";
import vector44 from "./vector-44.svg";
import vector45 from "./vector-45.svg";
import vector46 from "./vector-46.svg";

interface AlertCard {
  id: string;
  type: "warning" | "delayed";
  title: string;
  location: string;
  status: string;
  statusColor: string;
  description: string;
  actionLabel: string;
  icons: string[];
}

interface PriorityTask {
  id: string;
  category: string;
  title: string;
  location: string;
  status: string;
  description: string;
  actionLabel: string;
}

export const QuickActionsSection = () => {
  const quickActions = [
    { id: "add-users", label: "Add Users", variant: "primary" as const },
    {
      id: "broadcast",
      label: "Broadcast Message",
      variant: "secondary" as const,
    },
    { id: "tickets", label: "Check Tickets", variant: "secondary" as const },
  ];

  const alerts: AlertCard[] = [
    {
      id: "alert-1",
      type: "warning",
      title: "Lead #1025",
      location: "Bangalore, 3kW Rooftop",
      status: "New Lead",
      statusColor: "#2860ab",
      description: "Vendor not assigned for 36 hrs (SLA = 24 hrs)",
      actionLabel: "Assign Vendor",
      icons: [vector41, vector42, vector43],
    },
    {
      id: "alert-2",
      type: "delayed",
      title: "Lead #1025",
      location: "Bangalore, 3kW Rooftop",
      status: "Site Survey",
      statusColor: "#2860ab",
      description: "Survey delayed by 2 days (SLA = 3 days)",
      actionLabel: "Send Reminder",
      icons: [vector44, vector45, vector46],
    },
  ];

  const priorityTasks: PriorityTask[] = [
    {
      id: "task-1",
      category: "Payment Follow-up",
      title: "Lead #1025",
      location: "Bangalore, 3kW Rooftop",
      status: "Site Survey",
      description:
        "Customer accepted quotation, 60% advance pending for 3 days.",
      actionLabel: "Take Action",
    },
    {
      id: "task-2",
      category: "Team Performance Review",
      title: "",
      location: "",
      status: "",
      description:
        'Sales Rep "Anita" has 15 active leads, conversion 18% (below avg).',
      actionLabel: "Schedule 1:1",
    },
  ];

  const handleQuickAction = (actionId: string) => {
    console.log(`Quick action clicked: ${actionId}`);
  };

  const handleAlertAction = (alertId: string, action: string) => {
    console.log(`Alert action: ${action} for ${alertId}`);
  };

  const handleTaskAction = (taskId: string, action: string) => {
    console.log(`Task action: ${action} for ${taskId}`);
  };

  return (
    <aside
      className="flex flex-col w-[340px] h-[1690px] items-start gap-4 px-5 py-4 absolute top-[60px] right-0 bg-white"
      role="complementary"
      aria-label="Quick Actions and Alerts"
    >
      <section className="flex flex-col items-start gap-4 pt-0 pb-4 px-0 relative self-stretch w-full flex-[0_0_auto] border-b [border-bottom-style:solid] border-[#171a1c33]">
        <h2 className="relative w-fit mt-[-1.00px] [font-family:'Inter_Tight-SemiBold',Helvetica] font-semibold text-[#565671] text-base tracking-[0] leading-[22.4px] whitespace-nowrap">
          Quick Actions
        </h2>

        <div className="flex flex-col gap-4 self-stretch w-full items-start relative flex-[0_0_auto]">
          {quickActions.map((action) => (
            <button
              key={action.id}
              onClick={() => handleQuickAction(action.id)}
              className={`h-10 flex items-center justify-center px-2 py-0 relative self-stretch w-full rounded ${
                action.variant === "primary"
                  ? "bg-[#131337]"
                  : "border border-solid border-[#131337]"
              }`}
              aria-label={action.label}
            >
              <span
                className={`flex items-center justify-center w-fit [font-family:'Inter_Tight-SemiBold',Helvetica] font-semibold text-sm text-center tracking-[0] leading-[21px] relative whitespace-nowrap ${
                  action.variant === "primary" ? "text-white" : "text-[#131337]"
                }`}
              >
                {action.label}
              </span>
            </button>
          ))}
        </div>
      </section>

      <section className="flex flex-col items-start gap-4 pt-0 pb-4 px-0 relative self-stretch w-full flex-[0_0_auto] border-b [border-bottom-style:solid] border-[#171a1c33]">
        <h2 className="relative w-fit mt-[-1.00px] [font-family:'Inter_Tight-SemiBold',Helvetica] font-semibold text-[#565671] text-base tracking-[0] leading-[22.4px] whitespace-nowrap">
          Alerts &amp; Breaches ({alerts.length})
        </h2>

        <div className="flex flex-col gap-4 self-stretch w-full items-start relative flex-[0_0_auto]">
          {alerts.map((alert) => (
            <article
              key={alert.id}
              className="flex flex-col items-start relative self-stretch w-full flex-[0_0_auto] bg-white rounded"
            >
              <div className="flex items-center justify-center gap-2 px-3 py-1.5 relative self-stretch w-full flex-[0_0_auto] bg-[#fff4e9] rounded-[4px_4px_0px_0px]">
                <div className="flex items-center gap-1 relative flex-1 grow">
                  <div
                    className="relative w-3 h-3 aspect-[1]"
                    aria-hidden="true"
                  >
                    <img
                      className="absolute w-[83.33%] h-[83.33%] top-[4.17%] left-[4.17%]"
                      alt=""
                      src={alert.icons[0]}
                    />
                    <img
                      className="absolute w-0 h-[16.67%] top-[29.17%] left-[45.83%]"
                      alt=""
                      src={alert.icons[1]}
                    />
                    <img
                      className="absolute w-0 h-0 top-[62.50%] left-[45.83%] object-cover"
                      alt=""
                      src={alert.icons[2]}
                    />
                  </div>
                  <span className="relative flex-1 mt-[-1.00px] [font-family:'Inter-Medium',Helvetica] font-medium text-[#ad5b03] text-[10px] tracking-[0.20px] leading-[14.0px]">
                    {alert.type === "warning"
                      ? "Vendor not Assigned"
                      : "Delayed"}
                  </span>
                </div>
              </div>

              <div className="flex flex-col items-start gap-3 p-3 relative self-stretch w-full flex-[0_0_auto] rounded-[0px_0px_4px_4px] border-r [border-right-style:solid] border-b [border-bottom-style:solid] border-l [border-left-style:solid] border-[#eeeef3]">
                <div className="items-start gap-[7px] pt-0 pb-3 px-0 self-stretch w-full flex-[0_0_auto] border-b [border-bottom-style:solid] border-[#1313373d] flex relative">
                  <div className="flex flex-col items-start gap-1 relative flex-1 grow">
                    <h3 className="relative self-stretch mt-[-1.00px] [font-family:'Inter_Tight-SemiBold',Helvetica] font-semibold text-[#565671] text-base tracking-[0.32px] leading-[19.2px]">
                      {alert.title}
                    </h3>
                    <p className="relative self-stretch [font-family:'Inter_Tight-Medium',Helvetica] font-medium text-[#00000066] text-xs tracking-[0.24px] leading-[14.4px]">
                      {alert.location}
                    </p>
                  </div>
                  <span className="inline-flex items-center justify-center gap-2 px-2.5 py-1 relative flex-[0_0_auto] bg-[#f4f9ff] rounded-[32px] border border-solid border-[#90b0d0]">
                    <span className="w-fit mt-[-1.00px] [font-family:'Inter_Tight-SemiBold',Helvetica] font-semibold text-[#2860ab] whitespace-nowrap relative text-[10px] tracking-[0.20px] leading-[14.0px]">
                      {alert.status}
                    </span>
                  </span>
                </div>

                <p className="relative self-stretch [font-family:'Inter-Medium',Helvetica] font-medium text-[#00000075] text-xs tracking-[0.24px] leading-[16.8px]">
                  {alert.type === "delayed" && (
                    <span className="text-black tracking-[0.03px]">&nbsp;</span>
                  )}
                  <span
                    className={
                      alert.type === "delayed"
                        ? "text-[#00000075] tracking-[0.03px]"
                        : ""
                    }
                  >
                    {alert.description}
                  </span>
                </p>

                <button
                  onClick={() => handleAlertAction(alert.id, alert.actionLabel)}
                  className="h-8 border border-solid border-[#131337] flex items-center justify-center px-2 py-0 relative self-stretch w-full rounded"
                  aria-label={`${alert.actionLabel} for ${alert.title}`}
                >
                  <span className="flex items-center justify-center w-fit [font-family:'Inter_Tight-SemiBold',Helvetica] font-semibold text-[#131337] text-xs text-center tracking-[0] leading-[18px] relative whitespace-nowrap">
                    {alert.actionLabel}
                  </span>
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-4 self-stretch w-full items-start relative flex-[0_0_auto]">
        <h2 className="relative w-fit mt-[-1.00px] [font-family:'Inter_Tight-SemiBold',Helvetica] font-semibold text-[#565671] text-base tracking-[0] leading-[22.4px] whitespace-nowrap">
          Priority Tasks ({priorityTasks.length})
        </h2>

        <div className="flex flex-col items-start gap-3 relative self-stretch w-full flex-[0_0_auto]">
          {priorityTasks.map((task) => (
            <article
              key={task.id}
              className="flex flex-col items-start relative self-stretch w-full flex-[0_0_auto] bg-[#fbfbff]"
            >
              <div className="flex items-center justify-center gap-2 px-3 py-1.5 relative self-stretch w-full flex-[0_0_auto] bg-[#1313371a] rounded-[4px_4px_0px_0px]">
                <h3 className="relative flex-1 mt-[-1.00px] [font-family:'Inter_Tight-Medium',Helvetica] font-medium text-[#131337] text-[10px] tracking-[0.20px] leading-[14.0px]">
                  {task.category}
                </h3>
              </div>

              <div className="flex flex-col items-start gap-2 p-3 relative self-stretch w-full flex-[0_0_auto] rounded-[0px_0px_4px_4px] border-r [border-right-style:solid] border-b [border-bottom-style:solid] border-l [border-left-style:solid] border-[#efefef]">
                {task.title && (
                  <div className="items-start gap-[7px] pt-0 pb-3 px-0 self-stretch w-full flex-[0_0_auto] border-b [border-bottom-style:solid] border-[#1313373d] flex relative">
                    <div className="flex flex-col items-start gap-1 relative flex-1 grow">
                      <h4 className="relative self-stretch mt-[-1.00px] [font-family:'Inter_Tight-SemiBold',Helvetica] font-semibold text-[#565671] text-base tracking-[0.32px] leading-[19.2px]">
                        {task.title}
                      </h4>
                      <p className="relative self-stretch [font-family:'Inter_Tight-Medium',Helvetica] font-medium text-[#00000066] text-xs tracking-[0.24px] leading-[14.4px]">
                        {task.location}
                      </p>
                    </div>
                    <span className="inline-flex items-center justify-center gap-2 px-2.5 py-1 relative flex-[0_0_auto] bg-[#f4f9ff] rounded-[32px] border border-solid border-[#90b0d0]">
                      <span className="relative w-fit mt-[-1.00px] [font-family:'Inter_Tight-SemiBold',Helvetica] font-semibold text-[#2860ab] text-[10px] tracking-[0.20px] leading-[14.0px] whitespace-nowrap">
                        {task.status}
                      </span>
                    </span>
                  </div>
                )}

                <p
                  className={`relative self-stretch [font-family:'Inter-Medium',Helvetica] font-medium text-[#00000075] text-xs tracking-[0.24px] leading-[16.8px] ${!task.title ? "mt-[-1.00px]" : ""}`}
                >
                  {task.description}
                </p>

                <button
                  onClick={() => handleTaskAction(task.id, task.actionLabel)}
                  className="h-8 border border-solid border-[#131337] flex items-center justify-center px-2 py-0 relative self-stretch w-full rounded"
                  aria-label={`${task.actionLabel} for ${task.category}`}
                >
                  <span className="flex items-center justify-center w-fit [font-family:'Inter_Tight-SemiBold',Helvetica] font-semibold text-[#131337] text-xs text-center tracking-[0] leading-[18px] relative whitespace-nowrap">
                    {task.actionLabel}
                  </span>
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </aside>
  );
};

