// const { ObjectId } = require('mongodb');


// module.exports = class Favourite {

//  constructor(carname, carNo, photoUrl, carRate){
//     this.carname = carname;
//     this.carNo = carNo;
//     this.photoUrl = photoUrl;
//     this.carRate = carRate;
//  }


//  async save(){
//    const db=getDB();
//    const exists=await db.collection('favourites').findOne({carNO:this.carNo})
//    if(exists){
//     console.log("Already in favourites")
//     return;
//    }
//    return db.collection('favourites').insertOne(this).then((result)=>{
//     console.log(result);
//    })
//  }


//  static find(){
//   const db=getDB();
//   return db.collection('favourites').find().toArray();
//  }


//  static deleteById(id){
//     const db=getDB();
//     return db.collection('favourites').deleteOne({_id:new ObjectId(id)}).then((result)=>{
//     console.log(result);
//    })
//  }
//  static findbyCarNO(carNo){
//   const db=getDB();
//   return db.collection('favourites').findOne({carNo})
//  }

// }
const mongoose=require('mongoose');
const favSchema=mongoose.Schema({
  carName:{type:String,required: true},
  carNo:{type:String,required:true},
  carRate:{type:Number,required:true},
  photoUrl:String,
});
module.exports=mongoose.model('favourites',favSchema);