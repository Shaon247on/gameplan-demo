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
import { useGetRecentPlansQuery, useGetRecentChatsQuery } from "@/store/features/ApiSlice";
import { useDispatch } from "react-redux"; // Import dispatch
import { setCurrentPlan, setCurrentChat } from "@/store/slices/chatSlice"; // Import actions

export function AppSidebar() {
  const dispatch = useDispatch(); // Use dispatch to update the state
  const { data: recentPlans, isLoading: plansLoading, error: plansError } = useGetRecentPlansQuery();
  const { data: recentChats, isLoading: chatsLoading, error: chatsError } = useGetRecentChatsQuery();

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

  const handlePlanClick = (planId: string) => {
    dispatch(setCurrentPlan(planId));  // Set the current plan when clicked
    // Optionally, you can fetch the related chat messages here
  };

  const handleChatClick = (chatId: string) => {
    dispatch(setCurrentChat(chatId));  // Set the current chat when clicked
    // Optionally, you can fetch the related chat messages here
  };

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
        
        {/* Recent Chats Section */}
        <SidebarGroupContent>
          <div className="flex items-center justify-between mb-2">
            <SidebarGroupLabel>Recent plans</SidebarGroupLabel>
            <Select defaultValue="all">
              <SelectTrigger className="w-[100px] h-6 text-xs bg-gray-100 border-none">
                <SelectValue placeholder="All Plans" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Plans</SelectItem>
                <SelectItem value="recent">Recent</SelectItem>
                <SelectItem value="favorites">Favorites</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <SidebarMenu>
            {chatsLoading ? (
              <div className="text-sm text-gray-500 px-5 py-2">Loading chats...</div>
            ) : chatsError ? (
              <div className="text-sm text-red-500 px-5 py-2">Error loading chats</div>
            ) : recentChats && recentChats.length > 0 ? (
              recentChats.map((chat) => (
                <SidebarMenuItem key={chat.id}>
                  <SidebarMenuButton asChild className="border-none">
                    <Link
                      href={`/dashboard?chatId=${chat.chat_id}`}
                      className="flex items-center justify-between border-2 pl-5 mb-2 py-2 hover:bg-gray-50"
                      onClick={() => handleChatClick(chat.chat_id)} // Handle chat click
                    >
                      <div className="flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-700 truncate max-w-32">
                          Last chat
                        </span>
                      </div>
                      <MoreHorizontal className="w-4 h-4 text-gray-400" />
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))
            ) : (
              <div className="text-sm text-gray-500 px-5 py-2">No recent chats</div>
            )}
          </SidebarMenu>
        </SidebarGroupContent>

        {/* Recent Plans Section */}
        <SidebarGroupContent>
          <div className="flex items-center justify-between mb-2">
            <SidebarGroupLabel>Recent plans</SidebarGroupLabel>
            <Select defaultValue="all">
              <SelectTrigger className="w-[100px] h-6 text-xs bg-gray-100 border-none">
                <SelectValue placeholder="All Plans" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Plans</SelectItem>
                <SelectItem value="recent">Recent</SelectItem>
                <SelectItem value="favorites">Favorites</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <SidebarMenu>
            {plansLoading ? (
              <div className="text-sm text-gray-500 px-5 py-2">Loading plans...</div>
            ) : plansError ? (
              <div className="text-sm text-red-500 px-5 py-2">Error loading plans</div>
            ) : recentPlans && recentPlans.length > 0 ? (
              recentPlans.map((plan) => (
                <SidebarMenuItem key={plan.id}>
                  <SidebarMenuButton asChild className="border-none">
                    <Link
                      href={`/dashboard?planId=${plan.id}`}
                      className="flex items-center justify-between border-2 pl-5 mb-2 py-2 hover:bg-gray-50"
                      onClick={() => handlePlanClick(plan.id)} // Handle plan click
                    >
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-700 truncate max-w-32">
                          {plan.title || "Last plan"}
                        </span>
                      </div>
                      <MoreHorizontal className="w-4 h-4 text-gray-400" />
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))
            ) : (
              <div className="text-sm text-gray-500 px-5 py-2">No recent plans</div>
            )}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </Sidebar>
  );
}
