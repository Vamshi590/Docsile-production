import { useState, useEffect } from "react";
import { State, City } from "country-state-city";

interface StateCitySelectorProps {
  selectedCountry: string | null;
  onStateCitySelect: (city: string, state: string) => void;
}

const StateCitySelector: React.FC<StateCitySelectorProps> = ({ selectedCountry, onStateCitySelect }) => {
  const [stateCityOptions, setStateCityOptions] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredOptions, setFilteredOptions] = useState<any[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false); // Control dropdown visibility

  const [selectedCityState, setSelectedCityState] = useState<string>("");

  useEffect(() => {
    if (selectedCountry) {
      // Fetch states and cities based on selected country
      const statesData = State.getStatesOfCountry(selectedCountry);
      const stateCityData = statesData.flatMap((state) => {
        const cities = City.getCitiesOfState(selectedCountry, state.isoCode);
        return cities.map((city) => ({
          cityName: city.name,
          stateName: state.name,
        }));
      });
      setStateCityOptions(stateCityData);
    } else {
      setStateCityOptions([]); // Reset if no country is selected
    }
  }, [selectedCountry]);

  // Handle search and filter based on search term
  useEffect(() => {
    if (searchTerm === "") {
      setFilteredOptions([]);
    } else {
      const filtered = stateCityOptions.filter((option) =>
        `${option.cityName}, ${option.stateName}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
      setFilteredOptions(filtered);
      setIsDropdownOpen(filtered.length > 0); // Open the dropdown if there are filtered options
    }
  }, [searchTerm, stateCityOptions]);

  const handleSelect = (option: { cityName: string; stateName: string }) => {
    const cityState = `${option.cityName}, ${option.stateName}`;
    setSelectedCityState(cityState);
    setSearchTerm(""); // Update the search term to the selected city and state
    onStateCitySelect(option.cityName, option.stateName); // Send data to parent
    setIsDropdownOpen(false); // Close the dropdown after selection
  };

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>){
    setSearchTerm(e.target.value)
    setSelectedCityState("");
  }

  return (
    <div className="relative mt-5 ">
      <input
        id="stateCity"
        type="text"
        value={selectedCityState || searchTerm}
        onChange={handleInputChange}
        onFocus={() => setIsDropdownOpen(!!filteredOptions.length)} // Open dropdown on focus if there are filtered options
        className="px-4 py-2.5 border border-main rounded-2xl w-full focus:outline-none"
        placeholder="City"
        disabled={!selectedCountry} // Disable input when no country is selected
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
              {option.cityName}, {option.stateName}
            </li>
          ))}
        </ul>
      )}

     
    </div>
  );
};

export default StateCitySelector;
