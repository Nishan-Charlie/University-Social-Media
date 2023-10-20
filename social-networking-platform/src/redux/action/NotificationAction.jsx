import * as NotificationApi from "../../services/Notification";

export const listAllNotifications = (id) => async (dispatch) => {
  dispatch({ type: "LIST_ALL_NOTIFICATION_START" });
  try {
    const data = await NotificationApi.getAllNotifications(id);
    console.log({ data });
    dispatch({ type: "LIST_ALL_NOTIFICATION_SUCCESS", data: data });
  } catch (error) {
    dispatch({ type: "LIST_ALL_NOTIFICATION_FAIL" });
  }
};
