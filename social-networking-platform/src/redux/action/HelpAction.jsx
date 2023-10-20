export const openHelpModal = (showHelpModal) => async (dispatch) => {
  dispatch({
    type: "SHOW_HELP_MODAL",
    showHelpModal: showHelpModal,
  });
};
