// const { ObjectId } = require('mongodb');

// // const writeBookings = (bookings, callback) => {
   
// // };

// module.exports = class booking{
//    constructor(name,carNo,photourl,carRate,bookedAt)
//     {
//         this.name=name
//         this.carNo=carNo
//         this.photoUrl=photourl
//         this.carRate=carRate
//         this.bookedAt=bookedAt
//     }
//     save() {
//        const db=getDB();
//       return db.collection('bookings').insertOne(this).then((result)=>{
//         console.log(result);
//   })
//         }
//         static findById(id){
//           console.log(id)
//          const db=getDB();
//          return db.collection('bookings').find({_id:new ObjectId(String(id))}).next();
//          }
    
//     static find(){
       
//       const db=getDB();
//   return db.collection('bookings').find().toArray();  
        
//      }

//      static acceptByBookedAt(id) {
//       const  db=getDB();
//       return db.collection('bookings').updateOne({_id:new ObjectId(id)},{
//             $set: {
//                 status: "accepted"
//             }
//         }
//  ).then((result)=>{
//     console.log(result);
//    })
//      }

//      static deleteByBookedAt(id) {
//           const  db=getDB();
//       return db.collection('bookings').deleteOne({_id:new ObjectId(id)}).then((result)=>{
//     console.log(result);
//    })
// }
// }
const mongoose=require('mongoose');
const bookingSchema=mongoose.Schema({
  carName:{type:String,required: true},
  carNo:{type:String,required:true},
  carRate:{type:Number,required:true},
  photoUrl:String,
  bookedAt: Date,
     status: {
        type: String,
        enum: ["pending", "accepted", "rejected"],
        default: "pending"
    }
  
});
module.exports=mongoose.model('bookings',bookingSchema);