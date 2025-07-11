import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Link } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { Bell } from "lucide-react";

const Layout1 = () => {
  return (
    <SidebarProvider defaultOpen={false}>
      <div className="max-w-md mx-auto mt-4 space-y-4">
        <AppSidebar />
        <div className="flex flex-col flex-1">
          {/* Header */}
          <header className="bg-background">
            <div className="flex h-14 items-center justify-between px-4">
              {/* Menu trigger button */}
              <SidebarTrigger />

              {/* App title/logo area */}
              <div className="flex items-center gap-2">
                <Link to="/notifications">
                  <Bell />
                </Link>
              </div>
            </div>
          </header>

          {/* Content area */}
          <main className="flex-1 pt-0 p-4 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Layout1;
