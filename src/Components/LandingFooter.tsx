import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";
import { Link } from "react-router-dom";

function LandingFooter() {
  return (
    <div className="w-full flex flex-col items-center justify-center bg-black py-4 space-y-6">
      <div className="flex flex-row items-center space-x-6 justify-center">
        <Link to={"/"}>
          <FaFacebook color="white" size={"2rem"} />
        </Link>

        <Link to={"/"}>
          <FaInstagram color="white" size={"2rem"} />
        </Link>

        <Link to={"/"}>
          <FaTwitter color="white" size={"2rem"} />
        </Link>
      </div>

      <div className="flex flex-col lg:flex-row items-center justify-center space-y-3 lg:space-x-6 ">
        <Link className="text-white text-sm font-mainfont" to={"/"}>About Us</Link>

        <Link className="text-white text-sm font-mainfont" to={"/"}>Contact</Link>

        <Link className="text-white text-sm font-mainfont" to={"/"}>FAQs</Link>

        <Link className="text-white text-sm font-mainfont" to={"/"}>Terms & Conditions</Link>

        <Link className="text-white text-sm font-mainfont" to={"/"}>Privacy Policy</Link>
      </div>

      <div className="flex flex-row items-center justify-center">
        <p className="text-sm text-white font-mainfont ">Copyright © 2025 Docsile</p>

      </div>
    </div>
  );
}

export default LandingFooter;
