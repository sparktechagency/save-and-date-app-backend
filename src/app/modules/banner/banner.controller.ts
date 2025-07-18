import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { BannerService } from "./banner.service";
import sendResponse from "../../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";

const createBanner = catchAsync(async (req: Request, res: Response) => {

    const result = await BannerService.createBannerToDB(req.body);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Banner created successfully",
        data: result,
    });
});

const getAllBanner = catchAsync(async (req: Request, res: Response) => {

    const result = await BannerService.getAllBannerFromDB();

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Banner retrieved successfully",
        data: result,
    });
});

const updateBanner = catchAsync(async (req: Request, res: Response) => {

    const result = await BannerService.updateBannerToDB(req.params.id, req.body);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Banner updated successfully",
        data: result,
    });
});

const deleteBanner = catchAsync(async (req: Request, res: Response) => {
    const result = await BannerService.deleteBannerToDB(req.params.id);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Banner deleted successfully",
        data: result
    });
});

export const BannerController = {
    createBanner,
    getAllBanner,
    updateBanner,
    deleteBanner
}