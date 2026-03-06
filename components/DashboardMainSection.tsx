"use client"
import { useState } from "react";
import backgroundBase2 from "./background-base-2.svg";
import backgroundBase3 from "./background-base-3.svg";
import backgroundBase from "./background-base.svg";
import backgroundGradient2 from "./background-gradient-2.svg";
import backgroundGradient3 from "./background-gradient-3.svg";
import backgroundGradient from "./background-gradient.svg";
import ellipse1928 from "./ellipse-1928.svg";
import ellipse1929 from "./ellipse-1929.svg";
import ellipse1930 from "./ellipse-1930.svg";
import ellipse1931 from "./ellipse-1931.svg";
import group13 from "./group-13.png";
import group12448332022 from "./group-1244833202-2.png";
import group12448332023 from "./group-1244833202-3.png";
import group12448332024 from "./group-1244833202-4.png";
import group1244833202 from "./group-1244833202.png";
import image from "./image.png";
import image1 from "./image.svg";
import keyboardArrowDown2 from "./keyboard-arrow-down-2.svg";
import keyboardArrowDown3 from "./keyboard-arrow-down-3.svg";
import keyboardArrowDown4 from "./keyboard-arrow-down-4.svg";
import keyboardArrowDown5 from "./keyboard-arrow-down-5.svg";
import keyboardArrowDown6 from "./keyboard-arrow-down-6.svg";
import keyboardArrowDown7 from "./keyboard-arrow-down-7.svg";
import keyboardArrowDown from "./keyboard-arrow-down.svg";
import line2 from "./line-2.svg";
import line3 from "./line-3.svg";
import line11 from "./line-11.svg";
import line12 from "./line-12.svg";
import line from "./line.svg";
import vector2 from "./vector-2.svg";
import vector3 from "./vector-3.svg";
import vector4 from "./vector-4.svg";
import vector5 from "./vector-5.svg";
import vector6 from "./vector-6.svg";
import vector7 from "./vector-7.svg";
import vector8 from "./vector-8.svg";
import vector9 from "./vector-9.svg";
import vector10 from "./vector-10.svg";
import vector11 from "./vector-11.svg";
import vector12 from "./vector-12.svg";
import vector13 from "./vector-13.svg";
import vector14 from "./vector-14.svg";
import vector15 from "./vector-15.svg";
import vector16 from "./vector-16.svg";
import vector17 from "./vector-17.svg";
import vector18 from "./vector-18.svg";
import vector19 from "./vector-19.svg";
import vector20 from "./vector-20.svg";
import vector21 from "./vector-21.svg";
import vector22 from "./vector-22.svg";
import vector23 from "./vector-23.svg";
import vector24 from "./vector-24.svg";
import vector25 from "./vector-25.svg";
import vector26 from "./vector-26.svg";
import vector27 from "./vector-27.svg";
import vector28 from "./vector-28.svg";
import vector29 from "./vector-29.svg";
import vector30 from "./vector-30.svg";
import vector31 from "./vector-31.svg";
import vector32 from "./vector-32.svg";
import vector33 from "./vector-33.svg";
import vector34 from "./vector-34.svg";
import vector35 from "./vector-35.svg";
import vector36 from "./vector-36.svg";
import vector37 from "./vector-37.svg";
import vector38 from "./vector-38.svg";
import vector39 from "./vector-39.svg";
import vector40 from "./vector-40.svg";
import vector52 from "./vector-52.svg";
import vector53 from "./vector-53.svg";
import vector54 from "./vector-54.svg";
import vector55 from "./vector-55.svg";
import vector56 from "./vector-56.svg";
import vector57 from "./vector-57.svg";
import vector58 from "./vector-58.svg";
import vector59 from "./vector-59.svg";
import vector60 from "./vector-60.svg";
import vector61 from "./vector-61.svg";
import vector62 from "./vector-62.svg";
import vector63 from "./vector-63.svg";
import vector64 from "./vector-64.svg";
import vector65 from "./vector-65.svg";
import vector66 from "./vector-66.svg";
import vector67 from "./vector-67.svg";
import vector68 from "./vector-68.svg";
import vector69 from "./vector-69.svg";
import vector70 from "./vector-70.svg";
import vector71 from "./vector-71.svg";
import vector72 from "./vector-72.svg";
import vector73 from "./vector-73.svg";
import vector74 from "./vector-74.svg";
import vector75 from "./vector-75.svg";
import vector76 from "./vector-76.svg";
import vector from "./vector.svg";

type ImgSource = string | { src: string };

function resolveImgSrc(source: ImgSource): string {
  return typeof source === "string" ? source : source.src;
}

type TeamCard = {
  id: number;
  name: string;
  icon: { type: "gradient"; vectors: string[] } | { type: "image"; src: ImgSource };
  metrics: Array<{ label: string; value: string }>;
  arrowVectors: string[];
};

const metricCards = [
  {
    id: 1,
    value: "₹ 3.8 Cr",
    title: "Total Revenue Impact",
    subtitle: "+14 percent growth vs last Month",
    backgroundBase: backgroundBase,
    backgroundGradient: backgroundGradient,
    line: line,
  },
  {
    id: 2,
    value: "1202",
    title: "Active Projects",
    subtitle: "+10% Higher than Last Month",
    backgroundBase: backgroundBase2,
    backgroundGradient: backgroundGradient2,
    line: line2,
  },
  {
    id: 3,
    value: "40%",
    title: "Overall SLA Compliance",
    subtitle: "+6 percent adherence improvement",
    backgroundBase: backgroundBase3,
    backgroundGradient: backgroundGradient3,
    line: line3,
  },
  {
    id: 4,
    value: "₹ 62 Lakh",
    title: "Pending Collections",
    subtitle: "4 percent reduction in overdue invoices",
    backgroundBase: null,
    backgroundGradient: null,
    line: null,
  },
];

const teamCards: TeamCard[] = [
  {
    id: 1,
    name: "Sales Team",
    icon: {
      type: "gradient",
      vectors: [vector63, vector64],
    },
    metrics: [
      { label: "New Leads", value: "12" },
      { label: "Escalations", value: "12" },
      { label: "Pending Follow Ups", value: "12" },
    ],
    arrowVectors: [vector65, vector66],
  },
  {
    id: 2,
    name: "Design Team",
    icon: {
      type: "image",
      src: group12448332022,
    },
    metrics: [
      { label: "New Site Survey", value: "12" },
      { label: "Pending Approvals", value: "12" },
      { label: "Escalations", value: "12" },
    ],
    arrowVectors: [vector67, vector68],
  },
  {
    id: 3,
    name: "Finance Team",
    icon: {
      type: "gradient",
      vectors: [vector69, vector70],
    },
    metrics: [
      { label: "New Payments", value: "12" },
      { label: "Pending Invoices", value: "12" },
      { label: "Escalations", value: "12" },
    ],
    arrowVectors: [vector71, vector72],
  },
  {
    id: 4,
    name: "Loan Team",
    icon: {
      type: "image",
      src: group12448332023,
    },
    metrics: [
      { label: "New Applications", value: "12" },
      { label: "Bank Rejections", value: "12" },
      { label: "Disbursement pending", value: "12" },
    ],
    arrowVectors: [vector73, vector74],
  },
  {
    id: 5,
    name: "Supply chain Team",
    icon: {
      type: "image",
      src: group12448332024,
    },
    metrics: [
      { label: "New Stock added", value: "12" },
      { label: "Low Stock Alerts:", value: "12" },
      { label: "Escalations", value: "00" },
    ],
    arrowVectors: [vector75, vector76],
  },
  {
    id: 6,
    name: "Operation Team",
    icon: {
      type: "gradient",
      vectors: [vector, image1],
    },
    metrics: [
      { label: "New Tasks Assigned", value: "12" },
      { label: "Pending Tasks", value: "12" },
      { label: "Escalations", value: "12" },
    ],
    arrowVectors: [vector2, vector3],
  },
  {
    id: 7,
    name: "AMC Team",
    icon: {
      type: "image",
      src: group1244833202,
    },
    metrics: [
      { label: "New Requests", value: "12" },
      { label: "Pending AMC Visits", value: "12" },
      { label: "Escalations", value: "12" },
    ],
    arrowVectors: [vector4, vector5],
  },
  {
    id: 8,
    name: "Net Metering Team",
    icon: {
      type: "image",
      src: image,
    },
    metrics: [
      { label: "New Applications", value: "12" },
      { label: "Authority Rejections", value: "12" },
      { label: "Pending Submissions", value: "12" },
    ],
    arrowVectors: [vector6, vector7],
  },
];

const milestoneData = [
  { label: "New Lead", width: "226px", color: "#58d5a61a" },
  { label: "Site Survey done", width: "326px", color: "#58d5a6" },
  { label: "DPR Approval", width: "149px", color: "#58d5a666" },
  { label: "Procurement", width: "210px", color: "#58d5a699" },
  { label: "Installation", width: "260px", color: "#69e8b9" },
  { label: "Net metering", width: "304px", color: "#58d4a6" },
  { label: "Project Handover", width: "199px", color: "#509b7f" },
];

const topPerformers = [
  {
    id: 1,
    name: "Athul",
    compliance: "5%  SLA Compliance",
    rating: "4/5",
    vectors: [vector15, vector16],
    starVector: vector17,
  },
  {
    id: 2,
    name: "Athul",
    compliance: "05% SLA Compliance",
    rating: "4/5",
    vectors: [vector18, vector19],
    starVector: vector20,
  },
  {
    id: 3,
    name: "Athul",
    compliance: "05% SLA Compliance",
    rating: "4/5",
    vectors: [vector21, vector22],
    starVector: vector23,
  },
  {
    id: 4,
    name: "Athul",
    compliance: "05% SLA Compliance",
    rating: "4/5",
    vectors: [vector24, vector25],
    starVector: vector26,
  },
  {
    id: 5,
    name: "Athul",
    compliance: "05% SLA Compliance",
    rating: "4/5",
    vectors: [vector27, vector28],
    starVector: vector29,
  },
];

const installationStatusData = [
  { label: "Inspection and Maintenance", value: "48", color: "#d9fff1" },
  { label: "Performance Monitoring", value: "48", color: "#a3f9d8" },
  { label: "Repair & Replacement", value: "48", color: "#42eeae" },
  { label: "Emergency Support", value: "48", color: "#04985f" },
];

const materialDispatchData = [
  { label: "Modules", value: "48", color: "#d9fff1" },
  { label: "Inverters", value: "48", color: "#a3f9d8" },
  { label: "Structures", value: "48", color: "#42eeae" },
  { label: "Bos", value: "48", color: "#04985f" },
];

export const DashboardMainSection = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("Monthly");
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [selectedTeam, setSelectedTeam] = useState("Sales Team");
  const [selectedPerformerType, setSelectedPerformerType] = useState("Vendors");

  return (
    <main className="flex flex-col w-[1148px] items-start absolute top-[60px] left-60">
      <section className="flex flex-col items-start gap-4 px-0 py-5 relative self-stretch w-full flex-[0_0_auto]">
        <div className="flex flex-col items-end gap-2 relative self-stretch w-full flex-[0_0_auto]">
          <header className="flex flex-wrap items-center justify-between gap-[12px_12px] px-5 py-0 relative self-stretch w-full flex-[0_0_auto]">
            <h1 className="relative w-72 mt-[-1.00px] [font-family:'Inter_Tight-Medium',Helvetica] font-medium text-[#0c141c] text-[34px] tracking-[0] leading-10">
              Hi Akhil
            </h1>

            <div
              className="gap-3 inline-flex items-center relative flex-[0_0_auto]"
              role="toolbar"
              aria-label="Dashboard filters"
            >
              <button
                className="inline-flex items-center gap-2.5 pl-3 pr-2 py-2 relative flex-[0_0_auto] bg-backgroundwhite rounded border border-solid border-[#e2e2e3]"
                aria-label="Select time period"
                aria-haspopup="listbox"
                aria-expanded="false"
              >
                <div className="inline-flex items-center gap-1.5 relative flex-[0_0_auto]">
                  <div
                    className="relative w-[18px] h-[18px] aspect-[1]"
                    aria-hidden="true"
                  >
                    <img
                      className="absolute w-0 h-[16.67%] top-[5.56%] left-[30.56%]"
                      alt=""
                      src={vector52}
                    />
                    <img
                      className="absolute w-0 h-[16.67%] top-[5.56%] left-[63.89%]"
                      alt=""
                      src={vector53}
                    />
                    <img
                      className="absolute w-[75.00%] h-[75.00%] top-[13.89%] left-[9.72%]"
                      alt=""
                      src={vector54}
                    />
                    <img
                      className="absolute w-[75.00%] h-0 top-[38.89%] left-[9.72%] object-cover"
                      alt=""
                      src={vector55}
                    />
                  </div>
                  <span className="relative w-fit mt-[-1.00px] [font-family:'Inter_Tight-Regular',Helvetica] font-normal text-[#13133780] text-sm tracking-[0] leading-5 whitespace-nowrap">
                    {selectedPeriod}
                  </span>
                </div>
                <img
                  className="relative w-[18px] h-[18px]"
                  alt=""
                  src={keyboardArrowDown4}
                  aria-hidden="true"
                />
              </button>

              <button
                className="inline-flex items-center gap-2.5 pl-3 pr-2 py-2 relative flex-[0_0_auto] bg-backgroundwhite rounded border border-solid border-[#e2e2e3]"
                aria-label="Filter by category"
                aria-haspopup="listbox"
                aria-expanded="false"
              >
                <span className="relative w-fit mt-[-1.00px] [font-family:'Inter_Tight-Regular',Helvetica] font-normal text-[#13133780] text-sm tracking-[0] leading-5 whitespace-nowrap">
                  {selectedFilter}
                </span>
                <img
                  className="relative w-[18px] h-[18px]"
                  alt=""
                  src={keyboardArrowDown5}
                  aria-hidden="true"
                />
              </button>

              <button
                className="inline-flex items-center gap-2.5 pl-3 pr-2 py-2 relative flex-[0_0_auto] bg-backgroundwhite rounded border border-solid border-[#e2e2e3]"
                aria-label="Export data"
              >
                <span className="relative w-fit mt-[-1.00px] [font-family:'Inter_Tight-Regular',Helvetica] font-normal text-[#13133780] text-sm tracking-[0] leading-5 whitespace-nowrap">
                  Export
                </span>
                <img
                  className="relative w-[18px] h-[18px]"
                  alt=""
                  src={keyboardArrowDown6}
                  aria-hidden="true"
                />
              </button>
            </div>
          </header>

          <div className="flex flex-col w-[1148px] items-start relative flex-[0_0_auto]">
            <div className="flex flex-wrap items-start gap-[16px_16px] p-4 relative self-stretch w-full flex-[0_0_auto]">
              {metricCards.map((card) => (
                <article
                  key={card.id}
                  className="flex h-[130px] items-center justify-between px-4 py-6 relative flex-1 grow bg-white rounded-lg border border-solid border-[#cedbe8]"
                >
                  <div className="flex flex-col w-[161px] items-start gap-2 relative">
                    <div className="flex flex-col items-start relative self-stretch w-full flex-[0_0_auto]">
                      <div className="relative w-fit mt-[-1.00px] [font-family:'Inter_Tight-Bold',Helvetica] font-bold text-[#0c141c] text-2xl tracking-[0] leading-[30px] whitespace-nowrap">
                        {card.value}
                      </div>
                    </div>
                    <h2 className="relative w-fit [font-family:'Inter_Tight-Medium',Helvetica] font-medium text-[#0c141c] text-base tracking-[0] leading-[19.2px] whitespace-nowrap">
                      {card.title}
                    </h2>
                    <p className="relative w-fit [font-family:'Inter_Tight-Regular',Helvetica] font-normal text-[#5f6370] text-[10px] tracking-[0] leading-[12.0px] whitespace-nowrap">
                      {card.subtitle}
                    </p>
                  </div>
                  {card.backgroundBase && (
                    <div
                      className="relative w-[73px] h-[62px] -ml-px"
                      aria-hidden="true"
                    >
                      <div className="relative h-[62px]">
                        <img
                          className="h-[calc(100%_-_17px)] top-[17px] absolute w-full left-0 object-cover"
                          alt=""
                          src={card.backgroundBase}
                        />
                        <img
                          className="h-[calc(100%_-_18px)] top-[18px] absolute w-full left-0 object-cover"
                          alt=""
                          src={card.backgroundGradient}
                        />
                        <img
                          className="absolute w-full h-[calc(100%_-_18px)] top-[17px] -left-px object-cover"
                          alt=""
                          src={card.line}
                        />
                      </div>
                    </div>
                  )}
                </article>
              ))}
            </div>
          </div>

          <section
            className="flex flex-col w-[1128px] items-start gap-2 p-5 relative flex-[0_0_auto] bg-white rounded-lg"
            aria-labelledby="teams-heading"
          >
            <div className="flex items-start justify-between pt-0 pb-2 px-0 relative self-stretch w-full flex-[0_0_auto] border-b [border-bottom-style:solid] border-variable-collection-stokr">
              <h2
                id="teams-heading"
                className="relative w-fit mt-[-1.00px] [font-family:'Inter_Tight-Medium',Helvetica] font-medium text-[#0c141c] text-[22px] tracking-[0] leading-7 whitespace-nowrap"
              >
                Teams
              </h2>
              <div
                className="inline-flex items-center gap-2 relative flex-[0_0_auto]"
                role="toolbar"
                aria-label="Teams filters"
              >
                <button
                  className="inline-flex h-7 gap-2.5 px-1.5 py-2 flex-[0_0_auto] bg-backgroundwhite border border-solid border-[#e2e2e3] items-center relative rounded"
                  aria-label="Select time range"
                  aria-haspopup="listbox"
                  aria-expanded="false"
                >
                  <div className="inline-flex items-center gap-1.5 relative flex-[0_0_auto] mt-[-4.00px] mb-[-4.00px]">
                    <div
                      className="relative w-[18px] h-[18px] aspect-[1]"
                      aria-hidden="true"
                    >
                      <img
                        className="absolute w-0 h-[16.67%] top-[5.56%] left-[30.56%]"
                        alt=""
                        src={vector56}
                      />
                      <img
                        className="absolute w-0 h-[16.67%] top-[5.56%] left-[63.89%]"
                        alt=""
                        src={vector57}
                      />
                      <img
                        className="absolute w-[75.00%] h-[75.00%] top-[13.89%] left-[9.72%]"
                        alt=""
                        src={vector58}
                      />
                      <img
                        className="absolute w-[75.00%] h-0 top-[38.89%] left-[9.72%] object-cover"
                        alt=""
                        src={vector59}
                      />
                    </div>
                    <span className="w-fit mt-[-1.00px] [font-family:'Inter_Tight-Regular',Helvetica] font-normal text-[#13133780] text-xs tracking-[0] leading-5 relative whitespace-nowrap">
                      Last 7 Days
                    </span>
                  </div>
                  <img
                    className="relative w-[18px] h-[18px] mt-[-3.00px] mb-[-3.00px]"
                    alt=""
                    src={keyboardArrowDown7}
                    aria-hidden="true"
                  />
                </button>
                <button
                  className="inline-flex h-7 gap-2.5 px-1.5 py-2 flex-[0_0_auto] bg-backgroundwhite border border-solid border-[#e2e2e3] items-center relative rounded"
                  aria-label="Download data"
                >
                  <div
                    className="relative w-[18px] h-[18px] mt-[-3.00px] mb-[-3.00px] aspect-[1]"
                    aria-hidden="true"
                  >
                    <img
                      className="absolute w-[83.33%] h-0 top-[18.06%] left-[5.56%] object-cover"
                      alt=""
                      src={vector60}
                    />
                    <img
                      className="absolute w-[50.00%] h-0 top-[47.22%] left-[22.22%] object-cover"
                      alt=""
                      src={vector61}
                    />
                    <img
                      className="absolute w-[25.00%] h-0 top-[76.39%] left-[34.72%] object-cover"
                      alt=""
                      src={vector62}
                    />
                  </div>
                </button>
              </div>
            </div>

            <div className="inline-flex items-center gap-3 relative flex-[0_0_auto] mr-[-1088.00px]">
              {teamCards.map((team) => (
                <article
                  key={team.id}
                  className="inline-flex flex-col items-end gap-2 p-2 relative flex-[0_0_auto] bg-white rounded-lg border border-solid border-variable-collection-stokr"
                >
                  <div className="inline-flex flex-col items-start gap-4 p-2 relative flex-[0_0_auto] rounded-lg bg-[linear-gradient(0deg,rgba(217,225,252,1)_0%,rgba(242,245,255,1)_100%)]">
                    <div className="flex items-center gap-2 pt-0 pb-2 px-0 relative self-stretch w-full flex-[0_0_auto] border-b [border-bottom-style:solid] border-variable-collection-stokr">
                      {team.icon.type === "gradient" ? (
                        <div className="relative w-6 h-6 rounded-[3px] border-[0.75px] border-solid border-variable-collection-stokr aspect-[1] bg-[linear-gradient(123deg,rgba(255,255,255,1)_0%,rgba(60,86,255,1)_100%)]">
                          <div className="relative top-[calc(50.00%_-_9px)] left-[calc(50.00%_-_9px)] w-[18px] h-[18px] aspect-[1]">
                            {(team.icon.vectors ?? []).map((vec, idx) => (
                              <img
                                key={idx}
                                className={
                                  idx === 0
                                    ? "absolute w-[58.33%] h-[25.00%] top-[58.33%] left-[16.67%]"
                                    : idx === 1 && team.id === 1
                                      ? "absolute w-[33.33%] h-[33.33%] top-[8.33%] left-[29.17%]"
                                      : idx === 1 && team.id === 3
                                        ? "absolute w-[75.00%] h-[66.67%] top-[16.67%] left-[8.33%]"
                                        : idx === 0 && team.id === 3
                                          ? "absolute w-[79.17%] h-[54.17%] top-[8.33%] left-[8.33%]"
                                          : idx === 0 && team.id === 6
                                            ? "absolute w-[66.67%] h-[66.67%] top-[20.83%] left-[4.17%]"
                                            : "absolute w-[33.33%] h-[33.33%] top-[4.17%] left-[54.17%]"
                                }
                                alt=""
                                src={vec}
                              />
                            ))}
                          </div>
                        </div>
                      ) : (
                        <img
                          className="w-6 h-6 relative aspect-[1]"
                          alt=""
                          src={resolveImgSrc(team.icon.src)}
                        />
                      )}
                      <h3 className="relative w-fit [font-family:'Inter_Tight-Medium',Helvetica] font-medium text-primory text-base tracking-[0] leading-[22.4px] whitespace-nowrap">
                        {team.name}
                      </h3>
                    </div>
                    <div className="flex items-center gap-[17px] relative self-stretch w-full flex-[0_0_auto]">
                      {team.metrics.map((metric, idx) => (
                        <div
                          key={idx}
                          className="inline-flex flex-col gap-px items-start relative flex-[0_0_auto]"
                        >
                          <div className="relative w-fit mt-[-1.00px] [font-family:'Instrument_Sans-SemiBold',Helvetica] font-semibold text-black text-sm tracking-[0] leading-[16.8px] whitespace-nowrap">
                            {metric.value}
                          </div>
                          <div className="relative [font-family:'General_Sans-Medium',Helvetica] font-medium text-[#131337] text-[10px] tracking-[0.20px] leading-[14.0px]">
                            {metric.label}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-between relative self-stretch w-full flex-[0_0_auto]">
                    <button className="flex items-center justify-center w-[87.5px] h-[15px] [font-family:'Inter_Tight-SemiBold',Helvetica] font-semibold text-[#131337] text-xs text-center tracking-[0] leading-[18px] relative whitespace-nowrap">
                      View Details
                    </button>
                    <div
                      className="relative w-6 h-6 bg-primory rounded-[3px] aspect-[1] border-variable-collection-stokr"
                      aria-hidden="true"
                    >
                      <div className="relative top-[calc(50.00%_-_9px)] left-[calc(50.00%_-_9px)] w-[18px] h-[18px] aspect-[1] border-variable-collection-stokr">
                        <img
                          className="absolute w-[58.33%] h-0 top-[45.83%] left-[16.67%]"
                          alt=""
                          src={team.arrowVectors[0]}
                        />
                        <img
                          className="absolute w-[29.17%] h-[58.33%] top-[16.67%] left-[45.83%]"
                          alt=""
                          src={team.arrowVectors[1]}
                        />
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <div
              className="relative w-[1648px] h-[8.0px] mr-[-560.00px] bg-white rounded-[82px]"
              role="scrollbar"
              aria-orientation="horizontal"
              aria-valuenow={15}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div className="relative w-[5.89%] h-[95.72%] left-[14.79%] bg-[#c6c6c6] rounded-[32px]" />
            </div>
          </section>
        </div>

        <div className="flex h-[405px] items-start gap-4 px-5 py-0 relative self-stretch w-full">
          <section
            className="flex flex-col items-start gap-4 p-4 relative flex-1 grow bg-white rounded-lg overflow-hidden"
            aria-labelledby="milestones-heading"
          >
            <div className="flex items-start justify-between relative self-stretch w-full flex-[0_0_auto]">
              <h2
                id="milestones-heading"
                className="relative w-fit mt-[-1.00px] [font-family:'Inter_Tight-Medium',Helvetica] font-medium text-[#0c141c] text-[22px] tracking-[0] leading-7 whitespace-nowrap"
              >
                Milestones Progress Funnel
              </h2>
              <div
                className="inline-flex items-center gap-2 relative flex-[0_0_auto]"
                role="toolbar"
                aria-label="Milestones filters"
              >
                <button
                  className="inline-flex h-7 gap-2.5 px-1.5 py-2 flex-[0_0_auto] bg-backgroundwhite border border-solid border-[#e2e2e3] items-center relative rounded"
                  aria-label="Select time range"
                  aria-haspopup="listbox"
                  aria-expanded="false"
                >
                  <div className="inline-flex items-center gap-1.5 relative flex-[0_0_auto] mt-[-4.00px] mb-[-4.00px]">
                    <div
                      className="relative w-[18px] h-[18px] aspect-[1]"
                      aria-hidden="true"
                    >
                      <img
                        className="absolute w-0 h-[16.67%] top-[5.56%] left-[30.56%]"
                        alt=""
                        src={vector8}
                      />
                      <img
                        className="absolute w-0 h-[16.67%] top-[5.56%] left-[63.89%]"
                        alt=""
                        src={vector9}
                      />
                      <img
                        className="absolute w-[75.00%] h-[75.00%] top-[13.89%] left-[9.72%]"
                        alt=""
                        src={vector10}
                      />
                      <img
                        className="absolute w-[75.00%] h-0 top-[38.89%] left-[9.72%] object-cover"
                        alt=""
                        src={vector11}
                      />
                    </div>
                    <span className="w-fit mt-[-1.00px] [font-family:'Inter_Tight-Regular',Helvetica] font-normal text-[#13133780] text-xs tracking-[0] leading-5 relative whitespace-nowrap">
                      Last 7 Days
                    </span>
                  </div>
                  <img
                    className="relative w-[18px] h-[18px] mt-[-3.00px] mb-[-3.00px]"
                    alt=""
                    src={keyboardArrowDown}
                    aria-hidden="true"
                  />
                </button>
                <button
                  className="inline-flex h-7 gap-2.5 px-1.5 py-2 flex-[0_0_auto] bg-backgroundwhite border border-solid border-[#e2e2e3] items-center relative rounded"
                  aria-label="Download data"
                >
                  <div
                    className="relative w-[18px] h-[18px] mt-[-3.00px] mb-[-3.00px] aspect-[1]"
                    aria-hidden="true"
                  >
                    <img
                      className="absolute w-[83.33%] h-0 top-[18.06%] left-[5.56%] object-cover"
                      alt=""
                      src={vector12}
                    />
                    <img
                      className="absolute w-[50.00%] h-0 top-[47.22%] left-[22.22%] object-cover"
                      alt=""
                      src={vector13}
                    />
                    <img
                      className="absolute w-[25.00%] h-0 top-[76.39%] left-[34.72%] object-cover"
                      alt=""
                      src={vector14}
                    />
                  </div>
                </button>
              </div>
            </div>

            <div className="relative w-[609px] h-[313px]">
              <div
                className="absolute top-0 left-0 w-[414px] h-[313px]"
                aria-hidden="true"
              >
                <img
                  className="absolute top-px left-[15px] w-px h-[313px]"
                  alt=""
                  src={line11}
                />
                <img
                  className="absolute top-[293px] left-0 w-[414px] h-px"
                  alt=""
                  src={line12}
                />
                <div className="flex w-[371px] items-center justify-between absolute top-[299px] left-[41px]">
                  {["10", "20", "30", "40", "50", "60"].map((num) => (
                    <div
                      key={num}
                      className="relative flex items-center justify-center w-fit mt-[-0.62px] [font-family:'Inter-Regular',Helvetica] font-normal text-[#5f6370] text-[8.7px] tracking-[0.17px] leading-[10.6px] whitespace-nowrap"
                    >
                      {num}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col w-[515px] items-start absolute top-px left-[25px]">
                {milestoneData.map((milestone, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center ${idx === 0 ? "gap-[219px]" : idx === 1 ? "gap-2" : idx === 2 || idx === 3 ? "gap-[11px]" : "gap-3"} relative self-stretch w-full flex-[0_0_auto]`}
                  >
                    <div
                      className={`${idx === 1 ? "flex flex-col w-[341px] items-start relative" : ""}`}
                    >
                      <div
                        className={`relative ${idx === 1 ? "w-[326px]" : ""} h-10`}
                        style={{
                          width: idx !== 1 ? milestone.width : undefined,
                          backgroundColor: milestone.color,
                        }}
                      />
                    </div>
                    <div className="relative [font-family:'Inter_Tight-Medium',Helvetica] font-medium text-[10px] tracking-[0] leading-[12.0px] opacity-60 text-text-primary">
                      {milestone.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <aside
            className="inline-flex flex-col items-end gap-4 p-5 relative self-stretch flex-[0_0_auto] bg-white rounded-lg overflow-hidden"
            aria-labelledby="performers-heading"
          >
            <div className="flex items-center justify-between pt-0 pb-2 px-0 relative self-stretch w-full flex-[0_0_auto] border-b [border-bottom-style:solid] border-variable-collection-stokr">
              <h2
                id="performers-heading"
                className="relative w-fit [font-family:'Inter_Tight-Medium',Helvetica] font-medium text-primory text-base tracking-[0] leading-[22.4px] whitespace-nowrap"
              >
                Top Performers
              </h2>
              <button
                className="inline-flex h-7 gap-2.5 px-1.5 py-2 flex-[0_0_auto] bg-backgroundwhite border border-solid border-[#e2e2e3] items-center relative rounded"
                aria-label="Select performer type"
                aria-haspopup="listbox"
                aria-expanded="false"
              >
                <span className="w-fit mt-[-1.00px] [font-family:'Inter_Tight-Regular',Helvetica] font-normal text-[#13133780] text-xs tracking-[0] leading-5 relative whitespace-nowrap">
                  {selectedPerformerType}
                </span>
                <img
                  className="relative w-[18px] h-[18px] mt-[-3.00px] mb-[-3.00px]"
                  alt=""
                  src={keyboardArrowDown2}
                  aria-hidden="true"
                />
              </button>
            </div>

            <div className="inline-flex flex-col items-start gap-4 relative flex-[0_0_auto]">
              <div className="flex flex-col w-[300px] items-start gap-3 relative flex-[0_0_auto]">
                {topPerformers.map((performer) => (
                  <article
                    key={performer.id}
                    className="flex items-center justify-between p-2 relative self-stretch w-full flex-[0_0_auto] bg-[#fbfbff] rounded border border-solid border-[#d4f7cd]"
                  >
                    <div className="inline-flex items-center gap-2 relative flex-[0_0_auto]">
                      <div className="w-8 h-8 rounded border border-solid border-variable-collection-stokr bg-[linear-gradient(123deg,rgba(255,255,255,1)_0%,rgba(60,86,255,1)_100%)] relative aspect-[1]">
                        <div className="relative top-[calc(50.00%_-_12px)] left-[calc(50.00%_-_12px)] w-6 h-6 bg-[linear-gradient(123deg,rgba(255,255,255,1)_0%,rgba(60,86,255,1)_100%)]">
                          <img
                            className="absolute w-[58.33%] h-[25.00%] top-[58.33%] left-[16.67%]"
                            alt=""
                            src={performer.vectors[0]}
                          />
                          <img
                            className="absolute w-[33.33%] h-[33.33%] top-[8.33%] left-[29.17%]"
                            alt=""
                            src={performer.vectors[1]}
                          />
                        </div>
                      </div>
                      <div className="flex flex-col w-[122px] items-start gap-px relative">
                        <h3 className="relative self-stretch mt-[-1.00px] [font-family:'General_Sans-Semibold',Helvetica] font-normal text-[#171a1c] text-sm tracking-[0.28px] leading-[21px]">
                          {performer.name}
                        </h3>
                        <p className="relative self-stretch [font-family:'Inter_Tight-Medium',Helvetica] font-medium text-[#4ca850] text-xs tracking-[0.24px] leading-3">
                          {performer.compliance}
                        </p>
                      </div>
                    </div>
                    <div className="inline-flex items-center gap-1 px-2 py-0.5 relative flex-[0_0_auto] bg-[#f1f1f1] rounded-xl">
                      <div className="inline-flex items-center gap-0.5 relative flex-[0_0_auto]">
                        <div
                          className="relative w-3 h-3 aspect-[1]"
                          aria-hidden="true"
                        >
                          <img
                            className="absolute w-[83.34%] h-[79.47%] top-[4.17%] left-[4.16%]"
                            alt=""
                            src={performer.starVector}
                          />
                        </div>
                      </div>
                      <div className="flex items-center justify-center w-fit mt-[-1.00px] [font-family:'Inter_Tight-Bold',Helvetica] font-bold text-[#13133799] text-base tracking-[0.32px] leading-5 relative whitespace-nowrap">
                        {performer.rating}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <div
              className="absolute top-[168px] left-[326px] w-1 h-6 bg-[#d9d9d9] rounded-3xl"
              aria-hidden="true"
            />
          </aside>
        </div>
      </section>

      <section className="flex flex-col items-start gap-6 px-6 py-0 relative self-stretch w-full flex-[0_0_auto]">
        <div className="flex gap-6 self-stretch w-full items-start relative flex-[0_0_auto]">
          <article
            className="relative flex-1 grow h-[305px] bg-white rounded-lg"
            aria-labelledby="installation-heading"
          >
            <div className="inline-flex flex-col items-start gap-6 absolute top-4 left-4">
              <div className="flex h-7 items-center justify-around gap-[98px] relative self-stretch w-full">
                <h2
                  id="installation-heading"
                  className="relative flex-1 [font-family:'Inter_Tight-Medium',Helvetica] font-medium text-[#0c141c] text-[22px] tracking-[0] leading-[26.4px]"
                >
                  installation Status Overview
                </h2>
              </div>
              <div className="flex flex-col w-[301px] items-center gap-6 relative flex-[0_0_auto]">
                <div
                  className="relative self-stretch w-full h-[150px] overflow-hidden"
                  aria-hidden="true"
                >
                  <div className="absolute top-0 left-0 w-[301px] h-[301px]">
                    <img
                      className="absolute top-0 left-0 w-[301px] h-[150px]"
                      alt=""
                      src={ellipse1928}
                    />
                    <img
                      className="absolute top-11 left-[212px] w-[89px] h-[106px]"
                      alt=""
                      src={ellipse1929}
                    />
                    <img
                      className="absolute top-0 left-[110px] w-[147px] h-[89px]"
                      alt=""
                      src={ellipse1930}
                    />
                    <img
                      className="absolute top-[5px] left-5 w-[108px] h-[101px]"
                      alt=""
                      src={ellipse1931}
                    />
                  </div>
                  <p className="absolute top-[118px] left-[calc(50.00%_-_42px)] h-[31px] flex items-center justify-center [font-family:'Inter_Tight-Bold',Helvetica] font-normal text-[#0c141c] text-[26px] tracking-[1.50px] leading-[31.2px] whitespace-nowrap">
                    <span className="font-bold tracking-[0.39px]">158</span>
                    <span className="[font-family:'Inter_Tight-Medium',Helvetica] font-medium text-sm tracking-[0.21px] leading-[16.8px]">
                      Total
                    </span>
                  </p>
                </div>
              </div>
            </div>
            <div className="flex flex-col w-[142px] items-start gap-[33px] absolute top-[68px] left-[378px]">
              {installationStatusData.map((item, idx) => (
                <div
                  key={idx}
                  className={`${idx < 2 ? "relative self-stretch w-full h-[13px]" : "flex h-[13px] items-center gap-2 relative self-stretch w-full"}`}
                >
                  <div
                    className={`${idx < 2 ? "absolute top-0 left-0" : "relative"} w-[13px] h-[13px] rounded-[6.5px]`}
                    style={{ backgroundColor: item.color }}
                    aria-hidden="true"
                  />
                  <div
                    className={`${idx < 2 ? "absolute top-0 left-[21px]" : "relative"} ${idx === 2 || idx === 3 ? "w-[87px] mt-[-7.50px] mb-[-5.50px]" : "w-[78px]"} [font-family:'Inter_Tight-Medium',Helvetica] font-medium text-[11px] tracking-[0] leading-[13.2px] opacity-60 text-text-primary`}
                  >
                    {item.label}
                  </div>
                  <div
                    className={`${idx < 2 ? "absolute top-0 left-[115px]" : "relative"} ${idx === 2 || idx === 3 ? "mt-[-1.00px] mr-[-90.00px]" : ""} w-[116px] [font-family:'Inter_Tight-Medium',Helvetica] font-medium text-[11px] tracking-[0] leading-[13.2px] opacity-60 text-text-primary`}
                  >
                    {item.value}
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article
            className="flex flex-col items-start gap-6 p-4 relative flex-1 self-stretch grow bg-white rounded-lg"
            aria-labelledby="material-heading"
          >
            <div className="flex flex-col items-start gap-6 relative flex-1 self-stretch w-full grow">
              <h2
                id="material-heading"
                className="relative flex-1 self-stretch mt-[-1.00px] [font-family:'Inter_Tight-Medium',Helvetica] font-medium text-[#0c141c] text-[22px] tracking-[0] leading-[26.4px]"
              >
                Material Dispatch &amp; Delivery
              </h2>
              <div className="flex items-center gap-[51px] relative self-stretch w-full flex-[0_0_auto]">
                <img
                  className="relative w-[217px] h-[217px]"
                  alt=""
                  src={resolveImgSrc(group13)}
                  aria-hidden="true"
                />
                <div className="flex flex-col w-[142px] items-start gap-[33px] relative">
                  {materialDispatchData.map((item, idx) => (
                    <div
                      key={idx}
                      className={`${idx < 2 ? "relative self-stretch w-full h-[13px]" : "flex h-[13px] items-center gap-2 relative self-stretch w-full"}`}
                    >
                      <div
                        className={`${idx < 2 ? "absolute top-0 left-0" : "relative"} w-[13px] h-[13px] rounded-[6.5px]`}
                        style={{ backgroundColor: item.color }}
                        aria-hidden="true"
                      />
                      <div
                        className={`${idx < 2 ? "absolute top-0 left-[21px]" : "relative"} ${idx >= 2 ? "w-[87px] mt-[-1.00px]" : "w-[66px]"} [font-family:'Inter_Tight-Medium',Helvetica] font-medium text-[11px] tracking-[0] leading-[13.2px] opacity-60 text-text-primary`}
                      >
                        {item.label}
                      </div>
                      <div
                        className={`${idx < 2 ? "absolute top-0 left-[115px]" : "relative"} ${idx >= 2 ? "mt-[-1.00px] mr-[-90.00px]" : ""} w-[116px] [font-family:'Inter_Tight-Medium',Helvetica] font-medium text-[11px] tracking-[0] leading-[13.2px] opacity-60 text-text-primary`}
                      >
                        {item.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </article>
        </div>

        <div className="flex gap-6 self-stretch w-full items-start relative flex-[0_0_auto]">
          <article
            className="flex flex-col items-start gap-4 p-5 relative flex-1 grow bg-white rounded-lg"
            aria-labelledby="sla-trend-heading"
          >
            <div className="flex items-center justify-between pt-0 pb-3 px-0 relative self-stretch w-full flex-[0_0_auto] border-b [border-bottom-style:solid] border-variable-collection-stokr">
              <div className="inline-flex items-end gap-[18px] relative flex-[0_0_auto]">
                <img
                  className="relative w-[46.09px] h-[18.85px] mb-[-1.45px] ml-[-1.45px]"
                  alt=""
                  src={vector30}
                  aria-hidden="true"
                />
                <h2
                  id="sla-trend-heading"
                  className="relative w-fit mt-[-1.00px] [font-family:'Inter_Tight-Medium',Helvetica] font-medium text-primory text-xl tracking-[0] leading-[normal] whitespace-nowrap"
                >
                  SLA Trend by Team
                </h2>
              </div>
              <div className="inline-flex items-center gap-[34px] relative flex-[0_0_auto]">
                <div className="inline-flex items-center gap-[5px] relative flex-[0_0_auto] bg-white">
                  <button
                    className="inline-flex h-7 gap-2.5 px-1.5 py-2 flex-[0_0_auto] bg-primory border border-solid border-[#e2e2e3] items-center relative rounded"
                    aria-label="Select team"
                    aria-haspopup="listbox"
                    aria-expanded="false"
                  >
                    <span className="w-fit mt-[-1.00px] [font-family:'Inter_Tight-Regular',Helvetica] font-normal text-white text-xs tracking-[0] leading-5 relative whitespace-nowrap">
                      {selectedTeam}
                    </span>
                    <img
                      className="relative w-[18px] h-[18px] mt-[-3.00px] mb-[-3.00px]"
                      alt=""
                      src={keyboardArrowDown3}
                      aria-hidden="true"
                    />
                  </button>
                </div>
              </div>
            </div>

            <div className="relative self-stretch w-full h-[321.37px]">
              <div
                className="absolute w-[3.91%] h-[85.94%] top-[5.58%] left-0"
                aria-label="Y-axis labels"
              >
                {["100", "50", "30", "20", "10"].map((num, idx) => (
                  <div
                    key={num}
                    className="absolute [font-family:'Inter-Regular',Helvetica] font-normal text-gray-500 text-[17.4px] text-right tracking-[0] leading-[normal]"
                    style={{
                      width: idx === 0 ? "74.56%" : "54.68%",
                      height: "7.60%",
                      top:
                        idx === 0
                          ? "0"
                          : idx === 1
                            ? "22.89%"
                            : idx === 2
                              ? "46.56%"
                              : idx === 3
                                ? "70.93%"
                                : "92.40%",
                      left:
                        idx === 0
                          ? "0"
                          : idx === 1
                            ? "21.22%"
                            : idx === 2
                              ? "19.92%"
                              : idx === 3
                                ? "18.76%"
                                : "27.42%",
                    }}
                  >
                    {num}
                  </div>
                ))}
              </div>

              <div
                className="absolute w-[97.12%] h-[6.53%] top-[93.47%] left-[4.01%]"
                aria-label="X-axis labels"
              >
                {[
                  { label: "31 Jul", left: "0", width: "7.36%" },
                  { label: "31 Aug", left: "17.75%", width: "8.74%" },
                  { label: "30 Sept", left: "35.20%", width: "9.96%" },
                  { label: "31 Oct", left: "53.70%", width: "8.28%" },
                  { label: "30 Nov", left: "71.30%", width: "9.20%" },
                  { label: "31 Dec", left: "90.10%", width: "8.74%" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="absolute h-full top-0 [font-family:'Inter-Regular',Helvetica] font-normal text-gray-500 text-[17.4px] text-center tracking-[0] leading-[normal]"
                    style={{ width: item.width, left: item.left }}
                  >
                    {item.label}
                  </div>
                ))}
              </div>

              <div
                className="absolute w-[94.75%] h-[90.89%] top-0 left-[4.45%]"
                aria-hidden="true"
              >
                <img
                  className="absolute w-[99.97%] h-0 top-[8.89%] left-0"
                  alt=""
                  src={vector31}
                />
                <img
                  className="absolute w-[99.97%] h-0 top-[31.36%] left-0"
                  alt=""
                  src={vector32}
                />
                <img
                  className="absolute w-[99.97%] h-0 top-[53.82%] left-0"
                  alt=""
                  src={vector33}
                />
                <img
                  className="absolute w-[99.97%] h-0 top-[76.29%] left-0"
                  alt=""
                  src={vector34}
                />
                <img
                  className="absolute w-[99.97%] h-0 top-[99.61%] left-0"
                  alt=""
                  src={vector35}
                />
                <img
                  className="absolute w-[99.99%] h-full top-0 left-0"
                  alt=""
                  src={vector36}
                />
              </div>

              <img
                className="absolute w-[94.73%] h-[79.65%] top-[11.11%] left-[4.47%]"
                alt="SLA trend line"
                src={vector37}
              />
              <img
                className="absolute w-[94.73%] h-[23.83%] top-[10.66%] left-[4.45%]"
                alt="SLA trend area"
                src={vector38}
              />

              <div className="absolute w-[14.34%] h-[77.81%] top-[12.96%] left-[74.64%]">
                <img
                  className="absolute w-0 h-[96.50%] top-[3.50%] left-[38.62%]"
                  alt=""
                  src={vector39}
                  aria-hidden="true"
                />
                <img
                  className="absolute w-[10.85%] top-[calc(50.00%_-_126px)] left-[33.40%] h-[19px]"
                  alt=""
                  src={vector40}
                  aria-hidden="true"
                />
                <div className="absolute top-[26px] left-px w-[152px] h-[66px] flex">
                  <div
                    className="inline-flex w-[152px] h-[66px] ml-0 relative flex-col items-start gap-2.5 p-3 bg-white rounded-lg shadow-[0px_4px_12px_#0000001f]"
                    role="tooltip"
                  >
                    <div className="inline-flex flex-col items-start gap-1 relative flex-[0_0_auto]">
                      <div className="relative w-fit mt-[-1.00px] [font-family:'Inter_Tight-SemiBold',Helvetica] font-semibold text-variable-collection-thr-red text-sm text-center tracking-[0] leading-[normal]">
                        SLA Breach :16
                      </div>
                    </div>
                    <div className="relative w-fit [font-family:'Instrument_Sans-Regular',Helvetica] font-normal text-gray-600 text-xs text-center tracking-[0] leading-[normal]">
                      Breach Rate: 12 percent
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </article>
        </div>
      </section>
    </main>
  );
};

