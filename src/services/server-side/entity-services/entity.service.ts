import { Document, Model } from "mongoose";
import connectToTheDatabase from "../../../utils/mongo-connection";
import { Entity } from "../../../models/entities";

export class EntityService<E extends Entity, D extends Document> {
    protected dbModel: Model<D>;

    constructor(dbModel: Model<D>) {
        this.dbModel = dbModel;
    }

    protected async before() {
        await connectToTheDatabase();
    }

    async get(key: string, populate?: any): Promise<E> {
        try {
            await this.before();
            if (populate) {
                return this.dbModel.findById(key).populate(populate) as any;
            }
            return this.dbModel.findById(key) as any;
        } catch (e: any) {
            console.error("Error: get,", e);
            throw e;
        }
    }

    async create(data: any, populate?: any): Promise<E> {
        try {
            await this.before();
            if (populate) {
                return (await this.dbModel.create(data)).populate(populate) as any;
            }
            return (await this.dbModel.create(data)) as any;
        } catch (e: any) {
            console.error("Error: create,", e);
            throw e;
        }
    }

    async update(key: string, update: any, populate?: any): Promise<E | null> {
        try {
            await this.before();
            if (populate) {
                return this.dbModel.findByIdAndUpdate(key, update, { new: true }).populate(populate) as any;
            }
            return this.dbModel.findByIdAndUpdate(key, update, { new: true }) as any;
        } catch (e: any) {
            console.error("Error: update,", e);
            throw e;
        }
    }

    async delete(key: string): Promise<E | null> {
        try {
            await this.before();
            return this.dbModel.findByIdAndDelete(key);
        } catch (e: any) {
            console.error("Error: delete,", e);
            throw e;
        }
    }

    static getEntityKey(data: Entity): string {
        return data["_id"] as string
    }
}