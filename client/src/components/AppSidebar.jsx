import { FlameIcon, Home, LaptopMinimalIcon, LogOutIcon } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";

import Logo from "@/components/Logo";
import { Link, useLocation } from "react-router-dom";

// Menu items.
const items = [
  {
    title: "Home",
    url: "/home",
    icon: Home,
  },
  {
    title: "Jobs",
    url: "/jobs",
    icon: LaptopMinimalIcon,
  },
  {
    title: "Stats",
    url: "#",
    icon: FlameIcon,
  },
];

export function AppSidebar() {
  const location = useLocation();

  return (
    <Sidebar className="px-4 pb-2">
      <SidebarHeader>
        <Logo />
        <h3 className="mt-4 text-3xl font-semibold">
          Good morning,
          <br />
          <span className="font-bold">Shambhavi</span>!
        </h3>
      </SidebarHeader>
      <SidebarContent className="mt-6">
        <SidebarGroup>
          {/* <SidebarGroupLabel>Application</SidebarGroupLabel> */}
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                // Check if the current path matches the item URL
                // For "/jobs", also match "/jobs/:id" paths
                const isActive =
                  location.pathname === item.url ||
                  (item.url === "/jobs" &&
                    location.pathname.startsWith("/jobs/"));

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild size="lg" isActive={isActive}>
                      <Link to={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-1.5">
            <div className="bg-primary text-primary-foreground flex h-10 w-10 items-center justify-center rounded-4xl">
              SR
            </div>
            <div>
              <h3 className="font-bold">Shambhavi Rajpoot</h3>
              <p className="text-xs">HR, KPMG</p>
            </div>
            <LogOutIcon className="h-4 cursor-pointer text-red-400" />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
