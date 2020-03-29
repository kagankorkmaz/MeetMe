const express = require('express');
const userRouter = require("./routes/users");
const mongoose = require("mongoose");
const bodyParser = require('body-parser');

//MOngoDB connection

mongoose.connect("mongodb://localhost/passportdb", {useNewUrlParser: true });

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection Error MongoDB"))
db.once("open", ()=> {
    console.log("MongoDB connected");
});

 
const app = express();
const PORT = 3000 || process.env.PORT;

app.use(express.static("public"));

//Router Middleware
app.use(userRouter);

//BodyOarser MiddleWare
app.use(bodyParser.urlencoded({extended : true})); 


app.get("/", (req, res, next) => {

    res.sendFile(path.join(__dirname, 'public', 'index.html'));

});

// app.use((req, res, next) => {
//     res.send("404 NOT FOUND")
// })

app.listen(PORT, () => {
    console.log("App Started")
});

