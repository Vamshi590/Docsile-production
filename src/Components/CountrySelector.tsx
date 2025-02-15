import { useState, useEffect } from "react";
import { Country } from "country-state-city";

interface CountrySelectorProps {
  onCountrySelect: (countryCode: string) => void;
}

const CountrySelector: React.FC<CountrySelectorProps> = ({ onCountrySelect }) => {
  const [countries, setCountries] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [filteredCountries, setFilteredCountries] = useState<any[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  useEffect(() => {
    const countriesData = Country.getAllCountries();
    setCountries(countriesData);
  }, []);

  // Handle search and filter based on search term
  useEffect(() => {
    if (searchTerm === "") {
      setFilteredCountries([]);
    } else {
      const filtered = countries.filter((country) =>
        country.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCountries(filtered);
      setIsDropdownOpen(filtered.length > 0);
    }
  }, [searchTerm, countries]);

  const handleSelect = (country: any) => {
    setSelectedCountry(country.name);
    setSearchTerm("");
    onCountrySelect(country.isoCode);
    setIsDropdownOpen(false);
  };

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchTerm(e.target.value);
    setSelectedCountry("");
  }

  return (
    <div className="relative mt-5">
      <input
        id="country"
        type="text"
        value={selectedCountry || searchTerm}
        onChange={handleInputChange}
        onFocus={() => setIsDropdownOpen(!!filteredCountries.length)}
        className="px-4 py-2.5 border border-main rounded-2xl w-full focus:outline-none"
        placeholder="Select a country"
      />

      {/* Dropdown list */}
      {isDropdownOpen && filteredCountries.length > 0 && (
        <ul className="absolute mt-2 w-full max-h-60 overflow-auto bg-white border rounded-lg shadow-md z-10">
          {filteredCountries.map((country) => (
            <li
              key={country.isoCode}
              onClick={() => handleSelect(country)}
              className="px-4 py-2 cursor-pointer hover:bg-gray-200"
            >
              {country.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CountrySelector;
