import { useState, useEffect, useRef, useCallback } from 'react';
import sharepost from  "../../assets/icon/sharepost.svg"
import askQuestion from  "../../assets/icon/askQuestion.svg"
import sharevideo from  "../../assets/icon/share video.svg"
import sharejobs from  "../../assets/icon/sharejobs.svg"
import shareresource from  "../../assets/icon/shareresource.svg"
import connectwith from  "../../assets/icon/connectwith.svg"

interface Card {
  id: number;
  title: string;
  button:string;
  imgage:string;
  description: string;
}

const InfiniteSmoothSlider = () => {
  const [cards] = useState<Card[]>([
    { id: 1, title: "Post Updates", description: "Share medical insights, case studies, and industry advancements to keep your peers informed and engaged.", button:"Share post",imgage:sharepost   },
    { id: 2, title: "Ask Questions", description: "Seek expert advice, discuss complex cases, and gain valuable perspectives from the medical community", button:" Ask a question",imgage:askQuestion },
    { id: 3, title: "Share Short Videos ", description: "Post quick medical tips, procedural guides, and research highlights in an easy-to-consume format.", button:" Share video",imgage:sharevideo  },
    { id: 4, title: "Access & Share Resources", description: "Upload and explore medical notes, research papers, clinical guidelines, and essential industry updates.", button:" Share job",imgage:shareresource   },
    { id: 5, title: "Discover Career Opportunities", description: "Find job openings, internships, and fellowships tailored for healthcare professionals.", button:" Share resource",imgage:sharejobs   },
    { id: 6, title: "Connect with Experts & Peers", description: "Build meaningful connections with specialists, researchers, and like-minded professionals.", button:"Connect ",imgage:connectwith  },
  ]);

  const [visibleCards, setVisibleCards] = useState<Card[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const slideIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Initialize with duplicated cards for infinite scroll effect
    const duplicatedCards = [...cards, ...cards, ...cards];
    setVisibleCards(duplicatedCards);
    setActiveIndex(cards.length); // Start from the middle set
  }, [cards]);

  const handleTransitionEnd = () => {
    if (activeIndex >= cards.length * 2) {
      // If we've moved past the second set, jump back to the middle set without animation
      setIsTransitioning(true);
      setActiveIndex(cards.length);
      setTimeout(() => setIsTransitioning(false), 0);
    } else if (activeIndex < cards.length) {
      // If we've moved before the first set, jump to the middle set without animation
      setIsTransitioning(true);
      setActiveIndex(cards.length * 2 - 1);
      setTimeout(() => setIsTransitioning(false), 0);
    }
  };


  const nextSlide = useCallback(() => {
    if (!isTransitioning) {
      setActiveIndex(prev => prev + 1);
    }
  }, [isTransitioning]);

  useEffect(() => {
    if (!isPaused) {
      slideIntervalRef.current = setInterval(nextSlide, 6000);
    }
    return () => {
      if (slideIntervalRef.current) {
        clearInterval(slideIntervalRef.current);
      }
    };
  }, [isPaused, isTransitioning, nextSlide]);

  if (visibleCards.length === 0) return null;

  return (
    <div className="w-full mx-auto">
  <div
    className="relative overflow-hidden rounded-lg  "
    onMouseEnter={() => setIsPaused(true)}
    onMouseLeave={() => setIsPaused(false)}
  >
    <div
      ref={containerRef}
      className="flex"
      style={{
        transform: `translateX(-${activeIndex * 100}%)`,
        transition: isTransitioning ? "none" : "transform 1000ms ease-out",
      }}
      onTransitionEnd={handleTransitionEnd}
    >
      {visibleCards.map((card, index) => (
        <div key={`${card.id}-${index}`} className="relative w-full h-[150px] flex-shrink-0 font-fontsm" >
          <div className="absolute border-2 border-gray-100 bg-white p-3 rounded-xl   w-full h-[155px ] flex  items-center">
            <div className="w-36  flex justify-center items-center">
              <img src={card.imgage} alt="" className="max-w-full max-h-full object-contain" />
            </div>
            <div className="flex flex-col items-start pl-2 mt-2 ">
              <h3 className="text-xs font-normal text-gray-800">{card.title}</h3>
              <p className="text-gray-500 text-fontlit">{card.description}</p>
              <button className="px-3 py-1 mt-2 text-fontlit text-white bg-maincl rounded-xl">{card.button}</button>
            </div>
          </div>
        </div>
      ))}
    </div>

    <div className="flex justify-center space-x-2 ">
      {cards.map((_, idx) => (
        <button
          key={idx}
          className={`w-1 h-1 rounded-full transition-colors duration-500 ${
            idx === activeIndex % cards.length ? "bg-maincl" : "bg-gray-300"
          }`}
          onClick={() => setActiveIndex(idx + cards.length)}
          aria-label={`Go to slide ${idx + 1}`}
        />
      ))}
    </div>
  </div>
</div>
  );
};

export default InfiniteSmoothSlider;