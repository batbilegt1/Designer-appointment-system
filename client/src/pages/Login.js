import React from "react";
import "../styles/RegisterStyles.css";
import { Form, Input, message } from "antd";
import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../redux/features/alertSlice";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  //form handler
  const onfinishHandler = async (values) => {
    try {
      dispatch(showLoading());
      const res = await axios.post("/api/v1/user/login", values);
      window.location.reload();
      dispatch(hideLoading());
      if (res.data.success) {
        localStorage.setItem("token", res.data.token);
        message.success("Login Successfully");
        navigate("/");
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
      message.error("something went wrong");
    }
  };
  return (
    <div className="form-container ">
      <Form
        layout="vertical"
        onFinish={onfinishHandler}
        className="register-form"
      >
        <h3 className="text-center">Нэвтрэх</h3>

        <Form.Item label="И-мэйл хаяг" name="email">
          <Input type="email" required placeholder="И-мэйл хаягаа оруулна уу!"/>
        </Form.Item>
        <Form.Item label="Нууц үг" name="password">
          <Input type="password" required  placeholder="Нууц үгээ оруулна уу!"/>
        </Form.Item>
        <Link to="/register" className="m-2">
          Бүртгүүлэх
        </Link>
        <button className="btn btn-primary" type="submit">
          Нэвтрэх
        </button>
      </Form>
    </div>
  );
};

export default Login;