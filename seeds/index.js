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

mongoose.connect("mongodb://localhost:27017/services");

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

  Accounting.insertMany(accounting);
  Audit.insertMany(audit);
  Coformation.insertMany(coFormation);
  Dsc.insertMany(dsc);
  Eway.insertMany(eWay);
  Fssai.insertMany(fssai);
  Gst.insertMany(gst);
  Iec.insertMany(iec);
  Itr.insertMany(itr);
  Msme.insertMany(msme);
  Other.insertMany(other);
  Printingkit.insertMany(printingKit);
  Tax.insertMany(tax);
  Tds.insertMany(tds);
  Trademark.insertMany(trademark);
  Webservices.insertMany(webServices);
};
seedDB();
