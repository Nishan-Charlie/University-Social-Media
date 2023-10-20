import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as API from "../services/Content";

export const publishContent = createAsyncThunk(
  "content/publish",
  async (values, { rejectWithValue }) => {
    try {
      const { data } = await API.publishContent(values);
      return data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getTimelineContents = createAsyncThunk(
  "content/getTimeline",
  async ({ rejectWithValue }) => {
    try {
      const { data } = await API.getTimelinePosts();
      return data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const contentSlice = createSlice({
  name: "content",
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
    [publishContent.pending]: (state) => {
      state.loading = true;
    },
    [publishContent.fulfilled]: (state, action) => {
      state.loading = false;
    },
    [publishContent.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    [getTimelineContents.pending]: (state) => {
      state.contentloading = true;
    },
    [getTimelineContents.fulfilled]: (state, action) => {
      state.contentloading = false;
      state.data = action.payload;
    },
    [getTimelineContents.rejected]: (state, action) => {
      state.contentloading = false;
      state.error = action.payload;
    },
  },
});

export const { reset } = contentSlice.actions;
export default contentSlice.reducer;
