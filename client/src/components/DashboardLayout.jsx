import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";

export function DashboardLayout({ children, activeItem }) {
  return (
    <SidebarProvider>
      <AppSidebar activeItem={activeItem} />
      <SidebarInset className="bg-[#faf9f6]">{children}</SidebarInset>
    </SidebarProvider>
  );
}
