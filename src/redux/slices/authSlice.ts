import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface User {
  _id: string;
  email: string;
  token: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  loading: false,
  error: null,
};
const loadInitialState = () => {
  const token = localStorage.getItem("authToken");
  if (token) {
    const userData = JSON.parse(localStorage.getItem("authUser") || "{}");
    return {
      _id: userData._id || null,
      email: userData.email || null,
      token,
      loading: false,
      error: null,
    };
  }
  return {
    _id: null,
    email: null,
    token: null,
    loading: false,
    error: null,
  };
};
export const authSlice = createSlice({
  name: "auth",
  initialState: loadInitialState(),
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state._id = action.payload._id;
      state.email = action.payload.email;
      state.token = action.payload.token;
      state.error = null;

      localStorage.setItem("authToken", action.payload.token);
      localStorage.setItem(
        "authUser",
        JSON.stringify({
          _id: action.payload._id,
          email: action.payload.email,
        })
      );
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state._id = null;
      state.email = null;
      state.token = null;
      state.error = null;

      // CLEAR PERSISTED DATA
      localStorage.removeItem("authToken");
      localStorage.removeItem("authUser");
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, logout } =
  authSlice.actions;

export default authSlice.reducer;
