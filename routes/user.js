const express=require('express');
const userRouter=express.Router();
// const {getcar}=require('./host');
const ctrlcar=require("../controller/controlcar")
userRouter.get("/",ctrlcar.getcar)
userRouter.get("/my-booking",ctrlcar.getMyBooking)
userRouter.get("/favourites",ctrlcar.getFavourites)
module.exports=userRouter;