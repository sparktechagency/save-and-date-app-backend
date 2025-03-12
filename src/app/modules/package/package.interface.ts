import { Model, Types } from "mongoose";

export type IPackage = {
    _id?: Types.ObjectId;
    vendor: Types.ObjectId;
    name: string;
    price: number;
    category: Types.ObjectId;
    location: string;
    city: string;
    image: string;
    about: string;
    capacity: number;
    outdoor?: number;
    indoor?: number;
    status: 'Active' | 'Delete'
}

export type PackageModel = Model<IPackage, Record<string, unknown>>; 