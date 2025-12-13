import { useNavigate } from "react-router-dom";
import background from "../../assets/Kumari.jpg";
import logo from "../../assets/logo.png";
import { FaArrowLeft } from "react-icons/fa";
import { useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSublit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      alert("Fill in all the fields");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5001/api/auth/login",
        { email, password }
      );

      const {token, user} = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify( user ));

      const decoded: any = jwtDecode(token);
      const role = decoded.role;

      if (role === "admin") {
        navigate("/admin");
      } 
      else if (role === "ss_admin") {
        navigate("/ss_admin");
      } 
      else if (role === "lf_admin") {
        navigate("/lf_admin");
      } 
      else if (role === "it_admin") {
        navigate("/it_admin");
      } 
      else if (role === "pat_admin") {
        navigate("/pat_admin");
      } 
      else if (role === "user") {
        return alert("Invalid user. Access denied.");
      } 
      else {
        return alert("User not found.");
      }
    } catch (err: any) {
      alert(err.response?.data?.message || "Login failed. Try again");
    }
  };

  return (
    <>
      <section className="relative w-full h-screen">
        {/* Background Image */}
        <img
          src={background}
          alt="background"
          className="w-full h-screen object-cover brightness-60"
        />
        <div
          className="z-10 absolute top-5 left-5 text-[#1e30ffff] text-xl cursor-pointer"
          onClick={() => navigate(-1)}
        >
          <FaArrowLeft />
        </div>

        <div className="absolute inset-0 flex flex-col align-center justify-center items-center">
          <div className="flex flex-col justify-center items-center mx-auto mb-10">
            <img src={logo} alt="logo" className="w-25 h-25 rounded-3xl" />
            <h1 className="font-bold text-2xl text-white">IslingConnect</h1>
            <span className="text-white">Your all in one campus companion</span>
          </div>

          <div className="flex flex-col justify-center items-center mx-auto mb-5">
            <h1 className="font-bold text-xl text-[#A0A0A0]">Welcome Back!</h1>
            <span className="font-sm text-[#A0A0A0]">
              Please enter your credentials.
            </span>
          </div>

          <div className="flex justify-center mx-auto w-[30%] px-7 py-5 rounded-3xl">
            <form
              onSubmit={handleSublit}
              className="flex flex-col w-full gap-4"
            >
              <div className="flex flex-col">
                <label className="text-white">Email</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  name="email"
                  value={email}
                  autoComplete="off"
                  onChange={(e) => setEmail(e.target.value)}
                  className="p-3 text-sm rounded-xl outline-none bg-[rgba(255,255,255,0.2)] backdrop-blur-md text-white placeholder-white/70"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-white">Password</label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  name="password"
                  value={password}
                  autoComplete="off"
                  onChange={(e) => setPassword(e.target.value)}
                  className="p-3 text-sm rounded-xl outline-none bg-[rgba(255,255,255,0.2)] backdrop-blur text-white placeholder-white/70"
                />
              </div>

              <button
                type="submit"
                className="mt-2 font-bold bg-[#1D289C] text-white py-3 rounded-3xl hover:bg-[#09138aff] cursor-pointer"
              >
                Login
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
