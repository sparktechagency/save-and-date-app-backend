import { StatusCodes } from "http-status-codes";
import ApiError from "../../../errors/ApiErrors";
import { IBookmark } from "./bookmark.interface";
import { Bookmark } from "./bookmark.model";
import { JwtPayload } from "jsonwebtoken";
import QueryBuilder from "../../../helpers/QueryBuilder";

const toggleBookmark = async (payload: IBookmark): Promise<string> => {

    // Check if the bookmark already exists
    const existingBookmark = await Bookmark.findOne({
        customer: payload.customer,
        package: payload.package
    });

    if (existingBookmark) {
        await Bookmark.findByIdAndDelete(existingBookmark._id);
        return "Bookmark Remove successfully";
    } else {
        const result = await Bookmark.create(payload);
        if (!result) {
            throw new ApiError(StatusCodes.EXPECTATION_FAILED, "Failed to add bookmark");
        }
        return "Bookmark Added successfully";
    }
};


const getBookmark = async (user: JwtPayload, query: Record<string, any>): Promise<{ bookmarks: IBookmark[], pagination: any }> => {

    const result = new QueryBuilder(Bookmark.find({customer: user.id}), query).paginate();
    const bookmarks = await result.queryModel.populate("package");
    const pagination = await result.getPaginationInfo();

    return {  bookmarks, pagination };
}

export const BookmarkService = { toggleBookmark, getBookmark }