import Marquee from "react-fast-marquee";

const testimonials = [
  {
    quote:
      "Through Docsile, I’ve attended top conferences and landed my dream internship",
    name: "Reviewer name",
    title: "Doctor, AIIMS",
    image: "https://via.placeholder.com/50", // Replace with the actual image URL
  },
  {
    quote:
      "Through Docsile, I’ve attended top conferences and landed my dream internship",
    name: "Reviewer name",
    title: "Doctor, AIIMS",
    image: "https://via.placeholder.com/50", // Replace with the actual image URL
  },
  {
    quote:
      "Through Docsile, I’ve attended top conferences and landed my dream internship",
    name: "Reviewer name",
    title: "Doctor, AIIMS",
    image: "https://via.placeholder.com/50", // Replace with the actual image URL
  },
  {
    quote:
      "Through Docsile, I’ve attended top conferences and landed my dream internship",
    name: "Reviewer name",
    title: "Doctor, AIIMS",
    image: "https://via.placeholder.com/50", // Replace with the actual image URL
  },
  {
    quote:
      "Through Docsile, I’ve attended top conferences and landed my dream internship",
    name: "Reviewer name",
    title: "Doctor, AIIMS",
    image: "https://via.placeholder.com/50", // Replace with the actual image URL
  },
  {
    quote:
      "Through Docsile, I’ve attended top conferences and landed my dream internship",
    name: "Reviewer name",
    title: "Doctor, AIIMS",
    image: "https://via.placeholder.com/50", // Replace with the actual image URL
  },
];

const TestimonialCard = ({
  quote,
  name,
  title,
  image,
}: (typeof testimonials)[0]) => (
  <div className="p-4 border rounded-lg shadow-md bg-white w-full max-w-sm mx-4">
    <div className="text-yellow-500 text-3xl font-serif">“</div>
    <p className="text-sm text-gray-700 mt-2 mb-4">{quote}</p>
    <div className="flex items-center space-x-3">
      <img src={image} alt={name} className="w-10 h-10 rounded-full" />
      <div>
        <h4 className="font-semibold text-gray-800">{name}</h4>
        <p className="text-xs text-gray-500">{title}</p>
      </div>
    </div>
  </div>
);

const LandingTestimonials = () => (
  <div className=" py-2 lg:py-16 px-4">
    <div className="text-center mb-16">
      <h1 className=" text-2xl lg:text-4xl font-bold font-mainfont text-main">
        Don’t take our word for it,
      </h1>
      <p className=" text-lg  lg:text-xl font-mainfont text-gray-600">
        see the Stories of Growth, Connection, and Impact{" "}
      </p>
    </div>

    <div className=" lg:px-10 overflow-hidden space-y-4 pb-8">
      <Marquee pauseOnHover={true} >
        {testimonials.map((testimonial, index) => (
          <TestimonialCard
            key={index}
            quote={testimonial.quote}
            name={testimonial.name}
            title={testimonial.title}
            image={testimonial.image}
          />
        ))}
      </Marquee>

      <Marquee pauseOnHover={true} className="hidden lg:flex" >
        {testimonials.map((testimonial, index) => (
          <TestimonialCard
            key={index}
            quote={testimonial.quote}
            name={testimonial.name}
            title={testimonial.title}
            image={testimonial.image}
          />
        ))}
      </Marquee>
    </div>
  </div>
);

export default LandingTestimonials;
