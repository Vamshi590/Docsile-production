import { useState } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";

const relatedQuestions = [
  { id: 1, text: "Where do you see the Advancements in Ophthalmology: The Future of Eye Care in coming few years??", answers: 12, hasImage: true },
  { id: 2, text: "What are the recent breakthroughs in AI-assisted eye treatments?", answers: 18 },
  { id: 3, text: "How is telemedicine shaping the future of ophthalmology?", answers: 7, hasImage: true },
  { id: 4, text: "Can AI predict eye diseases before symptoms appear?", answers: 25 },
  { id: 5, text: "What role do smart contact lenses play in vision enhancement?", answers: 10, hasImage: true },
  { id: 6, text: "How does laser eye surgery compare to traditional treatments?", answers: 15 },
  { id: 7, text: "What are the risks of prolonged screen time on eye health?", answers: 22, hasImage: true },
  { id: 8, text: "Can gene therapy be the future cure for blindness?", answers: 5 },
  { id: 9, text: "Is blue light really harmful to our eyes?", answers: 30, hasImage: true },
  { id: 10, text: "What is the impact of virtual reality on eye strain?", answers: 8 },
  { id: 11, text: "Can dietary changes improve vision over time?", answers: 14, hasImage: true },
  { id: 12, text: "How do retinal implants work for visually impaired individuals?", answers: 6 },
  { id: 13, text: "What are the benefits of eye yoga?", answers: 9 },
  { id: 14, text: "Can wearable tech improve eye health monitoring?", answers: 16, hasImage: true },
  { id: 15, text: "How does UV exposure affect our eyes?", answers: 21 },
];

const RelatedQuestions = () => {
  const [startIndex, setStartIndex] = useState(0);
  const questionsPerPage = 9;

  const handleNext = () => {
    if (startIndex + questionsPerPage < relatedQuestions.length) {
      setStartIndex(startIndex + questionsPerPage);
    }
  };

  const handlePrev = () => {
    if (startIndex - questionsPerPage >= 0) {
      setStartIndex(startIndex - questionsPerPage);
    }
  };

  return (
    <div className="w-full mt-12">
      {/* Title and Navigation Buttons */}
      <div className="relative">
        <h2 className="text-lg font-semibold mb-4">Explore Related Questions</h2>

        <div className="absolute right-0 top-0 mt-2">
          {startIndex + questionsPerPage < relatedQuestions.length ? (
            <button onClick={handleNext} className="flex items-center text-gray-600 hover:text-black">
              Next <ChevronRight size={24} />
            </button>
          ) : (
            <button onClick={handlePrev} className="flex items-center text-gray-600 hover:text-black">
              <ChevronLeft size={24} /> Previous
            </button>
          )}
        </div>
      </div>

      {/* Questions Grid - Ensuring Consistent Height */}
      <div className="bg-gray-100 p-4 rounded-xl min-h-[400px]">
        <div className="grid grid-cols-3 gap-4">
          {relatedQuestions.slice(startIndex, startIndex + questionsPerPage).map((q) => (
            <div
              key={q.id}
              className={`bg-white p-3 rounded-lg shadow flex ${q.hasImage ? "items-center gap-4 h-[120px]" : "h-[120px] py-2"}`}
            >
              {q.hasImage && (
                <img
                  src={`https://picsum.photos/100/100?random=${q.id}`} 
                  alt="Thumbnail"
                  className="w-[100px] h-[100px] rounded-md object-cover"
                />
              )}
              <div className="flex-1">
                <p className="text-sm font-medium leading-tight">{q.text}</p>
                <p className="text-xs text-gray-500 mt-1">{q.answers} people have answered</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RelatedQuestions;
