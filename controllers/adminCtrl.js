const designerModel = require("../models/designerModel");
const userModel = require("../models/userModels");

// Бүх хэрэглэгчдийн жагсаалтыг авах controller
const getAllUsersController = async (req, res) => {
  try {
    const users = await userModel.find({});
    res.status(200).send({
      success: true,
      message: "Хэрэглэгчдийн мэдээллийн жагсаалт",
      data: users,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Хэрэглэгчдийн мэдээллийг авах үед алдаа гарлаа",
      error,
    });
  }
};

// Нэг хэрэглэгчийг устгах
const deleteUserController = async (req, res) => {
  try {
    console.log("Remove user: " + req.body.deleteUserId);
    const deletedUser = await userModel.findByIdAndDelete(req.body.deleteUserId);
    const deletedDesigner = await designerModel.findOneAndDelete({ userId: req.body.deleteUserId });
    if (!deletedUser) {
      return res.status(404).send({
        success: false,
        message: "Ийм ID-тай хэрэглэгч олдсонгүй",
      });
    }
    res.status(200).send({
      success: true,
      message: "Хэрэглэгчийг амжилттай устгалаа",
      data: {deletedUser, deletedDesigner},
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Хэрэглэгчийг устгах үед алдаа гарлаа",
    });
  }
};

// Бүх загвар зохион бүтээгчдийн жагсаалтыг авах controller
const getAllDesignersController = async (req, res) => {
  try {
    const designers = await designerModel.find({});
    res.status(200).send({
      success: true,
      message: "Загвар зохион бүтээгчдийн мэдээллийн жагсаалт",
      data: designers,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Загвар зохион бүтээгчдийн мэдээллийг авах үед алдаа гарлаа",
      error,
    });
  }
};

// Загвар зохион бүтээгчийн бүртгэлийн төлөв өөрчлөх controller
const changeAccountStatusController = async (req, res) => {
  try {
    const { designerId, status } = req.body;
    const designer = await designerModel.findByIdAndUpdate(designerId, { status });
    const user = await userModel.findOne({ _id: designer.userId });

    const notifcation = user.notifcation;
    notifcation.push({
      type: "designer-account-request-updated",
      message: `Таны загвар зохион бүтээгчийн бүртгэлийн хүсэлт ${status} болсон байна`,
      onClickPath: "/notification",
    });

    user.isDesigner = status === "approved" ? true : false;
    await user.save();

    res.status(201).send({
      success: true,
      message: "Бүртгэлийн төлөв амжилттай шинэчлэгдлээ",
      data: designer,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Бүртгэлийн төлөв шинэчлэх үед алдаа гарлаа",
      error,
    });
  }
};

module.exports = {
  getAllDesignersController,
  getAllUsersController,
  changeAccountStatusController,
  deleteUserController,
};
