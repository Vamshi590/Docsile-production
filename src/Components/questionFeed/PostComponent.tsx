import React from "react";
import { Bookmark, MoreVertical,  Share2 } from "lucide-react";
import { Carousel } from "react-responsive-carousel";
import RightArrow from "../../assets/icon/lucide_arrow-up.svg";
import LeftArrow from "../../assets/icon/Vector.svg";
// import RelatedQuestions from "./RelatedQuestions";
import AnswerList from "./AnswerList";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import profile from "../../assets/icon/profile.svg";
import { formatTimestamp } from "@/functions";

interface Image {
  src: string;
}

// interface Comment {
//   id: number;
//   text: string;
//   date: string;
//   likes: number;
//   dislikes: number;
//   replies: Comment[];
//   image: string | null;
// }

interface User {
  name: string;
  profile_picture: string;
  department: string;
  organisation_name: string;
  
}

interface Answer {
  id: string;
  answer_description: string;
  User: User;
  created_at: string;
  answer_image_links: string[];
  likes: number;
  dislikes: number;
}

interface QuestionData {
  id: string;
  User: User;
  asked_at: string;
  question: string;
  question_description: string;
  question_image_links: string[];
  answers: Answer[];
}

interface PostComponentProps {
  questionData: QuestionData;
}

import axios from "axios";

const PostComponent: React.FC<PostComponentProps> = ({ questionData }) => {
  // Local state for fetched answers and loading
  const [answers, setAnswers] = React.useState<Answer[]>([]);
  const [loadingAnswers, setLoadingAnswers] = React.useState<boolean>(true);

  React.useEffect( () => {
    setLoadingAnswers(true);
    // TODO: Replace with your actual API endpoint
    const fetchAnswers = async () => {
    const response = await axios.get(`https://128i1lirkh.execute-api.ap-south-1.amazonaws.com/dev/getquestionsanswers/${questionData.id}`)
     
      setAnswers(response.data.data || []);
      setLoadingAnswers(false);

      console.log(response) 
    }
    fetchAnswers();
  }, [questionData.id]);

  // Skeleton loader for answers
  const AnswerSkeleton = () => (
    <div className="p-4 animate-pulse border-b">
      <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
      <div className="h-3 bg-gray-100 rounded w-2/3"></div>
    </div>
  );

  const images: Image[] = questionData.question_image_links.map((image) => ({
    src: image,
  }));

  const hasImages = images.length > 0;

  const renderArrowPrev = (
    clickHandler: () => void,
    _hasPrev: boolean
  ): JSX.Element | null => {
    return images.length > 1 ? (
      <button
        onClick={clickHandler}
        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-yellow-100 rounded-full shadow-md w-6 h-6 flex items-center justify-center z-50 hover:scale-110 transition-transform duration-200 p-1"
      >
        <img src={LeftArrow} className="w-8 h-8" alt="Previous" />
      </button>
    ) : null;
  };

  const renderArrowNext = (
    clickHandler: () => void,
    _hasNext: boolean
  ): JSX.Element | null => {
    return images.length > 1 ? (
      <button
        onClick={clickHandler}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-yellow-100 rounded-full shadow-md w-6 h-6 flex items-center justify-center z-50 hover:scale-110 transition-transform duration-200 p-1"
      >
        <img src={RightArrow} className="w-8 h-8" alt="Next" />
      </button>
    ) : null;
  };

  type KeyValueObject = { [key: string]: string };

  function extractValues(data: (KeyValueObject | string)[]): string[] {
    return data?.map((obj) =>
      typeof obj === "string" ? obj : Object.values(obj)[2]
    );
  }

  const valuesArray = extractValues(questionData.question_image_links);

  return (
    <div className="flex flex-col min-h-screen w-full overflow-visible">
      <div className="bg-white rounded-xl p-6 w-full flex flex-col gap-4 relative">
        {/* Top-Right Icons */}
        <div className="absolute top-4 right-4 flex gap-3">
          <Bookmark
            className="cursor-pointer text-gray-500 hover:text-gray-700"
            size={20}
          />
          <MoreVertical
            className="cursor-pointer text-gray-500 hover:text-gray-700"
            size={20}
          />
        </div>

        {/* Main Content Section */}
        <div className={`flex gap-6 ${hasImages ? "" : "flex-col"}`}>
          {/* Left Section: Profile & Slideshow */}
          <div className="w-2/5 flex flex-col">
            {/* Profile Section (Always Visible) */}
            <div className="flex items-start w-full gap-3 mb-5">
              <img
                src={questionData.User.profile_picture || profile}
                alt="profile"
                className="w-[50px] h-[50px] object-cover shrink-0 rounded-full border border-gray-300"
              />
              <div>
                <h2 className="font-semibold text-sm">{questionData.User.name}</h2>
                <p className="text-xs text-gray-500">
                  {questionData.User.department} | {questionData.User.organisation_name}
                </p>
                <p className="text-xs text-gray-400">{formatTimestamp(questionData.asked_at)}</p>
              </div>
            </div>

            {/* Image Slider (Only if Images Exist) */}
            {hasImages && (
              <div className="relative w-full overflow-visible">
                <Carousel
                  showThumbs={false}
                  showStatus={false}
                  infiniteLoop={images.length > 1}
                  showIndicators={images.length > 1}
                  className="custom-carousel"
                  transitionTime={500}
                  swipeScrollTolerance={5}
                  renderArrowPrev={renderArrowPrev}
                  renderArrowNext={renderArrowNext}
                >
                  {valuesArray.map((image, index) => (
                    <div
                      key={index}
                      className="relative transition-opacity duration-300"
                    >
                      <img
                        src={image}
                        alt={`Slide ${index + 1}`}
                        className="w-[448px] h-[336px] object-cover rounded-lg shadow-md transition-transform duration-500 hover:scale-[1.01]"
                      />
                    </div>
                  ))}
                </Carousel>
              </div>
            )}
          </div>

          {/* Right Section: Question Details */}
          <div
            className={`${
              hasImages ? "w-3/5 pl-4" : "w-full"
            } flex flex-col overflow-hidden`}
          >
            <div className={hasImages ? "mt-16" : "mt-0"}>
              <h2 className="text-xl font-semibold mb-2 break-words">
                {questionData.question}
              </h2>
              <p className="text-gray-700 text-[16px] break-words whitespace-pre-wrap">
                {questionData.question_description}
              </p>
            </div>
          </div>
        </div>

        {/* Single Line Separator */}
        <div className="border-t border-gray-300 w-full mt-4"></div>

        {/* Bottom-Right Icons with Labels */}
        <div className="flex justify-end gap-6 text-gray-600 mb-2">
     
          <div className="flex items-center gap-2 cursor-pointer hover:text-gray-800">
            <Share2 size={20} />
            <span className="text-sm">Share</span>
          </div>
        </div>
      </div>


    

      {/* Answers Section */}

      {/* Answers Section with loading skeletons and fetch */}
      <div className="w-full mt-4 flex flex-col bg-white rounded-t-xl ">
        <h2 className="text-xl font-semibold px-6 py-4">Answers ({answers.length})</h2>
        {loadingAnswers ? (
          <>
            <AnswerSkeleton />
            <AnswerSkeleton />
            <AnswerSkeleton />
          </>
        ) : (
          <AnswerList
            initialComments={answers.map(answer => ({
              id: Number(answer.id),
              user: answer.User,
              answer_description: answer.answer_description,
              date: answer.created_at,
              likes: answer.likes,
              dislikes: answer.dislikes,
              replies: [],
              image: answer?.answer_image_links?.length > 0 ? answer?.answer_image_links[0] : null,
            }))}
            questionId={questionData.id}
          />
        )}
      </div>

      {/* Related Questions */}
      {/* <RelatedQuestions /> */}
    </div>
  );
};

export default PostComponent;
