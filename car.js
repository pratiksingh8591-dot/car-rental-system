const express=require('express');
const app =express();
const {hostRouter}=require('./routes/host');
const user=require('./routes/user')
app.set('view engine','ejs');
app.set('views','views');
app.use(express.urlencoded({extended:false}));
app.use((req,res,next)=>{
    console.log(req.method,req.url,req.body);
    next();
})
app.use(user);
app.use("/host",hostRouter);
const port = 3002;
app.listen(port, () => {
    console.log(`The HTTP server is running at http://localhost:${port}`);
});