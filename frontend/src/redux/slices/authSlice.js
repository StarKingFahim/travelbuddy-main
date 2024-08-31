import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
	name: "auth",
	initialState: null,
	reducers: {
		addAuth: (_, action) => action.payload,
		removeAuth:  () => null,
	},
});

export const { addAuth, removeAuth } = authSlice.actions;

export default authSlice.reducer;