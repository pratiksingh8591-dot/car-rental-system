const express=require('express');
const hostRouter=express.Router();

const ctrlcar=require("../controller/controlcar")
hostRouter.get("/",ctrlcar.gethostview)
hostRouter.get("/addcar",ctrlcar.getaddcar)
hostRouter.post("/addcar",ctrlcar.postcar)
hostRouter.get("/manage-car",ctrlcar.getManageCar)
hostRouter.get("/admin-panel",ctrlcar.getAdminPanel)
hostRouter.get("/caradded",ctrlcar.getCarAdded)
hostRouter.get("/editcar/:carID",ctrlcar.getEditCar)
hostRouter.post("/bookings/:bookedat/accept", ctrlcar.acceptBooking)
hostRouter.post("/bookings/:bookedat/delete", ctrlcar.deleteBooking)
hostRouter.get("/accept",ctrlcar.getAcceptView)
module.exports={hostRouter};