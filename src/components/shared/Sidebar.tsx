"use client";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Plus,
  Play,
  Rss,
} from "lucide-react";
import { useSidebar } from "./SidebarContext";
import Image from "next/image";
import { Button } from "../ui/button";
import {
  useEndConversationMutation,
  useGetAllChatsQuery,
  useLazyGetChatQuery,
} from "@/store/features/ApiSlice";
import { useToken } from "@/hooks/useAuth";
import { useDispatch, useSelector } from "react-redux";
import {
  incrementGCount,
  setActiveMessages,
  setPlanId,
} from "@/store/features/chatSlice";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { RootState } from "@/store/store";
import {
  transformConversation,
  useTransformConversation,
} from "@/hooks/useTransformConversation";

interface SidebarItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  href: string;
}

interface LastMessage {
  message_text: string;
  id: string;
  chat_id: string;
  sender_id: string;
  receiver_id: string;
  timestamp: string;
}

const sidebarItems: SidebarItem[] = [
  { icon: Calendar, label: "Calendar", href: "/dashboard/calendar" },
  { icon: Plus, label: "Create Class", href: "/dashboard/create-class" },
];

export default function Sidebar() {
  const dispatch = useDispatch();
  const { isCollapsed, setIsCollapsed, animationDuration } = useSidebar();
  const [endConversation] = useEndConversationMutation();
  const [getChat] = useLazyGetChatQuery();
  const { data: allChats = [], isLoading: isChatLoading } =
    useGetAllChatsQuery();
  const router = useRouter();

  const token = useToken();
  console.log("access token:", token);
  console.log("All chats:", allChats);

  const sidebarVariants = {
    expanded: {
      width: 280,
    },
    collapsed: {
      width: 80,
    },
  };

  const contentVariants = {
    expanded: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.2,
        delay: 0.1,
      },
    },
    collapsed: {
      opacity: 0,
      x: -20,
      transition: {
        duration: 0.2,
      },
    },
  };

  const handleParticularChats = async (id: number) => {
    const response = await getChat(id).unwrap();
    if (response) {
    }
    if (response) {
      const formedArray = transformConversation(response);
      dispatch(setActiveMessages(formedArray));
      dispatch(setPlanId(response.id))
      router.push("/dashboard");
    }
  };

  const handleNewPlanClick = async () => {
    try {
      const response = await endConversation().unwrap();
      if (response) {
        sessionStorage.removeItem("chatMessages");
        dispatch(setActiveMessages([]));
        dispatch(setPlanId(response.id));
        router.push("/dashboard");
      } else dispatch(setPlanId(null));
    } catch (error) {
      console.error("Error starting a new conversation:", error);
    }
  };

  return (
    <motion.div
      className="fixed left-0 top-0 h-full bg-white border-r border-gray-200 shadow-lg z-50 hidden md:block"
      variants={sidebarVariants}
      animate={isCollapsed ? "collapsed" : "expanded"}
      initial="expanded"
      transition={{
        duration: animationDuration,
        ease: "easeInOut",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-gray-200">
        <AnimatePresence mode="wait">
          {!isCollapsed && (
            <motion.div
              key="logo"
              variants={contentVariants}
              initial="collapsed"
              animate="expanded"
              exit="collapsed"
              className="flex items-center space-x-2"
            >
              <Image
                src="/logo.png"
                alt="GamePlan Logo"
                width={158}
                height={55}
                className="w-[158px] h-[55px] object-contain"
                priority
              />
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4 text-gray-600" />
          ) : (
            <ChevronLeft className="w-4 h-4 text-gray-600" />
          )}
        </button>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 p-4 space-y-2">
        <motion.button
          onClick={handleNewPlanClick}
          className="flex items-center justify-center h-12 rounded-md bg-gradient-to-r from-[#051DA9] to-[#591DA9] text-white hover:from-[#3A40C7] hover:to-[#6F2BA7] transition-all duration-300 shadow-lg w-full mb-5"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center space-x-3">
            <Plus className="w-5 h-5 flex-shrink-0" />
            <AnimatePresence mode="wait">
              {!isCollapsed && (
                <motion.span
                  key="new-plans-text"
                  variants={contentVariants}
                  initial="collapsed"
                  animate="expanded"
                  exit="collapsed"
                  className="font-medium text-lg"
                >
                  New Plans
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </motion.button>
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          return (
            <motion.a
              key={item.href}
              href={item.href}
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors group"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Icon className="w-5 h-5 text-gray-600 group-hover:text-blue-600" />
              <AnimatePresence mode="wait">
                {!isCollapsed && (
                  <motion.span
                    key="label"
                    variants={contentVariants}
                    initial="collapsed"
                    animate="expanded"
                    exit="collapsed"
                    className="text-lg group-hover:text-blue-600"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.a>
          );
        })}
        <div className="flex flex-col gap-3">
          {isChatLoading ? (
            <>
              <span>Loading...</span>
            </>
          ) : allChats?.length > 0 ? (
            <>
              <div className="flex flex-col gap-5 items-center justify-center">
                <div className="flex items-center gap-3">
                  <h5 className="text-xl font-medium text-center">
                    Recent Chats
                  </h5>
                  <div>
                    <Select>
                      <SelectTrigger className="max-w-[97px]">
                        <SelectValue placeholder="All Chats" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">All Chats</SelectItem>
                        <SelectItem value="dark">Pined Chats</SelectItem>
                        <SelectItem value="system">Saved Chats</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                {allChats.map((item, index) => (
                  <div key={index}>
                    <Button
                      variant={"outline"}
                      onClick={() => handleParticularChats(item?.id)}
                      key={index}
                      className="w-40 overflow-hidden text-start hover:bg-amber-200 h-10"
                    >
                      {item.title}
                    </Button>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="w-full text-center">
              <p className="text-lg text-[#020202]">No Recent Chats</p>
            </div>
          )}
        </div>
      </nav>

      {/* Spacer to push button to bottom */}
      <div className="flex-1"></div>

      {/* Upgrade To Pro Section */}
      <div className="p-4 border-t border-gray-200">
        <Button
          onClick={() => console.log("Upgrade to Pro clicked")}
          variant="primary"
          className="w-full flex items-center space-x-3"
        >
          <Play className="w-5 h-5" />
          <AnimatePresence mode="wait">
            {!isCollapsed && (
              <motion.span
                key="upgrade-text"
                variants={contentVariants}
                initial="collapsed"
                animate="expanded"
                exit="collapsed"
                className="font-medium"
              >
                Upgrade To Pro
              </motion.span>
            )}
          </AnimatePresence>
        </Button>
      </div>
    </motion.div>
  );
}
