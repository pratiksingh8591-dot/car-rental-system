const express=require('express');
const userRouter=express.Router();
const {getcar}=require('./host');

userRouter.get("/",(req,res,next)=>{
     console.log(req.body);
     res.render('home',{getcar:getcar})
})
module.exports=userRouter;