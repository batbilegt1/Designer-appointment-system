const userModel = require("../models/userModels");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const designerModel = require("../models/designerModel");
const appointmentModel = require("../models/appointmentModel");
const moment = require("moment");

// Бүртгэх контроллер
const registerController = async (req, res) => {
  try {
    const exisitingUser = await userModel.findOne({ email: req.body.email });
    if (exisitingUser) {
      return res.status(200).send({ message: "Хэрэглэгч бүртгэлтэй байна", success: false });
    }
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    req.body.password = hashedPassword;
    const newUser = new userModel(req.body);
    await newUser.save();
    res.status(201).send({ message: "Амжилттай бүртгэгдлээ", success: true });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: `Бүртгэлийн алдаа: ${error.message}` });
  }
};

// Нэвтрэх контроллер
const loginController = async (req, res) => {
  try {
    const user = await userModel.findOne({ email: req.body.email });
    if (!user) {
      return res.status(200).send({ message: "Хэрэглэгч олдсонгүй", success: false });
    }
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res.status(200).send({ message: "Имэйл эсвэл нууц үг буруу байна", success: false });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.status(200).send({ message: "Амжилттай нэвтэрлээ", success: true, token });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: `Нэвтрэхэд алдаа гарлаа: ${error.message}` });
  }
};

// JWT хэрэглэгчийн баталгаажуулалт
const authController = async (req, res) => {
  try {
    const user = await userModel.findById({ _id: req.body.userId });
    user.password = undefined;
    if (!user) {
      return res.status(200).send({ message: "Хэрэглэгч олдсонгүй", success: false });
    } else {
      res.status(200).send({ success: true, data: user });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Баталгаажуулалтын алдаа", success: false, error });
  }
};

// Дизайнер хүсэлт илгээх
const applyDesignerController = async (req, res) => {
  try {
    const newDesigner = await designerModel({ ...req.body, status: "pending" });
    await newDesigner.save();
    const adminUser = await userModel.findOne({ isAdmin: true });
    const notifcation = adminUser.notifcation;
    notifcation.push({
      type: "apply-designer-request",
      message: `${newDesigner.firstName} ${newDesigner.lastName} дизайнер болох хүсэлт илгээсэн`,
      data: {
        designerId: newDesigner._id,
        name: newDesigner.firstName + " " + newDesigner.lastName,
        onClickPath: "/admin/designers",
      },
    });
    await userModel.findByIdAndUpdate(adminUser._id, { notifcation });
    res.status(201).send({ success: true, message: "Дизайнер хүсэлт амжилттай илгээгдлээ" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, error, message: "Дизайнер хүсэлт илгээхэд алдаа гарлаа" });
  }
};

// Мэдэгдлийг бүгдийг уншсан болгох
const getAllNotificationController = async (req, res) => {
  try {
    const user = await userModel.findOne({ _id: req.body.userId });
    const seennotification = user.seennotification;
    const notifcation = user.notifcation;
    seennotification.push(...notifcation);
    user.notifcation = [];
    user.seennotification = notifcation;
    const updatedUser = await user.save();
    res.status(200).send({
      success: true,
      message: "Бүх мэдэгдлийг уншсан гэж тэмдэглэлээ",
      data: updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Мэдэгдэл авахад алдаа гарлаа", success: false, error });
  }
};

// Мэдэгдлийг устгах
const deleteAllNotificationController = async (req, res) => {
  try {
    const user = await userModel.findOne({ _id: req.body.userId });
    user.notifcation = [];
    user.seennotification = [];
    const updatedUser = await user.save();
    updatedUser.password = undefined;
    res.status(200).send({
      success: true,
      message: "Мэдэгдлүүд амжилттай устлаа",
      data: updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Мэдэгдлийг устгахад алдаа гарлаа",
      error,
    });
  }
};

// Батлагдсан бүх дизайнеруудыг авах
const getAllDesignersController = async (req, res) => {
  try {
    const designers = await designerModel.find({ status: "approved" });
    res.status(200).send({
      success: true,
      message: "Дизайнеруудын жагсаалт амжилттай",
      data: designers,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Дизайнеруудыг авахад алдаа гарлаа",
    });
  }
};

// Цаг захиалах
const bookeAppointmnetController = async (req, res) => {
  try {
    req.body.date = moment(req.body.date, "DD-MM-YYYY").toISOString();
    req.body.time = moment(req.body.time, "HH:mm").toISOString();
    req.body.status = "pending";
    const newAppointment = new appointmentModel(req.body);
    await newAppointment.save();
    const user = await userModel.findOne({ _id: req.body.designerInfo.userId });
    user.notifcation.push({
      type: "New-appointment-request",
      message: `${req.body.userInfo.name} шинэ цаг захиалсан`,
      onCLickPath: "/user/appointments",
    });
    await user.save();
    res.status(200).send({ success: true, message: "Амжилттай цаг захиаллаа!" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, error, message: "Цаг захиалахад алдаа гарлаа!" });
  }
};

// Цаг авах боломжтой эсэхийг шалгах
const bookingAvailabilityController = async (req, res) => {
  try {
    const date = moment(req.body.date, "DD-MM-YY").toISOString();
    const fromTime = moment(req.body.time, "HH:mm").subtract(1, "hours").toISOString();
    const toTime = moment(req.body.time, "HH:mm").add(1, "hours").toISOString();
    const designerId = req.body.designerId;
    const appointments = await appointmentModel.find({
      designerId,
      date,
      time: {
        $gte: fromTime,
        $lte: toTime,
      },
    });
    if (appointments.length > 0) {
      return res.status(200).send({
        message: "Энэ цагт захиалга хийх боломжгүй",
        success: true,
      });
    } else {
      return res.status(200).send({
        success: true,
        message: "Цаг авах боломжтой байна",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, error, message: "Цаг шалгахад алдаа гарлаа" });
  }
};

// Хэрэглэгчийн бүх цагийн захиалга авах
const userAppointmentsController = async (req, res) => {
  try {
    const appointments = await appointmentModel.find({ userId: req.body.userId });
    // Fetch designer data for each appointment
    const enrichedAppointments = await Promise.all(
      appointments.map(async (appointment) => {
        const designer = await designerModel.findById(appointment.designerId);
        return {
          ...appointment._doc, // spread appointment document
          designer,             // attach designer object
        };
      })
    );
    res.status(200).send({
      success: true,
      message: "Хэрэглэгчийн цаг захиалгууд амжилттай",
      data: enrichedAppointments,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, error, message: "Цагийн мэдээллийг авахад алдаа гарлаа" });
  }
};

// Нэг захиалгийг устгах
const deleteAppointmentController = async (req, res) => {
  try {
    const deletedAppointment = await appointmentModel.findByIdAndDelete(req.body.deleteAppointmentId);

    if (!deletedAppointment) {
      return res.status(404).send({
        success: false,
        message: "Ийм ID-тай захиалга олдсонгүй",
      });
    }

    res.status(200).send({
      success: true,
      message: "Захиалгыг амжилттай устгалаа",
      data: deletedAppointment,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Захиалгыг устгах үед алдаа гарлаа",
    });
  }
};

module.exports = {
  loginController,
  registerController,
  authController,
  applyDesignerController,
  getAllNotificationController,
  deleteAllNotificationController,
  getAllDesignersController,
  bookeAppointmnetController,
  bookingAvailabilityController,
  userAppointmentsController,
  deleteAppointmentController,
};
