import { JwtPayload } from "jsonwebtoken";
import { IReservation } from "./reservation.interface";
import { Reservation } from "./reservation.model";
import { StatusCodes } from "http-status-codes";
import ApiError from "../../../errors/ApiErrors";
import mongoose, { FilterQuery } from "mongoose";
import { sendNotifications } from "../../../helpers/notificationsHelper";
import { Package } from "../package/package.model";
import QueryBuilder from "../../../helpers/QueryBuilder";

const createReservationToDB = async (payload: IReservation): Promise<IReservation> => {

    const session = await mongoose.startSession();
    session.startTransaction();

    const isExistPackage = await Package.findById(payload.package).lean();
    if (!isExistPackage) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Package not found');
    }

    payload.price = isExistPackage.price;
    payload.vendor = isExistPackage.vendor;

    try {
        const reservation = (await Reservation.create([payload], { session }))[0];
        if (!reservation) {
            throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to created Reservation ');
        }

        const data = {
            text: "Someone has submitted a reservation" as string,
            receiver: isExistPackage.vendor as mongoose.Types.ObjectId,
            referenceId: reservation._id as mongoose.Types.ObjectId,
            screen: "RESERVATION" as const
        }
        await sendNotifications(data, session);

        await session.commitTransaction();
        session.endSession();
        return reservation;
    } catch (error) {
        session.abortTransaction();
        session.endSession();
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to Process order');
    }
};

const reservationsFromDB = async (user: JwtPayload, query: FilterQuery<any>): Promise<{ reservations: IReservation[], pagination: any }> => {
    const result = new QueryBuilder(Reservation.find({ vendor: user.id }), query).paginate().filter();
    const reservations = await result.queryModel.populate("service");
    const pagination = await result.getPaginationInfo();
    return { reservations, pagination };
}

const reservationDetailsFromDB = async (id: string): Promise<IReservation> => {
    if (!mongoose.Types.ObjectId.isValid(id)) throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid Reservation ID');
    const reservation: IReservation | null = await Reservation.findById(id).lean();
    if (!reservation) throw new ApiError(StatusCodes.NOT_FOUND, 'Reservation not found');
    return reservation;
}

const approvedReservationInDB = async (id: string, status: string): Promise<IReservation> => {

    if (!mongoose.Types.ObjectId.isValid(id)) throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid Reservation ID');

    if (!status || !['Accepted', 'Rejected'].includes(status)) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid status');
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    const isExistReservation = await Reservation.findById(id).lean();
    if (!isExistReservation) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Reservation not found');
    }

    try {

        const updatedReservation = await Reservation.findOneAndUpdate(
            { _id: id },
            { $set: { status: status } },
            { new: true, session }
        );

        if (!updatedReservation) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Failed to update reservation');
        }

        const data = {
            text: "Your reservation has been " + status + "." as string,
            receiver: isExistReservation.customer as mongoose.Types.ObjectId,
            referenceId: isExistReservation._id as mongoose.Types.ObjectId,
            screen: "RESERVATION" as const
        }
        await sendNotifications(data, session);

        await session.commitTransaction();
        session.endSession();
        return updatedReservation;
    } catch (error) {
        session.abortTransaction();
        session.endSession();
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to Process order');
    }
}

export const ReservationService = {
    createReservationToDB,
    approvedReservationInDB,
    reservationDetailsFromDB,
    reservationsFromDB
}