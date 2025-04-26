const mongoose = require('mongoose');
const url = process.env.MONGO_URL;
const connectDB = mongoose.connect(url).then(()=>{
    console.log('mongo db started');
})

module.exports = connectDB;