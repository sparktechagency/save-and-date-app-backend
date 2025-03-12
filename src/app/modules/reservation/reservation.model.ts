import { Schema, model } from "mongoose";
import { IReservation, ReservationModel } from "./reservation.interface";
import { randomBytes } from "crypto";

const ReservationSchema = new Schema<IReservation, ReservationModel>(
    {
        customer: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        vendor: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        package: {
            type: Schema.Types.ObjectId,
            ref: "Package",
            required: true
        },
        status: {
            type: String,
            enum: ["Pending", "Accepted", "Rejected", "Canceled", "Completed"],
            default: "Pending"
        },
        paymentStatus: {
            type: String,
            enum: [ "Pending", "Paid", "Refunded"],
            default: "Pending"
        },
        price: {
            type: Number,
            required: true
        },
        txid: {
            type: String,
            unique: true,
            index: true
        }
    },
    { timestamps: true }
);


ReservationSchema.pre("save", async function (next) {
    const reservation = this;

    if (reservation.isNew && !reservation?.txid) {
        const prefix = "tx_";
        const uniqueId = randomBytes(8).toString("hex");
        reservation.txid = `${prefix}${uniqueId}`;
    }

    next();
});

export const Reservation = model<IReservation, ReservationModel>("Reservation", ReservationSchema);