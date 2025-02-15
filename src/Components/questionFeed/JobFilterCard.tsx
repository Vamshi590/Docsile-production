import React, { useState } from "react";
import { Button } from "../ui/button";
import { Card } from "../ui/Card";
import { ChevronDown, ChevronUp } from "lucide-react";



const JobFilterStatic: React.FC = () => {

  
  const [isDatePostedOpen, setIsDatePostedOpen] = useState(false);
  const [selectedDatePosted, setSelectedDatePosted] = useState<string | null>(
    null
  );
  const [isUserTypeOpen, setIsUserTypeOpen] = useState(false);
  const [selectedUserType, setSelectedUserType] = useState<string | null>(null);
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState<string>("");



  const dates = ["Any time", "Past month", "Past week", "Most recent"];
  const userTypes = ["All Users", "Following ", "Most Active", "Verified ", "New Users"];

  
 

  const handleAddSpecialty = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && inputValue.trim() !== "") {
      if (!specialties.includes(inputValue.trim())) {
        setSpecialties([...specialties, inputValue.trim()]);
      }
      setInputValue("");
    }
  };

  const handleRemoveSpecialty = (specialtyToRemove: string) => {
    setSpecialties(
      specialties.filter((specialty) => specialty !== specialtyToRemove)
    );
  };

  return (
    <div className="w-full flex items-start justify-center">
      <Card className="w-full max-w-md bg-buttonclr p-4 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-md font-medium text-maincl">Filters</h2>
        </div>

        {/* Specialty Filter */}
        <div className="mb-4">
          <label className="text-xs  mb-2">Specialty</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {specialties.map((specialty, index) => (
              <div
                key={index}
                className="flex items-center px-3 py-1 text-xs font-medium text-white bg-fillc rounded-full"
              >
                {specialty}
                <button
                  onClick={() => handleRemoveSpecialty(specialty)}
                  className="ml-2 text-xs text-white hover:text-gray-300 focus:outline-none"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleAddSpecialty}
            placeholder="Type and press Enter to add a specialty"
            className="w-full px-3 py-2 border text-xs border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-fillc"
          />
        </div>

        


            {/* Sort by Date Posted Filter */}
        <div className="mb-6">
        <label className="block text-xs  mb-2"> Sort by </label>

          <button
            onClick={() => setIsDatePostedOpen(!isDatePostedOpen)}
            className="w-full flex justify-between items-center py-2 px-3 border rounded-lg focus:outline-none"
          >
            <span className="text-xs text-fillc">{selectedDatePosted || 'Most recent'}</span>
            {isDatePostedOpen ? <ChevronUp  size={16}/> : <ChevronDown size={16} />}
          </button>
          {isDatePostedOpen && (
            <div className="max-h-40 overflow-y-auto mt-2 border rounded-lg">
              {dates.map((date) => (
                <button
                  key={date}
                  onClick={() => {
                    setSelectedDatePosted(date);
                    setIsDatePostedOpen(false);
                  }}
                  className="block w-full text-left  text-xs px-3 py-2 hover:bg-gray-200"
                >
                  {date}
                </button>
              ))}
            </div>
          )}
        </div>


          {/* Filter by user type section */}

        <div className="mb-6">
          <label className="block text-xs mb-2">Filter by User Type</label>
          <button
            onClick={() => setIsUserTypeOpen(!isUserTypeOpen)}
            className="w-full flex justify-between items-center py-2 px-3 border rounded-lg focus:outline-none"
          >
            <span className="text-xs text-fillc">{selectedUserType || "Select User Type"}</span>
            {isUserTypeOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          {isUserTypeOpen && (
            <div className="max-h-40 overflow-y-auto mt-2 border rounded-lg">
              {userTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => {
                    setSelectedUserType(type);
                    setIsUserTypeOpen(false);
                  }}
                  className="block w-full text-xs text-left px-3 py-2 hover:bg-gray-200"
                >
                  {type}
                </button>
              ))}
            </div>
          )}
        </div>

        
          <div className="flex justify-end">

        <Button className="px-3 rounded-2xl text-fillc ">Reset</Button>
          </div>
      </Card>
    </div>
  );
};

export default JobFilterStatic;
