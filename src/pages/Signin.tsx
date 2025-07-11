import Lottie from "react-lottie";
import animationData from "@/assets/lotties/logo head.json";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Link } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useNavigate } from "react-router-dom";

const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const defaultOptions = {
    loop: false,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log("User signed in:", user);
        navigate("/");
      })
      .catch((error) => {
        const errorCode = error.code;

        if (errorCode === "auth/invalid-credential") {
          setError("Invalid Credentials");
        } else if (errorCode.startsWith("auth/")) {
          setError("Could not login");
        } else {
          setError("Something went wrong");
        }

        setTimeout(() => {
          setError("");
        }, 2000);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 overflow-hidden">
      <div className="flex-shrink-0 mb-4">
        <Lottie options={defaultOptions} height={200} width={200} />
      </div>
      <div className="w-full max-w-sm rounded-xl shadow-xl p-6">
        <h1 className="text-2xl font-bold text-center mb-3 text-gray-800">
          Sign into your Account
        </h1>
        <p className="text-center text-red-500">{error}</p>

        <div className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Email Address
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full p-6"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Password
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full p-6"
            />
          </div>

          <Button
            onClick={handleSubmit}
            disabled={isLoading || !email || !password}
            className="w-full cursor-pointer p-6"
            type="button"
          >
            {isLoading ? "Signing into Account..." : "Sign In"}
          </Button>
        </div>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?
            <Link
              to={"/signup"}
              className="text-blue-500 hover:text-blue-600 font-medium"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signin;
