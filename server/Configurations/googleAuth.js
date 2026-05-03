const { OAuth2Client } = require("google-auth-library");
require("dotenv").config();


const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  "postmessage" // 🔥 important
);

const verifyGoogleToken = async (code) => {
  try {
    if (!code) throw new Error("No code provided");


    // ✅ STEP 1: exchange code → tokens
    const { tokens } = await client.getToken(code);


    // ✅ STEP 2: verify ID token
    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    return payload;

  } catch (error) {
    console.error("verifyGoogleToken Error:", error);
    throw new Error("Google authentication failed");
  }
};

module.exports = { verifyGoogleToken };
