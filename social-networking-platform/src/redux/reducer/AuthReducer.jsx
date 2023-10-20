const authReducer = (
  state = {
    data: null,
    loading: false,
    error: false,
    updateLoading: false,
  },
  action
) => {
  switch (action.type) {
    case "LOGIN_START":
      return { ...state, loading: true, error: false };
    case "LOGIN_SUCCESS":
      localStorage.setItem("profile", JSON.stringify({ ...action?.data }));
      return { ...state, data: action.data, loading: false, error: false };
    case "LOGIN_FAIL":
      return { ...state, loading: false, error: true };
    case "REGISTER_START":
      return { ...state, loading: true, error: false };
    case "REGISTER_SUCCESS":
      return { ...state, data: null, loading: false, error: false };
    case "REGISTER_FAIL":
      return { ...state, loading: false, error: true };
    case "UPDATING_START":
      return { ...state, updateLoading: true, error: false };
    case "UPDATING_SUCCESS":
      localStorage.setItem("profile", JSON.stringify({ ...action?.data }));
      return {
        ...state,
        data: action.data,
        updateLoading: false,
        error: false,
      };

    case "UPDATING_FAIL":
      return { ...state, updateLoading: true, error: true };

    case "LOG_OUT":
      localStorage.clear();
      return {
        ...state,
        data: null,
        loading: false,
        error: false,
        updateLoading: false,
      };

    case "FOLLOW":
      return {
        ...state,
        data: {
          ...state.data,
          user: {
            ...state.data.user,
            following: [...state.data.user.following, action.data],
          },
        },
      };

    case "UNFOLLOW":
      return {
        ...state,
        data: {
          ...state.data,
          user: {
            ...state.data.user,
            following: [
              ...state.data.user.following.filter(
                (personId) => personId._id !== action.data?._id
              ),
            ],
          },
        },
      };

    case "SAVE_CONTENT":
      return {
        ...state,
        data: {
          ...state.data,
          user: {
            ...state.data.user,
            savedContents: [...state.data.user.savedContents, action.data],
          },
        },
      };
    case "ARCHIVE_CONTENT":
      return {
        ...state,
        data: {
          ...state.data,
          user: {
            ...state.data.user,
            archiveContents: [...state.data.user.archiveContents, action.data],
          },
        },
      };

    default:
      return state;
  }
};

export default authReducer;
