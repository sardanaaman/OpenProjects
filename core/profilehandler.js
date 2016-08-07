var Idea = require("../models/idea")
var User = require("../models/user")
var siteurl = require("../config/server.conf").siteurl

module.exports.loadstats = function (req,res){
    Idea.find({ $or: [{owner:req.user.username},{'participants':req.user.username},{'interested':req.user.username},{'preferences.userid':req.user.username}]},function(err,ideas){
        if(err){
            res.send(500).send('error')
        }
        else{
            var userwaitideas = []
            var userapprovedideas = []
            var unconfirmedideas = []
            var workingideas = []
            for(var i=0;i<ideas.length;i++){
                if(ideas[i].owner==req.user.username){
                    if(ideas[i].astatus=='Waiting'){
                        userwaitideas.push(ideas[i].title)    
                    }
                    else if(ideas[i].astatus=='Approved'){
                        userapprovedideas.push(ideas[i].title)
                    }
                }
                else if(ideas[i].astatus=='Waiting'){
                    unconfirmedideas.push(ideas[i].title)
                }
                else if(ideas[i].astatus=='Inprogress'){
                    workingideas.push(ideas[i].title)
                }
            }
            
            res.render('profile',{'profilepicurl':(siteurl+'avatar?id='+req.user.profilepic),'free':req.user.astatus.freetowork,'rating': req.user.stats.rating,'compper': (req.user.stats.assigned/req.user.stats.completed)*100,'comp':req.user.stats.completed,'name': req.user.name.first+' '+req.user.name.last, 
                'github':req.user.external.github,'linkedin':req.user.external.linkedin,'skillist':req.user.skills.join(', '),'skills':req.user.skills,'userwaitideas':userwaitideas,'userapprovedideas':userapprovedideas,
                'unconfirmedideas':unconfirmedideas,'workingideas':workingideas,'notifications':req.user.notifications})
        }
    })
          
    

}

module.exports.updateskills = function (req,res){
    req.user.skills = req.body.skills
    req.user.save(function(err){
        res.redirect('/profile')
    })
    
}

module.exports.listIdeas = function (req,res){
    Idea.find({"$and":[{'owner':req.user.username},{'astatus':{"$in":['Waiting','Approved']}}]}, function(err, ideas){
        res.render('edit',{'profilepicurl':(siteurl+'avatar?id='+req.user.profilepic),'name':req.user.name.first+' '+req.user.name.last, 'ideas':ideas,'notifications':req.user.notifications})
    })
}

module.exports.verify = function (req,res){
    User.findOne({vtoken: req.query.code},function(err,user){
        if (err){
            res.status(500).send('error')
        }
        else if (!user){
            res.status(401).send('invalidtoken')
        }
        else if(!user.astatus.verified){
            user.astatus.verified = true
            user.save(function(err){
                if(err){
                    console.log(err)
                }
                else{
                    req.flash('error','Email Verified, Please login!')
                    res.redirect('/')
                }
            })  
        }
        else{
            res.status(401).send('invalidtoken')
        }
    })
}

module.exports.setfree = function(req,res){
    console.log(req.query.free)
    if(req.query.free=='0'){
        req.user.astatus.freetowork = false
    }
    else if(req.query.free=='1'){
        req.user.astatus.freetowork = true
    }
    else{
        req.user.send('fail')
    }
    req.user.save()
    res.send('success')
}

module.exports.validuser = function (req,res) {
    console.log(req.query.username)
    User.findOne({"$or" :[{'email': req.query.username},{'username':req.query.username}]}, function (err, user) {
        if (user){
            return res.send(user.profilepic)
        }
        else{
            return res.send('man.png')
        }
    })
}