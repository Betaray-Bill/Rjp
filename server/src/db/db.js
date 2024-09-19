import mongoose from "mongoose";

const connectDB = async() => {
    var uri = process.env.MONGO_URI
    try {
        await mongoose.connect(uri);
        console.log("asdA ", mongoose.connection.host, mongoose.connection.port)
    } catch (err) {
        console.log(err.message)
    }
}


export default connectDB