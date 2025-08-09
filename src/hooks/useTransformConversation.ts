import { ChatMessage } from "@/app/dashboard/page";

interface ConversationItem {
  role: "user" | "assistant";
  content: string;
}

interface PlanData {
  id: number;
  title: string;
  conversation: ConversationItem[];
  is_saved: boolean;
  pinned_date: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Transform PlanData conversation into ChatMessage[]
 * This is a pure function, not a React Hook.
 */
export function transformConversation(plan: PlanData): ChatMessage[] {
  return plan.conversation.map((item) => {
    if (item.role === "user") {
      return {
        message: item.content,
        plan_id: plan.id,
      };
    } else if (item.role === "assistant") {
      return {
        response: item.content,
        plan_id: plan.id,
      };
    }
    return { plan_id: plan.id }; // Fallback for unknown role
  });
}
