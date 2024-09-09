import mongoose from 'mongoose';

const connectToTheDatabase = async () => {

    const MONGO_PATH = process.env.MONGO_PATH!;
    console.log("MongoDB status:", mongoose.connection.readyState);

    if ([1, 2].includes(mongoose.connection.readyState) == false) {
        await mongoose.connect(MONGO_PATH)
            .then((res: any) => console.log('Connected to MongoDB'))
            .catch((err: any) => console.log(err));
    }
}

export default connectToTheDatabase;