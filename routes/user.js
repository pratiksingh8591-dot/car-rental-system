const express=require('express');
const userRouter=express.Router();
// const {getcar}=require('./host');
const ctrlcar=require("../controller/controlcar")
userRouter.get("/",ctrlcar.getcar)
userRouter.get("/my-booking",ctrlcar.getMyBooking)
userRouter.get("/caradded",ctrlcar.getCarAdded)
userRouter.post("/book", ctrlcar.bookcar);
userRouter.get("/car/:carID",ctrlcar.getcardetails);
userRouter.post("/favourites",ctrlcar.postfavourites);
userRouter.get("/favourites",ctrlcar.getfavourites);
module.exports=userRouter;