import React, { useState } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import profile from "../../assets/icon/profile.svg"

interface Person {
  id: number;
  profile_picture: string;
  name: string;
  department?: string;
  organisation_name : string;
  specialisation_field_of_study : string,
  mutualConnection:string;
  mutualCount:number
}

interface ConnectionCard1Props {
  connections: Person[];
}

const ConnectionCard1: React.FC<ConnectionCard1Props> = ({ connections }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };



  const displayedPeople = isExpanded ? connections : connections?.slice(0, 2);

  return (
    <div className=" border w-full border-gray-200 bg-white rounded-lg   font-fontsm">
      <div className="flex justify-between  items-center px-3 rounded-t-xl py-2">
        <div className="text-md text-gray-700">
            Start connecting to interact and grow your network 
        </div>
        
      </div>
      <div
        className={`  px-4 pt-4 transition-all duration-300 ${isExpanded ? "max-h-[500px]" : "max-h-[220px]"} overflow-hidden`}
      >
        {displayedPeople?.map((person) => (
          <div
            key={person.id}
            className="flex items-center  justify-between mb-3 pb-3 border  border-gray-400  rounded-xl  p-3"
          >
            <div className="flex items-center">
              <div className="w-14 h-14 rounded-full overflow-hidden">
                <img
                  src={person.profile_picture || profile}
                  alt={person.name}
                  className="w-full h-full object-cover shrink-0"
                />
              </div>
              <div className="ml-3">
                <div className="text-sm font-medium">{person.name}</div>
                <div className="text-xs text-gray-500  line-clamp-1">
                  {`${person.department} | ${ person.specialisation_field_of_study || ""}  | ${person.organisation_name}`}
                </div>
                {person?.mutualCount > 0 && <div className="flex flex-row items-center  mb-2 pt-2">
                    <div className="w-4 h-4 rounded-full"><img src={person.profile_picture} alt="" /></div>
                    <div className="text-fontlit text-gray-400 pl-1 ">
                        {person.mutualConnection} and {person.mutualCount} mutual connections
                    </div>
                </div>}
              
              </div>
            </div>
            <div className="flex space-x-2">
              <button className="px-4 py-1 text-xs text-white bg-maincl rounded-xl transition-colors hover:bg-opacity-90">
                follow
              </button>
             
            </div>
          </div>
        ))}

          
      </div>

      <div
          className="text-xs text-gray-400  pb-3 cursor-pointer flex items-center justify-center gap-1"
          onClick={toggleExpand}
        >
          {isExpanded ? (
            <span className="flex items-center">
              Show Less <ChevronUp className="w-4 h-4" />
            </span>
          ) : (
            <span className="flex items-center">
              See More <ChevronDown className="w-4 h-4" />
            </span>
          )}
        </div>
    </div>
  );
};

export default ConnectionCard1;
