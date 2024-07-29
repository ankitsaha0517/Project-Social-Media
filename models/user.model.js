const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');
const userSchema = new Schema({
    username:{
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    fullname:{
        type: String,
        required: true,
    },
    avater:{
        url:{
            type: String,
            default:'https://cdn.pixabay.com/photo/2018/11/13/21/43/avatar-3814049_1280.png'
        },
        filename:{
            type: String,
        }
    },
    bio:{
        type: String,
    },
    posts:[{
        type: Schema.Types.ObjectId,
        ref: 'Post'
    }],
    followers:[{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    following:[{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
})

userSchema.plugin(passportLocalMongoose);
const User = mongoose.model('User', userSchema);
module.exports = User