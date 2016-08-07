var mongoose =  require("mongoose");

module.exports = mongoose.model('Feedback', {
    username: String,
    content: String,
    timestamp: Date,
});