const fs=require('fs');
const path=require('path');
const rootdir=require("../utils/pathutil")

module.exports = class booking{
    constructor(car,bookedat){
        this.car=car;
        this.bookedat=bookedat|| new Date().toISOString();
    }
    save() {
        booking.fetchAll((bookings)=>{
            bookings.push(this);
            const bookingPath=path.join(rootdir,"data","booking.json");
            fs.writeFile(bookingPath,JSON.stringify(bookings),(err)=>{
                if(err){
                    console.log("q ree mc",err);
                }
            });
        });  
    }
    static fetchAll(callback){
       const bookingpath=path.join(rootdir,'data','booking.json')
        fs.readFile(bookingpath,(err,data)=>{
          console.log("file read:",err,data)
          if(!err){
             callback(JSON.parse(data));
          }
          else{
             callback([]);
          }
        });
        
        
        
     }
};