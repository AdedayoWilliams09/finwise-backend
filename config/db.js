//purpose: mongodb connection with retry logic

import mongoose from 'mongoose';

const connectDB = async (retryCount = 0) => {
    const MAX_RETRIES = 5;
    const BASE_DELAY = 5000; // 5 seconds

    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000, // timeout after 5 secs
            socketTimeoutMS: 45000, // close sockets after 45secs of inactivity
        });

        console.log(`MongoDB Connected: ${conn.connection.host}`);
        return true;
    } catch (error) {
        console.error(`MongoDB connection error: ${error.message}`);

        if (retryCount < MAX_RETRIES) {
            const delay = BASE_DELAY * Math.pow(2, retryCount); // Exponential backoff
            console.log(`Retrying connection in ${delay / 1000} seconds... (Attempt ${retryCount + 1}/${MAX_RETRIES})`);

            await new Promise(resolve => setTimeout(resolve, delay));
            return connectDB(retryCount + 1);
        } else {
            console.error('Failed to connect to MongoDB after maximum retries. Exiting ...');
            process.exit(1); // Exit the process with failure
        }
    }
};

export default connectDB;