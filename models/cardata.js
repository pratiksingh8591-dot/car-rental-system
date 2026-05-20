const fs=require('fs');
const path=require('path');
const rootdir=require("../utils/pathutil")
const lcar=[];

module.exports=class Car{
 constructor(name,cno,photoUrl,carRate){
    this.name=name;
    this.cno=cno;
    this.photoUrl=photoUrl;
    this.carRate=carRate;
 }
 save(){
   Car.fetchAll((lcar)=>{
lcar.push(this);
    const carDatapath=path.join(rootdir,'data','car.json')
    fs.writeFile(carDatapath,JSON.stringify(lcar),err=>{
        console.log("kyaa chedha bhonsdi")
    })
   })
    
 }
 static fetchAll(callback){
   const carDatapath=path.join(rootdir,'data','car.json')
    fs.readFile(carDatapath,(err,data)=>{
      console.log("file read:",err,data)
      if(!err){
         callback(JSON.parse(data));
      }
      else{
         callback([]);
      }
    })
    
    
    
 }
}