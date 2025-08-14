"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Plus } from "lucide-react";
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
  useGetAllChatsQuery,
  useLazyGetMultiplePlansQuery,
  useLazyGetChatQuery,
  Conversation,
} from "@/store/features/ApiSlice"; // RTK Query hooks
import { title } from "process";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { setActiveMessages } from "@/store/features/chatSlice";
import { transformConversation } from "@/hooks/useTransformConversation";
import { Separator } from "@/components/ui/separator";

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
  const [currentView, setCurrentView] = useState<"list" | "detail">("list");
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [productIdsToFetch, setProductIdsToFetch] = useState<string>("");
  const [activePackage, setActivePackage] = useState<string | null>(null);

  const [fetchedData, setFetchedData] = useState<Conversation>({
    id: 0,
    title: "",
    conversation: [
      {
        role: "",
        content: "",
      },
    ],
    is_saved: false,
    pinned_date: "",
    created_at: "",
    updated_at: "",
  });

  const { data: classes = [], isLoading: classesLoading } =
    useGetClassesQuery(); // Default classes to an empty array if undefined
  const { data: chats } = useGetAllChatsQuery(); // Fetch chats for the select dropdown
  const [createClass] = useCreateClassMutation();
  const [updateClass] = useUpdateClassMutation();
  const [deleteClass] = useDeleteClassMutation();
  const [getChat] = useLazyGetChatQuery();
  const dispatch = useDispatch();
  const router = useRouter();

  const [fetchMultiplePlans, { isLoading }] = useLazyGetMultiplePlansQuery();

  console.log("class data", classes.results);
  console.log("Chat in class", fetchedData);
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: zodResolver(classSchema), // Zod validation
    defaultValues: {
      title: "",
      nodes: "",
    },
  });

  // Function to fetch chats for selected class

  const handleCreateClassForm = (data: {title: string; nodes: string;}) => {
    console.log("setting data from class submite:",data)

    const classData = {
      title: data.title,
      nodes: data.nodes
    };
    console.log(classData);
    createClass(classData);
    setCurrentView("list");

  };

  const handleParticularChats = async (id: number) => {
    console.log("receiving chatID:", id);
    if (!id) return;

    const response = await getChat(id).unwrap();

    console.log("Particular chat response:", response);
    if (response) {
      const transformedChat = transformConversation(response)
      dispatch(setActiveMessages(transformedChat));
      router.push("/dashboard");
    }
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
    setSelectedClass(null);
  };

  const handleFetchPlans = async (
    planId: number,
    packageName: string,
    classItem: any
  ) => {
    setActivePackage(packageName); // Track which package is being fetched

    if (planId === null) {
      setSelectedClass(classItem);
      // setProductIdsToFetch(planIds);
      setCurrentView("detail");
    } else {
      try {
        // 1. Fetch data using RTK Query
        // const result = await fetchMultiplePlans(planIds).unwrap();
        const result = await getChat(planId).unwrap();
        console.log("on select class data:", result);
        // 2. Update internal state with SUCCESS data
        if (result) {
          setFetchedData(result);
          setSelectedClass(classItem);
          setProductIdsToFetch(planId);
          setCurrentView("detail");
        }
      } catch (error: any) {
        console.error("Error fetching plans:", error);

        // 3. Update internal state with ERROR data
        setFetchedData({
          id: 0,
          title: "",
          conversation: [
            {
              role: "",
              content: "",
            },
          ],
          is_saved: false,
          pinned_date: "",
          created_at: "",
          updated_at: "",
        });
      } finally {
        setActivePackage(null); // Clear active package
      }
    }
  };
  if (currentView === "list") {
    if (classesLoading) {
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
            <DialogContent className="max-w-lg">
              <DialogTitle>Create New Class</DialogTitle>
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
                    Nodes
                  </label>
                  <textarea
                    {...control.register("nodes")}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                    placeholder="Class nodes"
                  />
                  {errors.nodes && (
                    <span className="text-red-500">
                      {errors.nodes.message}
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

        <div className="mt-16 space-y-4 flex items-center gap-9">
          {classes?.results?.length === 0 ? (
            <div>No classes available</div>
          ) : (
            classes?.results?.map((classItem) => (
              <Button
                key={classItem.id}
                onClick={() =>
                  handleFetchPlans(classItem.plan, classItem.title, classItem)
                }
                className="md:size-40 mb-0 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 p-6 text-white rounded-xl shadow-md "
              >
                <div className="w-full h-full text-left">
                  <h3 className="text-lg text-wrap font-semibold mb-2">
                    {classItem.title}
                  </h3>
                  <p className="text-xs opacity-90 text-wrap">
                    {classItem.notes.slice(0, 35)}
                  </p>
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
      <div className="p-4 relative">
        <Button
          onClick={handleBackToList}
          variant="outline"
          className="bg-white shadow-lg hover:bg-gray-50"
        >
          <ArrowLeft /> Classes
        </Button>
        <div className="w-full mx-auto">
          {/* Display chats */}
          {fetchedData.title === ""  ? (
            <h1 className="mt-16 text-center text-xl font-semibold">
              No saved chats available for this class.
            </h1>
          ) : (
              <Card
                className="my-4 border-g  ay-200 shadow-sm hover:bg-gray-100"
                onClick={() => handleParticularChats(fetchedData.id)}
              >
                <CardContent>
                  <h4 className="text-md font-medium">{fetchedData.title}</h4>
                  <p className="text-sm">
                    Total Conversation: {fetchedData.conversation.length}
                  </p>
                </CardContent>
              </Card>
          )}
        </div>
      </div>
    );
  }

  // return null;
}
