
const express=require("express");
const { UserModel } = require("../models/User.model");
const UserRouter = express.Router();

UserRouter.use(express.json());

UserRouter.get("/", async (req, res) => {
  try{
    const users = await UserModel.find()
    res.send(users);
    }
    catch(err){
      console.log(err)
      res.status(500).send("err:something went wrong")
    }

})

UserRouter.get("/filter", async (req, res) => {
let {q}=req.query
// 1. Users which have income lower than $5 USD and have a car of brand “BMW” or “Mercedes”.

if(q=="A"){
  try{
    const users = await UserModel.find({ income: { $lt: "$5" }, car: { $in: ['BMW', 'Mercedes-Benz'] } });
    res.send(users);
    }
    catch(err){
      console.log(err)
      res.status(500).send("err:something went wrong")
    }
}
// 2. Male Users which have phone price greater than 10,000.

else if(q=="B"){
  try{
    const users = await UserModel.find({ gender: "Male",phone_price: { $gt:"10000"  } });
    res.send(users);
    }
    catch(err){
      console.log(err)
      res.status(500).send("err:something went wrong")
    }
}
else if(q=="C"){
  // 3. Users whose last name starts with “M” and has a quote character length greater than 15 and email includes his/her last name
  try{
    const users = await UserModel.find({
      last_name: { $regex: /^M/ },
      quote: { $regex: /.{16,}/ },
    });
    res.send(users);
    }
    catch(err){
      console.log(err)
      res.status(500).send("err:something went wrong")
    }
}
else if(q=="D"){
  // 4. Users which have a car of brand “BMW”, “Mercedes” or “Audi” and whose email does not include any digit.
  try{
    const users = await UserModel.find({  $and: [{ car: { $in: ['BMW', 'Mercedes-Benz', 'Audi'] } }, { email: { $not: /\d/ } }]
    });
    res.send(users);
    
    }
    catch(err){
      console.log(err)
      res.status(500).send("err:something went wrong")
    }
}
  else if(q=="E"){
    try{
    const topCities = await UserModel.aggregate([
      { $group: { _id: '$city', count: { $sum: 1 }, totalIncome: { $sum: '$income' } } },
      { $sort: { count: 1 } },
      { $limit: 10 },
      { $project: { _id: 1, count: 1, averageIncome: { $divide: ['$totalIncome', '$count'] } } }
    ]);
    res.json(topCities);
    
    }
    catch(err){
      console.log(err)
      res.status(500).send("err:something went wrong")
    }
}
})
  




UserRouter.post("/Post", async(req,res)=>{
    const payload=req.body;
    try{
      const result =await UserModel.insertMany(payload);
     
            res.status(200).send([ {"msg":"Review Added Succesfully"},result])
      }
      catch(err){
        res.status(500).send([{"err":"something went wrong","err":err}])
        console.log(err)
      }
})

module.exports={UserRouter};