const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const wingRoutes = require("./routes/WingRoute");
const unitType = require("./routes/UnitTypeRoute");
const BoardMembersRoutes = require("./routes/BoardMembersRoutes");
const MemberRoutes = require("./routes/MemberRoutes");
const AccountRoutes = require("./routes/AccountRoutes");
const AccountGroupRoutes = require("./routes/AccountGroupRoutes");
const AccountSubGroupRoute = require("./routes/AccountSubGroupRoute");
const VoucherRoute = require("./routes/VoucherRoutes");
const VoucherDetailRoutes = require("./routes/VoucherDetailRoutes");
const ServiceRoute = require("./routes/ServiceRoute");
const InvoiceHeaderRoute = require("./routes/InvoiceHeaderRoute");
const InvoiceDetailRoute = require("./routes/InvoiceDetailRoute");
const ParkingRoute = require("./routes/ParkingRoute");
const OrganisationRoutes = require("./routes/OrganisationRoutes");
const meetingRoutes = require('./routes/MeetingRoutes');
const PropertyRoute = require("./routes/PropertyRoutes");
const RecieptVoucher = require("./routes/RecieptVoucherRoutes");
const JournalVoucher = require("./routes/JournalVoucherRoute");
const contraVoucher = require("./routes/contraVoucherRoutes");
const paymentVoucher = require("./routes/paymentVoucherRoutes");
const purchaseVoucher = require("./routes/purchaseVoucherRoutes");
const invoiceTemplate = require("./routes/invoiceTemplateRoutes");
const demoMembers = require("./routes/demoMembersRoutes");
const DemoInvoices = require("./routes/DemoInvoiceRoutes");
const AuditTemplate=require('./routes/AuditTempRoutes');
const AuditReports=require('./routes/AuditReportRoutes');
const SignupRoute=require('./routes/SignupRoutes');
const financialYearRoutes=require('./routes/FinancialYearRoutes')
//OTp
const otpController = require("./controllers/OTPController");


mongoose.connect("mongodb://127.0.0.1:27017/accounting", {
   
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", error));

const PORT = process.env.PORT || 8001;

//console.log(port); 

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());
//
app.use("/otp", otpController);
app.use("/users",SignupRoute);
app.use("/finacialyrs",financialYearRoutes)
//

app.use("/Parking", ParkingRoute);

app.use("/InvoiceDetail", InvoiceDetailRoute);

app.use("/InvoiceHeader", InvoiceHeaderRoute);

app.use("/VoucherDetail", VoucherDetailRoutes);

app.use("/Voucher", VoucherRoute);

app.use("/AccountSubGroup", AccountSubGroupRoute);

app.use("/AccountGroup", AccountGroupRoutes);

app.use("/Account", AccountRoutes);

app.use("/Member", MemberRoutes);

app.use("/BoardMembers", BoardMembersRoutes);

app.use("/wings", wingRoutes);

app.use("/unitType", unitType);

app.use("/Service", ServiceRoute);

app.use("/Organisation", OrganisationRoutes);

app.use('/Meeting', meetingRoutes);

app.use("/Property",PropertyRoute);

app.use("/Uploads", express.static(path.join(__dirname, "Uploads")));

app.use("/RecieptVoucher",RecieptVoucher);

app.use("/JournalVoucher",JournalVoucher);

app.use("/contraVoucher",contraVoucher);

app.use("/paymentVoucher",paymentVoucher);

app.use("/purchaseVoucher",purchaseVoucher);

app.use("/invoiceTemplate",invoiceTemplate);

app.use("/invoiceTemplate",invoiceTemplate);

app.use("/demoMembers",demoMembers);

app.use("/DemoInvoices",DemoInvoices);
app.use("/Auditemp",AuditTemplate);

app.use("/Audireport",AuditReports);



app.get("/api/Account", async (req, res) => {
  try {
    const searchQuery = req.query.q || "";
    const members = await Account.find(
      { accountName: { $regex: searchQuery, $options: "i" } },
      { accountId: 1, accountName: 1, drOrCr: 1, _id: 1 } // Select required fields
    ).limit(10);

    res.json(members);
  } catch (error) {
    console.error("Error fetching members:", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/api/Invoice", async (req, res) => {
  try {
    const searchQuery = req.query.q || "";
    const members = await Invoice.find(
      { narration: { $regex: searchQuery, $options: "i" } },
      {
        amount: 1,
        narration: 1,
        invoiceDate: 1,
        invoiceNumber: 1,
        dueDate: 1,
        _id: 1,
      } // Select required fields
    ).limit(10);

    res.json(members);
  } catch (error) {
    console.error("Error fetching members:", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});


