import React from "react";
import "../styles/RegisterStyles.css";
import { Form, Input, message } from "antd";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../redux/features/alertSlice";
const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  //form handler
  const onfinishHandler = async (values) => {
    try {
      dispatch(showLoading());
      const res = await axios.post("/api/v1/user/register", values);
      dispatch(hideLoading());
      if (res.data.success) {
        message.success("Амжилттай бүртгэгдлээ!");
        navigate("/login");
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
      message.error("Бүртгэхэд алдаа гарлаа!");
    }
  };
  return (
    <>
      <div className="form-container ">
        <Form
          layout="vertical"
          onFinish={onfinishHandler}
          className="register-form"
        >
          <h3 className="text-center">Бүртгүүлэх</h3>
          <Form.Item label="Нэр" name="name">
            <Input type="text" required />
          </Form.Item>
          <Form.Item label="И-мэйл хаяг" name="email">
            <Input type="email" required />
          </Form.Item>
          <Form.Item label="Нууц үг" name="password">
            <Input type="password" required />
          </Form.Item>
          <Link to="/login" className="m-2">
            Нэвтрэх
          </Link>
          <button className="btn btn-primary" type="submit">
            Бүртгүүлэх
          </button>
        </Form>
      </div>
    </>
  );
};

export default Register;