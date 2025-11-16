import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { AdminService } from './admin.service';

const createAdmin = catchAsync(async (req: Request, res: Response) => {
    const payload = req.body;
    const result = await AdminService.createAdminToDB(payload);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Admin created Successfully',
        data: result
    });
});

const deleteAdmin = catchAsync(async (req: Request, res: Response) => {
    const payload = req.params.id;
    const result = await AdminService.deleteAdminFromDB(payload);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Admin Deleted Successfully',
        data: result
    });

});

const getAdmin = catchAsync(async (req: Request, res: Response) => {

    const result = await AdminService.getAdminFromDB();
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Admin Retrieved Successfully',
        data: result
    });

});


const retrievedHomeSummary = catchAsync(async (req: Request, res: Response) => {

    const result = await AdminService.summaryFromDB();
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Home Summary Retrieved Successfully',
        data: result
    });
});

const retrievedSubscriptionStatistic = catchAsync(async (req: Request, res: Response) => {

    const result = await AdminService.subscriptionStatisticFromDB();
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Subscriptions Statistic Retrieved Successfully',
        data: result
    });
});

const retrievedUserStatistics = catchAsync(async (req: Request, res: Response) => {

    const result = await AdminService.userStatisticsFromDB();
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Users Statistic Retrieved Successfully',
        data: result
    });
});

const retrievedRevenueStatistics = catchAsync(async (req: Request, res: Response) => {

    const result = await AdminService.revenueStatisticsFromDB();
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Users Statistic Retrieved Successfully',
        data: result
    });
});

export const AdminController = {
    deleteAdmin,
    createAdmin,
    getAdmin,
    retrievedHomeSummary,
    retrievedSubscriptionStatistic,
    retrievedUserStatistics,
    retrievedRevenueStatistics
};