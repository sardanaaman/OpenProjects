var mongoose =  require("mongoose");
var bcrypt = require("bcryptjs")

var UserSchema = new mongoose.Schema({
    name:{
        first: String,
        last: String
    },
    stats:{
        rating: Number,
        applied: Number,
        assigned: Number,
        completed: Number,
    },
    email: String,
    username: String,
    password: String,
    external: {
        linkedin: {type:String, default: null},
        github: {type:String, default: null}
    },
    skills:{type:[String], default:[]},
    profilepic: {type:String, default: 'man.png'},
    astatus:{
        verified:{type: Boolean,default:false},
        locked:{type:Boolean, default:false},
        freetowork:{type:Boolean,default:true},
        subscribed:{type:Boolean,default:true},
        admin:{type:Boolean,default:false}
    },
    timestamp:{
        created: Date
    },
    notifications:[{
        timestamp: Date,
        message: String,
        link: String
    }],
    vtoken: String
})

UserSchema.methods.comparePassword = function(inputpw){
    return bcrypt.compareSync(inputpw, this.password)
}

UserSchema.methods.setPassword = function(inputpw,callback){
    this.password = bcrypt.hashSync(inputpw, 10)
}
module.exports = mongoose.model('User', UserSchema)
