import React, { useEffect, useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { Images } from "../../assets/images";
import { follow, unfollow } from "../../redux/action/AuthActions";
import { BUCKET_URI } from "../../utils/constant";
import { HiLockClosed } from "react-icons/hi";
import { listAllFollowers } from "../../redux/action/FollowersAction";
import { listAllFollowing } from "../../redux/action/FollowingAction";
import { listAllSuggestedPerson } from "../../redux/action/SuggestedPersonAction";
import { useParams } from "react-router-dom";

export default function FollowerBox({ follower, idx, location }) {
  console.log({ follower });
  const user = useSelector((state) => state.authReducer.data).user;
  const dispatch = useDispatch();
  const { id } = useParams();

  const [following, setFollowing] = useState(
    follower.followers?.includes(user._id)
  );

  const [requested, setRequested] = useState(
    follower.followRequests?.includes(user._id)
  );

  const handlefollowUnfollow = () => {
    following
      ? dispatch(unfollow(follower?._id, follower))
      : dispatch(follow(follower?._id, follower));
    follower?.accountType === "private" && !following
      ? setRequested((prev) => !prev)
      : setFollowing((prev) => !prev);
    setTimeout(() => {
      dispatch(listAllFollowing(user?._id));
      dispatch(listAllSuggestedPerson({ userId: user?._id }));
    }, 500);
  };

  useEffect(() => {
    setRequested(follower.followRequests?.includes(user._id));
  }, [follower.followRequests, user._id]);

  return (
    <div
      key={idx}
      style={{ marginBottom: "1rem", marginTop: "1rem" }}
      className="follower"
    >
      <div>
        <img
          src={
            follower.profilePicture
              ? BUCKET_URI + follower.profilePicture
              : Images.DEFAULT_PROFILE
          }
          alt="profile"
          className="followerImage"
        />
        {console.log({ follower })}
        <div className="name">
          <span>
            {follower.firstname}{" "}
            {follower?.studentType === "alumniStudent" && <span>🎓</span>}
          </span>
          <span>
            @{follower.username}{" "}
            {follower?.accountType === "private" && <span>🔒</span>}{" "}
          </span>
        </div>
      </div>
      {location !== "my-profile" && (
        <button
          onClick={handlefollowUnfollow}
          className={
            following ? "button fc-button UnfollowButton" : "button fc-button"
          }
          disabled={requested ? true : false}
        >
          {requested ? "Requested" : following ? "Unfollow" : "Follow"}
        </button>
      )}
    </div>
  );
}
