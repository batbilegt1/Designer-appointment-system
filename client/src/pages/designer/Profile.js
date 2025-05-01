import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Col, Form, Input, Row, TimePicker, message } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../../redux/features/alertSlice";
import moment from "moment";

const Profile = () => {
  const { user } = useSelector((state) => state.user);
  const [designer, setDesigner] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();
  // update doc ==========
  //handle form
  const handleFinish = async (values) => {
    try {
      dispatch(showLoading());
      const res = await axios.post(
        "/api/v1/designer/updateProfile",
        {
          ...values,
          userId: user._id,
          timings: Array.isArray(values.timings) && values.timings.length === 2
          ? [
              values.timings[0].format("HH:mm"),
              values.timings[1].format("HH:mm"),
            ]
          : ["", ""], // or handle invalid case as needed
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (res.data.success) {
        message.success(res.data.message);
        navigate("/");
      } else {
        message.error(res.data.success);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
      message.error("Somthing Went Wrrong ");
    }
  };
  // update doc ==========

  //getDOc Details
  const getDesignerInfo = async () => {
    try {
      const res = await axios.post(
        "/api/v1/designer/getDesignerInfo",
        { userId: params.id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (res.data.success) {
        setDesigner(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getDesignerInfo();
    //eslint-disable-next-line
  }, []);
  return (
    <Layout>
      <h1>Профайл өөрчлөх</h1>
      {designer && (
        <Form
          layout="vertical"
          onFinish={handleFinish}
          className="m-3"
          initialValues={{
            ...designer,
            timings: [
              moment(designer.timings[0], "HH:mm"),
              moment(designer.timings[1], "HH:mm"),
            ],
          }}
        >
          <h4 className="">Хувийн мэдээлэл : </h4>
          <Row gutter={20}>
            <Col xs={24} md={24} lg={8}>
              <Form.Item
                label="Овог"
                name="firstName"
                required
                rules={[{ required: true }]}
              >
                <Input type="text" placeholder="Таны овог" />
              </Form.Item>
            </Col>
            <Col xs={24} md={24} lg={8}>
              <Form.Item
                label="Нэр"
                name="lastName"
                required
                rules={[{ required: true }]}
              >
                <Input type="text" placeholder="Таны нэр" />
              </Form.Item>
            </Col>
            <Col xs={24} md={24} lg={8}>
              <Form.Item
                label="Утасны дугаар"
                name="phone"
                required
                rules={[{ required: true }]}
              >
                <Input type="text" placeholder="Таны утасны дугаар" />
              </Form.Item>
            </Col>
            <Col xs={24} md={24} lg={8}>
              <Form.Item
                label="И-мэйл хаяг"
                name="email"
                required
                rules={[{ required: true }]}
              >
                <Input type="email" placeholder="Таны и-мэйл хаяг" />
              </Form.Item>
            </Col>
            <Col xs={24} md={24} lg={8}>
              <Form.Item label="Сошиал хаяг" name="website">
                <Input type="text" placeholder="Таны cошиал хаяг" />
              </Form.Item>
            </Col>
            <Col xs={24} md={24} lg={8}>
              <Form.Item
                label="Хаяг"
                name="address"
                required
                rules={[{ required: true }]}
              >
                <Input type="text" placeholder="Таны хаяг" />
              </Form.Item>
            </Col>
          </Row>
          <h4>Ажлын мэдээлэл :</h4>
          <Row gutter={20}>
            <Col xs={24} md={24} lg={8}>
              <Form.Item
                label="Мэргэжил"
                name="specialization"
                required
                rules={[{ required: true }]}
              >
                <Input type="text" placeholder="Таны мэргэжил" />
              </Form.Item>
            </Col>
            <Col xs={24} md={24} lg={8}>
              <Form.Item
                label="Туршлага"
                name="experience"
                required
                rules={[{ required: true }]}
              >
                <Input type="text" placeholder="Таны туршлага" />
              </Form.Item>
            </Col>
            <Col xs={24} md={24} lg={8}>
              <Form.Item
                label="Нэг удаагийн үнэ"
                name="feesPerCunsaltation"
                required
                rules={[{ required: true }]}
              >
                <Input type="text" placeholder="Таны санал болгох нэг удаагийн үнэ" />
              </Form.Item>
            </Col>
            <Col xs={24} md={24} lg={8}>
              <Form.Item label="Ажлын цаг" name="timings" required>
                <TimePicker.RangePicker format="HH:mm" />
              </Form.Item>
            </Col>
            <Col xs={24} md={24} lg={8}></Col>
            <Col xs={24} md={24} lg={8}>
              <button className="btn btn-primary form-btn" type="submit">
                Хадгалах
              </button>
            </Col>
          </Row>
        </Form>
      )}
    </Layout>
  );
};

export default Profile;