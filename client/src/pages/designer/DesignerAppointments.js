import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout";

import axios from "axios";

import moment from "moment";
import { message, Table } from "antd";

const DesignerAppointments = () => {
  const [appointments, setAppointments] = useState([]);

  const getAppointments = async () => {
    try {
      const res = await axios.get("/api/v1/designer//designer-appointments", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res.data.success) {
        setAppointments(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAppointments();
  }, []);

  const handleStatus = async (record, status) => {
    try {
      const res = await axios.post(
        "/api/v1/designer/update-status",
        { appointmentsId: record._id, status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (res.data.success) {
        message.success(res.data.message);
        getAppointments();
      }
    } catch (error) {
      console.log(error);
      message.error("Something Went Wrong");
    }
  };

  const columns = [
    {
      title: "Дугаар",
      dataIndex: "_id",
    },
    {
      title: "Захиалгын цаг",
      dataIndex: "date",
      render: (text, record) => (
        <span>
          {moment(record.date).format("DD-MM-YYYY")} &nbsp;
          {moment(record.time).format("HH:mm")}
        </span>
      ),
    },
    {
      title: "Захиалгын төлөв",
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
      title: "Үйлдэл",
      dataIndex: "actions",
      render: (text, record) => (
        <div className="d-flex">
          {record.status === "pending" && (
            <div className="d-flex">
              <button
                className="btn btn-success"
                onClick={() => handleStatus(record, "approved")}
              >
                Баталгаажуулах
              </button>
              <button
                className="btn btn-danger ms-2"
                onClick={() => handleStatus(record, "reject")}
              >
                Татгалзах
              </button>
            </div>
          )}
        </div>
      ),
    },
  ];
  return (
    <Layout>
      <h1>Захиалгын жагсаалт</h1>
      <Table columns={columns} dataSource={appointments} />
    </Layout>
  );
};

export default DesignerAppointments;