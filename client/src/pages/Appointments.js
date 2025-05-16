import React, { useState, useEffect } from "react";
import axios from "axios";
import Layout from "./../components/Layout";
import moment from "moment";
import { Table } from "antd";

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);

  const getAppointments = async () => {
    try {
      const res = await axios.get("/api/v1/user/user-appointments", {
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

  const deleteAppointment = async (appointmentId) => {
    try {
      const res = await axios.post(
        "/api/v1/user/deleteAppointment",
        { deleteAppointmentId: appointmentId },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      if (res.data.success) {
        getAppointments()
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAppointments();
  }, []);

  const columns = [
    {
      title: "Дизайнер",
      dataIndex: "_id",
      render: (text, record) => (
        <span>
          {record.designer
            ? `${record.designer.firstName} ${record.designer.lastName}`
            : 'Устсан дизайнер'}
        </span>
      ),
    },
    // {
    //   title: "Name",
    //   dataIndex: "name",
    //   render: (text, record) => (
    //     <span>
    //       {record.designerInfo.firstName} {record.designerInfo.lastName}
    //     </span>
    //   ),
    // },
    // {
    //   title: "Phone",
    //   dataIndex: "phone",
    //   render: (text, record) => <span>{record.designerInfo.phone}</span>,
    // },
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
                className="btn btn-danger"
                onClick={() => deleteAppointment(record._id)}
              >
                Устгах
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

export default Appointments;