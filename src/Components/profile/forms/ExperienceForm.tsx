import React, { useEffect, useState } from 'react';
import Modal from '../../common/Modal';
import {  State, City }  from 'country-state-city';



interface ExperienceFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ExperienceFormData) => void;
  initialData?: ExperienceFormData;
  isEditing?: boolean;
}

export interface ExperienceFormData {
  title: string;
  organisation: string;
  startDate: string;
  description: string;
  img?: string | File;
  notifyFollowers?: boolean;
  location?: string;
  city?: string;
  state?: string;
  
}

const ExperienceForm: React.FC<ExperienceFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isEditing = false,
}) => {
  const [formData, setFormData] = useState<ExperienceFormData>(
    initialData || {
      title: '',
      organisation: '',
      startDate: '',
      location: '', 
      state: '',
      city: '',
      description: '',
      img: '',
      notifyFollowers: false,
    }
  );
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [isDropdownVisible1, setIsDropdownVisible1] = useState(false);

  interface LocationState {
    name: string;
    isoCode: string;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value: string = e.target.value;
    const parts = value.split(',').map((part: string) => part.trim());
    const [cityPart, statePart]: [string, string | undefined] = [parts[0], parts[1]];
    
    setFormData(prev => ({
      ...prev,
      city: cityPart,
      state: State.getStatesOfCountry('IN').find((s: LocationState) => s.name === statePart)?.isoCode || ''
    }));
    
    // Show dropdown when user types
    setIsDropdownVisible(true);

  };


    interface LocationCity {
      name: string;
      stateCode: string;
    }

    interface LocationState {
      name: string;
      isoCode: string;
    }

    const handleLocationSelect = (city: LocationCity, state: LocationState): void => {
      setFormData(prev => ({
        ...prev,
        city: city.name,
        state: state.isoCode,
        location: `${city.name}, ${state.name}`
      }));
      
      // Hide dropdown after selection
      setIsDropdownVisible(false);
    };
  
    // Handle click outside to close dropdown
    const handleClickOutside = () => {
      setIsDropdownVisible(false);
    };
  

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();

  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const [isCurrentJob, setIsCurrentJob] = useState(false);

  // Convert "MMM YYYY" to "YYYY-MM-DD" format
  const convertToInputDate = (dateStr: string | number | Date) => {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return ''; // Invalid date
      return date.toISOString().split('T')[0];
    } catch {
      return '';
    }
  };

  // Parse initial date range on component mount
  useEffect(() => {
    if (initialData?.startDate) {
      const [startStr, endStr] = initialData.startDate.split(' - ');
      setIsCurrentJob(endStr === 'Present');
      
      // Set initial dates
      const startDate = new Date(startStr);
      if (!isNaN(startDate.getTime())) {
        const startInputElement = document.getElementById('startDate') as HTMLInputElement;
        if (startInputElement) {
          startInputElement.value = convertToInputDate(startStr);
        }
      }

      if (endStr && endStr !== 'Present') {
        const endDate = new Date(endStr);
        if (!isNaN(endDate.getTime())) {
          const endInputElement = document.getElementById('endDate') as HTMLInputElement;
          if (endInputElement) {
            endInputElement.value = convertToInputDate(endStr);
          }
        }
      }
    }
  }, [initialData]);

  const handleStartDateChange = (e: { target: { value: string | number | Date; }; }) => {
    const startDate = new Date(e.target.value);
    const formattedStartDate = startDate.toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric'
    });
    
    const currentEndDate = formData.startDate.split(' - ')[1] || 'Present';
    setFormData(prev => ({
      ...prev,
      date: `${formattedStartDate} - ${currentEndDate}`
    }));
  };

  const handleEndDateChange = (e: { target: { value: string | number | Date; }; }) => {
    const startDate = formData.startDate.split(' - ')[0];
    const endDate = e.target.value ? 
      new Date(e.target.value).toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric'
      }) : 'Present';

    setFormData(prev => ({
      ...prev,
      date: `${startDate} - ${endDate}`
    }));
  };

  const handleCurrentJobChange = (e: { target: { checked: boolean | ((prevState: boolean) => boolean); }; }) => {
    setIsCurrentJob(e.target.checked);
    const startDate = formData.startDate.split(' - ')[0];
    setFormData(prev => ({
      ...prev,
      date: `${startDate} - ${e.target.checked ? 'Present' : ''}`
    }));
  };


  const organizations = [
    "Nizam's Institute of Medical Sciences (NIMS)",
    "Apollo Hospitals, Hyderabad",
    "Care Hospitals, Banjara Hills",
    "Yashoda Hospitals, Secunderabad",
    "KIMS Hospitals, Secunderabad",
    "Continental Hospitals, Gachibowli",
    "Sunshine Hospitals, Paradise",
    "Basavatarakam Indo-American Cancer Hospital",
    "AIG Hospitals, Gachibowli",
    "LV Prasad Eye Institute",
    "Medicover Hospitals, Hyderabad",
    "MaxCure Hospitals, Madhapur",
    "Global Hospitals, Hyderabad",
    "Asian Institute of Gastroenterology (AIG)",
    "Osmania General Hospital",
    "Gandhi Hospital, Secunderabad"
  ];


  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`${isEditing ? 'Edit' : 'Add'} Experience`}>
      <form onSubmit={handleSubmit} className="space-y-3 overflow-y-auto no-scrollbar max-h-[calc(100vh-12rem)]">
      <div className="mb-4">
          <div className="flex items-center bg-yellow-100 opacity-80 p-1 justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">Notify followers</label>
              <p className="text-xs text-gray-500">Turn on to let your followers know about this award</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="notifyFollowers"
                className="sr-only peer"
                checked={formData.notifyFollowers}
                onChange={(e) => setFormData(prev => ({ ...prev, notifyFollowers: e.target.checked }))}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-maincl"></div>
            </label>
          </div>
        </div>
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-fillc  focus:outline-none"
          />
        </div>


        <div>
          <label htmlFor="institution" className="block text-sm font-medium text-gray-700">
            Organization
          </label>
          <input
            type="text"
            id="organisation"
            name="organisation"
            value={formData.organisation}
            onChange={(e) => {
              setFormData(prev => ({ ...prev, organisation: e.target.value }));
              setIsDropdownVisible1(true);
            }}
            required
            className="mt-1 block w-full rounded-md p-2 border border-gray-300 shadow-sm focus:border-fillc focus:outline-none"
          />
          {isDropdownVisible1 && formData.organisation && (
            <div className="absolute z-10 max-w-xl w-full max-h-60 overflow-y-auto bg-white border border-gray-300 rounded-md shadow-lg mt-1">
              {organizations
          .filter(org => org.toLowerCase().includes(formData.organisation.toLowerCase()))
          .map((org, index) => (
            <div
              key={index}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                setFormData(prev => ({ ...prev, organisation: org }));
                setIsDropdownVisible1(false);
              }}
            >
              {org}
            </div>
          ))}
            </div>
          )}
        </div>

        <div className="relative">
      <label htmlFor="location" className="block text-sm font-medium text-gray-700">
        Location
      </label>
      <input
        type="text"
        placeholder="Enter city name"
        name="location"
        value={formData.city ? 
          `${formData.city}${formData.state ? ', ' + State.getStateByCodeAndCountry(formData.state, 'IN')?.name : ''}` : 
          formData.location || ''
        }
        onChange={handleInputChange}
        onFocus={() => setIsDropdownVisible(true)}
        className="mt-1 p-2 w-full rounded-md border border-gray-300 shadow-sm focus:border-fillc focus:outline-none"
      />
      {isDropdownVisible && formData.city && (
        <div 
          className="absolute z-10 w-full max-h-60 overflow-y-auto bg-white border border-gray-300 rounded-md shadow-lg mt-1"
          onBlur={handleClickOutside}
        >
          {State.getStatesOfCountry('IN').flatMap(state =>
            City.getCitiesOfState('IN', state.isoCode)
              .filter(city => 
                city.name.toLowerCase().includes((formData.city || '').toLowerCase())
              )
              .map(city => (
                <div
                  key={`${city.name}-${state.isoCode}`}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleLocationSelect(city, state)}
                >
                  {`${city.name}, ${state.name}`}
                </div>
              ))
          )}
        </div>
      )}
    </div>
        
    <div>
      <label htmlFor="date" className="block text-sm font-medium text-gray-700">
        Date Range
      </label>
      <div className="flex items-start space-x-2">
        <input
          type="date"
          id="startDate"
          name="startDate"
          onChange={handleStartDateChange}
          className="mt-1 p-2 flex-1 rounded-md border border-gray-300 shadow-sm focus:border-fillc focus:outline-none"
        />
        <span className="text-gray-500 pt-2">to</span>
        <div className="flex-1">
          <input
            type="date"
            id="endDate"
            name="endDate"
            onChange={handleEndDateChange}
            disabled={isCurrentJob}
            className="mt-1 p-2 w-full rounded-md border border-gray-300 shadow-sm focus:border-fillc focus:outline-none"
          />
          <label className="flex items-center mt-1">
            <input
              type="checkbox"
              checked={isCurrentJob}
              onChange={handleCurrentJobChange}
              className="mr-2"
            />
            <span className="text-sm text-gray-600">Currently working here</span>
          </label>
        </div>
      </div>
    </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-fillc  focus:outline-none"
          />
        </div>
        {formData.organisation && !organizations.includes(formData.organisation) && (
          <div>
            <label htmlFor="img" className="block text-sm font-medium text-gray-700">
              Company Logo
            </label>
            <div className="mt-1 flex items-center space-x-4">
              <div className="w-20 h-20 border-2 border-gray-300 rounded-lg overflow-hidden relative">
          {formData.img ? (
            <>
              <img
                src={typeof formData.img === 'string' ? formData.img : URL.createObjectURL(formData.img)}
                alt="Company logo preview"
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, img: '' }))}
                className="absolute top-1 right-1 bg-gray-800 bg-opacity-50 rounded-full p-1 hover:bg-opacity-70"
              >
                <svg
            className="h-4 w-4 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
                >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
                </svg>
              </button>
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-50">
              <svg
                className="h-8 w-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}
              </div>
              <div className="flex-1">
          <input
            type="file"
            id="img"
            name="img"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setFormData((prev) => ({ ...prev, img: file }));
              }
            }}
            className="hidden"
          />
          <label
            htmlFor="img"
            className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Choose Image
          </label>
              </div>
            </div>
          </div>
        )}
        
        
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose }
            
            className="px-4 py-2 text-sm font-medium text-maincl bg-gray-100 border border-gray-300 rounded-3xl hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-maincl border border-transparent rounded-3xl hover:bg-fillc"
          >
            {isEditing ? 'Save Changes' : 'Add Experience'}
          </button>
          
        </div>
      </form>
    </Modal>
  );
};

export default ExperienceForm;
