import React, { useEffect, useState } from 'react';
import Modal from '../../common/Modal';

interface AwardFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: AwardFormData) => void;
  initialData?: AwardFormData;
  isEditing?: boolean;
}

export interface AwardFormData {
  title: string;
  organization: string;
  year: string;
  description: string;
  credentialLink?: string;
  notifyFollowers?: boolean;
}
const emptyFormData: AwardFormData = {

  title: '',

  organization: '',

  year: '',

  description: '',

  credentialLink: '',

  notifyFollowers: false

};

const AwardForm: React.FC<AwardFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isEditing = false,
}) => {
  const [formData, setFormData] = useState<AwardFormData>(emptyFormData);

  const [isMounted, setIsMounted] = useState(false);

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Modal isOpen={isOpen}  onClose={onClose} title={`${isEditing ? 'Edit' : 'Add'} Award and Achievements`}>
      <form onSubmit={handleSubmit} className="space-y-4">
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
            Award Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            placeholder='e.g. award for best performance'
            onChange={handleChange}
            required
            className="mt-1 p-2 block w-full text-gray-800 rounded-xl border border-gray-300 shadow-sm  focus:border-fillc  focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="organization" className="block text-sm font-medium text-gray-700">
            Organization
          </label>
          <input
            type="text"
            id="organization"
            name="organization"
            placeholder='e.g. opthalmology society'
            value={formData.organization}
            onChange={handleChange}
            required
            className="mt-1 p-2 block w-full text-gray-800 rounded-xl border border-gray-300 shadow-sm focus:border-fillc  focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="year" className="block text-sm font-medium text-gray-700">
            Year
          </label>
          <select
            id="year"
            name="year"
            value={formData.year}
            onChange={handleChange}
            required
            className="mt-1 block w-full p-2 text-gray-800 rounded-xl border border-gray-300 shadow-sm focus:border-fillc focus:outline-none"
          >
            <option value="">Select year</option>
            {Array.from({ length: 100 }, (_, i) => {
              const year = new Date().getFullYear() - i;
              return (
          <option key={year} value={year}>
            {year}
          </option>
              );
            })}
          </select>
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
            className="mt-1 block w-full p-2 text-gray-800 rounded-md border border-gray-300 shadow-sm focus:border-fillc  focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="credentialLink" className="block text-sm font-medium text-gray-700">
            Credential Link (Optional)
          </label>
          <input
            type="url"
            id="credentialLink"
            name="credentialLink"
            value={formData.credentialLink}
            onChange={handleChange}
            className="mt-1 block w-full p-2 text-gray-800  rounded-xl border border-gray-300 shadow-sm focus:border-fillc  focus:outline-none"
          />
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-3xl  text-maincl bg-gray-100 border border-gray-400  hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm rounded-3xl  text-white bg-maincl border border-transparent  hover:bg-fillc"
          >
            {isEditing ? 'Save Changes' : 'Add Award'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AwardForm;
