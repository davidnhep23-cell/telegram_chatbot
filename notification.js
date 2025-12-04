require('dotenv').config();
const express=require('express');
const path=require('path');
const axios=require('axios');
const PORT=5000;
const app=express();

//get telegram CHAT_ID and BOT_TOKEN from .env file
const CHAT_ID=process.env.CHAT_ID;
const BOT_TOKEN=process.env.BOT_TOKEN;
//serve static files from public/ => default index.html
app.use(express.static(path.join(__dirname, "public")));
//convert express request to json data
app.use(express.json());
//form write text support unicode utf8
app.use(express.urlencoded({extended:true}));

// POST endpoint
app.post("/submit", async (req, res) => {
  try {
    // match form inputs correctly
    const { username, email, description } = req.body;

    // validation
    if (!username || !description) {
      return res.status(400).send("Fullname and description are required.");
    }

    // escape special chars
    const escape = (s = "") =>
      String(s)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;");

    // message to telegram
    const text = `<b>New Contact</b>
<b>Name:</b> ${escape(username)}
<b>Email:</b> ${escape(email || "N/A")}
<b>Message:</b> ${escape(description)}`;

    // call telegram api
    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

    const resp = await axios.post(url, null, {
      params: {
        chat_id: CHAT_ID,
        text: text,
        parse_mode: "HTML",
      },
    });

    if (resp.data.ok) {
      return res.redirect("/?sent=1");
    } else {
      console.error("Telegram error:", resp.data);
      return res.status(500).send("Failed to send notification.");
    }
  } catch (err) {
    console.error(err?.response?.data || err.message);
    res.status(500).send("Server error");
  }
});



//startup welcome
// app.get('/',(req,res)=>{
//     res.send("hello HTML Form");
// });
// serve static files from public/


app.use(express.static(path.join(__dirname, "public")));

// Running on web server
app.listen(PORT,()=>{
    console.log(`Server is running with http://localhost:${PORT}`);
});
