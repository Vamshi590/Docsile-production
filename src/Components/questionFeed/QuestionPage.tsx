import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Header } from "../common/Header";
import PostComponent from "./PostComponent";

interface User {
  name: string;
  profile_picture: string;
  department: string;
  organisation_name: string;
  city?: string;
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

interface LocationState {
  questionData: QuestionData;
}

const QuestionPage: React.FC = () => {
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const location = useLocation();
  const { questionData } = (location.state as LocationState) || {};

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerWidth <= 1024) {
        if (window.scrollY > lastScrollY) {
          setVisible(false); // Hide header on scroll down
        } else {
          setVisible(true); // Show header on scroll up
        }
      }
      setLastScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);


  if (!questionData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg text-gray-600">Question not found</p>
      </div>
    );
  }

  return (
    <div className="flex bg-mainbg flex-col min-h-screen mx-auto">
      <div
        className={`bg-white border-b sticky top-0 z-50 transition-transform duration-300 ease-in-out ${
          visible ? "translate-y-0" : "-translate-y-full"
        } md:translate-y-0`}
      >
        <Header
        
        />
      </div>

      <div className="flex flex-1 px-4 lg:pl-1 max-w-7xl mx-auto w-full pt-4">
        <PostComponent questionData={questionData} />
      </div>
    </div>
  );
};

export default QuestionPage;
