import React from "react";
import { useNavigate } from "react-router-dom";
import {  useSelector } from "react-redux";

const DesignerList = ({ designer }) => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  return (
    <>
      <div
        className="card m-2"
        style={{ cursor: "pointer" }}
        onClick={() => (!user.isAdmin&&!user.isDesigner) && navigate(`/designer/book-appointment/${designer._id}`)}
      >
        <div className="card-header">
          Дизайнер:  {designer.firstName} {designer.lastName}
        </div>
        <div className="card-body">
          <p>
            <b>Мэргэжил : </b> {designer.specialization}
          </p>
          <p>
            <b>Туршлага : </b> {designer.experience}
          </p>
          <p>
            <b>Нэг удаагийн үнэ : </b> {designer.feesPerCunsaltation}
          </p>
          <p>
            <b>Ажлын цаг : </b> {designer.timings[0]} - {designer.timings[1]}
          </p>
        </div>
      </div>
    </>
  );
};

export default DesignerList;
