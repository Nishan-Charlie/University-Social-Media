const forumModalReducer = (
  state = { isOpenForumDrawer: false, isOpenForumAnswerDrawer: false },
  action
) => {
  switch (action.type) {
    case "IS_OPEN_FORUM_DRAWER":
      return { ...state, isOpenForumDrawer: action.isOpenForumDrawer };
    case "IS_OPEN_ANSWER_FORUM_DRAWER":
      return {
        ...state,
        isOpenForumAnswerDrawer: action.isOpenForumAnswerDrawer,
      };
    case "IS_OPEN_ASK_FORUM_DRAWER":
      return {
        ...state,
        isOpenAskForumDrawer: action.isOpenAskForumDrawer,
      };
    default:
      return state;
  }
};

export default forumModalReducer;
