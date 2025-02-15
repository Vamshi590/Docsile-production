import React, { useRef, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import profile from "../../assets/icon/profile.svg";

interface Person {
  id: number;
  profile_picture: string;
  name: string;
  department?: string;
  organisation_name: string;
  specialisation_field_of_study: string;
  mutualConnection: string;
  mutualCount: number;
}

interface ConnectionCard2Props {
  connections: Person[];
}

const ConnectionCard2: React.FC<ConnectionCard2Props> = ({ connections }) => {
  const peopleData: Person[] = [
    {
      id: 1,
      profile_picture:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/13d83c993760da19a222234c3cbcb356d551631f91a34653bf73ab3984455ff6?placeholderIfAbsent=true&apiKey=90dc9675c54b49f9aa0dc15eba780c08",
      name: "Vamshidhar seelam",
      department: "Ophthalmologist | AIIMS Delhi`25 |Aspiring Medical",
      organisation_name: "",
      specialisation_field_of_study: "",
      mutualConnection: "bhanu",
      mutualCount: 88,
    },
    {
      id: 2,
      profile_picture:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/13d83c993760da19a222234c3cbcb356d551631f91a34653bf73ab3984455ff6?placeholderIfAbsent=true&apiKey=90dc9675c54b49f9aa0dc15eba780c08",
      name: "Vamshidhar seelam",
      department: "Ophthalmologist | AIIMS Delhi`25 |Aspiring Medical",
      organisation_name: "",
      specialisation_field_of_study: "",
      mutualConnection: "bhanu",
      mutualCount: 69,
    },
    {
      id: 3,
      profile_picture:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/13d83c993760da19a222234c3cbcb356d551631f91a34653bf73ab3984455ff6?placeholderIfAbsent=true&apiKey=90dc9675c54b49f9aa0dc15eba780c08",
      name: "Vamshidhar seelam",
      department: "Ophthalmologist | AIIMS Delhi`25 |Aspiring Medical",
      organisation_name: "",
      specialisation_field_of_study: "",
      mutualConnection: "bhanu",
      mutualCount: 88,
    },
    {
      id: 4,
      profile_picture:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/13d83c993760da19a222234c3cbcb356d551631f91a34653bf73ab3984455ff6?placeholderIfAbsent=true&apiKey=90dc9675c54b49f9aa0dc15eba780c08",
      name: "Vamshidhar seelam",
      department: "Ophthalmologist | AIIMS Delhi`25 |Aspiring Medical",
      organisation_name: "",
      specialisation_field_of_study: "",
      mutualConnection: "bhanu",
      mutualCount: 69,
    },
  ];
  const [showAll, setShowAll] = useState<boolean>(false);
  const scrollContainerRefs = useRef<{ [key: string]: HTMLDivElement | null }>(
    {}
  );

  const toggleShowAll = () => setShowAll(!showAll);

  const handleScroll = (direction: "left" | "right", title: string) => {
    const container = scrollContainerRefs.current[title];
    if (container) {
      const scrollAmount = 200;
      container.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="px-4 py-3 bg-white border border-gray-100 rounded-xl mb-4 font-fontsm ">
      <div className="flex justify-between items-center mb-3">
        <div className="text-md text-gray-600">People you may know</div>
        <button
          onClick={toggleShowAll}
          className="text-xs text-maincl hover:text-fillc"
        >
          {showAll ? "Show less" : "See all"}
        </button>
      </div>
      <div className="relative">
        <button
          onClick={() => handleScroll("left", "connections")}
          className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white rounded-full p-2  hover:bg-gray-50 transition-all duration-200 hidden ${
            showAll ? "lg:flex" : ""
          } items-center justify-center`}
        >
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div
          ref={(el) => (scrollContainerRefs.current["connections"] = el)}
          className={`flex space-x-3 overflow-x-auto no-scrollbar  relative scroll-smooth ${
            showAll ? "px-2" : ""
          }`}
        >
          {connections.slice(0, showAll ? undefined : 5).map((person) => (
            <div
              key={person.id}
              className="relative min-w-[150px] flex-shrink-0 bg-white  border border-gray-400 rounded-2xl p-2"
            >
              <button className="absolute right-1 top-1 bg-white rounded-full p-1 hover:bg-gray-100 transition-colors">
                <X className="w-3 h-3 text-gray-400" />
              </button>
              <div className="relative w-44 h-52 text-center flex flex-col items-center">
                <img
                  src={person?.profile_picture || profile}
                  alt={person.name}
                  className="w-20 h-20 rounded-full object-cover"
                />
                <div className="text-sm font-medium pt-2 line-clamp-1">
                  {person.name}
                </div>
                <div className="text-xs text-gray-500 line-clamp-2">{`${person.department} | ${person.specialisation_field_of_study} | ${person.organisation_name}`}</div>
                {person.mutualCount > 0 && (
                  <div className="flex justify-center items-center   mb-2 pt-2">
                    <div className="w-5 h-5 rounded-full ">
                      <img src={person.profile_picture} alt="" />
                    </div>
                    <div className="text-fontlit text-gray-400  line-clamp-2 ">
                      {person.mutualConnection} and {person.mutualCount} mutual
                      connections
                    </div>
                  </div>
                )}
                <button className=" absolute bottom-5 py-1.5 px-3 text-xs text-white bg-maincl rounded-3xl transition-colors mt-2">
                  Follow
                </button>
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={() => handleScroll("right", "connections")}
          className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transition-all duration-200 hidden ${
            showAll ? "lg:flex" : ""
          } items-center justify-center`}
        >
          <ChevronRight className="w-5 h-5 text-gray-600" />
        </button>
      </div>
    </div>
  );
};

export default ConnectionCard2;
