import React, { useEffect, useState } from "react";
import Layout from "./../../components/Layout";
import axios from "axios";
import { Table } from "antd";
const Users = () => {
  const [users, setUsers] = useState([]);

  //getUsers
  const getUsers = async () => {
    try {
      const res = await axios.get("/api/v1/admin/getAllUsers", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res.data.success) {
        setUsers(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deleteUser = async (userId) => {
    try {
      const res = await axios.post(
        "/api/v1/admin/deleteUser",
        { deleteUserId: userId },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      if (res.data.success) {
        getUsers()
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  // antD table col
  const columns = [
    {
      title: "Нэр",
      dataIndex: "name",
    },
    {
      title: "И-мэйл хаяг",
      dataIndex: "email",
    },
    {
      title: "Дизайнер",
      dataIndex: "isDesigner",
      render: (text, record) => <span>{record.isDesigner ? "Тийм" : "Үгүй"}</span>,
    },
    {
      title: "Үйлдэл",
      dataIndex: "actions",
      render: (text, record) => (
        <div className="d-flex">
          <button className="btn btn-danger" onClick={() => deleteUser(record._id)}>Устгах</button>
        </div>
      ),
    },
  ];

  return (
    <Layout>
      <h1 className="text-center m-2">Хэрэглэгчдийн жагсаалт</h1>
      <Table columns={columns} dataSource={users} />
    </Layout>
  );
};

export default Users;