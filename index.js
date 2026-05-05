const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const bcrypt = require("bcrypt");
const connectDB = require("./config/db");
const Admin = require("./models/admin.model");

dotenv.config();

const app = express();

// Configure CORS to allow deployed admin URL and localhost for development
const corsOptions = {
  origin: [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:3000",
  ],
  credentials: true,
  methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true, limit: "20mb" }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// admin routes
const adminAuthRoutes = require("./routes/admin/admin.auth.routes");
app.use("/api/admin", adminAuthRoutes);

const adminCareerRoutes = require("./routes/admin/career.routes");
app.use("/api/admin", adminCareerRoutes);

const adminInquiryRoutes = require("./routes/admin/inquiry.routes");
app.use("/api/admin/inquiries", adminInquiryRoutes);

const adminClientRoutes = require("./routes/admin/client.routes");
app.use("/api/admin/clients", adminClientRoutes);

const adminDashboardRoutes = require("./routes/admin/dashboard.routes");
app.use("/api/admin/dashboard", adminDashboardRoutes);

const adminDashboardSettingsRoutes = require("./routes/admin/dashboardSettings.routes");
app.use("/api/admin/dashboard-settings", adminDashboardSettingsRoutes);

const adminServiceCardRoutes = require("./routes/admin/serviceCard.routes");
app.use("/api/admin/service-cards", adminServiceCardRoutes);

const adminLegalRoutes = require("./routes/admin/legal.routes");
app.use("/api/admin/legal", adminLegalRoutes);

const adminFooterRoutes = require("./routes/admin/footer.routes");
app.use("/api/admin/footer", adminFooterRoutes);

const adminHomeAboutRoutes = require("./routes/admin/homeAbout.routes");
app.use("/api/admin/home-about", adminHomeAboutRoutes);

const adminAboutBlackmontRoutes = require("./routes/admin/aboutBlackmont.routes");
app.use("/api/admin", adminAboutBlackmontRoutes);

const adminMissionVisionRoutes = require("./routes/admin/missionVision.routes");
app.use("/api/admin", adminMissionVisionRoutes);

const adminLeadershipRoutes = require("./routes/admin/leadership.routes");
app.use("/api/admin", adminLeadershipRoutes);

const adminHomeMarketRoutes = require("./routes/admin/homeMarket.routes");
app.use("/api/admin/home-market", adminHomeMarketRoutes);

const adminWhyBlackmontRoutes = require("./routes/admin/whyBlackmont.routes");
app.use("/api/admin/home", adminWhyBlackmontRoutes);

const adminWhoWeServeRoutes = require("./routes/admin/whoWeServe.routes");
app.use("/api/admin/who-we-serve", adminWhoWeServeRoutes);

const adminContactCtaRoutes = require("./routes/admin/contactCta.routes");
app.use("/api/admin/home", adminContactCtaRoutes);

const adminSettingsRoutes = require("./routes/admin/admin.settings.routes");
app.use("/api/admin/settings", adminSettingsRoutes);

const adminSiteVisibilityRoutes = require("./routes/admin/siteVisibility.routes");
app.use("/api/admin/site-visibility", adminSiteVisibilityRoutes);

const adminNewsroomRoutes = require("./routes/admin/newsroom.routes");
app.use("/api/admin/insights", adminNewsroomRoutes);

const adminInsightRoutes = require("./routes/admin/insight.routes");
app.use("/api/admin/insights", adminInsightRoutes);

const adminInvestorOverviewRoutes = require("./routes/admin/investorOverview.routes");
app.use("/api/admin/investor-relations", adminInvestorOverviewRoutes);

const adminInvestorReportRoutes = require("./routes/admin/investorReport.routes");
app.use("/api/admin/investor-relations", adminInvestorReportRoutes);

const adminInvestorStockInfoRoutes = require("./routes/admin/investorStockInfo.routes");
app.use("/api/admin/investor-relations", adminInvestorStockInfoRoutes);

const adminInvestorEventRoutes = require("./routes/admin/investorEvent.routes");
app.use("/api/admin/investor-relations", adminInvestorEventRoutes);

const adminCorpGovRoutes = require("./routes/admin/corporateGovernance.routes");
app.use("/api/admin/investor-relations", adminCorpGovRoutes);

const apiSettingsRoutes = require("./routes/admin/apiSettings.routes");
app.use("/api/admin/api-settings", apiSettingsRoutes);

const metalRatesRoutes = require("./routes/user/metalRates.routes");
app.use("/api/metal-rates", metalRatesRoutes);

const adminHomeHeroRoutes = require("./routes/admin/homeHero.routes");
app.use("/api/admin/home-hero", adminHomeHeroRoutes);
// user routes
const careerRoutes = require("./routes/user/career.routes");
app.use("/api", careerRoutes);

const userInquiryRoutes = require("./routes/user/inquiry.routes");
app.use("/api/inquiries", userInquiryRoutes);

const clientAuthRoutes = require("./routes/user/client.auth.routes");
app.use("/api/client", clientAuthRoutes);

const publicServiceCardRoutes = require("./routes/user/serviceCard.routes");
app.use("/api/service-cards", publicServiceCardRoutes);

const publicLegalRoutes = require("./routes/user/legal.routes");
app.use("/api/legal", publicLegalRoutes);

const userFooterRoutes = require("./routes/user/footer.routes");
app.use("/api/footer", userFooterRoutes);

const publicHomeAboutRoutes = require("./routes/user/homeAbout.routes");
app.use("/api/home-about", publicHomeAboutRoutes);

const publicSiteVisibilityRoutes = require("./routes/user/siteVisibility.routes");
app.use("/api/site-visibility", publicSiteVisibilityRoutes);

const publicDashboardSettingsRoutes = require("./routes/user/dashboardSettings.routes");
app.use("/api/dashboard-settings", publicDashboardSettingsRoutes);

const publicAboutBlackmontRoutes = require("./routes/user/aboutBlackmont.routes");
app.use("/api", publicAboutBlackmontRoutes);

const publicMissionVisionRoutes = require("./routes/user/missionVision.routes");
app.use("/api", publicMissionVisionRoutes);

const publicLeadershipRoutes = require("./routes/user/leadership.routes");
app.use("/api", publicLeadershipRoutes);

const publicHomeMarketRoutes = require("./routes/user/homeMarket.routes");
app.use("/api/home-market", publicHomeMarketRoutes);

const newsroomRoutes = require("./routes/user/newsroom.routes");
app.use("/api/insights", newsroomRoutes);

const insightRoutes = require("./routes/user/insight.routes");
app.use("/api/insights", insightRoutes);

const whyBlackmontRoutes = require("./routes/user/whyBlackmont.routes");
app.use("/api/home", whyBlackmontRoutes);

const whoWeServeRoutes = require("./routes/user/whoWeServe.routes");
app.use("/api/who-we-serve", whoWeServeRoutes);

const contactCtaRoutes = require("./routes/user/contactCta.routes");
app.use("/api/home", contactCtaRoutes);

const investorOverviewRoutes = require("./routes/user/investorOverview.routes");
app.use("/api/investor-relations", investorOverviewRoutes);

const investorReportRoutes = require("./routes/user/investorReport.routes");
app.use("/api/investor-relations", investorReportRoutes);

const investorStockInfoRoutes = require("./routes/user/investorStockInfo.routes");
app.use("/api/investor-relations", investorStockInfoRoutes);

const investorEventRoutes = require("./routes/user/investorEvent.routes");
app.use("/api/investor-relations", investorEventRoutes);

const corpGovRoutes = require("./routes/user/corporateGovernance.routes");
app.use("/api/investor-relations", corpGovRoutes);

const publicHomeHeroRoutes = require("./routes/user/homeHero.routes");
app.use("/api/home-hero", publicHomeHeroRoutes);

app.get("/", (req, res) => {
  res.send("Blackmont server is running");
});

const seedAdmin = async () => {
  try {
    const email = "artidea28@gmail.com";

    const existing = await Admin.findOne({ email });

    if (existing) {
      console.log("⚠️ Admin already exists");
      return;
    }

    const hashedPassword = await bcrypt.hash("12345678", 10);

    await Admin.create({
      name: "Super Admin",
      email,
      password: hashedPassword,
      role: "super_admin",
    });

    console.log("✅ Default admin created");
  } catch (error) {
    console.error("❌ Seed admin error:", error.message);
  }
};

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  // await seedAdmin();

  // Log email configuration status
  console.log("\n📧 Email Configuration Status:");
  console.log("   MAIL_USER:", process.env.MAIL_USER ? "✓ Set" : "✗ Missing");
  console.log("   MAIL_PASS:", process.env.MAIL_PASS ? "✓ Set" : "✗ Missing");
  if (process.env.NODE_ENV === "production") {
    console.log("   MODE: Production (OTP will not be shown in response)");
  } else {
    console.log("   MODE: Development (OTP will be shown for testing)");
  }

  // Log CORS configuration
  console.log("\n🔐 CORS Configuration:");
  console.log("   Allowed origins:");
  console.log("   - https://blackmont-admin.vercel.app (Deployed)");
  console.log("   - http://localhost:5173 (Dev)");
  console.log("   - Requests with no origin");

  app.listen(PORT, () => {
    console.log(`\n✅ Server running on port ${PORT}`);
  });
};

startServer();
