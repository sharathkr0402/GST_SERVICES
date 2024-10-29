const mongoose = require("mongoose");
const Accounting = require("../models/accounting");
const Audit = require("../models/audit");
const Coformation = require("../models/coformation");
const Dsc = require("../models/dsc");
const Eway = require("../models/eway");
const Fssai = require("../models/fssai");
const Gst = require("../models/gst");
const Iec = require("../models/iec");
const Itr = require("../models/itr");
const Msme = require("../models/msme");
const Other = require("../models/other");
const Printingkit = require("../models/printingkit");
const Tax = require("../models/tax");
const Tds = require("../models/tds");
const Trademark = require("../models/trademark");
const Webservices = require("../models/webservices");

const {
  accounting,
  audit,
  coFormation,
  dsc,
  eWay,
  fssai,
  gst,
  iec,
  itr,
  msme,
  other,
  tax,
  tds,
  trademark,
  printingKit,
  webServices,
} = require("./services");

// MongoDB Atlas connection string
mongoose.connect(
  "mongodb+srv://sharathkr0402:ydztHqhjeYVQkKL2@cluster0.5sfi9.mongodb.net/services?retryWrites=true&w=majority&appName=Cluster0"
);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const seedDB = async () => {
  await Accounting.deleteMany({});
  await Audit.deleteMany({});
  await Coformation.deleteMany({});
  await Dsc.deleteMany({});
  await Eway.deleteMany({});
  await Fssai.deleteMany({});
  await Gst.deleteMany({});
  await Iec.deleteMany({});
  await Itr.deleteMany({});
  await Msme.deleteMany({});
  await Other.deleteMany({});
  await Printingkit.deleteMany({});
  await Tax.deleteMany({});
  await Tds.deleteMany({});
  await Trademark.deleteMany({});
  await Webservices.deleteMany({});

  await Accounting.insertMany(accounting);
  await Audit.insertMany(audit);
  await Coformation.insertMany(coFormation);
  await Dsc.insertMany(dsc);
  await Eway.insertMany(eWay);
  await Fssai.insertMany(fssai);
  await Gst.insertMany(gst);
  await Iec.insertMany(iec);
  await Itr.insertMany(itr);
  await Msme.insertMany(msme);
  await Other.insertMany(other);
  await Printingkit.insertMany(printingKit);
  await Tax.insertMany(tax);
  await Tds.insertMany(tds);
  await Trademark.insertMany(trademark);
  await Webservices.insertMany(webServices);
};
seedDB();
