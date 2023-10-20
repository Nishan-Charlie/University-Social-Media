import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as API from "../services/Auth";
import * as USER_API from "../services/User";
import { NotificationManager } from "react-notifications";

export const logIn = createAsyncThunk(
  "auth/logIn",
  async (formData, { rejectWithValue }) => {
    try {
      const { data } = await API.logIn(formData);
      return data;
    } catch (error) {
      NotificationManager.warning(error.response.data, "Warning message");
      return rejectWithValue(error);
    }
  }
);

export const register = createAsyncThunk(
  "auth/register",
  async (formData, { rejectWithValue }) => {
    try {
      const { data } = await API.signUp(formData);
      return data;
    } catch (error) {
      NotificationManager.warning(
        error.response.data.message,
        "Warning message"
      );
      return rejectWithValue(error);
    }
  }
);

export const follow = createAsyncThunk(
  "user/follow",
  async (values, { rejectWithValue }) => {
    console.log(values);
    try {
      USER_API.follow(values.id, values.user);
      console.log(values.user);
      return values.user;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error);
    }
  }
);

export const unfollow = createAsyncThunk(
  "user/unfollow",
  async (values, { rejectWithValue }) => {
    console.log(values);
    try {
      USER_API.unfollow(values.id, values.user);
      console.log(values.user);
      return values.user;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error);
    }
  }
);

export const updateUser = createAsyncThunk(
  "user/update",
  async (values, { rejectWithValue }) => {
    try {
      const { data } = await USER_API.updateUser(values._id, values);

      return data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
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
    [logIn.pending]: (state) => {
      state.loading = true;
    },
    [logIn.fulfilled]: (state, action) => {
      state.loading = false;
      state.data = action.payload;
      localStorage.setItem("profile", JSON.stringify({ ...action?.payload }));
    },
    [logIn.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    [register.pending]: (state) => {
      state.loading = true;
    },
    [register.fulfilled]: (state, action) => {
      state.loading = false;
      state.data = action.payload;
      localStorage.setItem("profile", JSON.stringify({ ...action?.payload }));
    },
    [register.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
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
    [follow.pending]: (state) => {
      state.loading = true;
    },
    [follow.fulfilled]: (state, action) => {
      state.loading = false;
      console.log(action);
      state.data = {
        ...state.data,
        user: {
          ...state.data.user,
          following: [...state.data.user.following, action.payload],
        },
      };
    },
    [follow.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    [unfollow.pending]: (state) => {
      state.loading = true;
    },
    [unfollow.fulfilled]: (state, action) => {
      state.loading = false;
      state.data = {
        ...state.data,
        user: {
          ...state.data.user,
          following: [
            ...state.data.user.following.filter(
              (personId) => personId !== action.payload
            ),
          ],
        },
      };
    },
    [unfollow.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { reset } = authSlice.actions;
export default authSlice.reducer;
