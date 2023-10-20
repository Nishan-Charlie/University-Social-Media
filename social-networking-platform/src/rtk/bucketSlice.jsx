import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as API from "../services/Bucket";

export const bucket = createAsyncThunk(
  "bucket",
  async (value, { rejectWithValue }) => {
    try {
      const { data } = await API.uploadImage(value);
      return data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const bucketSlice = createSlice({
  name: "bucket",
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
    [bucket.pending]: (state) => {
      state.loading = true;
    },
    [bucket.fulfilled]: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },
    [bucket.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { reset } = bucketSlice.actions;
export default bucketSlice.reducer;
