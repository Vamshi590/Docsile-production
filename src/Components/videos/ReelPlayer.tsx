import JobFilterStatic from "./JobFilterCard";
import { Header } from "../common/Header";
import ReelsContainer from "./reels-container";
import { useEffect, useState } from "react";
// Import removed as profile is now handled in Header component
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";



function ReelPlayer() {

  const [userDetails, setUserDetails] = useState<any>();

  useEffect (() => {
    setUserDetails(JSON.parse(localStorage.getItem("User") || ""));
  }, []);

  const isLoading = !userDetails;

  return (
    <div className="bg-mainbg flex flex-col min-h-screen overflow-y-hidden no-scrollbar mx-auto">
      <div className="bg-white border-b fixed w-full top-0 z-50 hidden lg:block">
        {isLoading ? (
          <div className="flex items-center px-5 py-3">
            <Skeleton circle height={40} width={40} className="mr-4" />
            <div className="flex flex-col flex-1">
              <Skeleton height={18} width={120} className="mb-1" />
              <Skeleton height={14} width={180} />
            </div>
          </div>
        ) : (
          <Header />
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 min-h-screen lg:pl-24 max-w-7xl mx-auto w-full gap-10">
        {/* Left Sidebar */}
        <div className="hidden lg:block w-[300px] flex-shrink-0 font-fontsm">
          <div className="sticky top-[calc(theme(spacing.20)+1px)] space-y-4">
            {isLoading ? (
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <Skeleton height={32} width={180} className="mb-3" />
                <Skeleton height={24} width={120} />
              </div>
            ) : (
              <JobFilterStatic />
            )}
          </div>
        </div>

        {/* Main Feed and Comments Section */}
        <div
          className={`flex-1 flex 'max-w-[450px]' mx-auto transition-all duration-300`}
        >
          {isLoading ? (
            <div className="flex flex-col gap-6 w-full">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl p-6 shadow-sm">
                  <Skeleton height={320} className="mb-3" />
                  <Skeleton height={18} width={100} />
                </div>
              ))}
            </div>
          ) : (
            <ReelsContainer />
          )}
        </div>
      </div>
    </div>
  );
}

export default ReelPlayer;
