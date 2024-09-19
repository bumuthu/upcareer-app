import UserDBModel, { UserDocument } from "../../../models/db/user.model";
import { egress } from "../../../models/egress";
import { UserModel } from "../../../models/entities";
import { UserStatus } from "../../../models/enum";
import { DataNotFoundError, ValidationError } from "../../../utils/exceptions";
import { EntityService } from "./entity.service";


export class UserService extends EntityService<UserModel, UserDocument> {
    constructor() {
        super(UserDBModel);
    }

    async getUserByEmail(email: string): Promise<UserModel | null> {
        await this.before();
        return await UserDBModel.findOne({ email });
    }

    async getUserByUserId(userId: string): Promise<UserModel> {
        await this.before();

        const user: UserModel | null = await UserDBModel.findOne({ _id: userId });
        if (!user) throw new DataNotFoundError("User not found in the system");

        return user;
    }

    async createNewUser(newUser: egress.SignUpInput): Promise<UserModel> {
        await this.before();

        const checkExistingUsersWIthEmail: UserModel | null = await UserDBModel.findOne({ email: newUser.email });
        if (checkExistingUsersWIthEmail != undefined && checkExistingUsersWIthEmail.providerUserId != '') {
            throw new ValidationError("User with the given email exists");
        }
        const userEntry: UserModel = await this.insertNewUser(newUser, checkExistingUsersWIthEmail);
        console.log("New User DB Response:", userEntry);
        return userEntry;
    }


    async insertNewUser(newUser: egress.SignUpInput, existingUser: UserModel | null): Promise<UserModel> {
        await this.before();

        let user: UserModel | null;
        const notification = {
            createdAt: Date.now(),
            title: `Welcome to UpCareer!`,
            description: `Welcome to UpCareer journey. You have recieved your free tier rewards.`,
            hasRead: false
        }
        if (!existingUser) {
            const newUserDB: UserModel = {
                name: newUser.name,
                email: newUser.email,
                status: UserStatus.INITIALIZED,
                providerUserId: '',
                notifications: [notification],
                createdAt: Date.now()
            };
            user = await this.create(newUserDB);
        } else {
            const userUpdate = {
                name: newUser.name,
                status: UserStatus.INITIALIZED,
                notifications: [...existingUser.notifications, notification],
                createdAt: Date.now()
            };
            user = await this.update(existingUser._id, userUpdate);
        }

        return user!;
    }
}