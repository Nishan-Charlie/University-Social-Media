import * as AnnouncementApi from "../../services/Announcement";

export const openAnnouncementModal =
  (showAnnouncementModal) => async (dispatch) => {
    dispatch({
      type: "SHOW_ANNOUNCEMENT_MODAL",
      showAnnouncementModal: showAnnouncementModal,
    });
  };

export const getAllAnnouncement = () => async (dispatch) => {
  dispatch({ type: "START_FETCH_ANNOUNCEMENT" });
  try {
    const data = await AnnouncementApi.getAnnouncements();
    console.log(data.data.data);
    dispatch({ type: "SUCCESS_FETCH_ANNOUNCEMENT", data: data?.data?.data });
  } catch (error) {
    console.log({ error });
    dispatch({ type: "ERROR_FETCH_ANNOUNCEMENT" });
  }
};
