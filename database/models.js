var mongoose = require('mongoose');

var usersSchema = mongoose.Schema({
	username: {type:String,required:true}, //Najverovatnije ide kroz kolacic
	password: {type:String,required:true},
	email: {type:String,required:true},
})


//
var picturesSchema= mongoose.Schema({
	email:{type:String,required:true},
	imageLink:{type:String,required:true},
	like:{type:Number,default:0},
	dislike:{type:Number,default:0}
})
const kittySchema = new mongoose.Schema({
  name: String
});

const Kitten = mongoose.model('Kitten', kittySchema);

Users = mongoose.model('User', usersSchema);
Pictures=mongoose.model('Picture',picturesSchema)
module.exports = {Users,Kitten,Pictures};