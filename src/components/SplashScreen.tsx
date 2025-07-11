import logo from "@/assets/logo.svg";

const SplashScreen = () => {
  return (
    <div className="h-screen flex items-center justify-center bg-[#E1EAE7] animate-pulse">
      <img src={logo} alt="Logo" className="w-64 h-auto" />
    </div>
  );
};

export default SplashScreen;
