import { useState } from "react";
import { Image } from "lucide-react";
import AnswerItem from "./AnswerItem";
import axios from "axios";

interface User {
  name: string;
  profile_picture: string;
  department: string;
  organisation_name: string;
}

interface Answer {
  id: number;
  answer_description: string;
  date: string;
  user: User;
  likes: number;
  dislikes: number;
  replies: any[];
  image: string | null;
}

interface AnswerListProps {
  initialComments: Answer[];
  questionId: string;
}

const AnswerList: React.FC<AnswerListProps> = ({ initialComments = [], questionId }) => {
  const [answers, setAnswers] = useState<Answer[]>(initialComments);
  const [newAnswer, setNewAnswer] = useState("");
  const [visibleCount, setVisibleCount] = useState(4);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const user  = localStorage.getItem("Id") || ""

  const addAnswer = async () => {
    if (!newAnswer.trim() || isSubmitting) return;

    try {
      setIsSubmitting(true);
      
      
 
      
      // if (selectedImage) {
      //   const response = await fetch(selectedImage);
      //   const blob = await response.blob();
      //   formData.append("image", blob, "answer_image.jpg");
      // }

      const response = await axios.post(
        `https://128i1lirkh.execute-api.ap-south-1.amazonaws.com/dev/answer-question/${questionId}`,
      {
        answer  : newAnswer,
        userId : parseInt(user),
        questionId : questionId,
      }
      );

      if (response.data) {
        const newAnswerObj: Answer = {
          id: Date.now(),
          answer_description: newAnswer,
          date: new Date().toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }),
          user: {
            name: "Anonymous", // Replace with actual user name if available
            profile_picture: "", // Replace with actual profile picture URL if available
            department: "Unknown", // Replace with actual department if available
            organisation_name: "Unknown", // Replace with actual organisation name if available
          },
          likes: 0,
          dislikes: 0,
          replies: [],
          image: selectedImage,
        };

        setAnswers([newAnswerObj, ...answers]);
        setNewAnswer("");
        setSelectedImage(null);
      }
    } catch (error) {
      console.error("Failed to post answer:", error);
      alert("Failed to post answer. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const loadMore = () => {
    setVisibleCount((prev) => prev + 4);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
    }
  };

  return (
    <div className="bg-white rounded-xl p-4 w-full">
      {/* Answer Input Section */}
      <div className="mb-4 bg-gray-50 rounded-lg p-3">
        <textarea
          value={newAnswer}
          onChange={(e) => setNewAnswer(e.target.value)}
          placeholder="Write your answer..."
          className="w-full h-20 p-2 bg-transparent focus:outline-none resize-none"
          disabled={isSubmitting}
        />
        {selectedImage && (
          <div className="mt-2">
            <img
              src={selectedImage}
              alt="Selected preview"
              className="w-full max-h-40 object-cover rounded-md"
            />
          </div>
        )}
        <div className="flex justify-between items-center mt-2">
          <label className={`flex items-center gap-2 text-blue-500 hover:text-blue-700 cursor-pointer px-3 py-1 rounded-full border border-gray-200 hover:bg-gray-200 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}>
            <Image size={20} /> <span>Add Media</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
              disabled={isSubmitting}
            />
          </label>
          <button
            onClick={addAnswer}
            className={`bg-[#3B5D8F] text-white px-4 py-2 rounded-full hover:bg-[#2E4A76] transition-colors ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Posting..." : "Answer"}
          </button>
        </div>
      </div>

      {/* Answers list - newest first */}
      {answers.slice(0, visibleCount).map((answer) => (
        <AnswerItem key={answer.id} answer={answer} />
      ))}

      {/* Load More button */}
      {answers.length > visibleCount && (
        <div className="flex justify-center mt-4">
          <button
            onClick={loadMore}
            className="text-[#3B5D8F] hover:text-[#2E4A76] font-medium"
          >
            Load More Answers
          </button>
        </div>
      )}
    </div>
  );
};

export default AnswerList;
