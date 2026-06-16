const fs=require('fs');
const path=require('path');
const rootdir=require("../utils/pathutil")

module.exports= class  favourites{
  
     static addfavourites(carID,callback){
         favourites.getfavourites((favourites)=>{
                    if(favourites.includes(carID)){
                        callback("favourites is already added")
                        
                    }
                     else{
                    favourites.push(carID);
                    const favouritespath=path.join(rootdir,"data","favourites.json");
                    fs.writeFile(favouritespath,JSON.stringify(favourites),(callback));
                }
                });  

     }
     static getfavourites(callback){
        const favourites=path.join(rootdir,'data','favourites.json')
                fs.readFile(favourites,(err,data)=>{
                  console.log("file read:",err,data)
                  if(!err){
                     callback(JSON.parse(data));
                  }
                  else{
                     callback([]);
                  }
                });
     }
     static deletefavourites(favID,callback){
       const favouritespath=path.join(rootdir,"data","favourites.json");
      favourites.getfavourites(cars=>{
                 const carfound=cars.filter(carID=> carID!== favID);
                 fs.writeFile(favouritespath,JSON.stringify(carfound),callback);

         
      })
     }
}