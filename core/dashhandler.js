var Idea = require("../models/idea")
var User = require("../models/user")
var Feed = require("../models/feed")
var siteurl = require('../config/server.conf').siteurl

module.exports = function (req,res){
    var cdate = new Date()
    Idea.find({astatus:"Approved"}).count(function(err,poolcount){
        if(err){
            res.send(500).send('error')
        }
        else{
            User.find().count(function(err, usercount) {
                if(err){
                    res.send(500).send('error')
                }
                else{
                    Idea.find({"timestamp.created":{"$gte": new Date(cdate.getFullYear(),cdate.getMonth(),cdate.getDate())}}).count(function(err, ideatodaycount) {
                        if(err){
                            res.send(500).send('error')
                        }
                        else{
                            Idea.find({owner:req.user.username}).count(function(err, userideacount) {
                                if(err){
                                    res.send(500).send('error')
                                }
                                else {
                                    Feed.find().limit(10).sort({'timestamp':'descending'}).exec(function (err,feeds){
                                        if(err){
                                            res.send(500).send('error')
                                        }
                                        else{
                                            res.render('dashboard', {'profilepicurl': (siteurl+'avatar?id='+req.user.profilepic),'name':req.user.name.first+' '+req.user.name.last,'poolcount':poolcount,'usercount':usercount,'ideatodaycount':ideatodaycount,'userideacount':userideacount,'notifications':req.user.notifications,'feed':feeds})
                                        }    
                                    })
                                }
                            })
                        }
                    })
                }        
            })
        }
    })
}

