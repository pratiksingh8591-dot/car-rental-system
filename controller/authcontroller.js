const User=require("../models/userdata")
const bcrypt = require("bcrypt");
const { check, validationResult } = require("express-validator");

const getlogin=(req,res)=>{
    res.render("auth/login", { 
    isLoggedIN:false, 
        content: "ADD CAR AND GET GREAT DEALS" ,
      errors: [],
        oldinput: {}
});
}
const postlogin=async (req,res)=>{
  const{email,password}=req.body;
  const user=await User.findOne({email});
    req.session.isLoggedIN=true
     if(!user){
    return res.status(422).render('auth/login',{
        isLoggedIN:false,
        content: "ADD CAR AND GET GREAT DEALS",
        errors:["Email does not exists"],
        oldinput:{email}
    })   }
    const isMatch= await bcrypt.compare(password,user.password)
    if(!isMatch){
       return res.status(422).render('auth/login',{
        isLoggedIN:false,
        content: "ADD CAR AND GET GREAT DEALS",
        errors:["password does not match"],
    })  
    }
    console.log(req.session)
    req.session.save(()=>{
       req.session.isLoggedIN=true
      res.redirect("/")
    })
}
const postlogout=(req,res)=>{
    req.session.destroy(()=>{
       res.redirect("/login")
    })
    
}
const getsignup=(req,res)=>{
  console.log("getting signup")

     res.render("auth/signup", {
        isLoggedIN: false,
        errors: [],
        oldinput: {}
    });
    
 }
 const postsignup=[

    
  check("usertype")
    .notEmpty()
    .withMessage("Select the user type")
    .isIn(["user", "host"])
    .withMessage("Invalid user type"),

  check("FirstName")
    .trim()
    .notEmpty()
    .withMessage("First Name is required")
    .isLength({ min: 2 })
    .withMessage("First Name should contain at least 2 characters")
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("First Name should not contain special characters"),

  check("LastName")
    .trim()
    .notEmpty()
    .withMessage("Last Name is required")
    .isLength({ min: 2 })
    .withMessage("Last Name should contain at least 2 characters")
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("Last Name should not contain special characters"),

  check("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Enter a valid email"),

  check("password")
    .notEmpty()
    .withMessage("Password can't be empty")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter")
    .matches(/[a-z]/)
    .withMessage("Password must contain at least one lowercase letter")
    .matches(/[0-9]/)
    .withMessage("Password must contain at least one number")
    .matches(/[!@#$%^&*(),.?":{}|<>]/)
    .withMessage("Password must contain at least one special character"),

  check("confirmpassword")
    .notEmpty()
    .withMessage("Confirm Password is required")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),

  check("terms")
    .custom((value) => {
      if (value !== "on") {
        throw new Error("Please accept the Terms and Conditions");
      }
      return true;
    }),
 
    
    (req,res,next)=>{
      console.log("posting signup")
   const {usertype,FirstName,LastName,email,password}=req.body;
   const errors=validationResult(req);
   console.log(errors.array())
   if(!errors.isEmpty()){
    return res.status(422).render('auth/signup',{
        isLoggedIN:false,
        content: "ADD CAR AND GET GREAT DEALS",
        errors:errors.array().map(error=> error.msg),
        oldinput:{
          usertype,FirstName,LastName,email,password
        }
    })   }
      console.log("before save")

 bcrypt.hash(password,12).then((hashedpassword)=>{
const user= new User({FirstName,LastName,email,password:hashedpassword,usertype});
console.log(user);
 return user.save();
 }).then(()=>{
    req.session.isLoggedIN=true;
    console.log("after save")
    req.session.save(()=>{
      res.redirect("/")
    })
   }).catch(err=>{
      return res.status(422).render('auth/signup',{
        isLoggedIN:false,
        content: "ADD CAR AND GET GREAT DEALS",
        errors:[err.message],
        oldinput:{
          usertype,FirstName,LastName,email,password
        }
     
      })
   })
   
 }]
 //Abcd@123
module.exports={
    getlogin,
    postlogin,
    postlogout,
     getsignup,
     postsignup,
}
//Pratik@1234