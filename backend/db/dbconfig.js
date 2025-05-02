import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const res = await mongoose.connect('mongodb+srv://av876777:av876777@cluster0.vf0ogjm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
        if (res) {
            console.log("MongoDB connected successfully");
        }else {
            console.log("MongoDB connection failed");
        }
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1); // Exit the process with failure
    }
}

export default connectDB;