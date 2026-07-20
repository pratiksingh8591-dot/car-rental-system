const mongoose=require('mongoose');
const userSchema=mongoose.Schema({
  FirstName:{type:String,required: [true,'FirstName is required']},
  LastName:{type:String,required: [true,'LastName is required']},
  email:{type:String,required:[true,'email is required']},
   password:{type:String,required:[true,'password is required']},
  usertype:{type:String,enum:['user','host'],default:'user'},

});
module.exports=mongoose.model('user',userSchema);