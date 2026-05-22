const fs=require('fs');
const path=require('path');
const rootdir=require("../utils/pathutil");
const { fetchAll } = require('./cardata');
module.exports=class favourites{
    constructor(name,cno,photoUrl,carRate){
    this.name=name;
    this.cno=cno;
    this.photoUrl=photoUrl;
    this.carRate=carRate;
 }
    save(){
      favourites.fetchAll((favourite)=>{
         favourite.push(this);
         const favpath=path.join(rootdir,"data","favourites.json");
          fs.writeFile(favpath,JSON.stringify(favourite),(err)=>{
                         if(err){
                             console.log("q ree mc",err);
                         }
                     });
      });
    }
       static fetchAll(callback){
           const favpath=path.join(rootdir,'data','favourites.json')
            fs.readFile(favpath,(err,data)=>{
              console.log("file read:",err,data)
              if(!err){
                 callback(JSON.parse(data));
              }
              else{
                 callback([]);
              }
            });
            
            
            
         }
}