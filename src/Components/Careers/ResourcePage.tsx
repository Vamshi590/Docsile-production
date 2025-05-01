import { useState } from "react";
import { ArticleCard } from "./ArticleCard";

import { SearchBar } from "./ResourceSearchBar";
import ResourceDetails from "./ResourceDetails"; // Assuming ResourceDetails component is defined in a separate file


// Simulate fetching resources from backend (empty for now)
const articles: any[] = [];
export function ResourcesPage() {
  const [selectedResource, setSelectedResource] = useState<typeof articles[0] | null>(null);
  
  const handleSearch = (query: string) => {
    console.log("Searching for:", query);
  };

  const handleResourceClick = (resource: typeof articles[0]) => {
    setSelectedResource(resource);
  };

  const handleCloseResource = () => {
    setSelectedResource(null);
  };

  if (selectedResource) {
    return (
      <ResourceDetails
        resource={{
          ...selectedResource,
          content: "The future of AI in ophthalmology is poised to significantly enhance patient care, streamline diagnostic processes, and improve treatment outcomes. AI's most promising applications are in diagnostics, where it aids in the early detection of retinal conditions like diabetic retinopathy, macular degeneration, and glaucoma. Tools such as DeepMind's AI system have already demonstrated diagnostic accuracy comparable to that of trained ophthalmologists, enabling earlier intervention.\n\nThe future of AI in ophthalmology is poised to significantly enhance patient care, streamline diagnostic processes, and improve treatment outcomes. AI's most promising applications are in diagnostics, where it aids in the early detection of retinal conditions like diabetic retinopathy, macular degeneration, and glaucoma. Tools such as DeepMind's AI system have already demonstrated diagnostic accuracy comparable to that of trained ophthalmologists, enabling earlier intervention.\n\nThe future of AI in ophthalmology is poised to significantly enhance patient care, streamline diagnostic processes, and improve treatment outcomes. AI's most promising applications are in diagnostics, where it aids in the early detection of retinal conditions like diabetic retinopathy, macular degeneration, and glaucoma. Tools such as DeepMind's AI system have already demonstrated diagnostic accuracy comparable to that of trained ophthalmologists, enabling earlier intervention."
        }}
        onClose={handleCloseResource}
      />
    );
  }

  return (
    <div className={`flex-1 flex ${selectedResource ? 'lg:ml-0' : ''}`}>
      {/* Main Feed */}
      <div className="flex-1 w-full">
        <div className="lg:hidden">
          <SearchBar onSearch={handleSearch} onAdd={() => {}} />
        </div>
        <div className="flex z-10 flex-col w-full mx-auto mt-2">
          <div className="flex flex-col w-full">
            {articles.length === 0 ? (
              <div className="flex bg-white flex-col items-center justify-center h-96 rounded-md">
                <svg width="160" height="160" viewBox="0 0 160 160" fill="none" className="mb-6 animate-float">
                  <ellipse cx="80" cy="140" rx="55" ry="12" fill="#E0E7FF" />
                  <rect x="45" y="40" width="70" height="60" rx="12" fill="#F3F4F6" />
                  <rect x="55" y="50" width="50" height="10" rx="5" fill="#C7D2FE" />
                  <rect x="55" y="66" width="35" height="8" rx="4" fill="#E0E7FF" />
                  <rect x="55" y="80" width="40" height="8" rx="4" fill="#E0E7FF" />
                  <circle cx="120" cy="60" r="7" fill="#A5B4FC" />
                  <circle cx="60" cy="90" r="5" fill="#A5B4FC" />
                </svg>
                <h2 className="text-xl font-semibold text-gray-700 mb-2">No Resources Available Yet</h2>
                <p className="text-gray-500 text-center max-w-xs mb-2">Be the first to add and share resources with the Docsile community!</p>
              </div>
            ) : (
              articles.map((article, index) => (
                <ArticleCard
                  key={index}
                  {...article}
                  onClick={() => handleResourceClick(article)}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}