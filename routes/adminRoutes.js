const express = require("express");
const {
  getAllUsersController,
  getAllDesignersController,
  changeAccountStatusController,
  deleteUserController,
} = require("../controllers/adminCtrl");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

//GET METHOD || USERS
router.get("/getAllUsers", authMiddleware, getAllUsersController);

//GET METHOD || DesignerS
router.get("/getAllDesigners", authMiddleware, getAllDesignersController);

//DELETE USER || USERS
router.post("/deleteUser", authMiddleware, deleteUserController);

//POST ACCOUNT STATUS
router.post(
  "/changeAccountStatus",
  authMiddleware,
  changeAccountStatusController
);

module.exports = router;