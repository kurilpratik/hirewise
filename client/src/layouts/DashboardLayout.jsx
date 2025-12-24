import React from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Outlet } from "react-router-dom";

const DashboardLayout = () => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="h-screen w-full rounded-4xl border border-white bg-white">
        <SidebarTrigger className="block sm:hidden" />
        <Outlet />
      </main>
    </SidebarProvider>
  );
};

export default DashboardLayout;
