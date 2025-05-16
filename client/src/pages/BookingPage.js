import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { useParams } from "react-router-dom";
import axios from "axios";
import { DatePicker, message, TimePicker } from "antd";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { showLoading, hideLoading } from "../redux/features/alertSlice";

const BookingPage = () => {
  const { user } = useSelector((state) => state.user);
  const params = useParams();
  const [designers, setDesigners] = useState([]);
  const [date, setDate] = useState("");
  const [time, setTime] = useState();
  const [isAvailable, setIsAvailable] = useState(false);
  const dispatch = useDispatch();
  // login user data
  const getUserData = async () => {
    try {
      const res = await axios.post(
        "/api/v1/designer/getDesignerById",
        { designerId: params.designerId },
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
  // ============ handle availiblity
  const handleAvailability = async () => {
    try {
      dispatch(showLoading());
      const res = await axios.post(
        "/api/v1/user/booking-availbility",
        { designerId: params.designerId, date, time },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (res.data.success) {
        setIsAvailable(true);
        console.log(isAvailable);
        message.success(res.data.message);
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
    }
  };
  // =============== booking func
  const handleBooking = async () => {
    try {
      setIsAvailable(true);
      if (!date && !time) {
        return alert("Захиалгын цаг заавал оруулах ёстой!");
      }
      console.log("TSag: "+ time)
      dispatch(showLoading());
      const res = await axios.post(
        "/api/v1/user/book-appointment",
        {
          designerId: params.designerId,
          userId: user._id,
          designerInfo: designers,
          userInfo: user,
          date: date,
          time: time,
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
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
    }
  };

  useEffect(() => {
    getUserData();
    //eslint-disable-next-line
  }, []);
  return (
    <Layout>
      <h3>Захиалгын хуудас</h3>
      <div className="container m-2">
        {designers && (
          <div>
            <h4>
              Дизайнер: {designers.firstName} {designers.lastName}
            </h4>
            <h4>Үнэ : {designers.feesPerCunsaltation}</h4>
            <h4>
              Ажлын цаг : {designers.timings && designers.timings[0]} -{" "}
              {designers.timings && designers.timings[1]}{" "}
            </h4>
            <div className="d-flex flex-column w-50">
              <DatePicker
                aria-required={"true"}
                className="m-2"
                format="DD-MM-YYYY"
                onChange={(value) => {
                  setDate(moment(value).format("DD-MM-YYYY"));
                }}
              />
              <TimePicker
                aria-required="true"
                format="HH:mm"
                className="mt-3"
                onChange={(value) => {
                  if (value) {
                    setTime(value.format("HH:mm"));
                  } else {
                    setTime(null);
                  }
                }}
                disabledHours={() => {
                  const start = designers.timings ? parseInt(designers.timings[0], 10) : 9;
                  const end = designers.timings ? parseInt(designers.timings[1], 10) : 18;

                  // Return hours to disable (0 to 23)
                  const hours = Array.from({ length: 24 }, (_, i) => i);
                  return hours.filter((hour) => hour < start || hour >= end);
                }}
              />
              <button
                className="btn btn-primary mt-2"
                onClick={handleAvailability}
              >
                Цаг шалгах
              </button>
              <button className="btn btn-dark mt-2" onClick={handleBooking}>
                Захиалах
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default BookingPage;