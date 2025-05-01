
import { JobsCard } from "./JobsCard";
import { SearchBar } from "./JobSearchBar";
import { JobDetails } from "./JobDetails";
// import { JobApplicationModal } from "./JobApplicationModal";


import { useState, useEffect } from "react";
import axios from "axios";

interface Job {
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
      avatar: string;
    }>;
  };
  faq?: {
    question: string;
    answer: string;
  }[];
}



export function JobsPage() {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchJobs() {
      setLoading(true);
      setError(null);
      console.log(isApplicationModalOpen)
      try {
        const response = await axios.get("/api/jobs");
        setJobs(response.data.jobs || []);
      } catch (err: any) {
        setError(err.response?.data?.message || err.message || "Something went wrong");
        setJobs([]);
      } finally {
        setLoading(false);
      }
    }
    fetchJobs();
  }, []);

  const handleSearch = (query: string) => {
    // TODO: Implement search functionality with backend
    console.log("Searching for:", query);
  };

  const handleAddJob = () => {
    // TODO: Implement add job functionality
    console.log("Asking new question");
  };

  return (
    <div className={`flex-1 flex ${selectedJob ? 'lg:ml-0' : ''}`}>
      {/* Job Cards Section */}
      <div className={`${selectedJob ? 'lg:w-[350px] transition-all duration-300' : 'w-full'}`}>
        <div className="lg:hidden">
          <SearchBar onSearch={handleSearch} onAddJob={handleAddJob} />
        </div>
        <div className="flex flex-col w-full py-3 lg:sticky lg:top-[80px] min-h-[60vh]">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-96 animate-pulse">
              {/* Loader animation */}
              <svg className="w-24 h-24 text-blue-400 animate-spin mb-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              <span className="text-lg text-gray-500">Fetching the best jobs for you...</span>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-96">
              <svg width="120" height="120" fill="none" viewBox="0 0 24 24" className="mb-4 text-red-400">
                <path d="M12 2a10 10 0 100 20 10 10 0 000-20zM12 8v4m0 4h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="text-lg text-red-500">{error}</span>
            </div>
          ) : jobs.length === 0 ? (
            <div className="flex bg-white flex-col items-center justify-center h-96 rounded-md  ">
              {/* Empty state illustration */}
              <svg width="160" height="160" viewBox="0 0 160 160" fill="none" className="mb-6 animate-float">
                <ellipse cx="80" cy="140" rx="55" ry="12" fill="#E0E7FF" />
                <rect x="45" y="40" width="70" height="60" rx="12" fill="#F3F4F6" />
                <rect x="55" y="50" width="50" height="10" rx="5" fill="#C7D2FE" />
                <rect x="55" y="66" width="35" height="8" rx="4" fill="#E0E7FF" />
                <rect x="55" y="80" width="40" height="8" rx="4" fill="#E0E7FF" />
                <circle cx="120" cy="60" r="7" fill="#A5B4FC" />
                <circle cx="60" cy="90" r="5" fill="#A5B4FC" />
              </svg>
              <h2 className="text-xl font-semibold text-gray-700 mb-2">We’re working on it!</h2>
              <p className="text-gray-500 text-center max-w-xs mb-2">We’re connecting with top organizations to get you the best jobs. Please check back soon!</p>
              
            </div>
          ) : (
            jobs.map((job, index) => (
              <div
                key={index}
                onClick={() => {
                  setSelectedJob(job);
                  window.scrollTo(0, 0);
                  const detailsContainer = document.getElementById('job-details-container');
                  if (detailsContainer) {
                    detailsContainer.scrollTop = 0;
                  }
                }}
                className={`cursor-pointer transition-all duration-300 ${selectedJob === job ? 'scale-95 opacity-75' : ''}`}
              >
                <JobsCard job={job} />
              </div>
            ))
          )}
        </div>
      </div>
      {/* Job Details Section */}
      {selectedJob && (
        <div className="fixed lg:static top-[64px] left-0 right-0 bottom-0 bg-white lg:bg-transparent lg:flex-1 lg:min-w-[60px] lg:pr-4">
          <div
            id="job-details-container"
            className="h-full p-4 lg:p-0 overflow-auto scrollbar-hide"
            style={{
              height: 'calc(100vh - 64px)',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none'
            }}
          >
            <JobDetails
              job={selectedJob}
              onApply={() => setIsApplicationModalOpen(true)}
              onClose={() => setSelectedJob(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
}