import { createSlice } from "@reduxjs/toolkit";

const storedToken = localStorage.getItem("token");
const storedUser = localStorage.getItem("user");

const authSlice = createSlice({
    name: "auth",
    initialState: {
        token: storedToken ? storedToken : null,
        user: storedUser ? JSON.parse(storedUser) : null,
        isAuthenticated: storedToken ? true : false,
    },
    reducers: {
        setCredentials: (state, action) => {
            const { token, user } = action.payload;

            state.token = token;
            state.user = user;
            state.isAuthenticated = true;

            // Save to localStorage
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));
            if (!localStorage.getItem(`cart_${user._id}`)) {
                localStorage.setItem(`cart_${user._id}`, JSON.stringify([]));
            }
        },

        logout: (state) => {
            state.token = null;
            state.user = null;
            state.isAuthenticated = false;

            // Remove from localStorage
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            logout: (state) => {
                state.token = null;
                state.user = null;
                state.isAuthenticated = false;

                localStorage.removeItem("token");
                localStorage.removeItem("user");
                localStorage.removeItem("last_session_id");
            }

        }
    },
});

export const { setCredentials, logout } = authSlice.actions;

export default authSlice.reducer;
