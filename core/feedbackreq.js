var Feedback = require("../models/feedback")
var Request = require("../models/betarequest")

module.exports.postFeedback = function (req,res){
    var feedback = new Feedback
    if(req.body.feedback){
        feedback.content = req.body.feedback
        feedback.username = req.user.username
        feedback.save()
        res.redirect('/dashboard')
    }
}

module.exports.reqbeta = function (req,res){
    var request = new Request
    if(req.body.message){
        request.message = req.body.message
        request.email = req.body.email
        request.name = req.body.name
        request.save()
        res.redirect('/signup')
    }
    else{
        res.send('invalid input')
    }
}