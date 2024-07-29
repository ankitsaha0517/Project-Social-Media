require('dotenv').config('')
const express = require('express');
const app = express();
const {connectDB} = require('./Db/index.js');
const path = require('path')
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const userRouter = require('./routers/user_router.js');
// utis file
const expressError = require('./utils/expressErrror.js');



connectDB() //mongodb CONNECT 


const store = MongoStore.create(
    {
        mongoUrl: process.env.MONG_ATLS,
        crypto:{
            secret: process.env.SECRET_KEY,
        },
        touchAfter: 2 * 3600,
    }
)
store.on('error',()=>{
    console.log("Error in MONGO SESSION STORW",error);
})
const seassionOpctions ={
    store,
    secret:process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: { 
        expires:new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        httpOnly: true,
        maxAge: 2 * 24 * 60 * 60 * 1000,

    }
}


app.use(express.json());// Middleware to parse JSON request bodies
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use((express.urlencoded({extended:true})));
app.use(session(seassionOpctions))

app.use(passport.initialize());
app.use(passport.session());

app.use((req,res,next)=>{
    res.locals.curruser = req.user;
    next();
})

app.use('/',userRouter)


app.all("*",(req,res,next) => {
    next(new expressError(404,"Page not found"))
})


app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).send(message);
});


app.listen(process.env.PORT, () => console.log('Server started on port 3000'));
