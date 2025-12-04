// telegram-notify.js
import fetch from "node-fetch";
import dotenv from "dotenv";

// Load .env variables
dotenv.config();

// Configuration from .env
const BOT_TOKEN = process.env.BOT_TOKEN;
const CHAT_ID = process.env.CHAT_ID;

// Validate .env variables
if (!BOT_TOKEN) {
  throw new Error("❌ BOT_TOKEN is missing in .env file");
}
if (!CHAT_ID) {
  throw new Error("❌ CHAT_ID is missing in .env file");
}

/**
 * Send a message to Telegram
 * @param {string} message - The message text to send
 * @returns {Promise<Object>}
 */
async function sendTelegramNotification(message) {
  const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

  const payload = {
    chat_id: CHAT_ID,
    text: message,
    parse_mode: "HTML", // Supports HTML formatting
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (data.ok) {
      console.log("✅ Message sent successfully!");
      return data;
    } else {
      console.error("❌ Error sending message:", data.description);
      throw new Error(data.description);
    }
  } catch (error) {
    console.error("❌ Failed to send notification:", error.message);
    throw error;
  }
}

// Example usage
async function main() {
  await sendTelegramNotification("Hello from Node.js using .env! 🚀");

  await sendTelegramNotification(
    "<b>Alert!</b>\nServer status: <code>Online</code>\nMemory: <i>45%</i>"
  );
}

main().catch(console.error);

// Export for use in other files
export { sendTelegramNotification };
