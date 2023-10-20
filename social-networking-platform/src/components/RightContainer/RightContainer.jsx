import { Tabs } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { listAllSuggestedPerson } from "../../redux/action/SuggestedPersonAction";
import { getAllFollowRequest, getAllUsers } from "../../services/User";
import FollowerBox from "../FollowerBox/FollowerBox";
import FollowingRequest from "../FollowingRequest/FollowingRequest";
import NavigationBar from "../NavigationBar/NavigationBar";
import SearchFollowers from "../SearchFollowers/SearchFollowers";
import "./style.css";
import ActiveUsers from "../ActiveUsers/ActiveUsers";

export default function RightContainer() {
  const [followingRequest, setFollowingRequests] = useState([]);

  const user = useSelector((state) => state.authReducer.data).user;
  const suggestedPerson = useSelector(
    (state) => state.suggestedPersonReducer?.content?.data
  );
  console.log({ suggestedPerson });
  const dispatch = useDispatch();
  const listAllFollowRequest = async () => {
    try {
      const { data } = await getAllFollowRequest({ id: user._id });
      console.log({ data });
      setFollowingRequests(data);
    } catch (error) {}
  };

  useEffect(() => {
    dispatch(listAllSuggestedPerson({ userId: user?._id }));
    listAllFollowRequest();
  }, []);

  const handleFilter = (value) => {
    // fetchPersons(value);
  };

  const items = [
    {
      key: "1",
      label: `Suggestions`,
      children: (
        <div>
          {/* <h3 className="around-people-text">People you may know</h3> */}
          {suggestedPerson?.map((person, idx) => {
            if (person._id !== user?._id) {
              return <FollowerBox follower={person} idx={idx} />;
            }
          })}
        </div>
      ),
    },
    {
      key: "2",
      label: `Requestes`,
      children: (
        <div>
          {/* <h3 className="around-people-text">People you may know</h3> */}
          {followingRequest &&
            followingRequest?.map((person, idx) => {
              if (person._id !== user?._id) {
                return (
                  <FollowingRequest
                    follower={person}
                    idx={idx}
                    listAllFollowRequest={listAllFollowRequest}
                  />
                );
              }
            })}
        </div>
      ),
    },
  ];

  return (
    <div className="RightSide">
      <NavigationBar />
      <SearchFollowers onChange={(e) => handleFilter(e.target.value)} />
      <div className="FollowersCard">
        {user?.isAdmin ? (
          <div>
            <div
              style={{
                fontSize: "15px",
                fontWeight: "bolder",
                textAlign: "center",
              }}
            >
              Active Users
            </div>
            {suggestedPerson?.map((person, idx) => {
              if (person._id !== user?._id) {
                return <ActiveUsers follower={person} idx={idx} />;
              }
            })}
          </div>
        ) : (
          <Tabs centered defaultActiveKey="1" items={items} />
        )}
      </div>
    </div>
  );
}
