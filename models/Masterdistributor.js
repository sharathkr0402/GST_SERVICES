const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const masterdistributorSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: [
        "admin",
        "whitelabel",
        "masterdistributor",
        "retailer",
        "distributor",
        "subdistributor",
      ],
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    image: {
      type: String, // Path to the uploaded image
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    otp: {
      type: String,
    },
    otpExpires: {
      type: Date,
    },
    cart: {
      productName: { type: String },
      price: { type: Number },
    },
    wallet: {
      type: Number,
      default: 0,
    },
    mobile: {
      type: Number,
    },
    bankName: {
      type: String,
    },
    accountNo: {
      type: String,
    },
    ifscCode: {
      type: String,
    },
    aadharNo: {
      type: String,
    },
    panNo: {
      type: String,
    },
    address: {
      type: String,
    },
    idNo: {
      type: String,
    },
    date: {
      type: Date,
    },
    expire: {
      type: Date,
    },
    scheme: {
      type: Number,
      default: 5,
    },
  },
  { timestamps: true }
);
// Password hashing middleware
masterdistributorSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
masterdistributorSchema.methods.comparePassword = async function (
  enteredPassword
) {
  return await bcrypt.compare(enteredPassword, this.password);
};
module.exports = mongoose.model("MasterDistributor", masterdistributorSchema);
