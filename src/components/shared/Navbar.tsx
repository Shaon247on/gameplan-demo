"use client";

import React, { useState, useEffect } from "react";
import {
  Bell,
  ChevronDown,
  User,
  Settings,
  HelpCircle,
  FileText,
  Shield,
  LogOut,
  Moon,
} from "lucide-react";
import { useAuthContext } from "@/components/auth/AuthProvider";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useLogoutMutation } from "@/store/features/ApiSlice";
import {
  ProfileModal,
  ManageSubscriptionModal,
  FAQModal,
  HelpSupportModal,
  TermsConditionsModal,
  PrivacyModal,
} from "@/components/modals/ProfileModals";

interface ProfileMenuItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  href?: string;
  action?: () => void;
  isRed?: boolean;
}

export default function Navbar() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [userName, setUserName] = useState('Dr. Ali');
  const [userRole, setUserRole] = useState('Medicine specialist');
  const { user } = useAuthContext();
  const [logout] = useLogoutMutation();
  const router = useRouter();

  // Get user data from session storage
  useEffect(() => {
    const storedProfile = sessionStorage.getItem('userProfile');
    const storedEmail = sessionStorage.getItem('userEmail');
    
    if (storedProfile) {
      try {
        const profile = JSON.parse(storedProfile);
        setUserName(profile.name || 'Dr. Ali');
        setUserRole(profile.role || 'Medicine specialist');
      } catch (error) {
        console.error('Error parsing user profile:', error);
      }
    } else if (storedEmail) {
      setUserName(storedEmail.split('@')[0] || 'Dr. Ali');
    }
  }, []);

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      console.log("Logout successful");
      router.push("/login");
      setIsProfileOpen(false);
    } catch (error) {
      console.error("Logout error:", error);
      // Even if the API call fails, clear local state and redirect
      router.push("/login");
      setIsProfileOpen(false);
    }
  };

  const handleModalOpen = (modalType: string) => {
    // Check if we're on mobile and redirect to mobile profile page
    if (window.innerWidth < 768) {
      router.push('/dashboard/profile');
      return;
    }
    
    setActiveModal(modalType);
    setIsProfileOpen(false);
  };

  const handleModalClose = () => {
    setActiveModal(null);
  };

  const profileMenuItems: ProfileMenuItem[] = [
    { icon: User, label: "PROFILE", action: () => handleModalOpen("profile") },
    {
      icon: Settings,
      label: "MANAGE SUBSCRIPTION",
      action: () => handleModalOpen("subscription"),
    },
    { icon: HelpCircle, label: "FAQ", action: () => handleModalOpen("faq") },
    {
      icon: HelpCircle,
      label: "HELP & SUPPORT",
      action: () => handleModalOpen("support"),
    },
    {
      icon: FileText,
      label: "TERMS & CONDITIONS",
      action: () => handleModalOpen("terms"),
    },
    {
      icon: Shield,
      label: "PRIVACY",
      action: () => handleModalOpen("privacy"),
    },
    { icon: LogOut, label: "Log Out", action: handleLogout, isRed: true },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 px-2 md:px-6 py-2 md:py-3 lg:py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-semibold text-gray-800">Dashboard</h1>
        </div>

        <div className="flex items-center space-x-4">
          <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative">
            <Bell className="w-5 h-5 text-gray-600" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
          </button>

          {/* User Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-gray-800">
                    {userName}
                  </p>
                  <p className="text-xs text-gray-500">
                    {userRole}
                  </p>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-gray-600 transition-transform ${
                    isProfileOpen ? "rotate-180" : ""
                  }`}
                />
              </div>
            </button>

            {/* Profile Dropdown Menu */}
            <AnimatePresence>
              {isProfileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
                >
                  <div className="p-4">
                    {/* User Info Header */}
                    <div className="flex items-center space-x-3 mb-4 pb-4 border-b border-gray-200">
                      <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">
                          {user?.name || "Dr. Ali"}
                        </p>
                        <p className="text-sm text-gray-500">
                          {user?.role || "Medicine specialist"}
                        </p>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="space-y-1">
                      {profileMenuItems.map((item, index) => {
                        const Icon = item.icon;
                        return (
                          <button
                            key={index}
                            onClick={() => {
                              if (item.action) {
                                item.action();
                              }
                            }}
                            className={`w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left ${
                              item.isRed
                                ? "text-red-600 hover:text-red-700"
                                : "text-gray-700 hover:text-gray-900"
                            }`}
                          >
                            <Icon
                              className={`w-5 h-5 ${
                                item.isRed ? "text-red-600" : "text-gray-500"
                              }`}
                            />
                            <span className="text-sm font-medium">
                              {item.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Dark Mode Toggle */}
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Moon className="w-5 h-5 text-gray-500" />
                          <span className="text-sm font-medium text-gray-700">
                            MOOD
                          </span>
                        </div>
                        <button
                          onClick={() => setIsDarkMode(!isDarkMode)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            isDarkMode ? "bg-purple-600" : "bg-gray-200"
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              isDarkMode ? "translate-x-6" : "translate-x-1"
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Modals */}
      <ProfileModal
        isOpen={activeModal === "profile"}
        onClose={handleModalClose}
      />
      <ManageSubscriptionModal
        isOpen={activeModal === "subscription"}
        onClose={handleModalClose}
      />
      <FAQModal isOpen={activeModal === "faq"} onClose={handleModalClose} />
      <HelpSupportModal
        isOpen={activeModal === "support"}
        onClose={handleModalClose}
      />
      <TermsConditionsModal
        isOpen={activeModal === "terms"}
        onClose={handleModalClose}
      />
      <PrivacyModal
        isOpen={activeModal === "privacy"}
        onClose={handleModalClose}
      />
    </nav>
  );
}
