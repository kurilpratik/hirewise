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

// Menu items.
const items = [
  {
    title: "Home",
    url: "#",
    icon: Home,
  },
  {
    title: "All Jobs",
    url: "#",
    icon: LaptopMinimalIcon,
  },
  {
    title: "Stats",
    url: "#",
    icon: FlameIcon,
  },
];

/**
 * Render the application sidebar containing a header with logo and greeting, a navigable menu, and a user footer.
 *
 * The navigation menu is generated from the local `items` array and each entry links to its `url` and displays its `icon` and `title`.
 * The footer shows a compact user block with name, role, and a logout icon.
 *
 * @returns {JSX.Element} The sidebar JSX element.
 */
export function AppSidebar() {
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
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild size="lg">
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
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