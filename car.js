console.log("app fi")
const dns = require("dns");
dns.setServers(["1.1.1.1", "8.8.8.8"]);

const express=require('express');
const multer=require('multer')
const session=require('express-session')
const Mongodbstore=require('connect-mongodb-session')(session);
const app =express();
const path=require('path');
const {hostRouter}=require('./routes/host');
const user=require('./routes/user')
const auth=require('./routes/auth')
const {default:mongoose}=require('mongoose')
const { error } = require('console');



// const {mongoconnect} = require('./utils/database');
app.set('view engine','ejs');
const viewsPath = path.resolve(__dirname, 'views');
app.set('views', viewsPath);
console.log('Views directory:', viewsPath);
app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use(multer().single('carPhoto'))
app.use(express.static(path.join(__dirname,'public')));

const dbpath="mongodb+srv://pratiksingh8591_db_user:jGvJTLRHraQ5lP4I@car-rentaldb.pvvzlnm.mongodb.net/car-rental?appName=car-rentalDB"
const store= new Mongodbstore({
    uri:dbpath,
    collection:'sessions'
})

app.use(session({
    secret:"car rental web build by me",
    resave:false,
     saveUninitialized:true,
     store
}))
app.use((req, res, next) => {
    res.locals.isLoggedIN = req.session.isLoggedIN;
    res.locals.user = req.session.user;
    next();
});
app.use((req,res,next)=>{
    console.log(req.method,req.url,req.body);
    next();
})

// app.use((req,res,next)=>{
//     req.session.isLoggedIN=req.session.isLoggedIN
//     console.log(req.session.isLoggedIN)
//     next();
// })
app.use(user);
app.use(auth.authRouter);

app.use("/host",(req,res,next)=>{
if(req.session.isLoggedIN){
    next();
}
else{
    res.redirect('/login')
}
});
app.use("/host",hostRouter)
const port = 3001;

mongoose.connect(dbpath).then(()=>{
app.listen(port, () => {
    console.log("connected to mongoose");
    console.log("DB Name:", mongoose.connection.name);
    console.log("Host:", mongoose.connection.host);
    console.log(`The HTTP server is running at http://localhost:${port}`);
});
}).catch(error=>{
  console.log("ye chedha bhonsdiii",error)
})
