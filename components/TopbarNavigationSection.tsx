"use client"
import { useState } from "react";
import vector77 from "./vector-77.svg";
import vector78 from "./vector-78.svg";
import vector79 from "./vector-79.svg";
import vector80 from "./vector-80.svg";
import vector81 from "./vector-81.svg";
import vector82 from "./vector-82.svg";

export const TopBarNavigationSection = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header className="flex w-[1487px] h-[60px] items-center justify-between px-6 py-3 absolute top-0 left-[calc(50.00%_-_624px)] bg-backgroundwhite shadow-[0px_4px_6px_#636b740a]">
      <h1 className="relative w-fit [font-family:'General_Sans-Semibold',Helvetica] font-normal text-[#030204] text-base tracking-[0] leading-5 whitespace-nowrap">
        Admin
      </h1>

      <nav
        className="inline-flex items-center gap-4 relative flex-[0_0_auto]"
        aria-label="Top navigation"
      >
        <div className="flex w-[250px] h-8 gap-2 p-2 bg-[#f2f2f299] items-center relative rounded">
          <label
            htmlFor="search-input"
            className="gap-1.5 mt-[-1.00px] mb-[-1.00px] inline-flex items-center relative flex-[0_0_auto] cursor-text"
          >
            <div
              className="relative w-[18px] h-[18px] aspect-[1]"
              aria-hidden="true"
            >
              <img
                className="absolute w-[18.08%] h-[18.08%] top-[65.94%] left-[65.94%]"
                alt=""
                src={vector77}
              />

              <img
                className="absolute w-[66.67%] h-[66.67%] top-[9.03%] left-[9.03%]"
                alt=""
                src={vector78}
              />
            </div>

            <input
              id="search-input"
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search"
              className="w-fit [font-family:'Inter_Tight-Medium',Helvetica] font-medium text-[#665f6d] text-xs tracking-[0] leading-4 relative whitespace-nowrap bg-transparent border-none outline-none placeholder:text-[#665f6d]"
              aria-label="Search"
            />
          </label>
        </div>

        <button
          className="flex items-center justify-center gap-2 relative self-stretch rounded aspect-[1] bg-transparent border-none cursor-pointer p-0"
          aria-label="Notifications"
          type="button"
        >
          <div className="relative w-5 h-5 aspect-[1]">
            <img
              className="absolute w-[14.43%] h-[4.17%] top-[83.75%] left-[39.03%]"
              alt=""
              src={vector80}
            />

            <img
              className="absolute w-[75.00%] h-[62.50%] top-[4.58%] left-[8.75%]"
              alt=""
              src={vector81}
            />

            <img
              className="absolute w-[25.00%] h-[25.00%] top-[17.08%] left-[58.75%]"
              alt=""
              src={vector82}
            />
          </div>
        </button>

        <button
          className="inline-flex items-center gap-2 relative flex-[0_0_auto] bg-transparent border-none cursor-pointer p-0"
          aria-label="User menu for Rajesh B"
          type="button"
        >
          <div
            className="relative w-8 h-8 aspect-[1] bg-[url(/ellipse-18.svg)] bg-cover bg-[50%_50%]"
            role="img"
            aria-label="User avatar"
          />

          <div className="inline-flex items-center gap-1 relative flex-[0_0_auto]">
            <span className="relative w-fit mt-[-1.00px] [font-family:'Inter_Tight-Regular',Helvetica] font-normal text-[#030204] text-sm tracking-[0] leading-5 whitespace-nowrap">
              Rajesh B
            </span>

            <div className="relative w-4 h-4" aria-hidden="true">
              <img
                className="absolute w-[50.00%] h-[25.00%] top-[33.59%] left-[21.09%]"
                alt=""
                src={vector79}
              />
            </div>
          </div>
        </button>
      </nav>
    </header>
  );
};

