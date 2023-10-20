import * as UserAPi from "../../services/User";

export const listAllFollowers = (id) => async (dispatch) => {
  dispatch({ type: "LIST_ALL_FOLLOWERS_START" });
  try {
    const data = await UserAPi.getAllFollowerById(id);
    console.log({ data });
    dispatch({ type: "LIST_ALL_FOLLOWERS_SUCCESS", data: data });
  } catch (error) {
    dispatch({ type: "LIST_ALL_FOLLOWERS_FAIL" });
  }
};
