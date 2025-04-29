const appointmentModel = require("../models/appointmentModel");
const designerModel = require("../models/designerModel");
const userModel = require("../models/userModels");
const getDesignerInfoController = async (req, res) => {
  try {
    const designer = await designerModel.findOne({ userId: req.body.userId });
    res.status(200).send({
      success: true,
      message: "designer data fetch success",
      data: designer,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in Fetching Designer Details",
    });
  }
};

// update doc profile
const updateProfileController = async (req, res) => {
  try {
    const designer = await designerModel.findOneAndUpdate(
      { userId: req.body.userId },
      req.body
    );
    res.status(201).send({
      success: true,
      message: "Designer Profile Updated",
      data: designer,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Designer Profile Update issue",
      error,
    });
  }
};

//get single docotor
const getDesignerByIdController = async (req, res) => {
  try {
    const designer = await designerModel.findOne({ _id: req.body.designerId });
    res.status(200).send({
      success: true,
      message: "Sigle Doc Info Fetched",
      data: designer,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Erro in Single docot info",
    });
  }
};

const designerAppointmentsController = async (req, res) => {
  try {
    const designer = await designerModel.findOne({ userId: req.body.userId });
    const appointments = await appointmentModel.find({
      designerId: designer._id,
    });
    res.status(200).send({
      success: true,
      message: "Designer Appointments fetch Successfully",
      data: appointments,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in Doc Appointments",
    });
  }
};

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
      message: `your appointment has been updated ${status}`,
      onCLickPath: "/designer-appointments",
    });
    await user.save();
    res.status(200).send({
      success: true,
      message: "Appointment Status Updated",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error In Update Status",
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