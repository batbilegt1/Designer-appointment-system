const appointmentModel = require("../models/appointmentModel");
const designerModel = require("../models/designerModel");
const userModel = require("../models/userModels");

// Загвар зохион бүтээгчийн мэдээлэл авах
const getDesignerInfoController = async (req, res) => {
  try {
    const designer = await designerModel.findOne({ userId: req.body.userId });
    res.status(200).send({
      success: true,
      message: "Загвар зохион бүтээгчийн мэдээлэл амжилттай авлаа",
      data: designer,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Загвар зохион бүтээгчийн мэдээлэл авахад алдаа гарлаа",
    });
  }
};

// Загвар зохион бүтээгчийн профайлыг шинэчлэх
const updateProfileController = async (req, res) => {
  try {
    const designer = await designerModel.findOneAndUpdate(
      { userId: req.body.userId },
      req.body
    );
    res.status(201).send({
      success: true,
      message: "Загвар зохион бүтээгчийн профайл шинэчлэгдлээ",
      data: designer,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Профайл шинэчлэхэд алдаа гарлаа",
      error,
    });
  }
};

// Нэг загвар зохион бүтээгчийн мэдээлэл авах
const getDesignerByIdController = async (req, res) => {
  try {
    const designer = await designerModel.findOne({ _id: req.body.designerId });
    res.status(200).send({
      success: true,
      message: "Нэг загвар зохион бүтээгчийн мэдээллийг амжилттай авлаа",
      data: designer,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Нэг загвар зохион бүтээгчийн мэдээллийг авахад алдаа гарлаа",
    });
  }
};

// Загвар зохион бүтээгчийн бүх цаг захиалгуудыг авах
const designerAppointmentsController = async (req, res) => {
  try {
    const designer = await designerModel.findOne({ userId: req.body.userId });
    const appointments = await appointmentModel.find({
      designerId: designer._id,
    });
    const enrichedAppointments = await Promise.all(
      appointments.map(async (appointment) => {
        const user = await userModel.findById(appointment.userId);
        return {
          ...appointment._doc, // spread appointment document
          user,             // attach designer object
        };
      })
    );
    res.status(200).send({
      success: true,
      message: "Загвар зохион бүтээгчийн цаг захиалгуудыг амжилттай авлаа",
      data: enrichedAppointments,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Цаг захиалгуудыг авах үед алдаа гарлаа",
    });
  }
};

// Цаг захиалгын төлөв шинэчлэх
const updateStatusController = async (req, res) => {
  try {
    const { appointmentsId, status } = req.body;
    const appointments = await appointmentModel.findByIdAndUpdate(
      appointmentsId,
      { status }
    );
    const user = await userModel.findOne({ _id: appointments.userId });
    const notifcation = user.notifcation;
    notifcation.push({
      type: "status-updated",
      message: `Таны цаг захиалгын төлөв "${status}" болгон шинэчлэгдлээ`,
      onCLickPath: "/designer-appointments",
    });
    await user.save();
    res.status(200).send({
      success: true,
      message: "Цаг захиалгын төлөв амжилттай шинэчлэгдлээ",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Цаг захиалгын төлөв шинэчлэхэд алдаа гарлаа",
    });
  }
};

module.exports = {
  getDesignerInfoController,
  updateProfileController,
  getDesignerByIdController,
  designerAppointmentsController,
  updateStatusController,
};
