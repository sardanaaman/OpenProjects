var mongoose =  require("mongoose");

module.exports = mongoose.model('Idea', {
    owner: String,
    title: String,
    sdesc: String,
    ldesc: String,
    timespan: String,
    skills:{type:[String],default:[]},
    timestamp:{
        created: Date,
        lastmodified: Date
    },
    platform: {
        android: {type:Boolean,default:false},
        web: {type:Boolean,default:false},
        ios: {type:Boolean,default:false},
        windows: {type:Boolean,default:false}
    },
    targetaudience: String,
    funding: {type:String, default:'None'},
    extresources:{type:[String],default:[]},
    pastexp: {type:String, default:'No'},
    competition:{type:String, default:'None'},
    interested:{type:[String],default:[]},
    notinterested: {type:[String],default:[]},
    participants:{type:[String],default:[]},
    reviews:{type:[{
        username: String,
        preflevel: String,
        content: String
    }],default:[]},
    astatus: String
});