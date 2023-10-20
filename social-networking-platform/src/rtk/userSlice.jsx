import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as API from "../services/User";

export const updateUser = createAsyncThunk(
  "user/update",
  async (values, { rejectWithValue }) => {
    try {
      const { data } = await API.updateUser(values);
      return data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    loading: false,
    error: null,
    data: null,
  },
  reducers: {
    reset: (state) => {
      state.loading = false;
      state.error = null;
      state.data = null;
    },
  },
  extraReducers: {
    [updateUser.pending]: (state) => {
      state.loading = true;
    },
    [updateUser.fulfilled]: (state, action) => {
      state.loading = false;
      state.data = action.payload;
      localStorage.setItem("profile", JSON.stringify({ ...action?.payload }));
    },
    [updateUser.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { reset } = userSlice.actions;
export default userSlice.reducer;
