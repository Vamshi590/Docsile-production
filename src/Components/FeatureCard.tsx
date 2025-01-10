import mockup5 from "../assets/landing/mockup_5.svg";
import mockup6 from "../assets/landing/mockup_6.svg";
import mockup7 from "../assets/landing/mockup_7.svg";

interface CardProps {
  title: string;
  description: string;
  gradient: string;
  buttonText: string;
  imagesrc: string;
}

const Card: React.FC<CardProps> = ({
  title,
  gradient,
  buttonText,
  imagesrc,
  description,
}) => {
  return (
    <div
      className={`p-6 rounded-xl ${gradient} flex flex-col  justify-center text-left w-full mx-auto backdrop-blur-md bg-opacity-30`}
    >
      <div className="lg:w-full">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">{title}</h2>
        <p className="font-mainfont text-sm mb-4">{description}</p>
        <div className="flex flex-row w-full items-center justify-end ">
          <button className="px-4 py-2  text-main font-mainfont text-end rounded-lg  transition">
            {buttonText}
          </button>
        </div>
      </div>
      <div className="flex justify-center items-center mt-4 lg:w-full">
        <img src={imagesrc} alt="mockup" className="rounded-lg max-w-full" />
      </div>
    </div>
  );
};

const FeatureCard = () => {
  const cards = [
    {
      title: "Market your Products",
      description:
        "Reach customers directly by marketing your products via the app",
      gradient: "bg-gradient-to-b from-blue-50 to-white",
      buttonText: "Market now ➔",
      imagesrc: mockup7,
    },
    {
      title: "Post a Job",
      description:
        "Discover and hire the best fit for your requirements from a pool of profiles",
      gradient: "bg-gradient-to-b from-yellow-50 to-white",
      buttonText: "Post now ➔",
      imagesrc: mockup6,
    },
    {
      title: "Host Events",
      description:
        "Organize seminars and conferences to share knowledge and expertise",
      gradient: "bg-gradient-to-b from-blue-50 to-white",
      buttonText: "Host now ➔",
      imagesrc: mockup5,
    },
  ];

  return (
    <div className="flex flex-col lg:flex-row lg:space-x-6 lg:items-stretch space-y-3">
      {cards.map((card, index) => (
        <Card
          key={index}
          title={card.title}
          gradient={card.gradient}
          buttonText={card.buttonText}
          imagesrc={card.imagesrc}
          description={card.description}
        />
      ))}
    </div>
  );
};

export default FeatureCard;
