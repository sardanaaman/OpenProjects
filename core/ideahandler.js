var Idea = require("../models/idea")
var User = require("../models/user")
var notify = require("./notification.js")
var siteurl = require("../config/server.conf").siteurl

module.exports.addidea = function (req,res){
    Idea.findOne({title:req.body.title},function(err,idea){
        if (err){
            res.send(err)
        }
        else if (idea){
            res.redirect('/editidea')
        }
        else if (req.body.ptitle && req.body.sdesc && req.body.ldesc){
            var idea = new Idea()
            idea.astatus='Waiting'
            idea.timestamp.created = Date()
            idea.owner=req.user.username
            idea.title=req.body.ptitle
            idea.sdesc=req.body.sdesc
            idea.ldesc=req.body.ldesc
            idea.timespan= req.body.timespan
    
            idea.skills= req.body.skills
            if(req.body.web=='yes'){
                idea.platform.web= true
            }
            if(req.body.android=='yes'){
                idea.platform.android =true
            }        
            if(req.body.windows=='yes'){
                idea.platform.windows =true
            }
            if(req.body.ios=='yes'){
                idea.platform.ios =true
            }
            idea.targetaudience=req.body.targetaudience
            idea.funding=req.body.funding
            idea.extresources=req.body.extres
            idea.pastexp=req.body.pastexp
            idea.competition=req.body.competition
    
            idea.save(function(err){
                if(err){
                    console.log(err)
                    res.status(500).redirect('error')
                }
                else{
                    res.redirect('/dashboard')
                }
            })
        }
        else{
            res.redirect('/newidea')
        }
    })
}

module.exports.deleteidea = function(req,res){
    Idea.findOne({"$and":[{"_id":req.query.idea_id},{"owner":req.user.username}]},function (err,idea) {
        if (err){
            res.send('err')
        }
        else{
            res.redirect('/editidea')
            notify.feeder(idea,2)
            idea.astatus='Deleted'
            idea.save()
            notify.ideastatusupdate(idea)
        }
    })
}

module.exports.loadeditidea = function (req,res) {
    Idea.findOne({"$and":[{"_id":req.query.idea_id},{"owner":req.user.username},{'astatus':{"$in":['Waiting','Approved']}}]},function(err, idea) {
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

module.exports.editidea = function (req,res){
    Idea.findOne({"$and":[{'_id':req.body.idea_id},{'owner':req.body.username},{'astatus':{"$in":['Waiting','Approved']}}]},function(err,idea){
        if (err){
            res.send(err)
        }
        else if (!idea){
            res.redirect('/editidea')
        }
        else if (req.body.ptitle && req.body.sdesc && req.body.ldesc && idea.astatus=='Waiting' && idea.owner==req.user.username){
            idea.timestamp.modified = Date()
            idea.sdesc=req.body.sdesc
            idea.ldesc=req.body.ldesc
            idea.timespan= req.body.timespan
    
            idea.skills= req.body.skills
            if(req.body.web=='yes'){
                idea.platform.web= true
            }
            if(req.body.android=='yes'){
                idea.platform.android =true
            }        
            if(req.body.windows=='yes'){
                idea.platform.windows =true
            }
            if(req.body.ios=='yes'){
                idea.platform.ios =true
            }
            idea.targetaudience=req.body.targetaudience
            idea.funding=req.body.targetaudience
            idea.extresources=req.body.extres
            idea.pastexp=req.body.pastexp
            idea.competition=req.body.competition
    
            idea.save(function(err){
                if(err){
                    console.log(err)
                    res.status(500).redirect('error')
                }
                else{
                    notify.feeder(idea,3)
                    res.redirect('/editidea')
                }
            })
        }
        else{
            res.redirect('/editidea')
        }
    })
}

module.exports.reviewidea = function (req,res) {
    Idea.findOne({'_id':req.body.idea_id},function (err,idea){
        if (err){
            console.log(err)
        }
        else if (idea){
            var eligible = true
            for (var i=0;i<idea.reviews.length;i++){
                if (req.user.username==idea.reviews[i].username) {
                    eligible = false
                }
            }
            if(eligible){
                idea.reviews.push({'username':req.user.username,'content':req.body.review})
                if(req.body.interested=='1'||req.body.interested=='3')
                {
                    idea.interested.push(req.user.username)
                }
                else{
                    idea.notinterested.push(req.user.username)
                }
                idea.save()
                res.redirect('/ideapool')
            }
            else{
                res.send('error')
            }
        }
        else{
            res.send('Error')
        }
    })
}

module.exports.pool = function (req,res){
    Idea.find({'astatus':'Approved'},function(err,ideas){ //Changeme
        if(err){
            res.send('error')
        }
        else if (ideas.length>0){
            var load_id=ideas[0]._id
            if (req.query.idea_id){
                load_id=req.query.idea_id
            }
        }
        else {
            var load_id=0
        }
            res.render('pool',{'profilepicurl':(siteurl+'avatar?id='+req.user.profilepic),'username':req.user.username ,'load_id':load_id,'ideas':ideas,'name':req.user.name.first+' '+req.user.name.last,'notifications':req.user.notifications})

    })
}