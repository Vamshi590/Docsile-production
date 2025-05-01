import React, { useState } from 'react';
import save1 from "../../assets/icon/save1.svg";
import save2 from "../../assets/icon/save2.svg";
import time from "../../assets/icon/time.svg";
import location from "../../assets/icon/location.svg";
import money from "../../assets/icon/money.svg";

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
  schedule: {
    time: string;
    title?: string;
    description: string;
    speaker?: string;
  }[];
  panelists: {
    name: string;
    image: string;
    role: string;
    institute: string;
    expertise: string;
    notableWork: string;
  }[];
  reviews: {
    id: string;
    name: string;
    image: string;
    designation: string;
    date: string;
    rating: number;
    comment: string;
  }[];
  faqs: {
    id: string;
    question: string;
    answer: string;
  }[];
  contact: {
    email: string;
    phone: string;
  };
}

interface ConferenceDetailsProps {
  conference: Conference;
  onClose: () => void;
}

export const ConferenceDetails: React.FC<ConferenceDetailsProps> = ({
  conference,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'details' | 'schedule' | 'panelists' | 'reviews' | 'faq'>('details');
  const [isSaved, setIsSaved] = useState(false);
  const [openFaqId, setOpenFaqId] = useState<string | null>(null);

  const toggleFaq = (id: string) => {
    setOpenFaqId(openFaqId === id ? null : id);
  };

  const tabs = [
    { id: 'details', label: 'Program Details' },
    { id: 'schedule', label: 'Schedule' },
    { id: 'panelists', label: 'Panelists' },
    { id: 'reviews', label: 'Reviews' },
    { id: 'faq', label: 'FAQ' }
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 font-fontsm overflow-hidden">
      {/* Header Image Section */}
      <div className="relative h-40">
        <img
          src={conference.image}
          alt="Conference"
          className="w-full h-32 object-cover"
        />
        <div className="absolute bottom-0 lg:left-52 left-6">
          <img
            src={conference.avatar}
            alt="Speaker"
            className="w-16 h-16 lg:w-32 lg:h-32 rounded-full shadow-xl"
          />
        </div>
        <div className="absolute top-4 right-4 flex gap-4">
         
          <button 
            onClick={onClose} 
            className="text-white hover:text-gray-200 bg-black/20 rounded-full w-6 h-6 flex items-center justify-center"
          >
            ✕
          </button>
        </div>
      </div>

      <div className="px-6">
        {/* Conference Info */}
        <div className="mb-6 ">
          <div className="flex flex-row justify-between ">

          <span className="text-blue-600 text-xs font-medium bg-blue-50 px-1 py-1 rounded-full">
            {conference.speciality}
           
          </span>
          <img
            src={isSaved ? save2 : save1}
            onClick={() => setIsSaved(!isSaved)}
            alt=""
            className="cursor-pointer w-6 h-6"
            />
            </div>
          <h1 className="text-lg font-medium text-gray-900 mt-3">{conference.title}</h1>
          <p className="text-sm text-gray-600 mt-1">{conference.organizer}</p>
        </div>

        {/* Basic Info */}
        <div className="flex flex-col gap-2 mb-6">
          <div className="flex items-center gap-2">
            <img src={time} alt="" className="w-4" />
            <span className="text-sm text-gray-600">{conference.date}, {conference.time}</span>
          </div>
          <div className="flex items-center gap-2">
            <img src={location} alt="" className="w-4" />
            <span className="text-sm text-gray-600">{conference.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <img src={money} alt="" className="w-4" />
            <span className="text-sm text-gray-600">{conference.amount}</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <div className="flex space-x-3">
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`py-1.5 px-3 text-xs rounded-3xl ${
                  activeTab === tab.id
                    ? 'border-b-2 bg-fillc text-white '
                    : 'text-fillc bg-buttonclr'
                }`}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="py-6">
          {activeTab === 'details' && (
            <div className="space-y-6">
              <div>
                <p className="text-sm text-gray-600 leading-relaxed">{conference.description}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-fillc mb-3 ">Highlights</h3>
                <ul className="space-y-2 p-1">
                  {conference.highlights.map((highlight, index) => (
                    <li key={index} className="text-sm text-gray-600">• {highlight}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-medium text-fillc mb-3">Registration Details</h3>
                <p className="text-sm text-gray-600 mb-2">Registration Deadline: {conference.registration.deadline}</p>
                <ul className="space-y-2 p-1">
                  <li className="text-sm text-gray-600">• Early Bird Fee: {conference.registration.fees.early}</li>
                  <li className="text-sm text-gray-600">• Regular Fee: {conference.registration.fees.regular}</li>
                  <li className="text-sm text-gray-600">• Virtual Fee: {conference.registration.fees.virtual}</li>
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-medium text-fillc mb-3">Contact</h3>
                <p className="text-sm text-gray-600 p-1">Email: {conference.contact.email}</p>
                <p className="text-sm text-gray-600 p-1   ">Phone: {conference.contact.phone}</p>
              </div>
            </div>
          )}
          
          {activeTab === 'schedule' && (
            <div className="space-y-4 pt-2">
              {conference.schedule.map((item, index) => (
                <div key={index} className="gap-4 items-start">
                  <div className="w-36 flex-shrink-0 p-1">
                    <p className="text-xs font-medium text-gray-900">{item.time}</p>
                  </div>
                  <div className="flex-1">
                    {item.title && (
                      <p className="text-xs text-gray-600 font-medium">   {item.title}</p>
                    )}
                    <p className="text-xs  text-gray-600">
                      •  {item.description}
                      {item.speaker && (
                        <span className="text-gray-500"> - {item.speaker}</span>
                      )}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
          {activeTab === 'panelists' && (
            <div className="space-y-6 pt-2">
              {conference.panelists.map((panelist, index) => (
                <div key={index} className="bg-white rounded-lg border border-gray-200 shadow-md p-4">
                  <div className="flex gap-4 ">
                    <div className="flex-shrink-0">
                      <img 
                        src={panelist.image} 
                        alt={panelist.name}
                        className="w-20 h-20 rounded-lg mb-1 object-cover"
                      />
                      <h3 className="text-sm font-medium text-gray-900 mb-2">
                        {panelist.name}
                      </h3>
                    </div>
                    <div className="flex-1">
                      
                      <div className="space-y-1">
                        <div>
                          <span className="text-xs font-medium text-gray-700">Role: </span>
                          <span className="text-xs text-gray-600">
                            {panelist.role}, {panelist.institute}
                          </span>
                        </div>
                        <div>
                          <span className="text-xs font-medium text-gray-700">Expertise: </span>
                          <span className="text-xs text-gray-600">{panelist.expertise}</span>
                        </div>
                        <div>
                          <span className="text-xs font-medium text-gray-700">Notable Work: </span>
                          <span className="text-xs text-gray-600">{panelist.notableWork}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          {activeTab === 'reviews' && (
            <div className="space-y-6 pt-2">
              {conference.reviews.map((review) => (
                <div key={review.id} className="bg-white rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <img 
                      src={review.image} 
                      alt={review.name} 
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-sm font-medium text-gray-900">
                            {review.name}
                          </h3>
                          <p className="text-xs text-gray-500">
                            {review.designation}
                          </p>
                        </div>
                        <p className="text-xs text-gray-500">
                          {review.date}
                        </p>
                      </div>
                      
                      <div className="mt-2">
                        <div className="flex items-center gap-1 mb-2">
                          {[...Array(5)].map((_, index) => (
                            <svg
                              key={index}
                              className={`w-4 h-4 ${
                                index < review.rating
                                  ? 'text-yellow-400'
                                  : 'text-gray-300'
                              }`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                          <span className="text-xs text-gray-500 ml-1">
                            {review.rating.toFixed(1)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">
                          "{review.comment}"
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          {activeTab === 'faq' && (
            <div className="space-y-4 pt-2">
              {conference.faqs.map((faq) => (
                <div 
                  key={faq.id} 
                  className="border border-gray-100 rounded-lg overflow-hidden"
                >
                  <button
                    className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50"
                    onClick={() => toggleFaq(faq.id)}
                  >
                    <span className="text-sm text-gray-900">{faq.question}</span>
                    <svg
                      className={`w-5 h-5 text-gray-500 transform transition-transform ${
                        openFaqId === faq.id ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                  {openFaqId === faq.id && (
                    <div className="p-4 bg-gray-50 border-t border-gray-100">
                      <p className="text-sm text-gray-500">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConferenceDetails;