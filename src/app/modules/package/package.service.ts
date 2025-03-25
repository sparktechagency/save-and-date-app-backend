import { StatusCodes } from "http-status-codes";
import ApiError from "../../../errors/ApiErrors";
import { IPackage } from "./package.interface";
import { Package } from "./package.model";
import unlinkFile from "../../../shared/unlinkFile";
import QueryBuilder from "../../../helpers/QueryBuilder";
import { JwtPayload } from "jsonwebtoken";
import { checkMongooseIDValidation } from "../../../shared/checkMongooseIDValidation";

const createPackageInDB = async (payload: IPackage): Promise<IPackage | null> => {

    const result = await Package.create(payload);
    if (!result) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to created Package")
    }
    return result;
}

const vendorPackagesFromDB = async (user: JwtPayload, query: Record<string, any>): Promise<{ packages: IPackage[], pagination: any }> => {
    const result = new QueryBuilder(Package.find({ vendor: user.id, status: "Active" }), query).paginate();
    const packages = await result.queryModel.populate("category").lean().exec();
    const pagination = await result.getPaginationInfo();

    return { packages, pagination };
}

const packagesFromDB = async (query: Record<string, any>): Promise<{ packages: IPackage[], pagination: any }> => {
    const result = new QueryBuilder(Package.find({status: "Active" }), query).paginate().filter().search(["name", "location", "city", "about"]);
    const packages = await result.queryModel.populate("category").populate("vendor").lean().exec();
    const pagination = await result.getPaginationInfo();

    return { packages, pagination };
}

const updatePackageToDB = async (id: string, payload: IPackage): Promise<IPackage | null> => {
    checkMongooseIDValidation(id);

    const result = await Package.findByIdAndUpdate(
        { _id: id },
        payload,
        { new: true }
    );

    if (payload.image && result?.image) {
        unlinkFile(result.image);
    }

    if (!result) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to updated Package")
    }

    return result;
}

const deletePackageToDB = async (id: string): Promise<IPackage | null> => {
    checkMongooseIDValidation(id);

    const result = await Package.findByIdAndUpdate(
        { _id: id },
        { status: "Delete" },
        { new: true }
    );

    if (!result) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to deleted Package")
    }

    return result;
}

const packageDetailsFromDB = async (id: string): Promise<IPackage | null> => {
    checkMongooseIDValidation(id);

    const result = await Package.findById(id).lean().exec();

    if (!result) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to get Package Details")
    }

    return result;
}

export const PackageService = {
    createPackageInDB,
    updatePackageToDB,
    vendorPackagesFromDB,
    packagesFromDB,
    deletePackageToDB,
    packageDetailsFromDB
}