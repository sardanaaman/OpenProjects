var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');
var accesscode=require('../config/server.conf').accesscode
var crypto = require('crypto');
var mailHandler = require("./mailhandler")
var siteurl = require("../config/server.conf").siteurl
var accessHandler = require("./accesshandler")
var path = require('path')

var ejs = require('ejs')
  , fs = require('fs')
  , str = fs.readFileSync(__dirname + '/templates/html.ejs', 'utf8'); 

function randomValueHex (len) {
    return crypto.randomBytes(Math.ceil(len/2))
        .toString('hex') // convert to hexadecimal format
        .slice(0,len);   // return required number of characters
}

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

passport.use('local-login', new LocalStrategy(
    {passReqToCallback: true},
    function(req,username, password, done) {
        User.findOne({"$or":[{'email': username},{'username':username}]}, function (err, user) {
          if (err) { return done(err); }
          if (!user) {
              console.log(user)
            return done(null, false, { message: 'Invalid Email and Password combination' });
          }
          else if (!user.comparePassword(password)) {
            return done(null, false, { message: 'Invalid Email and Password combination' });
          }
          else if(!user.astatus.verified){
            return done(null, false, { message: 'Please verify your email address' });
          }
          else if(user.astatus.locked){
            return done(null, false, { message: 'Your account has been locked' });
          }
          else{
            return done(null, user);
          }
        });
    }
));

passport.use('local-signup', new LocalStrategy(
    {passReqToCallback: true},
    function(req,username, password, done) {
        accessHandler.checkcode(req.body.accesscode,function (valid){
            if (valid){
                User.findOne({"$or" :[{'email': req.body.email},{'username':req.body.username}]}, function (err, user) {
                    if (err) { 
                        return done(err); 
                    }
                    if (user){
                        if (user.email==req.body.email){
                            req.flash('accesscode',req.body.accesscode)
                            return done(null, false, {message: 'Email already in use'})
                        }
                        else{
                            req.flash('accesscode',req.body.accesscode)
                            return done(null, false, {message: 'Username already in use'})
                        }
                    }
                    if (!user) {
                        var vtoken = randomValueHex(24)
                        user = new User();
                        user.timestamp.created = new Date()
                        user.stats.rating= 0;
                        user.stats.applied= 0;
                        user.stats.assigned= 0;
                        user.stats.completed= 0;
                        user.name.first = req.body.firstname
                        user.name.last = req.body.lastname
                        user.email= req.body.email
                        user.setPassword(req.body.password)
                        user.username = req.body.username
                        user.profilepic = req.body.profilepic
                        user.vtoken= vtoken
                        req.flash('emailv','no')
                        if(req.body.linkedin){
                            user.external.linkedin = req.body.linkedin
                        }
                        if(req.body.github){
                            user.external.github = req.body.github
                        }
                        user.save(function(err){
                            if (err){
                                console.log(err)
                            }
                            else{
                                accessHandler.setcodeemail(req.body.accesscode,req.body.email)
                                var content = {
                                    name: req.body.firstname+" "+req.body.lastname,
                                    message: "Please verify your email account",
                                    button:"Verify Email",
                                    siteurl: siteurl,
                                    link: siteurl+'verify?code='+vtoken
                                }  
                                
                                var messageHtml = ejs.render(str, content);
                                mailHandler.sendMail(req.body.email,"Verify your Email | OpenProjects",messageHtml)
                                
                            }
                        })
                    }
                
                return done(null, false, { message: 'Please verify your email address' });
                });         
            }
            else{
                return done(null, false, {message:'Error'})
            }
        })
        
    }
));

module.exports= passport