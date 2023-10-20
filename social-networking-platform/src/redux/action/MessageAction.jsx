export const openChatBox = (isOpenChatbox) => async (dispatch) => {
  dispatch({ type: "IS_OPEN_CHAT_BOX", isOpenChatbox: isOpenChatbox });
};
