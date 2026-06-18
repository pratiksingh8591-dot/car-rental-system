const express=require('express');
const app =express();
const path=require('path');
const {hostRouter}=require('./routes/host');
const user=require('./routes/user')
const db=require('./utils/database');
const { error } = require('console');
app.set('view engine','ejs');
const viewsPath = path.resolve(__dirname, 'views');
app.set('views', viewsPath);
console.log('Views directory:', viewsPath);
app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use(express.static(path.join(__dirname,'public')));
app.use((req,res,next)=>{
    console.log(req.method,req.url,req.body);
    next();
})
db.execute("SELECT * FROM cars")
.then(result=>{
    console.log("the result is ",result);
})
.catch(error=>{
    console.log("the error belongs to" ,error);
})

app.use(user);
app.use("/host",hostRouter);
const port = 3002;
app.listen(port, () => {
    console.log(`The HTTP server is running at http://localhost:${port}`);
});