const mongoose = require("mongoose");

const designerSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
    },
    firstName: {
      type: String,
      required: [true, "Нэр оруулах шаардлагатай"],
    },
    lastName: {
      type: String,
      required: [true, "Овог оруулах шаардлагатай"],
    },
    phone: {
      type: String,
      required: [true, "Утасны дугаар шаардлагатай"],
    },
    email: {
      type: String,
      required: [true, "И-мэйл оруулах шаардлагатай"],
    },
    website: {
      type: String,
    },
    address: {
      type: String,
      required: [true, "Хаяг оруулах шаардлагатай"],
    },
    specialization: {
      type: String,
      required: [true, "Мэргэшил заавал шаардлагатай"],
    },
    experience: {
      type: String,
      required: [true, "Туршлага заавал оруулах шаардлагатай"],
    },
    feesPerCunsaltation: {
      type: Number,
      required: [true, "Үнийн мэдээлэл заавал шаардлагатай"],
    },
    status: {
      type: String,
      default: "pending",
    },
    timings: {
      type: Object,
      required: [true, "Ажлын цаг оруулах шаардлагатай"],
    },
  },
  { timestamps: true }
);

const designerModel = mongoose.model("designers", designerSchema);
module.exports = designerModel;
