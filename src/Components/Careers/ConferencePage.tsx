import { useState, useEffect } from "react";
import axios from "axios";
import save1 from "../../assets/icon/save1.svg"
import save2 from "../../assets/icon/save2.svg"
import time from "../../assets/icon/time.svg"
import location from "../../assets/icon/location.svg"
import money from "../../assets/icon/money.svg"

import { SearchBar } from "./ConferenceSearchBar";
import ConferenceDetails from './ConferenceDetails';

interface Conference {
  id: string;
  title: string;
  avatar: string;
  date: string;
  time: string;
  image: string;
  amount: string;
  location: string;
  speaker: string;
  speciality: string;
  description: string;
  organizer: string;
  highlights: string[];
  registration: {
    deadline: string;
    fees: {
      early: string;
      regular: string;
      virtual: string;
    }
  };
  contact: {
    email: string;
    phone: string;
  }
  schedule: {
    time: string;
    description: string;
    title?: string;
    speaker?: string;
  }[]
  panelists: {
    name: string;
    image: string;
    role: string;
    institute: string;
    expertise: string;
    notableWork: string;
  }[]
  reviews: {
    id: string;
    name: string;
    image: string;
    designation: string;
    date: string;
    rating: number;
    comment: string;
  }[]
  faqs: {
    id: string;
    question: string;
    answer: string;
  }[]
}

const ConferencePage = () => {

  // Fetch conferences dynamically from backend
  const [conferences, setConferences] = useState<Conference[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchConferences() {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get("/api/conferences");
        setConferences(response.data.conferences || []);
      } catch (err: any) {
        setError(err.response?.data?.message || err.message || "Something went wrong");
        setConferences([]);
      } finally {
        setLoading(false);
      }
    }
    fetchConferences();
  }, []);


  const [isSaved, setIsSaved] = useState(false);


  const [selectedConference, setSelectedConference] = useState<Conference | null>(null);

  const handleCloseDetails = () => {
    setSelectedConference(null);
  };

  const handleSearch = (query: string) => {
    console.log("Searching for:", query);
  };

  const handleAdd = () => {
    console.log("Adding a conference");
  };

  return (
    <div className={`flex-1 flex ${selectedConference ? 'lg:ml-0' : ''}`}>
      {/* Conference Cards Section */}
      <div className={`${selectedConference ? 'lg:w-[350px] transition-all duration-300' : 'w-full'}`}>
        <div className="lg:hidden">
          <SearchBar onSearch={handleSearch} onAdd={handleAdd} />
        </div>

        <div className="flex flex-col w-full py-3 lg:sticky lg:top-[80px]">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-gray-600" role="status">
                <span className="sr-only">Loading...</span>
              </div>
            </div>
          ) : error ? (
            <div className="flex justify-center items-center h-full">
              <div className="text-center">
                <p className="text-lg font-medium text-gray-600 mb-2">Error</p>
                <p className="text-sm text-gray-500">{error}</p>
              </div>
            </div>
          ) : conferences.length === 0 ? (
            <div className="flex flex-col rounded-md bg-white justify-center items-center h-96">
              <div className="text-center flex flex-col items-center">
                <svg width="160" height="160" viewBox="0 0 160 160" fill="none" className="mb-4 animate-float">
                  <ellipse cx="80" cy="140" rx="55" ry="12" fill="#E0E7FF" />
                  <rect x="45" y="40" width="70" height="60" rx="12" fill="#F3F4F6" />
                  <rect x="55" y="50" width="50" height="10" rx="5" fill="#C7D2FE" />
                  <rect x="55" y="66" width="35" height="8" rx="4" fill="#E0E7FF" />
                  <rect x="55" y="80" width="40" height="8" rx="4" fill="#E0E7FF" />
                  <circle cx="120" cy="60" r="7" fill="#A5B4FC" />
                  <circle cx="60" cy="90" r="5" fill="#A5B4FC" />
                </svg>
                <p className="text-xl font-semibold text-gray-600 mb-2">No Conferences Available Yet</p>
                <p className="text-sm text-gray-500">We’re actively working with organizers to bring you the best conferences very soon.</p>
              </div>
            </div>
          ) : (
            conferences.map((conference, index) => (
              <div
                key={index}
                onClick={() => {
                  setSelectedConference(conference);
                  window.scrollTo(0, 0);
                  const detailsContainer = document.getElementById('conference-details-container');
                  if (detailsContainer) {
                    detailsContainer.scrollTop = 0;
                  }
                }}
                className={`cursor-pointer transition-all duration-300 ${selectedConference === conference ? 'scale-95 opacity-75' : ''}`}
              >
                <div
                  className="bg-white rounded-xl shadow-sm border border-gray-100 cursor-pointer"
                >
                  <div className="relative">
                    <img
                      src={conference.image}
                      alt={conference.speciality}
                      className="w-full h-24 object-cover rounded-t-xl"
                    />
                    <img
                      src={conference.avatar}
                      alt=""
                      className='absolute left-4 -bottom-8 lg:top-4 w-16 h-16 rounded-lg '
                    />
                  </div>

                  <div className="p-4">
                    <div className='flex justify-between items-start mt-4 lg:mt-1 mb-2'>
                      <p className="font-medium text-xs text-fillc">{conference.speciality}</p>
                      <img
                        src={isSaved ? save2 : save1}
                        onClick={() => setIsSaved(!isSaved)}
                        alt=""
                        className="cursor-pointer"
                      />
                    </div>

                    <p className="text-sm font-medium text-gray-800 mb-3">
                      {conference.title}
                    </p>

                    <div className="space-y-2 mb-4">
                      <div className="text-xs text-gray-500 flex items-center">
                        <img src={time} alt="" className='w-3 mr-2' />
                        {conference.date}
                      </div>
                      <div className="text-xs text-gray-500 flex items-center">
                        <img src={location} alt="" className='w-3 mr-2' />
                        {conference.location}
                      </div>
                      <div className="text-xs text-gray-500 flex items-center">
                        <img src={money} alt="" className='w-3 mr-2' />
                        {conference.amount}
                      </div>
                    </div>

                    <div className='mb-4'>
                      <p className='text-xs font-medium text-gray-700'>Speaker: {conference.speaker}</p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => {

                        }}
                        className="px-4 py-1.5 text-xs text-white bg-maincl rounded-xl hover:bg-blue-700"
                      >
                        Register
                      </button>
                      <button
                        onClick={() => {
                        }}
                        className="px-4 py-1.5 text-xs text-maincl border border-gray-200 rounded-xl hover:bg-gray-50"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>

            )))}
        </div>
      </div>

      {/* Conference Details Section */}
      {selectedConference && (
        <div className="fixed lg:static top-[64px] left-0 right-0 bottom-0 bg-white lg:bg-transparent lg:flex-1 lg:min-w-[60px] pr-3">
          <div
            id="conference-details-container"
            className="h-full p-4 lg:p-0 overflow-auto scrollbar-hide"
            style={{
              height: 'calc(100vh - 64px)',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none'
            }}
          >
            <ConferenceDetails
              conference={selectedConference}
              onClose={handleCloseDetails}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ConferencePage;