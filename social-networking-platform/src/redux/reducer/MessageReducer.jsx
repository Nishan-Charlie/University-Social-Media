const messageReducer = (state = { isOpenChatbox: false }, action) => {
  switch (action.type) {
    case "IS_OPEN_CHAT_BOX":
      return { ...state, isOpenChatbox: action.isOpenChatbox };
    default:
      return state;
  }
};

export default messageReducer;
