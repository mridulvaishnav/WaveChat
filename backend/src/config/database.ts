import mongoose from 'mongoose';

export const connectDB = async () => {
    try{
        const mongoURI = process.env.MONGODB_URI;
        if (!mongoURI) {
            throw new Error('MONGODB_URI is not defined in environment variables');
        }

        await mongoose.connect(mongoURI);
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1) //exit process with failure
        //status code 1 means failure
        //status code 0 means success
        }
    }