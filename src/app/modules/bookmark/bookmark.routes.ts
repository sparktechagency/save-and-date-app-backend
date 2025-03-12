import express from "express";
import { BookmarkController } from "./bookmark.controller";
import auth from "../../middlewares/auth";
import { USER_ROLES } from "../../../enums/user";

const router = express.Router();

router.route('/')
    .post(
        async(req, res, next) => {
            try {
                req.body = {
                    customer: req.user.id,
                    package: req.body.package
                };
                next();
            } catch (error) {
                res.status(400).json({ message: "Failed to add bookmark" });
            }
        }, 
        auth(USER_ROLES.CUSTOMER), BookmarkController.toggleBookmark
    )
    .get(
        auth(USER_ROLES.CUSTOMER),
        BookmarkController.getBookmark
    );

export const BookmarkRoutes = router;
