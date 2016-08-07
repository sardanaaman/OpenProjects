var nodemailer = require('nodemailer');
var providerTransport = require('nodemailer-sendgrid-transport');
var emailconf = require("../config/email.conf")
 
var transport = nodemailer.createTransport(providerTransport({
  auth: {
    api_key: emailconf.apiKey
  }
}));

module.exports.sendMail = function (email,subject,message){
transport.sendMail({
  from: 'noreply@csivit.com',
  to: email,
  subject: subject,
  html: message
}, function(err, info) {
  if (err) {
    console.error(err);
  } else {
    console.log(info);
  }
});
}

 /*
transport.sendMail({
  from: 'sender@example.com',
  to: 'user@example.com',
  subject: 'Hello',
  html: '<p>How are you?</p>'
}, function(err, info) {
  if (err) {
    console.error(err);
  } else {
    console.log(info);
  }
});
*/