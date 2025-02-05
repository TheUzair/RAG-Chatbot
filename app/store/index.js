import { configureStore } from "@reduxjs/toolkit";
import chatReducer from "@/app/store/chatSlice";

const store = configureStore({
    reducer: {
        chat: chatReducer,
    },
});

export default store;