const cron = require("node-cron");
const Seller = require("../Models/sellerModel");

cron.schedule("0 * * * *", async () => {
  console.log("⏰ Checking expired subscriptions...");

  try {
    const now = new Date();

    const result = await Seller.updateMany(
      {
        subscriptionExpiry: { $lt: now },
        accountStatus: "ACTIVE",
      },
      {
        accountStatus: "PENDING_PAYMENT",
      }
    );

    console.log(`✅ Updated ${result.modifiedCount} users`);
  } catch (err) {
    console.log("❌ Cron error:", err.message);
  }
});

