import * as ContentApi from "../../services/Content";

export const getTimeline = (body) => async (dispatch) => {
  dispatch({ type: "RETREIVING_START" });
  try {
    const data = await ContentApi.getTimelineContent(body);
    dispatch({ type: "RETREIVING_SUCCESS", data: data?.data });
  } catch (error) {
    dispatch({ type: "RETREIVING_FAIL" });
  }
};

export const createContent = (data) => async (dispatch) => {
  dispatch({ type: "UPLOAD_START" });
  try {
    const newPost = await ContentApi.publishContent(data);
    dispatch({ type: "UPLOAD_SUCCESS", data: newPost.data });
  } catch (error) {
    dispatch({ type: "UPLOAD_FAIL" });
  }
};
export const openFilterModal = (isOpen) => async (dispatch) => {
  dispatch({ type: "IS_OPEN_MODAL", isOpen: isOpen });
};
