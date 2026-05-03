const AccountStatus = Object.freeze({
  PENDING_PAYMENT: "PENDING_PAYMENT", //subscription payment is pending
  ACTIVE: "ACTIVE", //account is active and in good standing
  SUSPENDED: "SUSPENDED", //account is temporarily suspended due to policy violations or suspicious activity
  // PENDING_VERIFICATION: "PENDING_VERIFICATION", //account created but not yet verified
//   DEACTIVATED: "DEACTIVATED", //account is deactivated by the user or admin
//   BANNED: "BANNED", //account is permanently banned due to severe violations
//   CLOSED: "CLOSED", //account is permanently closed
});

module.exports = AccountStatus;
