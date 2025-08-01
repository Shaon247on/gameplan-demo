"use client";

import { useState, useEffect } from "react";
import { Send, Check, Menu } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";
import {
  useCreatePlanMutation,
  useUpdatePlanMutation,
  useSendMessageMutation,
} from "@/store/features/ApiSlice";
import useAccessToken from "@/hooks/useAccessToken";
import { useAppSelector } from "@/store/hooks";
import { RootState } from "@/store/store";
import { useDispatch } from "react-redux";

interface SuggestionButton {
  id: number;
  text: string;
}

export interface ChatMessage {
  message_text: string;
  id: string;
  chat_id: string;
  sender_id: string;
  receiver_id: string;
  timestamp: string;
}

const suggestionButtons: SuggestionButton[] = [
  { id: 1, text: "Help me create a project plan" },
  { id: 2, text: "I want to set personal goals" },
  { id: 3, text: "Plan a team strategy" },
  { id: 4, text: "Analyze my current progress" },
];

export default function NewPlanPage() {
  const dispatch = useDispatch()
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const { activeMessages } = useAppSelector((state: RootState) => state.chat);

  console.log("from the chatSection:",activeMessages)

  console.log("active message:", activeMessages);

  const searchParams = useSearchParams();
  const accessToken = useAccessToken();
  console.log("Access Token:", accessToken);

  // Plan-related hooks

  // console.log("Recent chats:", chatData);
  console.log("All chats:", messages);

  // Chat-related hooks
  const [sendMessage] = useSendMessageMutation();

  // Check if this is a new plan request
  useEffect(() => {
    const isNewPlan = searchParams.get("newPlan");
    if (isNewPlan === "true") {
      // Clear the chat and start fresh
      setMessages([]);
      setCurrentChatId(null);
      // Clear the URL parameter
      window.history.replaceState({}, "", "/dashboard");
    }
  }, [searchParams]);

  useEffect(() => {
    if (activeMessages?.length !== 0) {
      setMessages(activeMessages);
    } else {
      setMessages([]);
    }
  }, [activeMessages]);

  const handleSendMessage = async () => {
    console.log(inputText, "user query");

    if (inputText.trim()) {
      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        message_text: inputText,
        chat_id: currentChatId || "", // Use current chat_id
        sender_id: "user-id", // Replace with actual user ID
        receiver_id: "assistant-id", // Replace with actual assistant ID
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, userMessage]);
      const currentInputText = inputText;
      setInputText("");

      try {
        const aiResponse = await sendMessage({
          message_text: currentInputText,
        }).unwrap();

        // console.log(aiMessage, "AI response");
        setMessages((prev) => [...prev, aiResponse]);
        setCurrentChatId(aiResponse.chat_id);
      } catch (error) {
        console.error("Error getting AI response:", error);
        // Fallback response if there's an error
        const fallbackMessage: ChatMessage = {
          id: Date.now().toString(),
          message_text: "Sorry we are failed to get AI response.",
          chat_id: currentChatId || "",
          sender_id: "assistant-id", // Replace with actual assistant ID
          receiver_id: "user-id", // Replace with actual user ID
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, fallbackMessage]);
      }
    }
  };

  // const handleCreatePlan = async () => {
  //   if (messages.length === 0) return;

  //   try {
  //     // Extract the last user message as the plan title
  //     const lastUserMessage =
  //       messages.filter((msg) => msg.isUser).pop()?.text || "New Plan";

  //     const planData = {
  //       title: lastUserMessage,
  //       description: messages
  //         .map((msg) => `${msg.isUser ? "User" : "AI"}: ${msg.text}`)
  //         .join("\n"),
  //       start_date: new Date().toISOString(),
  //       end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
  //     };

  //     await createPlan(planData).unwrap();

  //     // Add a success message
  //     setMessages((prev) => [
  //       ...prev,
  //       {
  //         id: Date.now() + 2,
  //         text: "✅ Plan created successfully! You can find it in your recent plans.",
  //         isUser: false,
  //         timestamp: new Date(),
  //       },
  //     ]);
  //   } catch (error) {
  //     console.error("Error creating plan:", error);
  //     setMessages((prev) => [
  //       ...prev,
  //       {
  //         id: Date.now() + 2,
  //         text: "❌ Failed to create plan. Please try again.",
  //         isUser: false,
  //         timestamp: new Date(),
  //       },
  //     ]);
  //   }
  // };

  const handleSuggestionClick = (suggestion: string) => {
    setInputText(suggestion);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleMenuClick = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleClickOutside = (e: React.MouseEvent) => {
    if (isMenuOpen) {
      setIsMenuOpen(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Main Chat Container */}

      <div className="flex-1 flex flex-col w-full">
        {/* Chat Box */}
        <motion.div
          className="flex-1 bg-white rounded-lg p-4 md:p-6 flex flex-col"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 border-2 border-gray-400 rounded flex items-center justify-center">
                <Check className="w-4 h-4 text-gray-600" />
              </div>
            </div>
            <div className="relative">
              <button
                onClick={handleMenuClick}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Menu className="w-5 h-5 text-gray-600" />
              </button>

              {/* Dropdown Menu */}
              <AnimatePresence>
                {isMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 top-full mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-50 min-w-48"
                  >
                    <div className="py-2">
                      <button className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors text-gray-700 disabled:opacity-50">
                        Save as Plan
                      </button>
                      <button className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors text-gray-700">
                        Pin To Calendar
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto mb-4 space-y-6">
            {messages.length === 0 ? (
              // Welcome message for new chat
              <motion.div
                className="flex flex-col items-center justify-center h-full text-center space-y-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                {/* AI Assistant Icon */}
                <div className="w-20 h-20 rounded-full bg-gradient-to-r from-purple-500 to-blue-600 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-600"></div>
                  </div>
                </div>

                {/* Welcome Text */}
                <div className="max-w-md space-y-3">
                  <h2 className="text-2xl font-bold text-gray-800">
                    Welcome to GamePlan AI!
                  </h2>
                  <p className="text-gray-600 text-lg">
                    I&apos;m your AI assistant, ready to help you create amazing
                    plans and strategies. Whether you&apos;re planning a
                    project, organizing an event, or setting goals, I&apos;m
                    here to guide you every step of the way.
                  </p>
                </div>

                {/* Quick Start Options */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg w-full">
                  {/* Options for quick start */}
                </div>

                {/* Getting Started Message */}
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4 max-w-md">
                  <p className="text-purple-800 text-sm">
                    <strong>💡 Tip:</strong> Start by telling me what you&apos;d
                    like to plan or achieve. I&apos;ll help you break it down
                    into actionable steps!
                  </p>
                </div>
              </motion.div>
            ) : (
              // Existing messages
              messages.map((message) => (
                <motion.div
                  key={message.id}
                  className={`flex items-start space-x-3 ${
                    message.sender_id === "user-id"
                      ? "justify-start"
                      : "justify-end"
                  }`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {message.sender_id === "user-id" || message.sender_id !== "00000000-0000-0000-0000-000000000001"  ? (
                    <>
                      {/* User Avatar */}
                      <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0">
                        <div className="w-6 h-6 rounded-full bg-gray-400"></div>
                      </div>
                      {/* User Message */}
                      <div className="max-w-xs md:max-w-md lg:max-w-lg px-4 py-3 rounded-lg border border-gray-300 bg-white">
                        <p className="text-gray-900 text-sm">
                          {message.message_text}
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Assistant Message */}
                      <div className="max-w-xs md:max-w-md lg:max-w-lg px-6 py-4 rounded-lg border border-purple-300 bg-purple-50">
                        <p className="text-purple-900 text-sm">
                          {message.message_text}
                        </p>
                      </div>
                      {/* Assistant Avatar */}
                      <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center flex-shrink-0">
                        <div className="w-6 h-6 rounded-full bg-yellow-500"></div>
                      </div>
                    </>
                  )}
                </motion.div>
              ))
            )}
          </div>

          {/* Input Area */}
          <div className="flex items-center space-x-2 bg-white border border-gray-300 rounded-lg p-3">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type Your Text"
              className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400 text-sm md:text-base"
            />
            <button
              onClick={handleSendMessage}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Send className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Suggestion Buttons */}
          {/*  */}
          <div className="mt-4 grid grid-cols-2 gap-2 md:gap-3">
            {suggestionButtons.map((button) => (
              <Button
                className="hover:scale-[102%] transform duration-300 py-4 text-wrap text-[8px] md:text-lg"
                onClick={() => handleSuggestionClick(button.text)}
                key={button.id}
                variant={"optional"}
              >
                {button.text}
              </Button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
