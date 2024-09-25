import mongoose from "mongoose";
import { MongoClient, ServerApiVersion } from "mongodb"

// const uri = process.env.MONGO_URI
// console.log(uri)

const client = new MongoClient('mongodb+srv://suryaorion12:f4DFFNMY4L9aDUv5@cluster0.fgff9.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});
const connectDB = async() => {
    // var uri = process.env.MONGO_URI
    // console.log(process.env.MONGO_URI)
    try {
        console.log(1)
            // await client.connect();
        console.log(2)

        // await client.db("admin").command({ ping: 1 });
        // console.log("Pinged your deployment. You successfully connected to MongoDB!");
        await mongoose.connect(process.env.MONGO_URI)
        console.log(2)

        console.log("Database Connected at :", mongoose.connection.host, mongoose.connection.port)
        console.log(3)
    } catch (err) {
        console.log(err.message)
    }
}


export default connectDB