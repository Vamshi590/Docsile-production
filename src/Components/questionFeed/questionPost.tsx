import * as React from "react";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  IoIosArrowDropleftCircle,
  IoIosArrowDroprightCircle,
} from "react-icons/io";
import save1 from "../../assets/icon/save1.svg";
import save2 from "../../assets/icon/save2.svg";
import more from "../../assets/icon/more1.svg";

import disagree2 from "../../assets/icon/disagree2.svg";
import disagree1 from "../../assets/icon/disagree1.svg";
import comment1 from "../../assets/icon/comment.svg";
import share from "../../assets/icon/share.svg";
import sharev from "../../assets/icon/sharev.svg";
import hide from "../../assets/icon/hide.svg";
import like from "../../assets/icon/like1.svg";
import liked from "../../assets/icon/liked.svg";
import notinterested from "../../assets/icon/notintrested.svg";
import profile from "../../assets/icon/profile.svg";

// Types
interface Author {
  name: string;
  avatar: string;
  bio: string;
  timeAgo?: string;
}

interface Answer {
  id: string;
  author: Author;
  content: string;
  timeAgo: string;
  likes: number;
  dislikes?: number;
  isLiked?: boolean;
  isDisliked?: boolean;
  replies?: Answer[];
}

interface QuestionPostProps {
  avatar: string;
  name: string;
  bio: string;
  timeAgo: string;
  title: string;
  date: string;
  content: string;
  images: string[];
  agrees: number;
  answers: number;
  disagrees: number;
  isUrgent: boolean;
  shares: number;
  postId: string;
  answerImg: string;
  postAnswers?: Answer[];
  onReply?: () => void;
  onShare?: () => void;
  onAnswer?: (postId: string, answerText: string) => Promise<void>;
}

const formatAnswer = (text: string) => {
  return text.split(" ").map((word, index) => {
    if (word.startsWith("@")) {
      return (
        <span key={index}>
          <span className="text-blue-500 hover:underline cursor-pointer">
            {word}
          </span>{" "}
        </span>
      );
    }
    return word + " ";
  });
};

const AnswerComponent: React.FC<{ answer: Answer }> = ({ answer }) => {
  const [isLiked, setIsLiked] = useState(answer.isLiked || false);
  const [isDisliked, setIsDisliked] = useState(answer.isDisliked || false);
  const [likesCount, setLikesCount] = useState(answer.likes);
  const [dislikesCount, setDislikesCount] = useState(answer.dislikes || 0);
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyText, setReplyText] = useState("");

  const handleLike = () => {
    if (isDisliked) {
      setIsDisliked(false);
      setDislikesCount((prev) => prev - 1);
    }
    if (!isLiked) {
      setLikesCount((prev) => prev + 1);
    } else {
      setLikesCount((prev) => prev - 1);
    }
    setIsLiked(!isLiked);
  };

  const handleDislike = () => {
    if (isLiked) {
      setIsLiked(false);
      setLikesCount((prev) => prev - 1);
    }
    if (!isDisliked) {
      setDislikesCount((prev) => prev + 1);
    } else {
      setDislikesCount((prev) => prev - 1);
    }
    setIsDisliked(!isDisliked);
  };

  return (
    <div className="px-4 mt-3 font-fontsm">
      <div className="flex gap-3">
        <img
          src={answer.author.avatar}
          alt={`${answer.author.name}'s avatar`}
          className="w-6 h-6 rounded-full"
        />
        <div className="flex-1 max-w-84">
          <div className="bg-buttonclr px-3 py-2 rounded-tl-none rounded-2xl relative">
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-medium text-neutral-700">
                {answer.author.name}
              </span>
              <span className="text-fontlit text-neutral-500">
                {answer.timeAgo}
              </span>
            </div>
            <p className="text-fontvlit text-gray-500 max-w-64 line-clamp-1">
              {answer.author.bio}
            </p>
            <p className="text-xs text-neutral-600 mt-1">
              {formatAnswer(answer.content)}
            </p>
          </div>
          <div className="flex items-center gap-4 mt-1 ml-2">
            <button
              onClick={handleLike}
              className="flex items-center gap-1 text-xs text-neutral-500 hover:text-neutral-700"
            >
              <img src={isLiked ? liked : like} alt="" className="w-4 h-4" />
              <span>{likesCount}</span>
            </button>
            <button
              onClick={handleDislike}
              className="flex items-center gap-1 text-xs text-neutral-500 hover:text-neutral-700"
            >
              <img
                src={isDisliked ? disagree2 : disagree1}
                alt=""
                className="w-4 h-4"
              />
              <span>{dislikesCount}</span>
            </button>
            <button
              onClick={() => setShowReplyInput(!showReplyInput)}
              className="text-xs text-neutral-500 hover:text-neutral-700"
            >
              Reply
            </button>
          </div>
          {showReplyInput && (
            <div className="mt-2 ml-2">
              <div className="flex items-start gap-3">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/13d83c993760da19a222234c3cbcb356d551631f91a34653bf73ab3984455ff6"
                  alt="User avatar"
                  className="w-8 h-8 rounded-full"
                />
                <div className="flex-1 flex">
                  <input
                    type="text"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Write a reply..."
                    className="w-full p-2 text-sm border border-gray-200 rounded-2xl focus:outline-none focus:border-blue-400 resize-none"
                  />
                  {replyText && (
                    <div className="flex justify-end ml-1 items-center">
                      <button className="px-4 py-1 text-sm text-white bg-maincl rounded-full hover:bg-fillc">
                        Reply
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          {answer.replies && answer.replies.length > 0 && (
            <div className="ml-4 mt-2 space-y-4">
              {answer.replies.map((reply) => (
                <AnswerComponent key={reply.id} answer={reply} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const QuestionPost: React.FC<QuestionPostProps> = ({
  avatar,
  name,
  bio,
  timeAgo,
  title,
  content,
  images,
  isUrgent,
  shares,
  answers,
  postId,
  postAnswers,
  answerImg,
  onShare,
  onAnswer,
}) => {
  const navigate = useNavigate();

  const handleQuestionClick = () => {};

  const [isExpanded, setIsExpanded] = React.useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showArrows, setShowArrows] = useState(false);
  const [showAnswers, setShowAnswers] = useState(false);
  const [answerText, setAnswerText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isSaved, setIsSaved] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  const startXRef = useRef<number | null>(null);
  const currentTranslate = useRef(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    startXRef.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (startXRef.current !== null) {
      const currentX = e.touches[0].clientX;
      currentTranslate.current = currentX - startXRef.current;
    }
  };

  const handleTouchEnd = () => {
    if (currentTranslate.current > 50 && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else if (
      currentTranslate.current < -50 &&
      currentIndex < images.length - 1
    ) {
      setCurrentIndex(currentIndex + 1);
    }
    startXRef.current = null;
    currentTranslate.current = 0;
  };

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex((prevIndex) => prevIndex - 1);
  };

  const handleNext = () => {
    if (currentIndex < images.length - 1)
      setCurrentIndex((prevIndex) => prevIndex + 1);
  };

  const getVisibleDots = () => {
    const maxVisibleDots = 5;
    const half = Math.floor(maxVisibleDots / 2);
    return images.map((_, index) => {
      const diff = Math.abs(index - currentIndex);
      if (diff <= half) return 1;
      return Math.max(0.3, 1 - (diff - half) * 0.2);
    });
  };

  const visibleDots = getVisibleDots();

  const handleSubmitAnswer = async () => {
    if (answerText.trim() && onAnswer && !isSubmitting) {
      try {
        setIsSubmitting(true);
        await onAnswer(postId, answerText.trim());
        setAnswerText("");
      } catch (error) {
        console.error("Failed to submit answer:", error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const toggleMore = () => {
    setIsMoreOpen(!isMoreOpen);
  };

  type KeyValueObject = { [key: string]: string };

  function extractValues(data: (KeyValueObject | string)[]): string[] {
    return data.map((obj) =>
      typeof obj === "string" ? obj : Object.values(obj)[2]
    );
  }

  const valuesArray = extractValues(images);

  return (
    <div>
      {isUrgent && (
        <div className="px-4 py-1 bg-urgentbg text-urgenttxt font-medium text-fontlit rounded-t-2xl mt-2">
          Urgent
        </div>
      )}
      <article className="flex flex-col p-4  bg-white rounded-x-2xl rounded-b-2xl border border-gray-200 font-fontsm">
        <div className="flex justify-between items-start relative">
          <div className="flex gap-3 items-center">
            <div>
              <img
                src={avatar || profile}
                alt={`${name}'s profile`}
                className="w-[46px] h-[46px] rounded-full object-cover "
              />
            </div>

            <div className="pt-1">
              <h3 className="text-md font-medium text-neutral-700">{name}</h3>
              <p className="text-fontlit text-neutral-500">{bio}</p>
              <p className="text-fontlit text-neutral-700">{timeAgo}</p>
            </div>
          </div>
          <div className="flex items-center">
            <img
              onClick={() => setIsSaved(!isSaved)}
              src={isSaved ? save2 : save1}
              className="w-6 h-6"
              alt=""
            />
            <button
              onClick={toggleMore}
              aria-label="More options"
              className="p-2 hover:bg-slate-100 rounded-full transition-colors"
            >
              <img src={more} className="w-6 h-6" alt="" />
            </button>

            {isMoreOpen && (
              <div
                className="rounded-md shadow-md flex flex-col w-40 text-xs p-3 z-20 absolute top-7 right-0 mt-2"
                style={{
                  background: "rgba(255, 255, 255, 0.4)",
                  backdropFilter: "blur(30px)",
                  WebkitBackdropFilter: "blur(10px)",
                  border: "1px solid rgba(255, 255, 255, 0.3)",
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                }}
              >
                <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-2 rounded">
                  <img src={sharev} alt="Share Via" className="w-4 h-4" />
                  <p>Share Via</p>
                </div>
                <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-2 rounded">
                  <img src={hide} alt="Hide" className="w-4 h-4" />
                  <p>Hide</p>
                </div>
                <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-2 rounded">
                  <img
                    src={notinterested}
                    alt="Not Interested"
                    className="w-4 h-4"
                  />
                  <p>Not Interested</p>
                </div>
                <hr className="my-2" />
                <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-2 rounded">
                  <p>Follow Account</p>
                </div>
                <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-2 rounded text-red-500">
                  <p>Report</p>
                </div>
                <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-2 rounded text-red-500">
                  <p>Block</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 mb-3">
          <h4 className="text-sm font-medium text-neutral-700">{title}</h4>
          <div
            className="flex flex-col gap-2 cursor-pointer"
            onClick={handleQuestionClick}
          >
            <p
              className={`mt-1 text-sm font-light overflow-hidden text-neutral-500 ${
                isExpanded ? "" : "line-clamp-1"
              }`}
            >
              {content}
            </p>
            {content.length > 150 && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="mt-1 text-xs flex justify-start text-slate-500 hover:text-slate-700"
              >
                {isExpanded ? "Show less" : "Show more"}
              </button>
            )}
          </div>
        </div>

        {valuesArray.length > 0 && (
          <div
            className="relative w-full mb-4 group"
            onMouseEnter={() => setShowArrows(true)}
            onMouseLeave={() => setShowArrows(false)}
          >
            <div className="absolute top-2 right-4 z-10 bg-gray-400 bg-opacity-50 text-white text-xs py-1 px-2 rounded-full">
              {currentIndex + 1}/{images.length}
            </div>
            {showArrows && currentIndex > 0 && (
              <button
                className="absolute top-1/2 left-2 z-10 transform -translate-y-1/2 bg-gray bg-opacity-50 text-white p-2 rounded-full group-hover:opacity-80"
                onClick={handlePrev}
              >
                <IoIosArrowDropleftCircle size={30} />
              </button>
            )}
            {showArrows && currentIndex < images.length - 1 && (
              <button
                className="absolute top-1/2 right-2 z-10 transform -translate-y-1/2 bg-gray bg-opacity-50 text-white p-2 rounded-full group-hover:opacity-80"
                onClick={handleNext}
              >
                <IoIosArrowDroprightCircle size={30} />
              </button>
            )}
            <div
              className="relative overflow-hidden z-0 "
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <div
                className="flex transition-transform duration-300"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
              >
                {valuesArray.map((image, index) => (
                  <div
                    onClick={handleQuestionClick}
                    key={index}
                    className="flex-none w-full lg:h-64 rounded-lg bg-gray-200"
                  >
                    <img
                      src={image}
                      alt={`Post image ${index + 1}`}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-center mt-2 space-x-1">
              {valuesArray.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 w-2 rounded-full ${
                    index === currentIndex ? "bg-blue-600" : "bg-gray-400"
                  }`}
                  style={{ opacity: visibleDots[index] }}
                ></div>
              ))}
            </div>
          </div>
        )}

    


        <div className="mt-1 w-full pt-4 border-t border-neutral-200">
          {/* Answer Input */}
          <div className="mt-4" onClick={handleQuestionClick}>
            <div className="flex gap-3 items-center">
              <div className="flex-1 flex gap-2">
                <input
                  type="text"
                  value={answerText}
                  onChange={(e) => setAnswerText(e.target.value)}
                  placeholder="Write your answer..."
                  className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm outline-none"
                />

                <div className="flex  gap-2 items-center   border-neutral-200">
                  <div
                    className={`flex 'bg-gray-100' } rounded-lg p-1 cursor-pointer`}
                    onClick={handleQuestionClick}
                  >
                    <div className="flex p-1">
                      <button className="flex items-center gap-1 text-xs shrink-0 text-neutral-500 hover:text-slate-700">
                        <img src={comment1} alt="" className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="flex flex-col justify-start text-xs pl-1">
                      <p className="text-neutral-500 hover:text-slate-700">
                        Answer
                      </p>
                      <span>{answers || 0}</span>
                    </div>
                  </div>

                  <div className="flex">
                    <div className="flex">
                      <button
                        onClick={onShare}
                        className="flex items-center gap-1 text-xs shrink-0 text-neutral-500 hover:text-slate-700"
                      >
                        <img src={share} alt="" className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="flex flex-col justify-start text-xs pl-1.5">
                      <p className="text-neutral-500 hover:text-slate-700">
                        shares
                      </p>
                      <span>{shares}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* <div className="mt-1 w-full pt-4 border-t border-neutral-200">
          <div className="mt-4" onClick={handleQuestionClick}>
            <div className="flex gap-3 items-center">
              <img
                src={answerImg || profile}
                alt={`${name}'s avatar`}
                className="w-8 h-8 rounded-full object-cover "
              />
              <div className="flex-1 flex gap-2">
                <input
                  type="text"
                  value={answerText}
                  onChange={(e) => setAnswerText(e.target.value)}
                  placeholder="Write your answer..."
                  className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm outline-none"
                  disabled={isSubmitting}
                />
                <button
                  onClick={handleSubmitAnswer}
                  disabled={!answerText.trim() || isSubmitting}
                  className={`px-3 py-0.5 bg-maincl text-white rounded-full text-sm font-medium ${
                    !answerText.trim() || isSubmitting
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-fillc"
                  }`}
                >
                  {isSubmitting ? "Submitting..." : "Answer"}
                </button>
              </div>
            </div>
          </div>
        </div> */}
      </article>
    </div>
  );
};
