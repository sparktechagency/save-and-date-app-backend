import { Model, Types } from "mongoose"

export type IReservation = {
    _id?: Types.ObjectId;
    customer: Types.ObjectId;
    vendor: Types.ObjectId;
    package: Types.ObjectId;
    status: "Pending" | "Accepted" | "Rejected" | "Canceled" | "Completed";
    paymentStatus: "Pending" | "Paid" | "Refunded";
    price: number;
    txid: string;
}

export type ReservationModel = Model<IReservation, Record<string, unknown>>;