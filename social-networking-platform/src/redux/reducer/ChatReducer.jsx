const chatReducer = (
  state = { chats: null, loading: false, error: false, uploading: false },
  action
) => {
  switch (action.type) {
    case "GET_CHATS_START":
      return { ...state, error: false, uploading: true };
    case "GET_CHATS_SUCCESS":
      return {
        ...state,
        chats: action.data,
        uploading: false,
        error: false,
      };
    case "UPLOAD_FAIL":
      return { ...state, uploading: false, error: true };

    case "AFTER_POST_MESSAGE":
      return { ...state, chats: state.chats.concat(action.data) };

    default:
      return state;
  }
};

export default chatReducer;
