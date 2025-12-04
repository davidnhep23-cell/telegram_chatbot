// telegram-notify.js
import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

// Configuration from environment variables
const BOT_TOKEN = process.env.BOT_TOKEN; // Set in .env
const CHAT_ID = process.env.CHAT_ID; // Set in .env
const apiUrl = `https://api.telegram.org/bot${BOT_TOKEN}`;

/**
 * Send a message to Telegram
 * @param {string} chatId - Telegram chat ID
 * @param {string} message - The message text
 * @returns {Promise<Object>} - Telegram API response
 */
async function sendTelegramNotification(chatId, message) {
  const url = `${apiUrl}/sendMessage`;
  const payload = {
    chat_id: chatId,
    text: message,
    parse_mode: "HTML",
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

/**
 * Poll Telegram for incoming messages and auto-reply
 * @param {number} pollInterval - Interval in ms for polling
 */
async function startAutoReplyBot(pollInterval = 2000) {
  let offset = 0;
  let botInfo = null;

  // Get bot information to know its user ID
  async function getBotInfo() {
    try {
      const res = await fetch(`${apiUrl}/getMe`);
      const data = await res.json();
      if (data.ok) {
        botInfo = data.result;
        console.log(`🤖 Bot started: @${botInfo.username} (ID: ${botInfo.id})`);
      }
    } catch (err) {
      console.error("❌ Failed to get bot info:", err.message);
    }
  }

  async function getUpdates() {
    try {
      const res = await fetch(
        `${apiUrl}/getUpdates?timeout=30&offset=${offset}`
      );
      const data = await res.json();

      if (data.ok && data.result.length > 0) {
        for (const update of data.result) {
          offset = update.update_id + 1;

          if (update.message && update.message.text) {
            const chatId = update.message.chat.id;
            const msg = update.message.text;
            const msgLower = msg.toLowerCase();
            const senderId = update.message.from.id;

            // Skip if message is from the bot itself
            if (botInfo && senderId === botInfo.id) {
              console.log("⏭️ Skipping bot's own message");
              continue;
            }

            console.log(`📩 Received from user ${senderId}: ${msg}`);

            // Auto-reply logic
            let reply = "Welcome to smart bot AI 😅";

            if (msgLower.includes("hello")) {
              reply = "Hi there! 👋";
            } else if (msgLower.includes("how are you")) {
              reply = "I'm a bot, always fine 🤖";
            }else if (msgLower.includes("where are you from?")) {
              reply = "I come from the Phnom Penh, thanks";  
            } else if (msgLower.includes("bye")) {
              reply = "Goodbye! 👋";
            } else if (msgLower.includes("b chob sl o hz men?")) {
              reply = "Finally o chlart hz! bye👋";
            } else if (msgLower.includes("bro heang smos men ot?")) {
              reply = "men hz kort smos jeang ke knung lok!";
            } else if (msgLower.includes("Who is Ek Pheaktra?")) {
              reply = "He is a professional Mobile Legend Bang Bang Player!";
            }


            await sendTelegramNotification(chatId, reply);
          }
        }
      }
    } catch (err) {
      console.error("❌ Failed to fetch updates:", err.message);
    }
  }

  // Get bot info first, then start polling
  await getBotInfo();
  setInterval(getUpdates, pollInterval);
  console.log("🤖 Auto-reply bot is running...");
}

// Example usage
async function main() {
  // Start auto-reply bot
  startAutoReplyBot();
}

// Run main
main().catch(console.error);


// Export functions
export { sendTelegramNotification, startAutoReplyBot };
