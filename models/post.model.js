const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const postSchema = Schema({
    owner:{
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    likes:[
        {
            type: Schema.Types.ObjectId,
            ref: 'User',
        }
    ],
    caption:{
        type: String,
        required: true,
    },
    img:{
        url:{ type: String },
        filename:{ type: String },
    },
    date:{
        type: Date,
        default: Date.now,
    }
})

const Post = mongoose.model('Post',postSchema);
module.exports = Post;