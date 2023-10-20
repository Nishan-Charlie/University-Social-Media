import * as UserAPi from "../../services/User";

export const listAllFollowing = (id) => async (dispatch) => {
  dispatch({ type: "LIST_ALL_FOLLOWING_START" });
  try {
    const data = await UserAPi.getAllFollowingById(id);
    console.log({ data });
    dispatch({ type: "LIST_ALL_FOLLOWING_SUCCESS", data: data });
  } catch (error) {
    dispatch({ type: "LIST_ALL_FOLLOWING_FAIL" });
  }
};
