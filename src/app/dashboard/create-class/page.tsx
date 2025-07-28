"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Edit, List, Download, Trash2, Plus } from 'lucide-react';

type ViewState = 'empty' | 'list' | 'detail';

interface Class {
  id: string;
  name: string;
  lastModified: string;
}

interface ChatEntry {
  id: string;
  title: string;
  timestamp: string;
}

export default function CreateClassPage() {
  const [currentView, setCurrentView] = useState<ViewState>('empty');
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);

  // Sample data
  const classes: Class[] = [
    { id: '1', name: 'Cranford House Class', lastModified: '2 hours ago' },
    { id: '2', name: 'Cranford House Class', lastModified: '1 day ago' },
    { id: '3', name: 'Cranford House Class', lastModified: '3 days ago' },
    { id: '4', name: 'Cranford House Class', lastModified: '1 week ago' },
  ];

  const chatEntries: ChatEntry[] = [
    { id: '1', title: 'Last Chat', timestamp: '2 hours ago' },
    { id: '2', title: 'Last Chat', timestamp: '1 day ago' },
    { id: '3', title: 'Last Chat', timestamp: '3 days ago' },
  ];

  const handleCreateClass = () => {
    setCurrentView('list');
  };

  const handleClassSelect = (classItem: Class) => {
    setSelectedClass(classItem);
    setCurrentView('detail');
  };

  const handleBackToList = () => {
    setCurrentView('list');
    setSelectedClass(null);
  };

  const handleBackToEmpty = () => {
    setCurrentView('empty');
    setSelectedClass(null);
  };

  // Empty State View
  if (currentView === 'empty') {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center">
          <Button
            onClick={handleCreateClass}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-12 py-6 text-xl font-semibold rounded-xl shadow-lg"
          >
            Create a Class
          </Button>
        </div>
      </div>
    );
  }

  // Class List View
  if (currentView === 'list') {
    return (
      <div className="flex-1 p-8 relative">
        {/* Create New Class Button */}
        <div className="absolute top-8 right-8">
          <Button
            onClick={handleCreateClass}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create New Class
          </Button>
        </div>

        {/* Class List */}
        <div className="max-w-2xl mx-auto mt-16 space-y-4">
          {classes.map((classItem) => (
            <Button
              key={classItem.id}
              onClick={() => handleClassSelect(classItem)}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white p-6 text-left rounded-xl shadow-md"
            >
              <div className="flex-1">
                <h3 className="text-lg font-semibold">{classItem.name}</h3>
                <p className="text-sm opacity-90">{classItem.lastModified}</p>
              </div>
            </Button>
          ))}
        </div>

        {/* Action Toolbar */}
        <div className="fixed right-8 top-1/2 transform -translate-y-1/2 space-y-3">
          <Button
            variant="outline"
            size="icon"
            className="w-12 h-12 bg-white shadow-lg hover:bg-gray-50"
          >
            <Edit className="w-5 h-5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="w-12 h-12 bg-white shadow-lg hover:bg-gray-50"
          >
            <List className="w-5 h-5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="w-12 h-12 bg-white shadow-lg hover:bg-gray-50"
          >
            <Download className="w-5 h-5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="w-12 h-12 bg-white shadow-lg hover:bg-gray-50"
          >
            <Trash2 className="w-5 h-5" />
          </Button>
        </div>
      </div>
    );
  }

  // Class Detail View
  return (
    <div className="flex-1 p-8 relative">
      {/* Action Toolbar - Left Side */}
      <div className="fixed left-8 top-1/2 transform -translate-y-1/2 space-y-3">
        <Button
          variant="outline"
          size="icon"
          className="w-12 h-12 bg-white shadow-lg hover:bg-gray-50"
        >
          <Edit className="w-5 h-5" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="w-12 h-12 bg-white shadow-lg hover:bg-gray-50"
        >
          <List className="w-5 h-5" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="w-12 h-12 bg-white shadow-lg hover:bg-gray-50"
        >
          <Download className="w-5 h-5" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="w-12 h-12 bg-white shadow-lg hover:bg-gray-50"
        >
          <Trash2 className="w-5 h-5" />
        </Button>
      </div>

      {/* Chat Cards */}
      <div className="max-w-2xl mx-auto mt-16 ml-24 space-y-4">
        {chatEntries.map((chat) => (
          <Card key={chat.id} className="border-gray-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-800">{chat.title}</h3>
                  <p className="text-sm text-gray-500">{chat.timestamp}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Back Button */}
      <div className="absolute top-8 left-8">
        <Button
          onClick={handleBackToList}
          variant="outline"
          className="bg-white shadow-lg hover:bg-gray-50"
        >
          ← Back to Classes
        </Button>
      </div>
    </div>
  );
} 