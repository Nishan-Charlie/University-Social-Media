import { combineReducers } from "redux";

import authReducer from "./AuthReducer";
import contentReducer from "./ContentReducer";
import BucketReducer from "./BucketReducer";
import messageReducer from "./MessageReducer";
import followerReducer from "./FollowerReducer";
import followingReducer from "./FollowingReducer";
import suggestedPersonReducer from "./SuggestedPersonReducer";
import notificationReducer from "./NotificationReducer";
import forumModalReducer from "./ForumModalReducer";
import forumReducer from "./ForumReducer";
import announcementReducer from "./AnnouncementReducer";
import helpReducer from "./HelpReducer";
export const reducers = combineReducers({
  authReducer,
  contentReducer,
  BucketReducer,
  messageReducer,
  followerReducer,
  followingReducer,
  suggestedPersonReducer,
  notificationReducer,
  forumModalReducer,
  forumReducer,
  announcementReducer,
  helpReducer,
});
