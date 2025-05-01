import React, { useState } from 'react';


interface ResourceDetailsProps {
  resource: {
    type: string;
    readTime: string;
    date: string;
    title: string;
    description: string;
    content: string;
    imageSrc: string;
    totalPages?: number;
  };
  onClose: () => void;
}

const ResourceDetails: React.FC<ResourceDetailsProps> = ({ resource, onClose }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const renderArticleView = () => (
    <div className="px-8">
      <div className="text-start mb-8">
        <h1 className="text-xl font-medium text-gray-900 mb-3">
          {resource.title}
        </h1>
        <p className="text-sm text-gray-500">
          {resource.date}
        </p>
      </div>

      <div className="mb-10">
        <img
          src={resource.imageSrc}
          alt={resource.title}
          className="w-full h-[400px] object-cover rounded-lg mx-auto"
        />
      </div>

      <div className="prose max-w-none">
        <p className="text-gray-600 text-lg leading-relaxed whitespace-pre-line">
          {resource.content}
        </p>
      </div>
    </div>
  );

  const renderNotesView = () => (
    <div className="flex flex-col h-full">
      
      
      <div className="px-8 py-6">
        <div className="text-start mb-6">
          <h1 className="text-xl font-medium text-gray-900 mb-2">
            {resource.title}
          </h1>
          <p className="text-sm text-gray-500">
            {resource.date}
          </p>
        </div>

        <div className="mb-8">
          <img
            src={resource.imageSrc}
            alt={resource.title}
            className="w-full h-[400px] object-cover rounded-lg mx-auto"
          />
        </div>
      </div>

      <div className="mt-auto px-8 py-4 border-t">
        <div className="flex justify-center items-center gap-4">
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 text-sm text-gray-600 border rounded-md disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm text-gray-600">
            Page {currentPage} of {resource.totalPages || 10}
          </span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(resource.totalPages || 10, prev + 1))}
            disabled={currentPage === (resource.totalPages || 10)}
            className="px-3 py-1 text-sm text-gray-600 border rounded-md disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );

  


  return (
    <div className="flex justify-center w-full flex-grow">
      <div className="w-full max-w-4xl px-4">
        <div className="bg-white rounded-lg shadow-sm h-full">
          <div className="flex items-center justify-between px-8 py-4 border-b">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold bg-buttonbgclr text-fillc px-2 py-1 rounded-lg">
                {resource.type}
              </span>
              <span className="text-xs text-gray-500">
                {resource.readTime}
              </span>
            </div>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg 
                className="w-5 h-5" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M6 18L18 6M6 6l12 12" 
                />
              </svg>
            </button>
          </div>

          {resource.type === "Notes" ? renderNotesView() : renderArticleView()}
        </div>
      </div>
    </div>
  );
};

export default ResourceDetails;