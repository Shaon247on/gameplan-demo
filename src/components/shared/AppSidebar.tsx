import {
  Sidebar,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/Sidebar";
import { Calendar, Home, Inbox, Plus } from "lucide-react";
import Image from "next/image";
import { Button } from "../ui/button";
import Link from "next/link";

export function AppSidebar() {
  const items = [
    {
      title: "Calendar",
      url: "/dashboard/calendar",
      icon: Calendar,
    },
    {
      title: "Create Class",
      url: "/dashboard/create-class",
      icon: Plus,
    },
  ];
  const items2 = [
    {
      title: "Home",
      url: "#",
      icon: Home,
    },
    {
      title: "Inbox",
      url: "#",
      icon: Inbox,
    },
    {
      title: "Calendar",
      url: "#",
      icon: Calendar,
    },
  ];
  return (
    <Sidebar>
      <SidebarGroup>
        <Image
          src={"/logo.png"}
          alt="logo image"
          width={158}
          height={44}
          layout="responsive"
        />
        <SidebarGroupContent>
          <SidebarMenu>
            <Link href={"/dashboard"}>
              <Button variant={"primary"} className="mb-7 mt-11">
                <Plus /> New Plans
              </Button>
            </Link>
            {items.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild className="border-none">
                  <Link
                    href={item.url}
                    className="flex items-center gap-2 justify-start border-2 pl-5 mb-2"
                  >
                    <item.icon strokeWidth={3} />
                    <span className="text-lg">{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
        <SidebarGroupContent>
          <SidebarGroupLabel>Recent plans</SidebarGroupLabel>
          <SidebarMenu>
            {items2.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild className="border-none">
                  <Link
                    href={item.url}
                    className="flex items-center gap-2 justify-start border-2 pl-5 mb-2"
                  >
                    <item.icon />
                    <span className="text-lg">{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </Sidebar>
  );
}
