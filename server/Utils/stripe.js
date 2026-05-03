const Stripe = require("stripe");
require("dotenv").config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2026-03-25.dahlia",
});

module.exports = {
  stripe
};