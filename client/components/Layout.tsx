import { useState, useEffect } from "react";
import { Sidebar } from "./Sidebar";

import { cn } from "@/lib/utils";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Close sidebar on larger screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Main content */}
      <main
        className={cn(
          "transition-all duration-300 ease-in-out lg:ml-64",
          "min-h-screen",
        )}
      >
        <div className="p-4 pt-16 lg:p-8 lg:pt-8">{children}</div>
      </main>

      {/* Floating Action Button */}
      <FloatingActionButton />
    </div>
  );
}
