var mongoose =  require("mongoose");

module.exports = mongoose.model('Request', {
    email: String,
    name: String,
    message: String,
    timestamp: Date,
});