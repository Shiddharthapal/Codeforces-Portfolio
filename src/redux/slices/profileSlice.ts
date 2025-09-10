import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { UserDetails } from "@/types/userDetails";

interface ProfileState {
  isEditing: boolean;
  isSaving: boolean;
  error: string | null;
  lastUpdated: Date | null;
}

const initialState: ProfileState = {
  isEditing: false,
  isSaving: false,
  error: null,
  lastUpdated: null,
};

export const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    updateProfileStart: (state) => {
      state.isSaving = true;
      state.error = null;
    },
    updateProfileSuccess: (
      state,
      action: PayloadAction<Partial<UserDetails>>
    ) => {
      state.isSaving = false;
      state.error = null;
      state.lastUpdated = new Date();
    },
    updateProfileFailure: (state, action: PayloadAction<string>) => {
      state.isSaving = false;
      state.error = action.payload;
    },
    setEditMode: (state, action: PayloadAction<boolean>) => {
      state.isEditing = action.payload;
      if (!action.payload) {
        state.error = null;
      }
    },
  },
});

export const {
  updateProfileStart,
  updateProfileSuccess,
  updateProfileFailure,
  setEditMode,
} = profileSlice.actions;

export default profileSlice.reducer;
