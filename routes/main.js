var router = require('express').Router()
var ideaHandler = require('../core/ideahandler.js')
var dashHandler = require('../core/dashhandler.js')
var profileHandler = require('../core/profilehandler')
var feedbackreq = require("../core/feedbackreq")
var adminHandler = require("../core/adminhandler.js")
var accessHandler = require('../core/accesshandler.js')
var siteurl = require("../config/server.conf").siteurl

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  req.session.error = 'Please sign in!';
  res.redirect('/');
}

function isAdmin (req,res,next) {
    if(req.user.astatus.admin==true){
        next()
    }
    else{
        res.status(401).end('Unauthorized')
    }
}

function ensureNotAuthenticated(req, res, next) {
  if (!req.isAuthenticated()) { return next(); }
  res.redirect('dashboard');
}

module.exports=function(passport){
    router.get('/',ensureNotAuthenticated,function(req, res) {
        res.render('login',{message: req.flash('error')})
    })
    
    router.get('/signup',ensureNotAuthenticated,function(req, res) {
        if (req.flash('emailv')=='no'){
            res.render('login',{message:req.flash('error')})
        }
        if (req.flash('accesscode').length>1){
            res.render('signup',{accesscode:req.flash('accesscode'),message:req.flash('error')})
        }
        else{
            res.render('access',{message: req.flash('error')})
        }
    })
    
    router.get('/newidea',ensureAuthenticated,function(req, res) {
        res.render('new',{'profilepicurl':(siteurl+'avatar?id='+req.user.profilepic),name:req.user.name.first+' '+req.user.name.last,'notifications':req.user.notifications})
    })
    
    router.get('/ideapool',ensureAuthenticated,ideaHandler.pool)

    router.get('/editidea',ensureAuthenticated,profileHandler.listIdeas)
    
    router.get('/logout',ensureAuthenticated,function(req, res) {
        req.logout()
        res.redirect('/')
    })
    
    router.get('/admin',ensureAuthenticated,isAdmin,adminHandler.dashboard)
    
    router.get('/admin/accessgen',ensureAuthenticated,isAdmin,accessHandler.addcodes)
    
    router.get('/admin/viewcodes',ensureAuthenticated,isAdmin,accessHandler.viewcodes)
    
    router.get('/profile',ensureAuthenticated,profileHandler.loadstats)

    router.get('/dashboard',ensureAuthenticated,dashHandler)
    
    router.get('/setfree',ensureAuthenticated,profileHandler.setfree)
    
    router.get('/delidea',ensureAuthenticated,ideaHandler.deleteidea)
    
    router.get('/modifyidea',ensureAuthenticated,ideaHandler.loadeditidea)
    
    router.get('/verify',profileHandler.verify)
    
    router.post('/feedback',ensureAuthenticated,feedbackreq.postFeedback)
    
    router.post('/requestbeta',feedbackreq.reqbeta)
    
    router.post('/modifyidea',ensureAuthenticated,ideaHandler.editidea)
    
    router.post('/review',ensureAuthenticated,ideaHandler.reviewidea)
    
    router.post('/access',ensureNotAuthenticated,function(req,res) {
        accessHandler.checkcode(req.body.accesscode,function (valid) {
            if (valid){
                res.render('signup',{accesscode:req.body.accesscode,message:'Code Accepted! Proceed with signup'})
            }
            else{
                res.render('access',{message:'Invalid Access Code'})
            }
        })
    })
    
    router.post('/login',ensureNotAuthenticated,passport.authenticate('local-login',{failureRedirect: '/', failureFlash: true}),function(req,res){
        res.redirect('dashboard')
    })
    
    router.post('/signup',ensureNotAuthenticated,passport.authenticate('local-signup',{failureRedirect: '/signup',failureFlash: true}),function(req,res){
        res.redirect('/login')
    })
    
    router.post('/newidea',ensureAuthenticated,ideaHandler.addidea)
    
    router.post('/editidea',ensureAuthenticated,ideaHandler.editidea)
    
    router.post('/updateskills',ensureAuthenticated,profileHandler.updateskills)
    
    router.post('/admin/ideacontrol',ensureAuthenticated,isAdmin,adminHandler.ideacontrol)
    
    router.get('/adminideaview',ensureAuthenticated,isAdmin,adminHandler.ideaview)   
    
    router.get('/validuser',profileHandler.validuser)
    
    return router
}