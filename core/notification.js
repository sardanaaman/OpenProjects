var Feed = require("../models/feed.js")
var User = require("../models/user.js")
var mailHandler = require("./mailhandler")
var siteurl = require("../config/server.conf").siteurl

var ejs = require('ejs')
  , fs = require('fs')
  , str = fs.readFileSync(__dirname + '/templates/html.ejs', 'utf8'); 


var skillnotifier = function (idea){
    User.find({'$and':[{'skills':{'$in':idea.skills}},{'astatus.freetowork':true},{'astatus.subscribed':true},{'username':{'$ne':idea.owner}}]},function(err,users){
        if (err){
            console.log(err)
        }
        else if (users){
            for(var i=0;i<users.length;i++){
                var title = idea.title + ' | Open Projects'
                var message = idea.title + ' needs your skills.'
                var notification = {
                    timestamp: Date(),
                    message:title,
                    link: siteurl+ 'ideapool?idea_id=' + idea._id
                }
                
                var content = {
                    name: users[i].name.first+" "+users[i].name.last,
                    message: message,
                    button:"View Idea",
                    siteurl: siteurl,
                    link: siteurl+ 'ideapool?idea_id=' + idea._id
                }  
                var messageHtml = ejs.render(str, content);
                
                
                users[i].notifications.push(notification)
                mailHandler.sendMail(users[i].email,title,messageHtml)
                users[i].save(function(err){
                    if (err){
                        console.log(err)
                    }
                })
            }

        }
    })
}


var feeder = function (idea,type){
    var feed = new Feed()
    if (type==1){
        feed.message= idea.owner+ ' just proposed ' + idea.title
        feed.ftype=1
    }
    else if(type==3){
        feed.message= idea.owner+ ' just edited ' + idea.title
        feed.ftype=3
    }
    else {
        feed.message= idea.owner+ ' just deleted ' + idea.title
        feed.ftype=2
    }
    feed.timestamp = Date()
    feed.link = siteurl+'ideapool?idea_id='+idea._id
    feed.save(function(err){
        if (err){
            console.log(err)
        }
    })
}
module.exports.feeder = feeder
module.exports.ideastatusupdate = function(idea){
    var recepients = []
    var message = ''
    if(idea.astatus=="Approved"){
        recepients=[idea.owner,]
        skillnotifier(idea)
        feeder(idea,1)
    }
    else if(idea.astatus=='Inprogress'){
        recepients = idea.interested.concat(idea.owner)
    }
    else if(idea.astatus=='Completed'||idea.astatus=='Terminated'){
        recepients = idea.participants.concat(idea.owner)
    }
    else if (idea.astatus=='Denied'){
        recepients = idea.interested.concat(idea.owner)
    }
    else if(idea.astatus=='Rejected'){
        recepients = [idea.owner,]
    }
    else if(idea.astatus=='Deleted'){
        recepients = idea.participants.concat(idea.owner).concat(idea.interested)
    }
    else{
        console.log('Error?')
    }
    console.log(recepients)
    User.find({"$and":[{"username":{"$in": recepients}},{"astatus.subscribed":true}]},function(err,users){
        if(err){
            console.log(err)
        }
        else if(users){
            for (var i=0;i<users.length;i++){
                var message = idea.title + ' was just '+ idea.astatus + '. Click on the button to go to your dashboard'
                var content = {
                    name: users[i].name.first+" "+users[i].name.last,
                    message: message,
                    button:"Dashboard",
                    siteurl: siteurl,
                    link: siteurl+'dashboard'
                }  
                var messageHtml = ejs.render(str, content);
                mailHandler.sendMail(users[i].email,idea.title +" | OpenProjects",messageHtml)
            }                    
        }
    })
}
