import React, { useState } from 'react';
import Modal from '../../common/Modal';

interface InterestFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: InterestFormData) => void;
  initialData?: InterestFormData;
  isEditing?: boolean;
}

export interface InterestFormData {
  id?: string;
  skill: string;
  notifyFollowers: boolean;
}

const InterestForm: React.FC<InterestFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isEditing = false,
}) => {
  const [formData, setFormData] = useState<InterestFormData>(
    initialData || {
      skill: '',
      notifyFollowers: false,
    }
  );
  

  const handleClose = () => {
    setFormData({
      skill: '',
      notifyFollowers: false,
    });
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={`${isEditing ? 'Edit' : 'Add'} Skills`}>
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
        <div className='pt-4 pb-8'>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Interest Name
          </label>
          <input
            type="text"
            id="skill"
            name="skill"
            value={formData.skill}
            onChange={handleChange}
            required
            className="mt-1 block w-full p-3 rounded-lg border  border-gray-300 shadow-sm focus:outline-none focus:border-fillc"
            placeholder="e.g., Ophthalmology Research"
          />
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-sm font-medium text-maincl  bg-gray-100 border border-gray-300 rounded-3xl hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-maincl border border-transparent rounded-3xl hover:bg-fillc"
          >
            {isEditing ? 'Save Changes' : 'Add Skill'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default InterestForm;
