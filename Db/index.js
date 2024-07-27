const mongoose = require('mongoose');


module.exports.connectDB =  async ()=> {
    try {
        await mongoose.connect(`${process.env.MONGO_URI}/${process.env.MY_COLLECTION}`)
        console.log(`MongoDB connected `);
    }catch(e) {
        console.error('Mongoose connection ERROR: ' + e.message)
    }
}