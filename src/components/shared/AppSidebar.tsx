import {
  Sidebar,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/Sidebar";
import { Calendar, Home, Inbox, Plus, MoreHorizontal, FileText, MessageSquare } from "lucide-react";
import Image from "next/image";
import { Button } from "../ui/button";
import Link from "next/link";
import { useGetRecentPlansQuery } from "@/store/features/ApiSlice";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { setCurrentChat, setCurrentPlan } from "@/store/features/chatSlice";
import { useDispatch } from "react-redux";

export function AppSidebar() {
  const dispatch = useDispatch();

  const handlePlanClick = (planId: string) => {
    // Update the store with the selected plan ID
    dispatch(setCurrentPlan(planId));
  };

  const handleChatClick = (chatId: string) => {
    // Update the store with the selected chat ID
    dispatch(setCurrentChat(chatId));
  };
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
        
        <div>
          hello
        </div>

        {/* Upgrade To Pro Button */}
        <div className="mt-auto p-4">
          <Button variant="primary" className="w-full">
            Upgrade To Pro
          </Button>
        </div>
      </SidebarGroup>
    </Sidebar>
  );
}
