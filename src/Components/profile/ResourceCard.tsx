import React from 'react';

interface ResourceCardProps {
  type: string;  // e.g., "Article", "Video", "Research"
  title: string;
  description: string;
  image: string;
  
}

const ResourceCard: React.FC<ResourceCardProps> = ({
  type,
  title,
  description,
  image,
  
}) => {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-lg p-3 ">
      {/* Main Image */}
      <div className="w-full h-48 overflow-hidden">
        <img 
          src={image} 
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="p-4">
        {/* Resource Type Tag */}
        <span className="inline-block px-3 py-1 text-sm bg-blue-100 text-blue-600 rounded-full mb-3">
          {type}
        </span>

        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          {title}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-3">
          {description}
        </p>

       
      </div>
    </div>
  );
};

export default ResourceCard;
