import { Outlet, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "./ui/button";

const Layout2 = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="max-w-md mx-auto mt-4 space-y-4">
      <div className="flex flex-col flex-1">
        <header className="bg-background">
          <div className="flex h-14 items-center justify-between px-4">
            <div className="flex items-center gap-2">
              <Button
                onClick={handleBack}
                className="cursor-pointer shadow w-10 h-10 rounded-full flex items-center justify-center"
              >
                <ArrowLeft />
              </Button>
            </div>
          </div>
        </header>
        <main className="flex-1 pt-0 p-4 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout2;
