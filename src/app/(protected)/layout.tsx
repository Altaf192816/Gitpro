import { SidebarProvider } from "@/components/ui/sidebar";
import { UserButton } from "@clerk/nextjs";
import { AppSidebar } from "./app-sidebar.tsx/AppSidebar";
import { Button } from "@/components/ui/button";
import { GithubIcon, Link, Link2 } from "lucide-react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="m-2 w-full">
        <div className="border-sidebar-border bg-sidebar flex items-center gap-2 rounded-md border px-4 py-2 shadow">
          <div className="ml-auto min-h-5"></div>
          <Button title="Explore with git-pro">
            <a href="https://precious-duckanoo-206c00.netlify.app" target="_blank" className="min-w-fit">Explore</a>
          </Button>
          <UserButton />
        </div>
        <div className="h-4"></div>
        <div className="border-sidebar-border bg-sidebar h-[calc(100dvh-5rem)] overflow-y-auto rounded-md border p-4 shadow">
          {children}
        </div>
      </main>
    </SidebarProvider>
  );
};

export default Layout;
