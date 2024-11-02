import mongoose from 'mongoose';
import UserDBModel from '../models/db/user.model';
import BaseInterviewDBModel from '../models/db/base-interview.model';
import UserInterviewDBModel from '../models/db/user-interview.model';
import DialogueDBModel from '../models/db/dialogue.model';
import SubscriptionDBModel from '../models/db/subscription.model';
import SystemParameterDBModel from '../models/db/system-parameter.model';
import CategoryDBModel from '../models/db/category.model';
import UserFeedbackDBModel from '../models/db/interview-feedback.model';

const connectToTheDatabase = async () => {

    const MONGO_PATH = process.env.MONGO_PATH!;
    console.log("MongoDB status:", mongoose.connection.readyState);

    if ([1, 2].includes(mongoose.connection.readyState) == false) {
        await mongoose.connect(MONGO_PATH)
            .then((res: any) => console.log('Connected to MongoDB'))
            .catch((err: any) => console.log(err));

        // Loading schemas for registering
        [
            UserDBModel,
            BaseInterviewDBModel,
            UserInterviewDBModel,
            DialogueDBModel,
            SubscriptionDBModel,
            SystemParameterDBModel,
            CategoryDBModel,
            UserFeedbackDBModel
        ]
    }
}

export default connectToTheDatabase;