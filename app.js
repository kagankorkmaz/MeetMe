const express = require('express');
const userRouter = require("./routes/users");  



const app = express();
const PORT = 3000 || process.env.PORT;

app.use(express.static("public"));

//Router Middleware

app.use(userRouter);


app.get("/", (req, res,next) => {

    res.send("home")

});

app.use((req,res,next)=>{
    res.send("404 NOT FOUND")
})

app.listen(PORT, ()=>{
    console.log("App Started")
});

