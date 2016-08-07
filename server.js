var express = require("express");
var mongoose = require("mongoose");
var session = require('express-session');
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')
var app = express();
var sconf = require("./config/server.conf");
var dbconf = require("./config/db.conf");
var passport = require("./core/passportinit");
var flash = require("connect-flash")
var multer = require("multer")

app.set('port', (process.env.PORT || 5000));

mongoose.connect(dbconf.url);
app.set('view engine', 'ejs');
app.use(flash())
app.use(express.static('public'));
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(session({
  secret: sconf.sessec,
  resave: false,
  saveUninitialized: true//,
  //cookie: { secure: true }
}))
app.use(passport.initialize());
app.use(passport.session());


var storage =   multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './uploads');
  },
  filename: function (req, file, callback) {
    var fname = file.fieldname + '-' + Date.now()
    req.flash('image',fname)
    callback(null, fname);
  }
});
var upload = multer(
  {
    storage : storage
}).single('avatar');

app.get('/avatar',function(req,res){
      res.sendFile(__dirname + "/uploads/"+ req.query.id);
});

app.post('/avatar/upload',function(req,res){
    console.log(req.headers)
    upload(req,res,function(err) {
        if(err) {
            return res.json({
                success: false,
                error: 'Upload failed!'
            });
        }
        else{
          var respo =req.flash('image')[0]
          res.send(respo)
        }
    });
});



app.use('/',require('./routes/main')(passport))

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
