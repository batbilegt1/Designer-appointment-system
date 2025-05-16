import React from "react";
import Layout from "../components/Layout";
import { Col, Form, Input, Row, TimePicker, message } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { showLoading, hideLoading } from "../redux/features/alertSlice";
import axios from "axios";
import moment from "moment";
const ApplyDesigner = () => {
  const { user } = useSelector((state) => state.user);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  //handle form
  const handleFinish = async (values) => {
    try {
      dispatch(showLoading());
      const res = await axios.post(
        "/api/v1/user/apply-designer",
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
        message.error(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
      message.error("Somthing Went Wrrong ");
    }
  };
  return (
    <Layout>
      <h1 className="text-center">Ажлын анкет</h1>
      <Form layout="vertical" onFinish={handleFinish} className="m-3">
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
              Илгээх
            </button>
          </Col>
        </Row>
      </Form>
    </Layout>
  );
};

export default ApplyDesigner;