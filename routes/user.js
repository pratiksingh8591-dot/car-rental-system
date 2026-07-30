const express=require('express');
const userRouter=express.Router();
// const {getcar}=require('./host');
const ctrlcar=require("../controller/controlcar")
userRouter.get("/",ctrlcar.getcar)
userRouter.get("/my-booking",ctrlcar.getMyBooking)
userRouter.get("/caradded",ctrlcar.getCarAdded)
userRouter.post("/book/:id", ctrlcar.bookcar);
userRouter.get("/car/:id",ctrlcar.getcardetails);
userRouter.post("/favourites/:id", ctrlcar.addfavourites);
userRouter.get("/favourites", ctrlcar.getfavourites);
userRouter.get("/rules/:id",ctrlcar.getrules);
userRouter.post("/delete/:id",ctrlcar.deletefavourites);
module.exports=userRouter;