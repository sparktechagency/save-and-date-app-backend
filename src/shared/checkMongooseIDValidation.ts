import mongoose from "mongoose"
import ApiError from "../errors/ApiErrors"
import { StatusCodes } from "http-status-codes"

export const checkMongooseIDValidation = (id: string): void => {
    if (!mongoose.isValidObjectId(id)) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid Chat Object ID");
    }
};