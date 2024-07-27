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
            default:'https://img.freepik.com/free-psd/3d-illustration-human-avatar-profile_23-2150671122.jpg?w=740&t=st=1721184899~exp=1721185499~hmac=a805f765263516925023c5ed82ae86fd5b8f2ddad360d7c01d9a8ffe782af242'
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