import { ChatMessage } from "@/app/dashboard/page";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ChatState {
  recentPlans: any[];
  currentPlanId: string | null;
  currentChatId: string | null;
  activeMessages: ChatMessage[];
  planId: number | null;
  gCount: number;
}

const initialState: ChatState = {
  recentPlans: [],
  currentPlanId: null,
  currentChatId: null,
  activeMessages: [],
  planId: null,
  gCount: 0
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setRecentPlans: (state, action: PayloadAction<any[]>) => {
      state.recentPlans = action.payload;
    },
    setCurrentPlan: (state, action: PayloadAction<string>) => {
      state.currentPlanId = action.payload;
    },
    setCurrentChat: (state, action: PayloadAction<string>) => {
      state.currentChatId = action.payload;
    },
    setActiveMessages: (state, action: PayloadAction<ChatMessage[]>) => {
      state.activeMessages = action.payload;
    },
    addMessageToActiveChat: (state, action: PayloadAction<ChatMessage>) => {
      state.activeMessages.push(action.payload);
    },
    setPlanId: (state, action: PayloadAction<number | null>)=>{
      state.planId = action.payload
    },
    clearActiveChat: (state) => {
      state.activeMessages = [];
      state.currentChatId = null;
    },
    incrementGCount: (state, action: PayloadAction<number>)=>{
      state.gCount = state.gCount + action.payload 
    }
  },
});

export const {
  setRecentPlans,
  setCurrentPlan,
  setCurrentChat,
  setActiveMessages,
  addMessageToActiveChat,
  setPlanId,
  clearActiveChat,
  incrementGCount
} = chatSlice.actions;

export default chatSlice.reducer;
