import { useState, useEffect } from "react";

interface DropDownWithSearchProps {
  place : string;
  onSelect: (option : string) => void;
  dropDownOptions : string[]
}

const DropDownWithSearch: React.FC<DropDownWithSearchProps> = ({ place,  onSelect, dropDownOptions }) => {

  const [options, setOptions] = useState<string[]>(dropDownOptions || [] );
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredOptions, setFilteredOptions] = useState<string[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false); // Control dropdown visibility

  const [selectedOption, setSelectedOption] = useState<string>("");

 
  
  useEffect(() => {
    setOptions(dropDownOptions);
  }, [dropDownOptions]);

  // Handle search and filter based on search term
  useEffect(() => {
    if (searchTerm === "") {
      setFilteredOptions([]);
    } else {
      const filtered = options.filter((option) =>
        option
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
      setFilteredOptions(filtered);
      setIsDropdownOpen(filtered.length > 0); // Open the dropdown if there are filtered options
    }
  }, [searchTerm, options]);

  const handleSelect = (option: string) => {
   
    setSelectedOption(option);
    setSearchTerm(""); // Update the search term to the selected city and state
    onSelect(option); // Send data to parent
    setIsDropdownOpen(false); // Close the dropdown after selection
    console.log(option)
  };

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>){
    setSearchTerm(e.target.value)
    setSelectedOption("");
  }


  return (
    <div className="relative mt-5 ">
        
      <input
        type="text"
        value={selectedOption || searchTerm}
        onChange={handleInputChange}
        onFocus={() => setIsDropdownOpen(!!filteredOptions.length)} // Open dropdown on focus if there are filtered options
        className="mt-1 p-2 block w-full text-gray-800 font-light  rounded-xl border  border-gray-300 shadow-sm focus:border-fillc  focus:outline-none"
        placeholder={place }
      />

      {/* Dropdown list */}
      {isDropdownOpen && filteredOptions.length > 0 && (
        <ul className="absolute mt-2 w-full max-h-60 overflow-auto bg-white border rounded-lg shadow-md z-10">
          {filteredOptions.map((option, index) => (
            <li
              key={index}
              onClick={() => handleSelect(option)}
              className="px-4 py-2 cursor-pointer hover:bg-gray-200"
            >
              {option}
            </li>
          ))}
        </ul>
      )}

     
    </div>
  );
};

export default DropDownWithSearch;
