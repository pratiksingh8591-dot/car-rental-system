const express=require('express');
const hostRouter=express.Router();
const getcar= [];
hostRouter.get("/car-book",(req,res,next)=>{
   res.render('addcar',{content:'ADD CAR AND GET GREAT DEALS'});
})
hostRouter.post("/car-book",(req,res,next)=>{
     const name=req.body.carName;
     const cno=req.body.carNo;
     getcar.push({name,cno})
     res.render('caradded',{content:'thank you for adding'});
})
module.exports={hostRouter,getcar};