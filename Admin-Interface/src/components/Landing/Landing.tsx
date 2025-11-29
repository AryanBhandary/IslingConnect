import { useNavigate } from "react-router-dom";
import background from "../../assets/Kumari.jpg";
import logo from "../../assets/logo.png";

export default function Landing() {
    const navigate = useNavigate();

  return (
    <>
      <section className="relative w-full h-screen bg-black">
        {/* Background Image */}
        <img
          src={background}
          alt="background"
          className="w-full h-screen object-cover brightness-60"
        />

        <div className="absolute inset-0 flex flex-col justify-center items-center">
          <div className="flex flex-col justify-center items-center">
            <img src={logo} alt="logo" className="w-25 h-25 rounded-3xl" />
            <h1 className="font-bold text-2xl text-white">IslingConnect</h1>
            <span className="text-white">Your all in one campus companion</span>
          </div>

          <div className="flex flex-col gap-4 justify-center mx-auto w-[30%] px-7 py-5 rounded-3xl mt-30">
            <button
                className="w-full font-bold bg-[#1D289C] text-white py-3 rounded-3xl hover:bg-[#09138aff] cursor-pointer"
                onClick={() => navigate("/login")}
              >
                Login
              </button>

              <button
                className="w-full font-bold bg-[#1D289C] text-white py-3 rounded-3xl hover:bg-[#09138aff] cursor-pointer"
              >
                Signup
              </button>
          </div>
        </div>
      </section>
    </>
  );
}
