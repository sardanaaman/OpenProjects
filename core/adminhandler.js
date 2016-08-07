var Idea = require("../models/idea")
var User = require("../models/user")
var notify = require("./notification.js")
var siteurl = require("../config/server.conf").siteurl

module.exports.ideacontrol = function (req,res){
    Idea.findOne({'_id':req.body.idea_id},function(err, idea) {
        if(err||!idea){
            res.send('Error')
        }
        else{
            if (req.body.setstatus=='Inprogress'){
                    idea.astatus = 'Inprogress'
                    idea.participants = req.body.participants
                    idea.save()
                    notify.ideastatusupdate(idea)
            }
            else{
                    idea.astatus = req.body.setstatus
                    idea.save()
                    notify.ideastatusupdate(idea)
            }
            res.send('done')
        }
    })
}

module.exports.dashboard = function (req,res){
    Idea.find({},function (err,ideas){
        if(err){
            console.log(err)
        }
        else if (ideas){
            res.render('admin',{ideas:ideas,siteurl:siteurl})
        }
        else{
            res.send('no ideas yet')
        }
    })
}

module.exports.ideaview = function (req,res) {
    Idea.findOne({"$and":[{"_id":req.query.idea_id},{'astatus':{"$in":['Waiting','Approved']}}]},function(err, idea) {
        if(err){
            res.status(500).send(err)
        }
        else if(!idea){
            res.redirect('/editidea')
        }
        else{
            res.render('modify',{'profilepicurl':(siteurl+'avatar?id='+req.user.profilepic),'name':req.user.name.first+' '+req.user.name.last,'idea':idea,'notifications':req.user.notifications})
        }
    })
}