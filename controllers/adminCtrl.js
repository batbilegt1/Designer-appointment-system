const designerModel = require("../models/designerModel");
const userModel = require("../models/userModels");

const getAllUsersController = async (req, res) => {
  try {
    const users = await userModel.find({});
    res.status(200).send({
      success: true,
      message: "users data list",
      data: users,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "erorr while fetching users",
      error,
    });
  }
};

const getAllDesignersController = async (req, res) => {
  try {
    const designers = await designerModel.find({});
    res.status(200).send({
      success: true,
      message: "Designers Data list",
      data: designers,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "error while getting designers data",
      error,
    });
  }
};

// designer account status
const changeAccountStatusController = async (req, res) => {
  try {
    const { designerId, status } = req.body;
    const designer = await designerModel.findByIdAndUpdate(designerId, { status });
    const user = await userModel.findOne({ _id: designer.userId });
    const notifcation = user.notifcation;
    notifcation.push({
      type: "designer-account-request-updated",
      message: `Your Designer Account Request Has ${status} `,
      onClickPath: "/notification",
    });
    user.isDesigner = status === "approved" ? true : false;
    await user.save();
    res.status(201).send({
      success: true,
      message: "Account Status Updated",
      data: designer,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Eror in Account Status",
      error,
    });
  }
};

module.exports = {
  getAllDesignersController,
  getAllUsersController,
  changeAccountStatusController,
};