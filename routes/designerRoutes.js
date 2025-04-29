const express = require("express");
const {
  getDesignerInfoController,
  updateProfileController,
  getDesignerByIdController,
  designerAppointmentsController,
  updateStatusController,
} = require("../controllers/designerCtrl");
const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router();

//POST SINGLE DOC INFO
router.post("/getDesignerInfo", authMiddleware, getDesignerInfoController);

//POST UPDATE PROFILE
router.post("/updateProfile", authMiddleware, updateProfileController);

//POST  GET SINGLE DOC INFO
router.post("/getDesignerById", authMiddleware, getDesignerByIdController);

//GET Appointments
router.get(
  "/designer-appointments",
  authMiddleware,
  designerAppointmentsController
);

//POST Update Status
router.post("/update-status", authMiddleware, updateStatusController);

module.exports = router;