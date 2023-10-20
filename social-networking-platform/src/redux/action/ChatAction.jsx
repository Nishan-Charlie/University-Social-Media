import * as ContentApi from "../../services/Content";

export const getChats = (body) => async (dispatch) => {
  dispatch({ type: "GET_CHATS_START" });
  try {
    const data = await ContentApi.getTimelineContent(body);
    dispatch({ type: "GET_CHATS_SUCCESS", data: data?.data });
  } catch (error) {
    dispatch({ type: "GET_CHAT_FAIL" });
  }
};

export function afterPostMessage(data) {
  return {
    type: "AFTER_POST_MESSAGE",
    payload: data,
  };
}
