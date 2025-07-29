"use client";

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { User, Mail, Send, ChevronDown, ChevronUp } from 'lucide-react';
import { useCreatePlanMutation } from '@/store/features/ApiSlice';

interface ProfileModalsProps {
  isOpen: boolean;
  onClose: () => void;
  modalType: string;
}

export function ProfileModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl mx-auto p-6">
        <DialogHeader className="text-center mb-6">
          <DialogTitle className="text-xl font-semibold">Personal Information</DialogTitle>
        </DialogHeader>
        
        <div className="flex gap-8">
          {/* Left Section - Profile Picture and Account Type */}
          <div className="flex flex-col items-center space-y-4">
            {/* Profile Picture with Edit Icon */}
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-br from-amber-100 to-amber-200 rounded-full flex items-center justify-center overflow-hidden border-2 border-amber-300">
                <div className="w-20 h-20 bg-gradient-to-br from-amber-200 to-amber-300 rounded-full flex items-center justify-center">
                  <User className="w-10 h-10 text-amber-700" />
                </div>
              </div>
              <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-600 transition-colors shadow-lg">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </div>
            </div>
            
            {/* Name */}
            <h3 className="text-lg font-semibold text-gray-800">Ali</h3>
            
            {/* Account Type Button */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-300 rounded-sm transform rotate-45"></div>
              <span className="text-sm font-medium">Standard Account</span>
            </div>
          </div>

          {/* Right Section - Form Fields */}
          <div className="flex-1 space-y-4">
            <div>
              <Label htmlFor="fullName" className="text-sm font-medium text-gray-800">Full Name</Label>
              <div className="relative mt-1">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="fullName"
                  defaultValue="Ali"
                  className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email" className="text-sm font-medium text-gray-800">Email</Label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  defaultValue="ali@gmail.com"
                  className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="about" className="text-sm font-medium text-gray-800">About You</Label>
              <div className="relative mt-1">
                <Input
                  id="about"
                  defaultValue="Football Couch"
                  className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>

            <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-2.5 rounded-lg">
              Edit Profile
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function ManageSubscriptionModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Settings</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Subscription Details */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-800 mb-2">Subscription Details</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Plan:</span>
                <span className="font-medium">Standard</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Price:</span>
                <span className="font-medium">80$</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Expire Date:</span>
                <span className="font-medium">11/09/24</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <Button className="flex-1 bg-green-600 hover:bg-green-700">
              Update
            </Button>
            <Button variant="outline" className="flex-1 text-red-600 border-red-600 hover:bg-red-50">
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function FAQModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [expandedItems, setExpandedItems] = useState<number[]>([0]);

  const faqItems = [
    {
      question: "What should I type in text box?",
      answer: "Ans: Ask me about live sports, team stats, or subscription plans."
    },
    {
      question: "What should I type in text box?",
      answer: "Ans: Ask me about live sports, team stats, or subscription plans."
    },
    {
      question: "What should I type in text box?",
      answer: "Ans: Ask me about live sports, team stats, or subscription plans."
    }
  ];

  const toggleItem = (index: number) => {
    setExpandedItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">FAQ</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-3">
          {faqItems.map((item, index) => (
            <div key={index} className="border border-gray-200 rounded-lg">
              <button
                onClick={() => toggleItem(index)}
                className="w-full p-4 text-left flex items-center justify-between hover:bg-gray-50"
              >
                <span className="font-medium text-gray-800">{item.question}</span>
                {expandedItems.includes(index) ? (
                  <ChevronUp className="w-5 h-5 text-gray-500" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                )}
              </button>
              {expandedItems.includes(index) && (
                <div className="px-4 pb-4 text-gray-600">
                  {item.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function HelpSupportModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Help & Support</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="email" className="text-sm font-medium">Your Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="email"
                type="email"
                placeholder="Enter Email"
                className="pl-10"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description" className="text-sm font-medium">Description</Label>
            <textarea
              id="description"
              placeholder="Describe your issue..."
              className="min-h-[100px] w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500 resize-none"
            />
          </div>

          <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
            <Send className="w-4 h-4 mr-2" />
            Send
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function TermsConditionsModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Terms & Conditions</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 text-sm text-gray-600 leading-relaxed">
          <p>
            By using our service, you agree to the following terms and conditions regarding voice recordings, 
            voice-to-text transcription, and AI-driven summarization features.
          </p>
          <p>
            We collect and process voice recordings for the purpose of providing transcription services. 
            All recordings are processed using advanced AI technology to convert speech to text and generate 
            intelligent summaries of your content.
          </p>
          <p>
            Your privacy is important to us. We ensure that all voice data is handled in compliance with 
            applicable privacy laws and regulations. Voice recordings are encrypted and stored securely.
          </p>
          <p>
            The AI-driven summarization feature analyzes your content to provide relevant and accurate 
            summaries. While we strive for accuracy, the summaries are generated automatically and may 
            require human review for critical applications.
          </p>
          <p>
            You retain ownership of your content and can request deletion of your voice recordings at any time. 
            We will process such requests within 30 days of receipt.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function PrivacyModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Privacy Policy</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 text-sm text-gray-600 leading-relaxed">
          <p>
            This privacy policy describes how we collect, use, and protect your personal information, 
            including voice recordings and related data.
          </p>
          <p>
            <strong>Voice Recordings:</strong> We collect voice recordings when you use our transcription 
            services. These recordings are processed using AI technology to provide voice-to-text conversion 
            and intelligent summarization.
          </p>
          <p>
            <strong>Data Processing:</strong> Your voice data is processed securely using advanced encryption. 
            We use AI-driven summarization to provide you with relevant insights from your content.
          </p>
          <p>
            <strong>Data Storage:</strong> Voice recordings are stored securely and are only accessible to 
            authorized personnel. We implement industry-standard security measures to protect your data.
          </p>
          <p>
            <strong>Data Sharing:</strong> We do not sell, trade, or otherwise transfer your personal information 
            to third parties without your explicit consent, except as required by law.
          </p>
          <p>
            <strong>Your Rights:</strong> You have the right to access, modify, or delete your personal data 
            at any time. Contact our support team to exercise these rights.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
} 

export function PlanCreationModal() {
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false)
  const [planData, setPlanData] = useState({
    title: '',
    description: '',
    start_date: '',
    end_date: ''
  })
  
  const [createPlan, { isLoading: isCreatingPlan }] = useCreatePlanMutation()

  const handleCreatePlan = async () => {
    if (!planData.title || !planData.description) {
      console.error('Please fill in all required fields')
      return
    }

    try {
      await createPlan({
        ...planData,
        start_date: planData.start_date || new Date().toISOString(),
        end_date: planData.end_date || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      }).unwrap()
      
      console.log('Plan created successfully!')
      setIsPlanModalOpen(false)
      setPlanData({ title: '', description: '', start_date: '', end_date: '' })
    } catch (error) {
      console.error('Failed to create plan. Please try again.')
      console.error('Error creating plan:', error)
    }
  }

  return (
    <>
      {/* Plan Creation Modal */}
      <Dialog open={isPlanModalOpen} onOpenChange={setIsPlanModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Plan</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={planData.title}
                onChange={(e) => setPlanData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter plan title"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={planData.description}
                onChange={(e) => setPlanData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter plan description"
                rows={4}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="start_date">Start Date</Label>
                <Input
                  id="start_date"
                  type="date"
                  value={planData.start_date}
                  onChange={(e) => setPlanData(prev => ({ ...prev, start_date: e.target.value }))}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="end_date">End Date</Label>
                <Input
                  id="end_date"
                  type="date"
                  value={planData.end_date}
                  onChange={(e) => setPlanData(prev => ({ ...prev, end_date: e.target.value }))}
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsPlanModalOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleCreatePlan} 
              disabled={isCreatingPlan || !planData.title || !planData.description}
            >
              {isCreatingPlan ? 'Creating...' : 'Create Plan'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
} 