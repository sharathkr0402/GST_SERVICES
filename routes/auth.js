////////////////////////////////////////////////////////////////////////////////////////////////
require("dotenv").config();

const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const multer = require("multer");
const path = require("path");
const nodemailer = require("nodemailer");
const session = require("express-session");
const path1 = require("path");
const MongoStore = require("connect-mongo");
//
//
//
// Importing models
const Admin = require("../models/Admin");
const WhiteLabel = require("../models/Whitelabel");
const MasterDistributor = require("../models/Masterdistributor");
const Distributor = require("../models/Distributor");
const SubDistributor = require("../models/Subdistributor");
const Retailer = require("../models/Retailer");
const Whitelabel = require("../models/Whitelabel");
//
//
//
// Configure Multer for image uploads and Store using cloudinary
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "gst-services", // Folder name in Cloudinary
    allowed_formats: ["jpg", "jpeg", "png"],
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 }, // 5 MB limit
});

// Configure Nodemailer
const transporter = nodemailer.createTransport({
  service: "Gmail", // e.g., Gmail, you can use other services
  auth: {
    user: "sharathkr0402@gmail.com",
    pass: "uzhq jkum xyqd fnlh",
  },
});

// Middleware to check if user is authenticated
function ensureAuthenticated(req, res, next) {
  if (req.session.user && req.session.role) {
    return next();
  }
  req.flash("error_msg", "Please log in to view that resource");
  res.redirect("/login");
}
//
//
//
// Middleware to check user roles
function isAdmin(req, res, next) {
  if (req.session.role === "admin") {
    return next();
  } else {
    res.status(403).send("Access denied. Admins only.");
  }
}
function isWhiteLabel(req, res, next) {
  if (req.session.role === "whitelabel") {
    return next();
  } else {
    res.status(403).send("Access denied. Distributors only.");
  }
}

function isMasterDistributor(req, res, next) {
  if (req.session.role === "masterdistributor") {
    return next();
  } else {
    res.status(403).send("Access denied. Distributors only.");
  }
}

function isDistributor(req, res, next) {
  if (req.session.role === "distributor") {
    return next();
  } else {
    res.status(403).send("Access denied. Distributors only.");
  }
}

function isSubDistributor(req, res, next) {
  if (req.session.role === "subdistributor") {
    return next();
  } else {
    res.status(403).send("Access denied. Sub Distributors only.");
  }
}

function isRetailer(req, res, next) {
  if (req.session.role === "retailer") {
    return next();
  } else {
    res.status(403).send("Access denied. Retailers only.");
  }
}
//
//
//
// Registration Route - GET
router.get("/register", (req, res) => {
  res.render("../views/authentication/register", { errors: [] });
});

router.post("/register", upload.single("image"), async (req, res) => {
  const {
    name,
    email,
    mobile,
    address,
    password,
    password2,
    role,
    masterDistributorId,
    distributorId,
    subDistributorId,
    bankName,
    accountNo,
    ifscCode,
    aadharNo,
    panNo,
  } = req.body;
  let errors = [];

  const idNo = "BGB" + mobile;
  const date = new Date();
  const expire = new Date();
  expire.setFullYear(date.getFullYear() + 1);

  if (
    !name ||
    !email ||
    !address ||
    !password ||
    !password2 ||
    !role ||
    !mobile ||
    !bankName ||
    !accountNo ||
    !ifscCode ||
    !aadharNo ||
    !panNo
  ) {
    errors.push({ msg: "Please enter all fields" });
  }

  if (password !== password2) {
    errors.push({ msg: "Passwords do not match" });
  }

  if (password.length < 8) {
    errors.push({ msg: "Password must be at least 8 characters" });
  }

  if (!req.file) {
    errors.push({ msg: "Please upload an image" });
  }

  if (errors.length > 0) {
    res.render("../views/authentication/register", {
      errors,
      name,
      email,
      address,
      mobile,
      password,
      password2,
      role,
      masterDistributorId,
      distributorId,
      subDistributorId,
      bankName,
      accountNo,
      ifscCode,
      aadharNo,
      panNo,
    });
  } else {
    let user;
    switch (role) {
      case "admin":
        user = await Admin.findOne({ email: email });
        break;
      case "whitelabel":
        user = await WhiteLabel.findOne({ email: email });
        break;
      case "masterdistributor":
        user = await MasterDistributor.findOne({ email: email });
        break;
      case "distributor":
        user = await Distributor.findOne({ email: email });
        break;
      case "subdistributor":
        user = await SubDistributor.findOne({ email: email });
        break;
      case "retailer":
        user = await Retailer.findOne({ email: email });
        break;
    }
    if (user) {
      errors.push({ msg: "Email already exists" });
      res.render("../views/authentication/register", {
        errors,
        name,
        email,
        address,
        mobile,
        password,
        password2,
        role,
        masterDistributorId,
        distributorId,
        subDistributorId,
        bankName,
        accountNo,
        ifscCode,
        aadharNo,
        panNo,
      });
    } else {
      try {
        let newUser;
        const userData = {
          name,
          email,
          address,
          idNo,
          mobile,
          password,
          role,
          image: req.file.path, // Cloudinary URL
          bankName,
          accountNo,
          ifscCode,
          aadharNo,
          panNo,
          date,
          expire,
        };

        switch (role) {
          case "admin":
            newUser = new Admin(userData);
            break;
          case "whitelabel":
            newUser = new WhiteLabel(userData);
            break;
          case "masterdistributor":
            newUser = new MasterDistributor(userData);
            break;
          case "distributor":
            newUser = new Distributor({
              ...userData,
              masterDistributorId,
            });
            break;
          case "subdistributor":
            newUser = new SubDistributor({
              ...userData,
              masterDistributorId,
              distributorId,
            });
            break;
          case "retailer":
            newUser = new Retailer({
              ...userData,
              masterDistributorId,
              distributorId,
              subDistributorId,
            });
            break;
          default:
            return res.status(400).send("Invalid role selected.");
        }

        await newUser.save();
        req.flash("success_msg", "You Sucessfully Registered, Please Login.");
        res.redirect("/login");
      } catch (error) {
        console.log(error);
        res.status(500).send("Error registering new user.");
      }
    }
  }
});

// Login Route - GET
router.get("/login", (req, res) => {
  res.render("../views/authentication/login", { errors: [] });
});

// Login Route - POST
router.post("/login", async (req, res) => {
  const { email, password, role } = req.body;
  let errors = [];

  if (!email || !password || !role) {
    errors.push({ msg: "Please enter all fields" });
    return res.render("../views/authentication/login", {
      errors,
      email,
      password,
      role,
    });
  }

  try {
    let user;

    switch (role) {
      case "admin":
        user = await Admin.findOne({ email });
        if (!user) {
          errors.push({ msg: "That email is not registered" });
          return res.render("../views/authentication/login", {
            errors,
            role,
            email,
            password,
          });
        }
        break;
      case "whitelabel":
        user = await WhiteLabel.findOne({ email });
        if (!user) {
          errors.push({ msg: "That email is not registered" });
          return res.render("../views/authentication/login", {
            errors,
            role,
            email,
            password,
          });
        }
        break;
      case "masterdistributor":
        user = await MasterDistributor.findOne({ email });
        if (!user) {
          errors.push({ msg: "That email is not registered" });
          return res.render("../views/authentication/login", {
            errors,
            role,
            email,
            password,
          });
        }
        break;
      case "distributor":
        user = await Distributor.findOne({ email });
        if (!user) {
          errors.push({ msg: "That email is not registered" });
          return res.render("../views/authentication/login", {
            errors,
            role,
            email,
            password,
          });
        }
        break;
      case "subdistributor":
        user = await SubDistributor.findOne({ email });
        if (!user) {
          errors.push({ msg: "That email is not registered" });
          return res.render("../views/authentication/login", {
            errors,
            role,
            email,
            password,
          });
        }
        break;
      case "retailer":
        user = await Retailer.findOne({ email });
        if (!user) {
          errors.push({ msg: "That email is not registered" });
          return res.render("../views/authentication/login", {
            errors,
            role,
            email,
            password,
          });
        }
        break;
      default:
        return res.status(400).send("Invalid role selected.");
    }

    if (user && (await user.comparePassword(password))) {
      req.session.userId = user._id;
      req.session.role = user.role;
    } else {
      errors.push({ msg: "Incorrect password" });
      return res.render("../views/authentication/login", {
        errors,
        role,
        email,
        password,
      });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
    user.otp = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000; // OTP valid for 10 minutes
    await user.save();

    // Send OTP via email
    const mailOptions = {
      from: "sharathkr0402@gmail.com",
      to: user.email,
      subject: "Your OTP Code",
      text: `Your OTP code is ${otp}. It is valid for 10 minutes.`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("Nodemailer Error:", error);
        req.flash("error_msg", "Error sending OTP. Please try again.");
        return res.redirect("/login");
      } else {
        console.log("Email sent: " + info.response);
        // Store user ID in session for OTP verification
        req.session.tempUser = { id: user._id };
        res.redirect("/otp");
      }
    });
  } catch (err) {
    console.log(err);
    res.redirect("/login");
  }
});
// OTP Verification Route - GET
router.get("/otp", (req, res) => {
  if (!req.session.tempUser) {
    req.flash("error_msg", "Please log in first");
    return res.redirect("/login");
  }
  res.render("../views/authentication/otp", { errors: [] });
});

// OTP Verification Route - POST
router.post("/otp", async (req, res) => {
  const { otp } = req.body;
  let errors = [];

  if (!otp) {
    errors.push({ msg: "Please enter the OTP" });
    return res.render("../views/authentication/otp", { errors });
  }

  if (!req.session.tempUser) {
    req.flash("error_msg", "Session expired. Please log in again.");
    return res.redirect("/login");
  }

  try {
    let user;
    let role = req.session.role;
    console.log(role);

    switch (role) {
      case "admin":
        user = await Admin.findById(req.session.tempUser.id);
        break;
      case "masterdistributor":
        user = await MasterDistributor.findById(req.session.tempUser.id);
        break;
      case "distributor":
        user = await Distributor.findById(req.session.tempUser.id);
        break;
      case "subdistributor":
        user = await SubDistributor.findById(req.session.tempUser.id);
        break;
      case "retailer":
        user = await Retailer.findById(req.session.tempUser.id);
        break;
      default:
        return res.status(400).send("Invalid role selected.");
    }
    if (!user) {
      errors.push({ msg: "User not found" });
      return res.render("../views/authentication/otp", { errors });
    }

    if (user.otp !== otp) {
      errors.push({ msg: "Incorrect OTP" });
      return res.render("../views/authentication/otp", { errors });
    }

    if (user.otpExpires < Date.now()) {
      errors.push({ msg: "OTP has expired" });
      return res.render("../views/authentication/otp", { errors });
    }

    // OTP is valid
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    req.session.user = user;
    delete req.session.tempUser;

    res.redirect("/about");
  } catch (err) {
    console.log(err);
    res.redirect("/login");
  }
});
//
//
//
///////////////////////////  Profile Details  ///////////////////
router.get("/profileDetails", ensureAuthenticated, (req, res) => {
  res.render("../views/details/profiledetails");
});
router.get("/bank", ensureAuthenticated, (req, res) => {
  res.render("../views/details/bank");
});
router.get("/kyc", ensureAuthenticated, (req, res) => {
  res.render("../views/details/kyc");
});
router.get("/letterHead", ensureAuthenticated, (req, res) => {
  res.render("../views/details/letterhead");
});
router.get("/certificate", ensureAuthenticated, (req, res) => {
  res.render("../views/details/certification");
});
router.get("/businessCard", ensureAuthenticated, (req, res) => {
  res.render("../views/details/businesscard");
});
router.get("/idCard", ensureAuthenticated, (req, res) => {
  res.render("../views/details/idcard");
});
router.get("/myBizCard", ensureAuthenticated, (req, res) => {
  res.render("../views/details/mybizcards");
});
//
//
//
//
/////////////////////  Profile and Bank Details Edit  ////////////////
router.get("/profileedit", ensureAuthenticated, (req, res) => {
  res.render("../views/details/profileedit");
});
router.post("/profileedit/:id", ensureAuthenticated, (req, res) => {
  res.render("../views/details/profileedit");
});
router.get("/bankedit", ensureAuthenticated, (req, res) => {
  res.render("../views/details/bankedit");
});
//
//
//
//
//
//
///////////////////// All Admin's ////////////////////////////////////
//All retailers
router.get("/allRetailers", ensureAuthenticated, async (req, res) => {
  const allRetailers = await Retailer.find({});
  res.render("../views/manageuser/allretailers", { allRetailers });
});
//All Sub Distributors
router.get("/allSubDistributors", ensureAuthenticated, async (req, res) => {
  const allSubDistributors = await SubDistributor.find({});
  res.render("../views/manageuser/allsubdistributors", { allSubDistributors });
});
//All Distributors
router.get("/allDistributors", ensureAuthenticated, async (req, res) => {
  const allDistributors = await Distributor.find({});
  res.render("../views/manageuser/alldistributors", { allDistributors });
});
//All Master Distributors
router.get("/allMasterDistributors", ensureAuthenticated, async (req, res) => {
  const allMasterDistributors = await MasterDistributor.find({});
  res.render("../views/manageuser/allmasterdistributors", {
    allMasterDistributors,
  });
});
//All White Labels
router.get("/allWhiteLabels", ensureAuthenticated, async (req, res) => {
  const allWhiteLabels = await WhiteLabel.find({});
  res.render("../views/manageuser/allwhitelabels", { allWhiteLabels });
});
//
//
//
//
//
/////////////////////  Master distributor's ////////////////////////////////////
//Master's Retailers
router.get("/masRetailers", ensureAuthenticated, async (req, res) => {
  const allRetailers = await Retailer.find({
    masterDistributorId: req.session.user.email,
  });
  res.render("../views/manageuser/allretailers", { allRetailers });
});
//Master's Sub Distributors
router.get("/masSubDistributors", ensureAuthenticated, async (req, res) => {
  const allSubDistributors = await SubDistributor.find({
    masterDistributorId: req.session.user.email,
  });
  res.render("../views/manageuser/allsubdistributors", { allSubDistributors });
});
//Master's Distributors
router.get("/masDistributors", ensureAuthenticated, async (req, res) => {
  const allDistributors = await Distributor.find({
    masterDistributorId: req.session.user.email,
  });
  res.render("../views/manageuser/alldistributors", { allDistributors });
});
//
//
//
//
//
//////////////////////////// distributor's /////////////////////////////////
//distributor's Sub Distributors
router.get("/disSubDistributors", ensureAuthenticated, async (req, res) => {
  const allSubDistributors = await SubDistributor.find({
    distributorId: req.session.user.email,
  });
  res.render("../views/manageuser/allsubdistributors", { allSubDistributors });
});
//distributor's Retailers
router.get("/disRetailers", ensureAuthenticated, async (req, res) => {
  const allRetailers = await Retailer.find({
    distributorId: req.session.user.email,
  });
  res.render("../views/manageuser/allretailers", { allRetailers });
});
//
//
//
//
//
//////////////////////////// Subdistributor's /////////////////////////////////
//Sub distributor's Retailers
router.get("/subRetailers", ensureAuthenticated, async (req, res) => {
  const allRetailers = await Retailer.find({
    subDistributorId: req.session.user.email,
  });
  res.render("../views/manageuser/allretailers", { allRetailers });
});
//
//
//
// Logout Route
router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
      res.redirect("/dashboard" + req.session.user.role);
    } else {
      res.clearCookie("connect.sid");
      res.redirect("/login");
    }
  });
});

module.exports = router;
