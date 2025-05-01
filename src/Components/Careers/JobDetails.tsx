import React, { useState } from 'react';
import { JobCardProps } from './JobsCard';
import locations from "../../assets/icon/location.svg";
import money from "../../assets/icon/money.svg";
import save1 from "../../assets/icon/save1.svg";
import save2 from "../../assets/icon/save2.svg";
import calender from "../../assets/icon/date.svg";
import applicant from "../../assets/icon/applicant.svg";
import ReviewCard from './ReviewCard';

interface JobDetailsProps extends JobCardProps {
  job: {
    department: string;
    image: string;
    date: string;
    name: string;
    location: string;
    amount: string;
    startingDate: string;
    applyBy: string;
    numberOfApplicants: number;
    jobDescription: string;
    responsibilities: string[];
    requirements: string[];
    compensation: {
      salary: string;
      benefits: string[];
    };
    reviews?: {
      rating: number;
      count: number;
      items: Array<{
        name: string;
        rating: number;
        description: string;
        date: string;
        designation: string;
        avatar:string;
      }>;
    };
    faq?: {
      question: string;
      answer: string;
    }[];
  };
  onApply: (job: JobCardProps['job']) => void;
  onClose: () => void;
}

export const JobDetails: React.FC<JobDetailsProps> = ({
  job,
  onApply,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'description' | 'reviews' | 'faq'>('description');
  const [isSaved, setIsSaved] = useState(false);

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 font-fontsm">
      {/* Top Section with Save Button */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex justify-between items-start mb-4">
          <div className="flex gap-4">
            <img src={job.image} alt="" className="w-12 h-12 rounded-full object-cover" />
            <div>
              <h2 className="text-lg text-black">{job.department}</h2>
              <p className="text-sm text-gray-600">{job.name}</p>
              <p className="text-xs text-gray-500">{job.date}</p>
            </div>
          </div>
          <div className="flex gap-4">
            <img
              src={isSaved ? save2 : save1}
              onClick={() => setIsSaved(!isSaved)}
              alt=""
              className="cursor-pointer"
            />
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              ✕
            </button>
          </div>
        </div>

        {/* Basic Info */}
        <div className="flex flex-col gap-2 mb-4">
          <div className="flex items-center gap-2">
            <img src={locations} alt="" className="w-4" />
            <span className="text-sm text-gray-600">{job.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <img src={money} alt="" className="w-4" />
            <span className="text-sm text-gray-600">{job.amount}</span>
          </div>
        </div>

        {/* Starting Date and Apply By */}
        <div className="flex justify-between text-sm text-gray-600 mb-4">
          <div className="flex items-center gap-2">
            <img src={calender} alt="" className="w-4" />
            <div>
              <p className="font-medium">Starting Date</p>
              <p>{job.startingDate}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <img src={calender} alt="" className="w-4" />
            <div>
              <p className="font-medium">Apply By</p>
              <p>{job.applyBy}</p>
            </div>
          </div>
        </div>

        <div className='flex justify-between items-center mt-8'>

        {/* Applications Count */}
        <div className=" rounded-lg   gap-2 flex items-center">
          <img src={applicant} alt="" className='w-3' />
          <p className="text-sm text-gray-600">{job.numberOfApplicants} Applicants</p>
        </div>

        <div className='items-center'>
        <button   onClick={() => onApply(job)} className=" px-5 py-1  text-sm bg-maincl text-white rounded-2xl hover:bg-opacity-90 transition-colors">
            Apply
          </button>
        </div>
        </div>
      </div>

     

      {/* Tabs */}
      <div className="border-b border-gray-100">
        <div className="flex gap-4 px-4">
          <button
            onClick={() => setActiveTab('description')}
            className={`py-1 px-3 m-2 font-medium text-sm border-b-2 rounded-3xl transition-colors ${
              activeTab === 'description'
                ? 'border-maincl bg-fillc text-white'
                : 'border-transparent text-fillc hover:text-gray-700'
            }`}
          >
            Job Description
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`py-1 px-3 m-2  font-medium text-sm border-b-2 rounded-3xl transition-colors ${
              activeTab === 'reviews'
                ? 'border-maincl bg-fillc text-white'
                : 'border-transparent text-fillc hover:text-gray-700'
            }`}
          >
            Reviews
          </button>
          <button
            onClick={() => setActiveTab('faq')}
            className={`py-0.5 px-3 m-2  font-medium text-sm border-b-2 rounded-3xl transition-colors ${
              activeTab === 'faq'
                ? 'border-maincl bg-fillc text-white'
                : 'border-transparent text-fillc hover:text-gray-700'
            }`}
          >
            FAQ
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-4">
        {activeTab === 'description' && (
          <div className="space-y-6">
            <div>
              <p className="text-sm text-gray-600">{job.jobDescription}</p>
            </div>

            <div>
              <h3 className="font-medium text-fillc mb-2">Responsibilities</h3>
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-2">
                {job.responsibilities.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-medium text-fillc mb-2">Requirements</h3>
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-2">
                {job.requirements.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-medium text-fillc mb-2">Compensation and Benefits</h3>
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-2">
                <li>{job.compensation.salary}</li>
                {job.compensation.benefits.map((benefit, index) => (
                  <li key={index}>{benefit}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'reviews' && job.reviews && (
          <div className="space-y-4">
           
            <div className="space-y-4">
              {job.reviews.items && job.reviews.items.length > 0 ? (
                job.reviews.items.map((review, index) => (
                  <ReviewCard
                    key={index}
                    name={review.name}
                    date={review.date}
                    rating={review.rating}
                    description={review.description}
                    designation={review.designation}
                    avatar={review.avatar}
                  />
                ))
              ) : (
                <div className="text-center text-gray-600 py-8">
                  No reviews available yet.
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'faq' && job.faq && (
          <div className="space-y-4 text-gray-500" >
            {job.faq.map((item, index) => (
              <div key={index} className="border rounded-lg overflow-hidden">
                <details className="group">
                  <summary className="flex items-center justify-between p-2.5 cursor-pointer bg-white hover:bg-gray-50">
                    <span className="text-sm text-gray-600">{item.question}</span>
                    <span className="ml-6 flex items-center">
                      <svg
                        className="h-6 w-6 transform group-open:rotate-180 transition-transform duration-200"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </span>
                  </summary>
                  <div className="px-4 py-3 text-sm  text-gray-600">
                    {item.answer}
                  </div>
                </details>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Apply Button */}
      <div className="p-6 border-t border-gray-100">
        <div className="flex gap-4 text-sm">
          <button   onClick={() => onApply(job)} className="flex px-2  py-1 bg-maincl text-white rounded-3xl hover:bg-opacity-90 transition-colors">
            Apply Now
          </button>
          <button 
            className={`px-4 py-1 border rounded-3xl transition-colors ${
              isSaved 
                ? 'border-maincl text-maincl bg-blue-50'
                : 'border-gray-200 text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setIsSaved(!isSaved)}
          >
            {isSaved ? 'Saved' : 'Save Job'}
          </button>
        </div>
      </div>
    </div>
  );
};