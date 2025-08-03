"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { classSchema } from "@/schema/classSchema"; // Zod schema for validation
import {
  useCreateClassMutation,
  useDeleteClassMutation,
  useUpdateClassMutation,
  useGetClassesQuery,
  useGetParicularChatsQuery,
  useGetAllChatsQuery,
  useLazyGetMultiplePlansQuery,
} from "@/store/features/ApiSlice"; // RTK Query hooks

// Types for Class and Chat
interface Class {
  id: string;
  name: string;
  lastModified: string;
  plan_ids: string[]; // This holds the plan ids
}

interface Chat {
  id: string;
  last_message: {
    message_text: string;
    timestamp: string;
  };
}

export default function CreateClassPage() {
  const [currentView, setCurrentView] = useState<"empty" | "list" | "detail">(
    "empty"
  );
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [sortedChats, setSortedChats] = useState<any[]>([]);

  const [fetchedProducts, setFetchedProducts] = useState<any[]>([]); // State to store fetched products
  const [productIdsToFetch, setProductIdsToFetch] = useState<string[]>([]);
  const [productsData, setProductsData] = useState<any[]>([]);
  const [activePackage, setActivePackage] = useState<string | null>(null);
  const [fetchedData, setFetchedData] = useState<{
    packageName: string;
    planIds: string[];
    error?: string;
    data?: any;
    timestamp: string;
    status: string;
  }[]>([]);

  const { data: classes = [], isLoading: classesLoading } =
    useGetClassesQuery(); // Default classes to an empty array if undefined
  const { data: chats, isLoading: chatsLoading } = useGetAllChatsQuery(); // Fetch chats for the select dropdown
  const [createClass] = useCreateClassMutation();
  const [updateClass] = useUpdateClassMutation();
  const [deleteClass] = useDeleteClassMutation();

  const [fetchMultiplePlans, { isLoading }] = useLazyGetMultiplePlansQuery();

  // console.log("chats in class form:", chats)

  console.log("Fetched chat:", fetchedProducts);

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: zodResolver(classSchema), // Zod validation
    defaultValues: {
      title: "",
      description: "",
      schedule_info: "",
      chat_ids: "",
    },
  });

  // Function to fetch chats for selected class

  const handleCreateClassForm = (data: any) => {
    const classData = {
      title: data.title,
      description: data.description,
      schedule_info: data.schedule_info,
      chat_ids: [data.chat_ids],
    };
    console.log(classData);
    createClass(classData);
    setCurrentView("list");
  };

  const handleUpdateClassForm = (data: any) => {
    if (selectedClass) {
      updateClass({ classId: selectedClass.id, updatedClass: data });
    }
    setCurrentView("list");
  };

  const handleDeleteClass = (classId: string) => {
    deleteClass(classId);
    setCurrentView("list");
  };

  const handleClassSelect = (classItem: Class) => {
    setSelectedClass(classItem);
    setProductIdsToFetch(classItem.plan_ids);
    setCurrentView("detail");
  };

  const handleBackToList = () => {
    setCurrentView("list");
    setSelectedClass(null);
  };

  const handleBackToEmpty = () => {
    setCurrentView("empty");
    setSelectedClass(null);
  };

  const handleFetchPlans = async (planIds: string[], packageName: string, classItem: any) => {
    setActivePackage(packageName); // Track which package is being fetched

    try {
      // 1. Fetch data using RTK Query
      const result = await fetchMultiplePlans(planIds).unwrap();

      // 2. Update internal state with SUCCESS data
      setFetchedData({
        packageName, // Which package was clicked
        planIds, // Array of plan IDs that were fetched
        data: result, // The actual API response data
        timestamp: new Date().toLocaleTimeString(), // When it happened
        status: "success",
      });
       setSelectedClass(classItem);
    setProductIdsToFetch(planIds);
    setCurrentView("detail");
    } catch (error) {
      console.error("Error fetching plans:", error);

      // 3. Update internal state with ERROR data
      setFetchedData({
        packageName,
        planIds,
        error: error.message || "Failed to fetch plans", // Error message instead of data
        timestamp: new Date().toLocaleTimeString(),
        status: "error",
      });
    } finally {
      setActivePackage(null); // Clear active package
    }
  };

  // Empty State View
  if (currentView === "empty") {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center">
          <Button
            onClick={() => setCurrentView("list")}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-12 py-6 text-xl font-semibold rounded-xl shadow-lg"
          >
            Create a Class
          </Button>
        </div>
      </div>
    );
  }

  // Class List View
  if (currentView === "list") {
    if (classesLoading || chatsLoading) {
      return (
        <div className="flex-1 flex items-center justify-center p-8">
          <div>Loading...</div>
        </div>
      );
    }

    return (
      <div className="flex-1 p-8 relative">
        <div className="absolute top-8 right-8">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg">
                <Plus className="w-4 h-4 mr-2" />
                Create New Class
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogTitle>Create New Class</DialogTitle>
              <DialogHeader>Create New Class</DialogHeader>
              <form
                onSubmit={handleSubmit(handleCreateClassForm)}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Title
                  </label>
                  <input
                    {...control.register("title")}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                    placeholder="Class Title"
                  />
                  {errors.title && (
                    <span className="text-red-500">{errors.title.message}</span>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    {...control.register("description")}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                    placeholder="Class Description"
                  />
                  {errors.description && (
                    <span className="text-red-500">
                      {errors.description.message}
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Schedule Info
                  </label>
                  <input
                    {...control.register("schedule_info")}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                    placeholder="Schedule Info"
                  />
                  {errors.schedule_info && (
                    <span className="text-red-500">
                      {errors.schedule_info.message}
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Chats
                  </label>
                  <Controller
                    control={control}
                    name="chat_ids"
                    render={({ field }) => (
                      <Select onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Chats" />
                        </SelectTrigger>
                        <SelectContent className="max-w-40">
                          {chats?.map((chat) => (
                            <SelectItem
                              key={chat.id}
                              value={chat.last_message?.chat_id}
                            >
                              {`${chat.last_message?.message_text.slice(
                                0,
                                13
                              )}...` || `Chat ${chat.id}`}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.chat_ids && (
                    <span className="text-red-500">
                      {errors.chat_ids.message}
                    </span>
                  )}
                </div>

                <DialogFooter>
                  <Button
                    type="submit"
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg"
                  >
                    Create Class
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="max-w-2xl mx-auto mt-16 space-y-4">
          {classes.length === 0 ? (
            <div>No classes available</div>
          ) : (
            classes.map((classItem) => (
              <Button
                key={classItem.id}
                onClick={() => handleFetchPlans(classItem.plan_ids || [], classItem.title, classItem)}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white p-6 text-left rounded-xl shadow-md"
              >
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{classItem.title}</h3>
                  <p className="text-sm opacity-90">{classItem.description}</p>
                </div>
              </Button>
            ))
          )}
        </div>
      </div>
    );
  }

  // Class Detail View (with chats loading dynamically)
  if (selectedClass) {
    return (
      <div className="flex-1 p-8 relative">
        <div className="max-w-2xl mx-auto mt-16">
          <Card className="border-gray-200 shadow-sm">
            <CardContent>
              <h3 className="text-lg font-medium">{selectedClass?.name}</h3>
              <p className="text-sm">{selectedClass?.lastModified}</p>
            </CardContent>
          </Card>

          {/* Display chats */}
          {fetchedData?.length === 0 ? (
            <div>No saved chats available for this class.</div>
          ) : (
            fetchedData?.map((chat, index) => (
              <Card key={index} className="my-4 border-gray-200 shadow-sm">
                <CardContent>
                  <h4 className="text-md font-medium">{chat.message_text}</h4>
                  <p className="text-sm">
                    {new Date(chat.timestamp).toLocaleString()}
                  </p>
                </CardContent>
              </Card>
            ))
          )}

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

  return null;
}
