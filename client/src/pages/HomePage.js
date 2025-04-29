import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "./../components/Layout";
import { Row } from "antd";
import DesignerList from "../components/DesignerList";
const HomePage = () => {
  const [designers, setDesigners] = useState([]);
  // login user data
  const getUserData = async () => {
    try {
      const res = await axios.get(
        "/api/v1/user/getAllDesigners",

        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      if (res.data.success) {
        setDesigners(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);
  return (
    <Layout>
      <h1 className="text-center">Боломжит дизайнерууд </h1>
      <Row>
        {designers && designers.map((designer) => <DesignerList designer={designer} />)}
      </Row>
    </Layout>
  );
};

export default HomePage;