const express=require('express');
const userRouter=express.Router();
// const {getcar}=require('./host');
const ctrlcar=require("../controller/controlcar")
userRouter.get("/",ctrlcar.getcar)
userRouter.get("/my-booking",ctrlcar.getMyBooking)
userRouter.get("/caradded",ctrlcar.getCarAdded)
userRouter.post("/book", ctrlcar.bookcar);
userRouter.get("/:carID",ctrlcar.getcardetails);
module.exports=userRouter;