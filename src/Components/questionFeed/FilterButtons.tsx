import { useState } from "react";
import dropdown from "../../assets/icon/dropdown.svg"

const FilterButtons = () => {

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  

    const toggleMore = () => {
      setIsDropdownOpen(!isDropdownOpen);
        };
  return (
    <div className="flex gap-3 items-center pt-4 pb-2 pl-5 lg:pl-2 font-fontsm relative">
      {/* Specialty Dropdown */}
      <button onClick={toggleMore} className="flex text-sm items-center gap-1 px-6 py-1 border border-x-gray-150 rounded-full text-fillc bg-white hover:bg-blue-50">
        Specialty
        <img src={dropdown} alt="" />
      </button>

      {isDropdownOpen && (
                <div
                  className="rounded-md shadow-md flex flex-col w-60 bg-white  text-xs p-3 z-20 absolute top-10 left-2 mt-2"
                  
                >
                  <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-2 rounded">
                    <p>Cardiology</p>
                  </div>
                  <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-2 rounded">
                    <p>Endocrinology</p>
                  </div>
                  <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-2 rounded">
                    <p>Gastroenterology</p>
                  </div>
                  <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-2 rounded">
                    <p>Neurology</p>
                  </div>
                  <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-2 rounded">
                    <p>Pulmonology</p>
                  </div>
                  <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-2 rounded ">
                    <p>Urology</p>
                  </div>
                </div>
              )}

      {/* All Button */}
      <button className="px-4 py-1 text-sm text-white bg-fillc rounded-full ">
        All
      </button>

      {/* Pulse Questions Button */}
      <button className="px-4 py-1 text-sm border border-blue-200 text-fillc rounded-3xl bg-blue-50 hover:bg-blue-100">
        Pulse Questions
      </button>
    </div>
  );
};

export default FilterButtons;
