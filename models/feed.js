var mongoose =  require("mongoose");

module.exports = mongoose.model('Feed', {
    message: String,
    timestamp: Date,
    link: String,
    ftype: String
});