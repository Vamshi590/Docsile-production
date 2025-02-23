import React, { useEffect, useState } from 'react';
import Modal from '../../common/Modal';

interface MembershipFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: MembershipFormData) => void;
  initialData?: MembershipFormData;
  isEditing?: boolean;
}

export interface MembershipFormData {
  name: string;
  category: string;
  position?: string;
  membershipId?: string;
  notifyFollowers: boolean;
}

const MembershipForm: React.FC<MembershipFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isEditing = false,
}) => {
  const [formData, setFormData] = useState<MembershipFormData>(
    initialData|| {
    name: '',
    category: '',
    position: '',
    membershipId: '',
    notifyFollowers: false,
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

 
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const dropdown = document.getElementById('suggestions-dropdown');
      if (dropdown && !dropdown.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);


  const medicalCategories = [
    "Ophthalmology",
    "Cardiology",
    "Neurology",
    "Orthopedics",
    "Dermatology",
    "Gastroenterology",
    "Pulmonology",
    "Endocrinology",
    "Oncology",
    "Nephrology"
  ];
  const medicalSocieties = [
    "Indian Medical Association", 
    "Medical Council of India",
    "Indian Dental Association",
    "Association of Physicians of India",
    "Cardiological Society of India",
    "Indian Academy of Pediatrics",
    "Indian Orthopaedic Association",
  ];

  const membershipPositions = [
    "President",
    "Vice President",
    "Secretary",
    "Treasurer",
    "Chairman of the Scientific Committee",
    "Editor of Publications",
    "Committee Members",
    "Past President",
    "Past Vice President",
    "Past Secretary",
    "Past Treasurer",
    "Past Chairman of the Scientific Committee",
    "Past Editor of Publications",
    "Past Committee Members"
  ];

  const filteredSocieties = medicalSocieties.filter(society =>
    society.toLowerCase().includes(searchTerm.toLowerCase())
  );
  // const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0];
  //   if (file) {
  //     setFormData(prev => ({
  //       ...prev,
  //       image: file,
  //       imagePreview: URL.createObjectURL(file)
  //     }));
  //   }
  // };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

 
  

 
  return (
    <Modal isOpen={isOpen} onClose={onClose}  title={`${isEditing ? 'Edit' : 'Add'} Membership`}>
      <form onSubmit={handleSubmit} className="space-y-6">
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
            {/* Organization Name with Suggestions */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1 pt-2">
                Organization Name
              </label>
              <input
                type="text"
                value={initialData?.name || formData.name}
                placeholder='Search Society'
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setFormData(prev => ({ ...prev, name: e.target.value }));
                  
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                className="w-full rounded-md border border-gray-300 px-3 py-2"
              />
              {showSuggestions && searchTerm && (
                <div className="absolute z-10 w-full mt-1 text-gray-800 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                  {filteredSocieties.map((society, index) => (
                    <div
                      key={index}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-800"
                      onClick={() => {
                        setSearchTerm(society);
                        setFormData(prev => ({ ...prev, name: society }));
                        setShowSuggestions(false);
                      }}
                    >
                      {society}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Category Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="w-full rounded-md border border-gray-300 text-gray-800 px-3 py-2"
              >
                <option value="">Select Category</option>
                {medicalCategories.map((category, index) => (
                  <option key={index} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

           {/* membership postion */}
          
              <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Position
              </label>
              <select
                name="position"
                value={formData.position}
                onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
                className="w-full rounded-md border border-gray-300 text-gray-800 px-3 py-2"
              >
                <option value="">Select position</option>
                {membershipPositions.map((position, index) => (
                  <option key={index} value={position}>
                    {position}
                  </option>
                ))}
              </select>
            </div>





              {/* membership Id (optional) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Membership ID <span>(optional)</span> 
                </label>
                <input
                  type="text"
                  value={formData.membershipId}
                  placeholder='eg. C123456'
                  onChange={(e) => setFormData(prev => ({ ...prev, membershipId: e.target.value }))}
                  className="w-full rounded-md border border-gray-300 px-3 py-2"
                />    
                <span className='text-xs text-gray-500'> (**This will not be visible to everyone and is only used for verification purposes.)</span>
              </div>

            <div className="flex justify-end space-x-2 mt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-1 rounded-3xl border text-maincl bg-gray-100 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-1 bg-maincl text-white rounded-3xl hover:bg-fillc"
                disabled={!formData.name || !formData.category || !formData.position}
              >
                Save
              </button>
            </div>
          </form>
    </Modal>
  );
};

export default MembershipForm;
