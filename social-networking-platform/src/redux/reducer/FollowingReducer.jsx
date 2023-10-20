const followingReducer = (
  state = { content: null, loading: false, error: false },
  action
) => {
  switch (action.type) {
    case "LIST_ALL_FOLLOWING_START":
      return { ...state, error: false };
    case "LIST_ALL_FOLLOWING_SUCCESS":
      return {
        ...state,
        content: action.data,
        error: false,
      };
    case "LIST_ALL_FOLLOWING_FAIL":
      return { ...state, error: true };
    default:
      return state;
  }
};

export default followingReducer;
