const helpReducer = (
  state = {
    showHelpModal: false,
  },
  action
) => {
  console.log({ action });
  switch (action.type) {
    case "SHOW_HELP_MODAL":
      return { ...state, showHelpModal: action.showHelpModal };
    default:
      return state;
  }
};

export default helpReducer;
