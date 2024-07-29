const express = require('express')
const router = express.Router()
const LocalStrategy = require('passport-local');
const User = require('../models/user.model.js');
const Post = require('../models/post.model.js');

const passport = require('passport');
const wrapAsync = require('../utils/wrapAsync.js');
const {isLoging} = require('../middlewares/isLoging.js');
const multer  = require('multer')
const {storage,deleteImage} = require('../configs/cloudinary.confilg.js');
const upload = multer({storage})

const expressError = require('../utils/expressErrror.js');
const realTime = require('../utils/realTime.js');


passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

router.get('/', (req, res)=>{
    res.render('index',{footer:false});
})

router.post('/register',wrapAsync(async (req, res)=>{
    try{
        let{username,email,fullname,password} = req.body
        const  filnd = await User.findOne({username: username});  
        if(filnd){return next(new expressError(403,'User Already Exist'))}
        let newUser = new User({username, email, fullname});
        let registerUser = await User.register(newUser,password);
        req.login(registerUser, function(err){
            if(err){
                console.log("REGISTER USER ERROR: " + err.message);
                return res.redirect('/');
            }
            res.redirect('/profile');
        })
    }catch(err){
        console.log("REGISTER USER ERROR: " + err.message);
        res.redirect("/")
    }
}));

router.get('/login',async (req, res)=>{
    res.render('login',{footer:false});
})

router.post('/login', passport.authenticate('local', {
    successRedirect: '/profile',
    failureRedirect: '/login'
}));

router.get('/logout', function(req, res, next){
    req.logout(function(err) {
      if (err) { return next(err); }
      res.redirect('/login');
    });
});

router.get('/profile',isLoging,async(req, res)=>{
    let user = await User.findById(req.user._id).populate('posts');
    res.render('profile',{user, footer:true});
})
router.get('/edit',isLoging,(req, res)=>{
    res.render('edit',{user:req.user, footer:true});
});

router.post('/update',upload.single('profilePic'),wrapAsync(async (req,res,next)=>{
    let {username,fullname,bio} = req.body;
    const updatedUser = await User.findOneAndUpdate(
        {username: req.user.username},
        {username,fullname,bio},
        {new: true}
    );
    req.session.passport.user = updatedUser.username;
    if(req.file){
        if(updatedUser.avater.filename){deleteImage(updatedUser.avater.filename);}
        updatedUser.avater.url = req.file.path;
        updatedUser.avater.filename = req.file.filename;
        await updatedUser.save();
    }
    res.redirect('/profile');
}))

router.get('/feed',isLoging,wrapAsync(async(req, res)=>{
    let posts = await Post.find({}).populate('owner')
    const realTimes = posts.map(item => ({
        ...item.toObject(), 
        realTimes: realTime(item.date)
    }));
    res.render('feed', { footer: true, posts: realTimes});
}));
router.get('/upload',isLoging,(req, res)=>{
    res.render('upload',{footer:true});
})    

router.post('/upload',isLoging,upload.single('image'),wrapAsync(async(req, res,next)=>{
    try{
        let{caption} = req.body
        let newPost = new Post({caption});
        if(req.file){
            newPost.img.url = req.file.path
            newPost.img.filename = req.file.filename
        }
        newPost.owner = req.user;
        let newUser = await User.findById(req.user.id);
        newUser.posts.push(newPost);
        await newUser.save();
        await newPost.save();
        res.redirect('/feed');
    }catch(err){
        console.log('Error Saving  Post:' + err);
        deleteImage(req.file.filename)
        next( new expressError(404,err.message));
    }
}));


router.get('/search',isLoging,(req,res)=>{
    res.render('search',{footer:true});
})

router.get("/username/:name",isLoging,wrapAsync(async(req,res)=>{
    const regex = new RegExp(`^${req.params.name}`, 'i');
    const users =  await User.find({username: regex})
    res.json(users);
}));
router.get('/userprofile/:id',isLoging,wrapAsync(async(req,res)=>{
if(req.params.id == req.user._id){
    let user = await User.findById(req.params.id).populate('posts');
    return res.render('profile',{footer:true,user})
}
let user = await User.findById(req.params.id).populate('posts');
res.render('userprofile',{footer:true,user})

}));

router.get('/all/posts/:id',isLoging,wrapAsync(async(req,res)=>{
    let user = await User.findById(req.params.id).populate('posts');
    res.render('posts',{footer:true,user})

}))

router.get('/userprofile/follow/:id',isLoging,wrapAsync(async(req,res)=>{
let currUser = await User.findById(req.user._id);
let user = await User.findById(req.params.id).populate('posts');
user.followers.push(currUser._id);
currUser.following.push(user._id);
await currUser.save();
await user.save();
res.redirect(`/userprofile/${req.params.id}`);
}))
router.get('/userprofile/unfollow/:id',isLoging,wrapAsync(async(req,res)=>{
    let currUser = await User.findById(req.user._id);
    let user = await User.findById(req.params.id);
    user.followers = user.followers.filter(follower => follower.toString()!== currUser._id.toString());
    currUser.following = currUser.following.filter(following => following.toString()!== user._id.toString());
    await currUser.save();
    await user.save();
    res.redirect(`/userprofile/${req.params.id}`);
}))

router.get('/followers/:id',isLoging,wrapAsync(async(req,res)=>{
    let user = await User.findById(req.params.id).populate("followers");
    res.render('followers',{footer:true,user})
}))
router.get('/following/:id',isLoging,wrapAsync(async(req,res)=>{
    let user = await User.findById(req.params.id).populate("following");
    res.render('following',{footer:true,user})
}))
module.exports = router


