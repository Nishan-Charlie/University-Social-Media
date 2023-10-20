const forumReducer = (
  state = {
    data: null,
    loading: false,
    error: false,
    answers: null,
    selectedForum: null,
  },
  action
) => {
  switch (action.type) {
    // belongs to PostShare.jsx
    case "FETCH_QUESTION_START":
      return { ...state, error: false };
    case "FETCH_QUESTION_SUCCESS":
      return {
        ...state,
        data: action.data,
        error: false,
      };
    case "FETCH_QUESTION_FAILED":
      return { ...state, error: true };

    case "GET_ANSWERS_START":
      return { ...state, error: false };
    case "GET_ANSWERS_SUCCESS":
      return {
        ...state,
        answers: action.data,
        error: false,
      };
    case "GET_ANSWERS_FAILED":
      return { ...state, error: true };
    case "SELECTED_FORUM_START":
      return { ...state, error: false };
    case "SELECTED_FORUM_SUCCESS":
      return {
        ...state,
        selectedForum: action.data,
        error: false,
      };
    case "SELECTED_FORUM_FAILED":
      return { ...state, error: true };

    default:
      return state;
  }
};

export default forumReducer;
