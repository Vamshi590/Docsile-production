import React, { useEffect, useState } from 'react';
import Modal from '../../common/Modal';

interface CertificationFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CertificationFormData) => void;
  initialData?: CertificationFormData;
  isEditing?: boolean;
}

export interface CertificationFormData {
  issuingOrganisation: any;
  certificateName: any;
  issueDate: string;
  expiryDate?: string;
  credentialId?: string;
  credentialUrl?: string;
  logo?: string | File;
  notifyFollowers?: boolean;
}

const emptyFormData: CertificationFormData = {
  certificateName: '',
  issuingOrganisation: '',
  issueDate: '',
  expiryDate: '',
  credentialId: '',
  credentialUrl: '',
  logo: '',
  notifyFollowers: false
};

const CertificationForm: React.FC<CertificationFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isEditing = false,
}) => {
  const [formData, setFormData] = useState<CertificationFormData>(emptyFormData);
  const [isMounted, setIsMounted] = useState(false);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  useEffect(() => {
    if (isOpen && !isMounted) {
      if (isEditing && initialData) {
        setFormData(initialData);
      } else {
        setFormData(emptyFormData);
      }
      setIsMounted(true);
    }
    if (!isOpen) {
      setIsMounted(false);
    }
  }, [isOpen, isEditing, initialData, isMounted]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    console.log(formData);
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };


  const organizations = [
    "Medical Council of India (MCI)",
    "National Medical Commission (NMC)",
    "Indian Medical Association (IMA)",
    "Pharmacy Council of India (PCI)",
    "Dental Council of India (DCI)"
  ];


  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`${isEditing ? 'Edit' : 'Add'} License & Certification`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="mb-4">
          <div className="flex items-center bg-yellow-100 opacity-80 p-1 justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">Notify followers</label>
              <p className="text-xs text-gray-500">Turn on to let your followers know about this certification</p>
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
          <label htmlFor="certificateName" className="block text-sm font-medium text-gray-700">
            Certification Name
          </label>
          <input
            type="text"
            id="certificateName"
            name="certificateName"
            value={formData.certificateName}
            placeholder="e.g. opthomology certification"
            onChange={handleChange}
            required
            className="mt-1 p-2 block w-full text-gray-800 rounded-xl border border-gray-300 shadow-sm focus:border-fillc focus:outline-none"
          />
        </div>

        <div className="relative">
          <label htmlFor="issuingOrganisation" className="block text-sm font-medium text-gray-700">
          Issuing Organization
          </label>
          <input
            type="text"
            id="issuingOrganisation"
            name="issuingOrganisation"
            value={formData.issuingOrganisation}
            onChange={(e) => {
              setFormData(prev => ({ ...prev, issuingOrganisation: e.target.value }));
              setIsDropdownVisible(true);
            }}
            required
            className="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-fillc focus:outline-none"
          />
          {isDropdownVisible && formData.issuingOrganisation && (
            <div className="absolute z-10 w-full max-h-60 overflow-y-auto bg-white border border-gray-300 rounded-md shadow-lg mt-1">
              {organizations
          .filter(org => org.toLowerCase().includes(formData.issuingOrganisation.toLowerCase()))
          .map((org, index) => (
            <div
              key={index}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                setFormData(prev => ({ ...prev, issuingOrganisation: org }));
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
          <label htmlFor="issueDate" className="block text-sm font-medium text-gray-700">
            Issue Date
          </label>
          <input
            type="date"
            id="issueDate"
            name="issueDate"
            value={formData.issueDate}
            onChange={handleChange}
            required
            className="mt-1 p-2 block w-full text-gray-800 rounded-xl border border-gray-300 shadow-sm focus:border-fillc focus:outline-none"
          />
        </div>

        

        

        <div>
          <label htmlFor="credentialUrl" className="block text-sm font-medium text-gray-700">
            Credential URL (Optional)
          </label>
          <input
            type="url"
            id="credentialUrl"
            name="credentialUrl"
            value={formData.credentialUrl}
            placeholder="https://"
            onChange={handleChange}
            className="mt-1 p-2 block w-full text-gray-800 rounded-xl border border-gray-300 shadow-sm focus:border-fillc focus:outline-none"
          />
        </div>


        {formData.issuingOrganisation && !organizations.includes(formData.issuingOrganisation) && (
        <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-700">
            Organization Logo
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
                onClick={() => setFormData((prev) => ({ ...prev, logo: undefined }))}
                className="absolute -top-2 -right-2 w-6 h-6 bg-gray-500 rounded-full flex items-center justify-center text-white hover:bg-gray-600"
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
              id="image"
              name="image"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                setFormData(prev => ({ 
                  ...prev, 
                  logo: file,
                  logoPreview: URL.createObjectURL(file)
                }));
                }
              }}
              
              className="hidden"
              />
              <label
              htmlFor="image"
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
            className="px-4 py-2 text-sm rounded-3xl text-maincl bg-gray-100 border border-gray-400 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm rounded-3xl text-white bg-maincl border border-transparent hover:bg-fillc"
          >
            {isEditing ? 'Save Changes' : 'Add Certification'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CertificationForm;
