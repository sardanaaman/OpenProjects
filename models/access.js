var mongoose =  require("mongoose");

module.exports = mongoose.model('Accesscode', {
    code: String,
    valid: {type:Boolean,default:true},
    email: String
});