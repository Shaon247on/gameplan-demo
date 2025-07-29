import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ChatState {
  recentPlans: any[];
  currentPlanId: string | null;
  currentChatId: string | null;
  activeMessages: any[];
}

const initialState: ChatState = {
  recentPlans: [],
  currentPlanId: null,
  currentChatId: null,
  activeMessages: [],
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
    setActiveMessages: (state, action: PayloadAction<any[]>) => {
      state.activeMessages = action.payload;
    },
    addMessageToActiveChat: (state, action: PayloadAction<any>) => {
      state.activeMessages.push(action.payload);
    },
    clearActiveChat: (state) => {
      state.activeMessages = [];
      state.currentChatId = null;
    },
  },
});

export const {
  setRecentPlans,
  setCurrentPlan,
  setCurrentChat,
  setActiveMessages,
  addMessageToActiveChat,
  clearActiveChat,
} = chatSlice.actions;

export default chatSlice.reducer;
