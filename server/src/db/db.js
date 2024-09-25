import mongoose from "mongoose";

const connectDB = async() => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("Database Connected at :", mongoose.connection.host, mongoose.connection.port)
        console.log(3)
    } catch (err) {
        console.log(err.message)
    }
}


export default connectDB