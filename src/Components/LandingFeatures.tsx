import React from "react";
import mockup2 from "../assets/landing/mockup_2.svg";
import mockup3 from "../assets/landing/mockup_3.svg";
import mockup4 from "../assets/landing/mockup_4.svg";
import WordRotate from "../Components/ui/word-rotate";
import FeatureCard from "../Components/FeatureCard";

interface CardProps {
  title: string;
  points: string[];
  gradient: string;
  buttonText: string;
  imagesrc: string;
  para: string;
  isReverse: boolean;
}
const Card: React.FC<CardProps> = ({
  title,
  points,
  gradient,
  buttonText,
  imagesrc,
  para,
  isReverse,
}) => {
  return (
    <div
      className={`p-6 rounded-xl  ${gradient} flex flex-col items-start text-left max-w-full lg:max-w-6xl mx-auto lg:flex-row ${
        isReverse ? "" : "lg:flex-row-reverse"
      } lg:items-center lg:space-x-8   border border-white/20  `}
    >
      <div className="lg:w-1/2">
        <h2 className="text-xl lg:text-3xl font-mainfont font-semibold  text-gray-800">
          {title}
        </h2>

        <div className="hidden lg:flex">
          <p className="font-mainfont text-sm font-light pt-4">{para}</p>
        </div>

        <ul className="text-gray-700 font-mainfont text-sm space-y-3 my-6">
          {points.map((point, index) => (
            <li key={index} className="flex flex-row  space-x-2">
              <div className="flex flex-row items-center text-start justify-center space-x-2">
                <p className="text-blue-500">✔️</p>
                <p>{point}</p>
              </div>
            </li>
          ))}
        </ul>
        <div className="flex flex-row w-full items-center justify-end ">
          <button className="px-4 py-2  text-main font-mainfont text-end rounded-lg  transition">
            {buttonText}
          </button>
        </div>
      </div>
      <div className="lg:w-1/2 flex justify-center mb-4 lg:mb-0">
        <img
          src={imagesrc}
          alt="mockup"
          className="rounded-lg shadow-glass max-w-full lg:max-w-sm"
        />
      </div>
      
    </div>
  );
};

const LandingFeatures = () => {
  const cards = [
    {
      title: "Explore",
      points: [
        "Share knowledge, inspire, and discuss real-world medical cases.",
        "Ask questions and engage in meaningful discussions.",
        "View clinical and short videos to enhance your knowledge.",
      ],
      gradient:
        "lg:bg-gradient-to-r lg:from-white lg:via-gray-50 lg:to-white bg-gradient-to-b from-blue-50 to-white",
      buttonText: "Start Exploring ➔",
      imagesrc: mockup2,
      para: "Discover and share medical insights through real-world cases. Engage in meaningful discussions, ask questions, and inspire others. Enhance your expertise with clinical and short videos designed to boost knowledge. Explore, learn, and connect with a community passionate about advancing healthcare.",
    },
    {
      title: "Grow Your Career",
      points: [
        "Build your profile to showcase your skills and experience.",
        "Network with professionals who share your healthcare interests.",
        "Discover and apply for opportunities that match your career goals.",
      ],
      gradient: "lg:bg-gradient-to-r bg-gradient-to-b from-blue-50 to-white",
      buttonText: "Start Growing ➔",
      imagesrc: mockup3,
      para: "Showcase your skills and experience by building a standout profile. Connect with like-minded healthcare professionals and expand your network. Explore tailored opportunities to advance your career and achieve your goals in the healthcare industry.",
    },
    {
      title: "Elevate Your Skills",
      points: [
        "Attend medical conferences to gain insights and stay updated.",
        "Connect with mentors for guidance in your healthcare career.",
        "Access medical articles, research, and notes to deepen your understanding.",
      ],
      gradient:
        "lg:bg-gradient-to-r lg:from-white lg:via-gray-50 lg:to-white bg-gradient-to-b from-blue-50 to-white",
      buttonText: "Start Elevating ➔",
      imagesrc: mockup4,
      para: "Stay ahead in healthcare by attending medical conferences and gaining valuable insights. Connect with mentors for career guidance and growth. Access a wealth of medical articles, research, and notes to expand your knowledge and deepen your expertise.",
    },
  ];

  return (
    <div className="min-h-screen py-16 px-4 md:px-8">
      <div className="text-center mb-16">
        <h1 className=" text-2xl lg:text-4xl font-bold font-mainfont text-main  mb-4">
          Dive into Docsile’s possibilities
        </h1>
        <p className=" text-lg lg:text-xl font-mainfont text-gray-600">
          Here’s how we can help you
        </p>
      </div>
      <div className=" space-y-6 lg:space-y-16">
        {cards.map((card, index) => (
          <Card
            key={index}
            title={card.title}
            points={card.points}
            gradient={card.gradient}
            buttonText={card.buttonText}
            imagesrc={card.imagesrc}
            para={card.para || ""}
            isReverse={index % 2 !== 0}
          />
        ))}
      </div>

      <div className="text-center mt-20 lg:mt-40">
        <div className="lg:px-40">
          <h1 className=" text-2xl lg:text-4xl font-bold font-mainfont text-main  mb-6">
            That’s not all we offer
          </h1>
          <p className=" text-base lg:text-xl text-center font-mainfont text-gray-600 mx-auto">
            If you're an{"  "}
            <span className="inline-block align-middle">
              <WordRotate
                className=" text-lg lg:text-2xl font-bold text-main font-mainfont align-middle leading-relaxed relative -top-[3px]"
                words={[
                  "Organisation",
                  "Society",
                  "Hospital",
                  "Pharma company",
                ]}
                duration={2000}
              />
            </span>{"  "}
            looking to recruit medical professionals, share expertise, or market
            your products, we can support your goals{" "}
          </p>
        </div>
        <div className=" mt-12 lg:mt-20">
          <FeatureCard/>

        </div>
      </div>
    </div>
  );
};

export default LandingFeatures;
