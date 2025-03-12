import { model, Schema } from "mongoose";
import { IPackage, PackageModel } from "./package.interface";

const packageSchema = new Schema<IPackage, PackageModel>(
    {
        vendor: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        category: {
            type: Schema.Types.ObjectId,
            ref: "Category",
            required: true,
        },
        location: {
            type: String,
            required: true,
        },
        city: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            required: true,
        },
        about: {
            type: String,
            required: true,
        },
        capacity: {
            type: Number,
            required: true,
        },
        outdoor: {
            type: Number,
        },
        indoor: {
            type: Number,
        },
        status: {
            type: String,
            enum: ['Active', 'Delete'],
            default: 'Active',
        },
    },
    {
        timestamps: true,
    }
);

export const Package: PackageModel = model<IPackage, PackageModel>('Package', packageSchema);
