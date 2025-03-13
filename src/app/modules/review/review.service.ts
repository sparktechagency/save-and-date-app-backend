import mongoose from "mongoose";
import { IReview } from "./review.interface";
import { Review } from "./review.model";
import { StatusCodes } from "http-status-codes";
import { User } from "../user/user.model";
import ApiError from "../../../errors/ApiErrors";

const createReviewToDB = async (payload: IReview): Promise<IReview> => {

    const user: any = await User.findById(payload.vendor);
    if (!user) {
        throw new ApiError(StatusCodes.NOT_FOUND, "No User Found");
    }

    const result = await Review.create(payload);
    if (!result) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Failed To create Review")
    }
    return payload;
};


export const ReviewService = { createReviewToDB }