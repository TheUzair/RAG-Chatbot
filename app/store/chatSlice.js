import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    messages: [],
    scrapedUrls: [],
    activeUrl: null,
  },
  reducers: {
    addMessage: (state, action) => {
      state.messages.push({
        ...action.payload,
        id: Date.now(),
        timestamp: new Date().toISOString(),
      });
    },
    clearMessages: (state) => {
      state.messages = [];
    },
    addScrapedUrl: (state, action) => {
      const exists = state.scrapedUrls.find(
        (u) => u.url === action.payload.url,
      );
      if (!exists) {
        state.scrapedUrls.unshift({ ...action.payload, id: Date.now() });
      }
      state.activeUrl = action.payload.url;
    },
    setActiveUrl: (state, action) => {
      state.activeUrl = action.payload;
    },
    removeScrapedUrl: (state, action) => {
      state.scrapedUrls = state.scrapedUrls.filter(
        (u) => u.url !== action.payload,
      );
      if (state.activeUrl === action.payload) state.activeUrl = null;
    },
    clearScrapedUrls: (state) => {
      state.scrapedUrls = [];
      state.activeUrl = null;
    },
  },
});

export const {
  addMessage,
  clearMessages,
  addScrapedUrl,
  setActiveUrl,
  removeScrapedUrl,
  clearScrapedUrls,
} = chatSlice.actions;
export default chatSlice.reducer;
