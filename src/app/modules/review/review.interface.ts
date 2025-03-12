import { Model, Types } from "mongoose";

export type IReview = {
    customer: Types.ObjectId;
    vendor: Types.ObjectId;
    package: Types.ObjectId;
    comment: string;
    rating: number;
}

export type ReviewModel = Model<IReview>;