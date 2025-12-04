const  express = require('express');
const PORT = 4000;
const app = express();

//GET File bootstrap.html
app.get("/", (req, res) => {
    res.sendFile(__dirname+'/public/bootstrap.html');
});

//GET libary bootsrtap
app.use("/bootstrap" , 
    express.static(__dirname + "/node_modules/bootstrap/dist"));
//startup Sever NodeJS
app.listen(PORT, () => {
    console.log(`Sever runnning 
        With http://localhost:${PORT}`);
});