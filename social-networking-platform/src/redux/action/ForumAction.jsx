import * as ForumApi from "../../services/Forum";

export const getAllQuestions = (body) => async (dispatch) => {
  dispatch({ type: "FETCH_QUESTION_START" });
  try {
    const data = await ForumApi.fetchAllQuestion(body);
    console.log("getallque", data);
    dispatch({ type: "FETCH_QUESTION_SUCCESS", data: data });
  } catch (error) {
    console.log({ error });
    dispatch({ type: "FETCH_QUESTION_FAILED" });
  }
};

export const getAnswerByQuestion = (body) => async (dispatch) => {
  dispatch({ type: "GET_ANSWERS_START" });
  try {
    const data = await ForumApi.getAllAnswersByForumId(body);
    dispatch({ type: "GET_ANSWERS_SUCCESS", data: data });
  } catch (error) {
    console.log({ error });
    dispatch({ type: "GET_ANSWERS_FAILED" });
  }
};
export const selectedForum = (data) => async (dispatch) => {
  dispatch({ type: "SELECTED_FORUM_START" });
  try {
    dispatch({ type: "SELECTED_FORUM_SUCCESS", data: data });
  } catch (error) {
    console.log({ error });
    dispatch({ type: "SELECTED_FORUM_FAILED" });
  }
};
