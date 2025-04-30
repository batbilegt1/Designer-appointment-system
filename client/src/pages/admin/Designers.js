import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import axios from "axios";
import { message, Table } from "antd";

const Designers = () => {
  const [designers, setDesigners] = useState([]);
  //getUsers
  const getDesigners = async () => {
    try {
      const res = await axios.get("/api/v1/admin/getAllDesigners", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res.data.success) {
        setDesigners(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // handle account
  const handleAccountStatus = async (record, status) => {
    try {
      const res = await axios.post(
        "/api/v1/admin/changeAccountStatus",
        { designerId: record._id, userId: record.userId, status: status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (res.data.success) {
        message.success(res.data.message);
        window.location.reload();
      }
    } catch (error) {
      message.error("Something Went Wrong");
    }
  };

  useEffect(() => {
    getDesigners();
  }, []);

  const columns = [
    {
      title: "Нэр",
      dataIndex: "name",
      render: (text, record) => (
        <span>
          {record.firstName} {record.lastName}
        </span>
      ),
    },
    {
      title: "Төлөв",
      dataIndex: "status",
      render: (text, record) => (
        <span>
          {record.status === "approved"
            ? "Баталгаажсан"
            : record.status === "pending"
            ? "Хүлээгдэж байгаа"
            : record.status === "reject"
            ? "Татгалзсан"
            : ""}
        </span>
      ),
    },
    {
      title: "Утасны дугаар",
      dataIndex: "phone",
    },
    {
      title: "Үйлдэл",
      dataIndex: "actions",
      render: (text, record) => (
        <div className="d-flex">
          {record.status === "pending" ? (
            <div className="d-flex">
              <button
                className="btn btn-success"
                onClick={() => handleAccountStatus(record, "approved")}
              >
                Баталгаажуулах
              </button>
              <button
                className="btn btn-danger ms-2"
                onClick={() => handleAccountStatus(record, "reject")}
              >
                Татгалзах
              </button>
            </div>
          ) : record.status === "approved" ? (
            <button 
              className="btn btn-danger"
              onClick={() => handleAccountStatus(record, "reject")}
            >
              Цуцлах
            </button>
          ) : <span></span>}
        </div>
      ),
    },
  ];

  return (
    <Layout>
      <h1 className="text-center m-3">Дизайнеруудын жагсаалт</h1>
      <Table columns={columns} dataSource={designers} />
    </Layout>
  );
};

export default Designers;