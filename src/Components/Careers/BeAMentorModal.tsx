import React, { useState } from 'react';
import { X, Check } from 'lucide-react';

interface BeAMentorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormData {
  fullName: string;
  email: string;
  contactNumber: string;
  resume: File | null;
  jobTitle: string;
  employmentType: string;
  companyName: string;
  isCurrentlyWorking: boolean;
  startDate: string;
  location: string;
}

export const BeAMentorModal: React.FC<BeAMentorModalProps> = ({ isOpen, onClose }) => {
  const initialFormState: FormData = {
    fullName: '',
    email: '',
    contactNumber: '',
    resume: null,
    jobTitle: '',
    employmentType: 'Full Time',
    companyName: '',
    isCurrentlyWorking: false,
    startDate: '',
    location: ''
  };

  const [formData, setFormData] = useState<FormData>(initialFormState);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({
        ...prev,
        resume: e.target.files![0]
      }));
    }
  };

  const handleReset = () => {
    setFormData(initialFormState);
    // Also reset the file input
    const fileInput = document.getElementById('resume-upload') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Here you would typically send the data to your backend
    // For now, we'll just show the success message
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      onClose();
      handleReset();
    }, 3000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      {showSuccess ? (
        <div className="bg-white rounded-lg p-6 max-w-md w-full relative">
          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-maincl rounded-full flex items-center justify-center mb-4">
              <Check className="w-8 h-8 text-white " />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Application was successfully sent to
            </h3>
            <p className="text-gray-900 font-medium mb-4">
              Bhaktivedanta Hospital & Research Institute
            </p>
            <p className="text-sm text-gray-600">
              Thank you for applying!
            </p>
            <p className="text-sm text-gray-600">
              Check your messages frequently for updates
            </p>
            <p className="text-sm text-gray-600">
              and the next steps in the Mentor approval process.
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg p-6 max-w-3xl w-full relative max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex justify-between items-center px-6 py-4 border-b">
            <h2 className="text-lg  text-maincl font-medium">Be a Mentor</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-4">
            {/* Basic Info */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1.5">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                    placeholder="enter your name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1.5">Email address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                    placeholder="enter your email"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1.5">Contact Number</label>
                <input
                  type="tel"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="enter your contact number"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1.5">Resume</label>
                <div className="relative">
                  <input
                    type="file"
                    onChange={handleFileChange}
                    accept=".pdf"
                    className="hidden"
                    id="resume-upload"
                  />
                  {formData.resume ? (
                    <div className="flex items-center space-x-2 p-2 bg-gray-50 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-2 flex-1">
                        <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded text-xs font-medium uppercase">PDF</span>
                        <span className="text-sm text-gray-600 truncate">{formData.resume.name}</span>
                      </div>
                      <span className="text-xs text-gray-400">{Math.round(formData.resume.size / 1024)}KB</span>
                    </div>
                  ) : (
                    <label
                      htmlFor="resume-upload"
                      className="flex items-center justify-center p-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500"
                    >
                      <div className="text-center">
                        <p className="text-sm text-gray-500">Upload your resume (PDF)</p>
                        <p className="text-xs text-gray-400 mt-1">Max file size: 5MB</p>
                      </div>
                    </label>
                  )}
                </div>
              </div>
            </div>

            {/* Professional Experience */}
            <div className="mt-6">
              <h3 className="font-medium mb-4">Professional Experience</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1.5">Job Title</label>
                    <input
                      type="text"
                      name="jobTitle"
                      value={formData.jobTitle}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                      placeholder="enter your job title"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1.5">Employment Type</label>
                    <select
                      name="employmentType"
                      value={formData.employmentType}
                      onChange={(e) => setFormData(prev => ({ ...prev, employmentType: e.target.value }))}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                    >
                      <option value="Full Time">Full Time</option>
                      <option value="Part Time">Part Time</option>
                      <option value="Contract">Contract</option>
                      <option value="Internship">Internship</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1.5">Company Name</label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                    placeholder="enter your company name"
                    required
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="isCurrentlyWorking"
                    checked={formData.isCurrentlyWorking}
                    onChange={handleInputChange}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    id="currently-working"
                  />
                  <label htmlFor="currently-working" className="text-sm text-gray-600">
                    I am currently working here
                  </label>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1.5">Start Date</label>
                    <input
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 text-gray-500 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1.5">Location</label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                      placeholder="Mumbai, Maharashtra, India"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-between space-x-3 mt-8 pt-4 border-t sticky bottom-0 bg-white">
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900 font-medium"
              >
                reset
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-maincl text-white text-sm font-medium rounded-lg hover:bg-fillc focus:outline-none focus:ring-2 focus:ring-main  focus:ring-offset-2"
              >
                Apply
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};