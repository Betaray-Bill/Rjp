import mongoose from "mongoose";

const connectDB = async () => {
    try {
        console.log("DB IS ", process.env.MONGO_URI)
        console.log(1)
        await mongoose.connect(process.env.MONGO_URI, {
            // useNewUrlParser: true,
            // useUnifiedTopology: true,
            serverSelectionTimeoutMS: 30000, // Increase timeout to 30 seconds
        });
        console.log(2)
        console.log("Database Connected at :", mongoose.connection.host, mongoose.connection.port);
    } catch (err) {
        console.error("Database connection error:", err.message);
    }
};



export default connectDB