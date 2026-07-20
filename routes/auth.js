const express=require('express');
const authRouter=express.Router();
const ctrlauth=require("../controller/authcontroller")
authRouter.get("/login",ctrlauth.getlogin)
authRouter.post("/login",ctrlauth.postlogin)
authRouter.post("/logout",ctrlauth.postlogout)
authRouter.get("/signup",ctrlauth.getsignup)
authRouter.post("/signup",ctrlauth.postsignup)
module.exports={authRouter};