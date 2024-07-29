const mongoose = require('mongoose');


module.exports.connectDB =  async ()=> {
    try {
        await mongoose.connect(`${process.env.MONG_ATLS}`)
        console.log(`MongoDB connected `);
    }catch(e) {
        console.error('Mongoose connection ERROR: ' + e.message)
    }
}