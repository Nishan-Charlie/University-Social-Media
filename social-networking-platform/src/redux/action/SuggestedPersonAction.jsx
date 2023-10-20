import * as UserAPi from "../../services/User";

export const listAllSuggestedPerson =
  ({ userId }) =>
  async (dispatch) => {
    dispatch({ type: "LIST_ALL_SUGGESTED_PERSON_START" });
    try {
      console.log("]]======================", userId);
      const data = await UserAPi.getAllSuggestedUsers(userId);
      console.log({ data });
      dispatch({ type: "LIST_ALL_SUGGESTED_PERSON_SUCCESS", data: data });
    } catch (error) {
      dispatch({ type: "LIST_ALL_SUGGESTED_PERSON_FAIL" });
    }
  };
