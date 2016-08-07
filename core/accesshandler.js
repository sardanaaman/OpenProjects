var Accesscode = require("../models/access.js")
var crypto = require('crypto');

function randomValueHex (len) {
    return crypto.randomBytes(Math.ceil(len/2))
        .toString('hex') // convert to hexadecimal format
        .slice(0,len);   // return required number of characters
}

module.exports.checkcode = function (code,callback){
    Accesscode.findOne({"$and":[{'code':code},{'valid': true}]},function(err,accesscode){
        if(err){
            console.log(err)
            callback(false)
        }
        else if(accesscode){
            callback(true)
        }
        else{
            callback(false)
        }
    })
}

module.exports.setcodeemail = function (code,email) {
    Accesscode.findOne({code:code},function(err, accesscode) {
        if (err){
            console.log(err)
        }
        else if(accesscode){
            accesscode.valid=false
            accesscode.email=email
            accesscode.save()
        }
        else{
            console.log('error in accesscode')
        }
    })
}

module.exports.addcodes = function (req,res){
    if (parseInt(req.query.num)){
        for (var i=0;i<parseInt(req.query.num);i++){
            var accesscode = new Accesscode()
            accesscode.code =randomValueHex(10)
            accesscode.save()
        }
        res.end('Done')
    }
    res.end('error')
}

module.exports.viewcodes = function (req,res){
    Accesscode.aggregate({"$match": {'valid':true}},{"$project": { '_id': 0, 'code': 1}},function(err,accesscodes){
        if(err){
            console.log(err)
            res.end('Err')
        }
        else if (accesscodes){
            console.log(accesscodes)
            res.send(accesscodes)
        }
        else{
            res.end('no codes')
        }
    })
}


