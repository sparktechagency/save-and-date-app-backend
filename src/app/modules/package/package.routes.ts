import express from "express";
import auth from "../../middlewares/auth";
import { USER_ROLES } from "../../../enums/user";
import { PackageController } from "./package.controller";
import validateRequest from "../../middlewares/validateRequest";
import fileUploadHandler from "../../middlewares/fileUploaderHandler";
import { packageZodValidationSchema } from "./package.validation";
import { getSingleFilePath } from "../../../shared/getFilePath";
const router = express.Router()

router.route("/")
    .post(
        auth(USER_ROLES.VENDOR), 
        fileUploadHandler(), 
        async(req, res, next) => {
            try {
                const {price, capacity, outdoor, indoor, ...otherPayload} = req.body;
                const image = getSingleFilePath(req.files, "image");

                req.body = {
                    image, 
                    vendor: req.user._id,
                    price: Number(price), 
                    capacity: Number(capacity), 
                    outdoor: outdoor ? Number(outdoor) : undefined, 
                    indoor: indoor ? Number(indoor) : undefined, 
                    ...otherPayload
                };
                next();
            } catch (error) {
                res.status(400).json({ message: "Failed to upload Package Image" });
            }
        }, 
        validateRequest(packageZodValidationSchema), 
        PackageController.createPackage
    )
    .get(
        auth(USER_ROLES.VENDOR), 
        PackageController.getPackage
    )

router.route("/:id")
    .patch(auth(USER_ROLES.VENDOR), PackageController.updatePackage)
    .delete(auth(USER_ROLES.VENDOR), PackageController.deletePackage)

export const PackageRoutes = router;