import { createSlice } from "@reduxjs/toolkit";

// Helper function to create a toggle or set reducer
const createReducer = (stateKey, toggle = false) => (state, action) => {
    state[stateKey] = toggle ? !state[stateKey] : action.payload;
};

const conditionSlice = createSlice({
    name: "condition",
    initialState: {
        isLoading: false,
        isChatLoading: false,
        isMessageLoading: false,
        isSendLoading: false,
        profileDetails: false,
        showHeaderMenu: false,
        isChatDetailsBox: false,
        isUserSearchBox: false,
        isGroupChat: false,
        isGroupChatId: "",
        isSocketConnected: false,
        isTyping: false,
        isNotification: false,
    },
    reducers: {
        setLoading: createReducer('isLoading'),
        setChatLoading: createReducer('isChatLoading'),
        setMessageLoading: createReducer('isMessageLoading'),
        setSendLoading: createReducer('isSendLoading'),
        setProfileDetail: createReducer('profileDetails', true),
        setHeaderMenu: createReducer('showHeaderMenu'),
        setChatDetailsBox: createReducer('isChatDetailsBox'),
        setUserSearchBox: createReducer('isUserSearchBox', true),
        setGroupChatBox: createReducer('isGroupChat', true),
        setGroupChatId: createReducer('isGroupChatId'),
        setSocketConnected: createReducer('isSocketConnected'),
        setTyping: createReducer('isTyping'),
        setNotificationBox: createReducer('isNotification'),
    },
});

export const {
    setLoading,
    setChatLoading,
    setMessageLoading,
    setSendLoading,
    setProfileDetail,
    setHeaderMenu,
    setChatDetailsBox,
    setUserSearchBox,
    setGroupChatBox,
    setGroupChatId,
    setSocketConnected,
    setTyping,
    setNotificationBox,
} = conditionSlice.actions;

export default conditionSlice.reducer;
