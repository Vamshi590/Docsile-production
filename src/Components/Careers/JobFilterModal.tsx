import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Slider } from '../ui/slider';
import { ChevronDown,ChevronUp , X } from 'lucide-react';

interface JobFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface JobType {
  id: string;
  label: string;
}

const JobFilterModal: React.FC<JobFilterModalProps> = ({ isOpen, onClose }) => {
    const [salary, setSalary] = useState<number[]>([0]);
    const [selectedJobTypes, setSelectedJobTypes] = useState<string[]>([]);
  
const locations = [
    'Agra', 'Ahmedabad', 'Ajmer', 'Allahabad', 'Amravati', 'Amritsar', 'Aurangabad',
    'Bareilly', 'Bangalore', 'Bhilai', 'Bhiwandi', 'Bhopal', 'Bhubaneswar', 'Bikaner',
    'Chandigarh', 'Chennai', 'Coimbatore', 'Cuttack', 'Dehradun', 'Delhi', 'Dhanbad',
    'Durgapur', 'Faridabad', 'Firozabad', 'Ghaziabad', 'Gorakhpur', 'Gurgaon', 'Guwahati',
    'Gwalior', 'Hubballi-Dharwad', 'Hyderabad', 'Indore', 'Jabalpur', 'Jaipur', 'Jalandhar',
    'Jamshedpur', 'Jodhpur', 'Kalyan-Dombivli', 'Kanpur', 'Kochi', 'Kolhapur', 'Kolkata',
    'Kota', 'Lucknow', 'Ludhiana', 'Madurai', 'Meerut', 'Moradabad', 'Mumbai', 'Mysore',
    'Nagpur', 'Nanded', 'Nashik', 'Navi Mumbai', 'Noida', 'Patna', 'Pimpri-Chinchwad',
    'Pune', 'Raipur', 'Rajkot', 'Ranchi', 'Rourkela', 'Salem', 'Saharanpur', 'Solapur',
    'Srinagar', 'Surat', 'Thane', 'Tiruchirappalli', 'Vadodara', 'Varanasi', 'Vasai-Virar',
    'Vijayawada', 'Visakhapatnam', 'Warangal'
  ]; // Sample locations

const [isLocationOpen, setIsLocationOpen] = useState(false); 
const [selectedLocation, setSelectedLocation] = useState<string | null>(null); 


const experiences = ['0','1', '2', '3', '4', '5+'];

const [isExperienceOpen, setIsExperienceOpen] = useState(false); 
const [selectedExperience, setSelectedExperience] = useState<string | null>(null); 

const dates = ['Any time', 'Past month', 'Past week', 'Past 24 hours'];

const [isdatePostedOpen, setIsdatePostedOpen] = useState(false); 
const [selectedDatePosted, setSelectedDatePosted] = useState<string | null>(null); 

    const jobTypes: JobType[] = [
      { id: 'fullTime', label: 'Full Time' },
      { id: 'partTime', label: 'Part Time' },
      { id: 'contract', label: 'Contract' },
      { id: 'internship', label: 'Internship' },
      { id: 'hybrid', label: 'Hybrid' },
      { id: 'remote', label: 'Remote' },
    ];
  
    if (!isOpen) return null;
  
    const handleOverlayClick = (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    };
  
    const toggleJobTypeSelection = (id: string) => {
      setSelectedJobTypes((prev) =>
        prev.includes(id) ? prev.filter((type) => type !== id) : [...prev, id]
      );
    };


    

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-50"
        onClick={handleOverlayClick}
        style={{ backdropFilter: 'blur(4px)' }}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4 pointer-events-none">
        <Card className="w-full max-w-md bg-white p-4 rounded-lg shadow-xl pointer-events-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-medium">Filters</h2>
            <button 
              onClick={onClose} 
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Specialty Filter */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Specialty</label>
            <div className="relative">
              <input
                type="text"
                placeholder="E.g. Ophthalmology"
                className="w-full p-2 border rounded-md font-light pr-10 focus:outline-none focus:ring-2 focus:ring-fillc focus:border-transparent"
              />
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            </div>
          </div>

          {/* Location Filter */}
                    <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Location</label>
            <div className="relative">
                <button
                onClick={() => setIsLocationOpen(!isLocationOpen)}
                className="flex items-center justify-between w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700"
                >
                <span>{selectedLocation || 'Select Location'}</span>
                {isLocationOpen ? (
                    <ChevronUp size={20} className="text-gray-500" />
                ) : (
                    <ChevronDown size={20} className="text-gray-500" />
                )}
                </button>
                {isLocationOpen && (
                <div className="absolute z-10 w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                    {locations.map((location) => (
                    <button
                        key={location}
                        onClick={() => {
                        setSelectedLocation(location); // Update selected location
                        setIsLocationOpen(false); // Close dropdown
                        }}
                        className="w-full px-4 py-2 text-left hover:bg-gray-100"
                    >
                        {location}
                    </button>
                    ))}
                </div>
                )}
            </div>
            </div>

          {/* Job Type Filter */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Job Type</label>
            <div className="flex flex-wrap gap-2">
              {jobTypes.map((type) => (
                <Button
                  key={type.id}
                  onClick={() => toggleJobTypeSelection(type.id)}
                  className={`rounded-full text-sm font-light py-1 px-4  border ${
                    selectedJobTypes.includes(type.id)
                      ? 'bg-fillc text-white border-maincl'
                      : 'border-blue-100 text-fillc hover:bg-fillc'
                  }`}
                >
                  {type.label}
                </Button>
              ))}
            </div>
          </div>

         
   {/* Salary Range */}
<div className="mb-6">
  <label className="block text-sm font-medium mb-2">Salary</label>
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
      step={1.9}
      className="relative z-10"
      value={salary}
      onValueChange={setSalary}
    />
    
   
  </div>
  <div className="flex justify-between text-sm text-gray-500 mt-2">
    <span>0</span>
    <span>2 Lac</span>
    <span>4 Lac</span>
    <span>6 Lac</span>
    <span>8 Lac</span>
    <span>10 Lac</span>
  </div>
</div>


          {/* Years of Experience */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Years of Experience</label>
            <div className="relative">
             <button 
             onClick={()=>setIsExperienceOpen(!isExperienceOpen)}
             className="flex items-center justify-between w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700"
             >
             <span>{selectedExperience || 'Select Experience'}</span>
             {isExperienceOpen? (
                <ChevronUp size={20} className="text-gray-500" />
             ):(
                <ChevronDown size={20} className="text-gray-500" />
             )}

             </button>

             {isExperienceOpen && (
                        <div className="absolute z-10 w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                    {experiences.map((experience) => (
                    <button
                        key={experience}
                        onClick={() => {
                        setSelectedExperience(experience); // Update selected location
                        setIsExperienceOpen(false); // Close dropdown
                        }}
                        className="w-full px-4 py-2 text-left hover:bg-gray-100"
                    >
                        {experience}
                    </button>
                    ))}
                </div>
                )}
            </div>
          </div>

          {/* Date Posted */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Date Posted</label>
            <div className="relative">
             <button 
             onClick={()=>setIsdatePostedOpen(!isdatePostedOpen)}
             className="flex items-center justify-between w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700"
             >
             <span>{selectedDatePosted || 'Select Date Posted'}</span>
             {isdatePostedOpen? (
                <ChevronUp size={20} className="text-gray-500" />
             ):(
                <ChevronDown size={20} className="text-gray-500" />
             )}

             </button>

             {isdatePostedOpen && (
                        <div className="absolute z-10 w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                    {dates.map((date) => (
                    <button
                        key={date}
                        onClick={() => {
                        setSelectedDatePosted(date); // Update selected location
                        setIsdatePostedOpen(false); // Close dropdown
                        }}
                        className="w-full px-4 py-2 text-left hover:bg-gray-100"
                    >
                        {date}
                    </button>
                    ))}
                </div>
                )}
            </div>
          </div>


          {/* Action Buttons */}
          <div className="flex flex-row  justify-between">
            <div>
            <Button
              variant="outline"
              className="flex-1 py-2 text-maincl border border-maincl-100 rounded-2xl"
              onClick={() => {
                setSalary([0]);
                setSelectedJobTypes([]);
              }}
            >
              Reset
            </Button>
            </div>
            <div>
            <Button
              className="flex-1 bg-maincl rounded-2xl font-noraml text-white py-2 hover:bg-fillc"
              onClick={() => {
                // Apply filter logic here
                console.log({ salary, selectedJobTypes });
              }}
            >
              Apply Filter
            </Button>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
};

export default JobFilterModal;