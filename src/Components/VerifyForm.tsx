import React, { useState, useRef, FormEvent } from 'react';
import { X, Calendar, Upload } from 'lucide-react';
import upload from "../assets/icon/upload.svg"
import { useNavigate } from 'react-router-dom';
import verifysent from '../assets/icon/verifysent.svg';
import { toast } from 'sonner';
import axios from 'axios';
interface VerifyFormProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormData {
  name: string;
  studentId: string;
  collegeName: string;
  graduationYear: string;
  studentIdFile: File | null;
}

type FormErrors = {
  [K in keyof FormData]?: string;
};

const VerifyForm: React.FC<VerifyFormProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    studentId: '',
    collegeName: '',
    graduationYear: '',
    studentIdFile: null,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [filePreview, setFilePreview] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear + i);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.studentId.trim()) newErrors.studentId = 'Student ID is required';
    if (!formData.collegeName.trim()) newErrors.collegeName = 'College name is required';
    if (!formData.graduationYear) newErrors.graduationYear = 'Graduation year is required';
    if (!formData.studentIdFile) newErrors.studentIdFile = 'Student ID file is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, studentIdFile: 'File size must be less than 10MB' }));
        return;
      }
      if (!['image/jpeg', 'image/png'].includes(file.type)) {
        setErrors(prev => ({ ...prev, studentIdFile: 'Only JPG/PNG files are accepted' }));
        return;
      }
      
      setFormData(prev => ({ ...prev, studentIdFile: file }));
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.studentIdFile;
        return newErrors;
      });
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const userid = localStorage.getItem('Id');


  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {

    e.preventDefault();
    if (!validateForm()) return;
  
    setIsSubmitting(true);
    const loading = toast.loading("Verifying student details");
  
  
    const promise = async () => {
      try {
        let imageURL = '';
  
        const idImage = formData.studentIdFile;
  
        // If there are photos, upload to S3 first
        if (idImage) {
          // Get presigned URLs for all photos
          const { data } = await axios.post(`https://128i1lirkh.execute-api.ap-south-1.amazonaws.com/dev/uploads/multiple`, {
            fileCount: 1,
            fileTypes: [idImage.type],
            id: userid,
            type: "studentId"
          });
  
  
          console.log(data);
  
          // Upload the photo - get the first URL from the array since we only requested one
          const uploadResponse = await axios.put(data.urls[0].uploadURL, idImage, {
            headers: {
              'Content-Type': idImage.type
            },
            withCredentials: false
          });
  
          if (uploadResponse.status !== 200) {
            throw new Error('Failed to upload photo');
          }
  
          imageURL = data.urls[0].imageURL || "";
        }
  
        const response = await axios.post(`https://128i1lirkh.execute-api.ap-south-1.amazonaws.com/dev/verify-student`, {
          name: formData.name,
          studentid: formData.studentId,
          collegeName: formData.collegeName,
          yearOfGraduation: formData.graduationYear,
          userId: userid ,
          idlink : imageURL
        },{withCredentials: true});
  
  
        console.log(response.data);
  
        if (response.data.error) {
          toast.dismiss(loading);
          toast.error(response.data.error);
        } else {
          toast.dismiss(loading);
          setSubmitStatus('success');
        }
  
  
      } catch (error) {
        toast.dismiss(loading);
        toast.error("Something went wrong. Please try again later");
        console.error("Error :", error);
      }finally {
        setIsSubmitting(false);
      }
    };
  
  
    toast.promise(promise(), {
      loading: 'submitting...',
      success: "submitted successfully",
       error: (err) => err.message
    });
  };

  const handleAgreeAndContinue = () => {
    navigate('/feed');
    onClose();
  };

  if (!isOpen) return null;

  

  if (submitStatus === 'success') {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 font-fontsm">
        <div className="bg-white rounded-2xl max-w-[400px]  text-center">
          <div className="flex justify-center mb-6 rounded-t-2xl bg-gradient-to-b  from-yellow-50 to-yellow-100">
            <img 
              src={verifysent} 
              alt="Verification Success" 
              className="w-68 h-44"
            />
          </div>
          <div className='px-8 pb-8'>

          <h2 className="text-lg font-medium mb-2">Verification request sent successfully!</h2>
          <p className="text-gray-600 text-sm mb-6">
            Verification is in process. You can post now. However, if your request gets rejected, your posts will automatically be deleted.
          </p>
          <button
            onClick={handleAgreeAndContinue}
            className="w-full bg-maincl hover:bg-fillc text-white py-2 rounded-3xl transition-colors"
            >
            Agree & Continue
          </button>
            </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 font-fontsm">
      <div className="bg-white rounded-xl max-w-[560px] lg:px-20 px-12 py-8 relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
          type="button"
        >
          <X size={20} />
        </button>

        <h2 className="text-base mb-2">Verify your Student ID</h2>
        <p className="text-fontlit text-gray-600 mb-5">
          Confirm your identity to access exclusive resources and opportunities tailored for medical students.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Name*"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className={`w-full p-3 text-sm font-light border rounded-lg focus:outline-none focus:ring-1 focus:ring-maincl ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          <div>
            <input
              type="text"
              placeholder="Student Identification number*"
              value={formData.studentId}
              onChange={(e) => setFormData(prev => ({ ...prev, studentId: e.target.value }))}
              className={`w-full p-3 text-sm font-light border rounded-lg focus:outline-none focus:ring-1 focus:ring-maincl ${
                errors.studentId ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.studentId && <p className="text-red-500 text-xs mt-1">{errors.studentId}</p>}
          </div>

          <div>
            <input
              type="text"
              placeholder="College name*"
              value={formData.collegeName}
              onChange={(e) => setFormData(prev => ({ ...prev, collegeName: e.target.value }))}
              className={`w-full p-3 text-sm font-light border rounded-lg focus:outline-none focus:ring-1 focus:ring-maincl ${
                errors.collegeName ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.collegeName && <p className="text-red-500 text-xs mt-1">{errors.collegeName}</p>}
          </div>

          <div className="relative">
            <select
              value={formData.graduationYear}
              onChange={(e) => setFormData(prev => ({ ...prev, graduationYear: e.target.value }))}
              className={`w-full p-3 text-sm font-light border rounded-lg focus:outline-none focus:ring-1 focus:ring-maincl appearance-none ${
                errors.graduationYear ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Year of Graduation*</option>
              {years.map((year) => (
                <option key={year} value={year.toString()}>{year}</option>
              ))}
            </select>
            <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
            {errors.graduationYear && <p className="text-red-500 text-xs mt-1">{errors.graduationYear}</p>}
          </div>

          <div
            className={`border-2 border-dashed rounded-lg p-4 text-center relative ${
              filePreview ? 'border-maincl bg-gray-50' : 'border-gray-300'
            } ${errors.studentIdFile ? 'border-red-500' : ''}`}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/jpeg,image/png"
              className="hidden"
            />
            
            {filePreview ? (
              <div className="relative">
                <img src={filePreview} alt="ID Preview" className="max-h-40 mx-auto rounded" />
                <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 hover:-inset-x-1 hover:text-white transition-all flex items-center justify-center">
                  <Upload className="text-transparent hover:text-white" size={32} />
                </div>
              </div>
            ) : (
              <>
              
                <div className='justify-center flex'><img src={upload} alt="" /></div>
                <div className="mb-2 text-sm">Upload Student ID*</div>
                <div className="text-xs text-gray-500">Upload a clear picture of your ID here</div>
                <div className="text-fontlit text-gray-400 mt-1">*Only JPG/PNG accepted</div>
                <div className="text-fontlit text-gray-400">Max 10 MB size</div>
              </>
            )}
            {errors.studentIdFile && <p className="text-red-500 text-xs mt-1">{errors.studentIdFile}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className='w-full py-2 rounded-3xl transition-colors relative bg-maincl hover:bg-fillc text-white'
          >              <span>Verify</span>
            {isSubmitting && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyForm;