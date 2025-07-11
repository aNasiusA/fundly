import Lottie from "react-lottie";
import animationData from "@/assets/lotties/logo head.json";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Link } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

const signupSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

const Signup = () => {
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
    setError("");

    const result = signupSchema.safeParse({ email, password });

    if (!result.success) {
      const firstError = result.error.errors[0]?.message || "Invalid input.";
      setError(firstError);
      setIsLoading(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      navigate("/");
    } catch (error: any) {
      const errorCode = error.code;
      if (errorCode === "auth/email-already-in-use") {
        setError("Email is already in use.");
      } else if (errorCode === "auth/invalid-email") {
        setError("Invalid email.");
      } else {
        setError("Signup failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 overflow-hidden">
      <div className="flex-shrink-0 mb-4">
        <Lottie options={defaultOptions} height={200} width={200} />
      </div>
      <form className="w-full max-w-sm rounded-xl shadow-xl p-6">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Create Account
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
              placeholder="Create a password"
              className="w-full p-6"
            />
          </div>

          <Button
            onClick={handleSubmit}
            disabled={isLoading || !email || !password}
            className="w-full cursor-pointer p-6"
            type="button"
          >
            {isLoading ? "Creating Account..." : "Sign Up"}
          </Button>
        </div>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?
            <Link
              to={"/signin"}
              className="text-blue-500 hover:text-blue-600 font-medium"
            >
              Sign in
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Signup;
