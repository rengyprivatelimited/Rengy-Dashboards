import { CalendarDays, ChevronDown, Filter, Search, TrendingUp } from "lucide-react";

type OverviewCard = {
  value: string;
  title: string;
  note: string;
  change: string;
  negative?: boolean;
};

const topOverviewCards: OverviewCard[] = [
  { value: "234", title: "Active Projects", note: ">= 60% paid", change: "+8.3%" },
  { value: "32.5%", title: "Lead to Sales Conversion Rate", note: "15 Days", change: "+3.7%" },
  { value: "32.5%", title: "Lead to project conversion rate", note: "Lead -> Project", change: "+3.7%" },
];

const secondaryOverviewCards: OverviewCard[] = [
  { value: "847", title: "Total Leads in the pipeline", note: "+124 new this week", change: "+12.5%" },
  { value: "₹1.2 Cr", title: "Pending Payment", note: "₹32L Overdue", change: "-5.2%", negative: true },
  { value: "42", title: "Avg Sales Cycles", note: "15 Days", change: "" },
  { value: "42", title: "Vendors Engaged", note: "+89% SLA Compliant", change: "-0%" },
];

const funnelRows = [
  { value: "847", label: "New Leads(100%Conversion)", width: 100, shade: "#cbe6de" },
  { value: "642", label: "Site Survey(78%Conversion)", width: 78, shade: "#b9e1d3" },
  { value: "489", label: "Deal Won", width: 58, shade: "#94ddc2" },
  { value: "234", label: "60% Paid(47.9% Conversion)", width: 46, shade: "#6fd4ad" },
  { value: "156", label: "Installed(66.7% Conversion)", width: 34, shade: "#69d8b2" },
];

const delayedPayments = [
  { amount: "₹2.5 Lakhs", customer: "Sharma Industries", project: "RNG-2024-198", overdue: "7 days Overdue" },
  { amount: "₹2.5 Lakhs", customer: "Green Valley Farms", project: "RNG-2024-198", overdue: "7 days Overdue" },
  { amount: "₹2.5 Lakhs", customer: "Green Valley", project: "RNG-2024-198", overdue: "7 days Overdue" },
  { amount: "₹1.2 Lakhs", customer: "Nimbus Solar", project: "RNG-2024-201", overdue: "4 days Overdue" },
];

const delayedDealsRows = [
  { rank: 1, rep: "Micheal Chen", deals: 12, avg: "8.5d", risk: "₹45,200" },
  { rank: 2, rep: "Sarah Martinez", deals: 9, avg: "6.2d", risk: "₹35,200" },
  { rank: 3, rep: "James Wilson", deals: 8, avg: "7.8d", risk: "₹15,200" },
  { rank: 4, rep: "Emily Thompson", deals: 7, avg: "5.1d", risk: "₹45,200" },
  { rank: 5, rep: "James Wilson", deals: 8, avg: "7.8d", risk: "₹65,200" },
  { rank: 6, rep: "Emily Thompson", deals: 7, avg: "5.1d", risk: "₹45,200" },
  { rank: 7, rep: "James Wilson", deals: 8, avg: "7.8d", risk: "₹45,200" },
];

const slaBars = [
  { name: "SolarPro", survey: 96, deals: 90, payment: 86 },
  { name: "GreenTech", survey: 88, deals: 93, payment: 80 },
  { name: "SunPower", survey: 82, deals: 77, payment: 72 },
  { name: "EnergySmart", survey: 68, deals: 60, payment: 66 },
];

function OverviewCard({ value, title, note, change, negative = false }: OverviewCard) {
  const trendColor = negative ? "text-[#ef4444]" : "text-[#16a34a]";
  const graphColor = negative ? "#ef4444" : "#16a34a";

  return (
    <article className="rounded-lg border border-[#dee4ee] bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[38px] leading-none font-semibold tracking-[-0.02em] text-[#161f2f]">{value}</p>
          <p className="mt-2 text-[24px] leading-tight font-medium text-[#1f2736]">{title}</p>
          <p className="mt-2 text-[15px] text-[#7a8392]">{note}</p>
        </div>
        <div className="mt-1 shrink-0 text-right">
          {change ? <p className={`text-[14px] font-semibold ${trendColor}`}>{change}</p> : <p className="text-[14px] text-[#8b95a3]">-</p>}
          <svg viewBox="0 0 78 38" className={`mt-2 h-10 w-[78px] ${trendColor}`}>
            <path
              d="M2 34 C13 28,19 12,30 16 C42 20,45 10,56 12 C64 14,70 6,76 2"
              fill="none"
              stroke={graphColor}
              strokeWidth="2.2"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>
    </article>
  );
}

export function SalesReportsDashboard() {
  return (
    <div className="min-w-0 space-y-4 pr-4">
      <section className="flex flex-wrap items-center justify-between gap-2 pt-1">
        <h1 className="text-[42px] font-semibold leading-none tracking-[-0.02em] text-[#0f172a]">Report Overview</h1>
        <div className="flex items-center gap-2">
          <button className="inline-flex h-10 items-center gap-2 rounded-md border border-[#d5dce7] bg-white px-3 text-[13px] text-[#596376]">
            <CalendarDays className="h-4 w-4" />
            Monthly
            <ChevronDown className="h-4 w-4" />
          </button>
          <button className="inline-flex h-10 items-center gap-2 rounded-md border border-[#d5dce7] bg-white px-3 text-[13px] text-[#596376]">
            Export
            <ChevronDown className="h-4 w-4" />
          </button>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-3 xl:grid-cols-3">
        {topOverviewCards.map((card) => (
          <OverviewCard key={card.title} {...card} />
        ))}
      </section>

      <section className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
        {secondaryOverviewCards.map((card) => (
          <OverviewCard key={card.title} {...card} />
        ))}
      </section>

      <section className="grid grid-cols-1 gap-3 xl:grid-cols-[1.6fr_0.95fr_0.9fr]">
        <article className="rounded-lg border border-[#dee4ee] bg-white p-4">
          <div className="flex items-center justify-between border-b border-[#e5ebf2] pb-2">
            <h2 className="text-[34px] font-medium text-[#111b2d]">Sales Funnel</h2>
            <button className="inline-flex h-9 items-center gap-2 rounded-md border border-[#d8dee9] bg-white px-3 text-[13px] text-[#6a7384]">
              <CalendarDays className="h-4 w-4" />
              Monthly
              <ChevronDown className="h-4 w-4" />
            </button>
          </div>
          <div className="mt-4 space-y-2">
            {funnelRows.map((item) => (
              <div key={item.label} className="flex items-center gap-3">
                <div className="flex h-14 items-center px-3 text-[35px] font-semibold text-[#13202f]" style={{ width: `${item.width}%`, backgroundColor: item.shade }}>
                  {item.value}
                </div>
                <span className="text-[19px] text-[#545f71]">{item.label}</span>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-lg border border-[#dee4ee] bg-white p-4">
          <h2 className="text-[34px] font-medium text-[#111b2d]">Sales Pipeline Distribution</h2>
          <div className="mt-5 flex justify-center">
            <div className="relative h-64 w-64 rounded-full bg-[conic-gradient(#14915f_0deg,#14915f_144deg,#bedcc6_144deg,#bedcc6_252deg,#61d5ab_252deg,#61d5ab_288deg,#d9eadc_288deg,#d9eadc_360deg)]">
              <div className="absolute inset-[42px] rounded-full bg-white shadow-[inset_0_0_0_1px_#e4ebf3]" />
              <div className="absolute right-[-110px] top-[92px] w-[220px] rounded-md border border-[#d8e1eb] bg-white p-2 text-[13px] text-[#485364] shadow-sm">
                <p className="font-semibold text-[#162133]">New Lead</p>
                <p>Add Lead: <span className="font-semibold text-[#111827]">230</span></p>
                <p>Site Survey Scheduled: <span className="font-semibold text-[#111827]">30</span></p>
              </div>
            </div>
          </div>
          <div className="mt-5 grid grid-cols-3 gap-2 text-[13px]">
            <div className="rounded-md bg-[#f6faf7] p-2">
              <p className="font-semibold text-[#0f172a]"><span className="mr-1 inline-block h-2.5 w-2.5 rounded-full bg-[#14915f]" />40%</p>
              <p className="mt-1 text-[#697485]">New Leads</p>
            </div>
            <div className="rounded-md bg-[#f7fbf8] p-2">
              <p className="font-semibold text-[#0f172a]"><span className="mr-1 inline-block h-2.5 w-2.5 rounded-full bg-[#bedcc6]" />30%</p>
              <p className="mt-1 text-[#697485]">Site Survey Scheduled</p>
            </div>
            <div className="rounded-md bg-[#f7fbf9] p-2">
              <p className="font-semibold text-[#0f172a]"><span className="mr-1 inline-block h-2.5 w-2.5 rounded-full bg-[#61d5ab]" />10%</p>
              <p className="mt-1 text-[#697485]">Direct payment</p>
            </div>
          </div>
        </article>

        <article className="rounded-lg border border-[#dee4ee] bg-white p-4">
          <div className="flex items-start justify-between gap-2 border-b border-[#e5ebf2] pb-2">
            <h2 className="text-[34px] font-medium text-[#111b2d]">Delayed Payments</h2>
            <p className="text-[14px] font-semibold text-[#ef4444]">₹12,00,000 Total Overdue</p>
          </div>
          <div className="mt-4 max-h-[430px] space-y-3 overflow-y-auto pr-1">
            {delayedPayments.map((item, index) => (
              <div key={`${item.customer}-${index}`} className="rounded-lg border border-[#f3b4ad] bg-[#fff6f5] p-3">
                <p className="text-[42px] leading-none font-semibold text-[#111827]">{item.amount}</p>
                <p className="mt-2 text-[28px] font-medium text-[#1f2937]">{item.customer}</p>
                <p className="mt-1 text-[15px] text-[#8c97a7]">Project: {item.project}</p>
                <p className="mt-1 text-[15px] font-semibold text-[#ef4444]">{item.overdue}</p>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="grid grid-cols-1 gap-3 xl:grid-cols-[1.45fr_1fr]">
        <article className="rounded-lg border border-[#dee4ee] bg-white p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-[34px] font-medium text-[#111b2d]">Delayed Deals</h2>
            <div className="flex items-center gap-2">
              <div className="inline-flex h-10 items-center gap-2 rounded-md border border-[#d7dee9] bg-white px-3 text-[13px] text-[#8b95a6]">
                <Search className="h-4 w-4" />
                Search
              </div>
              <button className="inline-flex h-10 items-center gap-2 rounded-md border border-[#d7dee9] bg-white px-3 text-[13px] text-[#6b7586]">
                <Filter className="h-4 w-4" />
                Filter
                <ChevronDown className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div className="mt-3 overflow-auto rounded-md border border-[#e3e8f0]">
            <table className="w-full min-w-[760px] text-left text-[14px]">
              <thead>
                <tr className="h-10 bg-[#d8dde4] font-medium text-[#344054]">
                  <th className="px-3">Rank</th>
                  <th className="px-3">Saled Rep</th>
                  <th className="px-3">Delayed deals</th>
                  <th className="px-3">Avg</th>
                  <th className="px-3">Revenue at Risk</th>
                </tr>
              </thead>
              <tbody>
                {delayedDealsRows.map((row, index) => (
                  <tr key={`${row.rep}-${index}`} className={`h-12 border-t border-[#e6ebf3] ${index % 2 === 1 ? "bg-[#f3fbf8]" : "bg-white"}`}>
                    <td className="px-3 text-[#6c7789]">{row.rank}</td>
                    <td className="px-3 font-medium text-[#111827]">{row.rep}</td>
                    <td className="px-3 text-[#6c7789]">{row.deals}</td>
                    <td className="px-3 text-[#6c7789]">{row.avg}</td>
                    <td className="px-3 font-semibold text-[#111827]">{row.risk}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        <article className="rounded-lg border border-[#dee4ee] bg-white p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-[34px] font-medium text-[#111b2d]">Vendor SLA Performance</h2>
            <button className="inline-flex h-10 items-center gap-2 rounded-md border border-[#d7dee9] bg-white px-3 text-[13px] text-[#6b7586]">
              Vendor
              <ChevronDown className="h-4 w-4" />
            </button>
          </div>
          <div className="relative mt-4 rounded-md border border-[#e1e7ef] p-3">
            <div className="pointer-events-none absolute inset-x-3 top-[20%] border-t border-dashed border-[#d9dfe8]" />
            <div className="pointer-events-none absolute inset-x-3 top-[40%] border-t border-dashed border-[#d9dfe8]" />
            <div className="pointer-events-none absolute inset-x-3 top-[60%] border-t border-dashed border-[#d9dfe8]" />
            <div className="pointer-events-none absolute inset-x-3 top-[80%] border-t border-dashed border-[#d9dfe8]" />
            <div className="relative h-[315px]">
              <div className="absolute bottom-8 left-0 right-0 flex items-end justify-between px-4">
                {slaBars.map((vendor) => (
                  <div key={vendor.name} className="flex w-[86px] flex-col items-center gap-2">
                    <div className="flex h-[220px] items-end gap-1.5">
                      <div className="w-5 rounded-t bg-[#14915f]" style={{ height: `${vendor.survey}%` }} />
                      <div className="w-5 rounded-t bg-[#67ddb1]" style={{ height: `${vendor.deals}%` }} />
                      <div className="w-5 rounded-t bg-[#bad6c0]" style={{ height: `${vendor.payment}%` }} />
                    </div>
                    <span className="text-[13px] text-[#6b7586]">{vendor.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-2 flex items-center justify-center gap-5 text-[13px] text-[#4f5b6e]">
            <span><span className="mr-1 inline-block h-3 w-3 rounded bg-[#14915f]" />Survey</span>
            <span><span className="mr-1 inline-block h-3 w-3 rounded bg-[#67ddb1]" />Deals</span>
            <span><span className="mr-1 inline-block h-3 w-3 rounded bg-[#bad6c0]" />Payment</span>
          </div>
        </article>
      </section>

      <section className="rounded-lg border border-[#dee4ee] bg-white p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-[#3b82f6]" />
            <h2 className="text-[54px] font-semibold leading-none tracking-[-0.03em] text-[#111b2d]">Growth Trends</h2>
          </div>
          <div className="flex items-center gap-2">
            <button className="h-11 rounded-lg bg-[#f2f4f8] px-5 text-[14px] text-[#697486]">Targets&nbsp; vs Current revenue</button>
            <button className="h-11 rounded-lg bg-[#f2f4f8] px-5 text-[14px] text-[#697486]">Leads vs Conversions</button>
            <button className="h-11 rounded-lg bg-[#191a52] px-5 text-[14px] font-semibold text-white">Revenue</button>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <div>
            <p className="text-[17px] text-[#6b7586]">Current Revenue</p>
            <p className="mt-1 text-[52px] leading-none font-semibold text-[#111b2d]">₹26.6L</p>
          </div>
          <div className="text-right">
            <p className="text-[40px] leading-none font-semibold text-[#16a34a]">+6.4%</p>
            <p className="mt-1 text-[16px] text-[#8b95a6]">vs last month</p>
          </div>
        </div>

        <div className="relative mt-4 rounded-md border border-[#e4e9f0] bg-[#f9fcff] p-3">
          <svg viewBox="0 0 1200 360" className="h-[360px] w-full">
            <defs>
              <linearGradient id="sales-growth-fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#79e5ca" stopOpacity="0.48" />
                <stop offset="100%" stopColor="#79e5ca" stopOpacity="0.08" />
              </linearGradient>
            </defs>
            <line x1="72" y1="35" x2="1130" y2="35" stroke="#dbe4ef" strokeDasharray="3 5" />
            <line x1="72" y1="105" x2="1130" y2="105" stroke="#dbe4ef" strokeDasharray="3 5" />
            <line x1="72" y1="175" x2="1130" y2="175" stroke="#dbe4ef" strokeDasharray="3 5" />
            <line x1="72" y1="245" x2="1130" y2="245" stroke="#dbe4ef" strokeDasharray="3 5" />
            <line x1="72" y1="315" x2="1130" y2="315" stroke="#dbe4ef" strokeDasharray="3 5" />

            <path d="M72 210 C150 220,210 205,270 202 C350 199,410 178,470 165 C540 150,620 170,700 158 C770 148,860 135,930 121 C1000 109,1060 94,1130 88 L1130 315 L72 315 Z" fill="url(#sales-growth-fill)" />
            <path d="M72 210 C150 220,210 205,270 202 C350 199,410 178,470 165 C540 150,620 170,700 158 C770 148,860 135,930 121 C1000 109,1060 94,1130 88" fill="none" stroke="#3fd3b4" strokeWidth="4" strokeLinecap="round" />

            <line x1="930" y1="55" x2="930" y2="315" stroke="#d4dde9" />
            <circle cx="930" cy="121" r="7" fill="#3fd3b4" stroke="#ffffff" strokeWidth="3" />

            <text x="18" y="320" fill="#6f7a8d" fontSize="16">₹0L</text>
            <text x="18" y="250" fill="#6f7a8d" fontSize="16">₹7L</text>
            <text x="12" y="180" fill="#6f7a8d" fontSize="16">₹14L</text>
            <text x="12" y="110" fill="#6f7a8d" fontSize="16">₹21L</text>
            <text x="12" y="40" fill="#6f7a8d" fontSize="16">₹28L</text>

            <text x="64" y="340" fill="#6f7a8d" fontSize="15">31 Jul</text>
            <text x="270" y="340" fill="#6f7a8d" fontSize="15">31 Aug</text>
            <text x="468" y="340" fill="#6f7a8d" fontSize="15">30 Sept</text>
            <text x="706" y="340" fill="#6f7a8d" fontSize="15">31 Oct</text>
            <text x="920" y="340" fill="#6f7a8d" fontSize="15">30 Nov</text>
            <text x="1112" y="340" fill="#6f7a8d" fontSize="15">31 Dec</text>
          </svg>
          <div className="pointer-events-none absolute bottom-14 right-[140px] rounded-xl border border-[#dde4ee] bg-white px-4 py-3 text-center shadow-sm">
            <p className="text-[14px] text-[#6b7586]">2024-11-30</p>
            <p className="mt-1 text-[14px] text-[#334155]">Revenue:</p>
            <p className="text-[24px] font-semibold text-[#111827]">₹25.0L</p>
          </div>
        </div>
      </section>

      <div className="h-2" />
    </div>
  );
}
