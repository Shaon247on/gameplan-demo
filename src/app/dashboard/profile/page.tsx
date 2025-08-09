"use client";

import React, { useState } from 'react';
import { 
  User, 
  Settings, 
  HelpCircle, 
  HeadphonesIcon, 
  FileText, 
  Shield, 
  LogOut,
  ChevronRight,
  ArrowLeft
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useGetUserProfileQuery, useLogoutMutation } from '@/store/features/ApiSlice';
import { useMobileOnly } from '@/hooks/useMobileOnly';

interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  isRed?: boolean;
}

export default function MobileProfilePage() {
  const isMobile = useMobileOnly();
  const [activeScreen, setActiveScreen] = useState<'menu' | 'profile' | 'terms' | 'privacy' | 'faq' | 'help' | 'subscription'>('menu');
  const [userName, setUserName] = useState('Dr. Ali');
  const [userRole, setUserRole] = useState('Medicine specialist');
  const [logout] = useLogoutMutation();
  const {data} = useGetUserProfileQuery()
  console.log("User profile:", data)
  const router = useRouter();

  // Get user data from session storage
  React.useEffect(() => {
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

  // Don't render if not mobile
  if (!isMobile) {
    return null;
  }

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      console.log("Logout successful");
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
      router.push("/login");
    }
  };

  const menuItems: MenuItem[] = [
    { id: 'profile', label: 'PROFILE', icon: User },
    { id: 'settings', label: 'SETTINGS', icon: Settings },
    { id: 'faq', label: 'FAQ', icon: HelpCircle },
    { id: 'help', label: 'HELP & SUPPORT', icon: HeadphonesIcon },
    { id: 'terms', label: 'TERMS & CONDITION', icon: FileText },
    { id: 'privacy', label: 'PRIVACY', icon: Shield },
    { id: 'logout', label: 'LOG OUT', icon: LogOut, isRed: true },
  ];

  const handleMenuItemClick = (itemId: string) => {
    if (itemId === 'logout') {
      handleLogout();
    } else if (itemId === 'settings') {
      // For now, just show subscription screen
      setActiveScreen('subscription');
    } else {
      setActiveScreen(itemId as 'profile' | 'terms' | 'privacy' | 'faq' | 'help');
    }
  };

  const handleBack = () => {
    setActiveScreen('menu');
  };

  if (activeScreen === 'menu') {
    return (
      <div className="min-h-screen bg-white">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-6">
          <div className="flex items-center justify-center">
            <h1 className="text-xl font-semibold">Account</h1>
          </div>
        </div>

        {/* Menu Items */}
        <div className="px-4 py-6">
          {menuItems.map((item) => (
            <div
              key={item.id}
              onClick={() => handleMenuItemClick(item.id)}
              className={`flex items-center justify-between py-4 border-b border-gray-100 cursor-pointer ${
                item.isRed ? 'text-red-500' : 'text-gray-800'
              }`}
            >
              <div className="flex items-center space-x-3">
                <item.icon className={`w-5 h-5 ${item.isRed ? 'text-red-500' : 'text-gray-600'}`} />
                <span className="font-medium">{item.label}</span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </div>
          ))}
        </div>

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
          <div className="flex justify-around">
            <div className="flex flex-col items-center py-2">
              <div className="w-6 h-6 bg-gray-300 rounded mb-1"></div>
              <span className="text-xs text-gray-500">Home</span>
            </div>
            <div className="flex flex-col items-center py-2">
              <div className="w-6 h-6 bg-gray-300 rounded mb-1"></div>
              <span className="text-xs text-gray-500">My Classes</span>
            </div>
            <div className="flex flex-col items-center py-2">
              <div className="w-6 h-6 bg-gray-300 rounded mb-1"></div>
              <span className="text-xs text-gray-500">Chat</span>
            </div>
            <div className="flex flex-col items-center py-2">
              <div className="w-6 h-6 bg-gray-300 rounded mb-1"></div>
              <span className="text-xs text-gray-500">Schedule</span>
            </div>
            <div className="flex flex-col items-center py-2">
              <div className="w-6 h-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded mb-1"></div>
              <span className="text-xs text-blue-600 font-medium">Profile</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render different screens based on activeScreen
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="flex items-center">
          <button onClick={handleBack} className="mr-3">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-lg font-semibold text-gray-800">
            {activeScreen === 'profile' && 'Personal Information'}
            {activeScreen === 'terms' && 'Terms & Condition'}
            {activeScreen === 'privacy' && 'Privacy Policy'}
            {activeScreen === 'faq' && 'FAQ'}
            {activeScreen === 'help' && 'Help & Support'}
            {activeScreen === 'subscription' && 'Help & Support'}
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6">
        {activeScreen === 'profile' && <ProfileContent />}
        {activeScreen === 'terms' && <TermsContent />}
        {activeScreen === 'privacy' && <PrivacyContent />}
        {activeScreen === 'faq' && <FAQContent />}
        {activeScreen === 'help' && <HelpContent />}
        {activeScreen === 'subscription' && <SubscriptionContent />}
      </div>
    </div>
  );
}

// Profile Content Component
function ProfileContent() {
  return (
    <div className="space-y-6">
      {/* Profile Picture and Info */}
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          <div className="w-20 h-20 bg-gradient-to-br from-amber-100 to-amber-200 rounded-full flex items-center justify-center overflow-hidden border-2 border-amber-300">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-200 to-amber-300 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-amber-700" />
            </div>
          </div>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gray-700 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-600 transition-colors shadow-lg">
            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </div>
        </div>
        
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-800">Ali Ahmed</h3>
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium mt-2 inline-block">
            Standard Account
          </div>
        </div>
      </div>

      {/* Form Fields */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
          <input
            type="text"
            defaultValue="ali"
            className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <input
            type="email"
            defaultValue="ali@gmail.com"
            className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">About You</label>
          <input
            type="text"
            defaultValue="Football Coach"
            className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium py-3 rounded-lg mt-6">
          Edit Profile
        </button>
      </div>
    </div>
  );
}

// Terms Content Component
function TermsContent() {
  return (
    <div className="text-sm text-gray-700 leading-relaxed">
      <p className="mb-4">
        Welcome. By using our services, you agree to abide by the terms and conditions outlined below. These terms govern your access to and use of tools and services provided by our platform.
      </p>
      <p className="mb-4">
        By accessing or using our services, you agree to be bound by these terms. If you disagree with any part of these terms, then you may not access the service.
      </p>
      <p className="mb-4">
        We reserve the right to modify or replace these terms at any time. If a revision is material, we will try to provide at least 30 days notice prior to any new terms taking effect.
      </p>
      <p className="mb-4">
        Your continued use of the service after any such changes constitutes your acceptance of the new terms. If you do not agree to the new terms, please stop using the service.
      </p>
      <p className="mb-4">
        The service and its original content, features, and functionality are and will remain the exclusive property of our company and its licensors.
      </p>
              <p className="mb-4">
          The service is provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis. The company makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
        </p>
    </div>
  );
}

// Privacy Content Component
function PrivacyContent() {
  return (
    <div className="text-sm text-gray-700 leading-relaxed">
      <p className="mb-4">
        Welcome. By using our services, you agree to abide by the terms and conditions outlined below. These terms govern your access to and use of tools and services provided by our platform.
      </p>
      <p className="mb-4">
        We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.
      </p>
      <p className="mb-4">
        We collect information that you provide directly to us, such as when you create an account, make a purchase, or contact us for support. We also collect information automatically when you use our services.
      </p>
      <p className="mb-4">
        We use the information we collect to provide, maintain, and improve our services, to process transactions, to send you technical notices and support messages, and to respond to your comments and questions.
      </p>
      <p className="mb-4">
        We may share your information with third parties in certain circumstances, such as when required by law, to protect our rights, or with your consent.
      </p>
      <p className="mb-4">
        We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
      </p>
    </div>
  );
}

// FAQ Content Component
function FAQContent() {
  const [expandedItems, setExpandedItems] = useState<number[]>([]);

  const faqItems = [
    "What should I type in next box?",
    "What should I type in next box?",
    "Are you sure about the sports, team made, or subscription plans.",
    "What should I type in next box?",
    "What should I type in next box?"
  ];

  const toggleItem = (index: number) => {
    setExpandedItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  return (
    <div className="space-y-4">
      {faqItems.map((item, index) => (
        <div key={index} className="border border-gray-200 rounded-lg">
          <button
            onClick={() => toggleItem(index)}
            className="w-full flex items-center justify-between p-4 text-left"
          >
            <span className="font-medium text-gray-800">{item}</span>
            <div className={`w-5 h-5 text-gray-400 transition-transform ${
              expandedItems.includes(index) ? 'rotate-45' : ''
            }`}>
              +
            </div>
          </button>
          {expandedItems.includes(index) && (
            <div className="px-4 pb-4 text-gray-600">
              <p>This is the answer to the frequently asked question. It provides helpful information to address the user&apos;s concern.</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// Help Content Component
function HelpContent() {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
        <input
          type="email"
          defaultValue="ali@gmail.com"
          className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Write Your Problem</label>
        <textarea
          rows={6}
          placeholder="Describe your issue here..."
          className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        />
      </div>

      <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium py-3 rounded-lg mt-6">
        SEND
      </button>
    </div>
  );
}

// Subscription Content Component
function SubscriptionContent() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Subscription Details</h3>
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600">Plan:</span>
            <span className="font-medium">Standard</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600">Price:</span>
            <span className="font-medium text-lg">$80</span>
          </div>
          <div className="text-sm text-gray-500">
            expire date: 01/06/24
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <button className="w-full bg-green-500 text-white font-medium py-3 rounded-lg">
          Update
        </button>
        <button className="w-full bg-red-500 text-white font-medium py-3 rounded-lg">
          Cancel
        </button>
      </div>
    </div>
  );
} 