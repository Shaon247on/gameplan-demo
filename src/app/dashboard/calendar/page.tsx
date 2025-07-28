"use client";

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, MapPin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface Event {
  id: string;
  title: string;
  date: number;
  day: string;
  time: string;
  type: string;
}

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date(2024, 2, 1)); // March 2024

  // Sample events data
  const events: Event[] = [
    {
      id: '1',
      title: 'untitled plan( Chat )',
      date: 15,
      day: 'FRI',
      time: '09:00Pm',
      type: 'Chat'
    },
    {
      id: '2',
      title: 'untitled plan( Text )',
      date: 15,
      day: 'FRI',
      time: '09:00Pm',
      type: 'Text'
    }
  ];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay() + 1); // Start from Monday
    
    const days = [];
    const current = new Date(startDate);
    
    // Generate 35 days (5 weeks)
    for (let i = 0; i < 35; i++) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    
    return days;
  };

  const formatMonthYear = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentDate.getMonth() && 
           date.getFullYear() === currentDate.getFullYear();
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() && 
           date.getMonth() === today.getMonth() && 
           date.getFullYear() === today.getFullYear();
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  const days = getDaysInMonth(currentDate);
  const daysOfWeek = ['Mon', 'TUE', 'WED', 'THE', 'FRI', 'SAT', 'SUN'];

  return (
    <div className="min-h-screen bg-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Calendar Section */}
        <div className="bg-white rounded-lg shadow-sm border mb-8">
          {/* Calendar Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              {formatMonthYear(currentDate)}
            </h1>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigateMonth('prev')}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-gray-700" />
              </button>
              <button
                onClick={() => navigateMonth('next')}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-gray-700" />
              </button>
            </div>
          </div>

          {/* Days of Week Header */}
          <div className="grid grid-cols-7 border-b">
            {daysOfWeek.map((day) => (
              <div
                key={day}
                className="p-4 text-center text-sm font-medium text-gray-600"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7">
            {days.map((date, index) => (
              <div
                key={index}
                className={`p-4 min-h-[80px] border-r border-b ${
                  !isCurrentMonth(date) ? 'text-gray-400' : 'text-gray-800'
                } ${
                  isToday(date) ? 'bg-blue-50 font-semibold' : ''
                }`}
              >
                <div className="text-sm font-medium">
                  {date.getDate()}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Events Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Scheduled Events</h2>
          {events.map((event) => (
            <Card key={event.id} className="shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-0">
                <div className="flex items-start">
                  {/* Date Indicator */}
                  <div className="bg-purple-600 text-white rounded-l-lg px-4 py-6 flex items-center justify-center min-w-[60px]">
                    <span className="text-xl font-bold">{event.date}</span>
                  </div>
                  
                  {/* Event Details */}
                  <div className="flex-1 p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-800 mb-1">
                          {event.title}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {event.day}: At {event.time}
                        </p>
                      </div>
                      <MapPin className="w-4 h-4 text-purple-600 flex-shrink-0 mt-1" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
