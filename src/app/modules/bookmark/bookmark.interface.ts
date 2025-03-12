import { Model, Types } from "mongoose";

export type IBookmark= {
    customer: Types.ObjectId,
    package: Types.ObjectId
}

export type BookmarkModel = Model<IBookmark>;