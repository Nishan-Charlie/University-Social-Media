import React, { useEffect, useState } from "react";
// import { getTimelinePosts } from "../../actions/PostsAction";
// import Post from "../Post/Post";
import { useSelector, useDispatch } from "react-redux";
// import "./Posts.css";
import { useParams } from "react-router-dom";
import Content from "../Content/Content";
import { Col, Modal, Row, Select, Spin } from "antd";
import { getTimeline, openFilterModal } from "../../redux/action/ContentAction";
import { Button, Drawer, Radio, Space } from "antd";
import { DEPARTMENT, YEAR_OF_STUDY } from "../../utils/constant";
import { getUser } from "../../services/User";

const PersonalContents = () => {
  const { Option } = Select;

  const [department, setDepartment] = useState();
  const [yearOfStudy, setYearOfStudy] = useState();
  const [user, setuser] = useState({});

  const dispatch = useDispatch();
  const { id } = useParams();

  console.log({ id });

  const listUserbyUserId = async () => {
    try {
      const { data } = await getUser(id);
      setuser(data);
      const payload = {
        id: "",
        department: "",
        yearOfStudy: "",
        loggedInUser: data?._id,
      };
      dispatch(getTimeline(payload));
      console.log({ data });
    } catch (error) {
      console.log({ error });
    }
  };

  let { content, loading, isOpen } = useSelector(
    (state) => state.contentReducer
  );

  useEffect(() => {
    listUserbyUserId();
  }, []);

  const onClose = () => {
    dispatch(openFilterModal(false));
  };

  const handleOk = () => {
    const payload = {
      id: "",
      course: department,
      yearOfStudy: yearOfStudy,
      loggedInUser: user?._id,
    };
    dispatch(getTimeline(payload));
    dispatch(openFilterModal(false));
  };

  return (
    <div className="Posts">
      {loading ? (
        <Spin tip="Loading" />
      ) : (
        content &&
        content?.map((post, id) => {
          return <Content content={post} key={id} />;
        })
      )}
      <Modal
        title="Optional Filter"
        open={isOpen}
        onOk={handleOk}
        onCancel={onClose}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Select
              allowClear
              style={{ width: 200 }}
              placeholder="Select Department"
              onChange={(value) => {
                setDepartment(value);
              }}
            >
              {DEPARTMENT.map((department) => (
                <Option key={department.name} value={department.name}>
                  {department.name}
                </Option>
              ))}
            </Select>
          </Col>
          <Col span={12}>
            <Select
              allowClear
              style={{ width: 200 }}
              placeholder="Select Year of Study"
              onChange={(value) => {
                setYearOfStudy(value);
              }}
            >
              {YEAR_OF_STUDY.map((year) => (
                <Option key={year.year} value={year.year}>
                  {year.year}
                </Option>
              ))}
            </Select>
          </Col>
        </Row>
      </Modal>
    </div>
  );
};

export default PersonalContents;
