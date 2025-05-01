import React, { useState } from "react";
import { Button } from "../ui/button";
import { Card } from "../../Components/ui/card"; 
import { Slider } from "../ui/slider";
import { ChevronDown, ChevronUp } from "lucide-react";

interface JobType {
  id: string;
  label: string;
}

const JobFilterStatic: React.FC = () => {
  const [salary, setSalary] = useState<number[]>([0]);
  const [selectedJobTypes, setSelectedJobTypes] = useState<string[]>([]);
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [isExperienceOpen, setIsExperienceOpen] = useState(false);
  const [selectedExperience, setSelectedExperience] = useState<string | null>(
    null
  );
  const [isDatePostedOpen, setIsDatePostedOpen] = useState(false);
  const [selectedDatePosted, setSelectedDatePosted] = useState<string | null>(
    null
  );
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState<string>("");

  const locations = [
    "Agra",
    "Ahmedabad",
    "Ajmer",
    "Allahabad",
    "Amravati",
    "Amritsar",
    "Aurangabad",
    "Bareilly",
    "Bangalore",
    "Bhilai",
    "Bhiwandi",
    "Bhopal",
    "Bhubaneswar",
    "Bikaner",
    "Chandigarh",
    "Chennai",
    "Coimbatore",
    "Cuttack",
    "Dehradun",
    "Delhi",
    "Dhanbad",
    "Durgapur",
    "Faridabad",
    "Firozabad",
    "Ghaziabad",
    "Gorakhpur",
    "Gurgaon",
    "Guwahati",
    "Gwalior",
    "Hubballi-Dharwad",
    "Hyderabad",
    "Indore",
    "Jabalpur",
    "Jaipur",
    "Jalandhar",
    "Jamshedpur",
    "Jodhpur",
    "Kalyan-Dombivli",
    "Kanpur",
    "Kochi",
    "Kolhapur",
    "Kolkata",
    "Kota",
    "Lucknow",
    "Ludhiana",
    "Madurai",
    "Meerut",
    "Moradabad",
    "Mumbai",
    "Mysore",
    "Nagpur",
    "Nanded",
    "Nashik",
    "Navi Mumbai",
    "Noida",
    "Patna",
    "Pimpri-Chinchwad",
    "Pune",
    "Raipur",
    "Rajkot",
    "Ranchi",
    "Rourkela",
    "Salem",
    "Saharanpur",
    "Solapur",
    "Srinagar",
    "Surat",
    "Thane",
    "Tiruchirappalli",
    "Vadodara",
    "Varanasi",
    "Vasai-Virar",
    "Vijayawada",
    "Visakhapatnam",
    "Warangal",
  ];

  const experiences = ["0", "1", "2", "3", "4", "5+"];
  const dates = ["Any time", "Past month", "Past week", "Past 24 hours"];

  const jobTypes: JobType[] = [
    { id: "fullTime", label: "Full Time" },
    { id: "partTime", label: "Part Time" },
    { id: "contract", label: "Contract" },
    { id: "internship", label: "Internship" },
    { id: "hybrid", label: "Hybrid" },
    { id: "remote", label: "Remote" },
  ];

  const toggleJobTypeSelection = (id: string) => {
    setSelectedJobTypes((prev) =>
      prev.includes(id) ? prev.filter((type) => type !== id) : [...prev, id]
    );
  };

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
    <div className="w-full flex items-start justify-center pt-3 px-2">
      <Card className="w-full max-w-md bg-buttonclr p-4 rounded-lg shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-md font-medium text-maincl">Filters</h2>
        </div>

        {/* Specialty Filter */}
        <div className="mb-4">
          <label className="text-fontlit  mb-2">Specialty</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {specialties.map((specialty, index) => (
              <div
                key={index}
                className="flex items-center px-3 py-1 text-xs font-medium text-white bg-fillc rounded-full"
              >
                {specialty}
                <button
                  onClick={() => handleRemoveSpecialty(specialty)}
                  className="ml-2 text-fontlit text-white hover:text-gray-300 focus:outline-none"
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
            className="w-full px-3 py-2 border text-fontlit border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-fillc"
          />
        </div>

        {/* Location Filter */}
        <div className="mb-4">
        <label className="block text-fontlit    mb-2">Location</label>

          <button
            onClick={() => setIsLocationOpen(!isLocationOpen)}
            className="w-full flex justify-between text-fontlit items-center py-2 px-3 border rounded-lg focus:outline-none"
          >
            <span className="text-gray-700 text-fontlit">{selectedLocation || "Select Location"}</span>
            {isLocationOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          {isLocationOpen && (
            <div className="max-h-40 overflow-y-auto mt-2 border rounded-lg">
              {locations.map((location) => (
                <button
                  key={location}
                  onClick={() => {
                    setSelectedLocation(location);
                    setIsLocationOpen(false);
                  }}
                  className="block w-full text-left text-fontlit px-3 py-2 hover:bg-gray-200"
                >
                  {location}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Job Type Filter */}
        <div className="mb-4">
          <p className="text-fontlit mb-2">Job Type</p>
          <div className="flex flex-wrap gap-2">
            {jobTypes.map((jobType) => (
              <button
                key={jobType.id}
                onClick={() => toggleJobTypeSelection(jobType.id)}
                className={`px-3 text-fontlit py-1 border rounded-full ${
                  selectedJobTypes.includes(jobType.id)
                    ? "bg-fillc text-white"
                    : "bg-gray-100"
                }`}
              >
                {jobType.label}
              </button>
            ))}
          </div>
        </div>

       {/* Salary Range */}
       <div className="mb-6">
         <label className="block text-fontlit  mb-2">Salary</label>
         <div className="relative w-full">
           {/* Background gradient */}
           <div
             className="absolute top-1 transform -translate-y-1/2  left-0 h-1 rounded-full bg-fillc w-full"
             style={{
               background: `linear-gradient(to right, #6688CC ${(salary[0] / 10) * 100}%, #e5e7eb ${(salary[0] / 10) * 100}%)`,
             }}
           ></div>
           
           {/* Slider Component */}
           <Slider
             defaultValue={[0]}
             max={10}
             step={1.7}
             className="relative z-10"
             value={salary}
             onValueChange={setSalary}
           />
           
          
         </div>
         <div className="flex justify-between text-fontlit  text-gray-500 mt-2">
           <span>0</span>
           <span>2 Lac</span>
           <span>4 Lac</span>
           <span>6 Lac</span>
           <span>8 Lac</span>
           <span>10 Lac</span>
         </div>
       </div>



        {/* Experience Filter */}
        <div className="mb-6">
        <label className="block text-fontlit mb-2">Years of Experience</label>

          <button
            onClick={() => setIsExperienceOpen(!isExperienceOpen)}
            className="w-full flex justify-between items-center py-2 px-3 border rounded-lg focus:outline-none"
          >
            <span className="text-fontlit text-gray-700">{selectedExperience || "Select Experience"}</span>
            {isExperienceOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          {isExperienceOpen && (
            <div className="max-h-40 overflow-y-auto mt-2 border rounded-lg">
              {experiences.map((exp) => (
                <button
                  key={exp}
                  onClick={() => {
                    setSelectedExperience(exp);
                    setIsExperienceOpen(false);
                  }}
                  className="block w-full text-fontlit  text-left px-3 py-2 hover:bg-gray-200"
                >
                  {exp} years
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Date Posted Filter */}
        <div className="mb-6">
        <label className="block text-fontlit  mb-2">Date Posted</label>

          <button
            onClick={() => setIsDatePostedOpen(!isDatePostedOpen)}
            className="w-full flex justify-between items-center py-2 px-3 border rounded-lg focus:outline-none"
          >
            <span className="text-fontlit text-gray-700">{selectedDatePosted || "Select Date Posted"}</span>
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
                  className="block w-full text-left px-3 py-2 hover:bg-gray-200"
                >
                  {date}
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