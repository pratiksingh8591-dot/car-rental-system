const express=require('express');
const hostRouter=express.Router();

const ctrlcar=require("../controller/controlcar")
hostRouter.get("/addcar",ctrlcar.getaddcar)
hostRouter.post("/addcar",ctrlcar.postcar)
hostRouter.get("/manage-car",ctrlcar.getManageCar)
hostRouter.get("/admin-panel",ctrlcar.getAdminPanel)
module.exports={hostRouter};