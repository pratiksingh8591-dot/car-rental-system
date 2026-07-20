const express=require('express');
const hostRouter=express.Router();

const ctrlcar=require("../controller/controlcar")
hostRouter.get("/",ctrlcar.gethostview)
hostRouter.get("/addcar",ctrlcar.getaddcar)
hostRouter.post("/addcar",ctrlcar.postcar)
hostRouter.get("/manage-car",ctrlcar.getManageCar)
hostRouter.get("/admin-panel",ctrlcar.getAdminPanel)
hostRouter.get("/caradded",ctrlcar.getCarAdded)
hostRouter.get("/editcar/:id",ctrlcar.getEditCar)
hostRouter.post("/editcar/:id", ctrlcar.postEditcar);
hostRouter.post("/bookings/:id/accept", ctrlcar.acceptBooking)
hostRouter.post("/bookings/:id/reject", ctrlcar.deleteBooking)
hostRouter.get("/reject",ctrlcar.getRejectView)
hostRouter.get("/accept",ctrlcar.getAcceptView)
hostRouter.post("/delete/:CarID",ctrlcar.deleteCar)
module.exports={hostRouter};