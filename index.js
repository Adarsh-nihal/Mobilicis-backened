require('dotenv').config()
const express=require("express")
const app=express()
const cors=require("cors");
const { UserRouter } = require('./route/User.route');
const { connection } = require('./config/db');
app.use(cors({
    origin:"*"
})) 

app.get("/",(req,res)=>{
    res.send("Home Page")

})

app.use("/User",UserRouter)

app.listen(process.env.PORT,async()=>{
    try{
        await connection;
        console.log("running on port 8080")
    }
    catch(err){
        console.log("Err While connecting to db")
        console.log(err)
    }
})