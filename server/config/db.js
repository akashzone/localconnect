

const mongoose = require('mongoose');

const connectDB = async () =>{
    try{
        console.log("MONGO_URI :",process.env.MONGO_URI);
        const connection = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB connected Successfully.`);
    }catch(err){
        console.error('Error connecting to MongoDB:', err);
        process.exit(1);
    }
}

module.exports = connectDB;