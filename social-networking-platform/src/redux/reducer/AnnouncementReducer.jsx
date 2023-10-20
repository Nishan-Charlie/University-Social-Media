const announcementReducer = (
  state = {
    showAnnouncementModal: false,
    content: [],
    loading: false,
    error: false,
  },
  action
) => {
  console.log({ action });
  switch (action.type) {
    case "SHOW_ANNOUNCEMENT_MODAL":
      return { ...state, showAnnouncementModal: action.showAnnouncementModal };
    case "START_FETCH_ANNOUNCEMENT":
      return { ...state, error: false };
    case "SUCCESS_FETCH_ANNOUNCEMENT":
      return {
        ...state,
        content: action.data,
        error: false,
      };
    case "ERROR_FETCH_ANNOUNCEMENT":
      return { ...state, error: true };
    default:
      return state;
  }
};

export default announcementReducer;
