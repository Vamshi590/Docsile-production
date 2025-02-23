import React, { useState } from 'react';
import Modal from '../../common/Modal';

interface EducationFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: EducationFormData) => void;
  initialData?: EducationFormData;
  isEditing?: boolean;
}

export interface EducationFormData {
  schoolName: string;
  degree: string;
  department?: string;
  startDate: string;
  logo: string | File;
  notifyFollowers: boolean;
  grade?: string;
}

const EducationForm: React.FC<EducationFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isEditing = false,
}) => {
  const [formData, setFormData] = useState<EducationFormData>(
    initialData || {
      schoolName: '',
      degree: '',
      department: '',
      startDate: '',
      grade: '',
      logo: '',
      notifyFollowers: false,
    }
    
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const institutions = [
    "All India Institute of Medical Sciences (AIIMS), New Delhi",
    "Post Graduate Institute of Medical Education and Research (PGIMER), Chandigarh",
    "Christian Medical College (CMC), Vellore",
    "National Institute of Mental Health and Neurosciences (NIMHANS), Bengaluru",
    "Armed Forces Medical College (AFMC), Pune",
    "Maulana Azad Medical College (MAMC), New Delhi",
    "Jawaharlal Institute of Postgraduate Medical Education and Research (JIPMER), Puducherry",
    "King George’s Medical University (KGMU), Lucknow",
    "Institute of Medical Sciences, Banaras Hindu University (IMS-BHU), Varanasi",
    "St. John’s Medical College, Bengaluru",
    "Grant Medical College, Mumbai",
    "Seth GS Medical College and KEM Hospital, Mumbai",
    "Madras Medical College (MMC), Chennai",
    "Dr. D. Y. Patil Medical College, Pune",
    "Kasturba Medical College (KMC), Manipal"
  ];

  const Departments = [
    "Anatomy",
    "Physiology",
    "Biochemistry",
    "Pharmacology",
    "Pathology",
    "Microbiology",
    "Forensic Medicine",
    "Community Medicine",
    "General Medicine",
    "Pediatrics",
    "Dermatology",
    "Psychiatry",
    "General Surgery",
    "Orthopedics",
    "Ophthalmology",
    "Otorhinolaryngology (ENT)",
    "Anesthesiology",
    "Radiology",
    "Obstetrics and Gynecology",
    "Cardiology",
    "Neurology",
    "Nephrology",
    "Endocrinology",
    "Gastroenterology",
    "Pulmonology",
    "Urology",
    "Oncology",
    "Plastic Surgery",
    "Emergency Medicine"
  ];
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [isDepDropdownVisible, setIsDepDropdownVisible] = useState(false);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`${isEditing ? 'Edit' : 'Add'} Education`}>
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
        <div>
          <label htmlFor="schoolName" className="block text-sm font-medium text-gray-700">
            Institution
          </label>
          <input
            type="text"
            id="schoolName"
            name="schoolName"
            value={formData.schoolName}
            onChange={(e) => {
              setFormData(prev => ({ ...prev, schoolName: e.target.value }));
              setIsDropdownVisible(true);
            }}
            required
            className="mt-1 block w-full rounded-md p-2 border border-gray-300 shadow-sm focus:border-fillc focus:outline-none"
          />
          {isDropdownVisible && formData.schoolName && (
            <div className="absolute z-10 max-w-xl w-full max-h-60 overflow-y-auto bg-white border border-gray-300 rounded-md shadow-lg mt-1">
              {institutions
          .filter(org => org.toLowerCase().includes(formData.schoolName.toLowerCase()))
          .map((org, index) => (
            <div
              key={index}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                setFormData(prev => ({ ...prev, schoolName: org }));
                setIsDropdownVisible(false);
              }}
            >
              {org}
            </div>
          ))}
            </div>
          )}
        </div>

        <div>
          <label htmlFor="degree" className="block text-sm font-medium text-gray-700">
            Degree
          </label>
          <input
            type="text"
            id="degree"
            name="degree"
            value={formData.degree}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md p-2 border border-gray-300 shadow-sm focus:border-fillc focus:outline-none"
          />
        </div>

          <div>
            <label htmlFor="department" className="block text-sm font-medium text-gray-700">
              Department
            </label>
            <input
              type="text"
              id="department"
              name="department"
              value={formData.department}
              onChange={(e) => {
                setFormData(prev => ({ ...prev, department: e.target.value }));
                setIsDepDropdownVisible(true);
              }}
              required
              className="mt-1 block w-full rounded-md p-2 border border-gray-300 shadow-sm focus:border-fillc focus:outline-none"
            />
            {isDepDropdownVisible && formData.department && (
              <div className="absolute z-10 max-w-xl  w-full max-h-60 overflow-y-auto  bg-white border border-gray-300 rounded-md shadow-lg mt-1">
                {Departments 
                  .filter(dept => dept.toLowerCase().includes(formData.department?.toLowerCase() || ''))
                  .map((dept, index) => (
                    <div
                      key={index}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        setFormData(prev => ({ ...prev, department: dept }));
                        setIsDepDropdownVisible(false);
                      }}
                    >
                      {dept}
                    </div>
                  ))}
              </div>
            )}
          </div>

          <div>
            <label htmlFor="grade" className="block text-sm font-medium text-gray-700">
              Grade (optional)
            </label>
            <input
              type="text"
              id="grade"
              name="grade"
              value={formData.grade}
              onChange={handleChange}
              placeholder="Enter your grade or CGPA"
              className="mt-1 block w-full rounded-md p-2 border border-gray-300 shadow-sm focus:border-fillc focus:outline-none"
            />
          </div>
          
          
        <div>
          <label htmlFor="year" className="block text-sm font-medium text-gray-700">
            Year 
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="number"
              id="startYear"
              name="startYear"
              min="1900"
              max="2099"
              placeholder="Start Year"
              value={formData.startDate.split(' - ')[0] || ''}
              onChange={(e) => {
          const [, endDate] = formData.startDate.split(' - ');
          const newYear = `${e.target.value}${endDate ? ' - ' + endDate : ''}`;
          setFormData(prev => ({ ...prev, startDate: newYear }));
              }}
              className="mt-1 block w-full rounded-md p-2 border border-gray-300 shadow-sm focus:border-fillc focus:outline-none"
            />
            <span className="text-gray-500">to</span>
            <input
              type="number"
              id="endYear"
              name="endYear"
              min="1900"
              max="2099"
              placeholder="End Year"
              value={formData.startDate.split(' - ')[1] || ''}
              onChange={(e) => {
          const [startDate] = formData.startDate.split(' - ');
          const newYear = `${startDate}${e.target.value ? ' - ' + e.target.value : ''}`;
          setFormData(prev => ({ ...prev, startDate: newYear }));
              }}
              className="mt-1 block w-full rounded-md p-2 border border-gray-300 shadow-sm focus:border-fillc focus:outline-none"
            />
          </div>
        </div>

        {formData.schoolName && !institutions.includes(formData.schoolName) && (
        <div>
          <label htmlFor="logo" className="block text-sm font-medium text-gray-700">
            Institution Logo
          </label>
          <div className="mt-1 flex items-center space-x-4">
            <div className="flex-shrink-0 relative">
              {formData.logo ? (
          <>
            <img
              src={typeof formData.logo === 'string' ? formData.logo : URL.createObjectURL(formData.logo)}
              alt="Preview"
              className="h-20 w-20 object-cover rounded-md"
            />
            <button
              type="button"
              onClick={() => setFormData((prev) => ({ ...prev, logo: '' }))}
              className="absolute -top-2 -right-2 w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center text-white hover:bg-gray-700 focus:outline-none"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </>
              ) : (
          <div className="h-20 w-20 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center bg-gray-50">
            <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
              )}
            </div>
            <div className="flex-grow">
              <input
          type="file"
          id="logo"
          name="logo"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              setFormData(prev => ({ ...prev, logo: file }));
            }
          }}
          className="hidden"
              />
              <label
          htmlFor="logo"
          className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
              >
          Upload Logo
              </label>
            </div>
          </div>
        </div>
        )}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-maincl bg-white border border-gray-300 rounded-3xl hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-maincl border border-transparent rounded-3xl hover:bg-fillc"
          >
            {isEditing ? 'Save Changes' : 'Add Education'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EducationForm;
