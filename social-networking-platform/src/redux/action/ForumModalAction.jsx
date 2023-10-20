export const openForumDrawer = (isOpenForumDrawer) => async (dispatch) => {
  dispatch({
    type: "IS_OPEN_FORUM_DRAWER",
    isOpenForumDrawer: isOpenForumDrawer,
  });
};

export const openForumAnswerDrawer =
  (isOpenForumAnswerDrawer) => async (dispatch) => {
    dispatch({
      type: "IS_OPEN_ANSWER_FORUM_DRAWER",
      isOpenForumAnswerDrawer: isOpenForumAnswerDrawer,
    });
  };

export const openAskQuestionModal =
  (isOpenAskForumDrawer) => async (dispatch) => {
    dispatch({
      type: "IS_OPEN_ASK_FORUM_DRAWER",
      isOpenAskForumDrawer: isOpenAskForumDrawer,
    });
  };
