import express, { NextFunction, Request, Response } from "express";
import auth from "../../middlewares/auth";
import { USER_ROLES } from "../../../enums/user";
import { ReservationController } from "./reservation.controller";
const router = express.Router();

router.route("/")
    .post(
        auth(USER_ROLES.CUSTOMER),
        async (req: Request, res: Response, next: NextFunction) => {
            try {

                req.body = { ...req.body, customer: req.user.id };
                next();

            } catch (error) {
                res.status(500).json({ message: "Failed to processed reservation" });
            }
        },
        ReservationController.createReservation
    )
    .get(
        auth(USER_ROLES.VENDOR),
        ReservationController.reservations
    );

router.route("/:id")
    .get(
        auth(USER_ROLES.VENDOR, USER_ROLES.VENDOR),
        ReservationController.reservationDetails
    )
    .patch(
        auth(USER_ROLES.VENDOR),
        ReservationController.approvedReservation
    );


export const ReservationRoutes = router;